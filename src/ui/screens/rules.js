import { h } from '../../core/dom.js';
import { back } from '../../core/router.js';
import { screen, topbar, body, footer, button, sectionTitle } from '../components/layout.js';
import { icon } from '../icons.js';
import { CATEGORIES, categoryNames } from '../../data/categories.js';
import './rules.css';

const STEPS = [
  { icon: 'search', title: 'Flaire les intrus', text: 'Chaque manche a un thème. Des mots défilent : certains y appartiennent, d’autres sont des intrus.' },
  { icon: 'swipe', title: 'Swipe !', text: 'Glisse à droite (ou ✓) si le mot est dans le thème, à gauche (ou ✕) si c’est un intrus.' },
  { icon: 'pets', title: 'Ramasse les groins', text: 'Chaque bonne réponse rapporte 1 groin. 10 cartes par manche.' },
  { icon: 'groups', title: 'Joue entre amis', text: 'En multi, on se passe le téléphone à chaque manche. Le plus gros tas de groins gagne !' },
  { icon: 'timer', title: 'Option chrono', text: 'Avec le chrono, les cartes non jouées à la fin du temps ne rapportent rien.' },
];

export default {
  id: 'rules',
  render() {
    return screen(
      topbar({ title: 'Règles du jeu', onBack: back }),
      body(
        h('ol', { class: 'steps' },
          STEPS.map((s, i) =>
            h('li', { class: 'step card' },
              h('span', { class: 'step__icon' }, icon(s.icon), h('span', { class: 'step__num' }, String(i + 1))),
              h('div', null, h('h3', { class: 'step__title' }, s.title), h('p', { class: 'step__text' }, s.text)),
            ),
          ),
        ),
        sectionTitle('Les catégories'),
        h('ul', { class: 'cat-list' },
          categoryNames().map((name) => {
            const c = CATEGORIES[name];
            return h('li', { class: 'cat-list__item', style: { '--cat': c.color } },
              h('span', { class: 'cat-list__icon' }, icon(c.icon)),
              h('div', null, h('h4', null, name), h('p', null, c.description)),
            );
          }),
        ),
      ),
      footer(button({ label: 'J’ai compris !', icon: 'check', onClick: back })),
    );
  },
};
