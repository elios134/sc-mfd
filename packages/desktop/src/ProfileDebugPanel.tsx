// Modale « Mapping dynamique » (DA V2, full Tailwind) : affiche le mapping lu
// (action → touche réelle du joueur) transmis à l'émulation, et permet de
// PERSONNALISER la touche de chaque action (chantier C4), avec avertissement si la
// touche choisie est déjà utilisée ailleurs dans le profil Star Citizen.

import { useEffect, useMemo, useState } from "react";
import { ACTIONS } from "@sc-mfd/shared";
import type { ProfileReadResult, ResolvedBind, KeyIndex } from "./profileReader";
import { formatKey, comboKey } from "./profileReader";
import type { KeyOverride } from "./keyOverrides";
import { codeToScKey, MODIFIER_CHOICES, modifierLabel } from "./keyCapture";

const sourceClass: Record<ResolvedBind["source"], string> = {
  perso: "text-violet-300",
  joueur: "text-emerald-300",
  défaut: "text-sky-300",
  "à assigner": "text-amber-300",
};

const ACTION_LABEL = new Map(ACTIONS.map((a) => [a.id, a.labelFr]));
/** Libellé lisible d'une action (la nôtre) sinon son id technique SC brut. */
function actionLabel(id: string): string {
  return ACTION_LABEL.get(id) ?? id;
}

/** Aperçu lisible d'une combinaison en cours d'édition. */
function previewCombo(key: string | null, modifiers: string[]): string {
  if (!key) return "—";
  const pretty = (m: string) => modifierLabel(m);
  return [...modifiers.map(pretty), key.toUpperCase()].join(" + ");
}

/** Conflits trouvés pour une combinaison : actions qui l'utilisent déjà. */
interface Conflict {
  label: string;
  kind: "mfd" | "jeu";
}

function findConflicts(
  key: string | null,
  modifiers: string[],
  selfId: string,
  keyIndex: KeyIndex,
  binds: ResolvedBind[]
): Conflict[] {
  if (!key) return [];
  const ck = comboKey(key, modifiers);
  const byAction = new Map<string, Conflict>();

  // Conflit avec une autre action MFD (override / défaut déjà sur cette touche).
  for (const b of binds) {
    if (b.id === selfId || !b.key) continue;
    if (comboKey(b.key, b.modifiers) === ck) {
      byAction.set(b.id, { label: b.labelFr, kind: "mfd" });
    }
  }
  // Conflit avec le profil Star Citizen du joueur (touche déjà prise par le jeu).
  for (const u of keyIndex[ck] ?? []) {
    if (u.action === selfId) continue;
    if (!byAction.has(u.action)) {
      byAction.set(u.action, { label: actionLabel(u.action), kind: "jeu" });
    }
  }
  return [...byAction.values()];
}

