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
use std::path::Path;
use std::process::Command;

// Canaux par priorité décroissante (LIVE gagne).
const CHANNELS: [&str; 4] = ["LIVE", "PTU", "EPTU", "TECH-PREVIEW"];

#[derive(Serialize)]
pub struct ScInstall {
    pub path: Option<String>,
    pub channel: Option<String>,
    pub detected: bool,
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

/// Cascade : registre puis chemins connus, triés par priorité de canal.
/// Retourne le 1er install dont Data.p4k existe.
/// `pub` : réutilisé par keybind_source pour localiser actionmaps.xml du joueur.
pub fn resolve_sc_install() -> Option<(String, String)> {
    let mut rest: Vec<(String, String)> = Vec::new();
    rest.extend(candidates_from_registry());
    rest.extend(hardcoded_candidates());
    rest.sort_by_key(|(_, ch)| CHANNELS.iter().position(|c| *c == ch.as_str()).unwrap_or(99));
    rest.into_iter().find(|(p, _)| is_valid_install(p))
}

/// Commande exposée : détection (lecture pure). detected=false si rien trouvé
/// (le frontend l'affiche, pas de chemin en dur trompeur).
#[tauri::command]
pub fn detect_sc_install() -> ScInstall {
    match resolve_sc_install() {
        Some((path, channel)) => ScInstall {
            path: Some(path),
            channel: Some(channel),
            detected: true,
        },
        None => ScInstall {
            path: None,
            channel: None,
            detected: false,
        },
    }
}
