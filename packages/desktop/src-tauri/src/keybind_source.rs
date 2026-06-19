// Lecture SEULE des sources de keybind, pour le mapping dynamique (chantier C2).
//
// Le Rust ne fait QUE lire le texte brut des deux fichiers et le renvoyer au
// frontend. Le parsing + la résolution (action → touche réelle) se font côté
// frontend, qui dispose déjà de la liste des actions via @sc-mfd/shared.
//
// AUCUNE écriture dans le dossier du jeu (ni ailleurs). On ne touche pas non plus
// au keymap figé ni à l'émulation : ce mapping est construit EN PLUS.

use serde::Serialize;
use std::path::{Path, PathBuf};

/// Résultat de l'écriture du control-profile.
#[derive(Serialize)]
pub struct WriteResult {
    pub path: String,
    pub bytes: usize,
}

/// Texte brut des deux sources + chemins résolus + avertissements non bloquants.
#[derive(Serialize)]
pub struct KeybindSources {
    pub player_path: Option<String>,
    pub player_xml: Option<String>,
    pub default_path: Option<String>,
    pub default_xml: Option<String>,
    pub warnings: Vec<String>,
}

/// actionmaps.xml du joueur, déduit de l'install SC détecté :
///   <install>\user\client\0\Profiles\default\actionmaps.xml
fn player_actionmaps_path() -> Option<PathBuf> {
    let (root, _channel) = crate::sc_detect::resolve_sc_install()?;
    Some(
        Path::new(&root)
            .join("user")
            .join("client")
            .join("0")
            .join("Profiles")
            .join("default")
            .join("actionmaps.xml"),
    )
}

/// Emplacements candidats du defaultProfile extrait (outil dev, hors install SC).
/// L'extract n'est pas au même endroit selon les machines : on essaie une liste.
fn default_profile_candidates() -> Vec<PathBuf> {
    let mut v = Vec::new();
    if let Some(home) = std::env::var_os("USERPROFILE") {
        let home = PathBuf::from(home);
        v.push(
            home.join("scfleet-keybinds-extract")
                .join("defaultProfile.plain.xml"),
        );
        v.push(
            home.join("Documents")
                .join("scfleet-keybinds-extract")
                .join("defaultProfile.plain.xml"),
        );
    }
    v
}

/// Commande exposée au frontend : lit (lecture seule) les deux fichiers.
/// Ne panique jamais : tout échec devient un `warning` + champ `None`.
#[tauri::command]
pub fn read_keybind_sources() -> KeybindSources {
    let mut warnings = Vec::new();

    // ── Profil joueur (rebinds perso) ─────────────────────────────────────
    let (player_path, player_xml) = match player_actionmaps_path() {
        Some(p) => {
            let shown = p.to_string_lossy().to_string();
            match std::fs::read_to_string(&p) {
                Ok(txt) => (Some(shown), Some(txt)),
                Err(e) => {
                    warnings.push(format!("actionmaps.xml joueur illisible ({shown}): {e}"));
                    (Some(shown), None)
                }
            }
        }
        None => {
            warnings.push(
                "Install Star Citizen non détecté : actionmaps.xml joueur introuvable.".to_string(),
            );
            (None, None)
        }
    };

    // ── Profil par défaut (extract dev) ───────────────────────────────────
    let mut default_path = None;
    let mut default_xml = None;
    for cand in default_profile_candidates() {
        if cand.is_file() {
            let shown = cand.to_string_lossy().to_string();
            match std::fs::read_to_string(&cand) {
                Ok(txt) => {
                    default_path = Some(shown);
                    default_xml = Some(txt);
                    break;
                }
                Err(e) => warnings.push(format!("defaultProfile illisible ({shown}): {e}")),
            }
        }
    }
    if default_xml.is_none() {
        warnings.push(
            "defaultProfile.plain.xml introuvable (extract dev absent) — touches par défaut indisponibles."
                .to_string(),
        );
    }

    KeybindSources {
        player_path,
        player_xml,
        default_path,
        default_xml,
        warnings,
    }
}

/// Écrit NOTRE control-profile « SC MFD » — et UNIQUEMENT lui — dans
///   <install SC>\user\client\0\Controls\Mappings\SCMFD.xml
///
/// SÉCURITÉ : le chemin est entièrement calculé ICI. Le frontend ne fournit que
/// le CONTENU XML, jamais la destination → impossible d'écrire ailleurs. On ne
/// touche JAMAIS actionmaps.xml (profil du joueur). Crée le dossier si absent.
#[tauri::command]
pub fn write_control_profile(xml: String) -> Result<WriteResult, String> {
    let (root, _channel) =
        crate::sc_detect::resolve_sc_install().ok_or_else(|| "Install Star Citizen non détecté.".to_string())?;

    let dir = Path::new(&root)
        .join("user")
        .join("client")
        .join("0")
        .join("Controls")
        .join("Mappings");
    std::fs::create_dir_all(&dir).map_err(|e| format!("création dossier Mappings: {e}"))?;

    let target = dir.join("SCMFD.xml");
    // Garde-fou : on n'écrit que SCMFD.xml, jamais un autre fichier.
    if target.file_name().and_then(|n| n.to_str()) != Some("SCMFD.xml") {
        return Err("garde-fou: cible inattendue, écriture annulée".to_string());
    }

    std::fs::write(&target, xml.as_bytes()).map_err(|e| format!("écriture SCMFD.xml: {e}"))?;
    Ok(WriteResult {
        path: target.to_string_lossy().to_string(),
        bytes: xml.len(),
    })
}
