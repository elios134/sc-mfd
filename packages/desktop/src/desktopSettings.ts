// Persistance des réglages desktop via localStorage de la webview Tauri
// (survit aux relances). Mécanisme identique au thème desktop (themeStorage.ts).

export type Language = "fr" | "en";

const KEYS = {
  port: "sc-mfd.desktop.wsPort",
  startWithWindows: "sc-mfd.desktop.startWithWindows",
  minimizeToTray: "sc-mfd.desktop.minimizeToTray",
  language: "sc-mfd.desktop.language",
  profileNoticeSeen: "sc-mfd.desktop.profileNoticeSeen",
  scPathOverride: "sc-mfd.scPath.override",
} as const;

function readStr(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStr(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* pas de localStorage : défaut en mémoire */
  }
}
function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}
function writeBool(key: string, value: boolean): void {
  writeStr(key, value ? "1" : "0");
}

// Port d'écoute WS (le défaut réel vient du serveur ; ici on mémorise le choix UI).
export function loadWsPort(fallback: number): number {
  const raw = readStr(KEYS.port, String(fallback));
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n < 65536 ? n : fallback;
}
export function saveWsPort(port: number): void {
  writeStr(KEYS.port, String(port));
}

export function loadStartWithWindows(): boolean {
  return readBool(KEYS.startWithWindows, false);
}
export function saveStartWithWindows(v: boolean): void {
  writeBool(KEYS.startWithWindows, v);
}

export function loadMinimizeToTray(): boolean {
  return readBool(KEYS.minimizeToTray, true);
}
export function saveMinimizeToTray(v: boolean): void {
  writeBool(KEYS.minimizeToTray, v);
}

export function loadLanguage(): Language {
  return readStr(KEYS.language, "fr") === "en" ? "en" : "fr";
}
export function saveLanguage(v: Language): void {
  writeStr(KEYS.language, v);
}

// Chemin SC choisi manuellement (override). La SOURCE DE VÉRITÉ qui le rend
// prioritaire est côté Rust (fichier de config lu par resolve_sc_install) ; cette
// clé localStorage n'est qu'un miroir pour l'affichage instantané au démarrage.
export function loadScPathOverride(): string | null {
  try {
    return localStorage.getItem(KEYS.scPathOverride);
  } catch {
    return null;
  }
}
export function saveScPathOverride(path: string): void {
  writeStr(KEYS.scPathOverride, path);
}
export function clearScPathOverride(): void {
  try {
    localStorage.removeItem(KEYS.scPathOverride);
  } catch {
    /* pas de localStorage : rien à faire */
  }
}

// Notice « sélectionner le profil SC MFD dans le jeu » : affichée tant que
// l'utilisateur ne l'a pas masquée (discrète, une fois).
export function loadProfileNoticeSeen(): boolean {
  return readBool(KEYS.profileNoticeSeen, false);
}
export function saveProfileNoticeSeen(v: boolean): void {
  writeBool(KEYS.profileNoticeSeen, v);
}
