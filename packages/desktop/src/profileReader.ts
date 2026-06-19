// Lecture DYNAMIQUE du profil de touches du joueur (chantier C2).
//
// But : produire en mémoire un mapping "action → touche RÉELLE du joueur" en
// croisant deux sources, par priorité :
//   1. actionmaps.xml du joueur (rebind clavier kb1_) — gagne s'il existe.
//   2. defaultProfile (touche par défaut du jeu) — sinon.
//   3. ni l'un ni l'autre → "à assigner" (nos 16 actions to_assign).
//
// Le Rust fournit le TEXTE BRUT des deux fichiers (commande read_keybind_sources).
// Ici on parse avec DOMParser (natif, robuste) et on résout pour chaque action de
// @sc-mfd/shared. RIEN n'est branché sur l'émulation : c'est une lecture de preuve.

import { invoke } from "@tauri-apps/api/core";
import { ACTIONS } from "@sc-mfd/shared";
import type { MfdAction } from "@sc-mfd/shared";

export type BindSource = "joueur" | "défaut" | "à assigner";
export type Activation = "press" | "long" | "hold";

/** Mapping résolu d'une action vers sa touche réelle. */
export interface ResolvedBind {
  id: string;
  labelFr: string;
  /** Touche principale (ex "u", "f6", "insert"), null si non mappé clavier. */
  key: string | null;
  /** Modificateurs (lalt/ralt/lctrl/rctrl/lshift/rshift), [] si aucun. */
  modifiers: string[];
  activation: Activation;
  source: BindSource;
  /** Input brut d'origine (ex "kb1_insert" côté joueur, "lalt+n" côté défaut). */
  rawInput: string | null;
  /** actionmap d'origine (contexte SC), pour distinguer les homonymes. */
  context: string | null;
  /** Rebinds NON-clavier du joueur (js*, mo*) — signalés, pas utilisés. */
  otherDevices: string[];
  notes: string[];
}

export interface ProfileReadResult {
  binds: ResolvedBind[];
  playerPath: string | null;
  defaultPath: string | null;
  playerFound: boolean;
  defaultFound: boolean;
  warnings: string[];
}

/** Miroir du KeybindSources renvoyé par Rust. */
interface KeybindSources {
  player_path: string | null;
  player_xml: string | null;
  default_path: string | null;
  default_xml: string | null;
  warnings: string[];
}

const MODIFIERS = new Set(["lalt", "ralt", "lctrl", "rctrl", "lshift", "rshift"]);

/**
 * Partitionne une combinaison SC en {key, modifiers}, ORDRE INDIFFÉRENT.
 * Le defaultProfile mélange les deux ordres : "lalt+n" (mod d'abord) ET
 * "f6+lalt" (mod en dernier). On classe chaque token par appartenance à
 * l'ensemble des modificateurs ; le token restant est la touche.
 */
function parseCombo(raw: string): { key: string | null; modifiers: string[] } {
  const tokens = raw
    .split("+")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  const modifiers: string[] = [];
  let key: string | null = null;
  for (const t of tokens) {
    if (MODIFIERS.has(t)) modifiers.push(t);
    else key = t; // un seul non-modificateur attendu = la touche
  }
  return { key, modifiers };
}

/** Entrée souris/molette (mwheel_*, mouseN, maxis_*) : présente dans l'attribut
 *  `keyboard` du jeu mais NON émulable au clavier. À signaler pour C3. */
function isMouseLike(key: string | null): boolean {
  return key != null && /^(mwheel_|mouse\d|maxis_)/.test(key);
}

/** activationMode SC → notre Activation. null si l'attribut est absent. */
function mapActivation(mode: string | null | undefined): Activation | null {
  if (!mode) return null;
  if (mode === "delayed_press" || mode === "delayed_hold") return "long";
  if (mode === "hold") return "hold";
  return "press"; // press, tap, tap_quicker, double_tap, … = appui simple/court
}

function parseError(doc: Document): string | null {
  const err = doc.getElementsByTagName("parsererror");
  return err.length > 0 ? (err[0].textContent ?? "XML invalide") : null;
}

interface PlayerEntry {
  /** Input clavier après "kb1_" (peut être " " si vidé), null si aucun rebind kb. */
  kbRaw: string | null;
  otherDevices: string[];
  activationMode: string | null;
  context: string;
}

