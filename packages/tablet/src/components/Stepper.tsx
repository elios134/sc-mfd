// Stepper +/- (paire increase/decrease) — anime 5 pips, état local.

const PIP_COUNT = 5;

export interface StepperProps {
  label: string;
  /** Niveau affiché (0..5). */
  level: number;
  onDec: () => void;
  onInc: () => void;
}

export function Stepper({ label, level, onDec, onInc }: StepperProps) {
  return (
    <div className="stepper">
      <div className="row">
        <div className="name">{label}</div>
        <div className="ctl">
          <button type="button" className="step-btn" onClick={onDec} aria-label={`${label} −`}>
            −
          </button>
          <button type="button" className="step-btn" onClick={onInc} aria-label={`${label} +`}>
            +
          </button>
        </div>
      </div>
      <div className="pips">
        {Array.from({ length: PIP_COUNT }).map((_, i) => (
          <div key={i} className={`pip${i < level ? " fill" : ""}`} />
        ))}
      </div>
    </div>
  );
}
