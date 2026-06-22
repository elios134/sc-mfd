// Desktop = pont tablette ↔ jeu. Démarre un serveur WebSocket LAN (module server)
// qui reçoit les CommandMessage et les transmet au frontend via events Tauri.
// AUCUNE émulation de touches ici (chantier séparé).

mod dynmap;
mod input;
mod keybind_source;
mod keymap;
mod mdns;
mod sc_detect;
mod server;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

/// État partagé du toggle « Réduire dans la barre des tâches ». Lu FRAIS au
/// moment de la fermeture (CloseRequested) pour décider cacher vs quitter.
/// Défaut `true` (= comportement par défaut de l'UI). Le frontend le resynchronise
/// au démarrage et à chaque bascule via `set_minimize_to_tray`.
struct MinimizeToTray(Arc<AtomicBool>);

/// Transmet l'état du toggle au Rust (source de vérité au moment du close).
#[tauri::command]
fn set_minimize_to_tray(state: tauri::State<'_, MinimizeToTray>, enabled: bool) {
    state.0.store(enabled, Ordering::Relaxed);
}

/// Réaffiche et remet au premier plan la fenêtre principale (depuis le tray).
fn show_main_window(app: &tauri::AppHandle) {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

/// Exposée au frontend : IP LAN détectée + port + URL ws complète.
#[tauri::command]
fn get_server_info() -> server::ServerInfo {
    server::server_info()
}

/// Reçoit le mapping dynamique action→touche (construit par le frontend depuis
/// le profil joueur + défaut) et le rend disponible à l'émulation. Renvoie le
/// nombre de binds chargés. Rejouable : remplace tout (rafraîchissement).
#[tauri::command]
fn set_dynamic_binds(binds: Vec<dynmap::DynBind>) -> usize {
    dynmap::set_all(binds)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // Sélecteur de dossier natif (bouton « Changer » du chemin SC).
        .plugin(tauri_plugin_dialog::init());

    // Autostart (démarrer avec Windows) — desktop uniquement. Le toggle frontend
    // appelle directement l'API JS du plugin (enable/disable/isEnabled) ; aucune
    // commande Rust custom n'est nécessaire.
    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_autostart::Builder::new().build())
            // Mises à jour automatiques (vérifie la Release GitHub au lancement).
            .plugin(tauri_plugin_updater::Builder::new().build())
            // Redémarrage après installation d'une mise à jour.
            .plugin(tauri_plugin_process::init());
    }

    builder
        .manage(MinimizeToTray(Arc::new(AtomicBool::new(true))))
        .invoke_handler(tauri::generate_handler![
            get_server_info,
            set_dynamic_binds,
            set_minimize_to_tray,
            sc_detect::detect_sc_install,
            sc_detect::set_sc_override,
            sc_detect::clear_sc_override,
            sc_detect::get_sc_override,
            keybind_source::read_keybind_sources,
            keybind_source::write_control_profile
        ])
        // Interception de la fermeture (bouton X custom → win.close() → CloseRequested).
        // Si « réduire dans le tray » est actif : on empêche la fermeture et on cache
        // la fenêtre (le serveur WS, sur son thread dédié, continue de tourner).
        // Sinon : on laisse la fenêtre se fermer → l'app quitte.
        .on_window_event(|window, event| {
            use tauri::Manager;
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let minimize = window.state::<MinimizeToTray>();
                if minimize.0.load(Ordering::Relaxed) {
                    api.prevent_close();
                    let _ = window.hide();
                } else {
                    // Fermeture réelle : retire l'annonce mDNS du LAN (best-effort).
                    mdns::stop();
                }
            }
        })
        .setup(|app| {
            use tauri::menu::{Menu, MenuItem};
            use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
            use tauri::Manager;

            // Fixe l'emplacement du fichier d'override SC dans le dossier de config
            // de l'app, AVANT tout appel à resolve_sc_install (détection au boot).
            if let Ok(dir) = app.path().app_config_dir() {
                let _ = std::fs::create_dir_all(&dir);
                sc_detect::set_override_file(dir.join("sc_path_override.txt"));
            }

            // ── System tray : icône près de l'horloge + menu Afficher / Quitter ──
            let show_item = MenuItem::with_id(app, "show", "Afficher", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let mut tray = TrayIconBuilder::with_id("main-tray")
                .tooltip("SC MFD Bridge")
                .menu(&tray_menu)
                // Clic gauche = restaurer la fenêtre (pas le menu) ; menu au clic droit.
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main_window(app),
                    // « Quitter » : ferme vraiment, même en mode tray (bypass prevent_close).
                    "quit" => {
                        mdns::stop(); // retire l'annonce mDNS avant de quitter
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(tray.app_handle());
                    }
                });
            // Réutilise l'icône de l'app pour le tray (présente via tauri.conf bundle).
            if let Some(icon) = app.default_window_icon() {
                tray = tray.icon(icon.clone());
            }
            tray.build(app)?;

            server::start(app.handle().clone());
            // Annonce mDNS (bonus auto-découverte) — best-effort, ne bloque pas.
            mdns::start();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
