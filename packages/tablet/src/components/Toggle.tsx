// Bouton de commande MFD — IMPULSION pure (envoie une touche), AUCUN état persistant.
// L'app ne lit pas l'état du jeu : un voyant ON/OFF serait trompeur. Le seul retour
// est un FLASH bref à l'appui (« touche envoyée »). Le nom « Toggle » est conservé
// pour la compat des appels, mais ce n'est plus un interrupteur à état.

import { useFlash } from "./useFlash";

export interface ToggleProps {
  label: string;
  hint?: string;
  onClick: () => void;
}

export function Toggle({ label, hint, onClick }: ToggleProps) {
  const [flashing, flash] = useFlash();
  return (
    <button
      type="button"
      className={`btn${flashing ? " flash" : ""}`}
      onClick={() => {
        flash();
        onClick();
      }}
    >
      <div>
        <div className="lbl">{label}</div>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
    </button>
  );
}
