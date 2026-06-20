// Retour haptique au tap (packaging mobile) via @capacitor/haptics (officiel,
// compatible Capacitor 8). Impact LÉGER, déclenché à l'appui sur un bouton d'action
// MFD quand le réglage « vibration au tap » est activé.
//
// Fire-and-forget : on n'attend pas la vibration pour traiter la commande.
// Web (dev) / appareil sans moteur de vibration → no-op silencieux (ne casse rien).

import { Haptics, ImpactStyle } from "@capacitor/haptics";

/** Vibration courte (impact léger). À n'appeler que si le toggle vibration est ON. */
export async function tapFeedback(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* web / pas de vibreur : on ignore */
  }
}
