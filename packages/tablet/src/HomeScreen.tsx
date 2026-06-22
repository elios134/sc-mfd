import { useState } from "react";
import { getThemeById } from "@sc-mfd/shared";
import type { Loadout } from "./loadoutTypes";
import { ThemeSelector } from "./ThemeSelector";
import { loadLoadoutThemeId } from "./themeStorage";

type HomeScreenProps = {
  loadouts: Loadout[];
  selectedId: string;
  onSelectLoadout: (id: string) => void;
  /** Thème (id) du loadout sélectionné — piloté par le popup Thème. */
  loadoutThemeId: string;
  onChangeTheme: (themeId: string) => void;
  canEnter: boolean;
  onEnter: () => void;
  onOpenSettings: () => void;
};

// Miniature « préaffichage » de l'UI du loadout, teintée par son accent.
function LoadoutPreview({ kind, accent }: { kind?: "scfm" | "glass"; accent: string }) {
  if (kind === "glass") {
    return (
      <div
        className="flex h-full gap-1.5 rounded-lg p-2"
        style={{ background: "linear-gradient(160deg,#101015,#0a0a0f)" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center justify-between rounded-md border border-white/10 bg-white/[0.04] py-2"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
            <span className="h-1.5 w-5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: accent }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      className="flex h-full flex-col gap-1.5 rounded-lg p-2"
      style={{ background: "linear-gradient(180deg,#0e1115,#0a0a0f)" }}
    >
      <span className="h-1.5 w-2/5 rounded-full" style={{ background: accent }} />
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="rounded-md border bg-white/[0.03]"
            style={{ borderColor: `color-mix(in srgb, ${accent} 32%, transparent)` }}
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-2 flex-1 rounded-sm"
            style={{ background: i === 0 ? accent : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Écran d'accueil = point d'entrée après le lancement.
 * Choix du loadout (cartes + préaffichage) + thème par carte, puis « Entrer ».
 * Rendu dans le conteneur .tablet → thème système (zone B). Full Tailwind.
 */
export function HomeScreen({
  loadouts,
  selectedId,
  onSelectLoadout,
  loadoutThemeId,
  onChangeTheme,
  canEnter,
  onEnter,
  onOpenSettings,
}: HomeScreenProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const selected = loadouts.find((l) => l.id === selectedId);

  // Ouvre le popup thème pour un loadout : le sélectionne d'abord (le thème
  // s'applique toujours au loadout actif), puis affiche le sélecteur.
  const openTheme = (lo: Loadout) => {
    if (!lo.available) return;
    if (lo.id !== selectedId) onSelectLoadout(lo.id);
    setThemeOpen(true);
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-7 py-8">
      <div className="flex w-full justify-end">
        <button
          type="button"
          title="Paramètres"
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:bg-white/10"
        >
          ⚙
        </button>
      </div>

      <img
        src="/logo.png"
        alt="SC MFD"
        className="mt-1 h-24 w-24 object-contain"
        style={{ filter: "drop-shadow(0 8px 28px var(--gold-glow))" }}
      />
      <div className="mt-3 text-2xl font-bold tracking-[0.3em] text-white">
        SC <span style={{ color: "var(--accent)" }}>MFD</span>
      </div>

      <div className="mb-3 mt-8 self-start text-[11px] uppercase tracking-[0.22em] text-white/40">
        Choisir un loadout
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {loadouts.map((lo) => {
          const isOn = lo.id === selectedId;
          const th = getThemeById(isOn ? loadoutThemeId : loadLoadoutThemeId(lo.id));
          return (
            <div
              key={lo.id}
              className={[
                "flex flex-col overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors",
                isOn ? "" : "border-white/10",
                lo.available ? "" : "opacity-50",
              ].join(" ")}
              style={isOn ? { borderColor: th.accent } : undefined}
            >
              <button
                type="button"
                disabled={!lo.available}
                onClick={() => lo.available && onSelectLoadout(lo.id)}
                className="relative block aspect-[16/10] w-full p-2.5"
              >
                <LoadoutPreview kind={lo.preview} accent={th.accent} />
                {isOn && (
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0a0a0f]"
                    style={{ background: th.accent }}
                  >
                    ● Actif
                  </span>
                )}
                {!lo.available && (
                  <span className="absolute right-3 top-3 rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/50">
                    Bientôt
                  </span>
                )}
              </button>

              <div className="flex items-center justify-between gap-3 border-t border-white/5 px-3.5 py-3">
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-white">{lo.name}</div>
                  <div className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-white/40">
                    {lo.description}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!lo.available}
                  onClick={() => openTheme(lo)}
                  title="Thème de cette UI"
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/20"
                    style={{ background: th.accent }}
                  />
                  {th.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto w-full pt-6">
        <button
          type="button"
          disabled={!canEnter}
          onClick={onEnter}
          className="w-full rounded-2xl px-4 py-4 text-base font-bold uppercase tracking-[0.15em] text-[#0a0a0f] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--accent)", boxShadow: "0 8px 24px var(--gold-glow)" }}
        >
          Entrer
        </button>
      </div>

      {themeOpen && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setThemeOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-t-2xl border-t border-white/10 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
            style={{ background: "rgba(20,20,28,0.96)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold text-white">
              Thème des MFD · <span style={{ color: "var(--accent)" }}>{selected?.name ?? ""}</span>
            </div>
            <div className="mb-4 mt-0.5 text-xs text-white/50">S'applique à l'UI MFD de ce loadout</div>
            <ThemeSelector value={loadoutThemeId} onSelect={onChangeTheme} />
            <button
              type="button"
              onClick={() => setThemeOpen(false)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
