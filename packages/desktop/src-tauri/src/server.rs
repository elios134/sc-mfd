// Serveur WebSocket LAN : reçoit les CommandMessage de la tablette et les
// transmet au frontend desktop via des events Tauri. AUCUNE émulation de touche
// à cette étape — on ne fait que recevoir et afficher.
//
// Le format de message est le contrat de @sc-mfd/shared (protocol.ts) :
//     CommandMessage { type: "command", actionId: string }
// On ne peut pas importer le TS dans du Rust : on en MIROITE ici la forme JSON
// (le frontend desktop, lui, importe bien les types depuis @sc-mfd/shared).

use std::net::IpAddr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::accept_async;

/// Port fixe d'écoute LAN.
pub const WS_PORT: u16 = 8420;

/// Miroir Rust du `ClientMessage` de shared (union discriminée par `type`).
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
enum ClientMessage {
    #[serde(rename = "command")]
    Command {
        #[serde(rename = "actionId")]
        action_id: String,
    },
}

/// Infos serveur exposées au frontend via la commande `get_server_info`.
#[derive(Debug, Clone, Serialize)]
pub struct ServerInfo {
    pub ip: String,
    pub port: u16,
    pub ws_url: String,
    pub listening: bool,
}

/// Payload de l'event `command-received`.
#[derive(Clone, Serialize)]
struct CommandEvent {
    client_id: u64,
    action_id: String,
    /// false = action "to_assign" ou actionId inconnu : rien n'a été émulé.
    assigned: bool,
    /// Libellé de la touche émulée (ex "U", "Alt + N"), si émulation réussie.
    key_label: Option<String>,
    /// Message d'erreur (actionId inconnu, touche non mappée, échec SendInput).
    error: Option<String>,
    /// Source du bind utilisé : "profil joueur" / "défaut (jeu)" / "keymap figé".
    source: String,
}

/// Émule une touche selon son activation. Retourne (assigned, key_label, error).
///
/// async : une action en activation "long" doit MAINTENIR la touche un court
/// délai (SC ignore l'appui court). L'attente se fait via `tokio::time::sleep`
/// (non bloquante) — surtout pas `std::thread::sleep`, qui figerait un worker
/// tokio et stallerait les autres connexions. Pendant l'attente, le worker est
/// rendu au runtime ; seules les commandes suivantes de CE client patientent.
async fn emulate_for(
    key: &str,
    modifiers: &[&str],
    activation: &str,
) -> (bool, Option<String>, Option<String>) {
    match activation {
        // Appui LONG (delayed_press / delayed_hold côté SC) : presser → attendre
        // → relâcher. Le libellé du journal signale l'appui long.
        "long" => match crate::input::press(key, modifiers) {
            Ok(label) => {
                tokio::time::sleep(std::time::Duration::from_millis(
                    crate::input::LONG_PRESS_HOLD_MS,
                ))
                .await;
                match crate::input::release(key, modifiers) {
                    Ok(()) => (true, Some(format!("{label} (appui long)")), None),
                    Err(e) => (true, None, Some(e)),
                }
            }
            Err(e) => (true, None, Some(e)),
        },
        // "hold" : aucune action de ce type dans la table actuelle. Défensif :
        // on la traite comme un appui simple et on le signale dans le journal.
        other => {
            if other == "hold" {
                eprintln!("[input] activation 'hold' non gérée — traitée comme appui simple");
            }
            match crate::input::emulate(key, modifiers) {
                Ok(label) => (true, Some(label), None),
                Err(e) => (true, None, Some(e)),
            }
        }
    }
}

/// Résout l'actionId puis émule la touche. Retourne (assigned, key_label, error,
/// source). PRIORITÉ : mapping dynamique (vraies touches du joueur, C2) ; FALLBACK :
/// keymap figé (si l'entrée dynamique n'est pas émulable ou si le mapping n'est
/// pas chargé — ex. fichiers SC introuvables).
async fn resolve_and_emulate(action_id: &str) -> (bool, Option<String>, Option<String>, String) {
    // 1) Mapping dynamique (source primaire).
    if crate::dynmap::is_loaded() {
        if let Some(b) = crate::dynmap::get(action_id) {
            // Vidée explicitement par l'utilisateur : ne RIEN émuler, sans repli.
            if b.cleared {
                return (false, None, None, "perso (vidé)".to_string());
            }
            if b.emulable {
                if let Some(key) = b.key.as_deref() {
                    let mods: Vec<&str> = b.modifiers.iter().map(|s| s.as_str()).collect();
                    let (a, l, e) = emulate_for(key, &mods, &b.activation).await;
                    let source = match b.source.as_str() {
                        "perso" => "perso (vous)",
                        "joueur" => "profil joueur",
                        _ => "défaut (jeu)",
                    }
                    .to_string();
                    return (a, l, e, source);
                }
            }
            // Entrée présente mais non émulable (à assigner / molette) → on tente
            // tout de même le keymap figé ci-dessous (couvre le cas « défaut SC
            // introuvable » où le dynamique n'a pas pu lire la touche).
        }
    }

    // 2) Fallback : keymap figé (miroir de shared).
    let Some(b) = crate::keymap::bind_for(action_id) else {
        return (
            false,
            None,
            Some(format!("actionId inconnu de shared: {action_id}")),
            "keymap figé".to_string(),
        );
    };
    // Action "to_assign" (bind null) : ne RIEN émuler, pas d'erreur.
    if !b.assigned {
        return (false, None, None, "keymap figé".to_string());
    }
    let (a, l, e) = emulate_for(b.key, b.modifiers, b.activation).await;
    (a, l, e, "keymap figé".to_string())
}

