import { QRCodeSVG } from "qrcode.react";
import { MANUFACTURER_THEMES } from "@sc-mfd/shared";
import type { LogEntry, ScInstall, ServerInfo } from "./desktopTypes";
import type { DeployResult } from "./controlProfile";
import type { ProfileReadResult } from "./profileReader";

// Paramètres — UI/UX reprise de SC Fleet Manager V2 (SettingsPage.tsx) : page
// scrollable, en-tête titré, sections en encarts glass (rounded-2xl, border-white/10,
// bg-white/[0.025], backdrop-blur), grille 2 colonnes responsive, switches/segments
// à l'accent thémable. Contenu fonctionnel inchangé (serveur, connexion, thèmes,
// Star Citizen, général, activité).

function Section({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm",
        className ?? "",
      ].join(" ")}
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-white/50">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// Ligne de réglage : libellé + description à gauche, contrôle à droite.
function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        {desc && <div className="mt-0.5 text-xs leading-relaxed text-white/45">{desc}</div>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-[var(--accent)]" : "bg-white/15",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
          on ? "left-[22px]" : "left-0.5",
        ].join(" ")}
      />
    </button>
  );
}

// Bannière de statut (ok = emerald, ko = red), style V2.
function StatusNote({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div
      className={[
        "mt-3 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm",
        ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300",
      ].join(" ")}
    >
      <span className="text-[10px]">●</span>
      <span>{children}</span>
    </div>
  );
}

