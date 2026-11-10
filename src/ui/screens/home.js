import { h } from '../../core/dom.js';
import { go } from '../../core/router.js';
import { screen, body, footer } from '../components/layout.js';
import { logo } from '../components/snout.js';
import { icon } from '../icons.js';
import { loadThemes } from '../../data/themes.js';
import { haptic } from '../../core/haptics.js';
import './home.css';

const MENU = [
  ['I', 'Entre amis', () => go('setup', { mode: 'multi' })],
  ['II', 'Partie solo', () => go('setup', { mode: 'solo' })],
  ['III', 'Règles du jeu', () => go('rules')],
];

export default {
  id: 'home',
  render() {
    const count = h('span', { class: 'kicker' }, ' ');
    loadThemes()
      .then((t) => (count.textContent = `${t.length} thèmes`))
      .catch(() => {});

    const nav = (label, onClick) =>
      h('button', { class: 'home__link', type: 'button', onClick: () => { haptic('tap'); onClick(); } }, label);

    return screen(
      h('header', { class: 'home__mast' }, h('span', { class: 'kicker' }, 'Culture générale'), count),
      body(h('div', { class: 'home__hero' }, logo())),
      footer(
        h(
          'nav',
          { class: 'home__menu', 'aria-label': 'Menu principal' },
          MENU.map(([num, label, onClick]) =>
            h(
              'button',
              { class: 'home__item', type: 'button', onClick: () => { haptic('tap'); onClick(); } },
              h('span', { class: 'home__num' }, num),
              h('span', { class: 'home__label' }, label),
              icon('arrow_forward'),
            ),
          ),
        ),
        h('div', { class: 'home__foot' }, nav('Statistiques', () => go('stats')), nav('Paramètres', () => go('settings'))),
      ),
    );
  },
};
