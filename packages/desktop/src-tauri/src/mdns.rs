// Annonce mDNS / DNS-SD du pont (bonus auto-découverte). Le desktop publie un
// service `_scmfd._tcp.local.` sur le port WS ; la tablette le découvre et se
// connecte sans QR ni saisie. BEST-EFFORT : tout échec est loggé sans bloquer le
// démarrage, et le QR / la saisie manuelle restent le secours.
//
// Crate : mdns-sd (multiplateforme, Windows OK, sans runtime async).

use crate::server::{self, WS_PORT};
use mdns_sd::{ServiceDaemon, ServiceInfo};
use std::sync::OnceLock;

const SERVICE_TYPE: &str = "_scmfd._tcp.local.";
const INSTANCE_NAME: &str = "SC MFD Bridge";
const HOST_NAME: &str = "scmfd-desktop.local.";

// Daemon + nom complet retenus pour pouvoir désenregistrer à la fermeture.
static DAEMON: OnceLock<ServiceDaemon> = OnceLock::new();
static FULLNAME: OnceLock<String> = OnceLock::new();

/// Publie le service sur le LAN. Ne panique/bloque jamais : en cas d'échec
/// (interface, réseau…), on log et on continue — l'app marche sans mDNS.
pub fn start() {
    let ip = server::local_ip_string();
    if ip == "0.0.0.0" {
        eprintln!("[mdns] IP LAN indéterminée — annonce ignorée (QR/manuel restent dispo).");
        return;
    }

    let daemon = match ServiceDaemon::new() {
        Ok(d) => d,
        Err(e) => {
            eprintln!("[mdns] démon non démarré: {e} (non bloquant).");
            return;
        }
    };

    // TXT optionnel : chemin du WS (le port est déjà dans l'enregistrement SRV).
    let props = [("path", "/")];
    let info = match ServiceInfo::new(
        SERVICE_TYPE,
        INSTANCE_NAME,
        HOST_NAME,
        ip.as_str(),
        WS_PORT,
        &props[..],
    ) {
        Ok(i) => i,
        Err(e) => {
            eprintln!("[mdns] info service invalide: {e} (non bloquant).");
            return;
        }
    };

    let fullname = info.get_fullname().to_string();
    match daemon.register(info) {
        Ok(()) => {
            eprintln!("[mdns] service publié: {fullname} → {ip}:{WS_PORT}");
            let _ = DAEMON.set(daemon);
            let _ = FULLNAME.set(fullname);
        }
        Err(e) => eprintln!("[mdns] enregistrement échoué: {e} (non bloquant)."),
    }
}

/// Désenregistre proprement le service (envoie un « goodbye » sur le LAN).
/// Appelée sur les chemins de fermeture réelle de l'app. Best-effort.
pub fn stop() {
    if let (Some(daemon), Some(fullname)) = (DAEMON.get(), FULLNAME.get()) {
        let _ = daemon.unregister(fullname);
    }
}
