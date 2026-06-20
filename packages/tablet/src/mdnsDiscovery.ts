// Auto-découverte mDNS du pont (bonus). Encapsule capacitor-zeroconf (jmDNS sur
// Android, multicast lock géré par le plugin). Le desktop publie le service
// `_scmfd._tcp.local.` (cf. src-tauri/src/mdns.rs) ; on l'écoute et on remonte
// l'adresse « ws://ip:port » au caller, qui connecte automatiquement.
//
// BEST-EFFORT / NE PLANTE JAMAIS :
//  - en web (dev) le plugin rejette « not available » → on log et on renvoie un
//    arrêt no-op : l'app retombe sur QR / saisie manuelle.
//  - sur un réseau qui bloque le multicast, on ne trouve simplement rien (normal).

import { ZeroConf } from "capacitor-zeroconf";

const WATCH_REQUEST = { type: "_scmfd._tcp.", domain: "local." };

/** Démarre la découverte. Appelle `onFound(wsUrl)` au 1er service résolu.
 *  Retourne une fonction d'arrêt (à appeler une fois connecté / au démontage).
 *  Ne jette jamais : en cas d'indisponibilité, l'arrêt renvoyé est un no-op. */
export async function startBridgeDiscovery(
  onFound: (wsUrl: string) => void
): Promise<() => void> {
  try {
    await ZeroConf.watch(WATCH_REQUEST, (result) => {
      // On ne connecte que sur une résolution complète (IP disponible).
      if (result.action !== "resolved") return;
      const ip = result.service.ipv4Addresses?.[0];
      const port = result.service.port;
      if (ip && port) onFound(`ws://${ip}:${port}`);
    });
    return () => {
      ZeroConf.unwatch(WATCH_REQUEST).catch(() => {
        /* déjà arrêté / indispo : sans importance */
      });
    };
  } catch (e) {
    // Web/dev ou plugin indisponible → pas d'auto-découverte, repli QR/manuel.
    console.info("[mdns] découverte indisponible (normal en web):", e);
    return () => {};
  }
}
