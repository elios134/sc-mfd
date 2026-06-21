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
  /** "big" = grosse action pleine largeur (écran diagnostic). */
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
      {
        kind: "stepper",
        label: "Refroidisseur",
        incActionId: "v_cooler_throttle_up",
        decActionId: "v_cooler_throttle_down",
      },
    ],
  },
  {
    label: "Modes & trafic",
    columns: 3,
    elements: [
      // « Mode Quantum » = cycle du mode master (NAV ⇄ SCM) par appui long sur B.
      // C'est un CYCLE, pas un état binaire → bouton d'action (impulsion), pas un toggle.
      { kind: "action", actionId: "v_master_mode_cycle_long", label: "Mode Quantum", cta: "Cycler" },
      { kind: "action", actionId: "v_atc_request", cta: "Demander" },
      { kind: "action", actionId: "v_invoke_docking", cta: "Demander" },
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
        label: "Pilotage",
        columns: 4,
        elements: [
          { kind: "toggle", actionId: "v_ifcs_vector_decoupling_toggle" },
          { kind: "toggle", actionId: "v_ifcs_throttle_swap_mode" },
          // G-Safe : le jeu a DEUX commandes (on/off) — on/off -> deux actionId.
          {
            kind: "toggle",
            actionId: "v_ifcs_gsafe_on",
            actionIdOff: "v_ifcs_gsafe_off",
            label: "G-Safe",
          },
          { kind: "toggle", actionId: "v_ifcs_toggle_esp" },
        ],
      },
      {
        label: "Vitesse",
        columns: 1,
        elements: [
          // Limiteur de vitesse : stepper +/− (comme les puissances). Le jeu le
          // câble sur molette (lalt+mwheel) ; nos deux actionId increment/decrement
          // recevront une touche simple via le profil (chantier C).
          {
            kind: "stepper",
            label: "Limiteur",
            incActionId: "v_ifcs_speed_limiter_increment",
            decActionId: "v_ifcs_speed_limiter_decrement",
          },
        ],
      },
      {
        label: "Éclairage",
        columns: 2,
        elements: [
          { kind: "toggle", actionId: "v_lights" },
          { kind: "toggle", actionId: "v_light_amplification_toggle" },
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
          { kind: "toggle", actionId: "v_weapon_gimbals_state_toggle" },
          { kind: "toggle", actionId: "v_weapon_pip_prec_line_toggle" },
          { kind: "toggle", actionId: "v_weapon_pip_toggle_lead_lag" },
          { kind: "toggle", actionId: "v_weapon_pip_fade_toggle" },
        ],
      },
      {
        label: "Affichage tir",
        columns: 2,
        elements: [
          { kind: "toggle", actionId: "v_weapon_pip_combination_type_set_single" },
          { kind: "toggle", actionId: "v_weapon_staggered_fire_toggle" },
        ],
      },
    ],
  },
  {
    id: "hud",
    label: "HUD",
    groups: [
      {
        label: "Modes HUD",
        columns: 2,
        note: "Un seul toggle « HUD avancé » dans le jeu — il s'applique au mode courant (SCM ou NAV).",
        elements: [
          { kind: "toggle", actionId: "v_flight_advanced_hud_toggle" },
          // Cast MFD : gauche/droite = deux commandes distinctes -> deux boutons action.
          { kind: "action", actionId: "v_mfd_soft_select_cast_left_short", label: "Cast gauche", cta: "Caster" },
          { kind: "action", actionId: "v_mfd_soft_select_cast_right_short", label: "Cast droite", cta: "Caster" },
        ],
      },
    ],
  },
];

// ===================== ÉCRAN DIAGNOSTIC =====================
export const DIAGNOSTIC_GROUPS: LayoutGroup[] = [
  {
    label: "Réparation",
    columns: 1,
    note: "⚠ Seule la réparation globale a un raccourci dans le jeu. La réparation par composant se fait dans la vue Diagnostics du MFD in-game, pas pilotable depuis l'app.",
    elements: [
      { kind: "action", actionId: "v_mfd_quick_action_repair_all", label: "⚙ Tout réparer", variant: "big" },
    ],
  },
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
  collect(DIAGNOSTIC_GROUPS);
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
