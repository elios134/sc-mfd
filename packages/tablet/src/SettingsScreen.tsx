import { getThemeById } from "@sc-mfd/shared";
import { ThemeSelector } from "./ThemeSelector";
import type { ConnState } from "./useConnection";

// Interrupteur (style maquette .sw) — réglage on/off.
function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`sw${on ? " on" : ""}`}
      onClick={() => onChange(!on)}
    />
  );
}

const CONN_TEXT: Record<ConnState, { label: string; sub: string }> = {
  disconnected: { label: "Déconnecté", sub: "Aucune liaison au desktop" },
  connecting: { label: "Connexion…", sub: "Tentative de liaison au desktop" },
  connected: { label: "Connecté", sub: "Liaison au desktop active" },
  error: { label: "Erreur", sub: "Connexion impossible" },
};

type Props = {
  onBack: () => void;
  systemThemeId: string;
  onSelectSystemTheme: (id: string) => void;
  connState: ConnState;
  autoReconnect: boolean;
  onToggleAutoReconnect: (v: boolean) => void;
  keepAwake: boolean;
  onToggleKeepAwake: (v: boolean) => void;
  vibrate: boolean;
  onToggleVibrate: (v: boolean) => void;
};

/** Écran Paramètres (zone B système), ouvert depuis l'engrenage de l'accueil. */
export function SettingsScreen({
  onBack,
  systemThemeId,
  onSelectSystemTheme,
  connState,
  autoReconnect,
  onToggleAutoReconnect,
  keepAwake,
  onToggleKeepAwake,
  vibrate,
  onToggleVibrate,
}: Props) {
  const conn = CONN_TEXT[connState];

  return (
    <div className="params">
      <div className="p-head">
        <button type="button" className="back" onClick={onBack}>
          ‹
        </button>
        <h1>Paramètres</h1>
      </div>
      <div className="p-body">
        {/* ── Connexion ── */}
        <div className="sect">
          <div className="t">Connexion au desktop</div>
          <div className="conn-card">
            <div className="line">
              <span className={`led ${connState}`} />
              <div>
                <b>{conn.label}</b>
                <small>{conn.sub}</small>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="info">
              <b>Reconnexion auto</b>
              <small>Se reconnecter si le lien tombe</small>
            </div>
            <Switch on={autoReconnect} onChange={onToggleAutoReconnect} />
          </div>
        </div>

        {/* ── Thèmes (système / zone B) — le thème MFD est sur l'accueil ── */}
        <div className="sect">
          <div className="t">Thèmes constructeurs</div>
          <div className="sect-sub">Interface système · accueil, paramètres, barres</div>
          <ThemeSelector value={systemThemeId} onSelect={onSelectSystemTheme} />
        </div>

        {/* ── Affichage & retour (effets natifs : visibles sur l'app installée) ── */}
        <div className="sect">
          <div className="t">Affichage</div>
          <div className="row">
            <div className="info">
              <b>Garder l'écran allumé</b>
              <small>Empêche la mise en veille pendant l'usage</small>
            </div>
            <Switch on={keepAwake} onChange={onToggleKeepAwake} />
          </div>
          <div className="row">
            <div className="info">
              <b>Vibration au tap</b>
              <small>Retour haptique sur les boutons d'action</small>
            </div>
            <Switch on={vibrate} onChange={onToggleVibrate} />
          </div>
        </div>

        <div className="sect">
          <div className="about">
            SC <b>MFD</b> · Tablette · système {getThemeById(systemThemeId).name}
          </div>
        </div>
      </div>
    </div>
  );
}
