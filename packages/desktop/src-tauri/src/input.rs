// Émulation clavier au niveau SYSTÈME Windows via SendInput (crate `windows`).
// Injecte dans le flux d'entrée global -> la fenêtre active (Bloc-notes, jeu…)
// reçoit les touches. Gère touches simples ET combinaisons gauche/droite.
//
// MODE par défaut = SCANCODE (KEYEVENTF_SCANCODE) : Star Citizen lit le scancode
// PHYSIQUE de la touche, pas le code virtuel (VK). Le mode VK reste disponible
// (EMU_MODE) car il marchait au Bloc-notes — utile pour comparer en cas de souci.
//
// Le scancode est obtenu via MapVirtualKeyW(MAPVK_VK_TO_VSC) à partir du VK :
//   - pas de table de scancodes en dur (dépendante de la disposition) ;
//   - MapVirtualKey traduit selon la disposition active (gère AZERTY).
// MAPVK_VK_TO_VSC NE met PAS le préfixe étendu 0xE0 : on ajoute donc
// KEYEVENTF_EXTENDEDKEY nous-mêmes pour les touches étendues (ralt = AltGr, rctrl).

use windows::Win32::UI::Input::KeyboardAndMouse::{
    MapVirtualKeyW, SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYBD_EVENT_FLAGS,
    KEYEVENTF_EXTENDEDKEY, KEYEVENTF_KEYUP, KEYEVENTF_SCANCODE, MAPVK_VK_TO_VSC, VIRTUAL_KEY,
};

/// Mode d'émulation. Scancode = défaut (compatible jeu). VirtualKey = repli
/// (basculer EMU_MODE pour revenir au mode qui marchait au Bloc-notes).
#[allow(dead_code)] // VirtualKey n'est pas construit tant que EMU_MODE = Scancode.
#[derive(Clone, Copy, PartialEq)]
enum EmuMode {
    Scancode,
    VirtualKey,
}
const EMU_MODE: EmuMode = EmuMode::Scancode;

/// Durée du MAINTIEN simulé pour une action en activation "long"
/// (delayed_press / delayed_hold côté Star Citizen : un appui court ne déclenche
/// pas, SC exige le maintien). On presse, on attend ce délai, on relâche.
/// À CALIBRER au test en jeu : si 400 ms ne suffit pas / est trop long, ajuster ici.
pub const LONG_PRESS_HOLD_MS: u64 = 400;

/// Une touche résolue : code virtuel, scancode physique, et drapeau étendu.
struct KeyCode {
    vk: u16,
    scan: u16,
    extended: bool,
}

/// VK d'une touche "normale" (lettre, chiffre, touche de fonction).
fn normal_vk(key: &str) -> Option<u16> {
    // Touches de fonction f1..f24 (VK_F1 = 0x70).
    if let Some(n) = key.strip_prefix('f').and_then(|r| r.parse::<u16>().ok()) {
        if (1..=24).contains(&n) {
            return Some(0x70 + (n - 1));
        }
    }
    // Lettre ou chiffre simple : le VK est le code ASCII majuscule.
    let bytes = key.as_bytes();
    if bytes.len() == 1 {
        let c = bytes[0];
        if c.is_ascii_alphabetic() {
            return Some(c.to_ascii_uppercase() as u16);
        }
        if c.is_ascii_digit() {
            return Some(c as u16);
        }
    }
    None
}

