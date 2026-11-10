/**
 * Le groin : monogramme de Museau, en trait fin (d'après assets/logo-outline.png).
 * Il hérite de la couleur du texte (currentColor) : on le colore en CSS.
 */
import { h } from '../../core/dom.js';

const DOME =
  'M60 6C93 6 114 30 114 57c0 20-10 27-28 27-10 0-17-3-26-3s-16 3-26 3C16 84 6 77 6 57 6 30 27 6 60 6Z';

/**
 * @param {{stroke?: number}} [o] épaisseur du trait (unités du viewBox 120×90)
 * @returns {string} balise <svg>
 */
export function snoutSvg({ stroke = 4 } = {}) {
  return `<svg viewBox="-2 0 124 92" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="snout-line" stroke-width="${stroke}">
      <path d="${DOME}"/>
      <ellipse cx="40" cy="54" rx="9" ry="14" transform="rotate(18 40 54)"/>
      <ellipse cx="80" cy="54" rx="9" ry="14" transform="rotate(-18 80 54)"/>
    </g>
  </svg>`;
}

/** Avatar rond d'un joueur : cercle fin + groin à sa couleur. */
export function avatar(color, { size = 40, label } = {}) {
  return h('span', {
    class: 'avatar',
    style: { '--avatar-color': color, '--avatar-size': `${size}px` },
    role: label ? 'img' : null,
    'aria-label': label ?? null,
    'aria-hidden': label ? null : 'true',
    html: snoutSvg({ stroke: size > 60 ? 4 : 6 }),
  });
}

/** Groin seul (état vide, ornements). */
export function snout({ size = 24, stroke = 5, cls } = {}) {
  return h('span', {
    class: ['snout', cls],
    style: { '--snout-size': `${size}px` },
    'aria-hidden': 'true',
    html: snoutSvg({ stroke }),
  });
}

/** Logo complet : monogramme + nom + devise. */
export function logo() {
  return h(
    'div',
    { class: 'logo' },
    h('div', { class: 'logo__mark', html: snoutSvg({ stroke: 4 }) }),
    h('h1', { class: 'logo__name' }, 'Museau'),
    h('p', { class: 'logo__tagline' }, 'Groin ou pas groin ?'),
  );
}
