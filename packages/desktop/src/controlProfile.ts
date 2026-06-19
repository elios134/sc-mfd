// Génération + dépôt du control-profile « SC MFD » (chantier C3b).
//
// Format = control-profile que SC attend (racine <ActionMaps profileName=…> +
// <CustomisationUIHeader>, PAS <ActionProfiles>), vérifié sur un export réel
// (layout_Eliosmaps_exported.xml).
//
// APPROCHE HYBRIDE & SÛRE : un control-profile sélectionné dans SC REMPLACE le
// jeu de binds (un export contient TOUT) → pour ne RIEN faire perdre au joueur,
// on repart de SON profil actif (actionmaps.xml brut : clavier ET joystick) et on
// AJOUTE nos 16 binds rctrl+. Le Rust n'écrit que SCMFD.xml (jamais le profil
// joueur). Régénéré à chaque démarrage → suit les changements de touches.

import { invoke } from "@tauri-apps/api/core";
import { ACTIONS } from "@sc-mfd/shared";

const PROFILE_NAME = "SC MFD";

export interface DeployResult {
  ok: boolean;
  path: string | null;
  bytes: number | null;
  added: number; // nb de nos binds injectés
  error: string | null;
  at: number; // timestamp (stampé côté JS)
}

interface KeybindSources {
  player_xml: string | null;
  warnings: string[];
}

// actionmap SC de chacune de nos 16 actions. shared ne stocke pas le contexte SC
// (structurel au jeu) ; les TOUCHES, elles, viennent de shared (source unique).
const ACTIONMAP_OF: Record<string, string> = {
  v_cooler_throttle_up: "spaceship_general",
  v_cooler_throttle_down: "spaceship_general",
  v_ifcs_speed_limiter_increment: "spaceship_movement",
  v_ifcs_speed_limiter_decrement: "spaceship_movement",
  v_ifcs_gsafe_on: "spaceship_movement",
  v_ifcs_gsafe_off: "spaceship_movement",
  v_ifcs_toggle_esp: "spaceship_movement",
  v_weapon_pip_prec_line_toggle: "spaceship_weapons",
  v_weapon_pip_toggle_lead_lag: "spaceship_weapons",
  v_weapon_pip_fade_toggle: "spaceship_weapons",
  v_weapon_pip_combination_type_set_single: "spaceship_weapons",
  v_weapon_staggered_fire_toggle: "spaceship_weapons",
  v_flight_advanced_hud_toggle: "spaceship_movement",
  v_mfd_soft_select_cast_left_short: "vehicle_mfd",
  v_mfd_soft_select_cast_right_short: "vehicle_mfd",
  v_mfd_quick_action_repair_all: "vehicle_mfd",
};

interface Bind16 {
  id: string;
  map: string;
  input: string;
}

/** Nos 16 binds (id, actionmap, input "kb1_rctrl+…") construits depuis shared. */
function our16(): Bind16[] {
  return ACTIONS.filter((a) => ACTIONMAP_OF[a.id] && a.bind).map((a) => ({
    id: a.id,
    map: ACTIONMAP_OF[a.id],
    input: "kb1_" + [...a.bind!.modifiers, a.bind!.key].join("+"),
  }));
}

const childrenByTag = (el: Element, tag: string): Element[] =>
  Array.from(el.children).filter((c) => c.tagName === tag);

/** Base vide si le profil joueur est absent (machine sans rebinds perso). */
const EMPTY_BASE =
  '<ActionMaps><ActionProfiles version="1" optionsVersion="2" rebindVersion="2" profileName="default"></ActionProfiles></ActionMaps>';

/**
 * Construit le XML control-profile : reprend tout le profil joueur (ou base vide)
 * et injecte nos 16. Retourne le XML et le nombre de binds ajoutés.
 */
