import { useCallback, useState } from "react";
import { getThemeById } from "@sc-mfd/shared";
import { useConnection } from "./useConnection";
import { useThemeZone } from "./useThemeZone";
import {
  loadSystemThemeId,
  saveSystemThemeId,
  loadLoadoutThemeId,
  saveLoadoutThemeId,
  loadSelectedLoadoutId,
  saveSelectedLoadoutId,
} from "./themeStorage";
import { LOADOUTS, DEFAULT_LOADOUT_ID, getLoadoutById } from "./loadouts";
import { HomeScreen } from "./HomeScreen";
import { SettingsScreen } from "./SettingsScreen";
import {
  loadAutoReconnect,
  saveAutoReconnect,
  loadBrightness,
  saveBrightness,
  loadKeepAwake,
  saveKeepAwake,
  loadVibrate,
  saveVibrate,
} from "./settingsStorage";

type Phase = "home" | "mfd";

export default function App() {
  const [phase, setPhase] = useState<Phase>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ── Réglages tablette ──
  const [autoReconnect, setAutoReconnect] = useState<boolean>(loadAutoReconnect);
  const [brightness, setBrightness] = useState<number>(loadBrightness);
  const [keepAwake, setKeepAwake] = useState<boolean>(loadKeepAwake);
  const [vibrate, setVibrate] = useState<boolean>(loadVibrate);

  // Connexion WS tenue au niveau shell : survit aux allers-retours accueil ↔ MFD.
  // La reconnexion auto est gérée dans le hook selon le réglage.
  const { state: connState, error: connError, connect, disconnect, sendCommand } =
    useConnection(autoReconnect);

  // Reconnexion auto = pur réseau → fonctionnel dès le web.
  const toggleAutoReconnect = useCallback((v: boolean) => {
    setAutoReconnect(v);
    saveAutoReconnect(v);
  }, []);

  // Réglages natifs : UI + persistance maintenant ; effet natif différé au packaging.
  const changeBrightness = useCallback((v: number) => {
    setBrightness(v);
    saveBrightness(v);
    // TODO Capacitor: appliquer via @capacitor-community/screen-brightness (app installée).
  }, []);
  const toggleKeepAwake = useCallback((v: boolean) => {
    setKeepAwake(v);
    saveKeepAwake(v);
    // TODO Capacitor: appliquer via @capacitor-community/keep-awake (KeepAwake.keepAwake/allowSleep).
  }, []);
  const toggleVibrate = useCallback((v: boolean) => {
    setVibrate(v);
    saveVibrate(v);
    // TODO Capacitor: déclencher un retour haptique via @capacitor/haptics à chaque tap.
  }, []);

  // ── Zone B : thème système (accueil, params, barres) ──
  const [systemThemeId, setSystemThemeId] = useState<string>(loadSystemThemeId);
  const zoneSystemRef = useThemeZone<HTMLDivElement>(getThemeById(systemThemeId).accent);
  const selectSystemTheme = useCallback((id: string) => {
    setSystemThemeId(id);
    saveSystemThemeId(id);
  }, []);

  // ── Zone C : thème LIÉ AU LOADOUT actif ──
  const [selectedLoadoutId, setSelectedLoadoutId] = useState<string>(() =>
    loadSelectedLoadoutId(DEFAULT_LOADOUT_ID)
  );
  const [loadoutThemeId, setLoadoutThemeId] = useState<string>(() =>
    loadLoadoutThemeId(loadSelectedLoadoutId(DEFAULT_LOADOUT_ID))
  );

  const selectLoadout = useCallback((id: string) => {
    setSelectedLoadoutId(id);
    saveSelectedLoadoutId(id);
    // Chaque loadout a son propre thème mémorisé → on bascule dessus.
    setLoadoutThemeId(loadLoadoutThemeId(id));
  }, []);

  const changeLoadoutTheme = useCallback(
    (themeId: string) => {
      setLoadoutThemeId(themeId);
      saveLoadoutThemeId(selectedLoadoutId, themeId);
    },
    [selectedLoadoutId]
  );

  const loadout = getLoadoutById(selectedLoadoutId);
  const canEnter = loadout.available && Boolean(loadout.Mfd);

  const enterMfd = useCallback(() => setPhase("mfd"), []);
  const goHome = useCallback(() => {
    setSettingsOpen(false);
    setPhase("home");
  }, []);

  const Mfd = loadout.Mfd;

  return (
    <div className="tablet" ref={zoneSystemRef}>
      {phase === "mfd" && Mfd ? (
        // Vue MFD : pas de header. Tout est en zone C (cf. ScfmMfd → .mfd-view).
        <Mfd
          accent={getThemeById(loadoutThemeId).accent}
          connState={connState}
          connError={connError}
          connect={connect}
          disconnect={disconnect}
          sendCommand={sendCommand}
          onBack={goHome}
        />
      ) : settingsOpen ? (
        // Paramètres (zone B système), ouverts depuis l'engrenage de l'accueil.
        <SettingsScreen
          onBack={() => setSettingsOpen(false)}
          systemThemeId={systemThemeId}
          onSelectSystemTheme={selectSystemTheme}
          connState={connState}
          autoReconnect={autoReconnect}
          onToggleAutoReconnect={toggleAutoReconnect}
          brightness={brightness}
          onBrightness={changeBrightness}
          keepAwake={keepAwake}
          onToggleKeepAwake={toggleKeepAwake}
          vibrate={vibrate}
          onToggleVibrate={toggleVibrate}
        />
      ) : (
        // Accueil (zone B système).
        <HomeScreen
          loadouts={LOADOUTS}
          selectedId={selectedLoadoutId}
          onSelectLoadout={selectLoadout}
          loadoutThemeId={loadoutThemeId}
          onChangeTheme={changeLoadoutTheme}
          canEnter={canEnter}
          onEnter={enterMfd}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}
    </div>
  );
}
