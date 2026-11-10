/**
 * Effets sonores via Web Audio (latence faible sur Android, contrairement à <audio>).
 * Les fichiers sont dans public/audio/. Le contexte audio est créé au premier
 * geste de l'utilisateur (obligatoire sur mobile).
 */
import { getSetting } from './settings.js';

const BASE = `${import.meta.env.BASE_URL}audio/`;
const SOUNDS = {
  correct: ['correct.mp3'],
  wrong: ['wrong-1.mp3', 'wrong-2.mp3', 'wrong-3.mp3', 'wrong-4.mp3', 'wrong-5.mp3'],
  tick: ['tick.mp3'],
  go: ['go.mp3'],
  victory: ['victory.mp3'],
};

let ctx = null;
const buffers = new Map();
let loading = null;

function load() {
  if (loading) return loading;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return Promise.resolve();
  ctx = new Ctx();
  const files = [...new Set(Object.values(SOUNDS).flat())];
  loading = Promise.all(
    files.map(async (file) => {
      try {
        const res = await fetch(BASE + file);
        const data = await res.arrayBuffer();
        buffers.set(file, await ctx.decodeAudioData(data));
      } catch (e) {
        console.warn('[audio] chargement impossible', file, e);
      }
    }),
  );
  return loading;
}

/** À appeler une fois au démarrage : déverrouille l'audio au premier contact. */
export function initAudio() {
  const unlock = () => {
    load();
    ctx?.resume?.();
    window.removeEventListener('pointerdown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
}

/** @param {keyof typeof SOUNDS} name */
export function playSound(name) {
  if (!getSetting('sound') || !ctx) return;
  const variants = SOUNDS[name];
  const file = variants[Math.floor(Math.random() * variants.length)];
  const buffer = buffers.get(file);
  if (!buffer) return;
  if (ctx.state === 'suspended') ctx.resume();
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
}

/** Coupe le son quand l'app passe en arrière-plan. */
export function suspendAudio() {
  ctx?.suspend?.();
}
export function resumeAudio() {
  ctx?.resume?.();
}