/** Parse actionmaps.xml du joueur : action → rebind clavier + autres périph. */
function parsePlayer(xml: string): Map<string, PlayerEntry> {
  const map = new Map<string, PlayerEntry>();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const perr = parseError(doc);
  if (perr) throw new Error(`actionmaps.xml joueur : ${perr.slice(0, 120)}`);

  for (const act of Array.from(doc.getElementsByTagName("action"))) {
    const parent = act.parentElement;
    if (!parent || parent.tagName !== "actionmap") continue; // contexte sûr
    const name = act.getAttribute("name");
    if (!name) continue;
    const context = parent.getAttribute("name") ?? "";

    let kbRaw: string | null = null;
    const otherDevices: string[] = [];
    let activationMode = act.getAttribute("activationMode");

    for (const rb of Array.from(act.getElementsByTagName("rebind"))) {
      const input = rb.getAttribute("input") ?? "";
      const rbAct = rb.getAttribute("activationMode");
      if (rbAct) activationMode = rbAct;
      if (input.startsWith("kb1_")) {
        kbRaw = input.slice(4); // garde l'espace éventuel (vidage explicite)
      } else {
        const t = input.trim();
        // Ignore les binds périphériques VIDÉS (ex "js2_ " → "js2_") : préfixe
        // d'appareil sans touche. On ne signale que les vrais binds js*/mo*/gp*.
        if (t.length > 0 && !/^(js|mo|gp|kb)\d*_$/.test(t)) otherDevices.push(t);
      }
    }

    // Homonymes multi-contextes (défensif) : garder l'entrée porteuse d'un kb.
    const existing = map.get(name);
    if (!existing) {
      map.set(name, { kbRaw, otherDevices, activationMode, context });
    } else {
      if (existing.kbRaw == null && kbRaw != null) {
        existing.kbRaw = kbRaw;
        existing.activationMode = activationMode ?? existing.activationMode;
        existing.context = context;
      }
      existing.otherDevices.push(...otherDevices);
    }
  }
  return map;
}

interface DefaultEntry {
  keyboard: string | null;
  activationMode: string | null;
  context: string;
}

/** Parse defaultProfile : action → touche clavier par défaut + activationMode. */
function parseDefault(xml: string): Map<string, DefaultEntry> {
  const map = new Map<string, DefaultEntry>();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const perr = parseError(doc);
  if (perr) throw new Error(`defaultProfile : ${perr.slice(0, 120)}`);

  for (const act of Array.from(doc.getElementsByTagName("action"))) {
    const parent = act.parentElement;
    if (!parent || parent.tagName !== "actionmap") continue; // exclut <actiongroup>
    const name = act.getAttribute("name");
    if (!name) continue;
    const keyboard = act.getAttribute("keyboard");
    const activationMode = act.getAttribute("activationMode");
    const context = parent.getAttribute("name") ?? "";

    const hasKb = keyboard != null && keyboard.trim().length > 0;
    const existing = map.get(name);
    if (!existing) {
      map.set(name, { keyboard, activationMode, context });
    } else if (hasKb && !(existing.keyboard && existing.keyboard.trim().length > 0)) {
      // priorité à l'entrée qui porte effectivement une touche clavier
      map.set(name, { keyboard, activationMode, context });
    }
  }
  return map;
}

