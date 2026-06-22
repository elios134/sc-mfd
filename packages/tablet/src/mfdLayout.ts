// Layout d'UI de la tablette — décrit COMMENT afficher les écrans MFD.
// shared (@sc-mfd/shared) décrit les actions (id, touche, libellé) ;
// ce fichier décrit leur disposition visuelle et référence chaque action par id.
//
// Rien n'est inventé ici : chaque actionId doit exister dans ACTIONS de shared.
// `findUnresolvedActionIds()` permet de vérifier ce contrat au runtime.

import { ACTIONS } from "@sc-mfd/shared";
import type { ConfigFilter, MfdAction } from "@sc-mfd/shared";

/** Index id → action, pour récupérer libellés/binds depuis shared. */
export const ACTION_BY_ID: Map<string, MfdAction> = new Map(
  ACTIONS.map((a) => [a.id, a])
);

/** Bouton on/off. `actionIdOff` n'est utilisé que pour les toggles dont le jeu
 *  a DEUX commandes distinctes (ex G-Safe on/off, cast MFD gauche/droite). */
export interface ToggleElement {
  kind: "toggle";
  actionId: string;
  actionIdOff?: string;
  /** Libellé d'affichage ; sinon labelFr de l'action est utilisé. */
  label?: string;
}

/** Paire increase/decrease (ex moteur +/−). */
export interface StepperElement {
  kind: "stepper";
  label: string;
  incActionId: string;
  decActionId: string;
}

/** Bouton simple (impulsion). */
export interface ActionElement {
  kind: "action";
  actionId: string;
  label?: string;
  /** Texte de la pastille d'appel à l'action (ex "Demander"). */
  cta?: string;
  /** "big" = grosse action pleine largeur. */
  variant?: "default" | "big";
}

export type LayoutElement = ToggleElement | StepperElement | ActionElement;

export interface LayoutGroup {
  label: string;
  columns: 1 | 2 | 3 | 4;
  elements: LayoutElement[];
  /** Note honnête sous le groupe (italique). */
  note?: string;
}

export interface ConfigFilterTab {
  id: ConfigFilter;
  label: string;
  groups: LayoutGroup[];
}

// ===================== ÉCRAN ÉNERGIE =====================
export const ENERGIE_GROUPS: LayoutGroup[] = [
  {
    label: "Alimentation",
    columns: 4,
    elements: [
      { kind: "toggle", actionId: "v_power_toggle" },
      { kind: "toggle", actionId: "v_power_toggle_thrusters" },
      { kind: "toggle", actionId: "v_power_toggle_shields" },
      { kind: "toggle", actionId: "v_power_toggle_weapons" },
    ],
  },
  {
    label: "Répartition de puissance",
    columns: 2,
    elements: [
      {
        kind: "stepper",
        label: "Moteurs",
        incActionId: "v_engineering_assignment_engine_increase",
        decActionId: "v_engineering_assignment_engine_decrease",
      },
      {
        kind: "stepper",
        label: "Boucliers",
        incActionId: "v_engineering_assignment_shields_increase",
        decActionId: "v_engineering_assignment_shields_decrease",
      },
      {
        kind: "stepper",
        label: "Armes",
        incActionId: "v_engineering_assignment_weapons_increase",
        decActionId: "v_engineering_assignment_weapons_decrease",
      },
      // Reset de la répartition (touche jeu réelle f8) — déclencheur, pas d'état.
      { kind: "action", actionId: "v_engineering_assignment_reset", label: "Réinitialiser", cta: "Reset" },
    ],
  },
  {
    // Master Mode et Amarrage sont désormais des BOUTONS PERSISTANTS (cf.
    // PERSISTENT_BUTTONS, sur chaque écran) → on ne les duplique plus ici.
    // Reste la demande ATC, propre à l'écran Énergie.
    label: "Trafic",
    columns: 1,
    elements: [
      { kind: "action", actionId: "v_atc_request", label: "Demande d'atterrissage", cta: "Demander" },
    ],
  },
];

