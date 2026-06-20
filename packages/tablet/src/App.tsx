import { useCallback, useEffect, useState } from "react";
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
  loadKeepAwake,
  saveKeepAwake,
  loadVibrate,
  saveVibrate,
} from "./settingsStorage";
import { applyKeepAwake } from "./screenAwake";

type Phase = "home" | "mfd";

export default function App() {
  const [phase, setPhase] = useState<Phase>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ── Réglages tablette ──
  const [autoReconnect, setAutoReconnect] = useState<boolean>(loadAutoReconnect);
  const [keepAwake, setKeepAwake] = useState<boolean>(loadKeepAwake);
  const [vibrate, setVibrate] = useState<boolean>(loadVibrate);

  // Applique « garder l'écran allumé » au démarrage selon la valeur persistée
  // (no-op en web ; effet réel sur l'APK). Ne dépend que du montage.
  useEffect(() => {
    void applyKeepAwake(loadKeepAwake());
  }, []);

  // Connexion WS tenue au niveau shell : survit aux allers-retours accueil ↔ MFD.
  // La reconnexion auto est gérée dans le hook selon le réglage.
  const { state: connState, error: connError, connect, disconnect, sendCommand } =
    useConnection(autoReconnect);

  // Reconnexion auto = pur réseau → fonctionnel dès le web.
  const toggleAutoReconnect = useCallback((v: boolean) => {
    setAutoReconnect(v);
    saveAutoReconnect(v);
  }, []);

  // Garder l'écran allumé : applique l'effet natif immédiatement (no-op en web).
  const toggleKeepAwake = useCallback((v: boolean) => {
    setKeepAwake(v);
    saveKeepAwake(v);
    void applyKeepAwake(v);
  }, []);
  // Vibration au tap : pas d'effet ici ; le retour haptique est déclenché à l'appui
  // des boutons d'action MFD (cf. ScfmMfd.send), selon ce réglage.
  const toggleVibrate = useCallback((v: boolean) => {
    setVibrate(v);
    saveVibrate(v);
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
          vibrate={vibrate}
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
