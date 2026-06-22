// Modale « Mapping dynamique » (DA V2, full Tailwind) : affiche le mapping lu
// (action → touche réelle du joueur) transmis à l'émulation. Ouverte depuis les
// Paramètres → section « Mapping dynamique ».

import type { ProfileReadResult, ResolvedBind } from "./profileReader";
import { formatKey } from "./profileReader";

const sourceClass: Record<ResolvedBind["source"], string> = {
  joueur: "text-emerald-300",
  défaut: "text-sky-300",
  "à assigner": "text-amber-300",
};

export function ProfileDebugPanel({
  result,
  onClose,
  onRefresh,
}: {
  result: ProfileReadResult | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const counts = result
    ? {
        joueur: result.binds.filter((b) => b.source === "joueur").length,
        défaut: result.binds.filter((b) => b.source === "défaut").length,
        àAssigner: result.binds.filter((b) => b.source === "à assigner").length,
      }
    : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "rgba(20,20,28,0.96)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">Mapping dynamique</h2>
            <p className="mt-0.5 text-xs text-white/50">
              Touches réelles lues dans votre profil Star Citizen et transmises à l'émulation
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            title="Relire les fichiers SC et retransmettre à l'émulation"
            className="ml-auto shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            ↻ Recharger
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Corps */}
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {result == null || counts == null ? (
            <div className="text-sm text-white/60">Lecture du profil en cours…</div>
          ) : (
            <>
              {/* Résumé */}
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  Joueur {result.playerFound ? "✅" : "❌"}{" "}
                  <code className="text-white/40">{result.playerPath ?? "—"}</code>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  Défaut {result.defaultFound ? "✅" : "❌"}{" "}
                  <code className="text-white/40">{result.defaultPath ?? "—"}</code>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  <span className="font-semibold text-white/90">{result.binds.length}</span> actions ·{" "}
                  <span className="text-emerald-300">{counts.joueur} joueur</span> ·{" "}
                  <span className="text-sky-300">{counts.défaut} défaut</span> ·{" "}
                  <span className="text-amber-300">{counts.àAssigner} à assigner</span>
                </span>
              </div>

              {result.warnings.length > 0 && (
                <ul className="mb-4 list-inside list-disc rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left text-white/50">
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Action</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">action name</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Touche réelle</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Activation</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Source</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">raw</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Autres périph.</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.binds.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 last:border-0">
                        <td className="px-3 py-1.5 text-white/85">{b.labelFr}</td>
                        <td className="px-3 py-1.5 font-mono text-white/50">{b.id}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-white">{formatKey(b)}</td>
                        <td className="px-3 py-1.5 text-white/70">
                          {b.activation === "long" ? "⏱ long" : b.activation}
                        </td>
                        <td className={`px-3 py-1.5 ${sourceClass[b.source]}`}>{b.source}</td>
                        <td className="px-3 py-1.5 font-mono text-white/45">{b.rawInput ?? "—"}</td>
                        <td className="px-3 py-1.5 text-white/45">
                          {b.otherDevices.length ? b.otherDevices.join(", ") : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-amber-300">
                          {b.notes.length ? b.notes.join(" · ") : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
