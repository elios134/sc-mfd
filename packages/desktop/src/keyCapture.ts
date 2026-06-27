// Capture clavier (DOM KeyboardEvent → nomenclature Star Citizen) pour l'éditeur
// de mapping (chantier C4).
//
// MIROIR INVERSE de input.rs (named_key_vk / normal_vk) : on ne renvoie QUE des
// touches que l'émulation Rust sait reproduire — sinon le bouton MFD enverrait une
// touche "inconnue" et l'émulation échouerait. On se base sur `event.code` (position
// physique, indépendante de la disposition AZERTY/QWERTY) comme le scancode Rust.
//
// Les MODIFICATEURS ne sont PAS capturés ici : SC distingue gauche/droite
// (lalt vs ralt = ATC vs amplification) et le DOM ne le fiabilise pas. L'UI les
// fournit via des cases à cocher explicites (cf. ProfileDebugPanel).

/** Modificateurs SC sélectionnables dans l'éditeur, dans l'ordre d'affichage. */
export const MODIFIER_CHOICES = [
  "lctrl",
  "rctrl",
  "lshift",
  "rshift",
  "lalt",
  "ralt",
] as const;

/** event.code "nommés" → token SC (doit rester aligné sur input.rs named_key_vk). */
const CODE_TO_SC: Record<string, string> = {
  Space: "space",
  Enter: "enter",
  Tab: "tab",
  Escape: "escape",
  Backspace: "backspace",
  // Pavé navigation / édition.
  Insert: "insert",
  Delete: "delete",
  Home: "home",
  End: "end",
  PageUp: "pgup",
  PageDown: "pgdn",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  // Ponctuation (OEM).
  Comma: "comma",
  Period: "period",
  Semicolon: "semicolon",
  BracketLeft: "lbracket",
  BracketRight: "rbracket",
  Slash: "slash",
  Backslash: "backslash",
  Quote: "apostrophe",
  Minus: "minus",
  Equal: "equals",
  Backquote: "grave",
  // Pavé numérique.
  NumpadAdd: "np_add",
  NumpadSubtract: "np_subtract",
  NumpadMultiply: "np_multiply",
  NumpadDivide: "np_divide",
  NumpadDecimal: "np_period",
  NumpadEnter: "np_enter",
};

/** event.code des touches qui SONT des modificateurs (à ignorer comme touche). */
const MODIFIER_CODES = new Set([
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
]);

/**
 * Convertit le `code` d'un KeyboardEvent en token SC émulable, ou null si la touche
 * est un modificateur seul ou n'est pas supportée par l'émulation Rust.
 */
export function codeToScKey(code: string): string | null {
  if (MODIFIER_CODES.has(code)) return null;
  if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase(); // KeyN → n
  if (/^Digit[0-9]$/.test(code)) return code.slice(5); // Digit4 → 4
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code.toLowerCase(); // F6 → f6
  if (/^Numpad[0-9]$/.test(code)) return "np_" + code.slice(6); // Numpad5 → np_5
  return CODE_TO_SC[code] ?? null;
}

/** Libellé lisible d'un modificateur SC (ex "Alt", "AltGr", "Ctrl droit"). */
export function modifierLabel(mod: string): string {
  return (
    {
      lalt: "Alt",
      ralt: "AltGr",
      lctrl: "Ctrl",
      rctrl: "Ctrl droit",
      lshift: "Shift",
      rshift: "Shift droit",
    }[mod] ?? mod
  );
}
