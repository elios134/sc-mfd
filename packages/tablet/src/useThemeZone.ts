import { useCallback } from "react";
import { themeCssVars } from "@sc-mfd/shared";

/**
 * Applique les variables CSS d'un thème (couleur d'accent) sur le CONTENEUR
 * référencé — et JAMAIS sur :root. Chaque « zone de thème » est ainsi isolée.
 *
 * Côté tablette on l'utilise DEUX fois en parallèle : sur le conteneur système
 * (zone B = .tablet, toujours monté) et sur le conteneur MFD (zone C = .stage,
 * monté seulement hors écran Paramètres). Le .stage étant imbriqué dans .tablet,
 * ses variables surchargent localement celles de la zone B pour son sous-arbre.
 *
 * Implémenté en CALLBACK REF (et non useRef + useLayoutEffect) pour réappliquer
 * dans les DEUX situations :
 *   - quand l'accent change (l'identité du callback change via useCallback) ;
 *   - quand l'élément se (re)monte (React rappelle le callback avec le nœud).
 * Indispensable pour la zone C : .stage est démonté pendant les Paramètres puis
 * remonté à la fermeture — un useLayoutEffect([accent]) ne se rejouait pas au
 * remontage (accent inchangé) et ratait l'application → il fallait rafraîchir.
 */
export function useThemeZone<T extends HTMLElement = HTMLDivElement>(accent: string) {
  return useCallback(
    (el: T | null) => {
      if (!el) return;
      const vars = themeCssVars(accent);
      for (const [name, value] of Object.entries(vars)) {
        el.style.setProperty(name, value);
      }
    },
    [accent]
  );
}
