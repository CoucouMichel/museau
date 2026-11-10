/**
 * Référentiel unique des catégories.
 *
 * Ajouter une catégorie = ajouter une entrée ici + des lignes dans
 * public/data/themes.json. Rien d'autre à toucher dans le code.
 *
 *  - color   : couleur de la catégorie (identique en clair et en sombre,
 *              la lisibilité est assurée par le contour encre)
 *  - icon    : nom d'icône Material Symbols (voir src/ui/icons.js)
 *  - pattern : icônes utilisées pour le motif de fond des cartes
 */
export const CATEGORIES = {
  Art: {
    color: '#F5A524',
    icon: 'palette',
    pattern: ['palette', 'brush', 'museum'],
    description: 'Peinture, sculpture, œuvres de maîtres et mouvements artistiques.',
  },
  'Cinéma & TV': {
    color: '#EF4E4E',
    icon: 'movie',
    pattern: ['movie', 'theaters', 'tv'],
    description: "Filmographies d'acteurs, réalisateurs, séries cultes et cérémonies.",
  },
  Décalé: {
    color: '#E25FC4',
    icon: 'sentiment_very_satisfied',
    pattern: ['sentiment_very_satisfied', 'toys', 'celebration'],
    description: 'Critères transversaux, caractéristiques surprenantes et objets du quotidien.',
  },
  Gastronomie: {
    color: '#F97B3B',
    icon: 'restaurant',
    pattern: ['restaurant', 'local_pizza', 'wine_bar'],
    description: 'Plats régionaux, ingrédients phares, vins, spiritueux et cocktails.',
  },
  Geek: {
    color: '#8A63F2',
    icon: 'sports_esports',
    pattern: ['sports_esports', 'smart_toy', 'rocket_launch'],
    description: 'Jeux vidéo, comics, mangas, science-fiction, fantasy et mascottes.',
  },
  Géographie: {
    color: '#2B8CE6',
    icon: 'public',
    pattern: ['public', 'explore', 'landscape'],
    description: 'Capitales, frontières, fleuves, monuments mondiaux et transports.',
  },
  Histoire: {
    color: '#C7863A',
    icon: 'castle',
    pattern: ['castle', 'history_edu', 'swords'],
    description: 'Grandes périodes, dirigeants, conflits majeurs, héros et mythes antiques.',
  },
  Littérature: {
    color: '#A452D9',
    icon: 'auto_stories',
    pattern: ['auto_stories', 'stylus', 'menu_book'],
    description: 'Romans classiques, bande dessinée franco-belge, théâtre et poésie.',
  },
  Musique: {
    color: '#5465F0',
    icon: 'music_note',
    pattern: ['music_note', 'headphones', 'piano'],
    description: "Discographies d'artistes, groupes mythiques, titres cultes et courants.",
  },
  Nature: {
    color: '#22B573',
    icon: 'forest',
    pattern: ['forest', 'pets', 'eco'],
    description: 'Faune, flore, races animales, botanique et habitats naturels.',
  },
  Science: {
    color: '#14B3C7',
    icon: 'science',
    pattern: ['science', 'biotech', 'planet'],
    description: 'Astronomie, chimie, physique, médecine et grandes inventions.',
  },
  Sport: {
    color: '#86C232',
    icon: 'sports_soccer',
    pattern: ['sports_soccer', 'sports_basketball', 'trophy'],
    description: 'Palmarès internationaux, tournois majeurs, athlètes de légende et records.',
  },
};

const FALLBACK = {
  color: '#FF6F9C',
  icon: 'category',
  pattern: ['category'],
  description: '',
};

/** @param {string} name */
export function getCategory(name) {
  return CATEGORIES[name] ?? FALLBACK;
}

/** Liste triée alphabétiquement (ordre français). */
export function categoryNames() {
  return Object.keys(CATEGORIES).sort((a, b) => a.localeCompare(b, 'fr'));
}
