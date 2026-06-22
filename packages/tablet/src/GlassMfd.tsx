// 2e UI — variante B « verre / doux ». Reproduction fidèle de la maquette
// SC MFD.dc.html (variante B) : bandeau de 3 cartes d'état en haut, Énergie en
// 3 colonnes (+ rond / label vertical / − rond / bouton-action à icône SVG),
// Boucliers circulaire (arcs NEUTRES — pas de faux niveau), Configuration en
// liste de lignes qui flashent « OK », bandeau titre bas avec ‹ ›.
//
// Couleurs via --accent + tokens dérivés (les 6 thèmes) — le cyan de la maquette
// n'est qu'un thème. Tout est déclencheur + flash ; aucun état ON/OFF persistant.

import { useCallback, useEffect, useRef, useState } from "react";
import type { MfdId } from "@sc-mfd/shared";
import {
  CONFIG_FILTERS,
  ENERGIE_SYSTEMS,
  MISSILES_GROUPS,
  PERSISTENT_BUTTONS,
  SHIELD_FACES,
  SHIELD_RESET_ACTION,
  findUnresolvedActionIds,
  labelFr,
} from "./mfdLayout";
import type { EnergieSystem, LayoutGroup } from "./mfdLayout";
import { useFlash } from "./components/useFlash";
import type { ConnState } from "./useConnection";
import { normalizeWsUrl } from "./useConnection";
import { scanConnectionQr, looksLikeAddress } from "./qrScan";
import { tapFeedback } from "./haptics";
import { useThemeZone } from "./useThemeZone";
import type { LoadoutMfdProps } from "./loadoutTypes";

const SCREENS: { id: MfdId; title: string }[] = [
  { id: "energie", title: "Gestion de l'énergie" },
  { id: "bouclier", title: "Boucliers" },
  { id: "config", title: "Configuration" },
  { id: "missiles", title: "Missiles" },
];

const CONN_LABEL: Record<ConnState, string> = {
  disconnected: "Déconnecté",
  connecting: "Connexion…",
  connected: "Connecté",
  error: "Erreur",
};

/** Icône SVG par système (reprises de la maquette). */
function SystemIcon({ kind }: { kind: EnergieSystem["key"] }) {
  if (kind === "armes")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M9 3h6v4l-1 2v9a2 2 0 0 1-4 0V9L9 7z" />
        <path d="M10 9h4" />
      </svg>
    );
  if (kind === "boucliers")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5-3.4 8.7-8 11-4.6-2.3-8-6-8-11V5z" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 2c3 4 4.2 6.8 4.2 10A4.2 4.2 0 0 1 12 16a4.2 4.2 0 0 1-4.2-4C7.8 8.8 9 6 12 2z" />
      <path d="M8 18l-1.5 4M16 18l1.5 4M12 18.5V22" />
    </svg>
  );
}

/** Colonne d'un système d'énergie : + (haut) / label vertical / − (bas) / action icône. */
function EnergieColumn({
  sys,
  onInc,
  onDec,
  onToggle,
}: {
  sys: EnergieSystem;
  onInc: () => void;
  onDec: () => void;
  onToggle: () => void;
}) {
  const [fUp, flashUp] = useFlash();
  const [fDn, flashDn] = useFlash();
  const [fAc, flashAc] = useFlash();
  return (
    <div className="gl-col">
      <button
        type="button"
        className={`gl-round plus${fUp ? " flash" : ""}`}
        onClick={() => {
          flashUp();
          onInc();
        }}
        aria-label={`${sys.label} +`}
      >
        +
      </button>
      <div className="gl-col-label">{sys.label}</div>
      <button
        type="button"
        className={`gl-round minus${fDn ? " flash" : ""}`}
        onClick={() => {
          flashDn();
          onDec();
        }}
        aria-label={`${sys.label} −`}
      >
        −
      </button>
      <button
        type="button"
        className={`gl-col-action${fAc ? " flash" : ""}`}
        onClick={() => {
          flashAc();
          onToggle();
        }}
        aria-label={`${sys.label} alimentation`}
      >
        <SystemIcon kind={sys.key} />
      </button>
    </div>
  );
}

/** Ligne de config / missiles qui flashe « OK ». */
function GlassRow({ label, onTap }: { label: string; onTap: () => void }) {
  const [flashing, flash] = useFlash();
  return (
    <button
      type="button"
      className={`gl-rowbtn${flashing ? " flash" : ""}`}
      onClick={() => {
        flash();
        onTap();
      }}
    >
      <span className="gl-rowbtn-lbl">{label}</span>
      <span className="gl-rowbtn-ok">{flashing ? "OK" : ""}</span>
    </button>
  );
}