// ===================== ÉCRAN CONFIG =====================
export const CONFIG_FILTERS: ConfigFilterTab[] = [
  {
    id: "vol",
    label: "Vol",
    groups: [
      {
        // Tous des toggles « purs » (une commande = une touche ; le jeu bascule
        // son propre état). Pas de paire on/off, pas de faux état affiché.
        label: "Pilotage",
        columns: 4,
        elements: [
          { kind: "toggle", actionId: "v_ifcs_vector_decoupling_toggle", label: "Découplé" },
          { kind: "toggle", actionId: "v_ifcs_throttle_swap_mode", label: "Croisière" },
          { kind: "toggle", actionId: "v_ifcs_gravity_compensation_toggle", label: "Compensation G" },
          { kind: "toggle", actionId: "v_auto_precision_mode_toggle", label: "Ralentissement auto" },
          { kind: "toggle", actionId: "v_ifcs_toggle_gforce_safety", label: "Anti-G" },
          { kind: "toggle", actionId: "v_ifcs_toggle_esp", label: "ESP" },
          { kind: "toggle", actionId: "v_ifcs_proximity_assist_toggle", label: "Assist. proximité" },
          { kind: "toggle", actionId: "v_ifcs_speed_limiter_toggle", label: "Limiteur" },
        ],
      },
    ],
  },
  {
    id: "armes",
    label: "Armes",
    groups: [
      {
        label: "Visée",
        columns: 4,
        elements: [
          { kind: "toggle", actionId: "v_weapon_gimbals_state_toggle", label: "Cardan verrouillé" },
          { kind: "toggle", actionId: "v_weapon_pip_prec_line_toggle", label: "Ligne de précision" },
          { kind: "toggle", actionId: "v_weapon_pip_toggle_lead_lag", label: "Pip de latence" },
          { kind: "toggle", actionId: "v_weapon_pip_fade_toggle", label: "Fondu des pips" },
        ],
      },
      {
        label: "Affichage tir",
        columns: 3,
        elements: [
          { kind: "toggle", actionId: "v_weapon_pip_combination_type_toggle", label: "Pips individuels" },
          { kind: "toggle", actionId: "v_weapon_ui_scale_toggle", label: "Agrandir symboles" },
          { kind: "toggle", actionId: "v_weapon_staggered_fire_toggle", label: "Tir échelonné" },
        ],
      },
    ],
  },
];

// ===================== ÉCRAN BOUCLIERS =====================
// 4 faces directionnelles + reset. Donnée pure (action par face) ; le rendu est
// propre à chaque UI : boutons disposés (SCFM) ou schéma circulaire (variante B).
// Pas de valeur de niveau ici : ce sont des déclencheurs, aucun faux état.
export interface ShieldFace {
  dir: "avant" | "arriere" | "babord" | "tribord";
  label: string;
  actionId: string;
}
export const SHIELD_FACES: ShieldFace[] = [
  { dir: "avant", label: "Avant", actionId: "v_shield_raise_level_forward" },
  { dir: "arriere", label: "Arrière", actionId: "v_shield_raise_level_back" },
  { dir: "babord", label: "Bâbord", actionId: "v_shield_raise_level_left" },
  { dir: "tribord", label: "Tribord", actionId: "v_shield_raise_level_right" },
];
export const SHIELD_RESET_ACTION = "v_shield_reset_level";

// Contre-mesures (à droite du renforcement directionnel) — actions réelles de shared.
export const SHIELD_COUNTERMEASURES = {
  decoyLaunch: "v_weapon_countermeasure_decoy_launch",
  noiseLaunch: "v_weapon_countermeasure_noise_launch",
  burstIncId: "v_weapon_countermeasure_decoy_burst_increase",
  burstDecId: "v_weapon_countermeasure_decoy_burst_decrease",
  panicId: "v_weapon_countermeasure_decoy_launch_panic",
} as const;

// ===================== ÉCRAN ÉNERGIE — vue « colonnes » (variante B) =====================
// 3 systèmes en colonnes (maquette variante B) : +/− = répartition de puissance,
// bouton d'action = toggle d'alimentation du système (icône). Tous les ids sont
// déjà dans shared (réutilisés depuis ENERGIE_GROUPS). SCFM garde sa vue en grille.
export interface EnergieSystem {
  key: "armes" | "boucliers" | "propulsion";
  label: string;
  incActionId: string;
  decActionId: string;
  powerToggleId: string;
}
export const ENERGIE_SYSTEMS: EnergieSystem[] = [
  {
    key: "armes",
    label: "ARMES",
    incActionId: "v_engineering_assignment_weapons_increase",
    decActionId: "v_engineering_assignment_weapons_decrease",
    powerToggleId: "v_power_toggle_weapons",
  },
  {
    key: "boucliers",
    label: "BOUCLIERS",
    incActionId: "v_engineering_assignment_shields_increase",
    decActionId: "v_engineering_assignment_shields_decrease",
    powerToggleId: "v_power_toggle_shields",
  },
  {
    key: "propulsion",
    label: "PROPULSION",
    incActionId: "v_engineering_assignment_engine_increase",
    decActionId: "v_engineering_assignment_engine_decrease",
    powerToggleId: "v_power_toggle_thrusters",
  },
];

