// Stepper +/- (paire increase/decrease) — deux IMPULSIONS. Plus de jauge de pips :
// l'app ne lit pas le niveau réel du jeu, une jauge serait trompeuse. Chaque bouton
// envoie sa touche avec le même flash bref que les autres boutons MFD.

import { useFlash } from "./useFlash";

export interface StepperProps {
  label: string;
  onDec: () => void;
  onInc: () => void;
}

function StepButton({ onClick, ariaLabel, children }: {
  onClick: () => void;
  ariaLabel: string;
  children: string;
}) {
  const [flashing, flash] = useFlash();
  return (
    <button
      type="button"
      className={`step-btn${flashing ? " flash" : ""}`}
      onClick={() => {
        flash();
        onClick();
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function Stepper({ label, onDec, onInc }: StepperProps) {
  return (
    <div className="stepper">
      <div className="row">
        <div className="name">{label}</div>
        <div className="ctl">
          <StepButton onClick={onDec} ariaLabel={`${label} −`}>
            −
          </StepButton>
          <StepButton onClick={onInc} ariaLabel={`${label} +`}>
            +
          </StepButton>
        </div>
      </div>
    </div>
  );
}