/// VK + drapeau étendu d'une touche NOMMÉE (nav, numpad, ponctuation), telle
/// que SC la nomme dans le profil. `extended` = vrai pour les touches du pavé de
/// navigation et np_divide (préfixe scancode 0xE0), sinon MapVirtualKey les
/// confondrait avec le pavé numérique.
fn named_key_vk(key: &str) -> Option<(u16, bool)> {
    let v = match key {
        "space" => (0x20, false),
        "enter" => (0x0D, false),
        "tab" => (0x09, false),
        "escape" => (0x1B, false),
        "backspace" => (0x08, false),
        // Pavé navigation/édition → étendues.
        "insert" => (0x2D, true),
        "delete" => (0x2E, true),
        "home" => (0x24, true),
        "end" => (0x23, true),
        "pgup" => (0x21, true),
        "pgdn" => (0x22, true),
        "up" => (0x26, true),
        "down" => (0x28, true),
        "left" => (0x25, true),
        "right" => (0x27, true),
        // Ponctuation (OEM).
        "comma" => (0xBC, false),
        "period" => (0xBE, false),
        "semicolon" => (0xBA, false),
        "lbracket" => (0xDB, false),
        "rbracket" => (0xDD, false),
        "slash" => (0xBF, false),
        "backslash" => (0xDC, false),
        "apostrophe" => (0xDE, false),
        "minus" => (0xBD, false),
        "equals" => (0xBB, false),
        "grave" => (0xC0, false),
        // Pavé numérique.
        "np_add" => (0x6B, false),
        "np_subtract" => (0x6D, false),
        "np_multiply" => (0x6A, false),
        "np_divide" => (0x6F, true),
        "np_period" => (0x6E, false),
        "np_enter" => (0x0D, true),
        other => {
            // np_0 .. np_9 (VK_NUMPAD0 = 0x60).
            if let Some(n) = other.strip_prefix("np_").and_then(|r| r.parse::<u16>().ok()) {
                if n <= 9 {
                    return Some((0x60 + n, false));
                }
            }
            return None;
        }
    };
    Some(v)
}

/// Résout un nom (modificateur OU touche) en KeyCode. Le scancode vient de
/// MapVirtualKey ; `extended` est vrai pour les touches à préfixe 0xE0 (ralt, rctrl).
fn resolve(name: &str) -> Option<KeyCode> {
    // VK gauche/droite distincts ; MapVirtualKey(MAPVK_VK_TO_VSC) les accepte.
    let (vk, extended) = match name {
        "lshift" => (0xA0u16, false), // VK_LSHIFT
        "rshift" => (0xA1, false),    // VK_RSHIFT (non étendue)
        "lctrl" => (0xA2, false),     // VK_LCONTROL
        "rctrl" => (0xA3, true),      // VK_RCONTROL (étendue)
        "lalt" => (0xA4, false),      // VK_LMENU
        "ralt" => (0xA5, true),       // VK_RMENU / AltGr (étendue)
        // Lettre/chiffre/F-key, sinon touche nommée (insert, np_*, comma…).
        other => match normal_vk(other) {
            Some(vk) => (vk, false),
            None => named_key_vk(other)?,
        },
    };
    let scan = unsafe { MapVirtualKeyW(vk as u32, MAPVK_VK_TO_VSC) } as u16;
    Some(KeyCode { vk, scan, extended })
}

fn key_event(kc: &KeyCode, up: bool) -> INPUT {
    // Repli VK automatique si le scancode est introuvable (scan == 0).
    let use_scan = EMU_MODE == EmuMode::Scancode && kc.scan != 0;

    let mut flags = KEYBD_EVENT_FLAGS(0);
    if use_scan {
        flags |= KEYEVENTF_SCANCODE;
        if kc.extended {
            flags |= KEYEVENTF_EXTENDEDKEY;
        }
    }
    if up {
        flags |= KEYEVENTF_KEYUP;
    }

    let (w_vk, w_scan) = if use_scan {
        (VIRTUAL_KEY(0), kc.scan)
    } else {
        (VIRTUAL_KEY(kc.vk), 0)
    };

    INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 {
            ki: KEYBDINPUT {
                wVk: w_vk,
                wScan: w_scan,
                dwFlags: flags,
                time: 0,
                dwExtraInfo: 0,
            },
        },
    }
}

fn mod_label(name: &str) -> &'static str {
    match name {
        "lalt" => "Alt",
        "ralt" => "AltGr",
        "lshift" | "rshift" => "Shift",
        "lctrl" | "rctrl" => "Ctrl",
        _ => "?",
    }
}

