import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  shuffle, groupRows, buildPlaylist, buildDeck, createGame, startRound, answerCard,
  endRound, ranking, winners, groins, currentPlayer, currentRoundNumber, isPlayable,
  CARDS_PER_ROUND,
} from '../src/game/engine.js';
import { CATEGORIES } from '../src/data/categories.js';

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function seeded(seed = 42) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rows = JSON.parse(readFileSync(new URL('../public/data/themes.json', import.meta.url), 'utf8'));
const themes = groupRows(rows);

describe('données', () => {
  it('toutes les catégories du JSON sont déclarées', () => {
    const unknown = [...new Set(themes.map((t) => t.category))].filter((c) => !CATEGORIES[c]);
    expect(unknown).toEqual([]);
  });
  it('tous les thèmes sont jouables', () => {
    expect(themes.filter((t) => !isPlayable(t)).map((t) => t.id)).toEqual([]);
  });
});

describe('shuffle', () => {
  it('conserve les éléments sans muter la source', () => {
    const src = [1, 2, 3, 4, 5];
    const out = shuffle(src, seeded());
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(src).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('groupRows', () => {
  it('regroupe, dédoublonne et convertit isRelated', () => {
    const out = groupRows([
      { category: 'A', theme: 'T', text: 'x', isRelated: 'TRUE' },
      { category: 'A', theme: 'T', text: 'X ', isRelated: 'TRUE' },
      { category: 'A', theme: 'T', text: 'y', isRelated: 'FALSE' },
      { category: '', theme: 'T', text: 'z', isRelated: 'TRUE' },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].items).toEqual([{ text: 'x', isRelated: true }, { text: 'y', isRelated: false }]);
  });
});

describe('buildDeck', () => {
  it(`donne ${CARDS_PER_ROUND} cartes avec au moins 3 vrais et 3 intrus`, () => {
    const rng = seeded(7);
    for (const theme of themes) {
      const deck = buildDeck(theme, CARDS_PER_ROUND, rng);
      const yes = deck.filter((c) => c.isRelated).length;
      expect(deck).toHaveLength(Math.min(CARDS_PER_ROUND, theme.items.length));
      expect(yes).toBeGreaterThanOrEqual(Math.min(3, theme.items.filter((i) => i.isRelated).length));
      expect(deck.length - yes).toBeGreaterThanOrEqual(Math.min(3, theme.items.filter((i) => !i.isRelated).length));
      expect(new Set(deck.map((c) => c.text)).size).toBe(deck.length);
    }
  });
});

describe('buildPlaylist', () => {
  it('ne répète pas de thème tant que le stock suffit', () => {
    const pool = themes.filter((t) => t.category === 'Art');
    const list = buildPlaylist(pool, pool.length, seeded());
    expect(new Set(list.map((t) => t.id)).size).toBe(pool.length);
  });
  it('recycle quand le stock est épuisé', () => {
    const pool = themes.filter((t) => t.category === 'Décalé');
    expect(buildPlaylist(pool, 5, seeded())).toHaveLength(5);
  });
  it('alterne les catégories quand c’est possible', () => {
    const pool = themes.filter((t) => ['Art', 'Sport'].includes(t.category));
    const list = buildPlaylist(pool, 10, seeded(3));
    for (let i = 1; i < list.length; i++) expect(list[i].category).not.toBe(list[i - 1].category);
  });
  it('refuse un stock vide', () => {
    expect(() => buildPlaylist([], 3)).toThrow();
  });
});

describe('déroulé d’une partie', () => {
  const players = [
    { profileId: 'a', name: 'Alice', color: '#f00' },
    { profileId: 'b', name: 'Bob', color: '#00f' },
  ];

  it('alterne les joueurs et termine après joueurs × manches', () => {
    const game = createGame({ players, roundsPerPlayer: 2, categories: ['Art', 'Histoire'] }, themes, seeded());
    const order = [];
    let summary;
    do {
      order.push(currentPlayer(game).name + currentRoundNumber(game));
      startRound(game, seeded());
      // Alice répond toujours juste, Bob toujours faux
      while (game.round.index < game.round.deck.length) {
        const card = game.round.deck[game.round.index];
        answerCard(game, currentPlayer(game).name === 'Alice' ? card.isRelated : !card.isRelated);
      }
      summary = endRound(game);
    } while (!summary.gameOver);

    expect(order).toEqual(['Alice1', 'Bob1', 'Alice2', 'Bob2']);
    expect(game.players[0].score).toBe(2 * CARDS_PER_ROUND);
    expect(game.players[1].score).toBe(0);
    expect(winners(game).map((p) => p.name)).toEqual(['Alice']);
  });

  it('endRound est idempotent (fin de chrono + dernière carte)', () => {
    const game = createGame({ players, roundsPerPlayer: 1, categories: ['Art'] }, themes, seeded());
    startRound(game);
    answerCard(game, true);
    expect(endRound(game)).not.toBeNull();
    expect(endRound(game)).toBeNull();
    expect(answerCard(game, true)).toBeNull();
    expect(game.turn).toBe(1);
  });
});

describe('ranking / winners', () => {
  it('gère les ex-aequo', () => {
    const r = ranking([{ name: 'a', score: 5 }, { name: 'b', score: 9 }, { name: 'c', score: 5 }, { name: 'd', score: 1 }]);
    expect(r.map((p) => `${p.name}${p.rank}`)).toEqual(['b1', 'a2', 'c2', 'd4']);
  });
  it('pas de gagnant en solo', () => {
    expect(winners({ players: [{ score: 10 }] })).toEqual([]);
  });
});

describe('groins', () => {
  it('accorde le pluriel', () => {
    expect(groins(0)).toBe('0 groin');
    expect(groins(1)).toBe('1 groin');
    expect(groins(2)).toBe('2 groins');
  });
});
