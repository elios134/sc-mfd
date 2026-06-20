// Détection du dossier d'installation de Star Citizen.
// Port (sous-ensemble std-only) de SC Fleet Manager V2 src-tauri/src/commands/patch_detect.rs.
// Sources reprises : (a) registre Windows via `reg query`, (b) chemins connus.
// Validation identique à V2 : un install valide possède Data.p4k à sa racine.
// AUCUNE écriture, AUCUN réseau. Pas de nouvelle dépendance (std + serde uniquement).
//
// NB : la source « log launcher RSI » de V2 (qui utilise le crate regex) est omise
// ici pour ne pas ajouter de dépendance ; registre + chemins connus suffisent dans
// les cas courants. À enrichir plus tard si besoin.

use serde::Serialize;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::OnceLock;

// Canaux par priorité décroissante (LIVE gagne).
const CHANNELS: [&str; 4] = ["LIVE", "PTU", "EPTU", "TECH-PREVIEW"];

#[derive(Serialize)]
pub struct ScInstall {
    pub path: Option<String>,
    pub channel: Option<String>,
    pub detected: bool,
    /// "manual" si le chemin vient d'un override choisi par l'utilisateur,
    /// "auto" si auto-détecté (registre/chemins connus), None si rien trouvé.
    pub source: Option<String>,
}

// ── Override manuel (chemin SC choisi par l'utilisateur) ─────────────────────
// SOURCE DE VÉRITÉ : un petit fichier texte dans le dossier de config de l'app
// (%APPDATA%\com.scmfd.desktop\sc_path_override.txt). resolve_sc_install() le lit
// EN PREMIER : ainsi TOUTES les features qui passent déjà par resolve_sc_install
// (détection, lecture actionmaps, dépôt SCMFD.xml) honorent l'override sans
// changement de signature. Le chemin du fichier est fixé au démarrage (lib.rs)
// depuis l'AppHandle, puis lu sans AppHandle au moment de la résolution.
static OVERRIDE_FILE: OnceLock<PathBuf> = OnceLock::new();

/// Fixe l'emplacement du fichier d'override (appelé une fois au setup Tauri).
pub fn set_override_file(path: PathBuf) {
    let _ = OVERRIDE_FILE.set(path);
}

/// Lit le chemin d'override brut persisté (sans valider). None si non défini.
fn read_override_raw() -> Option<String> {
    let file = OVERRIDE_FILE.get()?;
    let txt = std::fs::read_to_string(file).ok()?;
    let trimmed = txt.trim();
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_string())
    }
}

/// Un install valide possède Data.p4k à sa racine (même critère que V1/V2).
fn is_valid_install(install_path: &str) -> bool {
    Path::new(install_path).join("Data.p4k").is_file()
}

/// Déduit le canal depuis le suffixe du dossier (…\LIVE, …\PTU, …\EPTU, …TECH-PREVIEW).
fn detect_channel_from_path(p: &str) -> Option<&'static str> {
    let up = p.to_uppercase();
    if up.ends_with("\\LIVE") || up.ends_with("/LIVE") {
        Some("LIVE")
    } else if up.ends_with("\\PTU") || up.ends_with("/PTU") {
        Some("PTU")
    } else if up.ends_with("\\EPTU") || up.ends_with("/EPTU") {
        Some("EPTU")
    } else if up.contains("TECH-PREVIEW") {
        Some("TECH-PREVIEW")
    } else {
        None
    }
}

/// Chemins connus en dur × canaux (filet de secours).
fn hardcoded_candidates() -> Vec<(String, String)> {
    let roots = [
        r"C:\Program Files\Roberts Space Industries\StarCitizen",
        r"D:\Program Files\Roberts Space Industries\StarCitizen",
        r"E:\Program Files\Roberts Space Industries\StarCitizen",
        r"C:\Program Files\RSI Launcher\StarCitizen",
        r"D:\Program Files\RSI Launcher\StarCitizen",
        r"E:\Program Files\RSI Launcher\StarCitizen",
        r"C:\Games\Roberts Space Industries\StarCitizen",
        r"D:\Games\Roberts Space Industries\StarCitizen",
        r"E:\Games\Roberts Space Industries\StarCitizen",
    ];
    let mut out = Vec::new();
    for root in roots {
        for channel in CHANNELS {
            out.push((format!("{root}\\{channel}"), channel.to_string()));
        }
    }
    out
}

