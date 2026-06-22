// Barre de navigation flottante reprise de SC Fleet Manager V2 (Layout.tsx) :
// pilule arrondie centrée en bas, boutons « pleins » à l'accent quand actifs,
// fond glass + flou. Ici 2 destinations : Tableau de bord et Paramètres.
export type DesktopView = "dashboard" | "settings";

function HomeIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function NavButton({
  active,
  onClick,
  title,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={[
        "flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--accent)] text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function BottomNav({
  view,
  onNavigate,
}: {
  view: DesktopView;
  onNavigate: (v: DesktopView) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center">
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-[26px] border border-white/10 p-1.5 backdrop-blur-2xl"
        style={{ background: "rgba(18,18,26,0.82)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
      >
        <NavButton
          active={view === "dashboard"}
          onClick={() => onNavigate("dashboard")}
          title="Tableau de bord"
          icon={<HomeIcon />}
          label="Tableau de bord"
        />
        <NavButton
          active={view === "settings"}
          onClick={() => onNavigate("settings")}
          title="Paramètres"
          icon={<GearIcon />}
          label="Paramètres"
        />
      </div>
    </div>
  );
}
