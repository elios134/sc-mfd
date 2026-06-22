import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { enable as enableAutostart, disable as disableAutostart, isEnabled as isAutostartEnabled } from "@tauri-apps/plugin-autostart";
import { ACTIONS, getThemeById } from "@sc-mfd/shared";
import type { MfdAction } from "@sc-mfd/shared";
import { useThemeZone } from "./useThemeZone";
import { loadDesktopThemeId, saveDesktopThemeId } from "./themeStorage";
import { WindowControls } from "./WindowControls";
import { LoadingScreen } from "./LoadingScreen";
import { SettingsView } from "./SettingsView";
import { Dashboard } from "./Dashboard";
import { BottomNav } from "./BottomNav";
import type { DesktopView } from "./BottomNav";
import { ProfileDebugPanel } from "./ProfileDebugPanel";
import { checkForUpdate } from "./updater";
import { readProfiles } from "./profileReader";
import type { ProfileReadResult } from "./profileReader";
import { deployControlProfile } from "./controlProfile";
import type { DeployResult } from "./controlProfile";
import {
  loadProfileNoticeSeen,
  saveProfileNoticeSeen,
  saveScPathOverride,
  clearScPathOverride,
} from "./desktopSettings";
import type { Device, LoadStep, LogEntry, ScInstall, ServerInfo } from "./desktopTypes";
import {
  loadWsPort,
  saveWsPort,
  loadStartWithWindows,
  saveStartWithWindows,
  loadMinimizeToTray,
  saveMinimizeToTray,
} from "./desktopSettings";

// Payloads miroirs des events Rust (server.rs).
interface CommandEventPayload {
  client_id: number;
  action_id: string;
  assigned: boolean;
  key_label: string | null;
  error: string | null;
  source: string;
}
interface ClientEventPayload {
  client_id: number;
  addr: string;
}

// Résolution du libellé d'action (pour le journal).
const ACTION_BY_ID = new Map<string, MfdAction>(ACTIONS.map((a) => [a.id, a]));
function labelFor(actionId: string): string {
  return ACTION_BY_ID.get(actionId)?.labelFr ?? actionId;
}

const MAX_LOG = 60;
const MIN_LOADING_MS = 900; // laisse l'animation respirer même si tout est prêt vite

