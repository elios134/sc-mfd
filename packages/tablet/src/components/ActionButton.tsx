// Bouton d'action simple (impulsion) — feedback visuel via :active + toast.

export interface ActionButtonProps {
  label: string;
  hint?: string;
  cta?: string;
  variant?: "default" | "big";
  onClick: () => void;
}

export function ActionButton({ label, hint, cta, variant = "default", onClick }: ActionButtonProps) {
  if (variant === "big") {
    return (
      <button type="button" className="big-action" onClick={onClick}>
        {label}
      </button>
    );
  }

  return (
    <button type="button" className="btn" onClick={onClick}>
      <div>
        <div className="lbl">{label}</div>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      <div className="state">{cta ?? "Envoyer"}</div>
    </button>
  );
}
