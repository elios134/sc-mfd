import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConfigFilter, MfdId } from "@sc-mfd/shared";
import {
  CONFIG_FILTERS,
  DIAGNOSTIC_GROUPS,
  ENERGIE_GROUPS,
  MISSILES_GROUPS,
  PERSISTENT_BUTTONS,
  SHIELD_FACES,
  SHIELD_RESET_ACTION,
  findUnresolvedActionIds,
  labelEn,
  labelFr,
} from "./mfdLayout";
import type { LayoutGroup } from "./mfdLayout";
import { Toggle } from "./components/Toggle";
import { Stepper } from "./components/Stepper";
import { ActionButton } from "./components/ActionButton";
import type { ConnState } from "./useConnection";
import { normalizeWsUrl } from "./useConnection";
import { scanConnectionQr, looksLikeAddress } from "./qrScan";
import { tapFeedback } from "./haptics";
import { useThemeZone } from "./useThemeZone";
import type { LoadoutMfdProps } from "./loadoutTypes";

const NAV: { id: MfdId; ico: string; t: string }[] = [
  { id: "energie", ico: "⚡", t: "Énergie" },
  { id: "bouclier", ico: "🛡", t: "Bouclier" },
  { id: "config", ico: "⚙", t: "Config" },
  { id: "missiles", ico: "🚀", t: "Missiles" },
  { id: "diagnostic", ico: "🛠", t: "Diag" },
];

const CONN_LABEL: Record<ConnState, string> = {
  disconnected: "Déconnecté",
  connecting: "Connexion…",
  connected: "Connecté",
  error: "Erreur",
};

/**
 * UI MFD « SCFM » (style ambre/gold maison) — l'interface MFD historique,
 * extraite pour devenir le composant associé au loadout SCFM.
 * Applique le thème du loadout (zone C) sur son propre conteneur .stage.
 */
