/**
 * Écran de jeu : pile de cartes à swiper (ou boutons / flèches du clavier).
 */
import { h, replayClass, wait, prefersReducedMotion } from '../../core/dom.js';
import { replace, reset } from '../../core/router.js';
import { screen, topbar, body, footer } from '../components/layout.js';
import { avatar, snout } from '../components/snout.js';
import { categoryChip } from '../components/categoryChip.js';
import { confirmQuit } from '../components/quitGame.js';
import { icon, iconDataUrl } from '../icons.js';
import { getGame, finishRound } from '../../game/session.js';
import { currentPlayer, currentRoundNumber, startRound, answerCard } from '../../game/engine.js';
import { getCategory } from '../../data/categories.js';
import { playSound } from '../../core/audio.js';
import { haptic } from '../../core/haptics.js';
import { onAppPause } from '../../core/platform.js';
import './play.css';

const SWIPE_THRESHOLD = 90; // px
const FLY_MS = 260;

/** Taille de police adaptée à la longueur du mot. */
function wordSize(text) {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length));
  if (longest > 14 || text.length > 36) return 'xs';
  if (longest > 11 || text.length > 26) return 's';
  if (longest > 8 || text.length > 16) return 'm';
  return 'l';
}

export default {
  id: 'play',
  onBack: (ctx) => ctx.requestQuit?.() ?? confirmQuit(),
  render(_, ctx) {
    const game = getGame();
    if (!game) {
      queueMicrotask(() => reset('home'));
      return screen();
    }
    const player = currentPlayer(game);
    const round = startRound(game);
    const theme = round.theme;
    const cat = getCategory(theme.category);

    let locked = false;
    let done = false;

    // ---------- Éléments ----------
    const scoreVal = h('span', { class: 'score-pill__val' }, '0');
    const scorePill = h(
      'div',
      { class: 'score-pill', 'aria-live': 'polite', 'aria-label': 'Score de la manche' },
      snout({ color: player.color, size: 28 }),
      scoreVal,
    );

    const dots = h(
      'ol',
      { class: 'progress-dots', 'aria-label': 'Progression' },
      round.deck.map(() => h('li', { class: 'progress-dots__dot' })),
    );

    const makeCard = (extra) =>
      h(
        'div',
        { class: ['play-card', extra], style: { '--cat': cat.color, '--pattern': iconDataUrl(cat.icon) } },
        h('div', { class: 'play-card__pattern', 'aria-hidden': 'true' }),
        h('div', { class: 'play-card__top' }, categoryChip(theme.category, { small: true })),
        h('p', { class: 'play-card__word' }),
        h('p', { class: 'play-card__theme' }, theme.theme),
        h('span', { class: 'stamp stamp--yes', 'aria-hidden': 'true' }, 'Groin !'),
        h('span', { class: 'stamp stamp--no', 'aria-hidden': 'true' }, 'Intrus'),
      );

    const nextCard = makeCard('play-card--next');
    const card = makeCard('play-card--current');
    card.setAttribute('aria-live', 'polite');
    const deck = h('div', { class: 'deck' }, nextCard, card);

    const timerEl = h('div', { class: 'timer-pill', hidden: !game.timer }, icon('timer'), h('span', null, ''));

    const pauseLayer = h(
      'div',
      { class: 'pause-layer', hidden: true },
      h('div', { class: 'pause-layer__card card' },
        h('h2', null, 'Pause'),
        h('p', null, 'Le chrono est arrêté.'),
        h('button', { class: 'btn btn--primary btn--lg', type: 'button', onClick: () => resumeTimer() }, icon('play_arrow'), h('span', null, 'Reprendre')),
      ),
    );

    // ---------- Rendu des cartes ----------
    function setWord(el, item) {
      const word = el.querySelector('.play-card__word');
      word.textContent = item ? item.text : '';
      word.dataset.size = item ? wordSize(item.text) : 'l';
    }

    function showCurrent() {
      const i = round.index;
      setWord(card, round.deck[i]);
      setWord(nextCard, round.deck[i + 1]);
      nextCard.hidden = i + 1 >= round.deck.length;
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '';
      card.classList.remove('play-card--yes', 'play-card--no');
      card.style.setProperty('--drag', 0);
      [...dots.children].forEach((d, k) => d.classList.toggle('progress-dots__dot--current', k === i));
    }

    // ---------- Réponse ----------
    async function commit(saysYes) {
      if (locked || done) return;
      locked = true;
      const index = round.index;
      const res = answerCard(game, saysYes);
      if (!res) return;

      dots.children[index].classList.add(res.correct ? 'progress-dots__dot--ok' : 'progress-dots__dot--ko');
      playSound(res.correct ? 'correct' : 'wrong');
      haptic(res.correct ? 'correct' : 'wrong');
      if (res.correct) flySnout();
      else replayClass(deck, 'deck--shake');

      const dir = saysYes ? 1 : -1;
      card.classList.add(saysYes ? 'play-card--yes' : 'play-card--no');
      card.style.transition = `transform ${FLY_MS}ms cubic-bezier(.4,0,.2,1), opacity ${FLY_MS}ms ease`;
      card.style.transform = `translateX(${dir * 130}%) rotate(${dir * 22}deg)`;
      card.style.opacity = '0';
      nextCard.classList.add('play-card--reveal');

      await wait(FLY_MS);
      nextCard.classList.remove('play-card--reveal');
      if (res.finished) return finish();
      showCurrent();
      locked = false;
    }

    function flySnout() {
      const from = card.getBoundingClientRect();
      const to = scorePill.getBoundingClientRect();
      const fly = snout({ color: player.color, size: 44, cls: 'snout--flying' });
      fly.style.left = `${from.left + from.width / 2 - 22}px`;
      fly.style.top = `${from.top + from.height / 2 - 22}px`;
      document.body.append(fly);
      const dx = to.left + 14 - (from.left + from.width / 2 - 22);
      const dy = to.top + 4 - (from.top + from.height / 2 - 22);
      requestAnimationFrame(() => {
        fly.style.transform = `translate(${dx}px, ${dy}px) scale(.6) rotate(20deg)`;
      });
      setTimeout(() => {
        fly.remove();
        scoreVal.textContent = String(round.score);
        replayClass(scorePill, 'score-pill--bump');
      }, prefersReducedMotion() ? 0 : 420);
    }

    function finish() {
      if (done) return;
      done = true;
      clearInterval(timerId);
      const summary = finishRound();
      if (summary) replace('summary', { summary });
    }

    // ---------- Swipe (pointer events : tactile + souris) ----------
    let startX = 0;
    let dx = 0;
    let dragging = false;

    card.addEventListener('pointerdown', (e) => {
      if (locked || done || paused) return;
      dragging = true;
      startX = e.clientX;
      dx = 0;
      card.setPointerCapture(e.pointerId);
      card.style.transition = 'none';
    });
    card.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx * 0.06}deg)`;
      const p = Math.max(-1, Math.min(1, dx / SWIPE_THRESHOLD));
      card.style.setProperty('--drag', p.toFixed(3));
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        commit(dx > 0);
      } else {
        card.style.transition = 'transform .35s var(--ease-bounce)';
        card.style.transform = '';
        card.style.setProperty('--drag', 0);
      }
    };
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);

    const onKey = (e) => {
      if (e.key === 'ArrowRight') commit(true);
      else if (e.key === 'ArrowLeft') commit(false);
    };
    document.addEventListener('keydown', onKey);
    ctx.onCleanup(() => document.removeEventListener('keydown', onKey));

    // ---------- Chrono ----------
    let remaining = game.timer * 1000;
    let last = performance.now();
    let paused = false;
    let lastWhole = null;
    let timerId = null;

    function renderTimer() {
      const s = Math.max(0, Math.ceil(remaining / 1000));
      timerEl.lastChild.textContent = `${s} s`;
      timerEl.classList.toggle('timer-pill--urgent', s <= 5);
      if (s !== lastWhole && s <= 5 && s > 0) haptic('tap');
      lastWhole = s;
    }

    function pauseTimer(showLayer = true) {
      if (!game.timer || paused || done) return;
      paused = true;
      if (showLayer) pauseLayer.hidden = false;
    }
    function resumeTimer() {
      if (!paused) return;
      paused = false;
      last = performance.now();
      pauseLayer.hidden = true;
    }

    if (game.timer) {
      renderTimer();
      timerId = setInterval(() => {
        if (paused || done) return;
        const now = performance.now();
        remaining -= now - last;
        last = now;
        renderTimer();
        if (remaining <= 0) finish();
      }, 200);
      ctx.onCleanup(() => clearInterval(timerId));
      ctx.onCleanup(onAppPause(() => pauseTimer(true)));
    }

    // Quitter : on fige le chrono pendant la question.
    ctx.requestQuit = async () => {
      const wasPaused = paused;
      pauseTimer(false);
      await confirmQuit();
      if (!wasPaused && !done && getGame()) resumeTimer();
      return true;
    };

    showCurrent();

    return screen(
      topbar({
        onBack: () => ctx.requestQuit(),
        backIcon: 'close',
        backLabel: 'Quitter la partie',
        center: h(
          'div',
          { class: 'play__who' },
          avatar(player.color, { size: 28 }),
          h('div', null,
            h('h2', { class: 'play__name' }, player.name),
            h('p', { class: 'topbar__meta' }, `Manche ${currentRoundNumber(game)} / ${game.roundsPerPlayer}`),
          ),
        ),
        right: timerEl,
      }),
      body(h('div', { class: 'play__status' }, dots, scorePill), deck),
      footer(
        h(
          'div',
          { class: 'answer-row' },
          h('button', { class: 'answer-btn answer-btn--no', type: 'button', onClick: () => commit(false) },
            h('span', { class: 'answer-btn__icon' }, icon('close')), h('span', null, 'Intrus')),
          h('button', { class: 'answer-btn answer-btn--yes', type: 'button', onClick: () => commit(true) },
            h('span', { class: 'answer-btn__icon' }, icon('check')), h('span', null, 'Dans le thème')),
        ),
      ),
      pauseLayer,
    );
  },
};