// ===================== ÉCRAN MISSILES (gestion seule, pas le tir) =====================
export const MISSILES_GROUPS: LayoutGroup[] = [
  {
    label: "Type de missile",
    columns: 2,
    elements: [
      { kind: "action", actionId: "v_weapon_cycle_missile_back", label: "Type précédent", cta: "‹" },
      { kind: "action", actionId: "v_weapon_cycle_missile_fwd", label: "Type suivant", cta: "›" },
    ],
  },
  {
    label: "Missiles armés",
    columns: 2,
    elements: [
      {
        kind: "stepper",
        label: "Armés",
        incActionId: "v_weapon_increase_max_missiles",
        decActionId: "v_weapon_decrease_max_missiles",
      },
      { kind: "action", actionId: "v_weapon_reset_max_missiles", label: "Réinitialiser", cta: "Reset" },
    ],
  },
  {
    label: "Bombes",
    columns: 2,
    elements: [
      { kind: "action", actionId: "v_weapon_bombing_toggle_desired_impact_point", label: "Point d'impact", cta: "Activer" },
      {
        kind: "stepper",
        label: "Portée HUD",
        incActionId: "v_weapon_bombing_hud_range_increase",
        decActionId: "v_weapon_bombing_hud_range_decrease",
      },
      { kind: "action", actionId: "v_weapon_bombing_hud_range_reset", label: "Portée reset", cta: "Reset" },
    ],
  },
];

// ===================== BOUTONS PERSISTANTS (toujours visibles sur chaque écran) =====================
// Phares · Master Mode (au milieu, appui LONG) · Amplification lumineuse.
// Atterrissage/Amarrage ne sont plus persistants → déplacés sur l'écran Énergie (LANDING_DOCKING).
export interface PersistentButton {
  actionId: string;
  label: string;
}
export const PERSISTENT_BUTTONS: PersistentButton[] = [
  { actionId: "v_lights", label: "Phares" },
  { actionId: "v_master_mode_cycle_long", label: "Master Mode" },
  { actionId: "v_light_amplification_toggle", label: "Amplification lumineuse" },
];

// Atterrissage / Amarrage — déplacés des boutons persistants vers l'écran Énergie.
export const LANDING_DOCKING: PersistentButton[] = [
  { actionId: "v_toggle_landing_system", label: "Atterrissage" },
  { actionId: "v_invoke_docking", label: "Amarrage" },
];

// ===================== HELPERS =====================

/** Tous les actionId référencés par le layout. */
function referencedActionIds(): string[] {
  const ids: string[] = [];
  const collect = (groups: LayoutGroup[]) => {
    for (const g of groups) {
      for (const el of g.elements) {
        if (el.kind === "stepper") {
          ids.push(el.incActionId, el.decActionId);
        } else if (el.kind === "toggle") {
          ids.push(el.actionId);
          if (el.actionIdOff) ids.push(el.actionIdOff);
        } else {
          ids.push(el.actionId);
        }
      }
    }
  };
  collect(ENERGIE_GROUPS);
  CONFIG_FILTERS.forEach((f) => collect(f.groups));
  collect(MISSILES_GROUPS);
  SHIELD_FACES.forEach((f) => ids.push(f.actionId));
  ids.push(SHIELD_RESET_ACTION);
  ids.push(...Object.values(SHIELD_COUNTERMEASURES));
  PERSISTENT_BUTTONS.forEach((b) => ids.push(b.actionId));
  LANDING_DOCKING.forEach((b) => ids.push(b.actionId));
  ENERGIE_SYSTEMS.forEach((s) => ids.push(s.incActionId, s.decActionId, s.powerToggleId));
  return ids;
}

/** actionId référencés par le layout mais absents de shared (doit être vide). */
export function findUnresolvedActionIds(): string[] {
  return referencedActionIds().filter((id) => !ACTION_BY_ID.has(id));
}

/** Libellé FR d'une action depuis shared (fallback : l'id lui-même). */
export function labelFr(actionId: string): string {
  return ACTION_BY_ID.get(actionId)?.labelFr ?? actionId;
}

/** Libellé EN (utilisé comme sous-titre/hint), vide si inconnu. */
export function labelEn(actionId: string): string {
  return ACTION_BY_ID.get(actionId)?.labelEn ?? "";
}
