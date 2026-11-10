/**
 * Briques de mise en page partagées par tous les écrans.
 *
 *   screen(
 *     topbar({ title: 'Paramètres', onBack: back }),
 *     body(...contenu défilant),
 *     footer(bouton principal),
 *   )
 */
import { h } from '../../core/dom.js';
import { icon } from '../icons.js';
import { haptic } from '../../core/haptics.js';

export const screen = (...children) => h('section', null, ...children);

/**
 * @param {{title?: string|Node, onBack?: Function, backIcon?: string, backLabel?: string, right?: Node, center?: Node}} o
 */
export function topbar({ title, onBack, backIcon = 'arrow_back', backLabel = 'Retour', right, center }) {
  return h(
    'header',
    { class: 'topbar' },
    h('div', { class: 'topbar__side' }, onBack && iconButton(backIcon, backLabel, onBack)),
    h('div', { class: 'topbar__center' }, center ?? (title != null && h('h2', { class: 'topbar__title' }, title))),
    h('div', { class: 'topbar__side topbar__side--right' }, right),
  );
}

export const body = (...children) => h('main', { class: 'screen__body' }, ...children);
export const footer = (...children) => h('footer', { class: 'screen__footer' }, ...children);

export function iconButton(name, label, onClick, cls) {
  return h(
    'button',
    {
      class: ['icon-btn', cls],
      type: 'button',
      'aria-label': label,
      title: label,
      onClick: (e) => {
        haptic('tap');
        onClick(e);
      },
    },
    icon(name),
  );
}

/**
 * Bouton standard.
 * @param {{label: string|Node, onClick?: Function, variant?: 'primary'|'ghost'|'yes'|'no'|'danger', icon?: string, size?: 'lg'|'sm', disabled?: boolean, cls?: string}} o
 */
export function button({ label, onClick, variant = 'primary', icon: iconName, size, disabled, cls, ...rest }) {
  return h(
    'button',
    {
      class: ['btn', `btn--${variant}`, size && `btn--${size}`, cls],
      type: 'button',
      disabled,
      onClick: (e) => {
        haptic('tap');
        onClick?.(e);
      },
      ...rest,
    },
    iconName && icon(iconName),
    h('span', null, label),
  );
}

/**
 * Sélecteur segmenté (radio).
 * @param {{label: string, options: Array<{value:any, label:string}>, value: any, onChange: Function}} o
 */
export function segmented({ label, options, value, onChange }) {
  const group = h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': label });
  const render = (current) => {
    group.replaceChildren(
      ...options.map((opt) =>
        h(
          'button',
          {
            class: 'segmented__opt',
            type: 'button',
            role: 'radio',
            'aria-checked': String(opt.value === current),
            onClick: () => {
              haptic('tap');
              render(opt.value);
              onChange(opt.value);
            },
          },
          opt.label,
        ),
      ),
    );
  };
  render(value);
  return group;
}

/** Interrupteur on/off accessible. */
export function toggle({ checked, onChange, label }) {
  const input = h('input', { type: 'checkbox', class: 'switch__input', 'aria-label': label });
  input.checked = checked;
  input.addEventListener('change', () => {
    haptic('tap');
    onChange(input.checked);
  });
  return h('label', { class: 'switch' }, input, h('span', { class: 'switch__track', 'aria-hidden': 'true' }));
}

/** Titre de section. */
export const sectionTitle = (text, extra) => h('div', { class: 'section-title' }, h('h3', null, text), extra);

/** Grand titre d'écran en romain + chapeau en italique bordeaux. */
export const pageHead = (title, lede) =>
  h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, title), lede && h('p', { class: 'page-lede' }, lede));
