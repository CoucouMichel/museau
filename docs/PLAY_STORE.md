# Publier Museau sur Google Play

Le jeu est une application web empaquetée en application Android native avec **Capacitor**. Les étapes ci-dessous se font sur votre ordinateur (il faut Android Studio).

## 0. Prérequis

- Node.js ≥ 20
- [Android Studio](https://developer.android.com/studio) (installe le SDK Android et un JDK)
- Un compte [Google Play Console](https://play.google.com/console) (25 $ une fois)

## 1. Générer le projet Android (une seule fois)

```bash
npm install
```

```bash
npm run build
```

```bash
npx cap add android
```

```bash
npx @capacitor/assets generate --android --iconBackgroundColor "#FF6F9C" --splashBackgroundColor "#FFF4EC" --splashBackgroundColorDark "#1B1220"
```

La dernière commande crée les icônes (y compris l'icône adaptative) et les splash screens à partir des fichiers de `assets/`. Le dossier `android/` créé doit être **commité** (sauf ce qui est dans `.gitignore`).

Puis, dans `android/app/src/main/AndroidManifest.xml`, vérifiez que l'activité principale est verrouillée en portrait :

```xml
<activity android:screenOrientation="portrait" ... >
```

## 2. Version de l'app

À chaque publication, incrémentez dans `android/app/build.gradle` :

- `versionCode` : entier, +1 à chaque envoi sur le Play Store
- `versionName` : version lisible, gardez-la alignée sur `package.json` (`1.0.0`)

Le niveau d'API cible (`targetSdkVersion`) doit respecter l'exigence en vigueur de Google Play (vérifiez l'avertissement dans la Play Console : Capacitor 8 cible déjà une API récente).

## 3. Tester sur un téléphone

```bash
npm run android:sync
```

```bash
npm run android:open
```

Dans Android Studio : brancher le téléphone (mode développeur + débogage USB) puis ▶ Run. À tester en priorité :

- [ ] le bouton retour Android à chaque écran (en partie : demande de confirmation)
- [ ] la mise en arrière-plan pendant une manche chronométrée (le chrono se met en pause)
- [ ] le mode avion (tout doit marcher)
- [ ] les sons et vibrations, et leur désactivation
- [ ] un petit écran (≈ 5") et une tablette

## 4. Signer et construire l'AAB

1. Créez une clé d'upload (à faire **une seule fois** et à **sauvegarder en lieu sûr** — jamais dans Git) :

   ```bash
   keytool -genkey -v -keystore museau-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias museau
   ```

2. Android Studio → **Build › Generate Signed App Bundle** → Android App Bundle → choisir la clé → `release`.
3. Le fichier `android/app/release/app-release.aab` est celui à envoyer sur la Play Console.

Activez **Play App Signing** (proposé par défaut) : Google conserve la clé de signature finale, votre clé ne sert qu'à l'envoi.

## 5. Fiche du Play Store

Tous les visuels sont dans `store/` :

| Élément | Fichier | Format exigé |
|---|---|---|
| Icône | `store/icon-512.png` | 512 × 512 PNG |
| Bannière | `store/feature-graphic.png` | 1024 × 500 |
| Captures téléphone | `store/screenshots/*.png` | 2 à 8, 1080 × 1920 |

Textes proposés :

- **Nom** : Museau — groin ou pas groin ?
- **Description courte** (80 car. max) : Swipe pour démasquer les intrus ! Le jeu d'ambiance qui met ton flair à l'épreuve.
- **Description longue** :

  > Austerlitz est-elle une bataille napoléonienne ? Et Verdun ? 🐽
  >
  > Dans Museau, chaque manche a un thème. Des mots défilent : glisse à droite s'ils sont dans le thème, à gauche si ce sont des intrus. Chaque bonne réponse te rapporte un groin !
  >
  > • Plus de 270 thèmes et 5 500 cartes : histoire, musique, cinéma, géographie, sport, gastronomie, geek, art, sciences…
  > • Joue seul ou jusqu'à 8 en te passant le téléphone
  > • Chrono optionnel pour plus de tension
  > • Profils joueurs et statistiques par catégorie
  > • Mode sombre
  > • 100 % hors-ligne, sans pub, sans compte, aucune donnée collectée

- **Catégorie** : Jeux › Questions-réponses (ou Jeux de société)
- **Tags** : quiz, culture générale, jeu d'ambiance, soirée

## 6. Formulaires obligatoires de la Play Console

| Formulaire | Réponse pour Museau |
|---|---|
| Politique de confidentialité | URL publique de `docs/privacy-policy.md` (ex. GitHub Pages ou page Notion publique) |
| Accès à l'application | Toutes les fonctionnalités sont accessibles sans identifiant |
| Annonces | Non, l'application ne contient pas de publicité |
| Classification du contenu (IARC) | Jeu, pas de violence ni de contenu sensible → PEGI 3 attendu |
| Public cible | **13 ans et plus** recommandé (déclarer « enfants » impose le programme Familles et des règles plus strictes) |
| Sécurité des données | **Aucune donnée collectée ni partagée**. Les données (pseudos, scores) restent sur l'appareil |
| Application d'actualité / gouvernementale / santé | Non |

## 7. Test fermé puis production

Pour un **compte développeur personnel** récent, Google exige un **test fermé avec au moins 12 testeurs pendant 14 jours consécutifs** avant de pouvoir demander l'accès à la production. Prévoyez ce délai : invitez amis et famille via une liste d'adresses Gmail, envoyez-leur le lien d'inscription au test et demandez-leur de garder l'app installée.

Ensuite : Production → Créer une release → envoyer l'AAB → examen par Google (quelques heures à quelques jours).

## 8. Avant d'appuyer sur « Publier »

- [ ] Droits des sons de `public/audio/` vérifiés (ou remplacés par des sons CC0)
- [ ] `npm test` et `npm run data:check` passent
- [ ] Relecture des thèmes
- [ ] `webContentsDebuggingEnabled` est bien à `false` dans `capacitor.config.json`
- [ ] Version incrémentée