/// Registre Windows via `reg query` (pas de dépendance). Absente sur certaines
/// machines : on retombe silencieusement sur les autres sources.
fn candidates_from_registry() -> Vec<(String, String)> {
    let output = Command::new("reg")
        .args([
            "query",
            r"HKLM\SOFTWARE\WOW6432Node\Cloud Imperium Games\StarCitizen",
            "/v",
            "installpath",
        ])
        .output();
    let Ok(out) = output else {
        return vec![];
    };
    if !out.status.success() {
        return vec![];
    }
    let text = String::from_utf8_lossy(&out.stdout);
    // Ligne attendue : "    installpath    REG_SZ    <chemin>"
    let mut reg_path: Option<String> = None;
    for line in text.lines() {
        if let Some(idx) = line.to_uppercase().find("REG_SZ") {
            let val = line[idx + "REG_SZ".len()..].trim();
            if !val.is_empty() {
                reg_path = Some(val.to_string());
                break;
            }
        }
    }
    let Some(reg_path) = reg_path else {
        return vec![];
    };
    if let Some(channel) = detect_channel_from_path(&reg_path) {
        vec![(reg_path, channel.to_string())]
    } else {
        CHANNELS
            .iter()
            .map(|c| (format!("{reg_path}\\{c}"), c.to_string()))
            .collect()
    }
}

/// Auto-détection seule : cascade registre puis chemins connus, triés par
/// priorité de canal. Retourne le 1er install dont Data.p4k existe.
fn resolve_auto() -> Option<(String, String)> {
    let mut rest: Vec<(String, String)> = Vec::new();
    rest.extend(candidates_from_registry());
    rest.extend(hardcoded_candidates());
    rest.sort_by_key(|(_, ch)| CHANNELS.iter().position(|c| *c == ch.as_str()).unwrap_or(99));
    rest.into_iter().find(|(p, _)| is_valid_install(p))
}

/// Résolution complète avec origine. ORDRE DE PRIORITÉ (cf. cahier des charges) :
///   (1) override manuel persisté s'il est défini ET valide (Data.p4k présent),
///   (2) sinon auto-détection (registre / chemins connus).
/// Un override défini mais devenu invalide (jeu déplacé) est ignoré → on retombe
/// proprement sur l'auto-détection.
fn resolve_full() -> Option<(String, Option<String>, &'static str)> {
    if let Some(p) = read_override_raw() {
        if is_valid_install(&p) {
            let channel = detect_channel_from_path(&p).map(|c| c.to_string());
            return Some((p, channel, "manual"));
        }
    }
    resolve_auto().map(|(p, ch)| (p, Some(ch), "auto"))
}

/// Chemin SC résolu (override prioritaire, sinon auto). Point d'entrée unique
/// réutilisé par keybind_source (actionmaps.xml joueur + dépôt SCMFD.xml).
/// `pub` : tout le reste du backend passe par ici → l'override s'applique partout.
pub fn resolve_sc_install() -> Option<(String, String)> {
    resolve_full().map(|(p, ch, _)| (p, ch.unwrap_or_else(|| "LIVE".to_string())))
}

fn current_install() -> ScInstall {
    match resolve_full() {
        Some((path, channel, source)) => ScInstall {
            path: Some(path),
            channel,
            detected: true,
            source: Some(source.to_string()),
        },
        None => ScInstall {
            path: None,
            channel: None,
            detected: false,
            source: None,
        },
    }
}

/// Commande exposée : détection (lecture pure). detected=false si rien trouvé
/// (le frontend l'affiche, pas de chemin en dur trompeur).
#[tauri::command]
pub fn detect_sc_install() -> ScInstall {
    current_install()
}

/// Définit l'override manuel. Valide le dossier choisi (Data.p4k à la racine) ;
/// si invalide, renvoie Err SANS rien persister (le frontend affiche le message).
/// En cas de succès, persiste le chemin et renvoie l'install résolu (source=manual).
#[tauri::command]
pub fn set_sc_override(path: String) -> Result<ScInstall, String> {
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return Err("Aucun dossier sélectionné.".to_string());
    }
    if !is_valid_install(trimmed) {
        return Err(format!(
            "Dossier invalide : Data.p4k introuvable dans « {trimmed} ». \
             Choisissez le dossier d'un canal (ex. …\\StarCitizen\\LIVE)."
        ));
    }
    let file = OVERRIDE_FILE
        .get()
        .ok_or_else(|| "Stockage de l'override indisponible.".to_string())?;
    if let Some(parent) = file.parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("création dossier config: {e}"))?;
    }
    std::fs::write(file, trimmed.as_bytes()).map_err(|e| format!("écriture override: {e}"))?;
    Ok(current_install())
}

/// Supprime l'override manuel → retour à l'auto-détection. Renvoie l'install
/// re-résolu (auto si une install est trouvée, sinon non détecté).
#[tauri::command]
pub fn clear_sc_override() -> ScInstall {
    if let Some(file) = OVERRIDE_FILE.get() {
        let _ = std::fs::remove_file(file);
    }
    current_install()
}

/// Renvoie le chemin d'override brut persisté (même s'il est devenu invalide),
/// pour que le frontend puisse l'afficher / le signaler. None si pas d'override.
#[tauri::command]
pub fn get_sc_override() -> Option<String> {
    read_override_raw()
}
