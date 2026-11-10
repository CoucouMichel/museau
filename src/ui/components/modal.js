/**
 * Fenêtres modales (remplacent alert()/confirm() natifs).
 *
 *   const ok = await confirmDialog({ title: 'Quitter ?', confirmLabel: 'Quitter', danger: true });
 */
import { h } from '../../core/dom.js';
import { icon } from '../icons.js';

const stack = [];

/**
 * @param {{title: string, body?: Node|string, actions?: Array<{label:string, variant?:string, value?:any, icon?:string}>, dismissValue?: any, onOpen?: (card: HTMLElement, close: Function) => void}} opts
 * @returns {Promise<any>} valeur de l'action choisie
 */
export function openModal({ title, body, actions = [], dismissValue = null, onOpen }) {
  return new Promise((resolve) => {
    const titleId = `modal-title-${Date.now()}`;
    let closed = false;

    const close = (value) => {
      if (closed) return;
      closed = true;
      stack.splice(stack.indexOf(entry), 1);
      backdrop.classList.add('modal--leaving');
      setTimeout(() => backdrop.remove(), 180);
      document.removeEventListener('keydown', onKey);
      lastFocus?.focus?.();
      resolve(value);
    };

    const onKey = (e) => {
      if (e.key === 'Escape' && stack.at(-1) === entry) close(dismissValue);
    };

    const card = h(
      'div',
      { class: 'modal__card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
      h('h2', { class: 'modal__title', id: titleId }, title),
      body != null && h('div', { class: 'modal__body' }, body),
      actions.length > 0 &&
        h(
          'div',
          { class: 'modal__actions' },
          actions.map((a) =>
            h(
              'button',
              { class: ['btn', `btn--${a.variant ?? 'ghost'}`], type: 'button', onClick: () => close(a.value) },
              a.icon && icon(a.icon),
              a.label,
            ),
          ),
        ),
    );

    const backdrop = h('div', { class: 'modal' }, card);
    backdrop.addEventListener('pointerdown', (e) => {
      if (e.target === backdrop) close(dismissValue);
    });

    const lastFocus = document.activeElement;
    const entry = { close: () => close(dismissValue) };
    stack.push(entry);
    document.body.append(backdrop);
    document.addEventListener('keydown', onKey);
    onOpen?.(card, close);
    requestAnimationFrame(() => {
      const focusable = card.querySelector('input, .btn--primary, .btn--danger, button');
      focusable?.focus();
    });
  });
}

export function confirmDialog({ title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', danger = false }) {
  return openModal({
    title,
    body: message,
    dismissValue: false,
    actions: [
      { label: cancelLabel, variant: 'ghost', value: false },
      { label: confirmLabel, variant: danger ? 'danger' : 'primary', value: true },
    ],
  });
}

/** Ferme la modale du dessus (bouton retour Android). */
export function closeTopModal() {
  const top = stack.at(-1);
  if (!top) return false;
  top.close();
  return true;
}
