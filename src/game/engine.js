/**
 * Moteur de jeu — logique pure, sans DOM ni stockage.
 * Tout ce qui est ici est couvert par tests/engine.test.js.
 *
 * Vocabulaire :
 *  - theme   : { id, category, theme, items: [{ text, isRelated }] }
 *  - deck    : les cartes d'une manche (CARDS_PER_ROUND items tirés d'un thème)
 *  - turn    : index global de manche (0 … joueurs × manches − 1)
 */

export const CARDS_PER_ROUND = 10;
/** Nombre minimum de « vrais » et d'« intrus » dans un paquet (si dispo). */
export const MIN_PER_SIDE = 3;

/** Mélange de Fisher-Yates (non biaisé), renvoie une copie. */
export function shuffle(array, rng = Math.random) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Entier aléatoire dans [min, max]. */
function randInt(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Regroupe les lignes plates du JSON en thèmes.
 * @param {Array<{category:string, theme:string, text:string, isRelated:string|boolean}>} rows
 */
export function groupRows(rows) {
  const map = new Map();
  for (const row of rows) {
    const category = String(row.category ?? '').trim();
    const theme = String(row.theme ?? '').trim();
    const text = String(row.text ?? '').trim();
    if (!category || !theme || !text) continue;
    const id = `${category}::${theme}`;
    if (!map.has(id)) map.set(id, { id, category, theme, items: [] });
    const entry = map.get(id);
    if (entry.items.some((it) => it.text.toLowerCase() === text.toLowerCase())) continue;
    entry.items.push({
      text,
      isRelated: row.isRelated === true || String(row.isRelated).toUpperCase() === 'TRUE',
    });
  }
  return [...map.values()];
}

/** Un thème est jouable s'il a au moins un vrai et un intrus. */
export function isPlayable(theme) {
  return theme.items.some((i) => i.isRelated) && theme.items.some((i) => !i.isRelated);
}

/**
 * Construit la liste ordonnée des thèmes de la partie.
 * - Pas de répétition tant que le stock n'est pas épuisé.
 * - Évite deux fois de suite la même catégorie quand c'est possible.
 */
export function buildPlaylist(themes, count, rng = Math.random) {
  if (!themes.length) throw new Error('Aucun thème disponible pour les catégories choisies.');

  const refill = () => {
    const byCat = new Map();
    for (const t of shuffle(themes, rng)) {
      if (!byCat.has(t.category)) byCat.set(t.category, []);
      byCat.get(t.category).push(t);
    }
    return byCat;
  };

  let stock = refill();
  const playlist = [];
  let lastCategory = null;

  while (playlist.length < count) {
    let cats = [...stock.keys()].filter((c) => stock.get(c).length > 0);
    if (!cats.length) {
      stock = refill();
      cats = [...stock.keys()];
    }
    const varied = cats.filter((c) => c !== lastCategory);
    const pool = varied.length ? varied : cats;
    const cat = pool[Math.floor(rng() * pool.length)];
    const theme = stock.get(cat).pop();
    playlist.push(theme);
    lastCategory = cat;
  }
  return playlist;
}

/**
 * Tire le paquet de cartes d'une manche.
 * Le nombre de « vrais » varie aléatoirement (entre MIN_PER_SIDE et
 * size − MIN_PER_SIDE) pour qu'on ne puisse pas deviner par élimination.
 */
export function buildDeck(theme, size = CARDS_PER_ROUND, rng = Math.random) {
  const yes = shuffle(theme.items.filter((i) => i.isRelated), rng);
  const no = shuffle(theme.items.filter((i) => !i.isRelated), rng);
  const total = Math.min(size, yes.length + no.length);

  let nYes = randInt(MIN_PER_SIDE, Math.max(MIN_PER_SIDE, total - MIN_PER_SIDE), rng);
  nYes = Math.min(nYes, yes.length);
  let nNo = Math.min(total - nYes, no.length);
  nYes = Math.min(total - nNo, yes.length);

  return shuffle([...yes.slice(0, nYes), ...no.slice(0, nNo)], rng);
}

/**
 * Crée une partie.
 * @param {{players: Array<{profileId:string,name:string,color:string}>, roundsPerPlayer:number, timer:number, categories:string[]}} options
 * @param {ReturnType<typeof groupRows>} themes
 */
export function createGame(options, themes, rng = Math.random) {
  const { players, roundsPerPlayer, timer = 0, categories } = options;
  if (!players?.length) throw new Error('Il faut au moins un joueur.');
  const pool = themes.filter((t) => categories.includes(t.category) && isPlayable(t));
  return {
    players: players.map((p) => ({ ...p, score: 0, roundsPlayed: 0, correct: 0, answered: 0, bestRound: 0 })),
    roundsPerPlayer,
    timer,
    categories: [...categories],
    playlist: buildPlaylist(pool, players.length * roundsPerPlayer, rng),
    turn: 0,
    round: null,
  };
}

export const isSolo = (game) => game.players.length === 1;
export const currentPlayer = (game) => game.players[game.turn % game.players.length];
export const currentTheme = (game) => game.playlist[game.turn];
export const isGameOver = (game) => game.turn >= game.playlist.length;

/** Numéro de manche (1-based) du joueur courant. */
export const currentRoundNumber = (game) => Math.floor(game.turn / game.players.length) + 1;

export function startRound(game, rng = Math.random) {
  const theme = currentTheme(game);
  game.round = { theme, deck: buildDeck(theme, CARDS_PER_ROUND, rng), index: 0, score: 0, history: [], ended: false };
  return game.round;
}

export const currentCard = (game) => game.round?.deck[game.round.index] ?? null;

/**
 * Enregistre la réponse du joueur pour la carte courante.
 * @param {boolean} saysYes  true = « dans le thème » (swipe à droite)
 */
export function answerCard(game, saysYes) {
  const r = game.round;
  if (!r || r.ended || r.index >= r.deck.length) return null;
  const item = r.deck[r.index];
  const correct = item.isRelated === saysYes;
  if (correct) r.score++;
  r.history.push({ text: item.text, isRelated: item.isRelated, answer: saysYes, correct });
  r.index++;
  return { correct, item, finished: r.index >= r.deck.length };
}

/**
 * Clôt la manche (idempotent) et passe au tour suivant.
 * Renvoie le bilan de la manche, ou null si elle était déjà close.
 */
export function endRound(game) {
  const r = game.round;
  if (!r || r.ended) return null;
  r.ended = true;
  const player = currentPlayer(game);
  player.score += r.score;
  player.roundsPlayed++;
  player.correct += r.score;
  player.answered += r.history.length;
  player.bestRound = Math.max(player.bestRound, r.score);
  game.turn++;
  return {
    player,
    theme: r.theme,
    score: r.score,
    history: r.history,
    total: r.deck.length,
    gameOver: isGameOver(game),
    cycleEnd: game.turn % game.players.length === 0,
  };
}

/** Classement avec gestion des ex-aequo (1, 1, 3…). */
export function ranking(players) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  let rank = 0;
  return sorted.map((p, i) => {
    if (i === 0 || p.score < sorted[i - 1].score) rank = i + 1;
    return { ...p, rank };
  });
}

/** Les gagnants (plusieurs en cas d'égalité). Vide en solo. */
export function winners(game) {
  if (game.players.length < 2) return [];
  const max = Math.max(...game.players.map((p) => p.score));
  return game.players.filter((p) => p.score === max);
}

/** « 1 groin », « 3 groins », « 0 groin ». */
export const groins = (n) => `${n} groin${Math.abs(n) > 1 ? 's' : ''}`;

/** Précision en pourcentage entier. */
export const accuracy = (correct, total) => (total > 0 ? Math.round((correct / total) * 100) : 0);
