/**
 * Bilan d'une manche : score + correction carte par carte.
 */
import { h } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer, button } from '../components/layout.js';
import { avatar, snout } from '../components/snout.js';
import { categoryChip } from '../components/categoryChip.js';
import { confirmQuit } from '../components/quitGame.js';
import { icon } from '../icons.js';
import { getGame } from '../../game/session.js';
import { currentPlayer, isSolo } from '../../game/engine.js';
import './summary.css';

function verdict(score, total) {
  const r = total ? score / total : 0;
  if (r === 1) return 'Sans faute, quel flair !';
  if (r >= 0.8) return 'Joli coup de groin !';
  if (r >= 0.5) return 'Pas mal du tout.';
  if (r > 0) return 'Ça sent le roussi…';
  return 'Aïe. Même pas un groin.';
}

export default {
  id: 'summary',
  onBack: () => confirmQuit(),
  render({ summary }) {
    const game = getGame();
    if (!game || !summary) {
      queueMicrotask(() => reset('home'));
      return screen();
    }
    const { player, theme, score, history, total, gameOver, cycleEnd } = summary;

    let next;
    if (gameOver) {
      next = button({ label: 'Voir les résultats', icon: 'trophy', size: 'lg', onClick: () => replace('results', { final: true }) });
    } else if (cycleEnd && !isSolo(game)) {
      next = button({ label: 'Classement', icon: 'leaderboard', size: 'lg', onClick: () => replace('results', { final: false }) });
    } else {
      const who = currentPlayer(game);
      next = button({
        label: isSolo(game) ? 'Manche suivante' : `Au tour de ${who.name}`,
        icon: 'arrow_forward',
        size: 'lg',
        onClick: () => replace('ready'),
      });
    }

    const unanswered = total - history.length;

    return screen(
      topbar({
        onBack: confirmQuit,
        backIcon: 'close',
        backLabel: 'Quitter la partie',
        center: h('div', { class: 'play__who' }, avatar(player.color, { size: 28 }), h('h2', { class: 'play__name' }, player.name)),
      }),
      body(
        h(
          'div',
          { class: 'summary__hero card' },
          categoryChip(theme.category),
          h('p', { class: 'summary__theme' }, theme.theme),
          h(
            'div',
            { class: 'summary__score', style: { '--player-color': player.color } },
            snout({ color: player.color, size: 40 }),
            h('span', { class: 'summary__score-val' }, `+${score}`),
            h('span', { class: 'summary__score-unit' }, `/ ${total}`),
          ),
          h('p', { class: 'summary__verdict' }, verdict(score, total)),
        ),
        h('h3', { class: 'eyebrow summary__list-title' }, 'Correction'),
        h(
          'ul',
          { class: 'answers' },
          history.map((a) =>
            h(
              'li',
              { class: ['answer', a.correct ? 'answer--ok' : 'answer--ko'] },
              h('span', { class: 'answer__mark', 'aria-label': a.correct ? 'Bonne réponse' : 'Erreur' }, icon(a.correct ? 'check' : 'close')),
              h('span', { class: 'answer__text' }, a.text),
              h('span', { class: ['answer__truth', a.isRelated ? 'answer__truth--yes' : 'answer__truth--no'] }, a.isRelated ? 'Thème' : 'Intrus'),
            ),
          ),
          unanswered > 0 &&
            h('li', { class: 'answer answer--skip' }, icon('hourglass_bottom'), h('span', { class: 'answer__text' }, `${unanswered} carte${unanswered > 1 ? 's' : ''} non jouée${unanswered > 1 ? 's' : ''} (temps écoulé)`)),
        ),
      ),
      footer(next),
    );
  },
};