/** Stepper inline (label + − / +) pour Missiles, en style verre. */
function GlassInlineStepper({
  label,
  onInc,
  onDec,
}: {
  label: string;
  onInc: () => void;
  onDec: () => void;
}) {
  const [fUp, flashUp] = useFlash();
  const [fDn, flashDn] = useFlash();
  return (
    <div className="gl-inline-step">
      <span className="gl-rowbtn-lbl">{label}</span>
      <button
        type="button"
        className={`gl-mini${fDn ? " flash" : ""}`}
        onClick={() => {
          flashDn();
          onDec();
        }}
        aria-label={`${label} −`}
      >
        −
      </button>
      <button
        type="button"
        className={`gl-mini${fUp ? " flash" : ""}`}
        onClick={() => {
          flashUp();
          onInc();
        }}
        aria-label={`${label} +`}
      >
        +
      </button>
    </div>
  );
}

export function GlassMfd({
  accent,
  connState,
  connError,
  connect,
  disconnect,
  sendCommand,
  vibrate,
  discovering,
  onBack,
}: LoadoutMfdProps) {
  const [screen, setScreen] = useState<MfdId>("energie");
  const [tab, setTab] = useState(CONFIG_FILTERS[0]?.id ?? "vol");
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimer = useRef<number | null>(null);
  const [address, setAddress] = useState("");
  const [scanning, setScanning] = useState(false);

  const zoneRef = useThemeZone<HTMLDivElement>(accent);

  useEffect(() => {
    const missing = findUnresolvedActionIds();
    if (missing.length) console.warn("[mfdLayout] actionId non résolus dans shared:", missing);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1400);
  }, []);

  const act = useCallback(
    (actionId: string, label: string) => {
      if (vibrate) void tapFeedback();
      const ok = sendCommand(actionId);
      notify(`${label} · ${ok ? "envoyé" : "non connecté"}`);
    },
    [sendCommand, vibrate, notify]
  );

  const onScan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const res = await scanConnectionQr();
      if (!res.ok) {
        notify(
          res.reason === "denied"
            ? "Caméra refusée — saisie manuelle"
            : res.reason === "unsupported"
            ? "Scan indisponible ici — saisie manuelle"
            : res.reason === "empty"
            ? "Scan annulé"
            : "Échec du scan — saisie manuelle"
        );
        return;
      }
      if (!looksLikeAddress(res.value)) {
        notify("QR non reconnu — saisie manuelle");
        return;
      }
      const url = normalizeWsUrl(res.value);
      setAddress(url);
      connect(url);
      notify("QR lu · connexion…");
    } finally {
      setScanning(false);
    }
  }, [scanning, notify, connect]);

  const cycle = useCallback((dir: 1 | -1) => {
    setScreen((cur) => {
      const i = SCREENS.findIndex((s) => s.id === cur);
      return SCREENS[(i + dir + SCREENS.length) % SCREENS.length].id;
    });
  }, []);

  // Rendu générique d'un groupe (config / missiles) en lignes verre + steppers inline.
  const renderGlassGroup = (group: LayoutGroup, key: string) => (
    <div className="gl-group" key={key}>
      <div className="gl-group-label">{group.label}</div>
      <div className="gl-list">
        {group.elements.map((el, i) => {
          if (el.kind === "stepper") {
            return (
              <GlassInlineStepper
                key={el.incActionId}
                label={el.label}
                onInc={() => act(el.incActionId, `${el.label} +`)}
                onDec={() => act(el.decActionId, `${el.label} −`)}
              />
            );
          }
          const label = el.label ?? labelFr(el.actionId);
          return <GlassRow key={`${el.actionId}-${i}`} label={label} onTap={() => act(el.actionId, label)} />;
        })}
      </div>
      {group.note ? <div className="gl-note">{group.note}</div> : null}
    </div>
  );

  const activeTab = CONFIG_FILTERS.find((f) => f.id === tab) ?? CONFIG_FILTERS[0];
  const title = SCREENS.find((s) => s.id === screen)?.title ?? "";

  return (
    <div className="glass-view" ref={zoneRef}>
      {/* Connexion (slim, verre) */}
      <div className="gl-connbar">
        <button type="button" className="gl-icon-btn" title="Accueil" onClick={onBack}>
          ‹
        </button>
        <input
          type="text"
          inputMode="url"
          placeholder="ws://192.168.x.x:8420"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && connState !== "connected") connect(address);
          }}
          disabled={connState === "connected"}
        />
        {connState === "connected" ? (
          <button type="button" className="gl-pill-btn" onClick={disconnect}>
            Déconnecter
          </button>
        ) : (
          <>
            <button type="button" className="gl-pill-btn" onClick={onScan} disabled={scanning}>
              {scanning ? "Scan…" : "📷"}
            </button>
            <button type="button" className="gl-pill-btn" onClick={() => connect(address)}>
              Connecter
            </button>
          </>
        )}
        <div className="gl-status">
          <span className={`gl-led ${discovering && connState === "disconnected" ? "connecting" : connState}`} />
          {discovering && connState === "disconnected"
            ? "Recherche…"
            : connState === "error"
            ? connError ?? CONN_LABEL.error
            : CONN_LABEL[connState]}
        </div>
      </div>

      <div className="gl-frame">
        {/* Bandeau de 3 cartes d'état = boutons persistants (tappables + flash) */}
        <div className="gl-cards">
          {PERSISTENT_BUTTONS.map((b) => (
            <PersistentCard key={b.actionId} label={b.label} onTap={() => act(b.actionId, b.label)} />
          ))}
        </div>

        <div className="gl-content">
          {/* ÉNERGIE — 3 colonnes */}
          {screen === "energie" && (
            <div className="gl-cols">
              {ENERGIE_SYSTEMS.map((sys) => (
                <EnergieColumn
                  key={sys.key}
                  sys={sys}
                  onInc={() => act(sys.incActionId, `${sys.label} +`)}
                  onDec={() => act(sys.decActionId, `${sys.label} −`)}
                  onToggle={() => act(sys.powerToggleId, `${sys.label} alim.`)}
                />
              ))}
            </div>
          )}

          {/* BOUCLIERS — schéma circulaire, arcs NEUTRES */}
          {screen === "bouclier" && (
            <div className="gl-shield-center">
              <div className="gl-shield">
                <svg viewBox="0 0 340 340" width="340" height="340" className="gl-shield-svg">
                  <circle cx="170" cy="170" r="115" fill="none" stroke="var(--amber-line)" strokeWidth="1" />
                  <path d="M96.1 81.9 A115 115 0 0 1 243.9 81.9" fill="none" strokeLinecap="round" stroke="var(--accent)" strokeWidth="9" strokeOpacity="0.5" />
                  <path d="M258.1 96.1 A115 115 0 0 1 258.1 243.9" fill="none" strokeLinecap="round" stroke="var(--accent)" strokeWidth="9" strokeOpacity="0.5" />
                  <path d="M243.9 258.1 A115 115 0 0 1 96.1 258.1" fill="none" strokeLinecap="round" stroke="var(--accent)" strokeWidth="9" strokeOpacity="0.5" />
                  <path d="M81.9 243.9 A115 115 0 0 1 81.9 96.1" fill="none" strokeLinecap="round" stroke="var(--accent)" strokeWidth="9" strokeOpacity="0.5" />
                </svg>
                <svg width="74" height="104" viewBox="0 0 74 104" className="gl-ship" fill="var(--gold-glow)" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round">
                  <path d="M37 4 L53 40 L48 76 L60 98 L37 87 L14 98 L26 76 L21 40 Z" />
                </svg>
                <div className="gl-shield-cap gl-cap-av">AVANT</div>
                <div className="gl-shield-cap gl-cap-ar">ARRIÈRE</div>
                {SHIELD_FACES.map((f) => (
                  <ShieldPlus key={f.actionId} dir={f.dir} onClick={() => act(f.actionId, `Bouclier ${f.label}`)} />
                ))}
              </div>
              <GlassRow label="Réinitialiser les boucliers" onTap={() => act(SHIELD_RESET_ACTION, "Réinitialiser boucliers")} />
            </div>
          )}

          {/* CONFIGURATION — onglets pilule + liste de lignes OK */}
          {screen === "config" && (
            <>
              <div className="gl-tabs">
                {CONFIG_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`gl-tab${tab === f.id ? " on" : ""}`}
                    onClick={() => setTab(f.id)}
                  >
                    {f.label.toUpperCase()}
                  </button>
                ))}
              </div>
              {activeTab?.groups.map((g, i) => renderGlassGroup(g, `cfg-${activeTab.id}-${i}`))}
            </>
          )}

          {/* MISSILES — style verre cohérent */}
          {screen === "missiles" && MISSILES_GROUPS.map((g, i) => renderGlassGroup(g, `mis-${i}`))}
        </div>

        <div className={`gl-toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

        {/* Bandeau titre bas + nav ‹ › */}
        <div className="gl-titlebar">
          <button type="button" className="gl-nav-round" onClick={() => cycle(-1)} aria-label="Écran précédent">
            ‹
          </button>
          <div className="gl-title">{title}</div>
          <button type="button" className="gl-nav-round" onClick={() => cycle(1)} aria-label="Écran suivant">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

/** Carte d'état persistante (Master Mode / Atterrissage / Amarrage) — tappable + flash. */
function PersistentCard({ label, onTap }: { label: string; onTap: () => void }) {
  const [flashing, flash] = useFlash();
  return (
    <button
      type="button"
      className={`gl-card${flashing ? " flash" : ""}`}
      onClick={() => {
        flash();
        onTap();
      }}
    >
      {label}
    </button>
  );
}

/** Bouton « + » d'une face de bouclier, positionné autour du cercle. */
function ShieldPlus({
  dir,
  onClick,
}: {
  dir: "avant" | "arriere" | "babord" | "tribord";
  onClick: () => void;
}) {
  const [flashing, flash] = useFlash();
  return (
    <button
      type="button"
      className={`gl-shield-plus pos-${dir}${flashing ? " flash" : ""}`}
      onClick={() => {
        flash();
        onClick();
      }}
      aria-label={`Bouclier ${dir} +`}
    >
      +
    </button>
  );
}
