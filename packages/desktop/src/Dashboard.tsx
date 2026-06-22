import type { ScInstall, ServerInfo } from "./desktopTypes";

// Tableau de bord : logo de l'app au centre (DA V2 — glass sombre, accent thémable),
// avec quelques pastilles d'état réelles (serveur, tablettes, Star Citizen).
// Aucun état inventé : tout vient des vraies sondes (server.rs, détection SC, WS).
function StatusPill({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{
          background: ok ? "var(--green, #2ee9a5)" : "rgba(255,255,255,0.35)",
          boxShadow: ok ? "0 0 8px var(--green, #2ee9a5)" : "none",
        }}
      />
      <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
      <span className="text-sm font-medium text-white/90">{value}</span>
    </div>
  );
}

export function Dashboard({
  server,
  serverError,
  devicesCount,
  scInstall,
}: {
  server: ServerInfo | null;
  serverError: string | null;
  devicesCount: number;
  scInstall: ScInstall | null;
}) {
  const online = server !== null && !serverError;
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 py-16 text-center">
      <img
        src="/logo.png"
        alt="SC MFD"
        className="h-44 w-44 object-contain"
        style={{ filter: "drop-shadow(0 12px 44px var(--gold-glow))" }}
      />
      <h1 className="mt-7 text-3xl font-bold tracking-wide text-white">
        SC FLEET <span className="text-[var(--accent)]">MFD BRIDGE</span>
      </h1>
      <p className="mt-2 text-sm text-white/50">Pont tablette ↔ jeu</p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <StatusPill
          label="Serveur"
          value={online ? `${server!.ip}:${server!.port}` : serverError ? "Erreur" : "…"}
          ok={online}
        />
        <StatusPill label="Tablettes" value={String(devicesCount)} ok={devicesCount > 0} />
        <StatusPill
          label="Star Citizen"
          value={scInstall?.detected ? scInstall.channel ?? "Détecté" : "Non détecté"}
          ok={!!scInstall?.detected}
        />
      </div>
    </div>
  );
}
