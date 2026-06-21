// @sc-mfd/shared — table des actions MFD (build SC 4.8).
// Données pures issues du rapport de mapping. Aucune logique ici.
//
// Règle de transcription :
//   - action assignée dans le rapport → status "default", bind = touche réelle.
//   - action non assignée (—)         → status "to_assign", bind = null.
//
// Champ `activation` : mode d'activation lu dans defaultProfile.plain.xml
//   (attribut `activationMode`). "press" = press/tap (défaut), "long" =
//   delayed_press/delayed_hold (appui maintenu jusqu'au seuil), "hold" = all /
//   onPress+onRelease (maintenu continu). L'émulation (chantier B) s'en sert.
//
// Choix de structure (assignations d'ingénierie & refroidisseur) :
//   Les commandes à deux sens (increase/decrease, up/down) sont modélisées
//   comme DEUX actions distinctes plutôt qu'une action à double touche.
//   Raison : `MfdAction.bind` reste une seule `KeyBind`, et le protocole garde
//   le modèle « un actionId = une commande » (cf. CommandMessage) sans champ
//   de direction. Côté tablette, un stepper +/- référence simplement deux ids.

import type { MfdAction } from "./types";

export const ACTIONS: MfdAction[] = [
  // ===== ÉNERGIE : alimentation =====
  {
    id: "v_power_toggle",
    labelFr: "Alimentation générale",
    labelEn: "Power toggle",
    mfd: "energie",
    filter: null,
    bind: { key: "u", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_power_toggle_thrusters",
    labelFr: "Propulseurs",
    labelEn: "Thrusters power",
    mfd: "energie",
    filter: null,
    bind: { key: "i", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_power_toggle_shields",
    labelFr: "Bouclier",
    labelEn: "Shields power",
    mfd: "energie",
    filter: null,
    bind: { key: "o", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_power_toggle_weapons",
    labelFr: "Armes",
    labelEn: "Weapons power",
    mfd: "energie",
    filter: null,
    bind: { key: "p", modifiers: [] },
    status: "default",
    activation: "press",
  },

  // ===== ÉNERGIE : répartition de puissance (steppers +/-) =====
  {
    id: "v_engineering_assignment_engine_increase",
    labelFr: "Moteurs +",
    labelEn: "Engine power +",
    mfd: "energie",
    filter: null,
    bind: { key: "f6", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_engineering_assignment_engine_decrease",
    labelFr: "Moteurs −",
    labelEn: "Engine power −",
    mfd: "energie",
    filter: null,
    bind: { key: "f6", modifiers: ["lalt"] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_engineering_assignment_shields_increase",
    labelFr: "Boucliers +",
    labelEn: "Shields power +",
    mfd: "energie",
    filter: null,
    bind: { key: "f7", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_engineering_assignment_shields_decrease",
    labelFr: "Boucliers −",
    labelEn: "Shields power −",
    mfd: "energie",
    filter: null,
    bind: { key: "f7", modifiers: ["lalt"] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_engineering_assignment_weapons_increase",
    labelFr: "Armes +",
    labelEn: "Weapons power +",
    mfd: "energie",
    filter: null,
    bind: { key: "f5", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_engineering_assignment_weapons_decrease",
    labelFr: "Armes −",
    labelEn: "Weapons power −",
    mfd: "energie",
    filter: null,
    bind: { key: "f5", modifiers: ["lalt"] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_cooler_throttle_up",
    labelFr: "Refroidisseur +",
    labelEn: "Cooler +",
    mfd: "energie",
    filter: null,
    bind: { key: "f1", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_cooler_throttle_down",
    labelFr: "Refroidisseur −",
    labelEn: "Cooler −",
    mfd: "energie",
    filter: null,
    bind: { key: "f2", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },

  // ===== ÉNERGIE : modes & trafic =====
  // CORRECTION (chantier profil A) : « Mode Quantum » de la maquette = en réalité
  // le cycle du mode master (NAV ⇄ SCM) par APPUI LONG sur B. L'ancienne entrée
  // v_toggle_quantum_mode (non mappée par défaut) ne correspondait pas au geste
  // du joueur. defaultProfile : activationMode="delayed_press" keyboard="b".
  {
    id: "v_master_mode_cycle_long",
    labelFr: "Mode Quantum",
    labelEn: "Master mode cycle (long press, NAV/SCM)",
    mfd: "energie",
    filter: null,
    bind: { key: "b", modifiers: [] },
    status: "default",
    activation: "long",
  },
  {
    id: "v_atc_request",
    labelFr: "Demande d'atterrissage",
    labelEn: "ATC request",
    mfd: "energie",
    filter: null,
    bind: { key: "n", modifiers: ["lalt"] },
    status: "default",
    activation: "press",
  },
  // CORRECTION (chantier profil A) : amarrage = APPUI LONG. defaultProfile :
  // activationMode="delayed_hold" keyboard="n" (maintenir N).
  {
    id: "v_invoke_docking",
    labelFr: "Amarrage",
    labelEn: "Docking",
    mfd: "energie",
    filter: null,
    bind: { key: "n", modifiers: [] },
    status: "default",
    activation: "long",
  },

  // ===== CONFIG / VOL : pilotage =====
  {
    id: "v_ifcs_vector_decoupling_toggle",
    labelFr: "Mode découplé",
    labelEn: "Decoupled mode",
    mfd: "config",
    filter: "vol",
    bind: { key: "c", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_ifcs_throttle_swap_mode",
    labelFr: "Régulateur",
    labelEn: "Cruise (throttle swap)",
    mfd: "config",
    filter: "vol",
    bind: { key: "c", modifiers: ["lalt"] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_ifcs_gsafe_on",
    labelFr: "G-Safe — activer",
    labelEn: "G-Safe on",
    mfd: "config",
    filter: "vol",
    bind: { key: "g", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_ifcs_gsafe_off",
    labelFr: "G-Safe — désactiver",
    labelEn: "G-Safe off",
    mfd: "config",
    filter: "vol",
    bind: { key: "h", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_ifcs_toggle_esp",
    labelFr: "ESP",
    labelEn: "ESP (aim assist)",
    mfd: "config",
    filter: "vol",
    bind: { key: "e", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  // CORRECTION (chantier profil A) : le limiteur de vitesse n'est PAS un simple
  // toggle. Le geste réel du joueur = « +/- un cran », sur MOLETTE par défaut
  // (lalt+mwheel_up / lalt+mwheel_down). On le modélise en stepper +/− comme les
  // puissances. Côté touche : NON ASSIGNÉ (molette par défaut → on imposera une
  // touche simple dans le profil, chantier C).
  {
    id: "v_ifcs_speed_limiter_increment",
    labelFr: "Limiteur +",
    labelEn: "Speed limiter +",
    mfd: "config",
    filter: "vol",
    bind: { key: "f3", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_ifcs_speed_limiter_decrement",
    labelFr: "Limiteur −",
    labelEn: "Speed limiter −",
    mfd: "config",
    filter: "vol",
    bind: { key: "f4", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_lights",
    labelFr: "Phares",
    labelEn: "Lights",
    mfd: "config",
    filter: "vol",
    bind: { key: "l", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_light_amplification_toggle",
    labelFr: "Amplification lumineuse",
    labelEn: "Light amplification",
    mfd: "config",
    filter: "vol",
    bind: { key: "l", modifiers: ["ralt"] },
    status: "default",
    activation: "press",
  },

  // ===== CONFIG / ARMES =====
  {
    id: "v_weapon_gimbals_state_toggle",
    labelFr: "Cadran verrouillé",
    labelEn: "Gimbal lock",
    mfd: "config",
    filter: "armes",
    bind: { key: "g", modifiers: [] },
    status: "default",
    activation: "press",
  },
  {
    id: "v_weapon_pip_prec_line_toggle",
    labelFr: "Ligne de précision",
    labelEn: "Precision aim line",
    mfd: "config",
    filter: "armes",
    bind: { key: "s", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_weapon_pip_toggle_lead_lag",
    labelFr: "Pips de latence",
    labelEn: "Lead/lag pips",
    mfd: "config",
    filter: "armes",
    bind: { key: "d", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_weapon_pip_fade_toggle",
    labelFr: "Fondu pip",
    labelEn: "Pip fade",
    mfd: "config",
    filter: "armes",
    bind: { key: "f", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_weapon_pip_combination_type_set_single",
    labelFr: "Pip individuel",
    labelEn: "Single pip",
    mfd: "config",
    filter: "armes",
    bind: { key: "v", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_weapon_staggered_fire_toggle",
    labelFr: "Tir échelonné",
    labelEn: "Staggered fire",
    mfd: "config",
    filter: "armes",
    bind: { key: "t", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },

  // ===== CONFIG / HUD =====
  {
    id: "v_flight_advanced_hud_toggle",
    labelFr: "HUD avancé",
    labelEn: "Advanced HUD",
    mfd: "config",
    filter: "hud",
    bind: { key: "k", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_mfd_soft_select_cast_left_short",
    labelFr: "Cast MFD gauche",
    labelEn: "MFD soft select left",
    mfd: "config",
    filter: "hud",
    bind: { key: "o", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
  {
    id: "v_mfd_soft_select_cast_right_short",
    labelFr: "Cast MFD droite",
    labelEn: "MFD soft select right",
    mfd: "config",
    filter: "hud",
    bind: { key: "p", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },

  // ===== DIAGNOSTIC =====
  {
    id: "v_mfd_quick_action_repair_all",
    labelFr: "Tout réparer",
    labelEn: "Repair all",
    mfd: "diagnostic",
    filter: null,
    bind: { key: "r", modifiers: ["rctrl"] },
    status: "profile",
    activation: "press",
  },
];
