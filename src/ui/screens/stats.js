/** Liste des joueurs et de leurs statistiques globales. */
import { h } from '../../core/dom.js';
import { go, back } from '../../core/router.js';
import { screen, topbar, body, footer, button } from '../components/layout.js';
import { avatar } from '../components/snout.js';
import { icon } from '../icons.js';
import { listProfiles, profileTotals } from '../../core/profiles.js';
import { accuracy } from '../../game/engine.js';
import { newPlayerModal } from '../components/playerModal.js';
import './stats.css';

export default {
  id: 'stats',
  render() {
    const list = h('ul', { class: 'profile-list' });

    function refresh() {
      const profiles = listProfiles();
      if (!profiles.length) {
        list.replaceChildren(
          h('li', { class: 'empty' },
            h('span', { class: 'empty__icon' }, icon('bar_chart')),
            h('p', null, 'Aucun joueur pour l’instant.'),
            h('p', { class: 'empty__sub' }, 'Crée un joueur et lance une partie pour voir tes stats ici.'),
          ),
        );
        return;
      }
      list.replaceChildren(
        ...profiles.map((p) => {
          const t = profileTotals(p);
          return h('li', null,
            h('button', { class: 'profile-row card', type: 'button', onClick: () => go('profile', { id: p.id }) },
              avatar(p.color, { size: 48 }),
              h('div', { class: 'profile-row__text' },
                h('h3', null, p.name),
                h('p', null, `${p.gamesPlayed} partie${p.gamesPlayed > 1 ? 's' : ''} · ${p.gamesWon} victoire${p.gamesWon > 1 ? 's' : ''} · ${p.totalGroins} groin${p.totalGroins > 1 ? 's' : ''}`),
              ),
              h('div', { class: 'profile-row__pct' }, h('strong', null, t.total ? `${accuracy(t.correct, t.total)} %` : '—'), h('span', null, 'précision')),
              icon('chevron_right'),
            ),
          );
        }),
      );
    }
    refresh();

    return screen(
      topbar({ title: 'Statistiques', onBack: back }),
      body(list),
      footer(button({ label: 'Nouveau joueur', icon: 'add', variant: 'ghost', onClick: async () => { if (await newPlayerModal()) refresh(); } })),
    );
  },
};
