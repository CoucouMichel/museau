#!/usr/bin/env node
/**
 * Valide (et optionnellement nettoie) public/data/themes.json.
 *
 *   node scripts/validate-data.mjs          → rapport, code de sortie 1 si erreur bloquante
 *   node scripts/validate-data.mjs --fix    → supprime les doublons et les espaces parasites
 *
 * Format attendu : tableau plat de lignes
 *   { category, theme, text, isRelated: "TRUE" | "FALSE" }
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CATEGORIES } from '../src/data/categories.js';

const FILE = fileURLToPath(new URL('../public/data/themes.json', import.meta.url));
const MIN_TRUE = 5;
const MIN_FALSE = 5;
const fix = process.argv.includes('--fix');

const rows = JSON.parse(readFileSync(FILE, 'utf8'));
const errors = [];
const warnings = [];
const known = new Set(Object.keys(CATEGORIES));

const seen = new Set();
const cleaned = [];
let duplicates = 0;

for (const [i, raw] of rows.entries()) {
  const row = {
    category: String(raw.category ?? '').trim(),
    theme: String(raw.theme ?? '').trim(),
    text: String(raw.text ?? '').trim(),
    isRelated: String(raw.isRelated).toUpperCase() === 'TRUE' ? 'TRUE' : 'FALSE',
  };
  if (!row.category || !row.theme || !row.text) {
    errors.push(`Ligne ${i} incomplète : ${JSON.stringify(raw)}`);
    continue;
  }
  if (!['TRUE', 'FALSE', true, false].includes(raw.isRelated)) {
    errors.push(`Ligne ${i} : isRelated invalide (${raw.isRelated})`);
  }
  if (!known.has(row.category)) {
    errors.push(`Ligne ${i} : catégorie inconnue « ${row.category} » (à déclarer dans src/data/categories.js)`);
  }
  const key = `${row.category}|${row.theme}|${row.text.toLowerCase()}`;
  if (seen.has(key)) {
    duplicates++;
    warnings.push(`Doublon : [${row.theme}] ${row.text}`);
    continue;
  }
  seen.add(key);
  cleaned.push(row);
}

// Statistiques par thème
const themes = new Map();
for (const r of cleaned) {
  const k = `${r.category} › ${r.theme}`;
  const t = themes.get(k) ?? { yes: 0, no: 0 };
  r.isRelated === 'TRUE' ? t.yes++ : t.no++;
  themes.set(k, t);
}
for (const [k, t] of themes) {
  if (t.yes < MIN_TRUE || t.no < MIN_FALSE) {
    warnings.push(`Thème déséquilibré « ${k} » : ${t.yes} vrais / ${t.no} intrus (min ${MIN_TRUE}/${MIN_FALSE})`);
  }
}
const perCat = {};
for (const k of themes.keys()) {
  const c = k.split(' › ')[0];
  perCat[c] = (perCat[c] ?? 0) + 1;
}
for (const c of known) {
  if ((perCat[c] ?? 0) < 3) warnings.push(`Catégorie « ${c} » : seulement ${perCat[c] ?? 0} thème(s)`);
}

console.log(`${rows.length} lignes · ${themes.size} thèmes · ${Object.keys(perCat).length} catégories`);
console.table(perCat);
warnings.forEach((w) => console.warn('⚠️ ', w));
errors.forEach((e) => console.error('❌', e));

if (fix && duplicates > 0) {
  writeFileSync(FILE, JSON.stringify(cleaned));
  console.log(`✅ ${duplicates} doublon(s) supprimé(s), fichier réécrit.`);
}
process.exit(errors.length ? 1 : 0);
