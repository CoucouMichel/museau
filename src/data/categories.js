/**
 * Référentiel unique des catégories.
 *
 * Ajouter une catégorie = ajouter une entrée ici + des lignes dans
 * public/data/themes.json. Rien d'autre à toucher dans le code.
 *
 *  - color   : couleur de la catégorie, volontairement sourde (registre
 *              « encre d'imprimerie ») ; éclaircie automatiquement en mode sombre
 */
export const CATEGORIES = {
  Art: {
    color: '#B5862E',
    description: 'Peinture, sculpture, œuvres de maîtres et mouvements artistiques.',
  },
  'Cinéma & TV': {
    color: '#A23B3B',
    description: "Filmographies d'acteurs, réalisateurs, séries cultes et cérémonies.",
  },
  Décalé: {
    color: '#9A4A7A',
    description: 'Critères transversaux, caractéristiques surprenantes et objets du quotidien.',
  },
  Gastronomie: {
    color: '#B4602F',
    description: 'Plats régionaux, ingrédients phares, vins, spiritueux et cocktails.',
  },
  Geek: {
    color: '#5A4A99',
    description: 'Jeux vidéo, comics, mangas, science-fiction, fantasy et mascottes.',
  },
  Géographie: {
    color: '#2E5E8C',
    description: 'Capitales, frontières, fleuves, monuments mondiaux et transports.',
  },
  Histoire: {
    color: '#86683E',
    description: 'Grandes périodes, dirigeants, conflits majeurs, héros et mythes antiques.',
  },
  Littérature: {
    color: '#6D3F7A',
    description: 'Romans classiques, bande dessinée franco-belge, théâtre et poésie.',
  },
  Musique: {
    color: '#3D4C8F',
    description: "Discographies d'artistes, groupes mythiques, titres cultes et courants.",
  },
  Nature: {
    color: '#3E7050',
    description: 'Faune, flore, races animales, botanique et habitats naturels.',
  },
  Science: {
    color: '#2C7380',
    description: 'Astronomie, chimie, physique, médecine et grandes inventions.',
  },
  Sport: {
    color: '#6A7D2E',
    description: 'Palmarès internationaux, tournois majeurs, athlètes de légende et records.',
  },
};

const FALLBACK = {
  color: '#7A1E2C',
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
