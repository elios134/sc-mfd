import type { Loadout } from "./loadoutTypes";
import { ScfmMfd } from "./ScfmMfd";
import { GlassMfd } from "./GlassMfd";

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
    id: "variante-b",
    name: "Variante B",
    description: "Interface verre / doux · écrans translucides, glow",
    available: true,
    defaultThemeId: "origin",
    Mfd: GlassMfd,
  },
];

export const DEFAULT_LOADOUT_ID = LOADOUTS[0].id;

export function getLoadoutById(id: string): Loadout {
  return LOADOUTS.find((l) => l.id === id) ?? LOADOUTS[0];
}
