# Audit exhaustif des commandes Star Citizen

Recensement en **lecture seule** de toutes les actions mappables du profil de touches par défaut. Aucune donnée inventée : une touche vide est notée `non assigné`, un libellé non résolu est noté `(libellé non trouvé: <clé>)`.

## Sources

- **Actions / catégories / touches par défaut** : `C:/Users/andre/Documents/scfleet-keybinds-extract/defaultProfile.plain.xml`
- **Noms FR affichés en jeu** : `C:/Users/andre/Documents/scfleet-datamining-stable/Data/Localization/french_(france)/global.ini`
- **Repli anglais** (préfixé `(EN)`) quand la clé est absente du FR : `C:/Users/andre/Documents/scfleet-datamining-stable/Data/Localization/english/global.ini`

La touche est l'attribut `keyboard` du profil par défaut. Les libellés `@ui_xxx` sont résolus via `global.ini` (FR d'abord, puis EN en repli).

## Résumé

- **Catégories (actionmap)** : 50
- **Actions totales** : 1100
- **Touches non assignées** (potentiel mappable) : 588
- **Libellés résolus en FR** : 604
- **Libellés résolus en repli EN** (absents du FR) : 114
- **Libellés introuvables** (absents FR et EN) : 37
- **Actions sans attribut `UILabel`** (non libellées dans le profil) : 345

---

## `seat_general` → Véhicules : sièges et modes d’opérateur

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_emergency_exit` | Siège de sortie d’urgence | `u+lshift` |
| `v_eject` | S’éjecter | `ralt+y` |
| `v_view_look_behind` | Regarder derrière | `comma` |
| `v_toggle_mining_mode` | Mode Extraction minière (ON/OFF) | `m` |
| `v_toggle_salvage_mode` | Mode Récupération (ON/OFF) | `m` |
| `v_toggle_refuel_mode` | (libellé non trouvé: ui_CIRefuelMode) | `m` |
| `v_toggle_scan_mode` | Mode Scan (ON/OFF) | `v` |
| `v_toggle_quantum_mode` | Système de voyage quantique (ON/OFF) | non assigné |
| `v_toggle_missile_mode` | Mode Tir de missiles (ON/OFF) | non assigné |
| `v_toggle_guns_mode` | (libellé non trouvé: ui_v_toggle_guns_mode) | non assigné |
| `v_toggle_flight_mode` | (libellé non trouvé: ui_v_toggle_flight_mode) | non assigné |
| `v_set_mining_mode` | (libellé non trouvé: ui_v_set_mining_mode) | non assigné |
| `v_set_salvage_mode` | (libellé non trouvé: ui_v_set_salvage_mode) | non assigné |
| `v_set_refuel_mode` | (libellé non trouvé: ui_v_set_refuel_mode) | non assigné |
| `v_set_scan_mode` | (libellé non trouvé: ui_v_set_scan_mode) | non assigné |
| `v_set_quantum_mode` | (libellé non trouvé: ui_v_set_quantum_mode) | non assigné |
| `v_set_missile_mode` | (libellé non trouvé: ui_v_set_missile_mode) | non assigné |
| `v_set_guns_mode` | (libellé non trouvé: ui_v_set_guns_mode) | non assigné |
| `v_set_flight_mode` | (libellé non trouvé: ui_v_set_flight_mode) | non assigné |
| `v_enter_remote_turret_1` | (EN) Enter Remote Turret 1 | non assigné |
| `v_enter_remote_turret_2` | (EN) Enter Remote Turret 2 | non assigné |
| `v_enter_remote_turret_3` | (EN) Enter Remote Turret 3 | non assigné |
| `v_operator_mode_cycle_forward` | (EN) Next Operator Mode | `mouse3` |
| `v_operator_mode_cycle_back` | (EN) Previous Operator Mode | non assigné |
| `v_light_amplification_toggle` | (EN) Light Amplification Toggle | `ralt+l` |
| `v_light_amplification_on` | (EN) Light Amplification On | non assigné |
| `v_light_amplification_off` | (EN) Light Amplification Off | non assigné |

## `spaceship_general` → Véhicules : cockpit  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_self_destruct` | Autodestruction | `backspace` |
| `v_cooler_throttle_up` | Augmenter le taux de refroidissement | non assigné |
| `v_cooler_throttle_down` | Réduire le taux de refroidissement | non assigné |
| `spectate_enterpuremode` | (libellé non trouvé) | non assigné |
| `v_flightready` | Préparation systèmes de vol | `ralt+r` |
| `v_toggle_all_doors` | Ouvrir/Fermer portes (ON/OFF) | non assigné |
| `v_open_all_doors` | Ouvre toutes les portes. | non assigné |
| `v_close_all_doors` | Ferme toutes les portes. | non assigné |
| `v_toggle_all_doorlocks` | Verrouiller/Déverrouiller portes (ON/OFF) | non assigné |
| `v_lock_all_doors` | Verrouille toutes les portes. | non assigné |
| `v_unlock_all_doors` | Déverrouiller toutes les portes | non assigné |
| `v_toggle_all_portlocks` | Verrouiller tous les ports (ON/OFF) | `ralt+K` |
| `v_lock_all_ports` | Verrouiller tous les ports | non assigné |
| `v_unlock_all_ports` | Déverrouiller tous les ports | non assigné |
| `pc_conversation_option1` | (libellé non trouvé) | `1` |
| `pc_conversation_option2` | (libellé non trouvé) | `2` |
| `pc_conversation_option3` | (libellé non trouvé) | `3` |
| `pc_conversation_option4` | (libellé non trouvé) | `4` |
| `pc_conversation_option5` | (libellé non trouvé) | `5` |

