// 2e UI « SC UI » — reproduction des maquettes docs/mfd-2026-*.html (Design 2026) :
// fond sombre + halo accent, header sans titre, nav bas = 4 onglets + 3 FAB persistants
// (Phares / Master / Amplification). Atterrissage/Amarrage sur l'écran Énergie.
// Full Tailwind. Actions issues de mfdLayout (SCFM) ; tout est déclencheur + flash,
// aucun état persistant ni fausse jauge.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConfigFilter, MfdId } from "@sc-mfd/shared";
import {
  CONFIG_FILTERS,
  ENERGIE_GROUPS,
  ENERGIE_SYSTEMS,
  MISSILES_GROUPS,
  PERSISTENT_BUTTONS,
  LANDING_DOCKING,
  SHIELD_FACES,
  SHIELD_RESET_ACTION,
  SHIELD_COUNTERMEASURES,
  findUnresolvedActionIds,
  labelFr,
} from "./mfdLayout";
import type { ActionElement, StepperElement } from "./mfdLayout";
import { useFlash } from "./components/useFlash";
import {
  Zap,
  Shield,
  Settings,
  Rocket,
  Power,
  Lightbulb,
  Eye,
  RotateCcw,
  Crosshair,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowDownToLine,
  Anchor,
  Flame,
  AudioLines,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Target,
  QrCode,
  Plane,
  type LucideIcon,
} from "lucide-react";
import type { ConnState } from "./useConnection";
import { normalizeWsUrl } from "./useConnection";
import { scanConnectionQr, looksLikeAddress } from "./qrScan";
import { tapFeedback } from "./haptics";
import { useThemeZone } from "./useThemeZone";
import type { LoadoutMfdProps } from "./loadoutTypes";

const S1 = "#15181f";
const S2 = "#1c2029";
const S3 = "#242935";
const SOFT = "color-mix(in srgb, var(--accent) 16%, transparent)";
const GLOW = "color-mix(in srgb, var(--accent) 35%, transparent)";

const NAV: { id: MfdId; label: string; icon: LucideIcon }[] = [
  { id: "energie", label: "Énergie", icon: Zap },
  { id: "bouclier", label: "Boucliers", icon: Shield },
  { id: "config", label: "Config", icon: Settings },
  { id: "missiles", label: "Missiles", icon: Rocket },
];
const PERSIST_ICONS: LucideIcon[] = [Lightbulb, Power, Eye];
const SYS_ICONS: Record<string, LucideIcon> = { armes: Crosshair, boucliers: Shield, propulsion: Rocket };
const SHIELD_ICON: Record<string, LucideIcon> = { avant: ArrowUp, arriere: ArrowDown, babord: ArrowLeft, tribord: ArrowRight };
const CFG_ICON: Record<ConfigFilter, LucideIcon> = { vol: Plane, armes: Crosshair };

const CONN_LABEL: Record<ConnState, string> = {
  disconnected: "Déconnecté",
  connecting: "Connexion…",
  connected: "Connecté",
  error: "Erreur",
};

/** Bouton verre avec flash 200ms (déclencheur, aucun état). children reçoit `flashing`
 *  pour colorer icône/texte en blanc à l'appui. */
function FlashBtn({
  onClick,
  className = "",
  style,
  danger = false,
  ariaLabel,
  children,
}: {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  danger?: boolean;
  ariaLabel?: string;
  children: (flashing: boolean) => React.ReactNode;
}) {
  const [f, flash] = useFlash();
  const flashStyle: React.CSSProperties | undefined = f
    ? danger
      ? { background: "#ff6b5e", color: "#fff", boxShadow: "0 0 24px rgba(255,107,94,.4)" }
      : { background: "var(--accent)", color: "#fff", boxShadow: `0 0 22px ${GLOW}` }
    : undefined;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        flash();
        onClick?.();
      }}
      className={`transition-[transform,background,box-shadow] duration-100 active:scale-[0.97] ${className}`}
      style={{ ...style, ...flashStyle }}
    >
      {children(f)}
    </button>
  );
}

