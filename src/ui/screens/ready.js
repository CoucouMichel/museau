/**
 * « Passe le téléphone à … » : présente le thème avant la manche, puis compte à rebours.
 */
import { h, wait, replayClass, prefersReducedMotion } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer, button } from '../components/layout.js';
import { avatar } from '../components/snout.js';
import { categoryChip } from '../components/categoryChip.js';
import { confirmQuit } from '../components/quitGame.js';
import { icon } from '../icons.js';
import { getGame } from '../../game/session.js';
import { currentPlayer, currentTheme, currentRoundNumber, isSolo } from '../../game/engine.js';
import { playSound } from '../../core/audio.js';
import { haptic } from '../../core/haptics.js';
import './ready.css';

export default {
  id: 'ready',
  onBack: () => confirmQuit(),
  render(_, ctx) {
    const game = getGame();
    if (!game) {
      queueMicrotask(() => reset('home'));
      return screen();
    }
    const player = currentPlayer(game);
    const theme = currentTheme(game);
    let cancelled = false;
    ctx.onCleanup(() => (cancelled = true));

    const countdown = h('div', { class: 'countdown', 'aria-live': 'assertive' }, h('span', { class: 'countdown__num' }));

    async function launch() {
      goBtn.disabled = true;
      el.append(countdown);
      const num = countdown.firstChild;
      const step = prefersReducedMotion() ? 450 : 650;
      for (const n of ['3', '2', '1']) {
        if (cancelled) return;
        num.textContent = n;
        replayClass(num, 'countdown__num--pop');
        playSound('tick');
        haptic('tap');
        await wait(step);
      }
      if (cancelled) return;
      num.textContent = 'GO !';
      replayClass(num, 'countdown__num--pop');
      playSound('go');
      await wait(350);
      if (!cancelled) replace('play');
    }

    const goBtn = button({ label: 'Je suis prêt·e !', icon: 'play_arrow', size: 'lg', onClick: launch });

    const el = screen(
      topbar({
        onBack: confirmQuit,
        backIcon: 'close',
        backLabel: 'Quitter la partie',
        center: h('p', { class: 'topbar__meta' }, `Manche ${currentRoundNumber(game)} / ${game.roundsPerPlayer}`),
      }),
      body(
        h(
          'div',
          { class: 'ready__player' },
          h('p', { class: 'eyebrow' }, isSolo(game) ? 'À toi de jouer' : 'Passe le téléphone à'),
          avatar(player.color, { size: 88 }),
          h('h2', { class: 'ready__name', style: { '--player-color': player.color } }, player.name),
        ),
        h(
          'div',
          { class: 'ready__theme card' },
          categoryChip(theme.category),
          h('p', { class: 'eyebrow' }, 'Le thème'),
          h('p', { class: 'ready__theme-text' }, theme.theme),
        ),
        h(
          'div',
          { class: 'swipe-hint' },
          h('div', { class: 'swipe-hint__side swipe-hint__side--no' }, icon('arrow_back'), h('span', null, 'Intrus')),
          h('div', { class: 'swipe-hint__hand' }, icon('swipe')),
          h('div', { class: 'swipe-hint__side swipe-hint__side--yes' }, h('span', null, 'Dans le thème'), icon('arrow_forward')),
        ),
      ),
      footer(goBtn),
    );
    return el;
  },
};