/// Payload des events `client-connected` / `client-disconnected`.
#[derive(Clone, Serialize)]
struct ClientEvent {
    client_id: u64,
    addr: String,
}

/// IP LAN du desktop (pas d'IP en dur). Repli "0.0.0.0" si indéterminée.
/// `pub` : réutilisée par l'annonce mDNS (même IP que le QR / ws_url).
pub fn local_ip_string() -> String {
    match local_ip_address::local_ip() {
        Ok(IpAddr::V4(v4)) => v4.to_string(),
        Ok(IpAddr::V6(v6)) => v6.to_string(),
        Err(_) => "0.0.0.0".to_string(),
    }
}

/// Construit les infos serveur (IP détectée + URL ws complète).
pub fn server_info() -> ServerInfo {
    let ip = local_ip_string();
    ServerInfo {
        ws_url: format!("ws://{ip}:{WS_PORT}"),
        ip,
        port: WS_PORT,
        listening: true,
    }
}

/// Démarre le serveur sur un thread dédié avec son propre runtime tokio,
/// indépendant de la boucle d'événements Tauri.
pub fn start(app: AppHandle) {
    std::thread::spawn(move || {
        let rt = match tokio::runtime::Builder::new_multi_thread()
            .enable_all()
            .build()
        {
            Ok(rt) => rt,
            Err(e) => {
                eprintln!("[ws] échec création runtime tokio: {e}");
                return;
            }
        };
        rt.block_on(async move {
            if let Err(e) = serve(app).await {
                eprintln!("[ws] serveur arrêté sur erreur: {e}");
            }
        });
    });
}

/// Boucle d'acceptation : une tâche par connexion.
async fn serve(app: AppHandle) -> std::io::Result<()> {
    let listener = TcpListener::bind(("0.0.0.0", WS_PORT)).await?;
    eprintln!("[ws] écoute sur 0.0.0.0:{WS_PORT}");
    let counter = Arc::new(AtomicU64::new(0));
    loop {
        let (stream, peer) = listener.accept().await?;
        let app = app.clone();
        let client_id = counter.fetch_add(1, Ordering::Relaxed);
        let addr = peer.to_string();
        tokio::spawn(async move {
            handle_conn(app, stream, client_id, addr).await;
        });
    }
}

/// Une connexion WS : handshake, puis lecture des messages texte (lecture seule).
async fn handle_conn(app: AppHandle, stream: TcpStream, client_id: u64, addr: String) {
    let mut ws = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("[ws] handshake échoué ({addr}): {e}");
            return;
        }
    };

    eprintln!("[ws] client #{client_id} connecté ({addr})");
    let _ = app.emit(
        "client-connected",
        ClientEvent {
            client_id,
            addr: addr.clone(),
        },
    );

    while let Some(msg) = ws.next().await {
        let msg = match msg {
            Ok(m) => m,
            Err(e) => {
                eprintln!("[ws] erreur lecture ({addr}): {e}");
                break;
            }
        };

        if msg.is_close() {
            break;
        }
        if !msg.is_text() {
            continue;
        }

        let Ok(txt) = msg.to_text() else { continue };
        match serde_json::from_str::<ClientMessage>(txt) {
            Ok(ClientMessage::Command { action_id }) => {
                let (assigned, key_label, error, source) = resolve_and_emulate(&action_id).await;
                eprintln!(
                    "[ws] command #{client_id} {action_id} -> assigned={assigned} key={key_label:?} src={source} err={error:?}"
                );
                let _ = app.emit(
                    "command-received",
                    CommandEvent {
                        client_id,
                        action_id,
                        assigned,
                        key_label,
                        error,
                        source,
                    },
                );
            }
            Err(e) => eprintln!("[ws] message JSON invalide ({addr}): {e} :: {txt}"),
        }
    }

    eprintln!("[ws] client #{client_id} déconnecté ({addr})");
    let _ = app.emit("client-disconnected", ClientEvent { client_id, addr });
}
