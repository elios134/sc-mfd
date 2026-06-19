// Mapping dynamique action→touche RÉELLE du joueur (chantier C3a).
//
// Construit côté frontend (profileReader, C2) à partir du profil joueur + défaut,
// puis transmis ici via la commande `set_dynamic_binds`. C'est la source PRIMAIRE
// de l'émulation ; si une entrée n'est pas émulable (action « à assigner », ou si
// le mapping n'est pas chargé), l'émulation retombe sur le keymap figé.
//
// État partagé entre le thread de commande Tauri et le thread du serveur WS via
// un OnceLock<Mutex<…>>. PAS de cache disque : reconstruit à chaque démarrage /
// rafraîchissement (le joueur peut changer ses touches entre deux lancements).

use serde::Deserialize;
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

/// Bind reçu du frontend (miroir des champs utiles de ResolvedBind).
#[derive(Debug, Clone, Deserialize)]
pub struct DynBind {
    pub id: String,
    /// Touche principale ("u", "insert", "f6"…) ; None si non mappé clavier.
    pub key: Option<String>,
    #[serde(default)]
    pub modifiers: Vec<String>,
    /// "press" | "long" | "hold".
    pub activation: String,
    /// "joueur" | "défaut" | "à assigner".
    pub source: String,
    /// false = à assigner / format non émulable au clavier (ex molette).
    pub emulable: bool,
    /// Input brut (ex "kb1_insert") — reçu pour traçabilité, pas encore lu côté Rust.
    #[allow(dead_code)]
    #[serde(default)]
    pub raw: Option<String>,
}

static MAP: OnceLock<Mutex<HashMap<String, DynBind>>> = OnceLock::new();

fn cell() -> &'static Mutex<HashMap<String, DynBind>> {
    MAP.get_or_init(|| Mutex::new(HashMap::new()))
}

/// Remplace TOUT le mapping (rafraîchissement complet). Renvoie le nombre d'entrées.
pub fn set_all(binds: Vec<DynBind>) -> usize {
    let mut m = cell().lock().unwrap();
    m.clear();
    for b in binds {
        m.insert(b.id.clone(), b);
    }
    m.len()
}

/// true si un mapping a été chargé (au moins une entrée).
pub fn is_loaded() -> bool {
    cell().lock().unwrap().len() > 0
}

/// Récupère le bind d'une action (clone, verrou relâché aussitôt).
pub fn get(action_id: &str) -> Option<DynBind> {
    cell().lock().unwrap().get(action_id).cloned()
}
