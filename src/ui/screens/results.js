/**
 * Classement intermédiaire (multi) et résultats de fin de partie (solo & multi).
 */
import { h } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer, button } from '../components/layout.js';
import { avatar, snout } from '../components/snout.js';
import { confirmQuit } from '../components/quitGame.js';
import { celebrate } from '../components/confetti.js';
import { icon } from '../icons.js';
import { getGame, rematch, abandon } from '../../game/session.js';
import { ranking, winners, isSolo, accuracy, currentRoundNumber, CARDS_PER_ROUND } from '../../game/engine.js';
import { playSound } from '../../core/audio.js';
import { haptic } from '../../core/haptics.js';
import './results.css';

function soloResult(game) {
  const p = game.players[0];
  const max = game.playlist.length * CARDS_PER_ROUND;
  const pct = accuracy(p.correct, p.answered);
  return h(
    'div',
    { class: 'solo-result' },
    h('div', { class: 'solo-result__score card', style: { '--player-color': p.color } },
      snout({ color: p.color, size: 64 }),
      h('p', { class: 'solo-result__big' }, String(p.score)),
      h('p', { class: 'solo-result__unit' }, `groin${p.score > 1 ? 's' : ''} sur ${max}`),
    ),
    h('div', { class: 'stat-tiles' },
      h('div', { class: 'stat-tile' }, h('strong', null, `${pct} %`), h('span', null, 'Précision')),
      h('div', { class: 'stat-tile' }, h('strong', null, String(p.bestRound)), h('span', null, 'Meilleure manche')),
      h('div', { class: 'stat-tile' }, h('strong', null, String(game.playlist.length)), h('span', null, 'Manches')),
    ),
  );
}

function rankingList(game, final) {
  const ranked = ranking(game.players);
  return h(
    'ol',
    { class: 'ranking' },
    ranked.map((p, i) =>
      h(
        'li',
        { class: ['rank-row', p.rank === 1 && 'rank-row--lead'], style: { '--player-color': p.color, '--i': i } },
        h('span', { class: ['rank-row__rank', `rank-row__rank--${Math.min(p.rank, 4)}`] }, String(p.rank)),
        avatar(p.color, { size: 40 }),
        h('span', { class: 'rank-row__name' }, p.name, p.rank === 1 && final && h('span', { class: 'rank-row__crown' }, icon('crown'))),
        h('span', { class: 'rank-row__score' }, String(p.score), h('small', null, p.score > 1 ? ' groins' : ' groin')),
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

    let title;
    if (!final) title = `Après la manche ${currentRoundNumber(game) - 1}`;
    else if (solo) title = 'Partie terminée';
    else if (champs.length > 1) title = 'Égalité !';
    else title = `${champs[0].name} gagne !`;

    if (final) {
      let stop = () => {};
      const t = setTimeout(() => {
        playSound('victory');
        haptic('success');
        stop = celebrate(solo ? undefined : [...champs.map((c) => c.color), '#FFC23D', '#FF6F9C']);
      }, 250);
      ctx.onCleanup(() => {
        clearTimeout(t);
        stop();
      });
    }

    const goHome = () => {
      abandon();
      reset('home');
    };

    return screen(
      topbar({
        onBack: final ? goHome : confirmQuit,
        backIcon: final ? 'home' : 'close',
        backLabel: final ? 'Menu principal' : 'Quitter la partie',
        title: final ? 'Résultats' : 'Classement',
      }),
      body(
        h('div', { class: 'results__head' },
          final && h('div', { class: 'results__trophy' }, icon('trophy')),
          h('h2', { class: 'results__title' }, title),
        ),
        solo ? soloResult(game) : rankingList(game, final),
      ),
      final
        ? footer(
            button({ label: 'Revanche', icon: 'restart_alt', size: 'lg', onClick: () => { rematch(); replace('ready'); } }),
            button({ label: 'Menu principal', icon: 'home', variant: 'ghost', onClick: goHome }),
          )
        : footer(button({ label: 'Manche suivante', icon: 'arrow_forward', size: 'lg', onClick: () => replace('ready') })),
    );
  },
};
