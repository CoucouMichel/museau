/**
 * Intégration plateforme : bouton retour Android, cycle de vie de l'app,
 * barre d'état, splash screen. Fonctionne aussi dans un navigateur.
 */
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { back } from './router.js';
import { closeTopModal } from '../ui/components/modal.js';
import { suspendAudio, resumeAudio } from './audio.js';
import { onSettingsChange, resolvedTheme } from './settings.js';

export const isNative = Capacitor.isNativePlatform();

const pauseListeners = new Set();
const resumeListeners = new Set();

/** S'abonner à la mise en arrière-plan de l'app (appel entrant, home…). */
export function onAppPause(fn) {
  pauseListeners.add(fn);
  return () => pauseListeners.delete(fn);
}
export function onAppResume(fn) {
  resumeListeners.add(fn);
  return () => resumeListeners.delete(fn);
}

async function handleBack() {
  if (closeTopModal()) return true;
  return back();
}

function emitPause() {
  suspendAudio();
  pauseListeners.forEach((fn) => fn());
}
function emitResume() {
  resumeAudio();
  resumeListeners.forEach((fn) => fn());
}

async function syncStatusBar() {
  if (!isNative) return;
  try {
    const dark = resolvedTheme() === 'dark';
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    const color = getComputedStyle(document.documentElement).getPropertyValue('--c-paper').trim();
    await StatusBar.setBackgroundColor({ color });
  } catch {
    /* plugin indisponible */
  }
}

export function initPlatform() {
  if (isNative) {
    App.addListener('backButton', async () => {
      const handled = await handleBack();
      if (!handled) App.minimizeApp();
    });
    App.addListener('pause', emitPause);
    App.addListener('resume', emitResume);
    syncStatusBar();
    onSettingsChange((_, key) => key === 'resolvedTheme' && syncStatusBar());
  } else {
    // Navigateur / PWA : on intercepte le bouton « précédent » via une entrée sentinelle.
    history.replaceState({ museau: 'root' }, '');
    history.pushState({ museau: 'app' }, '');
    window.addEventListener('popstate', async () => {
      const handled = await handleBack();
      if (handled) history.pushState({ museau: 'app' }, '');
      else history.back();
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? emitPause() : emitResume()));
  }
}

export function hideSplash() {
  if (isNative) SplashScreen.hide().catch(() => {});
}
