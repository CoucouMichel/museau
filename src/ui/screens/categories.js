/**
 * Choix des catégories puis lancement de la partie.
 */
import { h } from '../../core/dom.js';
import { go, back } from '../../core/router.js';
import { screen, topbar, body, footer, button, pageHead } from '../components/layout.js';
import { icon } from '../icons.js';
import { CATEGORIES, categoryNames } from '../../data/categories.js';
import { loadThemes, countByCategory } from '../../data/themes.js';
import { getSetting, setSetting } from '../../core/settings.js';
import { getProfile } from '../../core/profiles.js';
import { newGame } from '../../game/session.js';
import { haptic } from '../../core/haptics.js';
import { toast } from '../components/toast.js';
import './categories.css';

export default {
  id: 'categories',
  render({ playerIds, roundsPerPlayer, timer }) {
    const names = categoryNames();
    const saved = getSetting('lastSetup').categories.filter((c) => CATEGORIES[c]);
    const selected = new Set(saved.length ? saved : names);
    let themes = null;
    let counts = {};

    const grid = h('div', { class: 'cat-grid' });
    const allBtn = h('button', { class: 'link-btn', type: 'button', onClick: toggleAll });
    const startBtn = button({ label: 'Commencer', size: 'lg', onClick: start });

    function toggleAll() {
      haptic('tap');
      if (selected.size === names.length) selected.clear();
      else names.forEach((n) => selected.add(n));
      refresh();
    }

    function refresh() {
      grid.replaceChildren(
        ...names.map((name) => {
          const cat = CATEGORIES[name];
          const on = selected.has(name);
          return h(
            'button',
            {
              class: ['cat-tile', on && 'cat-tile--on'],
              type: 'button',
              'aria-pressed': String(on),
              style: { '--cat': cat.color },
              onClick: () => {
                haptic('tap');
                on ? selected.delete(name) : selected.add(name);
                refresh();
              },
            },
            h('span', { class: 'cat-tile__icon', 'aria-hidden': 'true' }),
            h('span', { class: 'cat-tile__name' }, name),
            h('span', { class: 'cat-tile__count' }, counts[name] ? `${counts[name]} thème${counts[name] > 1 ? 's' : ''}` : '…'),
            h('span', { class: 'cat-tile__check', 'aria-hidden': 'true' }, icon('check')),
          );
        }),
      );
      allBtn.textContent = selected.size === names.length ? 'Aucune' : 'Toutes';
      startBtn.disabled = selected.size === 0 || !themes;
      startBtn.querySelector('span:last-child').textContent =
        selected.size === 0 ? 'Choisis au moins une catégorie' : `Commencer · ${selected.size} catégorie${selected.size > 1 ? 's' : ''}`;
    }

    function start() {
      const players = playerIds.map(getProfile).filter(Boolean).map((p) => ({ profileId: p.id, name: p.name, color: p.color }));
      const categories = [...selected];
      setSetting('lastSetup', { ...getSetting('lastSetup'), categories });
      try {
        newGame({ players, roundsPerPlayer, timer, categories }, themes);
      } catch (e) {
        toast(e.message);
        return;
      }
      go('ready');
    }

    loadThemes()
      .then((t) => {
        themes = t;
        counts = countByCategory(t);
        refresh();
      })
      .catch(() => toast('Impossible de charger les thèmes. Réessaie.'));

    refresh();

    return screen(
      topbar({ title: 'Étape 2 sur 2', onBack: back, right: allBtn }),
      body(pageHead('Catégories', 'Choisis tes terrains de jeu.'), grid),
      footer(startBtn),
    );
  },
};

