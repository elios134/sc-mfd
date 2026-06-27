// Overrides de touches définis PAR L'UTILISATEUR depuis l'app (chantier C4).
//
// Couche posée AU-DESSUS du mapping dynamique : pour une action donnée, l'override
// gagne sur le profil joueur, le défaut jeu et le keymap figé. Persisté dans le
// localStorage de la webview Tauri (même mécanisme que desktopSettings.ts), pas de
// cache disque côté jeu. La SOURCE DE VÉRITÉ de l'émulation reste dynmap (Rust),
// alimentée à chaque loadProfile() qui réinjecte ces overrides.

import type { Activation } from "./profileReader";

/**
 * Override d'une action.
 * `key === null`  : l'utilisateur a EXPLICITEMENT retiré la touche (action vidée).
 * `key` non null  : touche personnalisée (ex "n", "insert", "np_5").
 */
export interface KeyOverride {
  key: string | null;
  modifiers: string[];
  activation: Activation;
}

export type OverrideMap = Record<string, KeyOverride>;

const STORAGE_KEY = "sc-mfd.desktop.keyOverrides";

/** Lit tous les overrides. Toujours sûr : objet vide si absent / illisible. */
export function loadKeyOverrides(): OverrideMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as OverrideMap;
    return {};
  } catch {
    return {};
  }
}

function persist(map: OverrideMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* pas de localStorage : override en mémoire seulement (perdu au reload) */
  }
}

/** Pose / remplace l'override d'une action. */
export function saveKeyOverride(actionId: string, override: KeyOverride): void {
  const map = loadKeyOverrides();
  map[actionId] = override;
  persist(map);
}

/** Retire l'override d'une action (retour au profil joueur / défaut). */
export function removeKeyOverride(actionId: string): void {
  const map = loadKeyOverrides();
  if (actionId in map) {
    delete map[actionId];
    persist(map);
  }
}
