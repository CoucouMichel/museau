# 🐽 Museau — groin ou pas groin ?

Jeu d'ambiance de culture générale : chaque manche a un thème, des mots défilent, on swipe à droite s'ils sont dans le thème et à gauche si ce sont des intrus. Solo ou jusqu'à 8 joueurs en se passant le téléphone.

- Application web (Vite, JavaScript vanilla, aucun framework) empaquetée pour Android avec **Capacitor**
- 100 % hors-ligne, aucune donnée collectée

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement (accessible depuis le téléphone sur le même Wi-Fi) |
| `npm run build` | Build de production dans `dist/` |
| `npm test` | Tests du moteur de jeu |
| `npm run data:check` | Valide `public/data/themes.json` (doublons, catégories, équilibre) |
| `npm run data:fix` | Supprime les doublons |
| `npm run android:sync` | Build + copie dans le projet Android |
| `npm run android:open` | Ouvre Android Studio |

Publication Play Store : voir [`docs/PLAY_STORE.md`](docs/PLAY_STORE.md).

## Organisation du code

```
index.html                 coquille HTML (aucun contenu : tout est rendu en JS)
public/
  data/themes.json         toutes les cartes (category, theme, text, isRelated)
  audio/                   effets sonores
src/
  main.js                  point d'entrée : polices, styles, enregistrement des écrans
  styles/
    tokens.css             ⭐ charte : couleurs, typo, espacements, ombres
    base.css               reset + gabarit des écrans
    components.css         boutons, panneaux, modales, puces…
  core/                    briques techniques, sans logique de jeu
    dom.js                 h() : création d'éléments (anti-injection HTML)
    router.js              navigation entre écrans + bouton retour
    platform.js            Android : bouton retour, pause, barre d'état, splash
    settings.js            réglages persistés + thème clair/sombre
    profiles.js            joueurs & statistiques (localStorage)
    storage.js             accès sûr au localStorage
    audio.js / haptics.js  sons (Web Audio) et vibrations
  data/
    categories.js          ⭐ couleur, icône et description de chaque catégorie
    themes.js              chargement du JSON
    legal.js               texte de confidentialité affiché dans l'app
  game/
    engine.js              ⭐ règles du jeu, 100 % pures et testées
    session.js             partie en cours (relie moteur ↔ profils)
  ui/
    icons.js               icônes SVG embarquées
    components/            layout, groin/avatar, modale, toast, confettis…
    screens/               un fichier .js + un .css par écran
tests/                     tests Vitest
scripts/validate-data.mjs  validation des données
docs/                      audit, charte graphique, guide Play Store, confidentialité
store/                     visuels de la fiche Play Store
assets/                    sources des icônes/splash Android (+ anciens assets dans legacy/)
```

### Recettes

- **Ajouter des cartes** : éditer `public/data/themes.json` (ou l'exporter depuis votre tableur), puis `npm run data:check`.
- **Ajouter une catégorie** : une entrée dans `src/data/categories.js` + des lignes dans le JSON.
- **Changer une couleur de la charte** : `src/styles/tokens.css` uniquement.
- **Ajouter un écran** : créer `src/ui/screens/mon-ecran.js` (objet `{ id, render(params, ctx), onBack? }`) et son `.css`, l'enregistrer dans `src/main.js`, y naviguer avec `go('mon-ecran')`.
- **Ajouter une icône** : un import dans `src/ui/icons.js`.

### Principes

1. **Aucune couleur en dur** hors `tokens.css` (sauf données : catégories, joueurs).
2. **Jamais de `innerHTML` avec une donnée** : utiliser `h()`, qui insère du texte.
3. **La logique de jeu va dans `engine.js`** et s'accompagne d'un test.
4. Un écran nettoie ce qu'il crée (`ctx.onCleanup`) : timers, écouteurs, animations.

## Documentation

- [Audit complet](docs/AUDIT.md)
- [Charte graphique](docs/DESIGN.md)
- [Publier sur Google Play](docs/PLAY_STORE.md)
- [Politique de confidentialité](docs/privacy-policy.md)
