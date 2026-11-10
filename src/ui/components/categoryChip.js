import { h } from '../../core/dom.js';
import { icon } from '../icons.js';
import { getCategory } from '../../data/categories.js';

/** Pastille de catégorie (icône + nom). */
export function categoryChip(name, { small = false } = {}) {
  const cat = getCategory(name);
  return h(
    'span',
    { class: ['cat-chip', small && 'cat-chip--sm'], style: { '--cat': cat.color } },
    h('span', { class: 'cat-chip__icon' }, icon(cat.icon)),
    name,
  );
}