export default function App() {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  // Vue active une fois prêt : tableau de bord (logo) ou paramètres (nav V2).
  const [view, setView] = useState<DesktopView>("dashboard");

  // Thème zone A (toute l'app desktop), posé sur .app (jamais :root).
  const [themeId, setThemeId] = useState<string>(loadDesktopThemeId);
  const zoneRef = useThemeZone<HTMLDivElement>(getThemeById(themeId).accent);
  const selectTheme = (id: string) => {
    setThemeId(id);
    saveDesktopThemeId(id);
  };

  const [server, setServer] = useState<ServerInfo | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logSeq = useRef(0);

  const [scInstall, setScInstall] = useState<ScInstall | null>(null);
  const [scResolved, setScResolved] = useState(false);
  // Message d'erreur du sélecteur de dossier SC (dossier invalide, etc.).
  const [scError, setScError] = useState<string | null>(null);

  // Mapping dynamique des touches (C2/C3a) : vraies touches du joueur, transmises
  // au Rust pour piloter l'émulation (source primaire ; fallback keymap figé).
  // Reconstruit à chaque chargement (pas de cache disque). Affiché via la vue 🔑.
  const [profileMap, setProfileMap] = useState<ProfileReadResult | null>(null);
  const [showProfileDebug, setShowProfileDebug] = useState(false);

  // Dépôt du control-profile « SC MFD » (C3b) : statut + notice de sélection.
  const [profileDeploy, setProfileDeploy] = useState<DeployResult | null>(null);
  const [noticeSeen, setNoticeSeen] = useState<boolean>(loadProfileNoticeSeen);
  const dismissNotice = useCallback(() => {
    setNoticeSeen(true);
    saveProfileNoticeSeen(true);
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await readProfiles();
      setProfileMap(res);
      // Transmet le mapping à la couche d'émulation Rust (set_dynamic_binds).
      const payload = res.binds.map((b) => ({
        id: b.id,
        key: b.key,
        modifiers: b.modifiers,
        activation: b.activation,
        source: b.source,
        emulable: b.key != null, // null = à assigner / molette → non émulable
        raw: b.rawInput,
      }));
      try {
        const n = await invoke<number>("set_dynamic_binds", { binds: payload });
        console.log(`[profil] ${n} binds transmis à l'émulation Rust`);
      } catch (e) {
        console.error("[profil] transmission au Rust échouée:", e);
      }
      // Journal console (preuve) — met en avant l'ATC.
      const atc = res.binds.find((b) => b.id === "v_atc_request");
      console.groupCollapsed(
        `[profil] mapping dynamique — ${res.binds.length} actions (joueur=${res.playerFound}, défaut=${res.defaultFound})`
      );
      console.log("ATC (test clé) →", atc ? `${atc.key ?? "—"} [${atc.source}]` : "introuvable");
      console.table(
        res.binds.map((b) => ({
          action: b.labelFr,
          id: b.id,
          touche: b.key ?? "—",
          mods: b.modifiers.join("+"),
          activation: b.activation,
          source: b.source,
          raw: b.rawInput ?? "",
          autres: b.otherDevices.join(", "),
        }))
      );
      if (res.warnings.length) console.warn("[profil] warnings:", res.warnings);
      console.groupEnd();
    } catch (e) {
      console.error("[profil] lecture échouée:", e);
    }

    // Génère + dépose le control-profile « SC MFD » (reprend les binds joueur +
    // ajoute nos 16). Silencieux ; le statut alimente les paramètres.
    const dep = await deployControlProfile();
    setProfileDeploy(dep);
    if (dep.ok) console.log(`[profil] SC MFD déposé (${dep.added} binds ajoutés) → ${dep.path}`);
    else console.warn("[profil] dépôt SC MFD échoué:", dep.error);
  }, []);

  // Réglages persistés.
  const [port, setPort] = useState<number>(() => loadWsPort(8420));
  const [startWithWindows, setStartWithWindows] = useState<boolean>(loadStartWithWindows);
  const [minimizeToTray, setMinimizeToTray] = useState<boolean>(loadMinimizeToTray);

  // Mise à jour auto du pont au lancement (best-effort, silencieux).
  useEffect(() => {
    void checkForUpdate();
  }, []);

  // ── Effets de démarrage : serveur + détection SC + listeners WS ──
  useEffect(() => {
    let disposed = false;
    const unlisteners: UnlistenFn[] = [];
    const track = (un: UnlistenFn) => {
      if (disposed) un();
      else unlisteners.push(un);
    };

    invoke<ServerInfo>("get_server_info")
      .then((info) => !disposed && setServer(info))
      .catch((e) => !disposed && setServerError(String(e)));

    invoke<ScInstall>("detect_sc_install")
      .then((res) => {
        if (disposed) return;
        setScInstall(res);
        setScResolved(true);
      })
      .catch(() => {
        if (disposed) return;
        setScInstall({ path: null, channel: null, detected: false, source: null });
        setScResolved(true);
      });

    // Synchronise l'état initial du toggle « Réduire dans le tray » avec le Rust
    // (le défaut Rust est true ; on pousse la vraie valeur persistée localStorage).
    void invoke("set_minimize_to_tray", { enabled: minimizeToTray }).catch((e) =>
      console.error("[tray] sync initiale échouée:", e)
    );

    // Resynchronise le toggle « Démarrer avec Windows » avec l'état natif réel
    // (registre HKCU\…\Run via le plugin) : reflète la vérité même si l'état a
    // été changé ailleurs. Tolérant : un échec laisse la valeur localStorage.
    isAutostartEnabled()
      .then((real) => {
        if (disposed) return;
        setStartWithWindows((prev) => {
          if (prev !== real) saveStartWithWindows(real);
          return real;
        });
      })
      .catch((e) => console.warn("[autostart] is_enabled indisponible:", e));

    // Lecture du profil + transmission à l'émulation Rust (C3a). Pas de garde
    // `disposed` : loadProfile ne fait que setState/invoke, sûrs après démontage.
    void loadProfile();

    const now = () => new Date().toLocaleTimeString("fr-FR");

    (async () => {
      track(
        await listen<CommandEventPayload>("command-received", (e) => {
          const { action_id, assigned, key_label, error, source } = e.payload;
          const kind: LogEntry["kind"] = error ? "error" : assigned ? "ok" : "unassigned";
          const detail = error
            ? `⚠ ${error}`
            : assigned && key_label
            ? `→ ${key_label} envoyée · ${source}`
            : "non assignée — profil requis";
          setLogs((prev) =>
            [
              {
                key: logSeq.current++,
                time: now(),
                actionId: action_id,
                label: labelFor(action_id),
                detail,
                kind,
              },
              ...prev,
            ].slice(0, MAX_LOG)
          );
        })
      );
      track(
        await listen<ClientEventPayload>("client-connected", (e) => {
          const { client_id, addr } = e.payload;
          setDevices((prev) => [
            ...prev.filter((d) => d.clientId !== client_id),
            { clientId: client_id, addr },
          ]);
        })
      );
      track(
        await listen<ClientEventPayload>("client-disconnected", (e) => {
          const { client_id } = e.payload;
          setDevices((prev) => prev.filter((d) => d.clientId !== client_id));
        })
      );
    })();

    return () => {
      disposed = true;
      unlisteners.forEach((u) => u());
    };
  }, []);

  // ── Transition chargement → params : quand serveur ET détection SC sont réglés ──
  useEffect(() => {
    if (phase !== "loading") return;
    const settled = (server !== null || serverError !== null) && scResolved;
    if (!settled) return;
    const t = window.setTimeout(() => setPhase("ready"), MIN_LOADING_MS);
    return () => window.clearTimeout(t);
  }, [phase, server, serverError, scResolved]);

  // Réglages : setter + persistance.
  const changePort = (v: number) => {
    setPort(v);
    saveWsPort(v);
    // TODO backend : rebind du serveur WS sur le port configuré (refonte server.rs).
  };
  const toggleStartWithWindows = async (v: boolean) => {
    // Optimiste : on bascule l'UI tout de suite, puis on applique l'effet natif.
    setStartWithWindows(v);
    saveStartWithWindows(v);
    try {
      if (v) await enableAutostart();
      else await disableAutostart();
    } catch (e) {
      console.error("[autostart] échec de l'application:", e);
      // Réaligne l'UI sur l'état natif réel après échec.
      try {
        const real = await isAutostartEnabled();
        setStartWithWindows(real);
        saveStartWithWindows(real);
      } catch {
        /* ignore : on garde la valeur optimiste */
      }
    }
  };
  const toggleMinimizeToTray = (v: boolean) => {
    setMinimizeToTray(v);
    saveMinimizeToTray(v);
    // Transmet l'état au Rust (lu frais au moment du close pour cacher vs quitter).
    void invoke("set_minimize_to_tray", { enabled: v }).catch((e) =>
      console.error("[tray] sync état échouée:", e)
    );
  };
  const pickScFolder = async () => {
    setScError(null);
    let selected: string | string[] | null;
    try {
      selected = await openDialog({
        directory: true,
        multiple: false,
        title: "Sélectionner le dossier d'installation de Star Citizen (canal, ex. …\\StarCitizen\\LIVE)",
      });
    } catch (e) {
      console.error("[sc] ouverture du sélecteur échouée:", e);
      setScError("Impossible d'ouvrir le sélecteur de dossier.");
      return;
    }
    if (selected == null || Array.isArray(selected)) return; // annulé
    try {
      // Le Rust valide (Data.p4k) et persiste ; renvoie l'install résolu (manual).
      const res = await invoke<ScInstall>("set_sc_override", { path: selected });
      saveScPathOverride(selected);
      setScInstall(res);
      setScError(null);
      // Le chemin SC a changé → relit le profil + redépose SCMFD.xml au bon endroit.
      void loadProfile();
    } catch (e) {
      // Dossier invalide : message clair, rien n'est enregistré (cf. Rust).
      setScError(String(e));
    }
  };

  const resetScFolder = async () => {
    setScError(null);
    try {
      const res = await invoke<ScInstall>("clear_sc_override");
      clearScPathOverride();
      setScInstall(res);
      void loadProfile();
    } catch (e) {
      console.error("[sc] réinitialisation échouée:", e);
      setScError(String(e));
    }
  };

  const serverOk = server !== null && !serverError;
  const steps: LoadStep[] = [
    {
      label: "Démarrage du serveur local",
      status: serverError ? "error" : serverOk ? "done" : "current",
    },
    {
      label: "Détection de Star Citizen",
      status: scResolved ? "done" : serverOk ? "current" : "upcoming",
    },
    {
      label: "Préparation de l'émulation touches",
      status: serverOk ? "done" : "upcoming",
    },
    {
      label: "En attente d'une tablette",
      status: devices.length > 0 ? "done" : scResolved ? "current" : "upcoming",
    },
  ];

  return (
    <div ref={zoneRef} className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Fond glassmorphique global teinté à l'accent (repris de SCFM V2 Layout). */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, var(--bg-glow-1, rgba(45,127,249,0.15)) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, var(--bg-glow-2, rgba(45,127,249,0.1)) 0%, transparent 50%), #0a0a0f",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <header
          data-tauri-drag-region
          className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4"
        >
          <div className="flex items-center gap-3" data-tauri-drag-region>
            <img src="/logo.png" alt="SC MFD" className="h-7 w-7 object-contain" data-tauri-drag-region />
            <div className="leading-tight" data-tauri-drag-region>
              <div className="text-sm font-bold tracking-wide text-white">
                SC FLEET <span className="text-[var(--accent)]">MFD BRIDGE</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                Pont tablette ↔ jeu
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <WindowControls />
          </div>
        </header>

        {phase === "loading" ? (
          <LoadingScreen steps={steps} />
        ) : (
          <main className="relative min-h-0 flex-1 overflow-auto pb-28">
            {view === "dashboard" ? (
              <Dashboard
                server={server}
                serverError={serverError}
                devicesCount={devices.length}
                scInstall={scInstall}
              />
            ) : (
              <SettingsView
              server={server}
              serverError={serverError}
              themeId={themeId}
              onSelectTheme={selectTheme}
              scInstall={scInstall}
              scResolved={scResolved}
              scError={scError}
              logs={logs}
              port={port}
              onPort={changePort}
              startWithWindows={startWithWindows}
              onStartWithWindows={toggleStartWithWindows}
              minimizeToTray={minimizeToTray}
              onMinimizeToTray={toggleMinimizeToTray}
              onPickScFolder={pickScFolder}
              onResetScFolder={resetScFolder}
              profileDeploy={profileDeploy}
              showProfileNotice={!noticeSeen}
              onDismissProfileNotice={dismissNotice}
              profileMap={profileMap}
              onOpenMapping={() => setShowProfileDebug(true)}
            />
          )}
          <BottomNav view={view} onNavigate={setView} />
        </main>
      )}
      </div>

      {showProfileDebug && (
        <ProfileDebugPanel
          result={profileMap}
          onClose={() => setShowProfileDebug(false)}
          onRefresh={loadProfile}
        />
      )}
    </div>
  );
}
