# Pont écrans MFD ↔ commandes mappables (Star Citizen)

Livrable **B1** : pour chaque écran MFD du jeu, ce qu'il affiche (champs FR, indicatif) et les commandes qu'on peut y associer (touche par défaut ou `non assigné`). Objectif : remplir nos futurs MFD.

## Méthode & sources (croisement, lecture seule)

1. **Inventaire réel des écrans** : noms de fichiers `.swf` sous `Data\UI\ShipInterface\…` du `Data.p4k` (NON décompilés — B2 hors scope ; seuls les noms servent d'inventaire).
2. **Libellés FR** : `global.ini` (`french_(france)`) — pages `ui_MFD_View_*`, champs `mfd_*`, réglages `ui_mfd_config_*`.
3. **Commandes** : `docs/audit-commandes-star-citizen.csv` (actionmaps + nom interne/FR + touche).

**Lien autoritatif page↔commande** : l'actionmap `vehicle_mfd` contient des commandes `v_mfd_select_view_*` nommant directement chaque vue. Le lien vue↔domaine (actionmap d'actions) est déduit par concordance de noms ; toute incertitude est notée **« à confirmer »**. Rien n'est inventé.

> ⚠ **Limite B1** : la liste des *champs* est indicative (seules ~30 clés `mfd_*` localisées). Le détail widget-par-widget et le câblage exact bouton→action sont dans les `.swf` compilés → **B2** (décompilation JPEXS), signalé par écran.

## Synthèse

- **Écrans/pages MFD recensés** : 14 (dont 10 pages `ui_MFD_View_*` et 4 contrôleurs SWF additionnels).
- 3 états système non mappables : `Off`, `None`, `Invalid`.

Potentiel à mapper (commandes `non assigné`) par écran :

| Écran MFD | Actionmap(s) | Commandes | dont `non assigné` |
|---|---|---|---|
| Gestion de l'énergie | `spaceship_power` | 29 | 8 |
| Boucliers | `spaceship_defensive` | 12 | 8 |
| Configuration armes | `spaceship_weapons`, `spaceship_missiles` | 63 | 52 |
| Scan en cours… | `spaceship_scanning`, `spaceship_radar` | 12 | 3 |
| État cible | `spaceship_targeting`, `spaceship_targeting_advanced` | 47 | 25 |
| S.C.V.I. (IFCS) | `spaceship_movement`, `IFCS_controls` | 108 | 72 |
| Communications | `spaceship_target_hailing` | 2 | 1 |
| Diagnostics | — | 3 | 3 |
| État personnel | — | 0 | 0 |
| Configuration (du véhicule) | — | 0 | 0 |
| Extraction minière (contrôleur) | `spaceship_mining` | 10 | 2 |
| Voyage quantique / Navigation (contrôleur) | `spaceship_quantum` | 1 | 0 |
| Tourelle (contrôleur) | `turret_movement`, `turret_advanced` | 26 | 18 |
| Véhicule terrestre (contrôleur) | `vehicle_driver`, `vehicle_general` | 47 | 27 |
| _(Navigation entre pages)_ | `vehicle_mfd` | 55 | 53 |

---

## Partie A — Pages MFD (énumération `ui_MFD_View_*`)

### Gestion de l'énergie

