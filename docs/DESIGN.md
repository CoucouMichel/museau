# Charte graphique Museau

## Intention

Museau est un jeu d'ambiance : on le joue à plusieurs, en se passant le téléphone, souvent en riant. La charte doit être **lisible à bout de bras**, **tactile** (on a envie d'appuyer) et **reconnaissable** au premier coup d'œil dans le Play Store.

Direction retenue : **« sticker »**. Des formes rondes et pleines, un contour encre épais et une ombre décalée sans flou, comme des autocollants posés sur du papier. Tout élément pressé « s'enfonce » (il descend de l'épaisseur de son ombre).

L'ancienne charte (claymorphism rose/violet, ombres floues) a été abandonnée : elle était générique, peu contrastée en plein soleil et demandait une quarantaine de surcharges pour le mode sombre.

## Logo & mascotte

Le **groin** est la mascotte, le logo et l'avatar des joueurs. Sa silhouette (dôme arrondi à base légèrement creusée, deux narines ovales inclinées vers l'extérieur) reprend `assets/logo-outline.png`. Il est dessiné en SVG dans `src/ui/components/snout.js` :

- `logo()` : groin + « museau » en Fredoka + étiquette jaune « groin ou pas groin ? » inclinée de −3°.
- `avatar(color)` : pastille ronde teintée avec un groin de la couleur du joueur.
- `snout()` : groin seul (compteur de score, groin volant, confettis).

Le nom s'écrit **en minuscules** dans le logo (« museau ») et avec une majuscule dans le texte courant (« Museau »).

## Couleurs

Toutes les couleurs sont des variables CSS définies dans `src/styles/tokens.css`. **Aucune couleur n'est écrite en dur ailleurs** (à l'exception des couleurs de catégorie et de joueur, qui sont des données).

| Rôle | Token | Clair | Sombre |
|---|---|---|---|
| Action principale | `--c-groin` | `#FF6F9C` | `#FF7FA8` |
| Récompense, victoire | `--c-truffe` | `#FFC23D` | idem |
| Dans le thème | `--c-yes` | `#1FBF75` | idem |
| Intrus | `--c-no` | `#FF5B4F` | idem |
| Fond d'écran | `--c-paper` | `#FFF4EC` | `#1B1220` |
| Cartes, panneaux | `--c-surface` | `#FFFFFF` | `#2A1F31` |
| Fond secondaire | `--c-surface-2` | `#FDE8EE` | `#352640` |
| Texte | `--c-ink` | `#2A1A2E` | `#FFF1F6` |
| Texte secondaire | `--c-ink-soft` | `#6B5870` | `#C2B0C7` |
| Contours et ombres | `--c-line` | `#2A1A2E` | `#0B060D` |
| Texte sur couleur vive | `--c-on-color` | `#2A1A2E` | `#2A1A2E` |

Règles :
- Sur une couleur vive (bouton rose, vert, rouge, jaune, couleur de catégorie), le texte et les icônes sont **toujours en encre foncée** (`--c-on-color`), jamais en blanc. Contraste ≥ 7:1.
- Les fonds teintés sont obtenus par `color-mix(in srgb, <couleur> 20–30 %, var(--c-surface))`, ce qui marche automatiquement en clair comme en sombre.

### Catégories (`src/data/categories.js`)

| Catégorie | Couleur | Icône |
|---|---|---|
| Art | `#F5A524` | palette |
| Cinéma & TV | `#EF4E4E` | movie |
| Décalé | `#E25FC4` | sentiment_very_satisfied |
| Gastronomie | `#F97B3B` | restaurant |
| Geek | `#8A63F2` | sports_esports |
| Géographie | `#2B8CE6` | public |
| Histoire | `#C7863A` | castle |
| Littérature | `#A452D9` | auto_stories |
| Musique | `#5465F0` | music_note |
| Nature | `#22B573` | forest |
| Science | `#14B3C7` | science |
| Sport | `#86C232` | sports_soccer |

### Joueurs

12 couleurs bien distinctes dans `PLAYER_COLORS` (`src/core/profiles.js`). La première couleur libre est proposée par défaut.

## Typographie

| Usage | Police | Graisse |
|---|---|---|
| Titres, boutons, mots des cartes, scores | **Fredoka** | 600 / 700 |
| Texte courant, libellés | **Nunito** | 600 → 900 |

Les deux polices sont sous licence OFL et **embarquées** (`@fontsource`, sous-ensemble latin) : aucun appel réseau.

Échelle (`--fs-*`) : 11 · 12 · 14 · 16 · 20 · 26 · 36 · 56 px. Les mots des cartes ont 4 tailles automatiques selon leur longueur (`data-size="l|m|s|xs"`).

Les « surtitres » (`.eyebrow`) sont en Nunito 900, capitales, interlettrage 0,12 em, couleur secondaire.

## Formes & profondeur

| Token | Valeur | Usage |
|---|---|---|
| `--stroke` | 2,5 px | contour de tous les éléments interactifs et surfaces |
| `--shadow` | `0 4px 0 var(--c-line)` | boutons, cartes, panneaux |
| `--shadow-s` | `0 2px 0 var(--c-line)` | puces, tuiles secondaires |
| `--radius-s/m/l` | 12 / 18 / 26 px | |
| `--radius-pill` | 999 px | boutons, puces |

Pression : `transform: translateY(var(--lift)); box-shadow: none`.

## Icônes

Material Symbols **Rounded, remplies**, embarquées en SVG (`src/ui/icons.js`). Taille par défaut 24 px (`--icon-size`). Pour ajouter une icône : ajouter son import dans `icons.js` (seules les icônes importées sont incluses dans le build).

## Mouvement

- Courbes : `--ease-out` (sorties, transitions d'écran), `--ease-bounce` (apparitions, interrupteurs, score).
- Durées : 120 / 220 / 400 ms.
- Moments forts : groin du logo qui remue, tampons « Groin ! / Intrus » pendant le glissé, groin qui vole jusqu'au compteur, pastilles de progression, confettis-groins à la victoire.
- `prefers-reduced-motion` est respecté (animations neutralisées, pas de confettis).

## Composants

Définis dans `src/styles/components.css` et `src/ui/components/` :

| Composant | Classe / fonction |
|---|---|
| Bouton | `.btn` + `--primary` `--ghost` `--yes` `--no` `--danger`, tailles `--lg` `--sm` — `button({...})` |
| Bouton icône | `.icon-btn` — `iconButton(icon, label, onClick)` |
| Barre de titre | `.topbar` — `topbar({ title, onBack, right })` |
| Panneau | `.panel` / `.card` |
| Sélecteur segmenté | `.segmented` — `segmented({...})` |
| Interrupteur | `.switch` — `toggle({...})` |
| Puce catégorie | `.cat-chip` — `categoryChip(name)` |
| Avatar | `.avatar` — `avatar(color)` |
| Tuiles de stats | `.stat-tiles` / `.stat-tile` |
| Modale | `openModal()`, `confirmDialog()` |
| Toast | `toast(message)` |

## Ton éditorial

Tutoiement, phrases courtes, jeux de mots sur le cochon avec modération : « Joli coup de groin ! », « Ça sent le roussi… », « Ramasse les groins ». L'écriture inclusive se limite au point médian sur les mots courts (« prêt·e »).
