// Bouton d'action simple (impulsion) — feedback : flash bref à l'appui + toast.
// La pastille (cta « Envoyer / Demander / Caster ») est un APPEL À L'ACTION, pas un
// état du vaisseau → légitime, conservée.

import { useFlash } from "./useFlash";

export interface ActionButtonProps {
  label: string;
  hint?: string;
  cta?: string;
  variant?: "default" | "big";
  onClick: () => void;
}

export function ActionButton({ label, hint, cta, variant = "default", onClick }: ActionButtonProps) {
  const [flashing, flash] = useFlash();
  const handle = () => {
    flash();
    onClick();
  };

  if (variant === "big") {
    return (
      <button type="button" className={`big-action${flashing ? " flash" : ""}`} onClick={handle}>
        {label}
      </button>
    );
  }

  return (
    <button type="button" className={`btn${flashing ? " flash" : ""}`} onClick={handle}>
      <div>
        <div className="lbl">{label}</div>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      <div className="state">{cta ?? "Envoyer"}</div>
    </button>
  );
}
