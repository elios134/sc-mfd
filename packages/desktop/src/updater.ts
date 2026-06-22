import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

// Mise à jour automatique du pont au lancement (best-effort, silencieux).
// Interroge l'endpoint configuré (Release GitHub → latest.json). Si une version
// plus récente, SIGNÉE, est disponible : téléchargement + installation, puis
// redémarrage. Toute erreur (hors-ligne, pas de release, clé absente) est ignorée
// pour ne jamais bloquer le démarrage.
export async function checkForUpdate(): Promise<void> {
  try {
    const update = await check();
    if (!update) return;
    console.log(`[updater] mise à jour ${update.version} disponible — installation…`);
    await update.downloadAndInstall();
    await relaunch();
  } catch (e) {
    console.warn("[updater] indisponible:", e);
  }
}
