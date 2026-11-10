/**
 * Mini-helper de création DOM (hyperscript).
 *
 *   h('button', { class: 'btn', onClick: go }, icon('add'), 'Ajouter')
 *
 * Les textes sont TOUJOURS insérés comme texte (pas d'injection HTML possible
 * via un pseudo ou une donnée). Seule la prop `html` insère du HTML brut :
 * à réserver aux SVG internes.
 */
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') el.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : value;
      else if (key === 'style') {
        for (const [prop, v] of Object.entries(value)) {
          if (v == null) continue;
          if (prop.startsWith('--')) el.style.setProperty(prop, v);
          else el.style[prop] = v;
        }
      } else if (key === 'dataset') Object.assign(el.dataset, value);
      else if (key === 'html') el.innerHTML = value;
      else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value === true) el.setAttribute(key, '');
      else el.setAttribute(key, value);
    }
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : String(child));
  }
  return el;
}

/** Force un reflow (utile pour rejouer une animation CSS). */
export const reflow = (el) => void el.offsetWidth;

/** Rejoue une classe d'animation. */
export function replayClass(el, cls) {
  el.classList.remove(cls);
  reflow(el);
  el.classList.add(cls);
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
