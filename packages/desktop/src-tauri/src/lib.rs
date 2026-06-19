// Desktop = pont tablette ↔ jeu. Démarre un serveur WebSocket LAN (module server)
// qui reçoit les CommandMessage et les transmet au frontend via events Tauri.
// AUCUNE émulation de touches ici (chantier séparé).

mod dynmap;
mod input;
mod keybind_source;
mod keymap;
mod sc_detect;
mod server;

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
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_server_info,
            set_dynamic_binds,
            sc_detect::detect_sc_install,
            keybind_source::read_keybind_sources,
            keybind_source::write_control_profile
        ])
        .setup(|app| {
            server::start(app.handle().clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
