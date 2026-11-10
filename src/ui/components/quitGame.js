/** Confirmation d'abandon de partie, partagée par les écrans de jeu. */
import { confirmDialog } from './modal.js';
import { reset } from '../../core/router.js';
import { abandon } from '../../game/session.js';

export async function confirmQuit() {
  const ok = await confirmDialog({
    title: 'Quitter la partie ?',
    message: 'Les manches déjà jouées restent dans les statistiques.',
    confirmLabel: 'Quitter',
    cancelLabel: 'Continuer',
    danger: true,
  });
  if (ok) {
    abandon();
    reset('home');
  }
  return true;
}
