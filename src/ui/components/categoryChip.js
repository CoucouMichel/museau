import { h } from '../../core/dom.js';
import { getCategory } from '../../data/categories.js';

/** Catégorie : carré de couleur + nom en capitales espacées. */
export function categoryChip(name) {
  const cat = getCategory(name);
  return h(
    'span',
    { class: 'cat-chip', style: { '--cat': cat.color } },
    h('span', { class: 'cat-chip__icon', 'aria-hidden': 'true' }),
    name,
  );
}
