import { useState } from "react";
import { getThemeById } from "@sc-mfd/shared";
import type { Loadout } from "./loadoutTypes";
import { ThemeSelector } from "./ThemeSelector";

type HomeScreenProps = {
  loadouts: Loadout[];
  selectedId: string;
  onSelectLoadout: (id: string) => void;
  /** Thème (id) du loadout sélectionné — piloté par le popup Thème. */
  loadoutThemeId: string;
  onChangeTheme: (themeId: string) => void;
  canEnter: boolean;
  onEnter: () => void;
  onOpenSettings: () => void;
};

/**
 * Écran d'accueil = point d'entrée après le lancement.
 * Choix du loadout + thème (lié au loadout) puis « Entrer » vers les MFD.
 * Rendu dans le conteneur .tablet → thème système (zone B).
 */
export function HomeScreen({
  loadouts,
  selectedId,
  onSelectLoadout,
  loadoutThemeId,
  onChangeTheme,
  canEnter,
  onEnter,
  onOpenSettings,
}: HomeScreenProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const selected = loadouts.find((l) => l.id === selectedId);
  const theme = getThemeById(loadoutThemeId);

  return (
    <div className="home">
      <div className="home-bar">
        <button type="button" className="gear" title="Paramètres" onClick={onOpenSettings}>
          ⚙
        </button>
      </div>

      <div className="logo-top">
        <div className="logo-mark">▦</div>
        <div className="logo-name">
          SC <b>MFD</b>
        </div>
      </div>

      <div className="pick-label">Choisir un loadout</div>

      <div className="loadout-list">
        {loadouts.map((lo) => {
          const isOn = lo.id === selectedId;
          return (
            <button
              key={lo.id}
              type="button"
              className={`lo-item${isOn ? " on" : ""}${lo.available ? "" : " disabled"}`}
              disabled={!lo.available}
              onClick={() => lo.available && onSelectLoadout(lo.id)}
            >
              <div className="li-info">
                <div className="li-name">{lo.name}</div>
                <div className="li-tag">{lo.description}</div>
              </div>
              {lo.available ? (
                isOn ? <div className="badge">● Actif</div> : null
              ) : (
                <div className="li-soon">Bientôt</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="home-actions">
        <button type="button" className="btn-theme" onClick={() => setThemeOpen(true)}>
          <span className="th-dot" style={{ background: theme.accent }} />
          Thème · {theme.name}
        </button>
        <button type="button" className="btn-enter" disabled={!canEnter} onClick={onEnter}>
          Entrer
        </button>
      </div>

      {themeOpen && (
        <div className="theme-popup-overlay" onClick={() => setThemeOpen(false)}>
          <div className="theme-popup" onClick={(e) => e.stopPropagation()}>
            <div className="tp-head">
              Thème des MFD · <b>{selected?.name ?? ""}</b>
            </div>
            <div className="tp-sub">S'applique à l'UI MFD de ce loadout</div>
            <ThemeSelector value={loadoutThemeId} onSelect={onChangeTheme} />
            <button type="button" className="tp-close" onClick={() => setThemeOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
