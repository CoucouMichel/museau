/** Petits messages éphémères en bas d'écran. */
import { h } from '../../core/dom.js';

let current = null;

export function toast(message, { duration = 2200 } = {}) {
  current?.remove();
  const el = h('div', { class: 'toast', role: 'status' }, message);
  document.body.append(el);
  current = el;
  setTimeout(() => {
    el.classList.add('toast--leaving');
    setTimeout(() => el.remove(), 200);
  }, duration);
}
