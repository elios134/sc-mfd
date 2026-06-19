// Bouton on/off — feedback purement local.

export interface ToggleProps {
  label: string;
  hint?: string;
  on: boolean;
  onClick: () => void;
}

export function Toggle({ label, hint, on, onClick }: ToggleProps) {
  return (
    <button type="button" className={`btn${on ? " on" : ""}`} onClick={onClick}>
      <div>
        <div className="lbl">{label}</div>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      <div className="state">{on ? "On" : "Off"}</div>
    </button>
  );
}
