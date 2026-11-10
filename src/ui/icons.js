/**
 * Icônes Material Symbols Outlined (trait), embarquées en SVG.
 * La charte éditoriale en utilise très peu : seules celles listées ici
 * finissent dans le build (pas de police d'icônes, fonctionne hors-ligne).
 *
 * Ajouter une icône : https://fonts.google.com/icons → ajouter l'import ci-dessous.
 * Licence Apache 2.0 (Google).
 */
import { h } from '../core/dom.js';

import i_add from '@material-symbols/svg-400/outlined/add.svg?raw';
import i_arrow_back from '@material-symbols/svg-400/outlined/arrow_back.svg?raw';
import i_arrow_forward from '@material-symbols/svg-400/outlined/arrow_forward.svg?raw';
import i_category from '@material-symbols/svg-400/outlined/category.svg?raw';
import i_check from '@material-symbols/svg-400/outlined/check.svg?raw';
import i_chevron_right from '@material-symbols/svg-400/outlined/chevron_right.svg?raw';
import i_close from '@material-symbols/svg-400/outlined/close.svg?raw';
import i_delete from '@material-symbols/svg-400/outlined/delete.svg?raw';
import i_play_arrow from '@material-symbols/svg-400/outlined/play_arrow.svg?raw';
import i_swipe from '@material-symbols/svg-400/outlined/swipe.svg?raw';
import i_timer from '@material-symbols/svg-400/outlined/timer.svg?raw';

const ICONS = {
  add: i_add,
  arrow_back: i_arrow_back,
  arrow_forward: i_arrow_forward,
  category: i_category,
  check: i_check,
  chevron_right: i_chevron_right,
  close: i_close,
  delete: i_delete,
  play_arrow: i_play_arrow,
  swipe: i_swipe,
  timer: i_timer,
};

/**
 * @param {string} name   nom Material Symbols (snake_case)
 * @param {{size?: number, class?: string, label?: string}} [opts]
 */
export function icon(name, opts = {}) {
  const svg = ICONS[name] ?? ICONS.category;
  return h('span', {
    class: ['icon', opts.class],
    style: opts.size ? { '--icon-size': `${opts.size}px` } : null,
    'aria-hidden': opts.label ? null : 'true',
    role: opts.label ? 'img' : null,
    'aria-label': opts.label ?? null,
    html: svg,
  });
}
