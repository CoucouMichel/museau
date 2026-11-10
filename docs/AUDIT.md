# Audit de Museau — préparation à la publication Google Play

_Audit réalisé sur l'état du dépôt au commit `804ea50` (avant refonte)._

## 1. Synthèse

| Domaine | État avant refonte | Après refonte |
|---|---|---|
| Organisation du code | 1 fichier `index.html` de 4 834 lignes (2 400 de CSS, 1 900 de JS, 500 de HTML) | ~30 modules ES, CSS découpé en tokens / composants / écrans |
| Hors-ligne | ❌ Données chargées depuis un Gist GitHub, polices et icônes depuis Google Fonts | ✅ Tout est embarqué (données, polices, icônes SVG) |
| Application Android | ❌ Simple page web, aucun projet natif | ✅ Capacitor configuré (bouton retour, haptique, barre d'état, splash) |
| Bugs bloquants | 6 bugs de logique (cf. §3) | Corrigés |
| Sécurité | Injection HTML possible via les pseudos | Plus aucun `innerHTML` sur des données utilisateur |
| Tests | Aucun | 14 tests unitaires du moteur + script de validation des données |
| Charte graphique | Cohérente en intention mais ~40 surcharges dark mode, couleurs en dur, CSS dupliqué | Système de tokens unique, clair/sombre/auto |
| Fiche Play Store | Rien | Icône 512, bannière 1024×500, 7 captures 9:16, politique de confidentialité |

**Verdict avant refonte : non publiable.** L'app ne fonctionnait pas hors connexion, le bouton retour Android aurait fermé l'application en pleine partie, et plusieurs bugs cassaient le déroulé du jeu.

---

## 2. Architecture (avant)

- **Monolithe** : tout le jeu dans `index.html`, sans `<!DOCTYPE html>` ni balise `<html>` ouvrante → le navigateur passait en _quirks mode_ (rendu imprévisible selon les WebView).
- **Variables globales implicites** : `drag` et `sx` n'étaient jamais déclarées (création accidentelle sur `window`, plantage en mode strict).
- **Code mort** (~15 % du fichier) : `triggerPigCorrect`, `triggerPigWrong`, `updateGameScorePills` (éléments `#mario-pig`, `#game-score-pills` inexistants), `sndWinner`, `.winner-banner-highlight`, `.lb-list-item`, `.podium-info`, `.ready-category-*`, `.ready-team-title`, `.ready-theme-pill`…
- **CSS dupliqué** : `.profile-bubble` défini 3 fois, `.game-score-anchor` 2 fois, `.ready-theme-highlight` 2 fois avec des valeurs contradictoires, dark mode de `.score-target-badge` 2 fois.
- **~180 styles en ligne** dans le HTML et dans les gabarits JS (avatars notamment), qui rendaient toute évolution de charte très coûteuse.
- **Assets inutilisés** : 14 photos d'animaux (`images/*.webp`, 2,8 Mo), `pig.png`, `logo2.png`, `winner.mp3`, et deux fichiers vides (`images/savane`, `images/temp`).
- **Doublons audio** : `wrong1.mp3` était une copie exacte de `tick.mp3` (une erreur jouait le « tic » du compte à rebours) et `wrong6.mp3` une copie de `wrong5.mp3`.
- **Historique Git** : commits « Update index.html » et commits sans rapport (« Change greeting from Hello to Goodbye »). Impossible de retrouver l'origine d'un changement.

## 3. Bugs fonctionnels relevés (tous corrigés)

| # | Gravité | Description | Correction |
|---|---|---|---|
| B1 | 🔴 | **Chrono fantôme** : quitter une partie (bouton ✕) ne stoppait pas le `setInterval` ; à expiration, `endRound()` était appelé et l'écran de bilan surgissait depuis l'accueil. | Chaque écran nettoie ses timers (`ctx.onCleanup`). `endRound` est idempotent. |
| B2 | 🔴 | **Bouton retour Android** : dans une WebView, il fermait l'app (pas de gestion native). | `@capacitor/app` → `backButton` route vers la navigation interne, avec confirmation en cours de partie. |
| B3 | 🟠 | **Son coupé ignoré** pendant le compte à rebours : `sndTick`/`sndGo` jouaient même avec le son désactivé. | Tous les sons passent par `playSound()` qui respecte le réglage. |
| B4 | 🟠 | **Réglages non sauvegardés** : son et vibrations revenaient à « activé » à chaque lancement (seul le mode sombre était persisté). | `core/settings.js` persiste tous les réglages. |
| B5 | 🟠 | **Retour depuis l'écran « Prêt »** vers les catégories en cours de partie, puis « C'est parti » relançait une partie… sans remettre les scores à zéro. | Une partie ne peut plus être « traversée » à l'envers : retour = confirmation d'abandon. |
| B6 | 🟠 | **Quitter sans confirmation** : un appui malheureux sur ✕ perdait la partie. | Modale de confirmation. |
| B7 | 🟡 | Mélange biaisé (`sort(() => Math.random() - 0.5)`) : certains ordres de cartes étaient nettement plus fréquents. | Fisher-Yates (`engine.shuffle`). |
| B8 | 🟡 | Couleurs de catégorie incohérentes : `startRealGame` et les statistiques utilisaient la palette claire même en mode sombre. | Une seule palette, lisible dans les deux thèmes grâce au contour encre. |
| B9 | 🟡 | Paquet de cartes peu équilibré : seulement 1 vrai et 1 intrus garantis, on pouvait tomber sur 9 intrus. | 3 vrais et 3 intrus minimum, le reste aléatoire. |
| B10 | 🟡 | Thèmes consécutifs de la même catégorie possibles. | `buildPlaylist` alterne les catégories quand c'est possible. |
| B11 | 🟡 | `alert()` / `confirm()` natifs (aspect « page web », bloquants). | Modales et toasts intégrés. |
| B12 | 🟡 | `requestFullscreen()` à chaque lancement de mode (inutile dans une app native, et refusé silencieusement sur iOS). | Supprimé : Capacitor gère le plein écran. |

## 4. Sécurité & vie privée

- **Injection HTML (XSS local)** : les pseudos étaient insérés via `innerHTML` et dans des attributs `onclick="showProfileDetail('${p.id}')"`. Un pseudo comme `<img src=x onerror=…>` exécutait du code. Impact limité (données locales), mais rédhibitoire pour un audit de store et fragile si un jour les profils sont synchronisés. → Le helper `h()` n'insère que du texte.
- **Dépendance réseau tierce** : le Gist pouvait être modifié ou supprimé sans versionnement → le jeu cassait pour tout le monde. → Données versionnées dans le dépôt (`public/data/themes.json`).
- **Google Fonts** : chaque lancement contactait les serveurs de Google (adresse IP transmise) → à déclarer dans la fiche « Sécurité des données ». → Polices embarquées : **l'app ne fait plus aucun appel réseau**.
- Stockage : `localStorage` uniquement, aucune donnée ne quitte l'appareil. Clés désormais versionnées (`museau.v2.*`) avec **migration automatique** des profils et du mode sombre de la v1.

## 5. Données de jeu

Script : `npm run data:check` (et `npm run data:fix`).

- 5 608 lignes → **5 597** après suppression de **11 doublons** (thème « Chanson de Francis Cabrel »).
- 275 thèmes, 12 catégories, environ 20 mots par thème, aucune contradiction (même mot vrai et faux dans un thème).
- ⚠️ **« Décalé » ne contient qu'un seul thème** : en le sélectionnant seul, on rejoue toujours le même. À enrichir (cible : 10+ thèmes) ou à masquer.
- ⚠️ **« Sport › Vainqueur de la Coupe du monde de rugby »** : 4 vrais seulement (il n'existe que 5 vainqueurs différents) → paquets très déséquilibrés. Suggestion : élargir à « Finaliste de la Coupe du monde de rugby ».
- ⚠️ Déséquilibre entre catégories : Musique 65 thèmes, Sport 8, Gastronomie 12. Le tirage alterne les catégories, mais une partie « Sport » de 10 manches recyclera vite.
- À vérifier éditorialement : certains intrus sont des pièges très pointus (« Mistral gagnant » chez Cabrel, c'est Renaud). C'est le sel du jeu, mais une relecture factuelle complète est conseillée avant publication (une erreur de « vérité » = avis 1 étoile).

## 6. Accessibilité

| Problème (avant) | Après |
|---|---|
| `user-scalable=no, maximum-scale=1` : zoom interdit | Zoom autorisé |
| Boutons icône sans libellé (`←`, `✕`, ⚙️) | `aria-label` partout |
| `div` cliquables (profils, catégories) : inaccessibles au clavier et aux lecteurs d'écran | Vrais `<button>` avec `aria-pressed` / `aria-checked` |
| Texte blanc sur vert `#00D084` (contraste 1,9:1) | Texte encre sur couleurs vives (≥ 7:1) |
| Boutons de réponse à 65 % d'opacité | Pleine opacité, cibles ≥ 48 px |
| Aucune prise en compte de `prefers-reduced-motion` | Animations réduites, confettis désactivés |
| Swipe uniquement tactile/souris | + boutons + flèches ← → du clavier |

## 7. Performance

| | Avant | Après |
|---|---|---|
| Premier chargement réseau | ~200 Ko HTML + police Material Symbols variable (≈ 3,5 Mo) + 2 polices Nunito + Gist 560 Ko | 34 Ko JS gzip + 7 Ko CSS gzip + 6 polices woff2 (~100 Ko) + JSON local |
| Icônes | Police complète de ~3 000 icônes | 73 SVG embarqués |
| Sons | 13 `<audio>` chargés au démarrage, latence notable sur Android | Web Audio, chargé au premier contact, latence quasi nulle |
| Poids du dépôt utile | 4,4 Mo dont 2,8 Mo d'images inutilisées | Images mises de côté dans `assets/legacy/` |

## 8. Checklist Google Play

Voir le guide détaillé : [`PLAY_STORE.md`](./PLAY_STORE.md).

- [x] Fonctionne hors-ligne
- [x] Bouton retour Android géré
- [x] Pause automatique du chrono quand l'app passe en arrière-plan
- [x] Icône 512×512, icône adaptative, splash screen
- [x] Bannière 1024×500
- [x] Captures d'écran 9:16 (clair & sombre)
- [x] Politique de confidentialité (texte prêt, à héberger)
- [x] Aucune donnée collectée → fiche « Sécurité des données » simple
- [ ] **Vérifier les droits des sons** (`public/audio/*.mp3`) : origine inconnue. Sans licence prouvée, remplacer par des sons libres (CC0) avant publication.
- [ ] Générer le projet Android (`npm run android:add`) et l'icône native (`npx @capacitor/assets generate`)
- [ ] Créer la clé de signature et l'AAB
- [ ] Compte développeur : **test fermé obligatoire (12 testeurs pendant 14 jours)** pour les comptes personnels créés après nov. 2023
- [ ] Questionnaire de classification du contenu (IARC) — attendu : PEGI 3 / Tout public
- [ ] Relecture factuelle des 275 thèmes
- [ ] Enrichir « Décalé »

## 9. Pistes pour la suite (après publication)

1. **Mises à jour de contenu sans republier** : garder le JSON embarqué comme base, et télécharger optionnellement un pack plus récent (avec numéro de version) depuis une URL que vous contrôlez.
2. **Signalement d'erreur** sur une carte depuis l'écran de bilan (« cette réponse est fausse ») → améliore la qualité des données.
3. **Mode « équipes »** (plusieurs personnes par profil) et mode **« mort subite »**.
4. **Succès / badges** à partir des stats déjà enregistrées (meilleure manche, séries, catégories maîtrisées).
5. **Analytics respectueux** (ex. compteur anonyme de thèmes joués / taux de réussite par thème) pour repérer les thèmes trop durs — nécessitera de mettre à jour la politique de confidentialité.
