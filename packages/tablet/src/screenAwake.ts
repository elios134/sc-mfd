// « Garder l'écran allumé » (packaging mobile) via @capacitor-community/keep-awake
// (compatible Capacitor 8). Empêche la mise en veille tant que c'est activé.
//
// Web (dev) : isSupported=false → no-op. Tout échec est avalé (log) : ne casse rien.
// L'effet réel ne se voit que sur l'APK installé.

import { KeepAwake } from "@capacitor-community/keep-awake";

/** Applique l'état du toggle : activé → garde l'écran allumé, désactivé → veille normale. */
export async function applyKeepAwake(enabled: boolean): Promise<void> {
  try {
    const { isSupported } = await KeepAwake.isSupported();
    if (!isSupported) return; // web / plateforme non supportée
    if (enabled) await KeepAwake.keepAwake();
    else await KeepAwake.allowSleep();
  } catch (e) {
    console.warn("[keepAwake] indisponible:", e);
  }
}
