import type { LoadStep } from "./desktopTypes";

// Écran de chargement (repris de docs/maquette-desktop-params.html) :
// logo double-orbite + liste d'étapes avec statut done / en cours / à venir.
// Les statuts sont calculés par App à partir de vraies vérifications (serveur,
// détection SC) — pas d'état inventé.
export function LoadingScreen({ steps }: { steps: LoadStep[] }) {
  return (
    <div className="loading">
      <div className="logo-ring">
        <div className="orbit o1" />
        <div className="orbit o2" />
        <img className="logo-core" src="/logo.png" alt="SC MFD" />
      </div>
      <div className="ld-title">
        SC <b>MFD BRIDGE</b>
      </div>
      <div className="ld-steps">
        {steps.map((s) => (
          <div className={`ld-step ${s.status}`} key={s.label}>
            <span className="ic">{s.status === "done" ? "✓" : ""}</span>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
