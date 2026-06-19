import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

// Vrais boutons fenêtre (fenêtre Tauri decorations:false). Approche reprise de
// SC Fleet Manager V2 (TitleBar.tsx) : getCurrentWindow() puis appels API Tauri 2
// — minimize() / toggleMaximize() / close(). V2 n'avait que minimize+close ;
// on ajoute agrandir/restaurer via toggleMaximize() + isMaximized() pour l'icône.
export function WindowControls() {
  const win = getCurrentWindow();
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const sync = () => {
      win.isMaximized().then(setMaximized).catch(() => {});
    };
    sync();
    // Garde l'icône agrandir/restaurer cohérente quand l'état change.
    win
      .onResized(sync)
      .then((u) => {
        unlisten = u;
      })
      .catch(() => {});
    return () => unlisten?.();
  }, [win]);

  return (
    <div className="win-ctrl">
      <button
        type="button"
        className="win-btn"
        title="Réduire"
        aria-label="Réduire"
        onClick={() => void win.minimize()}
      >
        ─
      </button>
      <button
        type="button"
        className="win-btn"
        title={maximized ? "Restaurer" : "Agrandir"}
        aria-label={maximized ? "Restaurer" : "Agrandir"}
        onClick={() => void win.toggleMaximize()}
      >
        {maximized ? "❐" : "▢"}
      </button>
      <button
        type="button"
        className="win-btn close"
        title="Fermer"
        aria-label="Fermer"
        onClick={() => void win.close()}
      >
        ✕
      </button>
    </div>
  );
}