// Couleur d'icône/texte accent → blanc pendant le flash.
const ic = (f: boolean) => (f ? "#fff" : "var(--accent)");

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
  const [tab, setTab] = useState<ConfigFilter>(CONFIG_FILTERS[0]?.id ?? "vol");
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

  // ── Données (issues de mfdLayout / SCFM) ──
  const [alim, repart] = ENERGIE_GROUPS;
  const generaleId = alim?.elements[0]?.kind === "toggle" ? alim.elements[0].actionId : "v_power_toggle";
  const resetEnergie = repart?.elements.find((e): e is ActionElement => e.kind === "action");
  const [mType, mArmes, mBombes] = MISSILES_GROUPS;
  const typeBack = mType.elements[0];
  const typeFwd = mType.elements[1];
  const armesStep = mArmes.elements.find((e): e is StepperElement => e.kind === "stepper");
  const armesReset = mArmes.elements.find((e): e is ActionElement => e.kind === "action");
  const bombImpact = mBombes.elements.find((e): e is ActionElement => e.kind === "action" && e.actionId.includes("impact"));
  const bombRange = mBombes.elements.find((e): e is StepperElement => e.kind === "stepper");
  const bombReset = mBombes.elements.find((e): e is ActionElement => e.kind === "action" && e.actionId.includes("range_reset"));
  const activeTab = CONFIG_FILTERS.find((f) => f.id === tab) ?? CONFIG_FILTERS[0];

  const surfaceCard = "rounded-[28px] border border-white/[0.06]";

  return (
    <div
      ref={zoneRef}
      className="relative flex h-full w-full flex-col overflow-hidden text-[#f3f5f9]"
      style={{ background: "linear-gradient(170deg,#12151c,#0a0c11)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Halo accent en haut à droite */}
      <div
        className="pointer-events-none absolute right-[-8%] top-[-12%] z-0 h-1/2 w-3/5 rounded-full blur-[40px]"
        style={{ background: `radial-gradient(circle, ${SOFT}, transparent 70%)` }}
      />

      {/* Barre de connexion */}
      <div className="relative z-10 flex items-center gap-2.5 px-7 pb-2 pt-6">
        <FlashBtn onClick={onBack} ariaLabel="Accueil" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: S2 }}>
          {(f) => <ChevronLeft className="h-6 w-6" color={f ? "#fff" : "#9aa3b2"} />}
        </FlashBtn>
        <input
          type="text"
          inputMode="url"
          placeholder="ws://192.168.x.x:8420"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && connState !== "connected") connect(address); }}
          disabled={connState === "connected"}
          className="min-w-0 flex-1 rounded-2xl border border-white/[0.06] px-4 py-2.5 font-mono text-sm text-[#f3f5f9] placeholder:text-[#5b6473] focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
          style={{ background: S1 }}
        />
        {connState === "connected" ? (
          <FlashBtn onClick={disconnect} className="shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#9aa3b2]" style={{ background: S2 }}>
            {() => "Déconnecter"}
          </FlashBtn>
        ) : (
          <>
            <FlashBtn onClick={onScan} ariaLabel="Scanner le QR" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: S2 }}>
              {(f) => <QrCode className="h-5 w-5" color={ic(f)} />}
            </FlashBtn>
            <FlashBtn onClick={() => connect(address)} className="shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold" style={{ background: SOFT, color: "var(--accent)" }}>
              {() => "Connecter"}
            </FlashBtn>
          </>
        )}
        <div className="flex shrink-0 items-center gap-2 rounded-[30px] px-4 py-2.5 text-[13px] font-medium text-[#9aa3b2]" style={{ background: S2 }}>
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: connState === "connected" ? "#46e08a" : connState === "error" ? "#ff6b5e" : discovering || connState === "connecting" ? "var(--accent)" : "#5b6473",
              boxShadow: connState === "connected" ? "0 0 10px #46e08a" : "none",
            }}
          />
          {discovering && connState === "disconnected" ? "Recherche…" : connState === "error" ? connError ?? CONN_LABEL.error : CONN_LABEL[connState]}
        </div>
      </div>

      {/* Contenu (stage) */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-7 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ───── ÉNERGIE ───── */}
        {screen === "energie" && (
          <div className="flex h-full flex-col gap-4">
            {/* Alim. générale + Atterrissage + Amarrage */}
            <div className="flex flex-wrap gap-3">
              <FlashBtn onClick={() => act(generaleId, labelFr(generaleId))} className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                {(f) => (<><Power className="h-5 w-5" color={ic(f)} />Alim. générale</>)}
              </FlashBtn>
              {LANDING_DOCKING.map((b, i) => (
                <FlashBtn key={b.actionId} onClick={() => act(b.actionId, b.label)} className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                  {(f) => (<>{i === 0 ? <ArrowDownToLine className="h-5 w-5" color={ic(f)} /> : <Anchor className="h-5 w-5" color={ic(f)} />}{b.label}</>)}
                </FlashBtn>
              ))}
            </div>

            {/* 3 colonnes + colonne reset */}
            <div className="flex min-h-0 flex-1 gap-4">
              <div className="grid flex-1 grid-cols-3 gap-4">
                {ENERGIE_SYSTEMS.map((sys) => {
                  const SIcon = SYS_ICONS[sys.key] ?? Zap;
                  return (
                    <div key={sys.key} className={`flex flex-col items-center gap-3.5 p-[18px_14px] ${surfaceCard}`} style={{ background: S1 }}>
                      <div className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9aa3b2]">{sys.label}</div>
                      <FlashBtn onClick={() => act(sys.incActionId, `${sys.label} +`)} ariaLabel={`${sys.label} +`} className="flex h-[88px] w-full items-center justify-center rounded-2xl text-[34px] font-semibold" style={{ background: SOFT, color: "var(--accent)" }}>
                        {(f) => <span style={{ color: f ? "#fff" : "var(--accent)" }}>+</span>}
                      </FlashBtn>
                      <div className="min-h-2 flex-1" />
                      <FlashBtn onClick={() => act(sys.decActionId, `${sys.label} −`)} ariaLabel={`${sys.label} −`} className="flex h-[88px] w-full items-center justify-center rounded-2xl text-[34px] font-semibold" style={{ background: S3, color: "var(--accent)" }}>
                        {(f) => <span style={{ color: f ? "#fff" : "var(--accent)" }}>−</span>}
                      </FlashBtn>
                      <FlashBtn onClick={() => act(sys.powerToggleId, labelFr(sys.powerToggleId))} className="flex w-full flex-col items-center gap-1.5 rounded-2xl px-2 py-3.5 text-[13px] font-semibold text-[#f3f5f9]" style={{ background: S2, borderTop: "2px solid " + SOFT }}>
                        {(f) => (<><SIcon className="h-6 w-6" color={ic(f)} />Alimentation</>)}
                      </FlashBtn>
                    </div>
                  );
                })}
              </div>
              {resetEnergie && (
                <FlashBtn onClick={() => act(resetEnergie.actionId, resetEnergie.label ?? "Réinitialiser")} className={`flex w-24 shrink-0 flex-col items-center justify-center gap-3.5 ${surfaceCard}`} style={{ background: S1 }}>
                  {(f) => (<><RotateCcw className="h-[30px] w-[30px]" color={ic(f)} /><span className="text-[13px] font-semibold" style={{ color: f ? "#fff" : "#9aa3b2" }}>Réinit.</span></>)}
                </FlashBtn>
              )}
            </div>
          </div>
        )}

        {/* ───── BOUCLIERS ───── */}
        {screen === "bouclier" && (
          <div className="grid h-full grid-cols-[1.25fr_1fr] gap-5">
            {/* d-pad */}
            <div className={`flex flex-col p-[22px] ${surfaceCard}`} style={{ background: S1 }}>
              <div className="mb-[18px] text-xs font-semibold uppercase tracking-[0.09em] text-[#5b6473]">Renforcement directionnel</div>
              <div className="flex flex-1 items-center justify-center">
                <div className="grid grid-cols-3 grid-rows-3 gap-3">
                  {(["avant", "babord", "reset", "tribord", "arriere"] as const).map((slot) => {
                    if (slot === "reset") {
                      return (
                        <FlashBtn key="reset" onClick={() => act(SHIELD_RESET_ACTION, "Réinitialiser boucliers")} className="col-start-2 row-start-2 flex h-[104px] w-[104px] flex-col items-center justify-center gap-1.5 rounded-[26px] text-[13px] font-semibold text-[#9aa3b2]" style={{ background: S3 }}>
                          {(f) => (<><RotateCcw className="h-6 w-6" color={f ? "#fff" : "#9aa3b2"} />Reset</>)}
                        </FlashBtn>
                      );
                    }
                    const face = SHIELD_FACES.find((x) => x.dir === slot)!;
                    const Icon = SHIELD_ICON[slot];
                    const pos = slot === "avant" ? "col-start-2 row-start-1" : slot === "babord" ? "col-start-1 row-start-2" : slot === "tribord" ? "col-start-3 row-start-2" : "col-start-2 row-start-3";
                    return (
                      <FlashBtn key={face.actionId} onClick={() => act(face.actionId, `Bouclier ${face.label}`)} className={`${pos} flex h-[104px] w-[104px] flex-col items-center justify-center gap-1.5 rounded-[26px] text-base font-semibold text-[#f3f5f9]`} style={{ background: S2 }}>
                        {(f) => (<><Icon className="h-6 w-6" color={ic(f)} />{face.label}</>)}
                      </FlashBtn>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* contre-mesures */}
            <div className={`flex flex-col p-[22px] ${surfaceCard}`} style={{ background: S1 }}>
              <div className="mb-[18px] text-xs font-semibold uppercase tracking-[0.09em] text-[#5b6473]">Contre-mesures</div>
              <div className="flex flex-1 flex-col gap-3.5">
                <FlashBtn onClick={() => act(SHIELD_COUNTERMEASURES.decoyLaunch, "Leurres")} className="flex items-center gap-4 rounded-[18px] p-5 text-base font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                  {(f) => (<><Flame className="h-[26px] w-[26px] shrink-0" color={ic(f)} /><span className="flex flex-col items-start"><span>Leurres</span><span className="text-xs font-medium" style={{ color: f ? "rgba(255,255,255,.8)" : "#9aa3b2" }}>Déployer en rafale</span></span></>)}
                </FlashBtn>
                <FlashBtn onClick={() => act(SHIELD_COUNTERMEASURES.noiseLaunch, "Brouillage")} className="flex items-center gap-4 rounded-[18px] p-5 text-base font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                  {(f) => (<><AudioLines className="h-[26px] w-[26px] shrink-0" color={ic(f)} /><span className="flex flex-col items-start"><span>Brouillage</span><span className="text-xs font-medium" style={{ color: f ? "rgba(255,255,255,.8)" : "#9aa3b2" }}>Sonore / paillettes</span></span></>)}
                </FlashBtn>
                {/* Rafale de leurres (− / +) */}
                <div className="flex items-center gap-3 rounded-[18px] p-4" style={{ background: S2 }}>
                  <span className="flex-1 text-sm font-semibold text-[#9aa3b2]">Rafale de leurres</span>
                  <FlashBtn onClick={() => act(SHIELD_COUNTERMEASURES.burstDecId, "Rafale −")} ariaLabel="Rafale −" className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: S3, color: "var(--accent)" }}>
                    {(f) => <span style={{ color: f ? "#fff" : "var(--accent)" }}>−</span>}
                  </FlashBtn>
                  <FlashBtn onClick={() => act(SHIELD_COUNTERMEASURES.burstIncId, "Rafale +")} ariaLabel="Rafale +" className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: S3, color: "var(--accent)" }}>
                    {(f) => <span style={{ color: f ? "#fff" : "var(--accent)" }}>+</span>}
                  </FlashBtn>
                </div>
                <div className="flex-1" />
                <FlashBtn danger onClick={() => act(SHIELD_COUNTERMEASURES.panicId, "Tir de catastrophe")} className="flex items-center gap-4 rounded-[18px] p-5 text-base font-semibold text-[#ff6b5e]" style={{ background: "rgba(255,107,94,.14)" }}>
                  {(f) => (<><AlertTriangle className="h-[26px] w-[26px] shrink-0" color={f ? "#fff" : "#ff6b5e"} /><span className="flex flex-col items-start"><span>Leurre panique</span><span className="text-xs font-medium" style={{ color: f ? "rgba(255,255,255,.8)" : "#9aa3b2" }}>Tout déployer d'un coup</span></span></>)}
                </FlashBtn>
              </div>
            </div>
          </div>
        )}

        {/* ───── CONFIG ───── */}
        {screen === "config" && (
          <div className="flex h-full flex-col">
            <div className="mb-[18px] flex gap-1.5 rounded-[18px] border border-white/[0.06] p-1.5" style={{ background: S1 }}>
              {CONFIG_FILTERS.map((f) => {
                const FIcon = CFG_ICON[f.id] ?? Settings;
                const on = tab === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTab(f.id)}
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-[13px] py-3.5 text-[15px] font-semibold transition-colors"
                    style={on ? { background: "var(--accent)", color: "#fff", boxShadow: `0 4px 16px ${GLOW}` } : { color: "#9aa3b2" }}
                  >
                    <FIcon className="h-5 w-5" /> {f.label}
                  </button>
                );
              })}
            </div>
            <div className="grid flex-1 auto-rows-min grid-cols-4 content-start gap-3">
              {activeTab?.groups.flatMap((g) => g.elements).map((el, i) => {
                if (el.kind === "stepper") return null; // pas de stepper en Config
                const label = el.label ?? labelFr(el.actionId);
                return (
                  <FlashBtn key={`${el.actionId}-${i}`} onClick={() => act(el.actionId, label)} className="flex flex-col items-center justify-center gap-2.5 rounded-[20px] border border-white/[0.06] p-[18px_14px] text-center text-sm font-semibold text-[#f3f5f9]" style={{ background: S1 }}>
                    {() => label}
                  </FlashBtn>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── MISSILES ───── */}
        {screen === "missiles" && (
          <div className="flex h-full flex-col gap-4">
            <div className={`p-[20px_22px] ${surfaceCard}`} style={{ background: S1 }}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.09em] text-[#5b6473]">Type de missile</div>
              <div className="flex gap-3">
                <FlashBtn onClick={() => typeBack.kind === "action" && act(typeBack.actionId, "Type précédent")} className="flex flex-1 items-center justify-center gap-3 rounded-[18px] p-[22px] text-base font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                  {(f) => (<><ChevronLeft className="h-7 w-7" color={ic(f)} />Précédent</>)}
                </FlashBtn>
                <FlashBtn onClick={() => typeFwd.kind === "action" && act(typeFwd.actionId, "Type suivant")} className="flex flex-1 items-center justify-center gap-3 rounded-[18px] p-[22px] text-base font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                  {(f) => (<>Suivant<ChevronRight className="h-7 w-7" color={ic(f)} /></>)}
                </FlashBtn>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4">
              {/* Armés */}
              <div className={`flex flex-col p-[20px_22px] ${surfaceCard}`} style={{ background: S1 }}>
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.09em] text-[#5b6473]">Missiles armés</div>
                <div className="flex flex-1 gap-3">
                  {armesStep && (
                    <>
                      <FlashBtn onClick={() => act(armesStep.decActionId, "Armés −")} ariaLabel="Armés −" className="flex flex-1 items-center justify-center rounded-[18px] text-[30px]" style={{ background: S2, color: "var(--accent)" }}>
                        {(f) => <Minus className="h-7 w-7" color={ic(f)} />}
                      </FlashBtn>
                      <FlashBtn onClick={() => act(armesStep.incActionId, "Armés +")} ariaLabel="Armés +" className="flex flex-1 items-center justify-center rounded-[18px]" style={{ background: S2, color: "var(--accent)" }}>
                        {(f) => <Plus className="h-7 w-7" color={ic(f)} />}
                      </FlashBtn>
                    </>
                  )}
                </div>
                {armesReset && (
                  <FlashBtn onClick={() => act(armesReset.actionId, armesReset.label ?? "Réinitialiser")} className="mt-3 flex items-center justify-center gap-2 rounded-[18px] py-3.5 text-sm font-semibold text-[#9aa3b2]" style={{ background: S2 }}>
                    {(f) => (<><RotateCcw className="h-5 w-5" color={f ? "#fff" : "#9aa3b2"} />Réinitialiser</>)}
                  </FlashBtn>
                )}
              </div>
              {/* Bombes */}
              <div className={`flex flex-col gap-3 p-[20px_22px] ${surfaceCard}`} style={{ background: S1 }}>
                <div className="text-xs font-semibold uppercase tracking-[0.09em] text-[#5b6473]">Bombes</div>
                {bombImpact && (
                  <FlashBtn onClick={() => act(bombImpact.actionId, bombImpact.label ?? "Point d'impact")} className="flex items-center justify-center gap-3 rounded-[18px] p-5 text-base font-semibold text-[#f3f5f9]" style={{ background: S2 }}>
                    {(f) => (<><Target className="h-6 w-6" color={ic(f)} />Point d'impact</>)}
                  </FlashBtn>
                )}
                {bombRange && (
                  <div className="flex flex-1 gap-3">
                    <FlashBtn onClick={() => act(bombRange.decActionId, "Portée −")} ariaLabel="Portée −" className="flex flex-1 items-center justify-center rounded-[18px]" style={{ background: S2, color: "var(--accent)" }}>
                      {(f) => <Minus className="h-7 w-7" color={ic(f)} />}
                    </FlashBtn>
                    <FlashBtn onClick={() => act(bombRange.incActionId, "Portée +")} ariaLabel="Portée +" className="flex flex-1 items-center justify-center rounded-[18px]" style={{ background: S2, color: "var(--accent)" }}>
                      {(f) => <Plus className="h-7 w-7" color={ic(f)} />}
                    </FlashBtn>
                  </div>
                )}
                {bombReset && (
                  <FlashBtn onClick={() => act(bombReset.actionId, bombReset.label ?? "Réinitialiser portée")} className="flex items-center justify-center gap-2 rounded-[18px] py-3 text-sm font-semibold text-[#9aa3b2]" style={{ background: S2 }}>
                    {(f) => (<><RotateCcw className="h-5 w-5" color={f ? "#fff" : "#9aa3b2"} />Portée reset</>)}
                  </FlashBtn>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav bas : 4 onglets + séparateur + 3 FAB persistants */}
      <div className="relative z-10 flex items-center gap-2 border-t border-white/[0.06] px-7 py-3.5">
        {NAV.map((n) => {
          const on = screen === n.id;
          const Icon = n.icon;
          return (
            <button key={n.id} type="button" onClick={() => setScreen(n.id)} className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-2 transition-colors" style={{ color: on ? "var(--accent)" : "#5b6473" }}>
              <Icon className="h-6 w-6" />
              <span className="text-[11px] font-semibold">{n.label}</span>
            </button>
          );
        })}
        <div className="mx-2 h-10 w-px bg-white/[0.06]" />
        {PERSISTENT_BUTTONS.map((b, i) => {
          const Icon = PERSIST_ICONS[i] ?? Power;
          return (
            <FlashBtn key={b.actionId} onClick={() => act(b.actionId, b.label)} ariaLabel={b.label} className="flex h-[54px] w-[54px] shrink-0 flex-col items-center justify-center gap-1 rounded-[17px]" style={{ background: S2 }}>
              {(f) => (<><Icon className="h-[22px] w-[22px]" color={ic(f)} /><span className="text-[8px] font-semibold leading-none" style={{ color: f ? "#fff" : "#9aa3b2" }}>{b.label.split(" ")[0]}</span></>)}
            </FlashBtn>
          );
        })}
      </div>

      {/* Toast */}
      <div
        className={`pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-[#f3f5f9] backdrop-blur-xl transition-all duration-200 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        style={{ background: "rgba(10,12,18,.9)" }}
      >
        {toast.msg}
      </div>
    </div>
  );
}
