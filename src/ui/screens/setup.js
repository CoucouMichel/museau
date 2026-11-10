/**
 * Préparation de la partie : joueurs, nombre de manches, chrono.
 */
import { h } from '../../core/dom.js';
import { go, back } from '../../core/router.js';
import { screen, topbar, body, footer, button, segmented, sectionTitle, pageHead } from '../components/layout.js';
import { avatar } from '../components/snout.js';
import { icon } from '../icons.js';
import { listProfiles } from '../../core/profiles.js';
import { getSetting, setSetting } from '../../core/settings.js';
import { newPlayerModal } from '../components/playerModal.js';
import { haptic } from '../../core/haptics.js';
import './setup.css';

export const MAX_PLAYERS = 8;
const ROUND_OPTIONS = [1, 3, 5, 10];
const TIMER_OPTIONS = [0, 20, 30, 45];

/** Sélection mémorisée pendant la session (ordre = ordre de passage). */
let selection = [];

export default {
  id: 'setup',
  render({ mode }) {
    const solo = mode === 'solo';
    const min = solo ? 1 : 2;
    const max = solo ? 1 : MAX_PLAYERS;
    const saved = getSetting('lastSetup');
    const setup = {
      roundsPerPlayer: ROUND_OPTIONS.includes(saved.roundsPerPlayer) ? saved.roundsPerPlayer : 3,
      timer: TIMER_OPTIONS.includes(saved.timer) ? saved.timer : 0,
    };

    const profilesIds = new Set(listProfiles().map((p) => p.id));
    selection = selection.filter((id) => profilesIds.has(id)).slice(0, max);
    if (selection.length === 0) selection = listProfiles().slice(0, min).map((p) => p.id);

    const counter = h('span', { class: 'counter-chip' });
    const grid = h('div', { class: 'player-grid' });
    const hint = h('p', { class: 'setup__hint' });
    const startBtn = button({
      label: 'Choisir les catégories',
      onClick: () => {
        setSetting('lastSetup', { ...getSetting('lastSetup'), roundsPerPlayer: setup.roundsPerPlayer, timer: setup.timer });
        go('categories', { playerIds: [...selection], roundsPerPlayer: setup.roundsPerPlayer, timer: setup.timer });
      },
    });

    function toggle(id) {
      haptic('tap');
      if (solo) selection = [id];
      else if (selection.includes(id)) selection = selection.filter((x) => x !== id);
      else if (selection.length < max) selection = [...selection, id];
      else haptic('wrong');
      refresh();
    }

    async function addPlayer() {
      const profile = await newPlayerModal();
      if (!profile) return;
      if (solo) selection = [profile.id];
      else if (selection.length < max) selection = [...selection, profile.id];
      refresh();
    }

    function refresh() {
      const profiles = listProfiles();
      grid.replaceChildren(
        ...profiles.map((p) => {
          const order = selection.indexOf(p.id);
          const selected = order >= 0;
          return h(
            'button',
            {
              class: ['player-chip', selected && 'player-chip--selected'],
              type: 'button',
              'aria-pressed': String(selected),
              style: { '--player-color': p.color },
              onClick: () => toggle(p.id),
            },
            avatar(p.color, { size: 36 }),
            h('span', { class: 'player-chip__name' }, p.name),
            selected && h('span', { class: 'player-chip__badge' }, solo ? icon('check') : String(order + 1)),
          );
        }),
        h(
          'button',
          { class: 'player-chip player-chip--add', type: 'button', onClick: addPlayer },
          h('span', { class: 'player-chip__plus' }, icon('add')),
          h('span', { class: 'player-chip__name' }, 'Nouveau'),
        ),
      );

      const n = selection.length;
      counter.textContent = solo ? `${n}/1` : `${n}/${max}`;
      counter.classList.toggle('counter-chip--ok', n >= min);
      const ok = n >= min && n <= max;
      startBtn.disabled = !ok;
      hint.textContent = profiles.length === 0
        ? 'Crée ton premier joueur pour commencer.'
        : solo
          ? 'Qui joue\u202f?'
          : n < min
            ? `Sélectionne au moins ${min} joueurs. L’ordre de sélection donne l’ordre de passage.`
            : 'L’ordre de sélection donne l’ordre de passage.';
    }

    refresh();

    return screen(
      topbar({ title: 'Étape 1 sur 2', onBack: back }),
      body(
        pageHead(solo ? 'Partie solo' : 'Entre amis', solo ? 'Seul face aux intrus.' : 'Le téléphone passera de main en main.'),
        h(
          'section',
          { class: 'panel' },
          sectionTitle(solo ? 'Joueur' : 'Joueurs', counter),
          hint,
          grid,
        ),
        h(
          'section',
          { class: 'panel' },
          sectionTitle(solo ? 'Nombre de manches' : 'Manches par joueur'),
          segmented({
            label: 'Nombre de manches',
            options: ROUND_OPTIONS.map((v) => ({ value: v, label: String(v) })),
            value: setup.roundsPerPlayer,
            onChange: (v) => (setup.roundsPerPlayer = v),
          }),
        ),
        h(
          'section',
          { class: 'panel' },
          sectionTitle('Chrono par manche'),
          segmented({
            label: 'Chrono',
            options: TIMER_OPTIONS.map((v) => ({ value: v, label: v ? `${v} s` : 'Sans' })),
            value: setup.timer,
            onChange: (v) => (setup.timer = v),
          }),
        ),
      ),
      footer(startBtn),
    );
  },
};
