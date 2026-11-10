/**
 * Bilan d'une manche : score + correction carte par carte.
 */
import { h } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer, button } from '../components/layout.js';
import { categoryChip } from '../components/categoryChip.js';
import { confirmQuit } from '../components/quitGame.js';
import { getGame } from '../../game/session.js';
import { currentPlayer, isSolo } from '../../game/engine.js';
import './summary.css';

function verdict(score, total) {
  const r = total ? score / total : 0;
  if (r === 1) return 'Un sans-faute. Chapeau.';
  if (r >= 0.8) return 'Une belle érudition.';
  if (r >= 0.5) return 'Honorable.';
  if (r > 0) return 'Il y a de la marge.';
  return 'Pas un seul groin…';
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
    const roundNo = Math.floor((game.turn - 1) / game.players.length) + 1;

    let next;
    if (gameOver) {
      next = button({ label: 'Voir les résultats', size: 'lg', onClick: () => replace('results', { final: true }) });
    } else if (cycleEnd && !isSolo(game)) {
      next = button({ label: 'Classement', size: 'lg', onClick: () => replace('results', { final: false }) });
    } else {
      const who = currentPlayer(game);
      next = button({
        label: isSolo(game) ? 'Manche suivante' : `Au tour de ${who.name}`,
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
        center: h('p', { class: 'topbar__meta' }, `Bilan · ${player.name} · Manche ${roundNo}`),
      }),
      body(
        h(
          'div',
          { class: 'summary__head' },
          categoryChip(theme.category),
          h('p', { class: 'summary__theme' }, theme.theme),
          h('p', { class: 'summary__score' }, String(score), h('span', null, `/${total}`)),
          h('p', { class: 'summary__verdict' }, `${player.name} — ${verdict(score, total)}`),
        ),
        h(
          'ol',
          { class: 'answers', 'aria-label': 'Correction' },
          history.map((a, i) =>
            h(
              'li',
              { class: ['answer', a.correct ? 'answer--ok' : 'answer--ko'], style: { '--i': i } },
              h('span', { class: 'answer__mark', 'aria-label': a.correct ? 'Bonne réponse' : 'Erreur' }, a.correct ? '✓' : '✕'),
              h('span', { class: 'answer__text' }, a.text),
              h('span', { class: ['answer__truth', a.isRelated ? 'answer__truth--yes' : 'answer__truth--no'] }, a.isRelated ? 'Thème' : 'Intrus'),
            ),
          ),
          unanswered > 0 &&
            h('li', { class: 'answer answer--skip' }, h('span', { class: 'answer__mark' }, '—'), h('span', { class: 'answer__text' }, `${unanswered} carte${unanswered > 1 ? 's' : ''} non jouée${unanswered > 1 ? 's' : ''}, temps écoulé`)),
        ),
      ),
      footer(next),
    );
  },
};
