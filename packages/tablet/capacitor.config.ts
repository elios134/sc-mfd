import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.scmfd.tablet",
  appName: "sc-mfd-tablet",
  // Sortie du build Vite (`npm run build`). `npx cap sync` copie ce dossier,
  // déjà bundlé (shared inliné), dans les projets natifs — pas de résolution
  // de workspace côté Capacitor.
  webDir: "dist",
  // La webview charge l'app en http://localhost (et non https) + autorise le
  // trafic non chiffré : sans ça, une page https bloquerait la WebSocket ws://
  // du desktop (mixed content), et Android bloque le cleartext depuis l'API 28.
  // Suffisant pour un usage LAN ; à durcir (network-security-config) plus tard.
  server: {
    androidScheme: "http",
    cleartext: true,
  },
};

export default config;