## `vehicle_mfd` → Véhicules : Écrans multifonctions (E.M.F.)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_mfd_interact_cycle_forwards_short` | Changer la vue des E.M.F. : En avant (appuyer) | `lalt+e` |
| `v_mfd_interact_cycle_forwards_long` | Changer la vue des E.M.F. : En avant (maintenir) | non assigné |
| `v_mfd_interact_cycle_backwards_short` | Changer la vue des E.M.F. : En arrière (appuyer) | `lalt+q` |
| `v_mfd_interact_cycle_backwards_long` | Changer la vue des E.M.F. : En arrière (maintenir) | non assigné |
| `v_mfd_movement_up_short` | Déplacer la sélection E.M.F. : Vers le haut (appuyer) | non assigné |
| `v_mfd_movement_up_long` | Déplacer la sélection E.M.F. : Vers le haut (maintenir) | non assigné |
| `v_mfd_movement_down_short` | Déplacer la sélection E.M.F. : Vers le bas (appuyer) | non assigné |
| `v_mfd_movement_down_long` | Déplacer la sélection E.M.F. : Vers le bas (maintenir) | non assigné |
| `v_mfd_movement_left_short` | Déplacer la sélection E.M.F. : Vers la gauche (appuyer) | non assigné |
| `v_mfd_movement_left_long` | Déplacer la sélection E.M.F. : Vers la gauche (maintenir) | non assigné |
| `v_mfd_movement_right_short` | Déplacer la sélection E.M.F. : Vers la droite (appuyer) | non assigné |
| `v_mfd_movement_right_long` | Déplacer la sélection E.M.F. : Vers la droite (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_primary_short` | Sélection : E.M.F. principal (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_primary_long` | Sélection : E.M.F. principal (maintenir) | non assigné |
| `v_mfd_soft_select_cast_left_short` | Sélection : E.M.F. de gauche (appuyer) | non assigné |
| `v_mfd_soft_select_cast_left_long` | Sélection : E.M.F. de gauche (maintenir) | non assigné |
| `v_mfd_soft_select_cast_right_short` | Sélection : E.M.F. de droite (appuyer) | non assigné |
| `v_mfd_soft_select_cast_right_long` | Sélection : E.M.F. de droite (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_1_short` | Sélection : E.M.F. 1 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_1_long` | Sélection : E.M.F. 1 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_2_short` | Sélection : E.M.F. 2 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_2_long` | Sélection : E.M.F. 2 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_3_short` | Sélection : E.M.F. 3 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_3_long` | Sélection : E.M.F. 3 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_4_short` | Sélection : E.M.F. 4 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_4_long` | Sélection : E.M.F. 4 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_5_short` | Sélection : E.M.F. 5 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_5_long` | Sélection : E.M.F. 5 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_6_short` | Sélection : E.M.F. 6 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_6_long` | Sélection : E.M.F. 6 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_7_short` | Sélection : E.M.F. 7 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_7_long` | Sélection : E.M.F. 7 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_8_short` | Sélection : E.M.F. 8 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_8_long` | Sélection : E.M.F. 8 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_9_short` | Sélection : E.M.F. 9 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_9_long` | Sélection : E.M.F. 9 (maintenir) | non assigné |
| `v_mfd_soft_select_mfd_10_short` | Sélection : E.M.F. 10 (appuyer) | non assigné |
| `v_mfd_soft_select_mfd_10_long` | Sélection : E.M.F. 10 (maintenir) | non assigné |
| `v_mfd_quick_action_repair_all` | (libellé non trouvé: ui_CIMFD_Quick_Action_Repair_All) | non assigné |
| `v_mfd_select_view_self_status_short` | Changer de vue : État personnel (appuyer) | non assigné |
| `v_mfd_select_view_self_status_long` | Changer de vue : État personnel (maintenir) | non assigné |
| `v_mfd_select_view_target_status_short` | Changer de vue : État de la cible (appuyer) | non assigné |
| `v_mfd_select_view_target_status_long` | Changer de vue : État de la cible (maintenir) | non assigné |
| `v_mfd_select_view_scanning_short` | Changer de vue : Scan (appuyer) | non assigné |
| `v_mfd_select_view_scanning_long` | Changer de vue : Scan (maintenir) | non assigné |
| `v_mfd_select_view_configuration_short` | Changer de vue : Configuration du véhicule (appuyer) | non assigné |
| `v_mfd_select_view_configuration_long` | Changer de vue : Configuration du véhicule (maintenir) | non assigné |
| `v_mfd_select_view_comms_short` | Changer de vue : Communications (appuyer) | non assigné |
| `v_mfd_select_view_comms_long` | Changer de vue : Communications (maintenir) | non assigné |
| `v_mfd_select_view_ifcs_short` | Changer de vue : S.C.V.I. (appuyer) | non assigné |
| `v_mfd_select_view_ifcs_long` | Changer de vue : S.C.V.I. (maintenir) | non assigné |
| `v_mfd_select_view_diagnostics_short` | Changer de vue : Diagnostics (appuyer) | non assigné |
| `v_mfd_select_view_diagnostics_long` | Changer de vue : Diagnostics (maintenir) | non assigné |
| `v_mfd_select_view_resource_network_short` | Changer de vue : Réseau de ressources (appuyer) | non assigné |
| `v_mfd_select_view_resource_network_long` | Changer de vue : Réseau de ressources (maintenir) | non assigné |

## `spaceship_view` → Véhicules : vue  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_view_yaw_left` | Regarder à gauche | non assigné |
| `v_view_yaw_right` | Regarder à droite | non assigné |
| `v_view_yaw` | Regarder à gauche/droite | non assigné |
| `v_view_yaw_mouse` | Regarder à gauche/droite | non assigné |
| `v_view_yaw_absolute` | (libellé non trouvé) | `HMD_Yaw` |
| `v_view_pitch_up` | Regarder vers le haut | non assigné |
| `v_view_pitch_down` | Regarder vers le bas | non assigné |
| `v_view_pitch` | Regarder vers le haut/bas | non assigné |
| `v_view_pitch_mouse` | Regarder vers le haut/bas | non assigné |
| `v_view_pitch_absolute` | (libellé non trouvé) | `HMD_Pitch` |
| `v_view_roll_absolute` | (libellé non trouvé) | `HMD_Roll` |
| `v_view_cycle_fwd` | Parcourir les vues caméra | `f4` |
| `v_view_cycle_internal_fwd` | (libellé non trouvé) | non assigné |
| `v_view_option` | (libellé non trouvé) | non assigné |
| `v_view_mode` | Parcourir le mode Orbite de la caméra | non assigné |
| `v_view_zoom_in` | Zoom avant (vue à la 3e personne) | non assigné |
| `v_view_zoom_out` | Zoom arrière (vue à la 3e personne) | non assigné |
| `v_view_interact` | (libellé non trouvé) | `f` |
| `v_view_freelook_mode` | Caméra libre (maintenir) | `z` |
| `v_view_dynamic_zoom_rel` | Zoom avant et arrière dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_rel_in` | Zoom avant dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_rel_out` | Zoom arrière dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_abs` | Zoom avant et arrière dynamique (abs.) | non assigné |
| `v_view_dynamic_zoom_abs_toggle` | Zoom dynamique ON/OFF (abs.) | non assigné |
| `v_ads_hold` | (EN) Precision Targeting - Hold | non assigné |
| `v_ads_toggle` | (EN) Precision Targeting - Toggle On / Off | `mouse2` |
| `v_ads_stable_max_zoom_hold` | (EN) Precision Targeting - Maximum Zoom (hold) | `mouse2` |
| `v_ads_cycle_tracking` | (EN) Precision Targeting - Toggle Camera Tracking | `ralt+mouse2` |

## `spaceship_movement` → Vol : mouvement  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_pitch_up` | Tangage vers le haut | `down` |
| `v_pitch_down` | Tangage vers le bas | `up` |
| `v_pitch` | Tangage | non assigné |
| `v_pitch_mouse` | Tangage | non assigné |
| `v_yaw_left` | Lacet vers la gauche | `left` |
| `v_yaw_right` | Lacet vers la droite | `right` |
| `v_yaw` | Lacet | non assigné |
| `v_yaw_mouse` | Lacet | non assigné |
| `v_roll_left` | Roulis vers la gauche | `q` |
| `v_roll_right` | Roulis vers la droite | `e` |
| `v_roll` | Roulade | non assigné |
| `v_roll_mouse` | Roulade | non assigné |
| `v_toggle_relative_mouse_mode` | Parcourir les modes de souris (VJoy/relatif) | non assigné |
| `v_toggle_yaw_roll_swap` | Intervertir lacet/roulis (ON/OFF) | non assigné |
| `v_strafe_up` | Déplacement vers le haut (abs.) | `space` |
| `v_strafe_down` | Déplacement vers le bas (abs.) | `lctrl` |
| `v_strafe_vertical` | Déplacement vers le haut/bas (abs.) | non assigné |
| `v_strafe_left` | Gauche (abs.) | `a` |
| `v_strafe_right` | Déplacement vers la droite (abs.) | `d` |
| `v_strafe_lateral` | Déplacement vers la gauche/droite (abs.) | non assigné |
| `v_strafe_forward` | (EN) Throttle - Increase | `w` |
| `v_strafe_back` | (EN) Throttle - Decrease | `s` |
| `v_strafe_longitudinal` | (EN) Throttle - Forward / Back | non assigné |
| `v_strafe_longitudinal_invert` | Déplacement vers l’avant/l’arrière inversé | non assigné |
| `v_ifcs_throttle_swap_mode` | (EN) Throttle - Cruise Mode - Toggle | `lalt+c` |
| `v_ifcs_throttle_set_sticky` | (EN) Throttle - Cruise Mode - Enable | non assigné |
| `v_ifcs_throttle_set_normal` | (EN) Throttle - Cruise Mode - Disable | non assigné |
| `v_strafe_trim_set_long` | (EN) Throttle - Trim - Set (Long Press) | non assigné |
| `v_strafe_trim_set_short` | (EN) Throttle - Trim - Set (Short Press) | non assigné |
| `v_strafe_trim_set_100_long` | (EN) Throttle - Trim - Set To 100% (Long Press) | non assigné |
| `v_strafe_trim_set_100_short` | (EN) Throttle - Trim - Set To 100% (Short Press) | non assigné |
| `v_strafe_trim_set_50_long` | (EN) Throttle - Trim - Set To 50% (Long Press) | non assigné |
| `v_strafe_trim_set_50_short` | (EN) Throttle - Trim - Set To 50% (Short Press) | non assigné |
| `v_strafe_trim_reset_long` | (EN) Throttle - Trim - Release (Long Press) | `x` |
| `v_strafe_trim_reset_short` | (EN) Throttle - Trim - Release (Short Press) | `x` |
| `v_ifcs_vector_decoupling_toggle` | Mode Découplé (activer ou désactiver) | `c` |
| `v_ifcs_vector_decoupling_on` | Activer le mode Couplé | non assigné |
| `v_ifcs_vector_decoupling_off` | Désactiver le mode Découplé | non assigné |
| `v_afterburner` | Boost | `lshift` |
| `v_ifcs_speed_limiter_up` | (EN) Speed Limiter - Increase (hold) | non assigné |
| `v_ifcs_speed_limiter_down` | (EN) Speed Limiter - Decrease (hold) | non assigné |
| `v_ifcs_speed_limiter_increment` | (EN) Speed Limiter - Step Up (tap) | `lalt+mwheel_up` |
| `v_ifcs_speed_limiter_decrement` | (EN) Speed Limiter - Step Down (tap) | `lalt+mwheel_down` |
| `v_ifcs_speed_limiter_rel` | (EN) Speed Limiter (rel) | non assigné |
| `v_ifcs_speed_limiter_abs` | (EN) Speed Limiter (abs) | non assigné |
| `v_ifcs_speed_limiter_toggle` | (EN) Speed Limiter - Enable / Disable | non assigné |
| `v_ifcs_speed_limiter_on` | (EN) Speed Limiter - Enable | non assigné |
| `v_ifcs_speed_limiter_off` | (EN) Speed Limiter - Disable | non assigné |
| `v_accel_range_up` | (EN) Acceleration Limiter - Increase (hold) | non assigné |
| `v_accel_range_down` | (EN) Acceleration Limiter - Decrease (hold) | non assigné |
| `v_accel_range_increment` | (EN) Acceleration Limiter - Step Up (tap) | `ralt+mwheel_up` |
| `v_accel_range_decrement` | (EN) Acceleration Limiter - Step Down (tap) | `ralt+mwheel_down` |
| `v_accel_range_rel` | (EN) Acceleration Limiter (rel) | non assigné |
| `v_accel_range_abs` | (EN) Acceleration Limiter (abs) | non assigné |
| `v_space_brake` | Frein spatial | `x` |
| `v_lock_rotation` | Verrouiller le mouvement de tangage/lacet (ON/OFF, maintenir) | `rshift` |
| `v_ifcs_gsafe_on` | (EN) G-Force safety on | non assigné |
| `v_ifcs_gsafe_off` | (EN) G-Force safety off | non assigné |
| `v_ifcs_toggle_gforce_safety` | Sécurité anti-G ON/OFF (alterner/maintenir) | non assigné |
| `v_ifcs_toggle_esp` | A.P.J. : ON/OFF (appuyer) | non assigné |
| `v_ifcs_esp_hold` | A.P.J. : Activer temporairement (maintenir) | non assigné |
| `v_toggle_landing_system` | Système d’atterrissage (ON/OFF) | `n` |
| `v_toggle_docking_request` | Amarrage\n(Initialiser) | `ralt+n` |
| `v_deploy_landing_system` | Système d’atterrissage (déployer) | non assigné |
| `v_retract_landing_system` | Système d’atterrissage (rétracter) | non assigné |
| `v_vtol_toggle` | ADAV ON/OFF | `k` |
| `v_vtol_on` | Activer le DAV | non assigné |
| `v_vtol_off` | Désactiver le DAV | non assigné |
| `v_transform_deploy` | Déployer la configuration | non assigné |
| `v_transform_retract` | Rétracter la configuration | non assigné |
| `v_transform_cycle` | Parcourir les configurations | `lalt+k` |
| `v_autoland` | Atterrissage automatique | `n` |
| `v_atc_request` | Demande d’atterrissage | `lalt+n` |
| `v_atc_loading_area_request` | (EN) Request Cargo Loading | `ralt+n` |
| `v_master_mode_cycle` | Changer le mode de contrôles | non assigné |
| `v_master_mode_cycle_long` | Mode de contrôles : alterner entre M.C.S. et NAV (maintenir) | `b` |
| `v_master_mode_set_nav` | Modes de contrôles : définir le NAV | non assigné |
| `v_master_mode_set_scm` | Modes de contrôles : activer le M.C.S. | non assigné |
| `v_toggle_jump_request` | Module de saut : demande de saut | non assigné |
| `v_ifcs_gravity_compensation_toggle` | (EN) IFCS - Gravity Compensation - Toggle | non assigné |
| `v_ifcs_gravity_compensation_on` | (EN) IFCS - Gravity Compensation - Enable | non assigné |
| `v_ifcs_gravity_compensation_off` | (EN) IFCS - Gravity Compensation - Disable | non assigné |
| `v_ifcs_wind_compensation_toggle` | (EN) IFCS - Wind Compensation - Toggle | non assigné |
| `v_ifcs_wind_compensation_on` | (EN) IFCS - Wind Compensation - Enable | non assigné |
| `v_ifcs_wind_compensation_off` | (EN) IFCS - Wind Compensation - Disable | non assigné |
| `v_auto_precision_mode_toggle` | (EN) Automatic Precision Mode - Toggle | non assigné |
| `v_auto_precision_mode_on` | (EN) Automatic Precision Mode - Enable | non assigné |
| `v_auto_precision_mode_off` | (EN) Automatic Precision Mode - Disable | non assigné |
| `v_ifcs_proximity_assist_toggle` | (EN) IFCS - Proximity Assist - Toggle | non assigné |
| `v_ifcs_proximity_assist_on` | (EN) IFCS - Proximity Assist - Enable | non assigné |
| `v_ifcs_proximity_assist_off` | (EN) IFCS - Proximity Assist - Disable | non assigné |
| `v_ifcs_stability_toggle` | (EN) IFCS - Stability - Toggle | non assigné |
| `v_ifcs_stability_on` | (EN) IFCS - Stability - Enable | non assigné |
| `v_ifcs_stability_off` | (EN) IFCS - Stability - Disable | non assigné |
| `v_ifcs_command_toggle` | Commandes réactives du S.C.V.I. : ON/OFF | non assigné |
| `v_ifcs_command_on` | Commandes réactives du S.C.V.I. : ON | non assigné |
| `v_ifcs_command_off` | Commandes réactives du S.C.V.I. : OFF | non assigné |
| `v_ifcs_core_toggle` | (EN) IFCS - Core - Toggle On / Off | non assigné |
| `v_ifcs_core_on` | (EN) IFCS - Core - Enable | non assigné |
| `v_ifcs_core_off` | (EN) IFCS - Core - Disable | non assigné |
| `v_ifcs_reset_gmeter_max` | (EN) Reset Flight Accelerometer | `ralt+c` |
| `v_flight_advanced_hud_toggle` | (EN) Advanced HUD - Toggle | non assigné |
| `v_flight_advanced_hud_on` | (EN) Advanced HUD - Enable | non assigné |
| `v_flight_advanced_hud_off` | (EN) Advanced HUD - Disable | non assigné |

## `spaceship_quantum` → Vol : voyage quantique

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_toggle_qdrive_engagement` | Activer la propulsion quantique (maintenir) | `mouse1` |

## `spaceship_docking` → Vol : amarrage

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_toggle_docking_mode` | Activer le mode Amarrage (ON/OFF) | `n` |
| `v_invoke_docking` | Appeler l’amarrage | `n` |
| `v_dock_toggle_view` | Activer la caméra d’amarrage (ON/OFF) | `0` |

## `spaceship_targeting` → Véhicules : ciblage  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_auto_targeting_toggle_long` | (EN) Auto Targeting - Toggle On/Off (Long Press) | `t` |
| `v_auto_targeting_toggle_short` | (EN) Auto Targeting - Toggle On/Off (Short Press) | non assigné |
| `v_auto_targeting_enable_short` | (EN) Auto Targeting - Toggle On (Short Press) | non assigné |
| `v_auto_targeting_enable_long` | (EN) Auto Targeting - Toggle On (Long Press) | non assigné |
| `v_auto_targeting_disable_short` | (EN) Auto Targeting - Toggle Off (Short Press) | non assigné |
| `v_auto_targeting_disable_long` | (EN) Auto Targeting - Toggle Off (Long Press) | non assigné |
| `v_target_toggle_lock_index_1` | Marquer index 1 : verrouiller/déverrouiller la cible marquée | `1` |
| `v_target_toggle_lock_index_2` | Marquer index 2 : verrouiller/déverrouiller la cible marquée | `2` |
| `v_target_toggle_lock_index_3` | Marquer index 3 : verrouiller/déverrouiller la cible marquée | `3` |
| `v_target_toggle_pin_index_1` | Marquer index 1 : marquer/démarquer la cible sélectionnée | `lalt+1` |
| `v_target_toggle_pin_index_2` | Marquer index 2 : marquer/démarquer la cible sélectionnée | `lalt+2` |
| `v_target_toggle_pin_index_3` | Marquer index 3 : marquer/démarquer la cible sélectionnée | `lalt+3` |
| `v_target_toggle_pin_index_1_hold` | Marquer index 1 :  marquer/démarquer la cible sélectionnée (maintenir) | non assigné |
| `v_target_toggle_pin_index_2_hold` | Marquer index 2 : marquer/démarquer la cible sélectionnée (maintenir) | non assigné |
| `v_target_toggle_pin_index_3_hold` | Marquer index 3 : marquer/démarquer la cible sélectionnée (maintenir) | non assigné |
| `v_target_pin_selected` | Marquer la cible sélectionnée | non assigné |
| `v_target_unpin_selected` | Démarquer la cible sélectionnée | non assigné |
| `v_target_pin_selected_hold` | Marquer la cible sélectionnée (maintenir) | non assigné |
| `v_target_unpin_selected_hold` | Démarquer la cible sélectionnée (maintenir) | non assigné |
| `v_target_remove_all_pins` | Supprimer toutes les cibles marquées | `0` |
| `v_target_lock_selected` | Verrouiller la cible sélectionnée | non assigné |
| `v_target_unlock` | (EN) Unlock Current Target | `lalt+t` |
| `v_look_ahead_enable` | Activer/désactiver Regarder droit devant | `lalt+l` |
| `v_look_ahead_start_target_tracking` | Activer/Désactiver le suivi de la cible (ON/OFF, maintenir) | non assigné |
| `v_target_tracking_auto_zoom` | Zoom automatique sur la cible sélectionnée ON/OFF (alterner, maintenir) | non assigné |

## `spaceship_targeting_advanced` → Véhicules : parcourir des cibles  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_target_under_reticle` | (EN) Lock Target Under Reticle | non assigné |
| `v_target_cycle_in_view_back` | Parcourir les cibles verrouillées en visu (précédent) | non assigné |
| `v_target_cycle_in_view_fwd` | Parcourir les cibles verrouillées en visu (suivant) | `t` |
| `v_target_cycle_in_view_reset` | Parcourir les cibles verrouillées en visu (sous le réticule) | `t` |
| `v_target_cycle_pinned_back` | Parcourir les cibles marquées (précédente) | non assigné |
| `v_target_cycle_pinned_fwd` | Parcourir les cibles marquées (suivante) | non assigné |
| `v_target_cycle_pinned_reset` | Parcourir les cibles marquées (revenir à la première) | non assigné |
| `v_target_cycle_attacker_back` | Parcourir les assaillants ciblés (précédent) | non assigné |
| `v_target_cycle_attacker_fwd` | Parcourir les assaillants ciblés (suivant) | `4` |
| `v_target_cycle_attacker_reset` | Parcourir les assaillants ciblés (revenir au plus proche) | `4` |
| `v_target_cycle_hostile_back` | Parcourir les ennemis ciblés (précédent) | non assigné |
| `v_target_cycle_hostile_fwd` | Parcourir les ennemis ciblés (suivant) | `5` |
| `v_target_cycle_hostile_reset` | Parcourir les ennemis ciblés (revenir au plus proche) | `5` |
| `v_target_cycle_friendly_back` | Parcourir les alliés ciblés (précédent) | non assigné |
| `v_target_cycle_friendly_fwd` | Parcourir les alliés ciblés (suivant) | `6` |
| `v_target_cycle_friendly_reset` | Parcourir les alliés ciblés (revenir au plus proche) | `6` |
| `v_target_cycle_all_back` | Parcourir toutes les cibles verrouillées (précédent) | non assigné |
| `v_target_cycle_all_fwd` | Parcourir toutes les cibles verrouillées (suivant) | `7` |
| `v_target_cycle_all_reset` | Parcourir toutes les cibles verrouillées (revenir à la plus proche) | `7` |
| `v_target_cycle_subitem_back` | Parcourir les cibles secondaires verrouillées (précédent) | non assigné |
| `v_target_cycle_subitem_fwd` | Parcourir les cibles secondaires verrouillées (suivant) | `r` |
| `v_target_cycle_subitem_reset` | Parcourir les cibles secondaires verrouillées (revenir à la cible principale) | `lalt+r` |

## `spaceship_target_hailing` → Vol : accrochage de cibles  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_target_hail` | Contacter l’objectif | `9` |

## `spaceship_radar` → Vol : radar  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_invoke_ping` | Activer le ping | `tab` |

## `spaceship_scanning` → Véhicules : scan  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_scanning_trigger_scan` | Activer le scan | non assigné |
| `v_inc_scan_focus_level` | Augmenter l’angle de scan | non assigné |
| `v_dec_scan_focus_level` | Diminuer l’angle de scan | non assigné |
| `v_ui_prev_scan_tab` | (libellé non trouvé) | `left` |
| `v_ui_next_scan_tab` | (libellé non trouvé) | `right` |
| `v_ui_prev_scan_page` | (libellé non trouvé) | `up` |
| `v_ui_next_scan_page` | (libellé non trouvé) | `down` |
| `v_ui_prev_contact_page` | (libellé non trouvé) | `rctrl+left` |
| `v_ui_next_contact_page` | (libellé non trouvé) | `rctrl+right` |
| `v_ui_prev_contact` | (libellé non trouvé) | `rctrl+up` |
| `v_ui_next_contact` | (libellé non trouvé) | `rctrl+down` |

## `spaceship_mining` → Véhicule : extraction minière  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_toggle_mining_laser_fire` | Activer/Désactiver le laser d’extraction minière | `mouse1` |
| `v_toggle_mining_laser_type` | Mise sous/hors tension du laser d’extraction minière | `lalt+mouse1` |
| `v_increase_mining_throttle` | Augmenter la puissance du laser d’extraction minière | `maxis_z` |
| `v_decrease_mining_throttle` | Diminuer la puissance du laser d’extraction minière | non assigné |
| `v_mining_throttle` | Augmenter/Diminuer la puissance du laser d’extraction minière | non assigné |
| `v_mining_use_consumable1` | Activer un module d’extraction minière (emplacement 1) | `lalt+1` |
| `v_mining_use_consumable2` | Activer un module d’extraction minière (emplacement 2) | `lalt+2` |
| `v_mining_use_consumable3` | Activer un module d’extraction minière (emplacement 3) | `lalt+3` |
| `v_mining_use_permanent_modifier` | (EN) Toggle Laser Beam (High / low) | `lalt+4` |
| `v_jettison_volatile_cargo` | Délester de la marchandise | `lalt+j` |

## `spaceship_salvage` → Véhicules : recyclage  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `tractor_beam_vehicle_increase_distance` | (libellé non trouvé: ui_CIFPSTractorBeamVehicleIncreaseDistance) | non assigné |
| `tractor_beam_vehicle_decrease_distance` | (libellé non trouvé: ui_CIFPSTractorBeamVehicleDecreaseDistance) | non assigné |
| `v_salvage_toggle_fire_focused` | (libellé non trouvé: ui_CISalvageFireToggleFocused) | non assigné |
| `v_salvage_toggle_fire_left` | (libellé non trouvé: ui_CISalvageFireToggleLeft) | `ralt+a` |
| `v_salvage_toggle_fire_right` | (libellé non trouvé: ui_CISalvageFireToggleRight) | `ralt+d` |
| `v_salvage_toggle_fire_fracture` | (libellé non trouvé: ui_CISalvageFireToggleFracture) | `ralt+w` |
| `v_salvage_toggle_fire_disintegrate` | (libellé non trouvé: ui_CISalvageFireToggleDisintegrate) | `ralt+s` |
| `v_salvage_toggle_gimbal_mode` | Activation/désactivation du cardan du mode Récupération | `g` |
| `v_salvage_reset_gimbal` | (EN) Salvage Mode Gimbal Reset | `lalt+g` |
| `v_salvage_increase_beam_spacing` | Augmenter l’espacement du rayon | non assigné |
| `v_salvage_decrease_beam_spacing` | Diminuer l’espacement du rayon | non assigné |
| `v_salvage_beam_spacing_rel` | Espacement relatif du rayon | `maxis_z` |
| `v_salvage_beam_spacing_abs` | Espacement absolu du rayon | non assigné |
| `v_salvage_toggle_beam_spacing_axis` | Activation/désactivation de l’axe du rayon du mode Récupération | `lalt+mouse2` |
| `v_salvage_cycle_modifiers_focused` | (libellé non trouvé: ui_CISalvageCycleModifiersFocused) | non assigné |
| `v_salvage_cycle_modifiers_left` | Parcourir les modificateurs de gauche | non assigné |
| `v_salvage_cycle_modifiers_right` | Parcourir les modificateurs de droite | non assigné |
| `v_salvage_cycle_modifiers_structural` | (libellé non trouvé: ui_CISalvageCycleModifiersStructural) | non assigné |
| `v_salvage_focus_all_heads` | (libellé non trouvé: ui_CISalvageFocusAll) | `lalt+s` |
| `v_salvage_focus_left` | (libellé non trouvé: ui_CISalvageFocusLeft) | `lalt+a` |
| `v_salvage_focus_right` | (libellé non trouvé: ui_CISalvageFocusRight) | `lalt+d` |
| `v_salvage_focus_fracture` | (libellé non trouvé: ui_CISalvageFocusFracture) | `lalt+w` |
| `v_salvage_focus_disintegrate` | (libellé non trouvé: ui_CISalvageFocusDisintegrate) | non assigné |
| `v_salvage_nudge_up__left` | (libellé non trouvé: ui_CISalvageNudgeUp_Left) | non assigné |
| `v_salvage_nudge_down__left` | (libellé non trouvé: ui_CISalvageNudgeDown_Left) | non assigné |
| `v_salvage_nudge_left__left` | (libellé non trouvé: ui_CISalvageNudgeLeft_Left) | non assigné |
| `v_salvage_nudge_right__left` | (libellé non trouvé: ui_CISalvageNudgeRight_Left) | non assigné |
| `v_salvage_nudge_up__right` | (libellé non trouvé: ui_CISalvageNudgeUp_Right) | non assigné |
| `v_salvage_nudge_down__right` | (libellé non trouvé: ui_CISalvageNudgeDown_Right) | non assigné |
| `v_salvage_nudge_left__right` | (libellé non trouvé: ui_CISalvageNudgeLeft_Right) | non assigné |
| `v_salvage_nudge_right__right` | (libellé non trouvé: ui_CISalvageNudgeRight_Right) | non assigné |

## `turret_movement` → Mouvement de la tourelle

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `turret_pitch_up` | Tangage vers le haut | non assigné |
| `turret_pitch_down` | Tangage vers le bas | non assigné |
| `turret_pitch` | Tangage | non assigné |
| `turret_pitch_mouse` | Tangage | non assigné |
| `turret_yaw_left` | Lacet vers la gauche | non assigné |
| `turret_yaw_right` | Lacet vers la droite | non assigné |
| `turret_yaw` | Lacet | non assigné |
| `turret_yaw_mouse` | Lacet | non assigné |
| `turret_toggle_mouse_mode` | Activer ou désactiver le mouvement de souris de la tourelle (VJoy, style FPS) | `q` |
| `turret_mouse_mode_cycle` | Mode souris tourelle - Alterner | `q` |
| `turret_mouse_mode_set_vjoy` | (EN) Turret Mouse Mode - VJoy Dragging | non assigné |
| `turret_mouse_mode_set_1to1` | (EN) Turret Mouse Mode - Relative Dragging | non assigné |
| `turret_mouse_mode_set_pointer` | (EN) Turret Mouse Mode - Pointer | non assigné |
| `turret_remote_exit` | Sortir de la tourelle à distance | `y` |
| `turret_gyromode` | Stabilisation gyroscopique de la tourelle (ON/OFF) | `e` |
| `turret_remote_cycle_next` | (EN) Next Remote Turret | `d` |
| `turret_remote_cycle_prev` | (EN) Previous Remote Turret | `a` |

## `turret_advanced` → Tourelle avancée

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `turret_esp_toggle` | A.P.J. de la tourelle (ON/OFF) | non assigné |
| `turret_esp_hold` | Tourelle : activer l’A.P.J. temporairement (maintenir) | non assigné |
| `turret_recenter` | Recentrer la tourelle (maintenir) | `c` |
| `turret_limiter_toggle` | Limiteur de vitesse de la tourelle : ON/OFF (maintenir/alterner) | non assigné |
| `turret_limiter_rel` | Limiteur de vitesse de la tourelle (rel.) | non assigné |
| `turret_limiter_rel_increase` | Limiteur de vitesse de la tourelle : augmenter (rel.) | non assigné |
| `turret_limiter_rel_decrease` | Limiteur de vitesse de la tourelle : diminuer (rel.) | non assigné |
| `turret_limiter_abs` | Limiteur de vitesse de la tourelle (abs.) | non assigné |
| `turret_change_position` | (EN) Change Turret Position | `s` |

## `spaceship_weapons` → Véhicules : armes  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_weapon_gimbals_state_toggle` | Cardans : fixes ou mobiles | `g` |
| `v_weapon_gimbals_state_set_locked` | Cardans : fixes | non assigné |
| `v_weapon_gimbals_state_set_unlocked` | Cardans : mobiles | non assigné |
| `v_weapon_gimbals_unlocked_cycle_source` | Cardans mobiles : changer de source (VJoy, tête) | non assigné |
| `v_weapon_aim_type_cycle` | Type de visée : alterner | `ralt+g` |
| `v_weapon_aim_type_set_pip_aiming` | Visée : par défaut (visée PIP) | non assigné |
| `v_weapon_aim_type_set_painting` | Visée : cible marquée | non assigné |
| `v_weapon_aim_type_set_auto` | Visée : définir comme AUTO. | non assigné |
| `v_weapon_staggered_fire_toggle` | Tir différé : activer ou désactiver | non assigné |
| `v_weapon_staggered_fire_on` | Tir différé : toujours activé | non assigné |
| `v_weapon_staggered_fire_off` | Tir différé : toujours désactivé | non assigné |
| `v_weapon_suppress_aim_assists_hold` | Désactiver les assistances à la visée (maintenir) | non assigné |
| `v_weapon_pip_toggle_lead_lag` | Alterner les réticules : guidé ou différé | non assigné |
| `v_weapon_pip_set_lag` | Activer le réticule PIP différé | non assigné |
| `v_weapon_pip_set_lead` | Activer le réticule PIP guidé | non assigné |
| `v_weapon_pip_combination_type_toggle` | Type de combinaison de réticule PIP : alterner | non assigné |
| `v_weapon_pip_combination_type_set_single` | Type de combinaison de réticule PIP : définir un réticule par arme. | non assigné |
| `v_weapon_pip_combination_type_set_combined_weapon_group` | Type de combinaison de réticule PIP : définir un réticule par type d’arme. | non assigné |
| `v_weapon_pip_prec_line_toggle` | (EN) PIP Precision Lines Toggle | non assigné |
| `v_weapon_pip_prec_line_on` | (EN) PIP Precision Lines On | non assigné |
| `v_weapon_pip_prec_line_off` | (EN) PIP Precision Lines Off | non assigné |
| `v_weapon_pip_fade_toggle` | (EN) PIP Fading Toggle | non assigné |
| `v_weapon_pip_fade_on` | (EN) PIP Fading On | non assigné |
| `v_weapon_pip_fade_off` | (EN) PIP Fading Off | non assigné |
| `v_weapon_ui_scale_toggle` | (EN) Gunnery UI Magnification Toggle | non assigné |
| `v_weapon_ui_scale_on` | (EN) Gunnery UI Magnification On | non assigné |
| `v_weapon_ui_scale_off` | (EN) Gunnery UI Magnification Off | non assigné |
| `v_weapon_convergence_distance_rel` | Distance de convergence manuelle (relative) | non assigné |
| `v_weapon_convergence_distance_rel_increase` | Distance de convergence manuelle : augmentation | non assigné |
| `v_weapon_convergence_distance_rel_decrease` | Distance de convergence manuelle : réduction | non assigné |
| `v_weapon_convergence_distance_abs` | Distance de convergence manuelle (absolue) | non assigné |
| `v_weapon_convergence_distance_set_default` | Distance de convergence manuelle: réinitialisation | non assigné |
| `v_weapon_preset_attack` | Canons : utiliser groupe actuel | `mouse1` |
| `v_weapon_preset_fire_guns0` | Canons : groupe 1 | non assigné |
| `v_weapon_preset_fire_guns1` | Canons : groupe 2 | non assigné |
| `v_weapon_preset_fire_guns2` | Canons : groupe 3 | non assigné |
| `v_weapon_preset_fire_guns3` | Canons : groupe 4 | non assigné |
| `v_weapon_preset_next` | Canons : groupe suivant | `mwheel_down` |
| `v_weapon_preset_prev` | Canons : groupe précédent | `mwheel_up` |
| `v_weapon_preset_next_overflow` | Canons : groupe suivant (débordement) | non assigné |
| `v_weapon_preset_prev_overflow` | Canons : groupe précédent (débordement) | non assigné |
| `v_weapon_preset_guns0` | Canons : définir groupe 1 | non assigné |
| `v_weapon_preset_guns1` | Canons : définir groupe 2 | non assigné |
| `v_weapon_preset_guns2` | Canons : définir groupe 3 | non assigné |
| `v_weapon_preset_guns3` | Canons : définir groupe 4 | non assigné |
| `v_weapon_preset_emp` | (EN) Weapon Presets - Set EMPs | non assigné |
| `v_weapon_preset_qid_jammer` | (EN) Weapon Presets - Set Quantum Jammers (short range) | non assigné |
| `v_weapon_preset_qid_pulse` | (EN) Weapon Presets - Set Quantum Snares / Pulse (long range) | non assigné |
| `v_weapon_preset_qid` | (EN) Weapon Presets - Set QIDs | non assigné |

## `spaceship_missiles` → Véhicules : missiles  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_weapon_toggle_launch_missile` | Tirer les missiles (appuyer) | `mouse1` |
| `v_weapon_launch_missile` | Tirer les missiles (maintenir) | non assigné |
| `v_weapon_cycle_missile_fwd` | Passer au type de missile suivant | `mwheel_down` |
| `v_weapon_cycle_missile_back` | Passer au type de missile précédent | `mwheel_up` |
| `v_weapon_increase_max_missiles` | Augmenter le nombre de missiles armés | `g` |
| `v_weapon_decrease_max_missiles` | Diminuer le nombre de missiles armés | non assigné |
| `v_weapon_reset_max_missiles` | Réinitialiser le nombre de missiles armés | `lalt+g` |
| `v_weapon_bombing_toggle_desired_impact_point` | Bombes : activer/désactiver le point d’impact désiré (appuyer) | `lalt+b` |
| `v_weapon_bombing_toggle_desired_impact_point_hold` | Bombes : activer/désactiver le point d’impact désiré (maintenir) | non assigné |
| `v_weapon_bombing_hud_range_increase` | Bombes : augmenter la portée du HUD | non assigné |
| `v_weapon_bombing_hud_range_decrease` | Bombes : diminuer la portée du HUD | non assigné |
| `v_weapon_bombing_hud_range_reset` | Bombes : réinitialiser la portée du HUD | non assigné |
| `v_weapon_launch_missile_cinematic` | Activer la caméra cinématique (ON/OFF) | non assigné |
| `v_weapon_launch_missile_cinematic_hold` | Activer la caméra cinématique (maintenir) | non assigné |

## `spaceship_defensive` → Véhicules : boucliers et contre-mesures  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_weapon_countermeasure_decoy_launch` | Leurre: en rafale (appuyer), définir et en rafale (maintenir) | `h` |
| `v_weapon_countermeasure_decoy_burst_increase` | Leurre : augmenter la taille des rafales (appuyer) | `ralt+h` |
| `v_weapon_countermeasure_decoy_burst_decrease` | Leurre : diminuer la taille des rafales (appuyer) | `lalt+h` |
| `v_weapon_countermeasure_decoy_launch_panic` | Leurre : tir en catastrophe (appuyer) | non assigné |
| `v_weapon_countermeasure_noise_launch` | Sonore : déployer (Appuyer) | `j` |
| `v_shield_raise_level_forward` | Augmenter le niveau du bouclier avant | non assigné |
| `v_shield_raise_level_back` | Augmenter le niveau du bouclier arrière | non assigné |
| `v_shield_raise_level_left` | Augmenter le niveau du bouclier gauche | non assigné |
| `v_shield_raise_level_right` | Augmenter le niveau du bouclier droit | non assigné |
| `v_shield_raise_level_up` | Augmenter le niveau du bouclier supérieur | non assigné |
| `v_shield_raise_level_down` | Augmenter le niveau du bouclier inférieur | non assigné |
| `v_shield_reset_level` | Réinitialiser les niveaux du bouclier | non assigné |

## `spaceship_auto_weapons` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_weapon_toggle_ai` | (libellé non trouvé) | `slash` |

## `spaceship_power` → Vol : alimentation  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_power_toggle` | Activer/Désactiver l’alimentation : tous | `u` |
| `v_power_set_on` | Régler la mise sous tension | non assigné |
| `v_power_set_off` | Régler la mise hors tension | non assigné |
| `v_power_toggle_thrusters` | Activer/Désactiver l’alimentation : propulseurs | `i` |
| `v_power_set_thrusters_on` | Activer les propulseurs | non assigné |
| `v_power_set_thrusters_off` | Désactiver les propulseurs | non assigné |
| `v_power_toggle_shields` | Activer/Désactiver l’alimentation : boucliers | `o` |
| `v_power_set_shields_on` | Activer les boucliers | non assigné |
| `v_power_set_shields_off` | Désactiver les boucliers | non assigné |
| `v_power_toggle_weapons` | Activer/Désactiver l’alimentation : armes | `p` |
| `v_power_set_weapons_on` | Activer les armes | non assigné |
| `v_power_set_weapons_off` | Désactiver les armes | non assigné |
| `v_power_throttle_down` | Réduire les gaz | `f9` |
| `v_power_throttle_min` | Réduire les gaz au min | `f9` |
| `v_power_throttle_up` | Augmenter les gaz | `f10` |
| `v_power_throttle_max` | Augmenter les gaz au max | `f10` |
| `v_engineering_assignment_engine_increase` | Moteurs : augmenter (appuyer) | `f6` |
| `v_engineering_assignment_engine_decrease` | Moteurs : diminuer (appuyer) | `f6+lalt` |
| `v_engineering_assignment_engine_max` | Moteurs : régler sur max. (appuyer) | `f6` |
| `v_engineering_assignment_engine_min` | Moteurs : régler sur min. (appuyer) | `f6+lalt` |
| `v_engineering_assignment_shields_increase` | Boucliers : augmenter (appuyer) | `f7` |
| `v_engineering_assignment_shields_decrease` | Boucliers : diminuer (appuyer) | `f7+lalt` |
| `v_engineering_assignment_shields_max` | Boucliers : régler sur max. (appuyer) | `f7` |
| `v_engineering_assignment_shields_min` | Boucliers : régler sur min. (appuyer) | `f7+lalt` |
| `v_engineering_assignment_weapons_increase` | Armes : augmenter (appuyer) | `f5` |
| `v_engineering_assignment_weapons_decrease` | Armes : diminuer (appuyer) | `f5+lalt` |
| `v_engineering_assignment_weapons_max` | Armes : régler sur max. (appuyer) | `f5` |
| `v_engineering_assignment_weapons_min` | Armes : régler sur min. (appuyer) | `f5+lalt` |
| `v_engineering_assignment_reset` | Réinitialiser les affectations | `f8` |

## `spaceship_hud` → Vol : HUD  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_cycle_pitch_ladder_mode` | Parcourir le mode Horizon artificiel | non assigné |
| `mobiglas` | mobiGlas (ON/OFF) | `f1` |
| `toggle_ar_mode` | (libellé non trouvé) | non assigné |
| `v_hud_open_scoreboard` | Tableau des scores | `f1` |
| `v_hud_interact_toggle` | (libellé non trouvé) | non assigné |
| `v_hud_cycle_mode_fwd` | (libellé non trouvé) | non assigné |
| `v_hud_cycle_mode_back` | (libellé non trouvé) | non assigné |
| `v_hud_focused_cycle_mode_fwd` | (libellé non trouvé) | non assigné |
| `v_hud_focused_cycle_mode_back` | (libellé non trouvé) | non assigné |
| `v_hud_left_panel_up` | (libellé non trouvé) | non assigné |
| `v_hud_left_panel_down` | (libellé non trouvé) | non assigné |
| `v_hud_left_panel_left` | (libellé non trouvé) | non assigné |
| `v_hud_left_panel_right` | (libellé non trouvé) | non assigné |
| `v_hud_confirm` | (libellé non trouvé) | non assigné |
| `v_hud_cancel` | (libellé non trouvé) | non assigné |
| `v_hud_stick_x` | (libellé non trouvé) | non assigné |
| `v_hud_stick_y` | (libellé non trouvé) | non assigné |
| `v_comm_open_chat` | (libellé non trouvé) | non assigné |
| `v_comm_show_chat` | (libellé non trouvé) | non assigné |
| `v_comm_open_precanned` | (libellé non trouvé) | non assigné |
| `v_comm_select_precanned_1` | (libellé non trouvé) | non assigné |
| `v_comm_select_precanned_2` | (libellé non trouvé) | non assigné |
| `v_comm_select_precanned_3` | (libellé non trouvé) | non assigné |
| `v_comm_select_precanned_4` | (libellé non trouvé) | non assigné |
| `v_comm_select_precanned_5` | (libellé non trouvé) | non assigné |
| `v_starmap` | Carte | `f2` |
| `visor_wipe` | Essuyer la visière du casque | `lalt+x` |

## `lights_controller` → Lumières

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_lights` | Phares (ON/OFF) | `l` |
| `v_lights_on` | Feux\n(Activer) | non assigné |
| `v_lights_off` | Feux\n(Activer) | non assigné |
| `v_toggle_running_lights` | (libellé non trouvé) | non assigné |
| `v_toggle_cabin_lights` | (libellé non trouvé) | non assigné |

## `vehicle_mobiglas` → Véhicule : mobiGlas  _(groupe : VOL)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `ui_3d_display_select` | (libellé non trouvé) | non assigné |
| `ui_3d_display_reorient` | (libellé non trouvé) | `r` |
| `ui_3d_display_center` | (libellé non trouvé) | `e` |
| `ui_3d_display_decenter` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_button` | (libellé non trouvé) | `np_subtract` |
| `ui_3d_display_zoom_in_button` | (libellé non trouvé) | `np_add` |
| `ui_3d_display_zoom_in_analog` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_analog` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_wheel` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_in_wheel` | (libellé non trouvé) | non assigné |
| `ui_3d_display_pan_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_rotate_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPanX` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPanY` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledYaw` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPitch` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledZoom` | (libellé non trouvé) | non assigné |
| `ui_3d_display_nonToggledPanUp` | (libellé non trouvé) | `w` |
| `ui_3d_display_nonToggledPanDown` | (libellé non trouvé) | `s` |
| `ui_3d_display_nonToggledPanLeft` | (libellé non trouvé) | `a` |
| `ui_3d_display_nonToggledPanRight` | (libellé non trouvé) | `d` |
| `ui_3d_display_nonToggledYawUp` | (libellé non trouvé) | `up` |
| `ui_3d_display_nonToggledYawDown` | (libellé non trouvé) | `down` |
| `ui_3d_display_nonToggledPitchLeft` | (libellé non trouvé) | `left` |
| `ui_3d_display_nonToggledPitchRight` | (libellé non trouvé) | `right` |
| `ui_3d_display_pinMode` | (libellé non trouvé) | `lctrl` |
| `ui_3d_display_pinSelect` | (libellé non trouvé) | non assigné |

## `stopwatch` → Chronomètre

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `stopwatch_reset` | Réinitialiser (maintenir) | non assigné |
| `stopwatch_trigger` | Start/Pause (appuyer) | non assigné |

## `player` → À pied : tous  _(groupe : À PIED)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `moveleft` | Gauche | `a` |
| `moveright` | Droite | `d` |
| `moveforward` | Avancer | `w` |
| `moveback` | Reculer | `s` |
| `rotateyaw` | (libellé non trouvé) | non assigné |
| `rotatepitch` | (libellé non trouvé) | non assigné |
| `gp_movex` | Gauche/Droite | non assigné |
| `gp_movey` | Avancer/Reculer | non assigné |
| `gp_rotateyaw` | Regarder (lacet) | non assigné |
| `gp_rotatepitch` | Regarder (tangage) | non assigné |
| `jump` | Sauter | `space` |
| `jump_hold` | (EN) Jump Thrusters - Activate (hold) | `space` |
| `jump_release` | (EN) Jump Thrusters - Release | `space` |
| `crouch` | S’accroupir | `c` |
| `gp_jump` | Sauter | non assigné |
| `gp_crouch` | S’accroupir | non assigné |
| `prone` | S’allonger | `lctrl` |
| `sprint` | Sprinter | `lshift` |
| `walk` | Marcher | non assigné |
| `leanleft` | Se pencher à gauche | `q` |
| `leanright` | Se pencher à droite | `e` |
| `ledgegrab` | (EN) Climb Ledges | `space` |
| `attack1` | Arme à feu : attaquer | non assigné |
| `attackSecondary` | (EN) Tool - Secondary Fire | non assigné |
| `melee_AttackLightLeft` | Mêlée : attaque légère à gauche | non assigné |
| `melee_AttackLightRight` | Mêlée : attaque légère à droite | non assigné |
| `melee_AttackHeavyLeft` | Mêlée : attaque lourde à gauche (maintenir) | non assigné |
| `melee_AttackHeavyRight` | Mêlée : attaque lourde à droite (maintenir) | non assigné |
| `melee_block` | Mêlée : bloquer (maintenir) | non assigné |
| `melee_AttackSyringeStab` | MedPen : nouvelle injection | non assigné |
| `melee_dodgeLeft` | Esquiver vers la gauche | `a` |
| `melee_dodgeRight` | Esquiver vers la droite | `d` |
| `melee_dodgeBack` | Esquiver vers l’arrière | `s` |
| `restrain` | (libellé non trouvé) | non assigné |
| `weapon_melee` | Mêlée : attaquer (arme à distance + éliminations) | non assigné |
| `takedown_nonLethal` | Mêlée : attaquer (arme à distance + éliminations) | non assigné |
| `takedown_lethal` | (libellé non trouvé) | non assigné |
| `throw_overhand` | Jeter : par-dessus le bras et à deux mains | non assigné |
| `throw_underhand` | Jeter : par-dessous le bras | non assigné |
| `zoom` | Visée (épaule) | non assigné |
| `interact_with_scope` | (libellé non trouvé: ui_CIFPSInteractWithScope) | `lshift` |
| `toggle_lowered` | Posture avec arme (ON/OFF) | `lalt+r` |
| `select_primary_pit` | Sélectionner l’arme principale | `1` |
| `select_secondary_pit` | Sélectionner l’arme secondaire | `2` |
| `select_sidearm_pit` | Sélectionner l’arme de poing | `3` |
| `select_meleeweapon_pit` | Sélectionner arme de corps à corps | `v` |
| `select_gadget_pit` | Sélectionner le gadget | `5` |
| `selectUnarmedCombat` | Combat à mains nues | `6` |
| `nextitem` | (libellé non trouvé) | non assigné |
| `prevItem` | (libellé non trouvé) | non assigné |
| `nextweapon` | Arme suivante | non assigné |
| `prevweapon` | Arme précédente | non assigné |
| `reload` | Recharger | `r` |
| `reloadSecondary` | (EN) Reload Secondary Fire | `lalt+b` |
| `ammoRepool` | Rééquilibrer les munitions | `lalt+1` |
| `holster` | Rengainer l’arme | `r` |
| `drop` | Déposer l’objet | non assigné |
| `inspect` | Examiner l’objet | non assigné |
| `customize` | Personnaliser l’arme | `j` |
| `stabilize` | Retenir sa respiration (visée épaule) | `lshift` |
| `weapon_auxiliary_action` | Action FPS avec l’accessoire sous le canon | `u` |
| `weapon_change_firemode` | Changer de mode de tir | `b` |
| `weapon_zeroing_decrease` | Diminuer la distance de réglage de l’arme | `pgdn` |
| `weapon_zeroing_increase` | Auto/Augmenter la distance de réglage de l’arme | `pgup` |
| `fixed_speed_increment` | Augmente la vitesse de déplacement par défaut. | non assigné |
| `fixed_speed_decrement` | Diminue la vitesse de déplacement par défaut. | non assigné |
| `use` | (libellé non trouvé) | `e` |
| `useAttachmentBottom` | (libellé non trouvé) | non assigné |
| `useAttachmentTop` | (libellé non trouvé) | non assigné |
| `downedRevivalRequest` | Demande de secours (en cas d’immobilisation) | `m` |
| `toggle_flashlight` | Lampe torche (ON/OFF) | `t` |
| `combathealtarget` | (libellé non trouvé) | non assigné |
| `toggleEquipHelmet` | Équiper le casque | `ralt+h` |
| `toggleAttachHelmet` | Casque\n(Équiper) | `lalt+h` |
| `toggleHelmetState` | Augmente la vitesse de déplacement par défaut. | non assigné |
| `visor_next_mode` | (libellé non trouvé) | non assigné |
| `visor_prev_mode` | (libellé non trouvé) | non assigné |
| `visor_wipe` | Essuyer la visière du casque | `lalt+x` |
| `selectitem` | (libellé non trouvé) | non assigné |
| `cancelselect` | (libellé non trouvé) | non assigné |
| `thirdperson` | Vue à la 3e personne (ON/OFF) | `f4` |
| `toggle_cursor_input` | (libellé non trouvé) | `f11` |
| `free_thirdperson_camera` | Caméra libre (maintenir) | `z` |
| `pan_thirdperson_up` | (libellé non trouvé) | `up` |
| `pan_thirdperson_down` | (libellé non trouvé) | `down` |
| `zoom_out` | Zoom arrière (visée épaule) | non assigné |
| `zoom_in` | Zoom avant (visée épaule) | non assigné |
| `break_conversation_effects` | (libellé non trouvé) | non assigné |
| `hmd_rotateyaw` | (libellé non trouvé) | `HMD_Yaw` |
| `hmd_rotatepitch` | (libellé non trouvé) | `HMD_Pitch` |
| `hmd_rotateroll` | (libellé non trouvé) | `HMD_Roll` |
| `mobiglas` | mobiGlas (ON/OFF) | `f1` |
| `ship_recall` | (EN) Recall Last Vehicle | non assigné |
| `pl_hud_open_scoreboard` | Tableau des scores | `f1` |
| `pl_hud_confirm` | (libellé non trouvé) | `enter` |
| `toggle_ar_mode` | (libellé non trouvé) | non assigné |
| `ar_mode_scroll_action_up` | (libellé non trouvé) | non assigné |
| `ar_mode_scroll_action_down` | (libellé non trouvé) | non assigné |
| `shop_camera_zoom_in` | (libellé non trouvé) | non assigné |
| `shop_camera_zoom_out` | (libellé non trouvé) | non assigné |
| `shop_camera_mouseyaw` | (libellé non trouvé) | non assigné |
| `shop_camera_mousepitch` | (libellé non trouvé) | non assigné |
| `spectate_enterpuremode` | (libellé non trouvé) | non assigné |
| `dismiss_corpse_marker` | Supprimer indicateur corps | non assigné |
| `consume` | Arme à feu : attaquer | non assigné |
| `ui_3d_display_select` | (libellé non trouvé) | non assigné |
| `ui_3d_display_reorient` | (libellé non trouvé) | `r` |
| `ui_3d_display_center` | (libellé non trouvé) | `e` |
| `ui_3d_display_decenter` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_button` | (libellé non trouvé) | `np_subtract` |
| `ui_3d_display_zoom_in_button` | (libellé non trouvé) | `np_add` |
| `ui_3d_display_zoom_in_analog` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_analog` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_out_wheel` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_in_wheel` | (libellé non trouvé) | non assigné |
| `ui_3d_display_pan_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_rotate_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_zoom_toggle` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPanX` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPanY` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledYaw` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledPitch` | (libellé non trouvé) | non assigné |
| `ui_3d_display_toggledZoom` | (libellé non trouvé) | non assigné |
| `ui_3d_display_nonToggledPanUp` | (libellé non trouvé) | `w` |
| `ui_3d_display_nonToggledPanDown` | (libellé non trouvé) | `s` |
| `ui_3d_display_nonToggledPanLeft` | (libellé non trouvé) | `a` |
| `ui_3d_display_nonToggledPanRight` | (libellé non trouvé) | `d` |
| `ui_3d_display_nonToggledYawUp` | (libellé non trouvé) | `up` |
| `ui_3d_display_nonToggledYawDown` | (libellé non trouvé) | `down` |
| `ui_3d_display_nonToggledPitchLeft` | (libellé non trouvé) | `left` |
| `ui_3d_display_nonToggledPitchRight` | (libellé non trouvé) | `right` |
| `ui_3d_display_pinMode` | (libellé non trouvé) | `lctrl` |
| `ui_3d_display_pinSelect` | (libellé non trouvé) | non assigné |
| `port_modification_select` | Modification du port | non assigné |
| `v_starmap` | Carte | `f2` |
| `force_respawn` | Forcer le respawn (EVA/à pied) | `backspace` |
| `pc_conversation_option1` | (libellé non trouvé) | `1` |
| `pc_conversation_option2` | (libellé non trouvé) | `2` |
| `pc_conversation_option3` | (libellé non trouvé) | `3` |
| `pc_conversation_option4` | (libellé non trouvé) | `4` |
| `pc_conversation_option5` | (libellé non trouvé) | `5` |
| `pc_conversation_option_up` | (libellé non trouvé) | non assigné |
| `pc_conversation_option_down` | (libellé non trouvé) | non assigné |
| `pc_conversation_option_select` | (libellé non trouvé) | non assigné |

## `prone` → À pied : tous  _(groupe : À PIED)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `prone_rollleft` | Roulade vers la gauche (à plat ventre) | non assigné |
| `prone_rollright` | Roulade vers la droite (à plat ventre) | non assigné |

## `mapui` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `mapui_pan_left` | (libellé non trouvé) | `a` |
| `mapui_pan_right` | (libellé non trouvé) | `d` |
| `mapui_pan_forward` | (libellé non trouvé) | `w` |
| `mapui_pan_back` | (libellé non trouvé) | `s` |
| `mapui_pan_up` | (libellé non trouvé) | `space` |
| `mapui_pan_down` | (libellé non trouvé) | `lctrl` |
| `mapui_cycle_section_forward` | (libellé non trouvé) | `e` |
| `mapui_cycle_section_backward` | (libellé non trouvé) | `q` |
| `mapui_cycle_zone_forward` | (libellé non trouvé) | `lshift+e` |
| `mapui_cycle_zone_backward` | (libellé non trouvé) | `lshift+q` |
| `mapui_action_planroute` | (libellé non trouvé) | `r` |
| `mapui_action_clearroute` | (libellé non trouvé) | `c` |
| `mapui_action_togglepin` | (libellé non trouvé) | `t` |
| `mapui_action_mylocation` | (libellé non trouvé) | `2` |
| `mapui_action_toggle_view_entire_zone` | (libellé non trouvé) | `z` |
| `mapui_action_toggleQTActions` | (libellé non trouvé) | `lshift` |
| `mapui_action_goto_selection` | (libellé non trouvé) | `3` |
| `mapui_action_step_back` | (libellé non trouvé) | `4` |
| `mapui_action_goto_localmap` | (libellé non trouvé) | `1` |

## `hacking` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `hacking_minigame_debug_toggle_command_input` | (libellé non trouvé) | `rshift` |
| `hacking_minigame_debug_mouse_x` | (libellé non trouvé) | non assigné |
| `hacking_minigame_debug_mouse_y` | (libellé non trouvé) | non assigné |
| `hacking_minigame_mouse_lmb` | (libellé non trouvé) | non assigné |
| `hacking_minigame_mouse_rmb` | (libellé non trouvé) | non assigné |
| `hacking_minigame_abort` | (libellé non trouvé) | `y` |
| `hacking_minigame_help_window_toggle` | (libellé non trouvé) | `h` |
| `hacking_minigame_camera_control` | (libellé non trouvé) | non assigné |
| `hacking_minigame_camera_x` | (libellé non trouvé) | non assigné |
| `hacking_minigame_camera_y` | (libellé non trouvé) | non assigné |
| `hacking_minigame_movement_up` | (libellé non trouvé) | `w` |
| `hacking_minigame_movement_down` | (libellé non trouvé) | `s` |
| `hacking_minigame_movement_left` | (libellé non trouvé) | `a` |
| `hacking_minigame_movement_right` | (libellé non trouvé) | `d` |
| `hacking_minigame_swap_rotate_cw` | (libellé non trouvé) | non assigné |
| `hacking_minigame_swap_rotate_ccw` | (libellé non trouvé) | non assigné |
| `hacking_minigame_ability_inject` | (libellé non trouvé) | `f` |
| `hacking_minigame_ability_ping` | (libellé non trouvé) | `tab` |
| `hacking_minigame_ability_slowdown` | (libellé non trouvé) | `q` |
| `hacking_minigame_ability_swap` | (libellé non trouvé) | `r` |
| `hacking_minigame_ability_wraparound` | (libellé non trouvé) | `e` |
| `hacking_minigame_cycle_input_mode` | (libellé non trouvé) | `i` |

## `tractor_beam` → À pied : tous  _(groupe : À PIED)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `tractor_beam_increase_distance` | Rayon tracteur : augmenter la distance | non assigné |
| `tractor_beam_decrease_distance` | Rayon tracteur : diminuer la distance | non assigné |
| `tractor_beam_rotate` | (libellé non trouvé) | `r` |
| `tractor_beam_rotate_x` | (libellé non trouvé) | non assigné |
| `tractor_beam_rotate_y` | (libellé non trouvé) | non assigné |
| `tractor_beam_rotate_z_up` | (libellé non trouvé) | non assigné |
| `tractor_beam_rotate_z_down` | (libellé non trouvé) | non assigné |
| `tractor_beam_detach` | (libellé non trouvé) | `b` |
| `tractor_beam_throw` | (libellé non trouvé) | `mouse2` |
| `tractor_beam_reset_rotation` | (libellé non trouvé) | `mouse3` |

## `mining` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `weapon_change_mining_throttle` | (libellé non trouvé: ui_CIFPSIncreaseMiningThrottle) | `lalt+maxis_z` |

## `incapacitated` → À pied : tous  _(groupe : À PIED)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `incapacitatedRespawn` | Régénération (en cas d’immobilisation) | `backspace` |

## `zero_gravity_eva` → EVA : toutes  _(groupe : EVA)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `eva_view_yaw_left` | Regarder à gauche | non assigné |
| `eva_view_yaw_right` | Regarder à droite | non assigné |
| `eva_view_yaw` | Regarder à gauche/droite | non assigné |
| `eva_view_yaw_mouse` | Regarder à gauche/droite | non assigné |
| `eva_view_pitch_up` | Regarder vers le haut | non assigné |
| `eva_view_pitch_down` | Regarder vers le bas | non assigné |
| `eva_view_pitch` | Regarder vers le haut/bas | non assigné |
| `eva_view_pitch_mouse` | Regarder vers le haut/bas | non assigné |
| `eva_roll_left` | Roulis vers la gauche | `q` |
| `eva_roll_right` | Roulis vers la droite | `e` |
| `eva_roll` | Roulis vers la gauche/droite | non assigné |
| `eva_strafe_up` | Déplacement vers le haut | `space` |
| `eva_strafe_down` | Déplacement vers le bas | `lctrl` |
| `eva_strafe_vertical` | Déplacement vers le haut/bas | non assigné |
| `eva_strafe_left` | Déplacement vers la gauche | `a` |
| `eva_strafe_right` | Déplacement vers la droite | `d` |
| `eva_strafe_lateral` | Déplacement vers la gauche/droite | non assigné |
| `eva_strafe_forward` | Déplacement vers l’avant | `w` |
| `eva_strafe_back` | Déplacement vers l’arrière | `s` |
| `eva_strafe_longitudinal` | Déplacement vers l’avant/l’arrière | non assigné |
| `eva_brake` | Freiner | `x` |
| `eva_boost` | Boost | `lshift` |
| `eva_toggle_headlook_mode` | Caméra libre (maintenir) | `z` |

## `zero_gravity_traversal` → (EN) E.V.A. - Zero-G Traversal

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `zgt_launch` | (EN) Launch from Surface | `space` |
| `zgt_detach` | (EN) Detach from Surface | `y` |
| `zgt_roll_left` | Roulis vers la gauche | `q` |
| `zgt_roll_right` | Roulis vers la droite | `e` |

## `vehicle_general` → Véhicule terrestre : général  _(groupe : Véhicule)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_horn` | Klaxonner | `space` |
| `v_view_cycle_fwd` | Parcourir les vues caméra | `f4` |
| `v_view_option` | (libellé non trouvé) | non assigné |
| `v_view_zoom_in` | Zoom avant (vue à la 3e personne) | non assigné |
| `v_view_zoom_out` | Zoom arrière (vue à la 3e personne) | non assigné |
| `v_view_yaw_mouse` | Regarder à gauche/droite | non assigné |
| `v_view_pitch_mouse` | Regarder vers le haut/bas | non assigné |
| `v_view_yaw` | Regarder à gauche/droite | non assigné |
| `v_view_pitch` | Regarder vers le haut/bas | non assigné |
| `v_view_freelook_mode` | Caméra libre (maintenir) | `z` |
| `v_toggle_cursor_input` | (libellé non trouvé) | `f11` |
| `v_view_yaw_absolute` | (libellé non trouvé) | `HMD_Yaw` |
| `v_view_pitch_absolute` | (libellé non trouvé) | `HMD_Pitch` |
| `v_view_roll_absolute` | (libellé non trouvé) | `HMD_Roll` |
| `mobiglas` | mobiGlas (ON/OFF) | `f1` |
| `v_flightready` | Préparation systèmes de vol | `ralt+r` |
| `v_toggle_all_doors` | Ouvrir/Fermer portes (ON/OFF) | non assigné |
| `v_open_all_doors` | Ouvre toutes les portes. | non assigné |
| `v_close_all_doors` | Ferme toutes les portes. | non assigné |
| `v_toggle_all_doorlocks` | Verrouiller/Déverrouiller portes (ON/OFF) | non assigné |
| `v_lock_all_doors` | Verrouille toutes les portes. | non assigné |
| `v_unlock_all_doors` | Déverrouiller toutes les portes | non assigné |
| `v_toggle_all_portlocks` | Verrouiller tous les ports (ON/OFF) | `ralt+K` |
| `v_lock_all_ports` | Verrouiller tous les ports | non assigné |
| `v_unlock_all_ports` | Déverrouiller tous les ports | non assigné |
| `v_starmap` | Carte | `f2` |
| `visor_wipe` | Essuyer la visière du casque | `lalt+x` |

## `vehicle_driver` → Véhicule terrestre : déplacement  _(groupe : Véhicule)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_move_forward` | Avancer | `w` |
| `v_move_back` | Reculer | `s` |
| `v_move` | Avancer/Reculer | non assigné |
| `v_yaw_left` | Tourner à gauche | `a` |
| `v_yaw_right` | Tourner à droite | `d` |
| `v_yaw` | Lacet à gauche/droite (axe/HOTAS) | non assigné |
| `v_yaw_mouse` | Lacet à gauche/droite (Souris) | non assigné |
| `v_pitch_up` | (EN) Ground Vehicles - Pitch Up | non assigné |
| `v_pitch_down` | (EN) Ground Vehicles - Pitch Down | non assigné |
| `v_pitch` | Tangage vers le haut/bas (axe, HOTAS) | non assigné |
| `v_pitch_mouse` | Tangage vers le haut/bas (souris) | non assigné |
| `v_brake` | Freiner | `x` |
| `v_view_dynamic_zoom_rel` | Zoom avant et arrière dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_rel_in` | Zoom avant dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_rel_out` | Zoom arrière dynamique (rel.) | non assigné |
| `v_view_dynamic_zoom_abs` | Zoom avant et arrière dynamique (abs.) | non assigné |
| `v_view_dynamic_zoom_abs_toggle` | Zoom dynamique ON/OFF (abs.) | non assigné |
| `v_boost` | Turbo | `lshift` |
| `v_lock_rotation` | Verrouiller le mouvement de tangage/lacet (ON/OFF, maintenir) | `rshift` |
| `v_mgv_switch_brake_on_idle` | (EN) Toggle Auto Braking On Idle | `c` |

## `debug` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `godmode` | (libellé non trouvé) | `f9` |
| `pause_and_fly` | (libellé non trouvé) | `pause` |
| `toggleaidebugdraw` | (libellé non trouvé) | `f11` |
| `ai_DebugCenterViewAgent` | (libellé non trouvé) | `np_divide` |
| `togglepdrawhelpers` | (libellé non trouvé) | `f10` |
| `mannequin_debugai` | (libellé non trouvé) | `np_multiply` |
| `pl_result_state_debug_target` | (libellé non trouvé) | `np_period` |
| `mov_advance_all_sequences` | (libellé non trouvé) | `end` |
| `mov_pause_resume_all_sequences` | (libellé non trouvé) | `home` |

## `IFCS_controls` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_IFCS_A` | (libellé non trouvé) | `rctrl+a` |
| `v_IFCS_B` | (libellé non trouvé) | `rctrl+b` |
| `v_IFCS_X` | (libellé non trouvé) | `rctrl+x` |
| `v_IFCS_Y` | (libellé non trouvé) | `rctrl+y` |

## `spectator` → Electronic Access : spectateur  _(groupe : Electronic Access : spectateur)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `spectate_next_target` | Cible en Caméra spectateur (suivante) | non assigné |
| `spectate_prev_target` | Cible en Caméra spectateur (précédente) | non assigné |
| `spectate_toggle_lock_target` | Verrouillage de cibles en Caméra spectateur | `1` |
| `spectate_zoom` | Zoom en Caméra spectateur | non assigné |
| `spectate_zoom_in` | Zoom avant en Caméra spectateur | non assigné |
| `spectate_zoom_out` | Zoom arrière en Caméra spectateur | non assigné |
| `spectate_rotateyaw_mouse` | Rotation en lacet en Caméra spectateur | non assigné |
| `spectate_rotatepitch_mouse` | Rotation en tangage en Caméra spectateur | non assigné |
| `spectate_rotateyaw` | Rotation en lacet en Caméra spectateur | non assigné |
| `spectate_rotatepitch` | Rotation en tangage en Caméra spectateur | non assigné |
| `spectate_toggle_hud` | HUD en Caméra spectateur (ON/OFF) | `b` |
| `spectate_gen_nextcamera` | (libellé non trouvé) | `n` |
| `spectate_gen_nextmode` | Mode Caméra spectateur (suivant) | `f4` |
| `spectate_gen_prevmode` | Mode Caméra spectateur (précédent) | non assigné |
| `spectate_moveleft` | (libellé non trouvé) | `a` |
| `spectate_moveright` | (libellé non trouvé) | `d` |
| `spectate_moveforward` | (libellé non trouvé) | `w` |
| `spectate_moveback` | (libellé non trouvé) | `s` |
| `spectate_moveup` | (libellé non trouvé) | `space` |
| `spectate_movedown` | (libellé non trouvé) | `lctrl` |
| `spectate_freecam_sprint` | (libellé non trouvé) | `lshift` |
| `spectate_toggle_freecam` | (libellé non trouvé) | `z` |
| `spectate_toggle_thirdperson` | (libellé non trouvé) | `f4` |
| `spectate_roll_left` | (libellé non trouvé) | `q` |
| `spectate_roll_right` | (libellé non trouvé) | `e` |
| `spectate_speed_increment` | (libellé non trouvé) | non assigné |
| `spectate_speed_decrement` | (libellé non trouvé) | non assigné |
| `spectate_free_look` | (libellé non trouvé) | `z` |

## `default` → Social : général  _(groupe : Social : général)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `skip_cutscene` | (libellé non trouvé) | non assigné |
| `cam_toggle_cinematic` | (libellé non trouvé) | `backspace` |
| `objectives` | (libellé non trouvé) | `o` |
| `toggle_trackview` | (libellé non trouvé) | `]` |
| `toggle_action_profile` | (libellé non trouvé) | non assigné |
| `respawn` | Respawn | `f` |
| `retry` | (libellé non trouvé) | `x` |
| `ready` | (libellé non trouvé) | `x` |
| `pl_exit` | Quitter le siège | `y` |
| `flymode` | (libellé non trouvé) | `f3` |
| `flymode_strafe_up` | (libellé non trouvé) | `space` |
| `flymode_strafe_down` | (libellé non trouvé) | `lctrl` |
| `flymode_roll_left` | (libellé non trouvé) | `q` |
| `flymode_roll_right` | (libellé non trouvé) | `e` |
| `ui_toggle_pause` | (libellé non trouvé) | `escape` |
| `ui_click` | (libellé non trouvé) | `enter` |
| `ui_back` | (libellé non trouvé) | `escape` |
| `ui_up` | (libellé non trouvé) | `up` |
| `ui_down` | (libellé non trouvé) | `down` |
| `ui_left` | (libellé non trouvé) | `left` |
| `ui_right` | (libellé non trouvé) | `right` |
| `ui_select` | (libellé non trouvé) | `enter` |
| `ui_secondary_select` | (libellé non trouvé) | non assigné |
| `ui_radialmenu_pageleft` | (libellé non trouvé) | `left` |
| `ui_radialmenu_pageright` | (libellé non trouvé) | `right` |
| `ui_confirm` | (libellé non trouvé) | non assigné |
| `ui_reset` | (libellé non trouvé) | non assigné |
| `ui_skip_video` | (libellé non trouvé) | `space` |
| `ui_hide_hint` | (libellé non trouvé) | `f` |
| `ui_primaryTab_increment` | (libellé non trouvé) | `e` |
| `ui_primaryTab_decrement` | (libellé non trouvé) | `q` |
| `ui_secondaryTab_increment` | (libellé non trouvé) | non assigné |
| `ui_secondaryTab_decrement` | (libellé non trouvé) | non assigné |
| `ui_focus_increment` | (libellé non trouvé) | `tab` |
| `ui_focus_decrement` | (libellé non trouvé) | `lshift+tab` |
| `flashui_mouse` | (libellé non trouvé) | non assigné |
| `flashui_return` | (libellé non trouvé) | non assigné |
| `flashui_backspace` | (libellé non trouvé) | `backspace` |
| `flashui_spacebar` | (libellé non trouvé) | `space` |
| `flashui_tab` | (libellé non trouvé) | `tab` |
| `flashui_kp_2` | (libellé non trouvé) | non assigné |
| `flashui_kp_3` | (libellé non trouvé) | non assigné |
| `flashui_kp_4` | (libellé non trouvé) | non assigné |
| `flashui_kp_7` | (libellé non trouvé) | non assigné |
| `flashui_up` | (libellé non trouvé) | `up` |
| `flashui_down` | (libellé non trouvé) | `down` |
| `flashui_left` | (libellé non trouvé) | `left` |
| `flashui_right` | (libellé non trouvé) | `right` |
| `notification_accept` | (EN) Notifications - Accept Prompt | `lbracket` |
| `notification_decline` | (EN) Notifications - Decline Prompt | `rbracket` |
| `toggle_contact` | Appli CommLink (ON/OFF) | `f11` |
| `toggle_chat` | Fenêtre de discussion (ON/OFF) | `f12` |
| `cycle_chat_lobby` | (EN) Cycle Chat Lobby | `tab` |
| `focus_on_chat_textinput` | Centrer sur la fenêtre de discussion | non assigné |
| `ui_copy` | (libellé non trouvé) | `lctrl+c` |
| `ui_cut` | (libellé non trouvé) | `lctrl+x` |
| `ui_paste` | (libellé non trouvé) | `lctrl+v` |

## `ui_textfield` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `ui_textfield_enter` | (libellé non trouvé) | non assigné |
| `ui_textfield_backspace` | (libellé non trouvé) | `backspace` |
| `ui_textfield_arrow_up` | (libellé non trouvé) | `up` |
| `ui_textfield_arrow_down` | (libellé non trouvé) | `down` |
| `ui_textfield_arrow_left` | (libellé non trouvé) | `left` |
| `ui_textfield_arrow_right` | (libellé non trouvé) | `right` |

## `ui_notification` → Social : invitations  _(groupe : Social : général)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `ui_notification_accept` | Accepter l’invitation | `lbracket` |
| `ui_notification_decline` | Décliner l’invitation | `rbracket` |
| `ui_notification_ignore` | Ignorer l’invitation (maintenir) | `rbracket` |

## `player_emotes` → Social : Emotes  _(groupe : À PIED)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `emote_cs_forward` | En avant | `np_5` |
| `emote_cs_left` | À gauche | `np_1` |
| `emote_cs_right` | À droite | `np_3` |
| `emote_cs_stop` | Stop | `np_2` |
| `emote_cs_yes` | Oui | `np_4` |
| `emote_cs_no` | Non | `np_6` |
| `emote_agree` | D’accord | non assigné |
| `emote_angry` | Colère | non assigné |
| `emote_atease` | Repos | non assigné |
| `emote_attention` | Garde-à-vous | non assigné |
| `emote_blah` | Blabla | non assigné |
| `emote_bored` | Ennui | non assigné |
| `emote_bow` | Révérence | non assigné |
| `emote_burp` | Rot | non assigné |
| `emote_cheer` | Hourra | non assigné |
| `emote_chicken` | Froussard | non assigné |
| `emote_clap` | Applaudissement | non assigné |
| `emote_come` | Viens | non assigné |
| `emote_cry` | Pleurer | non assigné |
| `emote_dance` | Danser | non assigné |
| `emote_disagree` | Désaccord | non assigné |
| `emote_failure` | Échec | non assigné |
| `emote_flex` | Muscles | non assigné |
| `emote_flirt` | Bisou | non assigné |
| `emote_gasp` | Surprise | non assigné |
| `emote_gloat` | Jubiler | non assigné |
| `emote_greet` | Saluer | non assigné |
| `emote_laugh` | Rire | non assigné |
| `emote_launch` | Confirmer le lancement | non assigné |
| `emote_point` | Pointer | non assigné |
| `emote_rude` | Vulgaire | non assigné |
| `emote_salute` | Salut | non assigné |
| `emote_sit` | S’asseoir | non assigné |
| `emote_sleep` | Dormir | non assigné |
| `emote_smell` | Odeur | non assigné |
| `emote_taunt` | Provoquer | non assigné |
| `emote_threaten` | Menacer | non assigné |
| `emote_wait` | Attendre | non assigné |
| `emote_wave` | Coucou | non assigné |
| `emote_whistle` | Siffler | non assigné |

## `player_input_optical_tracking` → VoIP, FoIP et Suivi de la tête  _(groupe : VoIP, FoIP et Suivi de la tête)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `hmd_toggle` | [Expérimental] VR : activer ou désactiver | `np_divide` |
| `hmd_recenter` | [Expérimental] VR : recentrer l’appareil | `np_5` |
| `hmd_theater_mode_toggle` | [Expérimental] VR : activer ou désactiver le mode Vidéo | `lalt+np_5` |
| `hmd_lens_display_toggle` | [Expérimental] VR : activer ou désactiver la visière | non assigné |
| `headtrack_enabled` | Activer le suivi de la tête | `np_divide` |
| `headtrack_hold` | Suivi de la tête (maintenir) | non assigné |
| `headtrack_recenter_device` | Recentrer le dispositif de suivi de la tête (sauf TrackIR) | `np_5` |
| `headtrack_camera_enabled` | Activer/Désactiver le suivi de la tête pour la caméra à la troisième personne (ON/OFF) | non assigné |
| `foip_pushtotalk` | Appuyer pour parler avec le VoIP | `np_add` |
| `foip_pushtotalk_proximity` | Parler avec le VoIP (à proximité uniquement) | `lalt+np_add` |
| `foip_viewownplayer` | Caméra à selfie FoIP | `np_subtract` |
| `foip_recalibrate` | Recalibrer FoIP | `np_multiply` |
| `foip_cyclechannel` | Parcourir les canaux audio | `np_period` |

## `player_choice` → Raccourcis, interactions et pensée intérieure  _(groupe : Raccourcis, interactions et pensée intérieure)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `pc_item_primary` | (libellé non trouvé) | non assigné |
| `pc_item_secondary` | (libellé non trouvé) | non assigné |
| `pc_interaction_mode` | Mode Interaction | `f` |
| `pc_interaction_select` | Activer Pensée intérieure | non assigné |
| `pc_select` | Activer Pensée intérieure | non assigné |
| `pc_focus` | Regarder | non assigné |
| `pc_zoom_in` | Mode Interaction : zoom avant | non assigné |
| `pc_zoom_out` | Mode Interaction : zoom arrière | non assigné |
| `pc_screen_focus_left` | E.M.F. (gauche) | `a` |
| `pc_screen_focus_right` | E.M.F. (droite) | `d` |
| `pc_screen_focus_up` | E.M.F. (haut) | `w` |
| `pc_screen_focus_down` | E.M.F. (bas) | `s` |
| `pc_personal_thought` | Pensée intérieure (PI) | `lalt+f` |
| `pc_camera_orbit` | (EN) Inventory Orbit Camera Mode | non assigné |
| `pc_personal_back` | Sortie | `np_0` |
| `pc_ui_back` | (libellé non trouvé) | non assigné |
| `pc_pit_inventory` | (EN) Toggle Inventory (short press) | `i` |
| `pc_pit_looting` | (EN) Toogle Loot Screen (hold) | `i` |
| `pc_pit_looting_toggle_view` | (EN) Toggle Looting View | `tab` |
| `pc_pit_looting_toggle_weapon_attachments` | (libellé non trouvé: ui_CIInteractionLootingToggleWeaponAttachments) | `q` |
| `pc_pit_item_unstown` | (libellé non trouvé) | non assigné |
| `pc_pit_item_drop` | Déposer l’objet | non assigné |
| `pc_pit_empty_backpack` | Stocker toutes les ressources | non assigné |
| `pc_pit_player_actions` | Actions du joueur (catégorie M.P.) | non assigné |
| `pc_pit_emotes` | Emotes (catégorie M.P.) | non assigné |
| `pc_pit_ship_systems` | Systèmes de navigation (catégorie M.P.) | non assigné |
| `pc_pit_flight_systems` | Systèmes de vol (catégorie M.P.) | non assigné |
| `pc_pit_vehicle_actions` | Actions du véhicule (catégorie M.P.) | non assigné |
| `pc_pit_weapons_systems` | Systèmes d’armes (catégorie M.P.) | non assigné |
| `pc_pit_remote_turrets` | Tourelle à distance (catégorie M.P.) | non assigné |
| `pc_pit_item_actions` | Actions de l’objet (catégorie M.P.) | non assigné |
| `pc_pit_weapon_selection` | Sélection d’armes (catégorie M.P.) | non assigné |
| `pc_pit_mobiglas_actions` | Actions du mobiGlas (catégorie M.P.) | non assigné |
| `pc_pit_miningmode_actions` | Actions du mode Extraction minière (catégorie M.P.) | `lalt+m` |
| `pc_qs_weapons_pit_primary` | Menu radial de sélection d’armes | `1` |
| `pc_qs_weapons_pit_secondary` | Menu radial de sélection d’armes | `1` |
| `pc_qs_weapons_pit_sidearm` | Menu radial de sélection d’armes | `2` |
| `pc_qs_grenades` | Menu radial de sélection d’objets de lancer | `g` |
| `pc_qs_consumables` | (EN) Consumable Select Radial Menu  | `4` |

## `flycam` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `flycam_rotateyaw` | (libellé non trouvé) | non assigné |
| `flycam_rotatepitch` | (libellé non trouvé) | non assigné |
| `flycam_rotateyaw_mouse` | (libellé non trouvé) | non assigné |
| `flycam_rotatepitch_mouse` | (libellé non trouvé) | non assigné |
| `flycam_movey` | (libellé non trouvé) | non assigné |
| `flycam_movefwd` | (libellé non trouvé) | `w` |
| `flycam_moveback` | (libellé non trouvé) | `s` |
| `flycam_movex` | (libellé non trouvé) | non assigné |
| `flycam_moveright` | (libellé non trouvé) | `d` |
| `flycam_moveleft` | (libellé non trouvé) | `a` |
| `flycam_movez` | (libellé non trouvé) | non assigné |
| `flycam_moveup` | (libellé non trouvé) | `q` |
| `flycam_movedown` | (libellé non trouvé) | `e` |
| `flycam_speedup` | (libellé non trouvé) | `up` |
| `flycam_speeddown` | (libellé non trouvé) | `down` |
| `flycam_turbo` | (libellé non trouvé) | `space` |
| `flycam_setpoint` | (libellé non trouvé) | `z` |
| `flycam_play` | (libellé non trouvé) | `x` |
| `flycam_clear` | (libellé non trouvé) | `c` |

## `view_director_mode` → Caméra : commandes avancées de la caméra  _(groupe : CAMÉRA)_

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `view_enable_camview_mode` | Modificateur des commandes avancées de la caméra (maintenir) | `f4` |
| `view_switch_to_alternative` | Modificateur des commandes avancées de la caméra (maintenir) | `z` |
| `view_save_view_1` | Sauvegarder la vue 1 | `np_1` |
| `view_save_view_2` | Sauvegarder la vue 2 | `np_2` |
| `view_save_view_3` | Sauvegarder la vue 3 | `np_3` |
| `view_save_view_4` | Sauvegarder la vue 4 | `np_4` |
| `view_save_view_5` | Sauvegarder la vue 5 | `np_5` |
| `view_save_view_6` | Sauvegarder la vue 6 | `np_6` |
| `view_save_view_7` | Sauvegarder la vue 7 | `np_7` |
| `view_save_view_8` | Sauvegarder la vue 8 | `np_8` |
| `view_save_view_9` | Sauvegarder la vue 9 | `np_9` |
| `view_load_view_1` | Charger la vue 1 | `np_1` |
| `view_load_view_2` | Charger la vue 2 | `np_2` |
| `view_load_view_3` | Charger la vue 3 | `np_3` |
| `view_load_view_4` | Charger la vue 4 | `np_4` |
| `view_load_view_5` | Charger la vue 5 | `np_5` |
| `view_load_view_6` | Charger la vue 6 | `np_6` |
| `view_load_view_7` | Charger la vue 7 | `np_7` |
| `view_load_view_8` | Charger la vue 8 | `np_8` |
| `view_load_view_9` | Charger la vue 9 | `np_9` |
| `view_reset_saved` | Effacer la vue sauvegardée | `np_0` |
| `view_move_target_X_pos` | Compensation positive de X | `right` |
| `view_move_target_X_neg` | Compensation négative de  X | `left` |
| `view_move_target_Y_pos` | Compensation positive de Y/Point focal vers l’avant en Caméra spectateur libre | `up` |
| `view_move_target_Y_neg` | Compensation négative de Y/Point focal vers l’arrière en Caméra spectateur libre | `down` |
| `view_move_target_Z_pos` | Compensation positive de Z | `pgup` |
| `view_move_target_Z_neg` | Compensation négative de Z | `pgdn` |
| `view_fov_in` | Augmenter le champ de vision | `np_add` |
| `view_fov_out` | Réduire le champ de vision | `np_subtract` |
| `view_fstop_in` | Augmenter la profondeur de champ | `home` |
| `view_fstop_out` | Réduire la profondeur de champ | `end` |
| `view_restore_defaults` | Réinitialiser la vue actuelle | `np_multiply` |

## `character_customizer` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `character_customizer_yaw` | (libellé non trouvé) | non assigné |
| `character_customizer_pitch` | (libellé non trouvé) | non assigné |
| `character_customizer_gp_yaw` | (libellé non trouvé) | non assigné |
| `character_customizer_gp_pitch` | (libellé non trouvé) | non assigné |
| `character_customizer_zoom_in` | (libellé non trouvé) | non assigné |
| `character_customizer_zoom_out` | (libellé non trouvé) | non assigné |
| `character_customizer_select` | (libellé non trouvé) | `f` |
| `character_customizer_enable_dna_edit` | (libellé non trouvé) | non assigné |
| `character_customizer_enable_rotation` | (libellé non trouvé) | `lshift` |
| `character_customizer_enable_mouse_rotation` | (libellé non trouvé) | non assigné |
| `character_customizer_library_scroll_up` | (libellé non trouvé) | `up` |
| `character_customizer_library_scroll_down` | (libellé non trouvé) | `down` |
| `character_customizer_edit_dna_pos` | (libellé non trouvé) | `right` |
| `character_customizer_edit_dna_neg` | (libellé non trouvé) | `left` |
| `character_customizer_yaw_left` | (libellé non trouvé) | `left` |
| `character_customizer_yaw_right` | (libellé non trouvé) | `right` |
| `character_customizer_pitch_up` | (libellé non trouvé) | `up` |
| `character_customizer_pitch_down` | (libellé non trouvé) | `down` |
| `character_customizer_step_up` | (libellé non trouvé) | `e` |
| `character_customizer_step_down` | (libellé non trouvé) | `q` |
| `character_customizer_feature_up` | (libellé non trouvé) | `d` |
| `character_customizer_feature_down` | (libellé non trouvé) | `a` |
| `character_customizer_dnamode_up` | (libellé non trouvé) | `d` |
| `character_customizer_dnamode_down` | (libellé non trouvé) | `a` |
| `character_customizer_next_material_region` | (libellé non trouvé) | `f` |
| `character_customizer_toggle_face_tracking` | (libellé non trouvé) | `space` |
| `character_customizer_dnaHandle_select` | (libellé non trouvé) | non assigné |
| `character_customizer_dnaHandle_deselect` | (libellé non trouvé) | non assigné |

## `RemoteRigidEntityController` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `remote_moveForward` | (libellé non trouvé) | `w` |
| `remote_moveBack` | (libellé non trouvé) | `s` |
| `remote_moveLeft` | (libellé non trouvé) | `a` |
| `remote_moveRight` | (libellé non trouvé) | `d` |
| `remote_moveUp` | (libellé non trouvé) | `space` |
| `remote_moveDown` | (libellé non trouvé) | `lctrl` |
| `remote_scaleUp` | (libellé non trouvé) | `c` |
| `remote_scaleDown` | (libellé non trouvé) | `z` |
| `remote_rollLeft` | (libellé non trouvé) | `q` |
| `remote_rollRight` | (libellé non trouvé) | `e` |
| `remote_rotatePitch` | (libellé non trouvé) | non assigné |
| `remote_rotateYaw` | (libellé non trouvé) | non assigné |
| `remote_switchControl` | (libellé non trouvé) | `v` |
| `remote_stopControl` | (libellé non trouvé) | `y` |
| `remote_action1` | (libellé non trouvé) | non assigné |
| `remote_action2` | (libellé non trouvé) | non assigné |
| `remote_switchTarget` | (libellé non trouvé) | `b` |

## `server_renderer` → (libellé non trouvé)

| Nom interne (action) | Nom propre FR affiché (menu) | Touche associée |
|---|---|---|
| `v_view_cycle_fwd` | (libellé non trouvé) | `f4` |

