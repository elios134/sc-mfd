# Publier une version & mises à jour automatiques

Les mises à jour sont **automatisées via GitHub Releases**, sans store.

```
  git tag vX.Y.Z  ───►  GitHub Actions (.github/workflows/release.yml)
                          ├─ Desktop : installeur + artefacts updater signés (Tauri)
                          └─ Tablette : APK release signé
                                 ▼
                          Release GitHub « vX.Y.Z »
                                 ▼
   Desktop  ── updater Tauri (auto au lancement)
   Tablette ── Obtainium (auto sur la tablette)
```

- **Pont (desktop)** : se met à jour **tout seul au lancement** (plugin updater Tauri,
  lit `…/releases/latest/download/latest.json`).
- **Tablette (Android)** : pas de store → l'app **Obtainium** suit les Releases GitHub
  et installe le nouvel APK.

---

## 1. Préparation (à faire UNE fois)

### a) Clé de signature des mises à jour desktop (Tauri)

```bash
cd packages/desktop
npm run tauri -- signer generate -w scmfd-updater.key
```

Cela crée `scmfd-updater.key` (privée, protégée par un mot de passe que tu choisis) et
`scmfd-updater.key.pub` (publique), et affiche la **clé publique**.

- Copie la **clé publique** dans `packages/desktop/src-tauri/tauri.conf.json` →
  `plugins.updater.pubkey` (remplace `REMPLACER_PAR_LA_CLE_PUBLIQUE_TAURI`).
- ⚠️ Ne **commite jamais** la clé privée (elle est ignorée par `.gitignore`).

### b) Keystore de signature Android

```bash
keytool -genkeypair -v -keystore scmfd.keystore -alias scmfd \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SC MFD"
# (note le mot de passe du store et de la clé)

# Encode-le en base64 pour le mettre en secret GitHub :
base64 -w0 scmfd.keystore           # Linux/Git Bash
# PowerShell : [Convert]::ToBase64String([IO.File]::ReadAllBytes("scmfd.keystore"))
```

> ⚠️ **Garde ce keystore pour toujours** (et son mot de passe). Si tu en changes,
> Android **refusera** d'installer la mise à jour par-dessus l'app déjà installée.

### c) Secrets GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret** :

| Secret | Contenu |
|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | tout le contenu du fichier `scmfd-updater.key` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | mot de passe choisi en (a) |
| `ANDROID_KEYSTORE_BASE64` | la chaîne base64 du keystore (b) |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du store (b) |
| `ANDROID_KEY_ALIAS` | `scmfd` (ou ton alias) |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé (b) |

---

## 2. Publier une version

1. **Monter les numéros de version** (les 3 doivent correspondre au tag) :
   - `packages/desktop/src-tauri/tauri.conf.json` → `"version"` (ex. `1.2.0`)
   - `packages/desktop/src-tauri/Cargo.toml` → `version` (même valeur)
   - `packages/tablet/android/app/build.gradle` → `versionName` **et**
     `versionCode` (un **entier qui augmente** à chaque release : 1, 2, 3, …)
2. Commit, puis **tag + push du tag** :
   ```bash
   git commit -am "Version 1.2.0"
   git tag v1.2.0
   git push origin main --tags
   ```
3. Le workflow se lance, construit tout et crée la **Release `v1.2.0`** avec
   l'installeur desktop, le `latest.json` signé et l'APK.

> Le `latest.json` reprend la **version de `tauri.conf.json`** : elle doit donc être
> à jour, sinon le desktop ne « verra » pas la nouveauté.

---

## 3. Côté utilisateurs

### Desktop
Rien à faire : au lancement, le pont vérifie, télécharge et installe la mise à jour,
puis redémarre. (La **première** installation se fait à la main avec l'installeur.)

### Tablette — Obtainium (une fois)
1. Installer **Obtainium** (app open-source, depuis son dépôt GitHub).
2. Autoriser Obtainium à **installer des applications inconnues** (réglages Android).
3. Dans Obtainium → **Add App** → coller l'URL du dépôt :
   `https://github.com/elios134/sc-mfd`
4. Obtainium détecte les Releases et l'APK ; active les notifications / l'auto-install.

À chaque nouvelle Release, Obtainium propose (ou installe) la mise à jour.

---

## Notes

- La signature updater (desktop) et le keystore (Android) sont **indispensables** :
  sans eux, le job CI correspondant échoue.
- `versionCode` Android doit **strictement augmenter** à chaque APK.
- En local, `gradlew assembleRelease` produit un APK **non signé** (le keystore n'est
  fourni que par le CI) — c'est normal.