function buildXml(playerXml: string | null): { xml: string; added: number } {
  const parser = new DOMParser();
  let doc = parser.parseFromString(playerXml ?? EMPTY_BASE, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) {
    // Profil joueur illisible → on retombe sur une base vide (ne casse rien).
    doc = parser.parseFromString(EMPTY_BASE, "application/xml");
  }

  const root = doc.documentElement; // <ActionMaps>
  const ap = root.getElementsByTagName("ActionProfiles")[0] ?? null;

  // Attributs de version repris du profil joueur (sinon défauts SC).
  const ver = (n: string, d: string) => ap?.getAttribute(n) ?? root.getAttribute(n) ?? d;
  root.setAttribute("version", ver("version", "1"));
  root.setAttribute("optionsVersion", ver("optionsVersion", "2"));
  root.setAttribute("rebindVersion", ver("rebindVersion", "2"));
  root.setAttribute("profileName", PROFILE_NAME);

  // Devices déclarés dans l'en-tête, dérivés des <options> du joueur.
  const optionEls = ap ? childrenByTag(ap, "options") : [];
  const header = doc.createElement("CustomisationUIHeader");
  header.setAttribute("label", PROFILE_NAME);
  header.setAttribute(
    "description",
    "Genere par SC MFD Bridge - reprend vos touches + actions MFD (rctrl+...)."
  );
  header.setAttribute("image", "");
  const devices = doc.createElement("devices");
  const addDevice = (tag: string, inst: string) => {
    const el = doc.createElement(tag);
    el.setAttribute("instance", inst);
    devices.appendChild(el);
  };
  addDevice("keyboard", "1");
  addDevice("mouse", "1");
  // Joysticks RÉELLEMENT configurés (option avec un Product non vide).
  const seen = new Set<string>();
  for (const o of optionEls) {
    if (o.getAttribute("type") !== "joystick") continue;
    const product = (o.getAttribute("Product") ?? "").trim();
    const inst = o.getAttribute("instance") ?? "1";
    if (product.length === 0 || seen.has(inst)) continue;
    seen.add(inst);
    addDevice("joystick", inst);
  }
  header.appendChild(devices);
  header.appendChild(doc.createElement("categories")); // <categories/> (suffisant)

  // Remonte le contenu d'ActionProfiles (options, modifiers, actionmaps) sous la
  // racine, puis retire l'enveloppe ActionProfiles (format control-profile).
  if (ap) {
    for (const node of Array.from(ap.childNodes)) root.appendChild(node);
    root.removeChild(ap);
  }
  // En-tête en premier enfant.
  root.insertBefore(header, root.firstChild);

  // Injection de nos 16 binds dans le bon actionmap.
  let added = 0;
  for (const b of our16()) {
    let am = childrenByTag(root, "actionmap").find((c) => c.getAttribute("name") === b.map);
    if (!am) {
      am = doc.createElement("actionmap");
      am.setAttribute("name", b.map);
      root.appendChild(am);
    }
    let action = childrenByTag(am, "action").find((c) => c.getAttribute("name") === b.id);
    if (!action) {
      action = doc.createElement("action");
      action.setAttribute("name", b.id);
      am.appendChild(action);
    }
    const exists = childrenByTag(action, "rebind").some((c) => c.getAttribute("input") === b.input);
    if (!exists) {
      const rb = doc.createElement("rebind");
      rb.setAttribute("input", b.input);
      action.appendChild(rb);
      added++;
    }
  }

  // Pas de déclaration <?xml?> : les fichiers SC n'en ont pas.
  const xml = new XMLSerializer().serializeToString(root);
  return { xml, added };
}

/**
 * Génère le control-profile depuis le profil joueur courant et le DÉPOSE via Rust.
 * Silencieux et non bloquant : toute erreur est renvoyée dans le résultat.
 */
export async function deployControlProfile(): Promise<DeployResult> {
  const at = Date.now();
  try {
    const src = await invoke<KeybindSources>("read_keybind_sources");
    const { xml, added } = buildXml(src.player_xml ?? null);
    const res = await invoke<{ path: string; bytes: number }>("write_control_profile", { xml });
    return { ok: true, path: res.path, bytes: res.bytes, added, error: null, at };
  } catch (e) {
    return { ok: false, path: null, bytes: null, added: 0, error: String(e), at };
  }
}
