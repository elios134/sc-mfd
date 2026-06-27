# SC MFD

**Application companion pour Star Citizen.** Une tablette (ou un téléphone) Android
devient un **panneau de boutons tactiles** (MFD — *Multi-Function Display*) qui pilote
le jeu : chaque bouton envoie une **touche clavier** au PC, par le réseau local.

## ⚠️ Ce que l'app fait — et ne fait pas

SC MFD est une **télécommande**, pas un tableau de bord.

- ✅ Elle **envoie** des commandes au jeu (émulation de touches : alimentation,
  boucliers, missiles, etc.).
- ❌ Elle **ne lit pas** l'état du vaisseau. Star Citizen n'expose pas ces données :
  il n'y a donc **aucun affichage en temps réel** des boucliers, munitions, niveaux…
  Les boutons sont de simples déclencheurs (un bref *flash* confirme l'appui).

## Architecture

Deux parties, dans un **monorepo** (npm workspaces) :

| Partie | Package | Rôle |
|---|---|---|
| **Le pont** | `@sc-mfd/desktop` | App de bureau Windows (Tauri 2 + React). Serveur réseau local (WebSocket) + émulation des touches dans le jeu. |
| **La tablette** | `@sc-mfd/tablet` | App Android (React + Capacitor). Affiche les écrans MFD et envoie les actions au pont. |
| Code commun | `@sc-mfd/shared` | TypeScript pur : liste des actions, mapping des touches, protocole. Importé par les deux. |

Le pont tourne sur le **PC où s'exécute Star Citizen** ; la tablette est sur le **même
réseau Wi-Fi**.

---

# Pour les utilisateurs

## 1. Installer le pont (PC)

Installez et lancez l'**app de bureau** sur le PC qui fait tourner Star Citizen.

> ℹ️ Le projet ne fournit pas (encore) de binaire prêt à l'emploi : l'installeur se
> construit depuis le code — voir [Construire le pont](#construire-le-pont-installeur).

Au lancement, le pont :
- démarre un serveur local (port **8420**) ;
- détecte automatiquement votre installation de Star Citizen ;
- **dépose un profil de touches** nommé **« SC MFD »** dans le jeu (régénéré à chaque
  démarrage). Il **ne modifie jamais** votre profil de touches personnel.

## 2. Sélectionner le profil « SC MFD » dans le jeu (une fois)

Pour que les touches envoyées correspondent aux bonnes actions, sélectionnez le profil
**une seule fois** dans Star Citizen :

> **Options → Keybindings → Advanced Controls Customization → Control Profiles →
> choisir « SC MFD »**

Détails (vérifiés dans le code) :
- Le profil est écrit dans :
  `<dossier d'installation SC>\user\client\0\Controls\Mappings\SCMFD.xml`
- Il doit être présent **avant** de lancer Star Citizen pour apparaître dans la liste.
  S'il manque, relancez le jeu une fois (le pont le redépose à chaque démarrage).

### Personnaliser vos touches (optionnel)

Le pont lit automatiquement les **vraies touches** de votre profil Star Citizen.
Si vous voulez **changer la touche** d'une action MFD, ouvrez sur le pont
**Paramètres → Mapping dynamique**, puis **« Modifier »** sur la ligne voulue :

- pressez la nouvelle touche et cochez les modificateurs (Star Citizen distingue
  Alt gauche/droite, etc.) ;
- si la touche choisie est **déjà utilisée** (par un autre bouton MFD ou par votre
  profil Star Citizen), un **avertissement** s'affiche avant validation ;
- **Vider** désactive l'action ; **Réinitialiser** revient à la touche du jeu.

Vos choix sont mémorisés sur le pont et réinjectés dans `SCMFD.xml` à chaque
démarrage (votre profil de touches personnel n'est jamais modifié).

## 3. Installer l'app tablette (Android)

Installez l'**APK** sur la tablette (voir [Construire l'APK](#construire-lapk-android)
pour le générer).

## 4. Connecter la tablette au pont

La tablette et le PC doivent être sur le **même réseau Wi-Fi**. Trois méthodes :

1. **Découverte automatique (mDNS)** — au démarrage, la tablette trouve le pont toute
   seule et se connecte (rien à faire).
2. **Scan du QR code** affiché par le pont.
3. **Saisie manuelle** de l'adresse : `ws://<IP-du-PC>:8420`.

> 🔥 Si la connexion échoue, autorisez le **port 8420** (et l'app de bureau) dans le
> pare-feu Windows.

## 5. Les écrans

Deux interfaces (« loadouts ») au choix, même contenu, styles différents :
**SCFM** et **SC UI**. Chacune propose **4 écrans** :

- **Énergie** — répartition de puissance (armes / boucliers / moteurs), alimentation
  des systèmes ; **Atterrissage** et **Amarrage** s'y trouvent aussi.
- **Boucliers** — renforcement directionnel (avant / arrière / bâbord / tribord +
  reset) et contre-mesures (leurres, brouillage, tir de catastrophe).
- **Configuration** — réglages de vol et d'armement (onglets).
- **Missiles** — type, nombre armé, bombes (gestion seule, **le tir reste au
  joystick/souris**).

**Boutons toujours visibles** (sur chaque écran) : **Phares**, **Master Mode**,
**Amplification lumineuse**.

## 6. Réglages tablette

- **Thèmes** : plusieurs couleurs d'accent (dont **RSI**), bleu par défaut.
- **Garder l'écran allumé** pendant l'utilisation.
- **Vibration** au toucher des boutons.

---

# Pour les développeurs

Monorepo **npm workspaces**. Toutes les commandes se lancent depuis la **racine** sauf
indication contraire.

## Prérequis

- **Node.js 20.19+** (ou 22.12+) — requis par Vite 7. *(Non épinglé dans le repo.)*
- **Pont (desktop)** : chaîne **Rust** (via [rustup](https://rustup.rs)) pour Tauri 2.
  Sous Windows : **WebView2** (préinstallé sur Windows 11) et les **Microsoft C++ Build
  Tools** (MSVC). *(Prérequis standards de Tauri 2, non spécifiques au repo.)*
- **APK (tablette)** : **Android SDK** (compileSdk **36**, minSdk **24**) et **JDK 21**
  — le **JBR** fourni avec Android Studio convient. *(Le JDK 21 est requis par le build
  Android ; non épinglé dans le repo, à fournir via `JAVA_HOME`.)*

## Installation des dépendances

```bash
npm install        # à la racine : installe et lie les 3 workspaces
```

> `@sc-mfd/shared` n'a **pas d'étape de build** : son `package.json` expose directement
> la source TS. npm crée un symlink que Vite suit et transpile ; pour Capacitor, le
> bundle Vite (`dist`) inline déjà `shared`.

## Lancer le pont (desktop) en dev

```bash
# Frontend web seul (http://localhost:1420)
npm run dev -w @sc-mfd/desktop

# App desktop complète (fenêtre Tauri : Rust + webview)
npm run tauri -w @sc-mfd/desktop dev
```

La table de touches Rust (`keymap.rs`) est **générée** depuis `shared/actions.ts`.
Après modification des actions, régénérez-la :

```bash
npm run gen:keymap -w @sc-mfd/desktop
```

## Lancer la tablette en dev (web)

```bash
npm run dev -w @sc-mfd/tablet      # http://localhost:1430
```

## Construire le pont (installeur)

```bash
npm run tauri -w @sc-mfd/desktop build
```

L'installeur est produit dans
`packages/desktop/src-tauri/target/release/bundle/`.

## Construire l'APK (Android)

```bash
# 1. Build web + synchronisation des projets natifs
npm run build -w @sc-mfd/tablet
cd packages/tablet
npx cap sync android

# 2. Build de l'APK debug (JAVA_HOME doit pointer sur un JDK 21)
cd android
./gradlew assembleDebug          # Windows : .\gradlew.bat assembleDebug
```

- L'APK est généré dans :
  `packages/tablet/android/app/build/outputs/apk/debug/app-debug.apk`
- Le chemin du SDK Android est lu dans `packages/tablet/android/local.properties`
  (`sdk.dir=…`) — ce fichier est **local** (ignoré par git), à créer si absent.
- Exemple pour pointer le JDK 21 (chemin **dépendant de la machine**) :
  ```powershell
  # PowerShell — JBR d'Android Studio
  $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
  ```

## Structure du monorepo

```
packages/
  shared/    # actions, mapping touches, protocole, types (TS pur, sans build)
  desktop/   # le pont — Tauri 2 (Rust) + React/Vite/Tailwind
    src/             # frontend (React)
    src-tauri/       # backend Rust (serveur WS, émulation, mDNS, profil)
    scripts/         # gen-keymap.mjs (génère keymap.rs depuis shared)
  tablet/    # l'app MFD — React/Vite/Tailwind + Capacitor 8
    src/             # écrans MFD, connexion, thèmes
    android/         # projet Android natif (Gradle)
```

### Stack

- **React 19**, **TypeScript 5.8**, **Vite 7**, **Tailwind v4**
  (plugin `@tailwindcss/vite`, sans `tailwind.config.js` ni PostCSS).
- Desktop : **Tauri 2** (Rust).
- Tablet : **Capacitor 8** — `lucide-react`, `capacitor-zeroconf` (mDNS),
  `@capacitor-mlkit/barcode-scanning` (QR), `@capacitor-community/keep-awake`,
  `@capacitor/haptics`.

---

## Licence

Aucun fichier de licence n'est présent dans le dépôt à ce jour.
