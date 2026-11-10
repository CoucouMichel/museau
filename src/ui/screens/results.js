/**
 * Classement intermédiaire (multi) et résultats de fin de partie (solo & multi).
 */
import { h } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer, button, pageHead } from '../components/layout.js';
import { avatar } from '../components/snout.js';
import { confirmQuit } from '../components/quitGame.js';
import { getGame, rematch, abandon } from '../../game/session.js';
import { ranking, winners, isSolo, accuracy, CARDS_PER_ROUND } from '../../game/engine.js';
import { playSound } from '../../core/audio.js';
import { haptic } from '../../core/haptics.js';
import './results.css';

const ordinal = (n) => (n === 1 ? '1er' : `${n}e`);
const groinsWord = (n) => (n > 1 ? 'groins' : 'groin');

function soloResult(game) {
  const p = game.players[0];
  const max = game.playlist.length * CARDS_PER_ROUND;
  return h(
    'div',
    { class: 'solo-result' },
    h('p', { class: 'solo-result__big' }, String(p.score), h('span', null, `/${max}`)),
    h('div', { class: 'stat-tiles' },
      h('div', { class: 'stat-tile' }, h('strong', null, `${accuracy(p.correct, p.answered)} %`), h('span', null, 'Précision')),
      h('div', { class: 'stat-tile' }, h('strong', null, String(p.bestRound)), h('span', null, 'Meilleure manche')),
      h('div', { class: 'stat-tile' }, h('strong', null, String(game.playlist.length)), h('span', null, 'Manches')),
    ),
  );
}

function rankingList(game) {
  return h(
    'ol',
    { class: 'ranking' },
    ranking(game.players).map((p, i) =>
      h(
        'li',
        { class: ['rank-row', p.rank === 1 && 'rank-row--lead'], style: { '--i': i } },
        h('span', { class: 'rank-row__rank' }, ordinal(p.rank)),
        avatar(p.color, { size: 36 }),
        h('span', { class: 'rank-row__name' }, p.name),
        h('span', { class: 'rank-row__score' }, String(p.score), h('small', null, groinsWord(p.score))),
      ),
    ),
  );
}

export default {
  id: 'results',
  onBack: ({ params }) => (params.final ? (abandon(), reset('home'), true) : confirmQuit()),
  render({ final }, ctx) {
    const game = getGame();
    if (!game) {
      queueMicrotask(() => reset('home'));
      return screen();
    }
    const solo = isSolo(game);
    const champs = winners(game);
    const roundsDone = Math.floor(game.turn / game.players.length);

    let title;
    let lede;
    if (!final) {
      title = 'Classement';
      lede = `Après ${roundsDone} manche${roundsDone > 1 ? 's' : ''} sur ${game.roundsPerPlayer}.`;
    } else if (solo) {
      title = 'Partie terminée';
      lede = `${game.players[0].name}, voici ton score.`;
    } else if (champs.length > 1) {
      title = 'Ex æquo';
      lede = `${champs.map((c) => c.name).join(' et ')} se partagent la victoire.`;
    } else {
      title = `${champs[0].name} l’emporte`;
      lede = `Avec ${champs[0].score} ${groinsWord(champs[0].score)}.`;
    }

    if (final) {
      const t = setTimeout(() => {
        playSound('victory');
        haptic('success');
      }, 250);
      ctx.onCleanup(() => clearTimeout(t));
    }

    const goHome = () => {
      abandon();
      reset('home');
    };

    return screen(
      topbar({
        onBack: final ? goHome : confirmQuit,
        backIcon: 'close',
        backLabel: final ? 'Menu principal' : 'Quitter la partie',
        title: final ? 'Résultats' : 'Entracte',
      }),
      body(pageHead(title, lede), solo ? soloResult(game) : rankingList(game)),
      final
        ? footer(
            button({ label: 'Revanche', size: 'lg', onClick: () => { rematch(); replace('ready'); } }),
            button({ label: 'Menu principal', variant: 'ghost', onClick: goHome }),
          )
        : footer(button({ label: 'Manche suivante', size: 'lg', onClick: () => replace('ready') })),
    );
  },
};
