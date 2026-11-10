/**
 * Navigation entre écrans avec pile d'historique.
 *
 * Un écran est un objet :
 *   {
 *     id: 'home',
 *     render(params, ctx) → HTMLElement,   // construit l'écran
 *     onBack?(ctx) → boolean | Promise<boolean>  // true = retour géré par l'écran
 *   }
 * `ctx.onCleanup(fn)` enregistre une fonction appelée quand on quitte l'écran
 * (timers, listeners…).
 *
 * Le bouton retour Android / navigateur appelle `back()` (voir platform.js).
 */
const screens = new Map();
let stack = [];
let root = null;
let active = null;

export function registerScreens(list) {
  for (const s of list) screens.set(s.id, s);
}

export function initRouter(rootEl) {
  root = rootEl;
}

/** Ouvre un écran par-dessus le courant. */
export function go(id, params = {}) {
  stack.push({ id, params });
  render('forward');
}

/** Remplace l'écran courant (pas de retour possible vers lui). */
export function replace(id, params = {}) {
  stack.pop();
  stack.push({ id, params });
  render('fade');
}

/** Vide la pile et repart d'un écran (ex. retour au menu). */
export function reset(id = 'home', params = {}) {
  stack = [{ id, params }];
  render('back');
}

/** Revient en arrière. Renvoie false si on est déjà à la racine. */
export async function back() {
  if (active?.screen.onBack) {
    const handled = await active.screen.onBack(active.ctx);
    if (handled) return true;
  }
  if (stack.length <= 1) return false;
  stack.pop();
  render('back');
  return true;
}

export const currentScreenId = () => stack.at(-1)?.id;

function render(direction) {
  const { id, params } = stack.at(-1);
  const screen = screens.get(id);
  if (!screen) throw new Error(`Écran inconnu : ${id}`);

  if (active) active.cleanups.forEach((fn) => fn());

  const cleanups = [];
  const ctx = { params, onCleanup: (fn) => cleanups.push(fn) };
  const el = screen.render(params, ctx);
  el.classList.add('screen', `screen--${id}`, `screen--enter-${direction}`);
  el.addEventListener('animationend', () => el.classList.remove(`screen--enter-${direction}`), { once: true });

  root.replaceChildren(el);
  active = { screen, ctx, cleanups };

  // Accessibilité : on place le focus sur le titre du nouvel écran.
  const title = el.querySelector('h1, h2');
  if (title) {
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  }
}
