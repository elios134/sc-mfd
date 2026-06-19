// Génère src-tauri/src/keymap.rs À PARTIR de @sc-mfd/shared (source unique).
//
// Pourquoi : le Rust ne peut pas importer le TS de shared. Plutôt que de
// maintenir une table à la main (risque de divergence), on la GÉNÈRE depuis
// shared/actions.ts. esbuild (déjà présent via vite) résout/bundle le TS, on
// importe ACTIONS, et on émet le match Rust. Idempotent : à relancer après toute
// modif de shared.
//
// Lancer : npm run gen:keymap -w @sc-mfd/desktop

import { build } from "esbuild";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const sharedEntry = join(here, "..", "..", "shared", "index.ts");
const outRust = join(here, "..", "src-tauri", "src", "keymap.rs");

// Bundle shared (TS) -> ESM temporaire, puis import dynamique.
const tmp = join(mkdtempSync(join(tmpdir(), "scmfd-keymap-")), "shared.mjs");
await build({
  entryPoints: [sharedEntry],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "warning",
});
const { ACTIONS } = await import(pathToFileURL(tmp).href);

const s = (v) => JSON.stringify(v); // nos id/clés/modifs sont de l'ASCII simple

const arms = ACTIONS.map((a) => {
  const assigned = a.bind != null;
  const key = assigned ? a.bind.key : "";
  const mods = assigned ? a.bind.modifiers : [];
  const modsRust = mods.length ? `&[${mods.map(s).join(", ")}]` : "&[]";
  // `activation` reflète l'attribut activationMode du jeu ("press"|"long"|"hold").
  // Défaut défensif "press" si une action ancienne ne le porte pas encore.
  const activation = a.activation ?? "press";
  return `        ${s(a.id)} => Some(Bind { key: ${s(key)}, modifiers: ${modsRust}, assigned: ${assigned}, activation: ${s(activation)} }),`;
}).join("\n");

const out = `// @generated par scripts/gen-keymap.mjs — NE PAS ÉDITER À LA MAIN.
// Source unique : packages/shared/actions.ts.
// Régénérer après toute modif de shared : npm run gen:keymap -w @sc-mfd/desktop
//
// Miroir Rust des binds de @sc-mfd/shared (le Rust ne peut pas importer le TS).

/// Liaison touche d'une action (miroir de KeyBind de shared).
#[derive(Debug, Clone, Copy)]
pub struct Bind {
    /// Touche principale en minuscule ("u", "f6", ...). Vide si non assignée.
    pub key: &'static str,
    /// Modificateurs ("lalt", "ralt", "lshift", "rshift", "lctrl", "rctrl").
    pub modifiers: &'static [&'static str],
    /// false = action "to_assign" (bind null de shared) : ne rien émuler.
    pub assigned: bool,
    /// Mode d'activation ("press" | "long" | "hold"). L'émulation de l'appui
    /// long (chantier B) s'appuie dessus ; un simple tap ne suffit pas pour "long".
    #[allow(dead_code)] // lu par l'émulation (chantier B), pas encore consommé.
    pub activation: &'static str,
}

/// Résout un actionId en Bind. None si l'actionId est inconnu de shared.
pub fn bind_for(action_id: &str) -> Option<Bind> {
    match action_id {
${arms}
        _ => None,
    }
}
`;

writeFileSync(outRust, out);
console.log(`keymap.rs généré : ${ACTIONS.length} actions -> ${outRust}`);
