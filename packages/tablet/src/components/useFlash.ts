// Flash d'appui bref et NON persistant : à l'appui, le bouton pulse ~0,2 s puis
// revient au neutre. Sert de retour « touche envoyée » sur TOUS les boutons MFD
// (ex-toggles, +/− des steppers, boutons d'action) — aucun état mémorisé.

import { useCallback, useEffect, useRef, useState } from "react";

const FLASH_MS = 220;

/** Retourne [flashing, flash] : `flash()` allume `flashing` ~0,2 s puis l'éteint. */
export function useFlash(): [boolean, () => void] {
  const [flashing, setFlashing] = useState(false);
  const timer = useRef<number | null>(null);

  const flash = useCallback(() => {
    setFlashing(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlashing(false), FLASH_MS);
  }, []);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  return [flashing, flash];
}