export function ScfmMfd({
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
  const [filter, setFilter] = useState<ConfigFilter>("vol");
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimer = useRef<number | null>(null);
  const [address, setAddress] = useState("");
  // Alternance interne (PAS d'affichage) pour les rares boutons à DEUX commandes
  // distinctes on/off (ex G-Safe) : sans état visible, on alterne juste quelle
  // touche envoyer. Aucune prétention de refléter l'état réel du vaisseau.
  const altRef = useRef<Record<string, boolean>>({});

  // Zone C : thème des MFD posé sur le conteneur .mfd-view (jamais :root) →
  // couvre TOUTE la vue MFD (bouton retour, connbar, boutons ET footer nav),
  // tout en restant isolé de la zone B (système).
  const zoneMfdRef = useThemeZone<HTMLDivElement>(accent);

  // Garde-fou : signale en console tout actionId du layout absent de shared.
  useEffect(() => {
    const missing = findUnresolvedActionIds();
    if (missing.length) {
      console.warn("[mfdLayout] actionId non résolus dans shared:", missing);
    }
  }, []);

  const notify = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 1400);
  }, []);

  // Envoie via WS si connecté ; sinon comportement local (le caller l'indique).
  // Retour haptique léger à chaque appui d'action MFD si le réglage est actif
  // (couvre boutons, toggles et steppers — tous passent par ici ; pas la nav/params).
  const send = useCallback(
    (actionId: string): boolean => {
      if (vibrate) void tapFeedback();
      const ok = sendCommand(actionId);
      console.log("command:", actionId, ok ? "→ ws (envoyé)" : "→ local (non connecté)");
      return ok;
    },
    [sendCommand, vibrate]
  );

  // ── Scan QR : lit « ws://IP:port » du QR desktop → remplit le champ ET connecte.
  // La saisie manuelle reste disponible : tout échec affiche un message et n'y touche pas.
  const [scanning, setScanning] = useState(false);
  const onScan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const res = await scanConnectionQr();
      if (!res.ok) {
        const msg =
          res.reason === "denied"
            ? "Caméra refusée — saisie manuelle"
            : res.reason === "unsupported"
            ? "Scan indisponible ici — saisie manuelle"
            : res.reason === "empty"
            ? "Scan annulé"
            : "Échec du scan — saisie manuelle";
        notify(msg);
        return;
      }
      if (!looksLikeAddress(res.value)) {
        notify("QR non reconnu — saisie manuelle");
        return;
      }
      const url = normalizeWsUrl(res.value);
      setAddress(url); // remplit le champ (visible/éditable en secours)
      connect(url); // …ET connecte directement
      notify("QR lu · connexion…");
    } finally {
      setScanning(false);
    }
  }, [scanning, notify, connect]);

  // Retour d'appui NEUTRE (pas de ON/OFF qui prétendrait à un état du vaisseau).
  const feedback = (ok: boolean) => (ok ? "envoyé" : "non connecté");

  const onToggle = useCallback(
    (actionId: string, actionIdOff: string | undefined, label: string) => {
      // Commande unique : envoie sa touche (le jeu, lui, bascule son état réel).
      // Commande double on/off (actionIdOff) : alterne quelle touche envoyer,
      // sans aucun affichage d'état (alternance interne uniquement).
      let sendId = actionId;
      if (actionIdOff) {
        const wasOn = altRef.current[actionId] ?? false;
        sendId = wasOn ? actionIdOff : actionId;
        altRef.current[actionId] = !wasOn;
      }
      const ok = send(sendId);
      notify(`${label} · ${feedback(ok)}`);
    },
    [send, notify]
  );

  const onStep = useCallback(
    (incId: string, decId: string, dir: 1 | -1, label: string) => {
      const ok = send(dir > 0 ? incId : decId);
      notify(`${label} ${dir > 0 ? "+" : "−"} · ${feedback(ok)}`);
    },
    [send, notify]
  );

  const onAction = useCallback(
    (actionId: string, label: string) => {
      const ok = send(actionId);
      notify(`${label} · ${feedback(ok)}`);
    },
    [send, notify]
  );

  const renderGroup = useCallback(
    (group: LayoutGroup, key: string) => (
      <div className="group" key={key}>
        <div className="group-label">{group.label}</div>
        <div className={`grid c${group.columns}`}>
          {group.elements.map((el, i) => {
            if (el.kind === "toggle") {
              const label = el.label ?? labelFr(el.actionId);
              const hint = el.label ? undefined : labelEn(el.actionId);
              return (
                <Toggle
                  key={el.actionId}
                  label={label}
                  hint={hint}
                  onClick={() => onToggle(el.actionId, el.actionIdOff, label)}
                />
              );
            }
            if (el.kind === "stepper") {
              return (
                <Stepper
                  key={el.incActionId}
                  label={el.label}
                  onDec={() => onStep(el.incActionId, el.decActionId, -1, el.label)}
                  onInc={() => onStep(el.incActionId, el.decActionId, 1, el.label)}
                />
              );
            }
            const label = el.label ?? labelFr(el.actionId);
            const hint = el.label ? undefined : labelEn(el.actionId);
            return (
              <ActionButton
                key={`${el.actionId}-${i}`}
                label={label}
                hint={hint}
                cta={el.cta}
                variant={el.variant}
                onClick={() => onAction(el.actionId, el.label ?? labelFr(el.actionId))}
              />
            );
          })}
        </div>
        {group.note ? <div className="blind-note">{group.note}</div> : null}
      </div>
    ),
    [onAction, onStep, onToggle]
  );

  const activeFilter = useMemo(
    () => CONFIG_FILTERS.find((f) => f.id === filter) ?? CONFIG_FILTERS[0],
    [filter]
  );

  return (
    <div className="mfd-view" ref={zoneMfdRef}>
      <div className="connbar">
        <button type="button" className="btn-back-mfd" title="Accueil" onClick={onBack}>
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
          <button type="button" onClick={disconnect}>
            Déconnecter
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-scan"
              onClick={onScan}
              disabled={scanning}
              title="Scanner le QR affiché par le bureau"
            >
              {scanning ? "Scan…" : "📷 Scanner"}
            </button>
            <button type="button" onClick={() => connect(address)}>
              Connecter
            </button>
          </>
        )}
        <div className="conn-status">
          <span className={`led ${discovering && connState === "disconnected" ? "connecting" : connState}`} />
          {discovering && connState === "disconnected"
            ? "Recherche du pont…"
            : connState === "error"
            ? connError ?? CONN_LABEL.error
            : CONN_LABEL[connState]}
        </div>
      </div>

      <div className="stage">
        {/* Boutons persistants (présents sur chaque écran) — déclencheurs + flash. */}
        <div className="persistent-bar">
          {PERSISTENT_BUTTONS.map((b) => (
            <ActionButton
              key={b.actionId}
              label={b.label}
              cta="↦"
              onClick={() => onAction(b.actionId, b.label)}
            />
          ))}
        </div>

        {screen === "energie" && ENERGIE_GROUPS.map((g, i) => renderGroup(g, `en-${i}`))}

        {screen === "bouclier" && (
          <div className="group">
            <div className="group-label">Boucliers · directionnel</div>
            <div className="shield-pad">
              {SHIELD_FACES.map((f) => (
                <div key={f.actionId} className={`sp-${f.dir.slice(0, 2)}`}>
                  <ActionButton
                    label={f.label}
                    cta="+"
                    onClick={() => onAction(f.actionId, `Bouclier ${f.label}`)}
                  />
                </div>
              ))}
              <div className="sp-rs">
                <ActionButton
                  label="Reset"
                  cta="↺"
                  onClick={() => onAction(SHIELD_RESET_ACTION, "Réinitialiser boucliers")}
                />
              </div>
            </div>
          </div>
        )}

        {screen === "missiles" && MISSILES_GROUPS.map((g, i) => renderGroup(g, `mis-${i}`))}

        {screen === "config" && (
          <>
            <div className="filters">
              {CONFIG_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`pill${filter === f.id ? " active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {activeFilter.groups.map((g, i) => renderGroup(g, `cfg-${activeFilter.id}-${i}`))}
          </>
        )}

        {screen === "diagnostic" && DIAGNOSTIC_GROUPS.map((g, i) => renderGroup(g, `diag-${i}`))}
      </div>

      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

      <div className="nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            className={screen === n.id ? "active" : ""}
            onClick={() => setScreen(n.id)}
          >
            <span className="ico">{n.ico}</span>
            <span className="t">{n.t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
