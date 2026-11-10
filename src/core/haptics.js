/**
 * Retours haptiques : plugin natif Capacitor sur Android, API Vibration sur le web.
 */
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { getSetting } from './settings.js';

const native = Capacitor.isNativePlatform();

const WEB_PATTERNS = { tap: 8, correct: 15, wrong: [30, 40, 30], success: [20, 60, 20, 60, 40] };

/** @param {'tap'|'correct'|'wrong'|'success'} kind */
export function haptic(kind = 'tap') {
  if (!getSetting('haptics')) return;
  try {
    if (native) {
      if (kind === 'tap') Haptics.impact({ style: ImpactStyle.Light });
      else if (kind === 'correct') Haptics.impact({ style: ImpactStyle.Medium });
      else if (kind === 'wrong') Haptics.notification({ type: NotificationType.Error });
      else Haptics.notification({ type: NotificationType.Success });
    } else {
      navigator.vibrate?.(WEB_PATTERNS[kind]);
    }
  } catch {
    /* pas de vibreur : on ignore */
  }
}
