import { DEFAULT_THEME_ID } from "@sc-mfd/shared";

// Zone A = app desktop (le pont). Un seul thème, persisté côté desktop.
// NB : on stocke dans le localStorage de la webview Tauri (persisté sur disque
// par appli, survit aux relances) plutôt qu'en base SQL comme V2 : le projet
// n'embarque pas le plugin tauri-sql/store. Migration vers un store Tauri
// possible plus tard sans changer l'API ci-dessous.
const KEY = "sc-mfd.theme.desktop";

export function loadDesktopThemeId(): string {
  try {
    return localStorage.getItem(KEY) ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function saveDesktopThemeId(id: string): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* webview sans localStorage : on garde le défaut en mémoire */
  }
}
