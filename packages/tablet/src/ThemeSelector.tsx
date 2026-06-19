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
    <div className="themes">
      {MANUFACTURER_THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`th${value === t.id ? " on" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <span className="c" style={{ background: t.accent }} />
          <span className="n">{t.name}</span>
          <span className="sub">{t.subtitle}</span>
        </button>
      ))}
    </div>
  );
}
