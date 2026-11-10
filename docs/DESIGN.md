# Charte graphique Museau — direction « Éditorial »

## Intention

Museau est un jeu de **culture générale**. La charte doit le dire avant même la première carte : sérieuse sans être austère, lettrée sans être scolaire. On s'inspire du **supplément culture d'un journal du dimanche** : papier crème, grande typographie à empattements, filets fins, une seule couleur d'accent.

Trois principes :

1. **La typographie porte la hiérarchie.** Pas d'ombres, pas de dégradés, pas de pastilles colorées : un titre en grand corps, un chapeau en italique, des surtitres en petites capitales espacées.
2. **Les filets structurent.** Les listes, menus et tableaux sont séparés par des filets de 1 px, comme une page imprimée.
3. **Une seule couleur d'accent, le bordeaux.** Le vert sapin et la brique sont réservés au sens (« dans le thème » / « intrus »).

Le mode sombre n'est pas une simple inversion : c'est la même page « imprimée à l'encre claire sur papier noir », avec un bordeaux éclairci pour garder le contraste.

## Logo & monogramme

Le **groin en trait fin** (dérivé de `assets/logo-outline.png`) est le monogramme. Il hérite de la couleur du texte (`currentColor`) et se colore en CSS.

- `logo()` : monogramme bordeaux + « Museau » en Fraunces (corps 76) + devise en italique bordeaux « Groin ou pas groin ? ».
- `avatar(color)` : cercle fin et groin à la couleur du joueur.
- Icône d'application : groin crème sur fond bordeaux.

Le nom s'écrit « Museau » (majuscule initiale).

## Couleurs (`src/styles/tokens.css`)

| Rôle | Token | Clair | Sombre |
|---|---|---|---|
| Fond d'écran (papier) | `--c-paper` | `#F5F1EA` | `#141311` |
| Cartes, champs | `--c-surface` | `#FBF9F5` | `#1C1A17` |
| Fond secondaire | `--c-sunk` | `#EDE7DC` | `#24211D` |
| Texte, boutons pleins | `--c-ink` | `#161514` | `#EEE8DD` |
| Texte secondaire | `--c-ink-soft` | `#6B645B` | `#A39B8E` |
| Filets | `--c-rule` | `#D9D2C5` | `#35312B` |
| Accent (bordeaux) | `--c-accent` | `#7A1E2C` | `#D4707F` |
| Dans le thème (sapin) | `--c-yes` | `#2F5D50` | `#79B39C` |
| Intrus (brique) | `--c-no` | `#B0402F` | `#E0806C` |
| Texte sur bouton plein | `--c-on-ink` | `#F5F1EA` | `#141311` |

Règles :
- **Aucune couleur en dur** hors `tokens.css`, sauf les couleurs de données (catégories, joueurs).
- Le bordeaux sert aux éléments « éditoriaux » : devise, thème de la manche, numéros de menu, carte en cours. Jamais aux boutons.
- Action principale = bouton **plein encre** ; secondaire = **contour encre**.

### Catégories & joueurs

Les couleurs de catégorie (`src/data/categories.js`) et de joueur (`PLAYER_COLORS`, `src/core/profiles.js`) sont des **encres sourdes** : ocre, garance, prune, sapin, bleu de Prusse… Elles n'apparaissent qu'en petites touches (carré de 8–10 px devant le nom d'une catégorie, cercle fin de l'avatar). En mode sombre, elles sont automatiquement éclaircies via `--data-mix` (`color-mix` vers le blanc), d'où les variables `--cat-ui` et `--player-ui` à utiliser en CSS.

## Typographie

| Usage | Police | Style |
|---|---|---|
| Titres, mots des cartes, scores, noms, menus | **Fraunces** (serif) | 400 romain, 400 italique |
| Interface, surtitres, boutons, textes courants | **Inter** (sans) | 400 / 500 / 600 |

Les deux polices sont sous licence OFL et **embarquées** (`@fontsource`, sous-ensemble latin).

| Élément | Réglage |
|---|---|
| Titre d'écran (`.page-title`) | Fraunces 44 px, interlettrage −0,03 em |
| Chapeau (`.page-lede`) | Fraunces italique 20 px, bordeaux |
| Surtitre (`.kicker`) | Inter 600, 11 px, capitales, interlettrage 0,18 em, gris |
| Bouton | Inter 600, 12 px, capitales, interlettrage 0,14 em |
| Mot de la carte | Fraunces 24 → 48 px selon la longueur |
| Score | Fraunces 92 px, chiffres alignés |

Typographie française : espace fine insécable avant `?` `!` `:` (` `), apostrophe typographique (’).

## Formes

| Token | Valeur |
|---|---|
| `--hairline` | 1 px — tous les filets et contours |
| `--radius` | 2 px — angles quasi droits (boutons, cartes) |
| `--radius-pill` | réservé aux puces joueurs, interrupteurs et avatars |

La carte de jeu a un **double cadre** (cadre extérieur + filet intérieur à 10 px), comme une carte imprimée. C'est la seule surface qui porte une ombre, très diffuse, pour la détacher pendant le glissé.

## Icônes

Material Symbols **Outlined** (trait), utilisées avec parcimonie : retour, fermer, flèches, coche, poubelle, chrono, geste de swipe. Tout le reste passe par le texte. Liste dans `src/ui/icons.js`.

## Mouvement

Sobre et rapide : fondus et glissements de 6–12 px (`--ease-out`, 240 ms). Le score change de couleur un instant (bordeaux) à chaque bonne réponse. Pas de confettis, pas de rebonds. `prefers-reduced-motion` est respecté.

## Composants

| Composant | Classe / fonction |
|---|---|
| En-tête d'écran | `pageHead(titre, chapeau)` |
| Barre du haut | `topbar({ title, onBack, right })` — surtitre centré + filet |
| Bouton | `button({ label, variant: 'primary' \| 'ghost' \| 'danger' })` |
| Bouton icône | `iconButton(icon, label, onClick)` |
| Section | `.panel` + `sectionTitle(texte)` |
| Sélecteur segmenté | `segmented({...})` — cases à filet, sélection pleine encre |
| Interrupteur | `toggle({...})` |
| Catégorie | `categoryChip(nom)` — carré de couleur + capitales |
| Avatar | `avatar(couleur)` |
| Chiffres clés | `.stat-tiles` / `.stat-tile` |
| Modale | `openModal()`, `confirmDialog()` — feuille qui monte du bas |
| Toast | `toast(message)` |

## Ton éditorial

Tutoiement, phrases courtes et soignées, une pointe d'humour pince-sans-rire : « Une belle érudition. », « Il y a de la marge. », « Clément l'emporte ». Les jeux de mots porcins restent dans le nom et la devise.
