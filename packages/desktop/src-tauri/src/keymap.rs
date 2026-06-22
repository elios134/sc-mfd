// @generated par scripts/gen-keymap.mjs — NE PAS ÉDITER À LA MAIN.
// Source unique : packages/shared/actions.ts.
// Régénérer après toute modif de shared : npm run gen:keymap -w @sc-mfd/desktop
//
// Miroir Rust des binds de @sc-mfd/shared (le Rust ne peut pas importer le TS).

/// Liaison touche d'une action (miroir de KeyBind de shared).
#[derive(Debug, Clone, Copy)]
pub struct Bind {
    /// Touche principale en minuscule ("u", "f6", ...). Vide si non assignée.
    pub key: &'static str,
    /// Modificateurs ("lalt", "ralt", "lshift", "rshift", "lctrl", "rctrl").
    pub modifiers: &'static [&'static str],
    /// false = action "to_assign" (bind null de shared) : ne rien émuler.
    pub assigned: bool,
    /// Mode d'activation ("press" | "long" | "hold"). L'émulation de l'appui
    /// long (chantier B) s'appuie dessus ; un simple tap ne suffit pas pour "long".
    #[allow(dead_code)] // lu par l'émulation (chantier B), pas encore consommé.
    pub activation: &'static str,
}

/// Résout un actionId en Bind. None si l'actionId est inconnu de shared.
pub fn bind_for(action_id: &str) -> Option<Bind> {
    match action_id {
        "v_power_toggle" => Some(Bind { key: "u", modifiers: &[], assigned: true, activation: "press" }),
        "v_power_toggle_thrusters" => Some(Bind { key: "i", modifiers: &[], assigned: true, activation: "press" }),
        "v_power_toggle_shields" => Some(Bind { key: "o", modifiers: &[], assigned: true, activation: "press" }),
        "v_power_toggle_weapons" => Some(Bind { key: "p", modifiers: &[], assigned: true, activation: "press" }),
        "v_engineering_assignment_engine_increase" => Some(Bind { key: "f6", modifiers: &[], assigned: true, activation: "press" }),
        "v_engineering_assignment_engine_decrease" => Some(Bind { key: "f6", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_engineering_assignment_shields_increase" => Some(Bind { key: "f7", modifiers: &[], assigned: true, activation: "press" }),
        "v_engineering_assignment_shields_decrease" => Some(Bind { key: "f7", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_engineering_assignment_weapons_increase" => Some(Bind { key: "f5", modifiers: &[], assigned: true, activation: "press" }),
        "v_engineering_assignment_weapons_decrease" => Some(Bind { key: "f5", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_engineering_assignment_reset" => Some(Bind { key: "f8", modifiers: &[], assigned: true, activation: "press" }),
        "v_cooler_throttle_up" => Some(Bind { key: "f1", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_cooler_throttle_down" => Some(Bind { key: "f2", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_master_mode_cycle_long" => Some(Bind { key: "b", modifiers: &[], assigned: true, activation: "long" }),
        "v_atc_request" => Some(Bind { key: "n", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_invoke_docking" => Some(Bind { key: "n", modifiers: &[], assigned: true, activation: "long" }),
        "v_toggle_landing_system" => Some(Bind { key: "n", modifiers: &[], assigned: true, activation: "press" }),
        "v_ifcs_vector_decoupling_toggle" => Some(Bind { key: "c", modifiers: &[], assigned: true, activation: "press" }),
        "v_ifcs_throttle_swap_mode" => Some(Bind { key: "c", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_ifcs_gsafe_on" => Some(Bind { key: "g", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_gsafe_off" => Some(Bind { key: "h", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_toggle_esp" => Some(Bind { key: "e", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_speed_limiter_increment" => Some(Bind { key: "f3", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_speed_limiter_decrement" => Some(Bind { key: "f4", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_lights" => Some(Bind { key: "l", modifiers: &[], assigned: true, activation: "press" }),
        "v_light_amplification_toggle" => Some(Bind { key: "l", modifiers: &["ralt"], assigned: true, activation: "press" }),
        "v_ifcs_gravity_compensation_toggle" => Some(Bind { key: "w", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_auto_precision_mode_toggle" => Some(Bind { key: "q", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_toggle_gforce_safety" => Some(Bind { key: "j", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_proximity_assist_toggle" => Some(Bind { key: "i", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_ifcs_speed_limiter_toggle" => Some(Bind { key: "l", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_gimbals_state_toggle" => Some(Bind { key: "g", modifiers: &[], assigned: true, activation: "press" }),
        "v_weapon_pip_prec_line_toggle" => Some(Bind { key: "s", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_pip_toggle_lead_lag" => Some(Bind { key: "d", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_pip_fade_toggle" => Some(Bind { key: "f", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_pip_combination_type_set_single" => Some(Bind { key: "v", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_staggered_fire_toggle" => Some(Bind { key: "t", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_pip_combination_type_toggle" => Some(Bind { key: "n", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_ui_scale_toggle" => Some(Bind { key: "m", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_flight_advanced_hud_toggle" => Some(Bind { key: "k", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_mfd_soft_select_cast_left_short" => Some(Bind { key: "o", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_mfd_soft_select_cast_right_short" => Some(Bind { key: "p", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_mfd_quick_action_repair_all" => Some(Bind { key: "r", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_shield_raise_level_forward" => Some(Bind { key: "np_8", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_shield_raise_level_back" => Some(Bind { key: "np_2", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_shield_raise_level_left" => Some(Bind { key: "np_4", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_shield_raise_level_right" => Some(Bind { key: "np_6", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_shield_reset_level" => Some(Bind { key: "np_5", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_cycle_missile_fwd" => Some(Bind { key: "u", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_cycle_missile_back" => Some(Bind { key: "z", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_increase_max_missiles" => Some(Bind { key: "g", modifiers: &[], assigned: true, activation: "press" }),
        "v_weapon_decrease_max_missiles" => Some(Bind { key: "c", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_reset_max_missiles" => Some(Bind { key: "g", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_weapon_bombing_toggle_desired_impact_point" => Some(Bind { key: "b", modifiers: &["lalt"], assigned: true, activation: "press" }),
        "v_weapon_bombing_hud_range_increase" => Some(Bind { key: "f9", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_bombing_hud_range_decrease" => Some(Bind { key: "f10", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        "v_weapon_bombing_hud_range_reset" => Some(Bind { key: "f11", modifiers: &["rctrl"], assigned: true, activation: "press" }),
        _ => None,
    }
}
