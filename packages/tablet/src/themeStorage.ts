import { DEFAULT_THEME_ID } from "@sc-mfd/shared";

// Persistance des thèmes tablette via localStorage de la webview (survit aux relances).
//
//   Zone B « système »      → thème de l'UI système (accueil, paramètres, barres).
//   Zone C « MFD »          → désormais LIÉE AU LOADOUT : chaque loadout mémorise
//                             son propre thème (clé sc-mfd.theme.loadout.<id>).
//   Loadout actif           → mémorisé pour pré-sélection au lancement.
//
// Les zones restent indépendantes : changer le thème système ne touche pas les
// thèmes de loadout et inversement.

const SYSTEM_KEY = "sc-mfd.theme.system";
const SELECTED_LOADOUT_KEY = "sc-mfd.loadout.selected";
const loadoutThemeKey = (loadoutId: string) => `sc-mfd.theme.loadout.${loadoutId}`;

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* pas de localStorage : on garde le défaut en mémoire */
  }
}

// ── Zone B : thème système ──
export function loadSystemThemeId(): string {
  return read(SYSTEM_KEY, DEFAULT_THEME_ID);
}
export function saveSystemThemeId(id: string): void {
  write(SYSTEM_KEY, id);
}

// ── Zone C : thème lié au loadout ──
export function loadLoadoutThemeId(loadoutId: string): string {
  return read(loadoutThemeKey(loadoutId), DEFAULT_THEME_ID);
}
export function saveLoadoutThemeId(loadoutId: string, themeId: string): void {
  write(loadoutThemeKey(loadoutId), themeId);
}

// ── Loadout actif ──
export function loadSelectedLoadoutId(fallback: string): string {
  return read(SELECTED_LOADOUT_KEY, fallback);
}
export function saveSelectedLoadoutId(loadoutId: string): void {
  write(SELECTED_LOADOUT_KEY, loadoutId);
}
