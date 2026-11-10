/** Modale de création d'un joueur (pseudo + couleur du groin). */
import { h } from '../../core/dom.js';
import { openModal } from './modal.js';
import { avatar } from './snout.js';
import { PLAYER_COLORS, MAX_NAME_LENGTH, createProfile, suggestColor, listProfiles } from '../../core/profiles.js';
import { haptic } from '../../core/haptics.js';

/** @returns {Promise<object|null>} le profil créé, ou null si annulé */
export function newPlayerModal() {
  let color = suggestColor();
  const used = new Set(listProfiles().map((p) => p.color));

  const preview = h('div', { class: 'player-form__preview' }, avatar(color, { size: 72 }));
  const error = h('p', { class: 'player-form__error', role: 'alert' });
  const input = h('input', {
    class: 'input',
    type: 'text',
    maxlength: String(MAX_NAME_LENGTH),
    placeholder: 'Ex. Chloé',
    autocomplete: 'off',
    enterkeyhint: 'done',
    'aria-label': 'Pseudo',
  });

  const swatches = h(
    'div',
    { class: 'swatches', role: 'radiogroup', 'aria-label': 'Couleur du groin' },
    PLAYER_COLORS.map((c) => {
      const btn = h(
        'button',
        {
          class: ['swatch', used.has(c) && 'swatch--used'],
          type: 'button',
          role: 'radio',
          'aria-checked': String(c === color),
          'aria-label': `Couleur ${c}${used.has(c) ? ' (déjà prise)' : ''}`,
          style: { '--swatch': c },
          onClick: () => {
            haptic('tap');
            color = c;
            swatches.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-checked', String(s === btn)));
            preview.replaceChildren(avatar(color, { size: 72 }));
          },
        },
      );
      return btn;
    }),
  );

  const form = h(
    'form',
    { class: 'player-form' },
    preview,
    h('label', { class: 'field' }, h('span', { class: 'field__label' }, 'Pseudo'), input),
    error,
    h('div', { class: 'field' }, h('span', { class: 'field__label' }, 'Couleur du groin'), swatches),
  );

  return openModal({
    title: 'Nouveau joueur',
    body: form,
    dismissValue: null,
    actions: [
      { label: 'Annuler', variant: 'ghost', value: null },
      { label: 'Créer', variant: 'primary', value: 'submit' },
    ],
    onOpen(card, close) {
      const submit = () => {
        const res = createProfile(input.value, color);
        if (!res.ok) {
          error.textContent = res.error;
          haptic('wrong');
          input.focus();
          return;
        }
        close(res.profile);
      };
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submit();
      });
      // Le bouton « Créer » renvoie 'submit' : on l'intercepte pour valider d'abord.
      const createBtn = card.querySelector('.btn--primary');
      createBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        submit();
      }, { capture: true });
      setTimeout(() => input.focus(), 50);
    },
  });
}
