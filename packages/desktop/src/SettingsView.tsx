import { QRCodeSVG } from "qrcode.react";
import { MANUFACTURER_THEMES } from "@sc-mfd/shared";
import type { Language } from "./desktopSettings";
import type { LogEntry, ScInstall, ServerInfo } from "./desktopTypes";
import type { DeployResult } from "./controlProfile";

// Sélecteur de thème constructeur (zone A desktop).
function ThemeSelector({ value, onSelect }: { value: string; onSelect: (id: string) => void }) {
  return (
    <div className="themes">
      {MANUFACTURER_THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`th${value === t.id ? " on" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <span className="c" style={{ background: t.accent }} />
          <span className="n">{t.name}</span>
          <span className="sub">{t.subtitle}</span>
        </button>
      ))}
    </div>
  );
}

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

type Props = {
  server: ServerInfo | null;
  serverError: string | null;
  themeId: string;
  onSelectTheme: (id: string) => void;
  scInstall: ScInstall | null;
  scResolved: boolean;
  logs: LogEntry[];
  port: number;
  onPort: (v: number) => void;
  startWithWindows: boolean;
  onStartWithWindows: (v: boolean) => void;
  minimizeToTray: boolean;
  onMinimizeToTray: (v: boolean) => void;
  language: Language;
  onLanguage: (v: Language) => void;
  onPickScFolder: () => void;
  profileDeploy: DeployResult | null;
  showProfileNotice: boolean;
  onDismissProfileNotice: () => void;
};

export function SettingsView({
  server,
  serverError,
  themeId,
  onSelectTheme,
  scInstall,
  scResolved,
  logs,
  port,
  onPort,
  startWithWindows,
  onStartWithWindows,
  minimizeToTray,
  onMinimizeToTray,
  language,
  onLanguage,
  onPickScFolder,
  profileDeploy,
  showProfileNotice,
  onDismissProfileNotice,
}: Props) {
  const portMismatch = server != null && server.port !== port;
  const deployTime = profileDeploy
    ? new Date(profileDeploy.at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <>
      <div className="p-head">
        <h2>Paramètres</h2>
        <div className="sub">Configuration du pont</div>
      </div>

      <div className="p-body">
        {/* ── Serveur ── */}
        <div className="card">
          <div className="t">Serveur</div>
          <div className="row">
            <div className="info">
              <b>Port d'écoute</b>
              <small>
                {portMismatch
                  ? "Appliqué au redémarrage (rebind à venir)"
                  : "Réseau local"}
              </small>
            </div>
            <div className="field">
              <input
                type="number"
                min={1}
                max={65535}
                value={port}
                onChange={(e) => onPort(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="row">
            <div className="info">
              <b>Adresse locale</b>
              <small>Vue par la tablette</small>
            </div>
            <div className="val">
              {serverError ? "—" : server ? `${server.ip}:${server.port}` : "…"}
            </div>
          </div>
          <div className="row">
            <div className="info">
              <b>Démarrer avec Windows</b>
              <small>TODO natif (plugin autostart)</small>
            </div>
            <Switch on={startWithWindows} onChange={onStartWithWindows} />
          </div>
          <div className="row">
            <div className="info">
              <b>Réduire dans la barre des tâches</b>
              <small>TODO natif (system tray)</small>
            </div>
            <Switch on={minimizeToTray} onChange={onMinimizeToTray} />
          </div>
        </div>

        {/* ── Connexion tablette ── */}
        <div className="card">
          <div className="t">Connexion tablette</div>
          {server ? (
            <div className="qr-mini">
              <div className="qr">
                <QRCodeSVG value={server.ws_url} size={88} level="M" bgColor="#ffffff" fgColor="#0a0c0f" />
              </div>
              <div className="qr-txt">
                <b>{server.ws_url}</b>
                <small>
                  La tablette se connecte via cette adresse. QR / adresse en secours.
                </small>
              </div>
            </div>
          ) : (
            <div className="qr-txt">
              <small>{serverError ? `Erreur : ${serverError}` : "Détection de l'adresse LAN…"}</small>
            </div>
          )}
        </div>

        {/* ── Thèmes constructeurs (zone A) ── */}
        <div className="card full">
          <div className="t">Thèmes constructeurs</div>
          <ThemeSelector value={themeId} onSelect={onSelectTheme} />
        </div>

        {/* ── Star Citizen ── */}
        <div className="card">
          <div className="t">Star Citizen</div>
          <div className="row" style={{ border: "none", paddingTop: 0 }}>
            <div className="info">
              <b>Dossier du jeu</b>
              <small>Détection auto (registre + emplacements connus)</small>
            </div>
          </div>
          <div className="game-path">
            <div className="pth" title={scInstall?.path ?? undefined}>
              {!scResolved
                ? "Détection…"
                : scInstall?.detected && scInstall.path
                ? scInstall.path
                : "Non détecté"}
            </div>
            <button type="button" onClick={onPickScFolder}>
              Changer
            </button>
          </div>
          {scResolved &&
            (scInstall?.detected ? (
              <div className="detect-ok">
                <span>●</span> Détecté automatiquement
                {scInstall.channel ? ` · ${scInstall.channel}` : ""}
              </div>
            ) : (
              <div className="detect-ko">
                <span>●</span> Aucune installation détectée
              </div>
            ))}
        </div>

        {/* ── Général ── */}
        <div className="card">
          <div className="t">Général</div>
          <div className="row">
            <div className="info">
              <b>Langue</b>
              <small>TODO i18n (traductions à venir)</small>
            </div>
            <div className="seg">
              <button
                type="button"
                className={language === "fr" ? "on" : ""}
                onClick={() => onLanguage("fr")}
              >
                FR
              </button>
              <button
                type="button"
                className={language === "en" ? "on" : ""}
                onClick={() => onLanguage("en")}
              >
                EN
              </button>
            </div>
          </div>
          <div className="row">
            <div className="info">
              <b>Profil de touches</b>
              <small>Profil « SC MFD » déposé dans le jeu (régénéré à chaque lancement)</small>
            </div>
            {profileDeploy == null ? (
              <div className="val">Génération…</div>
            ) : profileDeploy.ok ? (
              <div className="detect-ok" style={{ margin: 0 }} title={profileDeploy.path ?? undefined}>
                <span>●</span> Installé (SC MFD){deployTime ? ` · ${deployTime}` : ""}
              </div>
            ) : (
              <div className="detect-ko" style={{ margin: 0 }} title={profileDeploy.error ?? undefined}>
                <span>●</span> Erreur de dépôt
              </div>
            )}
          </div>

          {showProfileNotice && (
            <div
              className="card"
              style={{
                margin: "10px 0 0",
                background: "rgba(155,199,255,0.08)",
                border: "1px solid rgba(155,199,255,0.25)",
              }}
            >
              <div className="row" style={{ border: "none", paddingTop: 0, alignItems: "flex-start" }}>
                <div className="info">
                  <b>⚠ Étape à faire une fois dans Star Citizen</b>
                  <small style={{ lineHeight: 1.5 }}>
                    Pour activer les actions MFD : <b>Options → Keybindings → Advanced Controls
                    Customization → Control Profiles → choisir « SC MFD »</b>.
                    <br />
                    Le profil doit être présent <b>avant</b> de lancer SC pour apparaître dans la liste —
                    s'il manque, relancez SC une fois (l'app le redépose à chaque démarrage).
                  </small>
                </div>
                <button type="button" onClick={onDismissProfileNotice} title="Masquer">
                  Compris
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Activité (journal réduit) ── */}
        <div className="card full">
          <div className="t">Activité</div>
          <div className="activity">
            {logs.length > 0 ? (
              logs.slice(0, 6).map((l) => (
                <div className="act-line" key={l.key}>
                  <span className="t-time">{l.time}</span>
                  <span className="t-label">{l.label}</span>
                  <span className={`t-detail ${l.kind}`}>{l.detail}</span>
                </div>
              ))
            ) : (
              <div className="act-empty">En attente d'une commande de la tablette…</div>
            )}
          </div>
        </div>

        <div className="about">
          SC <b>MFD Bridge</b> · Desktop
        </div>
      </div>
    </>
  );
}
