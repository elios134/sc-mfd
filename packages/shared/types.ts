// @sc-mfd/shared — types du contrat commun desktop ↔ tablet.
// TS pur, aucune logique : uniquement la forme des données partagées.

/**
 * Modificateurs clavier reconnus par Star Citizen.
 * On distingue gauche/droite car SC les traite comme des touches distinctes
 * (ex : `ralt` pour l'amplification lumineuse vs `lalt` pour l'ATC).
 */
export type Modifier =
  | "lalt"
  | "ralt"
  | "lshift"
  | "rshift"
  | "lctrl"
  | "rctrl";

/**
 * Une combinaison de touches.
 * `key`       : touche principale en minuscule (ex "u", "f6", "n").
 * `modifiers` : modificateurs maintenus, `[]` si aucun.
 */
export interface KeyBind {
  key: string;
  modifiers: Modifier[];
}

/** Les écrans MFD de l'application. (`bouclier` et `missiles` = écrans ajoutés pour la 2e UI / variante B.) */
export type MfdId = "energie" | "config" | "bouclier" | "missiles";

/**
 * Sous-groupe de l'écran `config` (pills Vol / Armes / HUD de la maquette).
 * `null` pour toute action hors de l'écran config.
 */
export type ConfigFilter = "vol" | "armes";

/**
 * État de la liaison touche d'une action.
 * `default`   : touche déjà assignée par le jeu, on ne la modifie pas.
 * `to_assign` : action non assignée (—) dans le rapport, sans touche.
 * `profile`   : action assignée par NOTRE control-profile « SC MFD » (touche
 *               rctrl+… que le profil dépose dans le jeu, cf. chantier C3b).
 */
export type BindStatus = "default" | "to_assign" | "profile";

/**
 * Comment la touche s'active dans Star Citizen — l'émulation (chantier B)
 * en a besoin : un appui long ne se reproduit pas par un simple tap.
 * Valeurs ramenées depuis l'attribut `activationMode` du defaultProfile :
 *   `press` : appui simple/court — `press` ou `tap` côté jeu (déclenche au tap).
 *   `long`  : appui maintenu jusqu'à un seuil — `delayed_press` / `delayed_hold`
 *             (ex « cycle mode master » sur B, « amarrage » sur N).
 *   `hold`  : maintenu en continu tant que la touche est enfoncée — `all` /
 *             onPress+onRelease côté jeu. Aucune action de ce type dans la
 *             table actuelle ; valeur conservée pour les futurs ajouts.
 */
export type ActivationMode = "press" | "long" | "hold";

/**
 * Une action pilotable depuis le MFD.
 * `bind` est `null` si et seulement si `status` vaut `"to_assign"`.
 */
export interface MfdAction {
  /** Identifiant technique Star Citizen, ex "v_power_toggle". */
  id: string;
  labelFr: string;
  labelEn: string;
  /** Écran d'appartenance. */
  mfd: MfdId;
  /** Sous-groupe config, `null` hors config. */
  filter: ConfigFilter | null;
  /** Combinaison de touches, `null` si `status === "to_assign"`. */
  bind: KeyBind | null;
  status: BindStatus;
  /** Mode d'activation de la touche (défaut `"press"` ; voir ActivationMode). */
  activation: ActivationMode;
}
