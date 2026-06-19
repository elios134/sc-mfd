// Thèmes constructeurs SC — port fidèle de SC Fleet Manager V2.
// (cf. V2: src/constants/manufacturerThemes.ts + src/hooks/useAppSettings.ts)
//
// Chaque thème = UNE couleur d'accent. Toute la famille de tokens (amber, gold,
// copper, glow…) est DÉRIVÉE de l'accent par la même formule HSL que V2 — on ne
// réinvente aucune teinte. La sortie est ensuite mappée sur les variables CSS
// réellement consommées par sc-mfd (desktop + tablet) via themeCssVars().
//
// TS pur, aucun build (cohérent avec le reste de @sc-mfd/shared).

export type ManufacturerTheme = {
  id: string;
  name: string;
  /** Sous-titre affiché sous le nom dans le sélecteur (Militaire, Pirate, …). */
  subtitle: string;
  /** Couleur d'accent principale (hex). */
  accent: string;
};

export const MANUFACTURER_THEMES: ManufacturerTheme[] = [
  { id: "aegis", name: "AEGIS", subtitle: "Militaire", accent: "#FFC56A" },
  { id: "drake", name: "DRAKE", subtitle: "Pirate", accent: "#FF6B47" },
  { id: "origin", name: "ORIGIN", subtitle: "Luxe", accent: "#2EC4FF" },
  { id: "crusader", name: "CRUSADER", subtitle: "Civil", accent: "#4FA3FF" },
  { id: "misc", name: "MISC", subtitle: "Tech", accent: "#4CD964" },
  { id: "esperia", name: "ESPERIA", subtitle: "Alien", accent: "#8B7CC7" },
];

/** Thème par défaut (si aucun réglage persisté). */
export const DEFAULT_THEME_ID = "aegis";

/** Récupère un thème par id ; retombe sur le défaut si introuvable. */
export function getThemeById(id: string | null | undefined): ManufacturerTheme {
  return (
    MANUFACTURER_THEMES.find((t) => t.id === id) ??
    MANUFACTURER_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ??
    MANUFACTURER_THEMES[0]
  );
}

/* ───────────────────────── Helpers HSL (port verbatim V2) ─────────────────────────
 * Repris à l'identique de V2 useAppSettings.ts (lui-même port de V1
 * HudCustomizationContext). Le fallback indigo #6366f1 (239,84%,67%) est conservé
 * pour parité ; il n'est atteint que sur hex invalide.
 */

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return "99,102,241";
  return `${r},${g},${b}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return { h: 239, s: 84, l: 67 };
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const lig = Math.max(0, Math.min(100, l)) / 100;
  const cc = (1 - Math.abs(2 * lig - 1)) * sat;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = cc * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) { r = cc; g = x; }
  else if (hp < 2) { r = x; g = cc; }
  else if (hp < 3) { g = cc; b = x; }
  else if (hp < 4) { g = x; b = cc; }
  else if (hp < 5) { r = x; b = cc; }
  else { r = cc; b = x; }
  const m = lig - cc / 2;
  const toByte = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`;
}

/* ───────────────────────── Palette dérivée (formule V2) ─────────────────────────
 * Reproduit exactement V2 deriveAmberPalette() + applyAccent() :
 *   amber        = accent
 *   amberBright  = L+8                       (clamp L 0..92)
 *   copper       = S-8,  L-18                (clamp S 40..100, L 14..100)
 *   copperDeep   = S-4,  L-38                (clamp S 40..100, L 8..100)
 *   gold         = S-18, L-5                 (clamp S 30..100, L 0..92)
 *   accentMuted  = rgba(accent, 0.20)
 *   bgGlow1      = rgba(accent, 0.15)
 *   bgGlow2      = rgba(teinte +25°, 0.10)
 */

export type ThemePalette = {
  accent: string;
  accentMuted: string;
  amber: string;
  amberBright: string;
  copper: string;
  copperDeep: string;
  gold: string;
  amberMuted: string;
  accentBlue: string;
  bgGlow1: string;
  bgGlow2: string;
};

export function deriveThemePalette(accent: string): ThemePalette {
  const rgb = hexToRgb(accent);
  const { h, s, l } = hexToHsl(accent);
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const amber = accent;
  const amberBright = hslToHex(h, s, clamp(l + 8, 0, 92));
  const copper = hslToHex(h, clamp(s - 8, 40, 100), clamp(l - 18, 14, 100));
  const copperDeep = hslToHex(h, clamp(s - 4, 40, 100), clamp(l - 38, 8, 100));
  const gold = hslToHex(h, clamp(s - 18, 30, 100), clamp(l - 5, 0, 92));

  // bg-glow-2 : teinte voisine (+25°) pour conserver le dégradé deux-tons de V2.
  const glow2Rgb = hexToRgb(hslToHex(h + 25, s, l));

  return {
    accent,
    accentMuted: `rgba(${rgb},0.20)`,
    amber,
    amberBright,
    copper,
    copperDeep,
    gold,
    amberMuted: `rgba(${rgb},0.20)`,
    accentBlue: accent, // legacy V1/V2
    bgGlow1: `rgba(${rgb},0.15)`,
    bgGlow2: `rgba(${glow2Rgb},0.10)`,
  };
}

/* ───────────────────────── Mapping → variables CSS sc-mfd ─────────────────────────
 * sc-mfd n'utilise pas exactement les mêmes noms de tokens que V2. La DA repose sur
 * une famille « gold/amber » : --gold est l'ACCENT primaire (et non le gold dérivé
 * de V2). On mappe donc :
 *   --gold        ← accent           (primaire, ce que V2 nomme --amber)
 *   --gold-soft   ← palette.gold      (gold dérivé V2 = S-18 L-5, le ton cuivré doux)
 *   --gold-glow   ← rgba(accent,.18)  (halo ; alpha sc-mfd existant)
 *   --amber-line  ← rgba(accent,.28)  (lignes ambre ; alpha sc-mfd/maquette existant)
 * Côté tablette les tokens Tailwind @theme s'appellent --color-gold / --color-goldsoft.
 * On émet aussi toute la famille V2 (--amber, --copper…) au cas où un écran la consomme.
 * Poser un token inutilisé par un écran est sans effet — donc la même map sert
 * desktop ET tablette.
 */
export function themeCssVars(accent: string): Record<string, string> {
  const p = deriveThemePalette(accent);
  const rgb = hexToRgb(accent);

  return {
    // Famille V2 fidèle (accent + dérivés)
    "--accent": p.accent,
    "--accent-muted": p.accentMuted,
    "--amber": p.amber,
    "--amber-bright": p.amberBright,
    "--copper": p.copper,
    "--copper-deep": p.copperDeep,
    "--amber-muted": p.amberMuted,
    "--accent-blue": p.accentBlue,
    "--bg-glow-1": p.bgGlow1,
    "--bg-glow-2": p.bgGlow2,
    "--glow": p.bgGlow1, // alias maquette

    // Tokens sc-mfd existants — desktop (styles/index.css :root)
    "--gold": p.accent,
    "--gold-soft": p.gold,
    "--gold-glow": `rgba(${rgb},0.18)`,
    "--amber-line": `rgba(${rgb},0.28)`,

    // Tokens sc-mfd existants — tablette (Tailwind @theme)
    "--color-gold": p.accent,
    "--color-goldsoft": p.gold,
  };
}
