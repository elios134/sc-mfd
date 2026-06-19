import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.scmfd.tablet",
  appName: "sc-mfd-tablet",
  // Sortie du build Vite (`npm run build`). `npx cap sync` copie ce dossier,
  // déjà bundlé (shared inliné), dans les projets natifs — pas de résolution
  // de workspace côté Capacitor.
  webDir: "dist",
};

export default config;
