// Persistance des réglages tablette (hors thèmes) via localStorage de la webview.
// Réutilise le même mécanisme que themeStorage (survit aux relances).

const KEYS = {
  autoReconnect: "sc-mfd.settings.autoReconnect",
  brightness: "sc-mfd.settings.brightness",
  keepAwake: "sc-mfd.settings.keepAwake",
  vibrate: "sc-mfd.settings.vibrate",
} as const;

// Défauts alignés sur la maquette (reconnexion/écran/vibration ON, luminosité ~70%).
const DEFAULTS = {
  autoReconnect: true,
  brightness: 70,
  keepAwake: true,
  vibrate: true,
} as const;

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}
function writeBool(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* pas de localStorage : défaut en mémoire */
  }
}
function readNum(key: string, fallback: number): number {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}
function writeNum(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* pas de localStorage : défaut en mémoire */
  }
}

export function loadAutoReconnect(): boolean {
  return readBool(KEYS.autoReconnect, DEFAULTS.autoReconnect);
}
export function saveAutoReconnect(v: boolean): void {
  writeBool(KEYS.autoReconnect, v);
}

export function loadBrightness(): number {
  return readNum(KEYS.brightness, DEFAULTS.brightness);
}
export function saveBrightness(v: number): void {
  writeNum(KEYS.brightness, v);
}

export function loadKeepAwake(): boolean {
  return readBool(KEYS.keepAwake, DEFAULTS.keepAwake);
}
export function saveKeepAwake(v: boolean): void {
  writeBool(KEYS.keepAwake, v);
}

export function loadVibrate(): boolean {
  return readBool(KEYS.vibrate, DEFAULTS.vibrate);
}
export function saveVibrate(v: boolean): void {
  writeBool(KEYS.vibrate, v);
}
