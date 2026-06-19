// Vue DEBUG TEMPORAIRE (chantier C2) — affiche le mapping dynamique lu
// (action → touche réelle du joueur) pour contrôle visuel. À retirer en C3
// une fois la lecture validée. Styles inline pour ne pas toucher au CSS.

import type { ProfileReadResult, ResolvedBind } from "./profileReader";
import { formatKey } from "./profileReader";

const sourceColor: Record<ResolvedBind["source"], string> = {
  joueur: "#7CFC9B",
  défaut: "#9BC7FF",
  "à assigner": "#FFC56B",
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
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,10,14,0.92)",
        zIndex: 9999,
        overflow: "auto",
        padding: "16px 20px",
        font: "12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace",
        color: "#e6e9ef",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <strong style={{ fontSize: 14 }}>🔑 Mapping dynamique (debug C3a)</strong>
        <button
          type="button"
          onClick={onRefresh}
          style={{ marginLeft: "auto", cursor: "pointer" }}
          title="Relire les fichiers SC et retransmettre à l'émulation"
        >
          ↻ Recharger
        </button>
        <button type="button" onClick={onClose} style={{ cursor: "pointer" }}>
          ✕ Fermer
        </button>
      </div>

      {result == null ? (
        <div>Lecture en cours…</div>
      ) : (
        <>
          <div style={{ marginBottom: 8, opacity: 0.85 }}>
            <div>
              Joueur : {result.playerFound ? "✅" : "❌"} <code>{result.playerPath ?? "—"}</code>
            </div>
            <div>
              Défaut : {result.defaultFound ? "✅" : "❌"} <code>{result.defaultPath ?? "—"}</code>
            </div>
            <div style={{ marginTop: 4 }}>
              {(() => {
                const j = result.binds.filter((b) => b.source === "joueur").length;
                const d = result.binds.filter((b) => b.source === "défaut").length;
                const a = result.binds.filter((b) => b.source === "à assigner").length;
                return (
                  <span>
                    Total {result.binds.length} — <span style={{ color: sourceColor.joueur }}>{j} joueur</span>,{" "}
                    <span style={{ color: sourceColor.défaut }}>{d} défaut</span>,{" "}
                    <span style={{ color: sourceColor["à assigner"] }}>{a} à assigner</span>
                  </span>
                );
              })()}
            </div>
          </div>

          {result.warnings.length > 0 && (
            <ul style={{ color: "#FFC56B", margin: "6px 0" }}>
              {result.warnings.map((w, i) => (
                <li key={i}>⚠ {w}</li>
              ))}
            </ul>
          )}

          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: "4px 8px" }}>Action</th>
                <th style={{ padding: "4px 8px" }}>action name</th>
                <th style={{ padding: "4px 8px" }}>Touche réelle</th>
                <th style={{ padding: "4px 8px" }}>Activation</th>
                <th style={{ padding: "4px 8px" }}>Source</th>
                <th style={{ padding: "4px 8px" }}>raw</th>
                <th style={{ padding: "4px 8px" }}>Autres périph.</th>
                <th style={{ padding: "4px 8px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {result.binds.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #1c2026" }}>
                  <td style={{ padding: "3px 8px" }}>{b.labelFr}</td>
                  <td style={{ padding: "3px 8px", opacity: 0.7 }}>{b.id}</td>
                  <td style={{ padding: "3px 8px", fontWeight: 700 }}>{formatKey(b)}</td>
                  <td style={{ padding: "3px 8px" }}>
                    {b.activation === "long" ? "⏱ long" : b.activation}
                  </td>
                  <td style={{ padding: "3px 8px", color: sourceColor[b.source] }}>{b.source}</td>
                  <td style={{ padding: "3px 8px", opacity: 0.6 }}>{b.rawInput ?? "—"}</td>
                  <td style={{ padding: "3px 8px", opacity: 0.6 }}>
                    {b.otherDevices.length ? b.otherDevices.join(", ") : "—"}
                  </td>
                  <td style={{ padding: "3px 8px", color: "#FFC56B" }}>
                    {b.notes.length ? b.notes.join(" · ") : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
