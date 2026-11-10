/**
 * Partie en cours : relie le moteur (pur) aux profils persistés.
 * Les écrans de jeu passent tous par ce module.
 */
import * as engine from './engine.js';
import { recordRound, recordGameEnd } from '../core/profiles.js';

let game = null;
let lastOptions = null;

export const getGame = () => game;

/**
 * @param {{players: Array<{profileId,name,color}>, roundsPerPlayer: number, timer: number, categories: string[]}} options
 */
export function newGame(options, themes) {
  lastOptions = { ...options, themes };
  game = engine.createGame(options, themes);
  return game;
}

/** Relance une partie avec les mêmes réglages. */
export function rematch() {
  if (!lastOptions) return null;
  const { themes, ...options } = lastOptions;
  return newGame(options, themes);
}

export function abandon() {
  game = null;
}

/** Termine la manche courante et persiste les stats. Idempotent. */
export function finishRound() {
  const summary = engine.endRound(game);
  if (!summary) return null;
  recordRound(summary.player.profileId, {
    category: summary.theme.category,
    score: summary.score,
    answered: summary.history.length,
  });
  if (summary.gameOver) {
    recordGameEnd(game, engine.winners(game).map((p) => p.profileId));
  }
  return summary;
}
