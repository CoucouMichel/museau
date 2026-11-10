/**
 * Chargement des thèmes depuis public/data/themes.json (embarqué dans l'app :
 * fonctionne hors-ligne, pas de dépendance à un Gist distant).
 */
import { groupRows, isPlayable } from '../game/engine.js';
import { CATEGORIES } from './categories.js';

let cache = null;

/** @returns {Promise<ReturnType<typeof groupRows>>} */
export function loadThemes() {
  cache ??= fetch(`${import.meta.env.BASE_URL}data/themes.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((rows) => groupRows(rows).filter((t) => CATEGORIES[t.category] && isPlayable(t)))
    .catch((e) => {
      cache = null; // on pourra réessayer
      throw e;
    });
  return cache;
}

/** Nombre de thèmes par catégorie. */
export function countByCategory(themes) {
  const out = {};
  for (const t of themes) out[t.category] = (out[t.category] ?? 0) + 1;
  return out;
}
