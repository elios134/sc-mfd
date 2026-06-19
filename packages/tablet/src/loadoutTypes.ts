import type { ComponentType } from "react";
import type { ConnState } from "./useConnection";

// Contrat reçu par TOUTE UI MFD de loadout. C'est le point d'extension :
// ajouter un loadout = fournir un composant qui accepte ces props.
//   - accent  : couleur d'accent du thème du loadout (zone C), à appliquer sur
//               son conteneur .stage via useThemeZone.
//   - conn*   : connexion WS partagée (tenue par App, survit au retour accueil).
export type LoadoutMfdProps = {
  accent: string;
  connState: ConnState;
  connError: string | null;
  connect: (address: string) => void;
  disconnect: () => void;
  sendCommand: (actionId: string) => boolean;
  /** Retour à l'écran d'accueil (bouton haut-gauche de la vue MFD). */
  onBack: () => void;
};

// Un loadout = une UI MFD + son thème + ses métadonnées. Structure multi-loadouts
// extensible : il suffit d'ajouter une entrée dans LOADOUTS (cf. loadouts.ts).
export type Loadout = {
  id: string;
  name: string;
  description: string;
  /** false = placeholder grisé « Bientôt » (aucune UI derrière). */
  available: boolean;
  /** Thème par défaut du loadout si rien n'est encore mémorisé. */
  defaultThemeId: string;
  /** UI MFD associée ; undefined pour un placeholder non disponible. */
  Mfd?: ComponentType<LoadoutMfdProps>;
};