fn key_label(key: &str) -> String {
    match key {
        "lshift" | "rshift" => "Shift".to_string(),
        "lalt" => "Alt".to_string(),
        "ralt" => "AltGr".to_string(),
        "lctrl" | "rctrl" => "Ctrl".to_string(),
        _ => key.to_uppercase(),
    }
}

/// Libellé lisible pour le journal (ex "U", "Alt + N").
pub fn describe(key: &str, modifiers: &[&str]) -> String {
    let mut parts: Vec<String> = modifiers.iter().map(|m| mod_label(m).to_string()).collect();
    parts.push(key_label(key));
    parts.join(" + ")
}

/// Résout une touche + ses modificateurs en codes, ou une erreur lisible.
fn resolve_combo(key: &str, modifiers: &[&str]) -> Result<(KeyCode, Vec<KeyCode>), String> {
    let key_code = resolve(key).ok_or_else(|| format!("touche inconnue: '{key}'"))?;
    let mut mod_codes = Vec::with_capacity(modifiers.len());
    for m in modifiers {
        mod_codes.push(resolve(m).ok_or_else(|| format!("modificateur inconnu: '{m}'"))?);
    }
    Ok((key_code, mod_codes))
}

/// Injecte un lot d'events ; erreur si tout n'a pas été injecté.
fn send_inputs(inputs: &[INPUT]) -> Result<(), String> {
    // SendInput retourne le nombre d'events réellement injectés.
    let sent = unsafe { SendInput(inputs, std::mem::size_of::<INPUT>() as i32) };
    if sent as usize != inputs.len() {
        return Err(format!("SendInput: {sent}/{} events injectés", inputs.len()));
    }
    Ok(())
}

/// Émule un appui complet et IMMÉDIAT (activation "press") : modificateurs
/// pressés, touche pressée puis relâchée, modificateurs relâchés en ordre
/// inverse — le tout dans un seul lot SendInput. Retourne le libellé émulé.
pub fn emulate(key: &str, modifiers: &[&str]) -> Result<String, String> {
    let (key_code, mod_codes) = resolve_combo(key, modifiers)?;

    let mut inputs: Vec<INPUT> = Vec::with_capacity(mod_codes.len() * 2 + 2);
    for kc in &mod_codes {
        inputs.push(key_event(kc, false));
    }
    inputs.push(key_event(&key_code, false));
    inputs.push(key_event(&key_code, true));
    for kc in mod_codes.iter().rev() {
        inputs.push(key_event(kc, true));
    }

    send_inputs(&inputs)?;
    Ok(describe(key, modifiers))
}

/// Phase « PRESSER » d'un appui long : modificateurs pressés puis touche pressée,
/// SANS relâcher. L'appelant doit appeler `release` après le délai de maintien.
/// Retourne le libellé pour le journal.
pub fn press(key: &str, modifiers: &[&str]) -> Result<String, String> {
    let (key_code, mod_codes) = resolve_combo(key, modifiers)?;

    let mut inputs: Vec<INPUT> = Vec::with_capacity(mod_codes.len() + 1);
    for kc in &mod_codes {
        inputs.push(key_event(kc, false));
    }
    inputs.push(key_event(&key_code, false));

    send_inputs(&inputs)?;
    Ok(describe(key, modifiers))
}

/// Phase « RELÂCHER » d'un appui long : touche relâchée puis modificateurs
/// relâchés en ordre inverse. À appeler après le délai de maintien.
pub fn release(key: &str, modifiers: &[&str]) -> Result<(), String> {
    let (key_code, mod_codes) = resolve_combo(key, modifiers)?;

    let mut inputs: Vec<INPUT> = Vec::with_capacity(mod_codes.len() + 1);
    inputs.push(key_event(&key_code, true));
    for kc in mod_codes.iter().rev() {
        inputs.push(key_event(kc, true));
    }

    send_inputs(&inputs)
}
