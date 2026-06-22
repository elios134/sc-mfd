import { MANUFACTURER_THEMES } from "@sc-mfd/shared";

// Grille de sélection de thème constructeur (6 thèmes depuis shared).
// Réutilisée pour le thème système (Paramètres) et le thème de loadout (Accueil).
export function ThemeSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {MANUFACTURER_THEMES.map((t) => {
        const on = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={[
              "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
              on ? "bg-white/5" : "border-white/10 bg-white/[0.03] hover:bg-white/5",
            ].join(" ")}
            style={on ? { borderColor: t.accent } : undefined}
          >
            <span className="h-6 w-6 rounded-full" style={{ background: t.accent }} />
            <span className="text-[11px] font-bold tracking-wide text-white/90">{t.name}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/40">{t.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}