/** Éditeur d'une touche : capture clavier + modificateurs + avertissement conflit. */
function KeyEditor({
  bind,
  keyIndex,
  binds,
  onSave,
  onReset,
  onCancel,
}: {
  bind: ResolvedBind;
  keyIndex: KeyIndex;
  binds: ResolvedBind[];
  onSave: (override: KeyOverride) => void;
  onReset: () => void;
  onCancel: () => void;
}) {
  const [key, setKey] = useState<string | null>(bind.key);
  const [modifiers, setModifiers] = useState<string[]>(bind.modifiers);
  const [capturing, setCapturing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Capture clavier : un seul keydown, on ignore les modificateurs seuls.
  useEffect(() => {
    if (!capturing) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setCapturing(false);
        return;
      }
      const sc = codeToScKey(e.code);
      if (sc) {
        setKey(sc);
        setConfirming(false);
        setCapturing(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [capturing]);

  const conflicts = useMemo(
    () => findConflicts(key, modifiers, bind.id, keyIndex, binds),
    [key, modifiers, bind.id, keyIndex, binds]
  );

  const toggleMod = (m: string) => {
    setConfirming(false);
    setModifiers((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const validate = () => {
    if (!key) return;
    if (conflicts.length > 0 && !confirming) {
      setConfirming(true); // 1er clic = avertissement ; 2e clic = on force
      return;
    }
    onSave({ key, modifiers, activation: bind.activation });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 p-5 shadow-2xl"
        style={{ background: "rgba(24,24,32,0.98)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-semibold text-white">Personnaliser la touche</h3>
          <p className="mt-0.5 text-xs text-white/50">{bind.labelFr}</p>
        </div>

        {/* Aperçu + capture */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCapturing(true)}
            className={`flex-1 rounded-xl border px-4 py-3 text-center font-mono text-lg font-bold transition-colors ${
              capturing
                ? "border-violet-400/60 bg-violet-500/15 text-violet-200"
                : "border-white/15 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {capturing ? "Appuyez sur une touche…" : previewCombo(key, modifiers)}
          </button>
        </div>
        <p className="-mt-2 text-[11px] text-white/40">
          Cliquez la zone puis pressez la touche. Les modificateurs gauche/droite se
          choisissent ci-dessous (Star Citizen les distingue).
        </p>

        {/* Modificateurs */}
        <div className="flex flex-wrap gap-1.5">
          {MODIFIER_CHOICES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMod(m)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                modifiers.includes(m)
                  ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {modifierLabel(m)}
            </button>
          ))}
        </div>

        {/* Avertissement de conflit */}
        {conflicts.length > 0 && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            <p className="font-semibold">⚠ Cette touche est déjà utilisée :</p>
            <ul className="mt-1 list-inside list-disc">
              {conflicts.map((c) => (
                <li key={c.label}>
                  {c.label}{" "}
                  <span className="text-amber-300/70">
                    ({c.kind === "mfd" ? "autre bouton MFD" : "profil Star Citizen"})
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-amber-300/80">
              L'utiliser quand même déclenchera aussi {conflicts.length > 1 ? "ces actions" : "cette action"} en jeu.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={validate}
            disabled={!key}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              confirming
                ? "bg-amber-500/90 text-black hover:bg-amber-400"
                : "bg-violet-500/90 text-white hover:bg-violet-400"
            }`}
          >
            {confirming ? "Utiliser quand même" : "Valider"}
          </button>
          <button
            type="button"
            onClick={() => onSave({ key: null, modifiers: [], activation: bind.activation })}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
            title="Retirer la touche (action vidée)"
          >
            Vider
          </button>
          {bind.source === "perso" && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
              title="Revenir à la touche du profil / défaut"
            >
              Réinitialiser
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-xl px-3 py-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileDebugPanel({
  result,
  onClose,
  onRefresh,
  onSaveOverride,
  onResetOverride,
}: {
  result: ProfileReadResult | null;
  onClose: () => void;
  onRefresh: () => void;
  onSaveOverride: (actionId: string, override: KeyOverride) => void;
  onResetOverride: (actionId: string) => void;
}) {
  const [editing, setEditing] = useState<ResolvedBind | null>(null);

  const counts = result
    ? {
        perso: result.binds.filter((b) => b.source === "perso").length,
        joueur: result.binds.filter((b) => b.source === "joueur").length,
        défaut: result.binds.filter((b) => b.source === "défaut").length,
        àAssigner: result.binds.filter((b) => b.source === "à assigner").length,
      }
    : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "rgba(20,20,28,0.96)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">Mapping dynamique</h2>
            <p className="mt-0.5 text-xs text-white/50">
              Touches réelles lues dans votre profil Star Citizen — personnalisables (bouton « Modifier »)
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            title="Relire les fichiers SC et retransmettre à l'émulation"
            className="ml-auto shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            ↻ Recharger
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Corps */}
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {result == null || counts == null ? (
            <div className="text-sm text-white/60">Lecture du profil en cours…</div>
          ) : (
            <>
              {/* Résumé */}
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  Joueur {result.playerFound ? "✅" : "❌"}{" "}
                  <code className="text-white/40">{result.playerPath ?? "—"}</code>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  Défaut {result.defaultFound ? "✅" : "❌"}{" "}
                  <code className="text-white/40">{result.defaultPath ?? "—"}</code>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
                  <span className="font-semibold text-white/90">{result.binds.length}</span> actions ·{" "}
                  <span className="text-violet-300">{counts.perso} perso</span> ·{" "}
                  <span className="text-emerald-300">{counts.joueur} joueur</span> ·{" "}
                  <span className="text-sky-300">{counts.défaut} défaut</span> ·{" "}
                  <span className="text-amber-300">{counts.àAssigner} à assigner</span>
                </span>
              </div>

              {result.warnings.length > 0 && (
                <ul className="mb-4 list-inside list-disc rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left text-white/50">
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Action</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">action name</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Touche réelle</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Activation</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Source</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold">Notes</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.binds.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 last:border-0">
                        <td className="px-3 py-1.5 text-white/85">{b.labelFr}</td>
                        <td className="px-3 py-1.5 font-mono text-white/50">{b.id}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-white">{formatKey(b)}</td>
                        <td className="px-3 py-1.5 text-white/70">
                          {b.activation === "long" ? "⏱ long" : b.activation}
                        </td>
                        <td className={`px-3 py-1.5 ${sourceClass[b.source]}`}>{b.source}</td>
                        <td className="px-3 py-1.5 text-amber-300">
                          {b.notes.length ? b.notes.join(" · ") : ""}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => setEditing(b)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/75 transition-colors hover:bg-white/10"
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {editing && result && (
        <KeyEditor
          bind={editing}
          keyIndex={result.keyIndex}
          binds={result.binds}
          onSave={(ov) => {
            onSaveOverride(editing.id, ov);
            setEditing(null);
          }}
          onReset={() => {
            onResetOverride(editing.id);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
