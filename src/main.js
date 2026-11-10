/**
 * Point d'entrée de l'application.
 */
// Polices embarquées (hors-ligne) — sous-ensemble latin uniquement.
import '@fontsource/fraunces/latin-400.css';
import '@fontsource/fraunces/latin-400-italic.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { initRouter, registerScreens, reset } from './core/router.js';
import { applyTheme } from './core/settings.js';
import { initAudio } from './core/audio.js';
import { initPlatform, hideSplash } from './core/platform.js';
import { loadThemes } from './data/themes.js';

import home from './ui/screens/home.js';
import setup from './ui/screens/setup.js';
import categories from './ui/screens/categories.js';
import ready from './ui/screens/ready.js';
import play from './ui/screens/play.js';
import summary from './ui/screens/summary.js';
import results from './ui/screens/results.js';
import rules from './ui/screens/rules.js';
import settings from './ui/screens/settings.js';
import stats from './ui/screens/stats.js';
import profile from './ui/screens/profile.js';

applyTheme();
initAudio();

initRouter(document.getElementById('app'));
registerScreens([home, setup, categories, ready, play, summary, results, rules, settings, stats, profile]);
initPlatform();
reset('home');
hideSplash();

// Préchargement des thèmes en tâche de fond.
loadThemes().catch(() => {});