- **Clé de page** : `ui_MFD_View_ResourceNetwork`
- **Fichier(s) SWF (inventaire)** : `EnergyController_RTT.swf`, `PowerStatus.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_resource_network_short` — Changer de vue : Réseau de ressources (appuyer) — non assigné
  - `v_mfd_select_view_resource_network_long` — Changer de vue : Réseau de ressources (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : mfd_power_overview = Aperçu de la puissance; mfd_power_components = Composants de puissance; mfd_power_view = Vue de la puissance; mfd_power_log = Écran de la puissance
- **Correspondance domaine → actionmap** : confirmé (nom de vue ↔ actionmap concordants)

**`spaceship_power` → Vol : alimentation** — 29 commandes, 8 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### Boucliers

- **Clé de page** : `ui_MFD_View_Shields`
- **Fichier(s) SWF (inventaire)** : `ShieldController_RTT.swf`, `ShieldStatus.swf`
- **Accès à la vue** : Aucune commande `v_mfd_select_view_*` dédiée aux boucliers dans `vehicle_mfd` (vue atteinte par cyclage). Contrôles boucliers dans `spaceship_defensive`.
- **Champs affichés (FR, indicatif)** : _(aucun libellé `mfd_*` spécifique localisé — détail en B2)_
- **Correspondance domaine → actionmap** : confirmé (domaine boucliers/contre-mesures)

**`spaceship_defensive` → Véhicules : boucliers et contre-mesures** — 12 commandes, 8 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### Configuration armes

- **Clé de page** : `ui_MFD_View_WeaponConfig`
- **Fichier(s) SWF (inventaire)** : `WeaponController_RTT.swf`
- **Accès à la vue** : Aucune commande `v_mfd_select_view_*` dédiée à la config armes dans `vehicle_mfd` (vue atteinte par cyclage).
- **Champs affichés (FR, indicatif)** : mfd_missile_armed = Armé
- **Correspondance domaine → actionmap** : confirmé (armes) ; missiles ajoutés — à confirmer si même écran ou écran Missiles séparé

**`spaceship_weapons` → Véhicules : armes** — 49 commandes, 44 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`spaceship_missiles` → Véhicules : missiles** — 14 commandes, 8 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### Scan en cours…

- **Clé de page** : `ui_MFD_View_Scanning`
- **Fichier(s) SWF (inventaire)** : `Radar.swf`, `Radar_RTT.swf`, `3DRadarScreen_RTT.swf`, `ProjectionRadar.swf`, `Background_Radar.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_scanning_short` — Changer de vue : Scan (appuyer) — non assigné
  - `v_mfd_select_view_scanning_long` — Changer de vue : Scan (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : mfd_scan_ID = Identifiant enregistré; mfd_Emission_IR = Émissions infrarouges; mfd_Emission_EM = Émissions électromagnétiques; mfd_Emission_CS = Émissions à surface équivalente
- **Correspondance domaine → actionmap** : confirmé (scan) ; radar inclus (ping/radar même domaine — à confirmer)

**`spaceship_scanning` → Véhicules : scan** — 11 commandes, 3 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`spaceship_radar` → Vol : radar** — 1 commandes, 0 `non assigné`

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_invoke_ping` | Activer le ping | `tab` |

---

### État cible

- **Clé de page** : `ui_MFD_View_TargetStatus`
- **Fichier(s) SWF (inventaire)** : `TargetSelector_RTT.swf`, `TargetStatus.swf`, `TrackedTargets.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_target_status_short` — Changer de vue : État de la cible (appuyer) — non assigné
  - `v_mfd_select_view_target_status_long` — Changer de vue : État de la cible (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : mfd_target_integrity = Intégrité de la cible; mfd_target_profile = Profil de la cible; mfd_target_range = Portée de la cible; mfd_target_view = Vue de la cible; mfd_scan_ID = Identifiant enregistré
- **Correspondance domaine → actionmap** : confirmé (ciblage + parcours de cibles)

**`spaceship_targeting` → Véhicules : ciblage** — 25 commandes, 15 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`spaceship_targeting_advanced` → Véhicules : parcourir des cibles** — 22 commandes, 10 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### S.C.V.I. (IFCS)

- **Clé de page** : `ui_MFD_View_IFCS`
- **Fichier(s) SWF (inventaire)** : `FlightController_RTT.swf`, `FlightController.swf`, `FlightInfo.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_ifcs_short` — Changer de vue : S.C.V.I. (appuyer) — non assigné
  - `v_mfd_select_view_ifcs_long` — Changer de vue : S.C.V.I. (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : (réglages dans la vue Configuration, onglet S.C.V.I. : ui_mfd_config_ifcs_*)
- **Correspondance domaine → actionmap** : confirmé (mouvement/vol) ; IFCS_controls = actionmap technique sans libellé

**`spaceship_movement` → Vol : mouvement** — 104 commandes, 72 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`IFCS_controls` → (libellé non trouvé)** — 4 commandes, 0 `non assigné`

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_IFCS_A` | (libellé non trouvé) | `rctrl+a` |
| `v_IFCS_B` | (libellé non trouvé) | `rctrl+b` |
| `v_IFCS_X` | (libellé non trouvé) | `rctrl+x` |
| `v_IFCS_Y` | (libellé non trouvé) | `rctrl+y` |

---

### Communications

- **Clé de page** : `ui_MFD_View_Communications`
- **Fichier(s) SWF (inventaire)** : `CommsController_RTT.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_comms_short` — Changer de vue : Communications (appuyer) — non assigné
  - `v_mfd_select_view_comms_long` — Changer de vue : Communications (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : _(aucun libellé `mfd_*` spécifique localisé — détail en B2)_
- **Correspondance domaine → actionmap** : À CONFIRMER : pas d'actionmap 'comms' dédié. `spaceship_target_hailing` (contacter la cible) est le plus proche ; `v_comm_open_chat` existe aussi dans `spaceship_hud`. Câblage exact = B2.

**`spaceship_target_hailing` → Vol : accrochage de cibles** — 1 commandes, 0 `non assigné`

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_target_hail` | Contacter l’objectif | `9` |

**Commandes liées (dispersées dans d'autres actionmaps)**

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_comm_open_chat` | (libellé non trouvé) | non assigné |

---

### Diagnostics

- **Clé de page** : `ui_MFD_View_Diagnostics`
- **Fichier(s) SWF (inventaire)** : `CoolerController_RTT.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_diagnostics_short` — Changer de vue : Diagnostics (appuyer) — non assigné
  - `v_mfd_select_view_diagnostics_long` — Changer de vue : Diagnostics (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : _(aucun libellé `mfd_*` spécifique localisé — détail en B2)_
- **Correspondance domaine → actionmap** : À CONFIRMER : pas d'actionmap dédié. Domaine = refroidissement + réparation, dispersé : `v_cooler_throttle_up/down` (spaceship_general) et `v_mfd_quick_action_repair_all` (vehicle_mfd).

**Commandes liées (dispersées dans d'autres actionmaps)**

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_cooler_throttle_up` | Augmenter le taux de refroidissement | non assigné |
| `v_cooler_throttle_down` | Réduire le taux de refroidissement | non assigné |
| `v_mfd_quick_action_repair_all` | (libellé non trouvé: ui_CIMFD_Quick_Action_Repair_All) | non assigné |

---

### État personnel

- **Clé de page** : `ui_MFD_View_SelfStatus`
- **Fichier(s) SWF (inventaire)** : `OwnShipStatus.swf`
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_self_status_short` — Changer de vue : État personnel (appuyer) — non assigné
  - `v_mfd_select_view_self_status_long` — Changer de vue : État personnel (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : mfd_fuel_Hydrogen = Réserve H2; mfd_fuel_Quantum = Carburant quantique; mfd_view_self_status_weapon_loadout = Équipement tactique; mfd_overall_view = Vue d'ensemble; mfd_custom_view = Vue personnalisée
- **Correspondance domaine → actionmap** : Écran d'AFFICHAGE (état du vaisseau) — pas de commandes d'action directes dans le profil. À confirmer en B2.

_Pas de commandes d'action directes pour cet écran (affichage/réglages). Candidat B2 pour le câblage exact._

---

### Configuration (du véhicule)

- **Clé de page** : `ui_MFD_View_Configuration`
- **Fichier(s) SWF (inventaire)** : _(aucun SWF dédié identifié)_
- **Commande(s) d'accès à la vue** (`vehicle_mfd`) :
  - `v_mfd_select_view_configuration_short` — Changer de vue : Configuration du véhicule (appuyer) — non assigné
  - `v_mfd_select_view_configuration_long` — Changer de vue : Configuration du véhicule (maintenir) — non assigné
- **Champs affichés (FR, indicatif)** : ui_mfd_config_tab_vehicle = VÉHICULE; ui_mfd_config_tab_hud = HUD; ui_mfd_config_tab_gunnery = ARTILLEUR; ui_mfd_config_dashboard_advanced_hud = Activer le HUD avancé; ui_mfd_config_gunnery_convergence_distance = Distance de convergence; ui_mfd_config_ifcs_coupled = Activer le mode Couplé; ui_mfd_config_lights = Allumer les phares; (… ~40 bascules ui_mfd_config_*)
- **Correspondance domaine → actionmap** : Page de RÉGLAGES (onglets VÉHICULE/HUD/ARTILLEUR/S.C.V.I.) — bascules de configuration, pas de commandes mappables au sens touches. Voir clés `ui_mfd_config_*`.

_Pas de commandes d'action directes pour cet écran (affichage/réglages). Candidat B2 pour le câblage exact._

---

## Partie B — Écrans-contrôleurs SWF hors énumération `ui_MFD_View_*`

### Extraction minière (contrôleur)

- **Fichier(s) SWF** : `MiningController_RTT.swf`
- **Correspondance** : confirmé (SWF MiningController ↔ spaceship_mining). Hors énum ui_MFD_View_* (mode opérateur).
- **Note** : Activé via mode opérateur minage (`v_toggle_mining_mode`, seat_general).

**`spaceship_mining` → Véhicule : extraction minière** — 10 commandes, 2 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### Voyage quantique / Navigation (contrôleur)

- **Fichier(s) SWF** : `QuantumDrive_RTT.swf`, `Navigation_RTT.swf`
- **Correspondance** : à confirmer : SWF QuantumDrive/Navigation ↔ spaceship_quantum (1 seule commande). Amarrage = spaceship_docking séparé.
- **Note** : Voir aussi `spaceship_docking` (amarrage).

**`spaceship_quantum` → Vol : voyage quantique** — 1 commandes, 0 `non assigné`

| Nom interne | Nom FR | Touche |
|---|---|---|
| `v_toggle_qdrive_engagement` | Activer la propulsion quantique (maintenir) | `mouse1` |

---

### Tourelle (contrôleur)

- **Fichier(s) SWF** : `TurretController_RTT.swf`, `TurretCameraHUD.swf`
- **Correspondance** : confirmé (SWF TurretController ↔ turret_movement/advanced).
- **Note** : Écran présent quand on opère une tourelle.

**`turret_movement` → Mouvement de la tourelle** — 17 commandes, 11 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`turret_advanced` → Tourelle avancée** — 9 commandes, 7 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

### Véhicule terrestre (contrôleur)

- **Fichier(s) SWF** : `WheeledController_RTT.swf`
- **Correspondance** : confirmé (SWF WheeledController ↔ véhicule terrestre).
- **Note** : MFD des véhicules à roues.

**`vehicle_driver` → Véhicule terrestre : déplacement** — 20 commandes, 12 `non assigné`

| Nom interne | Nom FR | Touche |
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

**`vehicle_general` → Véhicule terrestre : général** — 27 commandes, 15 `non assigné`

| Nom interne | Nom FR | Touche |
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

---

## Partie C — Navigation entre les écrans (`vehicle_mfd`)

Commandes transversales pour parcourir/sélectionner les MFD (cyclage, déplacement du curseur, sélection d'un écran physique). Quasi toutes `non assigné` → fort potentiel pour un profil dédié tablette/MFD.

| Nom interne | Nom FR | Touche |
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

> Les commandes `v_mfd_select_view_*` (accès direct à une vue) sont listées écran par écran en Partie A.

## Écrans système (non mappables)

`ui_MFD_View_Off` = E.M.F. éteint · `ui_MFD_View_None` = Aucun · `ui_MFD_View_Invalid` = Vue E.M.F. inconnue — états d'affichage, pas de commandes.
