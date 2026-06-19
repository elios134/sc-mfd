import { useCallback } from "react";
import { themeCssVars } from "@sc-mfd/shared";

/**
 * Applique les variables CSS d'un thème (couleur d'accent) sur le CONTENEUR
 * référencé — et JAMAIS sur :root. Chaque « zone de thème » est ainsi isolée :
 * changer le thème d'une zone ne touche pas les autres, et plusieurs zones
 * peuvent afficher des thèmes différents simultanément (cascade CSS scopée).
 *
 * Implémenté en CALLBACK REF pour réappliquer aussi bien quand l'accent change
 * que quand l'élément se (re)monte (cas d'un conteneur rendu conditionnellement).
 *
 * Usage :
 *   const ref = useThemeZone<HTMLDivElement>(accentHex);
 *   return <div ref={ref} className="app">…</div>;
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
