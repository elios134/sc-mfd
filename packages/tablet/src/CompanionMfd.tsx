import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConfigFilter, MfdId } from "@sc-mfd/shared";
import {
  Zap,
  Shield,
  Settings,
  Rocket,
  Power as PowerIcon,
  ArrowDownToLine,
  Anchor,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Plane,
  Crosshair,
  Monitor,
  Navigation,
  Bomb,
  Target,
  Camera,
  Lightbulb,
  Eye,
  Flame,
  Radio,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import {
  CONFIG_FILTERS,
  ENERGIE_GROUPS,
  ENERGIE_SYSTEMS,
  MISSILES_GROUPS,
  PERSISTENT_BUTTONS,
  SHIELD_FACES,
  SHIELD_RESET_ACTION,
  SHIELD_COUNTERMEASURES,
  LANDING_DOCKING,
  findUnresolvedActionIds,
  labelFr,
} from "./mfdLayout";
import type { LayoutElement, ActionElement } from "./mfdLayout";
import { normalizeWsUrl } from "./useConnection";
import type { ConnState } from "./useConnection";
import { scanConnectionQr, looksLikeAddress } from "./qrScan";
import { tapFeedback } from "./haptics";
import { useThemeZone } from "./useThemeZone";
import type { LoadoutMfdProps } from "./loadoutTypes";

/* ════════════ Contrôles en verre (repris de la maquette Figma controls.tsx) ════════════
   ImpulseButton : flash 200ms à l'appui (aucun état persistant — règle « aucun faux
   état »). Variante « accent » teintée par --accent (thématisable). */

type Variant = "default" | "danger" | "accent";

function ImpulseButton({
  label,
  onClick,
  variant = "default",
  className = "",
}: {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
}) {
  const [pressed, setPressed] = useState(false);
  const handle = () => {
    setPressed(true);
    onClick?.();
    window.setTimeout(() => setPressed(false), 200);
  };

  const base =
    "relative overflow-hidden rounded-3xl border backdrop-blur-xl font-medium tracking-wide text-sm transition-all duration-150 ease-out";
  const idle: Record<Variant, string> = {
    default: "bg-white/5 border-white/10 text-white hover:bg-white/15",
    danger: "bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20",
    accent: "",
  };
  const active: Record<Variant, string> = {
    default: "bg-white/90 text-black scale-[0.97]",
    danger: "bg-red-500/90 text-white scale-[0.97]",
    accent: "scale-[0.97] text-white",
  };
  // La variante accent est posée en style inline (color-mix sur --accent).
  const accentStyle: React.CSSProperties = pressed
    ? { background: "var(--accent)", borderColor: "var(--accent)", boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 45%, transparent)" }
    : {
        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
        color: "var(--accent)",
      };

  return (
    <button
      type="button"
      onPointerDown={handle}
      style={variant === "accent" ? accentStyle : undefined}
      className={`${base} ${variant === "accent" ? "border" : pressed ? active[variant] : idle[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{label}</span>
    </button>
  );
}

function StepControl({
  label,
  onMinus,
  onPlus,
}: {
  label: React.ReactNode;
  onMinus?: () => void;
  onPlus?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="text-center text-xs font-medium tracking-wider text-white/50">{label}</div>
      <div className="flex h-14 gap-2">
        <ImpulseButton label={<Minus className="mx-auto h-6 w-6" />} onClick={onMinus} className="flex flex-1 items-center justify-center !rounded-2xl !py-0" />
        <ImpulseButton label={<Plus className="mx-auto h-6 w-6" />} onClick={onPlus} className="flex flex-1 items-center justify-center !rounded-2xl !py-0" />
      </div>
    </div>
  );
}

function CycleControl({
  label,
  onPrev,
  onNext,
}: {
  label: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="text-center text-xs font-medium tracking-wider text-white/50">{label}</div>
      <div className="flex h-14 gap-2">
        <ImpulseButton label={<ChevronLeft className="mx-auto h-6 w-6" />} onClick={onPrev} className="flex flex-1 items-center justify-center !rounded-2xl !py-0" />
        <ImpulseButton label={<ChevronRight className="mx-auto h-6 w-6" />} onClick={onNext} className="flex flex-1 items-center justify-center !rounded-2xl !py-0" />
      </div>
    </div>
  );
}

/* ════════════ Cartes / en-têtes ════════════ */

function Card({ title, className = "", children }: { title?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md ${className}`}>
      {title && <h2 className="mb-6 text-sm font-medium tracking-wider text-white/60">{title}</h2>}
      {children}
    </section>
  );
}

/* ════════════ Composant principal ════════════ */

const NAV: { id: MfdId; label: string; icon: LucideIcon }[] = [
  { id: "energie", label: "Énergie", icon: Zap },
  { id: "bouclier", label: "Boucliers", icon: Shield },
  { id: "missiles", label: "Missiles", icon: Rocket },
  { id: "config", label: "Config", icon: Settings },
];

// Icônes des boutons persistants (ordre : Phares, Master Mode, Amplification lumineuse).
const PERSIST_ICONS: LucideIcon[] = [Lightbulb, PowerIcon, Eye];

const CONN_LABEL: Record<ConnState, string> = {
  disconnected: "Déconnecté",
  connecting: "Connexion…",
  connected: "Connecté",
  error: "Erreur",
};

/**
 * UI MFD « SCFM » — reproduction fidèle de la maquette Figma
 * (verre dépoli, dock bas flottant, commandes droite flottantes, halos en fond,
 * accent thématisable). Remplace l'ancienne ScfmMfd. Contenu issu de mfdLayout
 * (chaque bouton câblé sur un actionId réel de shared/actions.ts).
 */
export function CompanionMfd({
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
  const [address, setAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimer = useRef<number | null>(null);
  // Alternance interne (PAS d'affichage) pour les rares boutons à deux commandes on/off.
  const altRef = useRef<Record<string, boolean>>({});

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

  const send = useCallback(
    (actionId: string): boolean => {
      if (vibrate) void tapFeedback();
      const ok = sendCommand(actionId);
      console.log("command:", actionId, ok ? "→ ws (envoyé)" : "→ local (non connecté)");
      return ok;
    },
    [sendCommand, vibrate]
  );
  const feedback = (ok: boolean) => (ok ? "envoyé" : "non connecté");

  const onAction = useCallback(
    (actionId: string, label: string) => {
      const ok = send(actionId);
      notify(`${label} · ${feedback(ok)}`);
    },
    [send, notify]
  );
  const onToggle = useCallback(
    (actionId: string, actionIdOff: string | undefined, label: string) => {
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

  // Rendu générique d'un élément de layout en contrôle Figma.
  const renderEl = useCallback(
    (el: LayoutElement, key: string, variant: Variant = "default") => {
      if (el.kind === "toggle") {
        const label = el.label ?? labelFr(el.actionId);
        return <ImpulseButton key={key} label={label} variant={variant} onClick={() => onToggle(el.actionId, el.actionIdOff, label)} className="h-full min-h-[64px]" />;
      }
      if (el.kind === "stepper") {
        return <StepControl key={key} label={el.label} onMinus={() => onStep(el.incActionId, el.decActionId, -1, el.label)} onPlus={() => onStep(el.incActionId, el.decActionId, 1, el.label)} />;
      }
      const label = el.label ?? labelFr(el.actionId);
      return <ImpulseButton key={key} label={label} variant={variant} onClick={() => onAction(el.actionId, label)} className="min-h-[64px] py-4" />;
    },
    [onToggle, onStep, onAction]
  );

  const activeFilter = useMemo(() => CONFIG_FILTERS.find((f) => f.id === filter) ?? CONFIG_FILTERS[0], [filter]);

  // Énergie : alimentation + répartition (groupe « Trafic » non affiché — doublon avec
  // le bouton Atterrissage de la barre Système). Alim. générale et reset extraits de la donnée.
  const [alim, repart] = ENERGIE_GROUPS;
  const resetAct = repart.elements.find((e): e is ActionElement => e.kind === "action");
  const generaleId = alim.elements[0]?.kind === "toggle" ? alim.elements[0].actionId : "v_power_toggle";
  // Groupes Missiles (type / armés / bombes).
  const [mType, mArmes, mBombes] = MISSILES_GROUPS;
  const typeBack = mType.elements[0];
  const typeFwd = mType.elements[1];

  return (
    <div ref={zoneRef} className="relative h-full w-full overflow-hidden text-slate-100" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      {/* Fond glassmorphism : noir + halos flous (halo principal teinté accent). */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ background: "#030305" }}>
        <div className="absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full blur-[120px]" style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute right-[20%] top-[30%] h-[40%] w-[40%] rounded-full bg-teal-600/10 blur-[120px]" />
      </div>

      {/* Zone de contenu scrollable (réserve l'espace pour dock bas + commandes droite). */}
      <main className="no-scrollbar relative z-10 h-full overflow-y-auto px-5 pb-28 pt-4">
        {/* Barre de connexion (QR / mDNS / manuel) */}
        <div className="mb-6 flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <button type="button" onClick={onBack} title="Accueil" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white/70 hover:bg-white/10 hover:text-white">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <input
            type="text"
            inputMode="url"
            placeholder="ws://192.168.x.x:8420"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && connState !== "connected") connect(address); }}
            disabled={connState === "connected"}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
          />
          {connState === "connected" ? (
            <button type="button" onClick={disconnect} className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10">
              Déconnecter
            </button>
          ) : (
            <>
              <button type="button" onClick={onScan} disabled={scanning} title="Scanner le QR du bureau" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-50">
                <Camera className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => connect(address)} className="shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold" style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 28%, transparent)", color: "var(--accent)" }}>
                Connecter
              </button>
            </>
          )}
          <div className="flex shrink-0 items-center gap-2 px-2 text-xs uppercase tracking-wide text-white/50">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background:
                  connState === "connected" ? "#4cd964" : connState === "error" ? "#e0533d" : (discovering || connState === "connecting") ? "var(--accent)" : "rgba(255,255,255,0.3)",
                boxShadow: connState === "connected" ? "0 0 8px #4cd964" : "none",
              }}
            />
            {discovering && connState === "disconnected" ? "Recherche…" : connState === "error" ? connError ?? CONN_LABEL.error : CONN_LABEL[connState]}
          </div>
        </div>

        {/* Barre persistante (chaque écran) : Phares · Master Mode (milieu) · Amplification. */}
        <div className="mb-6 grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          {PERSISTENT_BUTTONS.map((b, i) => {
            const Icon = PERSIST_ICONS[i] ?? PowerIcon;
            return (
              <ImpulseButton
                key={b.actionId}
                variant={i === 1 ? "accent" : "default"}
                className="py-4"
                label={<span className="flex items-center justify-center gap-2"><Icon className="h-5 w-5" />{b.label}</span>}
                onClick={() => onAction(b.actionId, b.label)}
              />
            );
          })}
        </div>

        {/* ───── ÉNERGIE ───── */}
        {screen === "energie" && (
          <div>
            {/* Répartition : 3 systèmes (+/− avec alimentation dessous), puis alim. générale + reset. */}
            <Card title="Répartition de puissance" className="max-w-5xl">
              <div className="grid grid-cols-3 gap-5">
                {ENERGIE_SYSTEMS.map((sys) => (
                  <div key={sys.key} className="flex flex-col gap-3">
                    <StepControl
                      label={sys.label}
                      onMinus={() => onStep(sys.incActionId, sys.decActionId, -1, sys.label)}
                      onPlus={() => onStep(sys.incActionId, sys.decActionId, 1, sys.label)}
                    />
                    <ImpulseButton
                      className="py-4"
                      label={<span className="flex items-center justify-center gap-2"><PowerIcon className="h-5 w-5" />{labelFr(sys.powerToggleId)}</span>}
                      onClick={() => onToggle(sys.powerToggleId, undefined, labelFr(sys.powerToggleId))}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5">
                <ImpulseButton
                  className="py-4"
                  label={<span className="flex items-center justify-center gap-2"><Zap className="h-5 w-5" />{labelFr(generaleId)}</span>}
                  onClick={() => onToggle(generaleId, undefined, labelFr(generaleId))}
                />
                {resetAct && (
                  <ImpulseButton
                    className="py-4"
                    label={<span className="flex items-center justify-center gap-2"><RefreshCw className="h-5 w-5" />{resetAct.label ?? labelFr(resetAct.actionId)}</span>}
                    onClick={() => onAction(resetAct.actionId, resetAct.label ?? labelFr(resetAct.actionId))}
                  />
                )}
              </div>
            </Card>

            {/* Atterrissage & amarrage — déplacés sous la répartition. */}
            <Card title="Atterrissage & amarrage" className="mt-6 max-w-5xl">
              <div className="grid grid-cols-2 gap-5">
                {LANDING_DOCKING.map((b, i) => {
                  const Icon = i === 0 ? ArrowDownToLine : Anchor;
                  return (
                    <ImpulseButton
                      key={b.actionId}
                      className="py-4"
                      label={<span className="flex items-center justify-center gap-2"><Icon className="h-5 w-5" />{b.label}</span>}
                      onClick={() => onAction(b.actionId, b.label)}
                    />
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ───── BOUCLIERS ───── */}
        {screen === "bouclier" && (
          <div className="grid max-w-6xl grid-cols-2 gap-6">
            {/* Renforcement directionnel (gauche) */}
            <Card title="Renforcement Directionnel">
              <div className="relative flex items-center justify-center py-4">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
                  <Navigation className="h-64 w-64 text-white" />
                </div>
                <div className="relative z-10 grid w-full max-w-md grid-cols-3 grid-rows-3 gap-4">
                  {SHIELD_FACES.map((f) => {
                    const pos =
                      f.dir === "avant" ? "col-start-2 row-start-1" : f.dir === "babord" ? "col-start-1 row-start-2" : f.dir === "tribord" ? "col-start-3 row-start-2" : "col-start-2 row-start-3";
                    return (
                      <div key={f.actionId} className={pos}>
                        <ImpulseButton label={f.label} onClick={() => onAction(f.actionId, `Bouclier ${f.label}`)} className="h-20 w-full" />
                      </div>
                    );
                  })}
                  <div className="col-start-2 row-start-2 flex items-center justify-center">
                    <ImpulseButton label={<RefreshCw className="h-6 w-6 text-white/60" />} onClick={() => onAction(SHIELD_RESET_ACTION, "Réinitialiser boucliers")} className="flex h-20 w-20 items-center justify-center !rounded-full !p-0" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Contre-mesures (droite) */}
            <Card title="Contre-mesures" className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium tracking-wider text-white/40">Leurres (Flares)</div>
                  <ImpulseButton
                    variant="accent"
                    className="py-7"
                    label={<span className="flex items-center justify-center gap-2"><Flame className="h-5 w-5" />Lancer</span>}
                    onClick={() => onAction(SHIELD_COUNTERMEASURES.decoyLaunch, "Leurres")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium tracking-wider text-white/40">Brouillage (Chaff)</div>
                  <ImpulseButton
                    className="py-7"
                    label={<span className="flex items-center justify-center gap-2"><Radio className="h-5 w-5" />Lancer</span>}
                    onClick={() => onAction(SHIELD_COUNTERMEASURES.noiseLaunch, "Brouillage")}
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <StepControl
                  label="Rafale de leurres (Quantité)"
                  onMinus={() => onStep(SHIELD_COUNTERMEASURES.burstIncId, SHIELD_COUNTERMEASURES.burstDecId, -1, "Rafale de leurres")}
                  onPlus={() => onStep(SHIELD_COUNTERMEASURES.burstIncId, SHIELD_COUNTERMEASURES.burstDecId, 1, "Rafale de leurres")}
                />
              </div>

              <ImpulseButton
                variant="danger"
                className="w-full py-5"
                label={<span className="flex items-center justify-center gap-2"><AlertTriangle className="h-5 w-5" /><span className="font-semibold tracking-wide">TIR DE CATASTROPHE</span></span>}
                onClick={() => onAction(SHIELD_COUNTERMEASURES.panicId, "Tir de catastrophe")}
              />
            </Card>
          </div>
        )}

        {/* ───── MISSILES ───── */}
        {screen === "missiles" && (
          <div>
            <div className="grid max-w-6xl grid-cols-2 gap-6">
              <Card title={mType.label} className="relative overflow-hidden">
                <div className="pointer-events-none absolute -bottom-10 -right-10 rotate-45 opacity-5">
                  <Rocket className="h-64 w-64 text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-8">
                  <CycleControl
                    label="Type de missile"
                    onPrev={() => typeBack.kind === "action" && onAction(typeBack.actionId, "Type précédent")}
                    onNext={() => typeFwd.kind === "action" && onAction(typeFwd.actionId, "Type suivant")}
                  />
                  <div className="flex flex-col gap-5">
                    {mArmes.elements.map((el, i) => renderEl(el, `arm-${i}`))}
                  </div>
                </div>
              </Card>
              <Card title={mBombes.label} className="relative overflow-hidden">
                <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-5">
                  <Bomb className="h-64 w-64 text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-5">
                  {mBombes.elements.map((el, i) => {
                    if (el.kind === "action" && el.actionId === "v_weapon_bombing_toggle_desired_impact_point") {
                      return <ImpulseButton key={`bo-${i}`} label={<span className="flex items-center gap-3"><Target className="h-6 w-6" />{el.label ?? labelFr(el.actionId)}</span>} onClick={() => onAction(el.actionId, el.label ?? labelFr(el.actionId))} className="py-6" />;
                    }
                    return renderEl(el, `bo-${i}`);
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ───── CONFIGURATION ───── */}
        {screen === "config" && (
          <div className="max-w-6xl">
            <Card className="!p-0">
              <div className="flex border-b border-white/10">
                {CONFIG_FILTERS.map((f) => {
                  const FIcon = f.id === "vol" ? Plane : f.id === "armes" ? Crosshair : Monitor;
                  const on = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`flex flex-1 items-center justify-center gap-3 border-b-2 py-4 text-sm font-semibold tracking-wide transition-colors ${on ? "border-white text-white" : "border-transparent text-white/50 hover:bg-white/5"}`}
                    >
                      <FIcon className="h-5 w-5" /> {f.label}
                    </button>
                  );
                })}
              </div>
              <div className="p-6">
                {activeFilter.groups.map((g, gi) => (
                  <div key={`cfg-${gi}`} className={gi > 0 ? "mt-6" : ""}>
                    {g.label && <div className="mb-3 text-xs font-medium tracking-wider text-white/40">{g.label}</div>}
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(g.columns, 3)}, minmax(0,1fr))` }}>
                      {g.elements.map((el, i) => renderEl(el, `cfg-${gi}-${i}`, filter === "armes" ? "danger" : "default"))}
                    </div>
                    {g.note && <p className="mt-3 text-xs italic text-white/30">{g.note}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Dock de navigation flottant (bas) */}
      <nav className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-2.5 shadow-2xl backdrop-blur-2xl">
        {NAV.map((n) => {
          const on = screen === n.id;
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setScreen(n.id)}
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-all ${on ? "bg-white/15 text-white shadow-inner" : "text-white/40 hover:bg-white/10 hover:text-white/80"}`}
            >
              <Icon className="mb-1 h-6 w-6" strokeWidth={on ? 2.5 : 2} />
              <span className="text-[9px] font-medium tracking-wide opacity-80">{n.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Toast (retour d'appui neutre) */}
      <div
        className={`pointer-events-none absolute bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-all duration-200 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        {toast.msg}
      </div>
    </div>
  );
}
