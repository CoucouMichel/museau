import { h } from '../../core/dom.js';
import { go } from '../../core/router.js';
import { screen, body, footer, iconButton, button } from '../components/layout.js';
import { logo } from '../components/snout.js';
import './home.css';

export default {
  id: 'home',
  render() {
    return screen(
      h('div', { class: 'home__pattern', 'aria-hidden': 'true' }),
      h(
        'header',
        { class: 'topbar' },
        h('div', { class: 'topbar__side' }, iconButton('settings', 'Paramètres', () => go('settings'))),
        h('div', { class: 'topbar__center' }),
        h('div', { class: 'topbar__side topbar__side--right' }, iconButton('bar_chart', 'Statistiques', () => go('stats'))),
      ),
      body(h('div', { class: 'home__hero' }, logo())),
      footer(
        h(
          'div',
          { class: 'home__modes' },
          button({ label: 'Solo', icon: 'person', size: 'lg', onClick: () => go('setup', { mode: 'solo' }) }),
          button({ label: 'Entre amis', icon: 'groups', size: 'lg', onClick: () => go('setup', { mode: 'multi' }) }),
        ),
        button({ label: 'Règles du jeu', icon: 'help', variant: 'ghost', onClick: () => go('rules') }),
      ),
    );
  },
};
