// Scan QR de connexion (packaging mobile). Encapsule @capacitor-mlkit/barcode-scanning
// (Google ML Kit, compatible Capacitor 8). On utilise la méthode `scan()` — l'UI de
// scan « prête à l'emploi » du code scanner Google : pas de customisation WebView,
// la plus fiable sur appareil. Le QR du desktop encode directement « ws://IP:port »
// (cf. server.rs → server.ws_url), donc rawValue est l'adresse à utiliser telle quelle.
//
// Web (dev) : le plugin renvoie isSupported=false → on tombe proprement sur "unsupported"
// et l'UI bascule sur la saisie manuelle. Le vrai test se fait sur la tablette.

import { BarcodeScanner, BarcodeFormat } from "@capacitor-mlkit/barcode-scanning";

export type QrScanResult =
  | { ok: true; value: string }
  | { ok: false; reason: "unsupported" | "denied" | "empty" | "error" };

/** Ouvre le scanner caméra, gère la permission, retourne la valeur brute du QR.
 *  Ne jette jamais : tout échec devient un `reason` exploitable par l'UI. */
export async function scanConnectionQr(): Promise<QrScanResult> {
  let granted = false; // hissé : utilisé aussi dans le catch pour qualifier l'échec.
  try {
    const { supported } = await BarcodeScanner.isSupported();
    if (!supported) return { ok: false, reason: "unsupported" };

    // Permission caméra à l'exécution : demande au 1er scan (bonne UX). On ne
    // bloque PAS dessus : le code scanner Google peut fonctionner sans (Play
    // Services). On retient juste l'état pour qualifier un éventuel échec.
    let perm = await BarcodeScanner.checkPermissions();
    if (perm.camera !== "granted" && perm.camera !== "limited") {
      perm = await BarcodeScanner.requestPermissions();
    }
    granted = perm.camera === "granted" || perm.camera === "limited";

    // Scanner Google (ML Kit), restreint aux QR codes.
    const { barcodes } = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode] });
    const value = barcodes[0]?.rawValue?.trim();
    if (!value) return { ok: false, reason: "empty" }; // annulé / rien lu
    return { ok: true, value };
  } catch (e) {
    // Échec réel du scan : si la caméra n'était pas accordée, c'est très
    // probablement le refus de permission ; sinon erreur générique.
    console.error("[qr] scan échoué:", e);
    return { ok: false, reason: granted ? "error" : "denied" };
  }
}

/** Garde-fou : la valeur scannée ressemble-t-elle à une adresse de connexion ?
 *  Accepte « ws(s)://host[:port] » ou « host[:port] » (IP/hostname). */
export function looksLikeAddress(raw: string): boolean {
  const s = raw.trim();
  return /^wss?:\/\/[\w.-]+(:\d+)?$/i.test(s) || /^[\w.-]+(:\d+)?$/.test(s);
}
