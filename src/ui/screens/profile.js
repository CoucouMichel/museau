/** Fiche détaillée d'un joueur. */
import { h } from '../../core/dom.js';
import { back } from '../../core/router.js';
import { screen, topbar, body, iconButton, sectionTitle } from '../components/layout.js';
import { avatar } from '../components/snout.js';
import { getProfile, deleteProfile, profileTotals } from '../../core/profiles.js';
import { CATEGORIES, categoryNames } from '../../data/categories.js';
import { accuracy } from '../../game/engine.js';
import { confirmDialog } from '../components/modal.js';
import { toast } from '../components/toast.js';
import './stats.css';

export default {
  id: 'profile',
  render({ id }) {
    const p = getProfile(id);
    if (!p) {
      queueMicrotask(back);
      return screen();
    }
    const totals = profileTotals(p);

    const rows = categoryNames()
      .map((name) => {
        const s = p.statsByCategory[name] ?? { correct: 0, total: 0 };
        return { name, ...s, pct: accuracy(s.correct, s.total), cat: CATEGORIES[name] };
      })
      .sort((a, b) => (b.total > 0) - (a.total > 0) || b.pct - a.pct || b.total - a.total);

    const remove = async () => {
      const ok = await confirmDialog({
        title: `Supprimer ${p.name} ?`,
        message: 'Le joueur et toutes ses statistiques seront effacés.',
        confirmLabel: 'Supprimer',
        danger: true,
      });
      if (ok) {
        deleteProfile(p.id);
        toast(`${p.name} a été supprimé`);
        back();
      }
    };

    return screen(
      topbar({ title: 'Fiche joueur', onBack: back, right: iconButton('delete', `Supprimer ${p.name}`, remove, 'icon-btn--danger') }),
      body(
        h('div', { class: 'profile-head' },
          avatar(p.color, { size: 96 }),
          h('h2', { class: 'profile-head__name', style: { '--player-color': p.color } }, p.name),
        ),
        h('div', { class: 'stat-tiles stat-tiles--4' },
          h('div', { class: 'stat-tile' }, h('strong', null, String(p.gamesPlayed)), h('span', null, 'Parties')),
          h('div', { class: 'stat-tile' }, h('strong', null, String(p.gamesWon)), h('span', null, 'Victoires')),
          h('div', { class: 'stat-tile' }, h('strong', null, String(p.totalGroins)), h('span', null, 'Groins')),
          h('div', { class: 'stat-tile' }, h('strong', null, totals.total ? `${accuracy(totals.correct, totals.total)} %` : '—'), h('span', null, 'Précision')),
        ),
        h('section', { class: 'panel' }, sectionTitle('Flair par catégorie'),
        h('ul', { class: 'cat-bars' },
          rows.map((r) =>
            h('li', { class: ['cat-bar', !r.total && 'cat-bar--empty'], style: { '--cat': r.cat.color, '--pct': `${r.pct}%` } },
              h('span', { class: 'cat-bar__icon' }),
              h('span', { class: 'cat-bar__name' }, r.name),
              h('span', { class: 'cat-bar__val' }, r.total ? `${r.pct} %` : '—'),
              h('span', { class: 'cat-bar__track', 'aria-hidden': 'true' }, h('span', { class: 'cat-bar__fill' })),
            ),
          ),
        )),
        p.bestRound > 0 && h('p', { class: 'profile-best' }, `Meilleure manche\u00a0: ${p.bestRound} groin${p.bestRound > 1 ? 's' : ''} sur 10`),
      ),
    );
  },
};
