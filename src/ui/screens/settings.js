import { h } from '../../core/dom.js';
import { back, reset } from '../../core/router.js';
import { screen, topbar, body, segmented, toggle, sectionTitle, button, pageHead } from '../components/layout.js';
import { icon } from '../icons.js';
import { getSettings, setSetting } from '../../core/settings.js';
import { resetAllProfiles } from '../../core/profiles.js';
import { confirmDialog, openModal } from '../components/modal.js';
import { toast } from '../components/toast.js';
import { PRIVACY_TEXT } from '../../data/legal.js';
import './settings.css';

function row(title, desc, control) {
  return h('div', { class: 'setting-row' },
    h('div', { class: 'setting-row__text' }, h('h3', null, title), desc && h('p', null, desc)),
    control,
  );
}

export default {
  id: 'settings',
  render() {
    const s = getSettings();
    return screen(
      topbar({ title: 'Réglages', onBack: back }),
      body(
        pageHead('Paramètres'),
        h('section', { class: 'panel' },
          sectionTitle('Jeu'),
          row('Effets sonores', 'Bonnes réponses, erreurs, compte à rebours',
            toggle({ label: 'Effets sonores', checked: s.sound, onChange: (v) => setSetting('sound', v) })),
          row('Vibrations', 'Retour haptique pendant le jeu',
            toggle({ label: 'Vibrations', checked: s.haptics, onChange: (v) => setSetting('haptics', v) })),
        ),
        h('section', { class: 'panel' },
          sectionTitle('Apparence'),
          segmented({
            label: 'Thème',
            options: [
              { value: 'system', label: 'Auto' },
              { value: 'light', label: 'Clair' },
              { value: 'dark', label: 'Sombre' },
            ],
            value: s.theme,
            onChange: (v) => setSetting('theme', v),
          }),
        ),
        h('section', { class: 'panel' },
          sectionTitle('À propos'),
          h('button', { class: 'list-link', type: 'button', onClick: () => openModal({
            title: 'Confidentialité',
            body: h('div', { class: 'prose' }, PRIVACY_TEXT.map((p) => h('p', null, p))),
            actions: [{ label: 'Fermer', variant: 'primary' }],
          }) }, h('span', null, 'Politique de confidentialité'), icon('chevron_right')),
          h('p', { class: 'settings__version' }, `Museau v${__APP_VERSION__}`),
        ),
        h('section', { class: 'panel panel--danger' },
          button({
            label: 'Effacer joueurs et statistiques',
            variant: 'danger',
            onClick: async () => {
              const ok = await confirmDialog({
                title: 'Tout effacer ?',
                message: 'Tous les joueurs et leurs statistiques seront supprimés de cet appareil. C’est définitif.',
                confirmLabel: 'Effacer',
                danger: true,
              });
              if (ok) {
                resetAllProfiles();
                toast('Données effacées');
                reset('home');
              }
            },
          }),
        ),
      ),
    );
  },
};
