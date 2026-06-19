import type { Loadout } from "./loadoutTypes";
import { ScfmMfd } from "./ScfmMfd";

// Catalogue des loadouts. Pour en ajouter un : nouvelle entrée + composant MFD.
export const LOADOUTS: Loadout[] = [
  {
    id: "scfm",
    name: "SCFM",
    description: "Interface ambre/gold · le style maison SC Fleet Manager",
    available: true,
    defaultThemeId: "aegis",
    Mfd: ScfmMfd,
  },
  {
    id: "mfd-authentique",
    name: "MFD authentique",
    description: "Look fidèle au jeu · bientôt disponible",
    available: false,
    defaultThemeId: "aegis",
    // Pas d'UI : placeholder grisé tant que non disponible.
  },
];

export const DEFAULT_LOADOUT_ID = LOADOUTS[0].id;

export function getLoadoutById(id: string): Loadout {
  return LOADOUTS.find((l) => l.id === id) ?? LOADOUTS[0];
}