function ThemeSelector({ value, onSelect }: { value: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {MANUFACTURER_THEMES.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={[
              "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
              active
                ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            ].join(" ")}
          >
            <span className="h-6 w-6 rounded-full" style={{ background: t.accent }} />
            <span className="text-xs font-semibold tracking-wide text-white">{t.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">{t.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}

type Props = {
  server: ServerInfo | null;
  serverError: string | null;
  themeId: string;
  onSelectTheme: (id: string) => void;
  scInstall: ScInstall | null;
  scResolved: boolean;
  scError: string | null;
  logs: LogEntry[];
  port: number;
  onPort: (v: number) => void;
  startWithWindows: boolean;
  onStartWithWindows: (v: boolean) => void;
  minimizeToTray: boolean;
  onMinimizeToTray: (v: boolean) => void;
  onPickScFolder: () => void;
  onResetScFolder: () => void;
  profileDeploy: DeployResult | null;
  showProfileNotice: boolean;
  onDismissProfileNotice: () => void;
  profileMap: ProfileReadResult | null;
  onOpenMapping: () => void;
};

export function SettingsView({
  server,
  serverError,
  themeId,
  onSelectTheme,
  scInstall,
  scResolved,
  scError,
  logs,
  port,
  onPort,
  startWithWindows,
  onStartWithWindows,
  minimizeToTray,
  onMinimizeToTray,
  onPickScFolder,
  onResetScFolder,
  profileDeploy,
  showProfileNotice,
  onDismissProfileNotice,
  profileMap,
  onOpenMapping,
}: Props) {
  const mapCount = profileMap?.binds.length ?? 0;
  const mapPlayer = profileMap?.binds.filter((b) => b.source === "joueur").length ?? 0;
  const mapDefault = profileMap?.binds.filter((b) => b.source === "défaut").length ?? 0;
  const portMismatch = server != null && server.port !== port;
  const deployTime = profileDeploy
    ? new Date(profileDeploy.at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const ghostBtn =
    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10";

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-white/50">Configuration du pont tablette ↔ jeu</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Serveur ── */}
        <Section title="Serveur" subtitle="Réseau local et démarrage">
          <Row
            label="Port d'écoute"
            desc={portMismatch ? "Appliqué au redémarrage (rebind à venir)" : "Réseau local"}
          >
            <input
              type="number"
              min={1}
              max={65535}
              value={port}
              onChange={(e) => onPort(Number(e.target.value))}
              className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right text-sm text-white focus:border-[var(--accent)] focus:outline-none"
            />
          </Row>
          <Row label="Adresse locale" desc="Vue par la tablette">
            <span className="font-mono text-sm text-[var(--accent)]">
              {serverError ? "—" : server ? `${server.ip}:${server.port}` : "…"}
            </span>
          </Row>
          <Row label="Démarrer avec Windows" desc="Lance l'app à l'ouverture de session">
            <Switch on={startWithWindows} onChange={onStartWithWindows} />
          </Row>
          <Row
            label="Réduire dans la barre des tâches"
            desc="Fermer (✕) place l'app dans le system tray au lieu de quitter"
          >
            <Switch on={minimizeToTray} onChange={onMinimizeToTray} />
          </Row>
        </Section>

        {/* ── Connexion tablette ── */}
        <Section title="Connexion tablette" subtitle="QR / adresse de jumelage">
          {server ? (
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white p-2.5 leading-none">
                <QRCodeSVG value={server.ws_url} size={92} level="M" bgColor="#ffffff" fgColor="#0a0a0f" />
              </div>
              <div className="min-w-0">
                <div className="break-all font-mono text-sm text-white">{server.ws_url}</div>
                <div className="mt-1 text-xs text-white/45">
                  La tablette se connecte via cette adresse. QR ou saisie en secours.
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/45">
              {serverError ? `Erreur : ${serverError}` : "Détection de l'adresse LAN…"}
            </p>
          )}
        </Section>

        {/* ── Star Citizen ── */}
        <Section title="Star Citizen" subtitle="Dossier d'installation du jeu">
          <div className="flex items-center gap-2">
            <div
              className="min-w-0 flex-1 truncate rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white/80"
              title={scInstall?.path ?? undefined}
            >
              {!scResolved
                ? "Détection…"
                : scInstall?.detected && scInstall.path
                ? scInstall.path
                : "Non détecté"}
            </div>
            <button type="button" onClick={onPickScFolder} className={ghostBtn}>
              Changer
            </button>
            {scInstall?.source === "manual" && (
              <button type="button" onClick={onResetScFolder} className={ghostBtn} title="Revenir à la détection automatique">
                Auto
              </button>
            )}
          </div>
          {scError && <StatusNote ok={false}>{scError}</StatusNote>}
          {scResolved &&
            !scError &&
            (scInstall?.detected ? (
              <StatusNote ok>
                {scInstall.source === "manual" ? "Dossier choisi manuellement" : "Détecté automatiquement"}
                {scInstall.channel ? ` · ${scInstall.channel}` : ""}
              </StatusNote>
            ) : (
              <StatusNote ok={false}>Aucune installation détectée</StatusNote>
            ))}
        </Section>

        {/* ── Profil de touches ── */}
        <Section title="Profil de touches" subtitle="Profil « SC MFD » injecté dans le jeu">
          <Row
            label="Profil de touches"
            desc="Profil « SC MFD » déposé dans le jeu (régénéré à chaque lancement)"
          >
            {profileDeploy == null ? (
              <span className="text-sm text-white/50">Génération…</span>
            ) : profileDeploy.ok ? (
              <span className="text-sm text-emerald-300" title={profileDeploy.path ?? undefined}>
                ● Installé{deployTime ? ` · ${deployTime}` : ""}
              </span>
            ) : (
              <span className="text-sm text-red-300" title={profileDeploy.error ?? undefined}>
                ● Erreur de dépôt
              </span>
            )}
          </Row>

          {showProfileNotice && (
            <div className="mt-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-muted)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">
                    ⚠ Étape à faire une fois dans Star Citizen
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-white/70">
                    Pour activer les actions MFD :{" "}
                    <b>Options → Keybindings → Advanced Controls Customization → Control Profiles → « SC MFD »</b>.
                    <br />
                    Le profil doit être présent <b>avant</b> de lancer SC pour apparaître dans la liste —
                    s'il manque, relancez SC une fois (l'app le redépose à chaque démarrage).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onDismissProfileNotice}
                  className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
                >
                  Compris
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* ── Mapping dynamique ── */}
        <Section
          title="Mapping dynamique"
          subtitle="Touches réelles lues dans votre profil Star Citizen et transmises à l'émulation"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-white/60">
              {profileMap == null ? (
                "Lecture du profil en cours…"
              ) : (
                <>
                  <span className="font-medium text-white/85">{mapCount}</span> actions ·{" "}
                  <span className="text-emerald-300">{mapPlayer} joueur</span> ·{" "}
                  <span className="text-sky-300">{mapDefault} défaut</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onOpenMapping}
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
            >
              Afficher le mapping
            </button>
          </div>
        </Section>

        {/* ── Thèmes constructeurs ── */}
        <Section className="lg:col-span-2" title="Thèmes" subtitle="Couleur d'accent de l'application">
          <ThemeSelector value={themeId} onSelect={onSelectTheme} />
        </Section>

        {/* ── Activité ── */}
        <Section className="lg:col-span-2" title="Activité" subtitle="Dernières commandes reçues de la tablette">
          {logs.length > 0 ? (
            <div className="flex flex-col">
              {logs.slice(0, 8).map((l) => (
                <div
                  key={l.key}
                  className="flex items-center gap-3 border-b border-white/5 py-2 text-sm last:border-0"
                >
                  <span className="font-mono text-xs text-white/35">{l.time}</span>
                  <span className="flex-1 truncate text-white/85">{l.label}</span>
                  <span
                    className={[
                      "truncate text-xs",
                      l.kind === "ok"
                        ? "text-emerald-300"
                        : l.kind === "error"
                        ? "text-red-300"
                        : "text-white/40",
                    ].join(" ")}
                  >
                    {l.detail}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/45">En attente d'une commande de la tablette…</p>
          )}
        </Section>
      </div>
    </div>
  );
}
