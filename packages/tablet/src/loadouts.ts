import type { Loadout } from "./loadoutTypes";
import { ScfmMfd } from "./ScfmMfd";
import { GlassMfd } from "./GlassMfd";

// Catalogue des loadouts. Pour en ajouter un : nouvelle entrée + composant MFD.
export const LOADOUTS: Loadout[] = [
  {
    id: "scfm",
    name: "SCFM",
    description: "Style maison · cartes et grille",
    available: true,
    defaultThemeId: "aegis",
    preview: "scfm",
    Mfd: ScfmMfd,
  },
  {
    // id conservé (clés de thème/sélection persistées) — seul le nom affiché change.
    id: "variante-b",
    name: "SC UI",
    description: "Interface verre · panneaux translucides",
    available: true,
    defaultThemeId: "origin",
    preview: "glass",
    Mfd: GlassMfd,
  },
];

export const DEFAULT_LOADOUT_ID = LOADOUTS[0].id;

export function getLoadoutById(id: string): Loadout {
  return LOADOUTS.find((l) => l.id === id) ?? LOADOUTS[0];
}
