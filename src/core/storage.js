/**
 * Accès sûr au localStorage (mode privé, quota plein, WebView restreinte…).
 * Toutes les clés sont préfixées et versionnées : `museau.v2.<clé>`.
 */
const PREFIX = 'museau.v2.';

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('[storage] écriture impossible', key, e);
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** Lecture d'une ancienne clé (v1, sans préfixe) pour la migration. */
export function readLegacy(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return undefined;
  }
}

export function removeLegacy(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
