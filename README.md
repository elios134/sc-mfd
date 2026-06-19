# sc-mfd

Application companion **MFD** (Multi-Function Display) pour **Star Citizen**.
Deux distributions d'un même produit, organisées en monorepo (npm workspaces).

> État actuel : **ossature uniquement**. Aucune logique métier, aucun MFD,
> aucune émulation de touches. Le but est d'avoir une base qui compile et tourne à vide.

## Packages

| Package          | Rôle |
|------------------|------|
| `@sc-mfd/shared`  | Code commun en **TS pur** : mapping touches, protocole, types. Importé par `desktop` et `tablet`. Vide pour l'instant (placeholder `VERSION`). |
| `@sc-mfd/desktop` | **Pont** côté PC : **Tauri 2 + React + TS + Vite + Tailwind**. À terme : serveur WebSocket + émulation des touches (input synthétique vers le jeu). |
| `@sc-mfd/tablet`  | **MFD tactiles** : **React + TS + Vite + Tailwind + Capacitor**. App web (et future app mobile) qui affiche les MFD et envoie les actions au desktop via WS. |

## Stack (alignée sur SC Fleet Manager V2)

- React 19, TypeScript 5.8, Vite 7
- Tailwind **v4** (plugin `@tailwindcss/vite`, pas de `tailwind.config.js` ni `postcss.config.js`)
- Desktop : Tauri 2 (Rust)
- Tablet : Capacitor 8

## Démarrage

```bash
npm install            # à la racine : installe et lie les workspaces

# Desktop (fenêtre Tauri)
npm run dev -w @sc-mfd/desktop      # frontend web seul (http://localhost:1420)
npm run tauri -w @sc-mfd/desktop dev # app desktop complète (Rust + webview)

# Tablet (web)
npm run dev -w @sc-mfd/tablet        # http://localhost:1430
```

## Résolution du lien `@sc-mfd/shared`

`shared` n'a **pas d'étape de build** : son `package.json` expose directement
la source TS (`"exports": "./index.ts"`). npm workspaces crée un symlink
`node_modules/@sc-mfd/shared` → `packages/shared`, que Vite suit jusqu'à la
source réelle (hors `node_modules`) et transpile normalement. Pour Capacitor,
aucune config spéciale : le `webDir` (`dist`) est le bundle Vite, dans lequel
`shared` est déjà inliné.
