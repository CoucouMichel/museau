/**
 * Profils joueurs & statistiques (stockage local uniquement).
 *
 * Profil : {
 *   id, name, color, createdAt, lastPlayed,
 *   gamesPlayed, gamesWon, totalGroins, bestRound,
 *   statsByCategory: { [categorie]: { correct, total } }
 * }
 */
import { read, write, readLegacy, removeLegacy } from './storage.js';

/** Palette des avatars joueurs : 12 encres distinctes, éclaircies en mode sombre. */
export const PLAYER_COLORS = [
  '#7A1E2C', '#2F5D50', '#2E5E8C', '#B4602F', '#6D3F7A', '#86683E',
  '#2C7380', '#A23B3B', '#3D4C8F', '#6A7D2E', '#9A4A7A', '#4A4540',
];
export const MAX_NAME_LENGTH = 15;

let profiles = read('profiles', null);

// Migration depuis la v1 (clé `museau_player_profiles`).
if (profiles == null) {
  const legacy = readLegacy('museau_player_profiles');
  profiles = Array.isArray(legacy) ? legacy.map(normalize) : [];
  write('profiles', profiles);
  if (legacy !== undefined) removeLegacy('museau_player_profiles');
}
profiles = profiles.map(normalize);

function normalize(p) {
  return {
    id: p.id ?? newId(),
    name: String(p.name ?? 'Joueur').slice(0, MAX_NAME_LENGTH),
    color: p.color ?? PLAYER_COLORS[0],
    createdAt: p.createdAt ?? Date.now(),
    lastPlayed: p.lastPlayed ?? 0,
    gamesPlayed: p.gamesPlayed ?? 0,
    gamesWon: p.gamesWon ?? 0,
    totalGroins: p.totalGroins ?? 0,
    bestRound: p.bestRound ?? 0,
    statsByCategory: p.statsByCategory ?? {},
  };
}

function newId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const save = () => write('profiles', profiles);

/** Profils triés : derniers joueurs actifs d'abord. */
export function listProfiles() {
  return [...profiles].sort((a, b) => b.lastPlayed - a.lastPlayed || a.createdAt - b.createdAt);
}

export const getProfile = (id) => profiles.find((p) => p.id === id) ?? null;

export function nameTaken(name, exceptId) {
  const n = name.trim().toLocaleLowerCase('fr');
  return profiles.some((p) => p.id !== exceptId && p.name.toLocaleLowerCase('fr') === n);
}

/** Première couleur libre de la palette. */
export function suggestColor() {
  const used = new Set(profiles.map((p) => p.color));
  return PLAYER_COLORS.find((c) => !used.has(c)) ?? PLAYER_COLORS[profiles.length % PLAYER_COLORS.length];
}

/** @returns {{ok: true, profile: object} | {ok: false, error: string}} */
export function createProfile(name, color) {
  const clean = name.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH);
  if (!clean) return { ok: false, error: 'Choisis un pseudo.' };
  if (nameTaken(clean)) return { ok: false, error: 'Ce pseudo existe déjà.' };
  const profile = normalize({ name: clean, color, createdAt: Date.now(), lastPlayed: Date.now() });
  profiles.push(profile);
  save();
  return { ok: true, profile };
}

export function deleteProfile(id) {
  profiles = profiles.filter((p) => p.id !== id);
  save();
}

export function resetAllProfiles() {
  profiles = [];
  save();
}

/** Appelé à la fin de chaque manche. */
export function recordRound(profileId, { category, score, answered }) {
  const p = getProfile(profileId);
  if (!p) return;
  p.totalGroins += score;
  p.bestRound = Math.max(p.bestRound, score);
  p.lastPlayed = Date.now();
  const s = (p.statsByCategory[category] ??= { correct: 0, total: 0 });
  s.correct += score;
  s.total += answered;
  save();
}

/** Appelé une seule fois quand une partie va à son terme. */
export function recordGameEnd(game, winnerIds) {
  for (const player of game.players) {
    const p = getProfile(player.profileId);
    if (!p) continue;
    p.gamesPlayed++;
    if (winnerIds.includes(p.id)) p.gamesWon++;
  }
  save();
}

/** Totaux tous thèmes confondus. */
export function profileTotals(p) {
  let correct = 0;
  let total = 0;
  for (const s of Object.values(p.statsByCategory)) {
    correct += s.correct;
    total += s.total;
  }
  return { correct, total };
}
