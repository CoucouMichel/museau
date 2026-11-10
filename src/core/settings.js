/**
 * Réglages utilisateur persistés + application du thème clair/sombre.
 */
import { read, write, readLegacy, removeLegacy } from './storage.js';

const DEFAULTS = {
  sound: true,
  haptics: true,
  /** 'system' | 'light' | 'dark' */
  theme: 'system',
  /** Dernière configuration de partie, pour pré-remplir l'écran de préparation. */
  lastSetup: { roundsPerPlayer: 3, timer: 0, categories: [] },
};

let settings = { ...DEFAULTS, ...read('settings', {}) };

// Migration v1 : seul le mode sombre était sauvegardé.
const legacyDark = readLegacy('museau_dark_mode');
if (legacyDark !== undefined) {
  settings.theme = legacyDark === true || legacyDark === 'true' ? 'dark' : 'system';
  removeLegacy('museau_dark_mode');
  write('settings', settings);
}

const listeners = new Set();

export const getSettings = () => settings;
export const getSetting = (key) => settings[key];

export function setSetting(key, value) {
  settings = { ...settings, [key]: value };
  write('settings', settings);
  if (key === 'theme') applyTheme();
  listeners.forEach((fn) => fn(settings, key));
}

export function onSettingsChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

/** Thème effectivement affiché ('light' | 'dark'). */
export function resolvedTheme() {
  if (settings.theme === 'system') return media?.matches ? 'dark' : 'light';
  return settings.theme;
}

export function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--c-paper').trim();
  listeners.forEach((fn) => fn(settings, 'resolvedTheme'));
}

media?.addEventListener?.('change', () => settings.theme === 'system' && applyTheme());
