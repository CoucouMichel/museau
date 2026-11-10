/** Pluie de confettis et de groins. Renvoie une fonction qui l'arrête. */
import { h, prefersReducedMotion } from '../../core/dom.js';
import { snoutSvg } from './snout.js';

const COLORS = ['#FF6F9C', '#FFC23D', '#1FBF75', '#3D8BFF', '#9B5DE5'];

export function celebrate(colors = COLORS, count = 42) {
  if (prefersReducedMotion()) return () => {};
  const layer = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const isSnout = i % 4 === 0;
    const piece = h('span', {
      class: ['confetti__piece', isSnout && 'confetti__piece--snout'],
      style: {
        left: `${Math.random() * 100}%`,
        '--c': color,
        '--d': `${2.2 + Math.random() * 1.8}s`,
        '--delay': `${Math.random() * 1.2}s`,
        '--x': `${(Math.random() - 0.5) * 120}px`,
        '--r': `${(Math.random() - 0.5) * 900}deg`,
      },
      html: isSnout ? snoutSvg({ color, shine: false }) : null,
    });
    layer.append(piece);
  }
  document.body.append(layer);
  const timer = setTimeout(() => layer.remove(), 5000);
  return () => {
    clearTimeout(timer);
    layer.remove();
  };
}
