/**
 * Le groin : mascotte, logo et avatar des joueurs.
 * Silhouette dérivée de assets/logo-outline.png, dessinée en SVG pour être
 * nette à toutes les tailles et colorable à volonté.
 */
import { h } from '../../core/dom.js';

const DOME =
  'M60 6C93 6 114 30 114 57c0 20-10 27-28 27-10 0-17-3-26-3s-16 3-26 3C16 84 6 77 6 57 6 30 27 6 60 6Z';

/**
 * @param {{color?: string, line?: string, nostril?: string, shine?: boolean}} [o]
 * @returns {string} balise <svg>
 */
export function snoutSvg({ color = 'var(--c-groin)', line = 'var(--c-line)', nostril = 'var(--c-line)', shine = true } = {}) {
  return `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${DOME}" fill="${color}" stroke="${line}" stroke-width="6" stroke-linejoin="round"/>
    ${shine ? '<ellipse cx="36" cy="24" rx="12" ry="6" transform="rotate(-24 36 24)" fill="#fff" opacity=".55"/>' : ''}
    <ellipse cx="40" cy="54" rx="9" ry="14" transform="rotate(18 40 54)" fill="${nostril}"/>
    <ellipse cx="80" cy="54" rx="9" ry="14" transform="rotate(-18 80 54)" fill="${nostril}"/>
  </svg>`;
}

/** Avatar rond d'un joueur. */
export function avatar(color, { size = 40, label } = {}) {
  return h('span', {
    class: 'avatar',
    style: { '--avatar-color': color, '--avatar-size': `${size}px` },
    role: label ? 'img' : null,
    'aria-label': label ?? null,
    'aria-hidden': label ? null : 'true',
    html: snoutSvg({ color, shine: false }),
  });
}

/** Petit groin seul (compteur de score, groin volant…). */
export function snout({ color, size = 24, cls } = {}) {
  return h('span', {
    class: ['snout', cls],
    style: { '--snout-size': `${size}px` },
    'aria-hidden': 'true',
    html: snoutSvg({ color, shine: false }),
  });
}

/** Logo complet : groin + nom. */
export function logo() {
  return h(
    'div',
    { class: 'logo' },
    h('div', { class: 'logo__mark', html: snoutSvg() }),
    h('h1', { class: 'logo__name' }, 'museau'),
    h('p', { class: 'logo__tagline' }, 'groin ou pas groin ?'),
  );
}
