import type { Loadout } from "./loadoutTypes";
import { CompanionMfd } from "./CompanionMfd";
import { GlassMfd } from "./GlassMfd";

// Catalogue des loadouts. Pour en ajouter un : nouvelle entrée + composant MFD.
export const LOADOUTS: Loadout[] = [
  {
    // id "scfm" conservé (clés de thème/sélection persistées) — l'UI « SCFM » est la
    // reproduction de la maquette Figma (CompanionMfd), qui remplace l'ancienne ScfmMfd.
    id: "scfm",
    name: "SCFM",
    description: "Verre dépoli · dock flottant, halos",
    available: true,
    defaultThemeId: "aegis",
    preview: "scfm",
    Mfd: CompanionMfd,
  },
  {
    id: "variante-b",
    name: "SC UI",
    description: "Interface verre · panneaux translucides",
    available: true,
    defaultThemeId: "rsi",
    preview: "glass",
    Mfd: GlassMfd,
  },
];

export const DEFAULT_LOADOUT_ID = LOADOUTS[0].id;

export function getLoadoutById(id: string): Loadout {
  return LOADOUTS.find((l) => l.id === id) ?? LOADOUTS[0];
}
