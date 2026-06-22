import type { LoadStep } from "./desktopTypes";

// Écran de chargement (DA V2, full Tailwind) : logo double-orbite + liste d'étapes
// avec statut done / en cours / à venir / erreur. Les statuts viennent de vraies
// vérifications (serveur, détection SC) — pas d'état inventé.
export function LoadingScreen({ steps }: { steps: LoadStep[] }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div
          className="absolute h-28 w-28 rounded-full border-[3px] border-transparent animate-[spin_1.4s_linear_infinite]"
          style={{ borderTopColor: "var(--accent)", borderRightColor: "var(--gold-glow)" }}
        />
        <div
          className="absolute h-20 w-20 rounded-full border-[3px] border-transparent animate-[spin_1s_linear_infinite_reverse]"
          style={{ borderBottomColor: "#3aa0d8", borderLeftColor: "#2b9fe0" }}
        />
        <img src="/logo.png" alt="SC MFD" className="h-12 w-12 object-contain" />
      </div>

      <div className="text-lg font-bold tracking-wide text-white">
        SC <span className="text-[var(--accent)]">MFD BRIDGE</span>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        {steps.map((s) => (
          <div
            key={s.label}
            className={[
              "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors",
              s.status === "done"
                ? "border-emerald-500/20 bg-emerald-500/5 text-white/80"
                : s.status === "current"
                ? "border-[var(--accent)]/40 bg-[var(--accent-muted)] text-white"
                : s.status === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-white/10 bg-white/[0.02] text-white/40",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]",
                s.status === "done"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : s.status === "error"
                  ? "bg-red-500/20 text-red-300"
                  : s.status === "current"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white/10 text-white/40",
              ].join(" ")}
            >
              {s.status === "done" ? "✓" : s.status === "error" ? "!" : ""}
            </span>
            <span className="flex-1">{s.label}</span>
            {s.status === "current" && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
