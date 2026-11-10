import { h } from '../../core/dom.js';
import { back } from '../../core/router.js';
import { screen, topbar, body, footer, button, sectionTitle, pageHead } from '../components/layout.js';
import { CATEGORIES, categoryNames } from '../../data/categories.js';
import './rules.css';

const STEPS = [
  ['Un thème, dix cartes', 'Chaque manche annonce un thème. Dix mots défilent : certains y appartiennent, d’autres sont des intrus.'],
  ['Le geste', 'Glisse la carte à droite si le mot est dans le thème, à gauche si c’est un intrus. Les boutons font de même.'],
  ['Les groins', 'Chaque bonne réponse rapporte un groin. La correction s’affiche à la fin de la manche.'],
  ['À plusieurs', 'On se passe le téléphone à chaque manche. Le plus grand nombre de groins l’emporte.'],
  ['Le chrono', 'En option : les cartes non jouées quand le temps est écoulé ne rapportent rien.'],
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export default {
  id: 'rules',
  render() {
    return screen(
      topbar({ title: 'Mode d’emploi', onBack: back }),
      body(
        pageHead('Règles du jeu', 'Groin ou pas groin ?'),
        h('ol', { class: 'steps' },
          STEPS.map(([title, text], i) =>
            h('li', { class: 'step' },
              h('span', { class: 'step__num' }, ROMAN[i]),
              h('div', null, h('h3', { class: 'step__title' }, title), h('p', { class: 'step__text' }, text)),
            ),
          ),
        ),
        h('section', { class: 'panel' },
          sectionTitle('Les catégories'),
          h('ul', { class: 'cat-list' },
            categoryNames().map((name) =>
              h('li', { class: 'cat-list__item', style: { '--cat': CATEGORIES[name].color } },
                h('span', { class: 'cat-list__icon' }),
                h('div', null, h('h4', null, name), h('p', null, CATEGORIES[name].description)),
              ),
            ),
          ),
        ),
      ),
      footer(button({ label: 'Compris', onClick: back })),
    );
  },
};