/** Résout une action de shared en croisant joueur (prio) puis défaut. */
function resolve(
  action: MfdAction,
  player: Map<string, PlayerEntry>,
  def: Map<string, DefaultEntry>
): ResolvedBind {
  const notes: string[] = [];
  const pl = player.get(action.id);
  const df = def.get(action.id);
  const otherDevices = pl ? [...pl.otherDevices] : [];

  // Activation : un rebind joueur peut l'avoir changée ; sinon shared fait foi
  // (shared reflète déjà l'activationMode par défaut du jeu).
  let activation: Activation = action.activation;
  const plAct = mapActivation(pl?.activationMode);
  if (plAct && plAct !== activation) {
    notes.push(`activation modifiée par le joueur: ${pl?.activationMode} → ${plAct}`);
    activation = plAct;
  }

  const base = { id: action.id, labelFr: action.labelFr, activation, otherDevices, notes };

  // 1) Rebind clavier du joueur (prioritaire)
  if (pl && pl.kbRaw != null) {
    const trimmed = pl.kbRaw.trim();
    if (trimmed.length === 0) {
      // Vidage explicite : le joueur a retiré la touche clavier → non mappé.
      notes.push("clavier explicitement vidé par le joueur (kb1_ vide)");
      return {
        ...base,
        key: null,
        modifiers: [],
        source: "à assigner",
        rawInput: "kb1_(vide)",
        context: pl.context ?? null,
      };
    }
    const { key, modifiers } = parseCombo(trimmed);
    return {
      ...base,
      key,
      modifiers,
      source: "joueur",
      rawInput: `kb1_${trimmed}`,
      context: pl.context ?? null,
    };
  }

  // 2) Touche par défaut du jeu
  if (df && df.keyboard && df.keyboard.trim().length > 0) {
    const { key, modifiers } = parseCombo(df.keyboard.trim());
    if (isMouseLike(key)) {
      // Le jeu range la molette/souris dans l'attribut `keyboard` (ex limiteur =
      // lalt+mwheel_up). C'est un VRAI défaut, mais non émulable au clavier →
      // restera "à assigner" pour nous (touche imposée en C3).
      notes.push(`défaut souris/molette non émulable: ${df.keyboard.trim()} (touche à imposer en C3)`);
      return {
        ...base,
        key: null,
        modifiers: [],
        source: "à assigner",
        rawInput: df.keyboard.trim(),
        context: df.context ?? null,
      };
    }
    return {
      ...base,
      key,
      modifiers,
      source: "défaut",
      rawInput: df.keyboard.trim(),
      context: df.context ?? null,
    };
  }

  // 3) Ni joueur ni défaut → à assigner (nos to_assign)
  return {
    ...base,
    key: null,
    modifiers: [],
    source: "à assigner",
    rawInput: null,
    context: df?.context ?? null,
  };
}

/** Libellé lisible d'une touche résolue (ex "Alt + N", "Insert", "—"). */
export function formatKey(b: ResolvedBind): string {
  if (b.key == null) return "—";
  const pretty = (s: string) =>
    ({ lalt: "LAlt", ralt: "RAlt", lctrl: "LCtrl", rctrl: "RCtrl", lshift: "LShift", rshift: "RShift" }[s] ??
      s.toUpperCase());
  return [...b.modifiers.map(pretty), b.key.toUpperCase()].join(" + ");
}

/**
 * Point d'entrée : lit les 2 fichiers via Rust et construit le mapping résolu
 * pour toutes les actions de shared. Ne jette pas : encapsule les erreurs en
 * warnings pour que la vue debug reste affichable.
 */
export async function readProfiles(): Promise<ProfileReadResult> {
  let src: KeybindSources;
  try {
    src = await invoke<KeybindSources>("read_keybind_sources");
  } catch (e) {
    // invoke a rejeté : commande absente (binaire Rust pas recompilé : redémarrer
    // `tauri dev`), ou hors contexte Tauri. On renvoie un résultat affichable.
    return {
      binds: [],
      playerPath: null,
      defaultPath: null,
      playerFound: false,
      defaultFound: false,
      warnings: [
        `Commande Rust « read_keybind_sources » indisponible : ${String(e)}`,
        "→ Si tauri dev tournait déjà, REDÉMARRE-le entièrement (le Rust doit être recompilé).",
      ],
    };
  }
  const warnings = [...src.warnings];

  let player = new Map<string, PlayerEntry>();
  let def = new Map<string, DefaultEntry>();
  if (src.player_xml) {
    try {
      player = parsePlayer(src.player_xml);
    } catch (e) {
      warnings.push(String(e));
    }
  }
  if (src.default_xml) {
    try {
      def = parseDefault(src.default_xml);
    } catch (e) {
      warnings.push(String(e));
    }
  }

  const binds = ACTIONS.map((a) => resolve(a, player, def));
  return {
    binds,
    playerPath: src.player_path,
    defaultPath: src.default_path,
    playerFound: Boolean(src.player_xml),
    defaultFound: Boolean(src.default_xml),
    warnings,
  };
}
