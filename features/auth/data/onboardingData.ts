import { X, Plus } from 'lucide-react';
// Données statiques pour l'onboarding conversationnel

export interface SportOption {
  id: string;
  name: string;
  category: string;
  icon: string;
  positions?: string[];
  equipment?: string[];
  muscles?: string[];
  popularity: number;
}

export interface ObjectiveOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'health' | 'aesthetic' | 'mental';
}

export interface LifestyleOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface DietaryPreference {
  id: string;
  name: string;
  description: string;
  restrictions: string[];
  icon: string;
}

export interface ExperienceLevel {
  id: string;
  name: string;
  description: string;
  monthsExperience: number;
  characteristics: string[];
}

export interface EquipmentLevel {
  id: string;
  name: string;
  description: string;
  equipment: string[];
  space: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  category: 'musculoskeletal' | 'cardiovascular' | 'metabolic' | 'respiratory' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  restrictions: string[];
  recommendations: string[];
}

// Sports disponibles avec leurs positions
export const AVAILABLE_SPORTS: SportOption[] = [
  // Sports de ballon
  {
    id: 'football',
    name: 'Football',
    category: 'sports-collectifs',
    icon: '⚽',
    positions: ['Gardien', 'Défenseur central', 'Arrière latéral', 'Milieu défensif', 'Milieu central', 'Milieu offensif', 'Ailier', 'Attaquant'],
    equipment: ['Chaussures à crampons', 'Protège-tibias', 'Maillot', 'Short'],
    muscles: ['Quadriceps', 'Ischio-jambiers', 'Mollets', 'Fessiers', 'Core'],
    popularity: 95
  },
  {
    id: 'basketball',
    name: 'Basketball',
    category: 'sports-collectifs',
    icon: '🏀',
    positions: ['Meneur', 'Arrière', 'Ailier', 'Ailier fort', 'Pivot'],
    equipment: ['Chaussures de basket', 'Maillot', 'Short'],
    muscles: ['Mollets', 'Quadriceps', 'Fessiers', 'Épaules', 'Core'],
    popularity: 85
  },
  {
    id: 'rugby',
    name: 'Rugby',
    category: 'sports-collectifs',
    icon: '🏉',
    positions: ['Pilier', 'Talonneur', 'Deuxième ligne', 'Troisième ligne', 'Mêlée', 'Ouverture', 'Centre', 'Ailier', 'Arrière'],
    equipment: ['Chaussures à crampons', 'Protège-dents', 'Maillot', 'Short'],
    muscles: ['Tous les groupes musculaires', 'Force explosive', 'Endurance'],
    popularity: 70
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    category: 'sports-collectifs',
    icon: '🏐',
    positions: ['Passeur', 'Réceptionneur-attaquant', 'Central', 'Opposite', 'Libéro'],
    equipment: ['Chaussures de sport', 'Genouillères', 'Maillot', 'Short'],
    muscles: ['Mollets', 'Quadriceps', 'Épaules', 'Core', 'Avant-bras'],
    popularity: 75
  },

  // Sports de raquette
  {
    id: 'tennis',
    name: 'Tennis',
    category: 'sports-raquette',
    icon: '🎾',
    positions: ['Joueur de fond', 'Serveur-volleyeur', 'Contre-attaquant'],
    equipment: ['Raquette', 'Chaussures de tennis', 'Tenue de sport'],
    muscles: ['Épaules', 'Avant-bras', 'Core', 'Mollets', 'Fessiers'],
    popularity: 80
  },
  {
    id: 'badminton',
    name: 'Badminton',
    category: 'sports-raquette',
    icon: '🏸',
    positions: ['Joueur avant', 'Joueur arrière', 'Mixte'],
    equipment: ['Raquette', 'Volants', 'Chaussures de sport'],
    muscles: ['Épaules', 'Avant-bras', 'Mollets', 'Core'],
    popularity: 65
  },

  // Sports individuels
  {
    id: 'running',
    name: 'Course à pied',
    category: 'endurance',
    icon: '🏃',
    positions: ['Sprint', 'Demi-fond', 'Fond', 'Trail'],
    equipment: ['Chaussures de course', 'Tenue technique'],
    muscles: ['Mollets', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Core'],
    popularity: 90
  },
  {
    id: 'cycling',
    name: 'Cyclisme',
    category: 'endurance',
    icon: '🚴',
    positions: ['Route', 'VTT', 'Piste', 'BMX'],
    equipment: ['Vélo', 'Casque', 'Tenue cycliste'],
    muscles: ['Quadriceps', 'Mollets', 'Fessiers', 'Core'],
    popularity: 80
  },
  {
    id: 'swimming',
    name: 'Natation',
    category: 'endurance',
    icon: '🏊',
    positions: ['Nage libre', 'Dos', 'Brasse', 'Papillon', 'Quatre nages'],
    equipment: ['Maillot', 'Lunettes', 'Bonnet'],
    muscles: ['Épaules', 'Dorsaux', 'Core', 'Bras', 'Jambes'],
    popularity: 85
  },

  // Sports de combat
  {
    id: 'boxing',
    name: 'Boxe',
    category: 'combat',
    icon: '🥊',
    positions: ['Boxeur', 'Sparring-partner'],
    equipment: ['Gants', 'Protège-dents', 'Chaussures de boxe'],
    muscles: ['Épaules', 'Bras', 'Core', 'Jambes', 'Cardio'],
    popularity: 70
  },
  {
    id: 'karate',
    name: 'Karaté',
    category: 'combat',
    icon: '🥋',
    positions: ['Kumité', 'Kata'],
    equipment: ['Kimono', 'Ceinture', 'Protections'],
    muscles: ['Core', 'Jambes', 'Équilibre', 'Flexibilité'],
    popularity: 60
  },

  // Musculation et fitness
  {
    id: 'weightlifting',
    name: 'Musculation',
    category: 'force',
    icon: '🏋️',
    positions: ['Force', 'Volume', 'Endurance', 'Powerlifting'],
    equipment: ['Haltères', 'Barres', 'Machines', 'Bancs'],
    muscles: ['Tous les groupes musculaires'],
    popularity: 88
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    category: 'fonctionnel',
    icon: '💪',
    positions: ['WOD', 'Strength', 'Cardio'],
    equipment: ['Équipement varié', 'Box CrossFit'],
    muscles: ['Fonctionnel complet', 'Cardio-musculaire'],
    popularity: 75
  }
];

// Objectifs principaux
export const MAIN_OBJECTIVES: ObjectiveOption[] = [
  {
    id: 'lose-weight',
    name: 'Perdre du poids',
    description: 'Réduire la masse grasse et affiner la silhouette',
    icon: '📉',
    category: 'health'
  },
  {
    id: 'gain-muscle',
    name: 'Prendre de la masse musculaire',
    description: 'Développer et tonifier les muscles',
    icon: '💪',
    category: 'aesthetic'
  },
  {
    id: 'improve-endurance',
    name: 'Améliorer l\'endurance',
    description: 'Augmenter la capacité cardiovasculaire',
    icon: '🫁',
    category: 'performance'
  },
  {
    id: 'increase-strength',
    name: 'Gagner en force',
    description: 'Développer la force musculaire et la puissance',
    icon: '🏋️',
    category: 'performance'
  },
  {
    id: 'improve-flexibility',
    name: 'Améliorer la flexibilité',
    description: 'Gagner en souplesse et mobilité',
    icon: '🤸',
    category: 'health'
  },
  {
    id: 'stress-relief',
    name: 'Réduire le stress',
    description: 'Améliorer le bien-être mental et la détente',
    icon: '🧘',
    category: 'mental'
  },
  {
    id: 'performance-sport',
    name: 'Performance sportive',
    description: 'Optimiser les performances dans un sport spécifique',
    icon: '🏆',
    category: 'performance'
  },
  {
    id: 'health-maintenance',
    name: 'Maintenir la santé',
    description: 'Rester en forme et prévenir les maladies',
    icon: '❤️',
    category: 'health'
  }
];

// Modules disponibles
export const AVAILABLE_MODULES = [
  { id: 'workout', name: 'Entraînement', icon: '💪', description: 'Plans d\'entraînement personnalisés' },
  { id: 'nutrition', name: 'Nutrition', icon: '🥗', description: 'Conseils nutritionnels adaptés' },
  { id: 'recovery', name: 'Récupération', icon: '🛌', description: 'Optimisation de la récupération' },
  { id: 'sleep', name: 'Sommeil', icon: '😴', description: 'Amélioration de la qualité du sommeil' },
  { id: 'hydration', name: 'Hydratation', icon: '💧', description: 'Suivi et conseils d\'hydratation' },
  { id: 'mental', name: 'Mental', icon: '🧠', description: 'Bien-être mental et motivation' },
  { id: 'analytics', name: 'Analytics', icon: '📊', description: 'Suivi détaillé des performances' },
  { id: 'social', name: 'Social', icon: '👥', description: 'Communauté et défis entre amis' }
];

// Options de style de vie
export const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  {
    id: 'sedentary',
    name: 'Sédentaire',
    description: 'Travail de bureau, peu d\'activité physique',
    icon: '💺',
    tags: ['bureau', 'faible-activite']
  },
  {
    id: 'lightly-active',
    name: 'Légèrement actif',
    description: 'Activité légère 1-3 fois par semaine',
    icon: '🚶',
    tags: ['activite-legere', 'occasionnel']
  },
  {
    id: 'moderately-active',
    name: 'Modérément actif',
    description: 'Activité modérée 3-5 fois par semaine',
    icon: '🏃',
    tags: ['activite-moderee', 'regulier']
  },
  {
    id: 'very-active',
    name: 'Très actif',
    description: 'Activité intense 6-7 fois par semaine',
    icon: '💪',
    tags: ['activite-intense', 'quotidien']
  },
  {
    id: 'extremely-active',
    name: 'Extrêmement actif',
    description: 'Athlète ou entraînement intensif quotidien',
    icon: '🏆',
    tags: ['athlete', 'intensif']
  }
];

// Préférences alimentaires
export const DIETARY_PREFERENCES: DietaryPreference[] = [
  {
    id: 'omnivore',
    name: 'Omnivore',
    description: 'Aucune restriction alimentaire particulière',
    restrictions: [],
    icon: '🍽️'
  },
  {
    id: 'vegetarian',
    name: 'Végétarien',
    description: 'Pas de viande ni de poisson',
    restrictions: ['viande', 'poisson'],
    icon: '🥬'
  },
  {
    id: 'vegan',
    name: 'Végétalien',
    description: 'Aucun produit d\'origine animale',
    restrictions: ['viande', 'poisson', 'dairy', 'eggs'],
    icon: '🌱'
  },
  {
    id: 'pescatarian',
    name: 'Pescétarien',
    description: 'Pas de viande mais du poisson',
    restrictions: ['viande'],
    icon: '🐟'
  },
  {
    id: 'keto',
    name: 'Cétogène',
    description: 'Très faible en glucides, riche en graisses',
    restrictions: ['glucides-eleves'],
    icon: '🥑'
  },
  {
    id: 'paleo',
    name: 'Paléolithique',
    description: 'Aliments non transformés, pas de céréales',
    restrictions: ['cereales', 'legumineuses', 'dairy'],
    icon: '🥩'
  },
  {
    id: 'mediterranean',
    name: 'Méditerranéen',
    description: 'Riche en légumes, poissons, huile d\'olive',
    restrictions: [],
    icon: '🫒'
  }
];

// Objectifs de force
export const STRENGTH_OBJECTIVES = [
  { id: 'general-strength', name: 'Force générale', description: 'Améliorer la force globale' },
  { id: 'powerlifting', name: 'Powerlifting', description: 'Squat, bench press, deadlift' },
  { id: 'olympic-lifting', name: 'Haltérophilie', description: 'Arraché et épaulé-jeté' },
  { id: 'functional-strength', name: 'Force fonctionnelle', description: 'Mouvements du quotidien' },
  { id: 'explosive-power', name: 'Puissance explosive', description: 'Force et vitesse combinées' }
];

// Objectifs nutritionnels
export const NUTRITION_OBJECTIVES = [
  { id: 'weight-loss', name: 'Perte de poids', description: 'Déficit calorique contrôlé' },
  { id: 'muscle-gain', name: 'Prise de masse', description: 'Surplus calorique et protéines' },
  { id: 'maintenance', name: 'Maintien', description: 'Équilibre énergétique' },
  { id: 'performance', name: 'Performance', description: 'Optimisation pour le sport' },
  { id: 'health', name: 'Santé générale', description: 'Alimentation équilibrée' }
];

// Niveaux d'expérience fitness
export const FITNESS_EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    id: 'beginner',
    name: 'Débutant',
    description: 'Moins de 6 mois d\'expérience',
    monthsExperience: 3,
    characteristics: ['Apprentissage des mouvements', 'Adaptation progressive', 'Focus technique']
  },
  {
    id: 'novice',
    name: 'Novice',
    description: '6 mois à 1 an d\'expérience',
    monthsExperience: 9,
    characteristics: ['Maîtrise des bases', 'Progression linéaire', 'Renforcement des habitudes']
  },
  {
    id: 'intermediate',
    name: 'Intermédiaire',
    description: '1 à 3 ans d\'expérience',
    monthsExperience: 24,
    characteristics: ['Maîtrise technique', 'Périodisation', 'Spécialisation possible']
  },
  {
    id: 'advanced',
    name: 'Avancé',
    description: '3 à 5 ans d\'expérience',
    monthsExperience: 48,
    characteristics: ['Expertise technique', 'Programmation complexe', 'Optimisation fine']
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Plus de 5 ans d\'expérience',
    monthsExperience: 72,
    characteristics: ['Maîtrise complète', 'Innovation personnelle', 'Mentorat possible']
  }
];

// Niveaux d'équipement
export const EQUIPMENT_LEVELS: EquipmentLevel[] = [
  {
    id: 'none',
    name: 'Aucun équipement',
    description: 'Entraînement au poids du corps uniquement',
    equipment: ['poids-du-corps'],
    space: 'Espace réduit (2m²)'
  },
  {
    id: 'minimal',
    name: 'Équipement minimal',
    description: 'Quelques accessoires de base',
    equipment: ['tapis', 'elastiques', 'halteres-legers'],
    space: 'Espace domestique (4m²)'
  },
  {
    id: 'home-gym',
    name: 'Home gym',
    description: 'Équipement complet à domicile',
    equipment: ['halteres', 'banc', 'barre', 'rack'],
    space: 'Espace dédié (10m²+)'
  },
  {
    id: 'commercial-gym',
    name: 'Salle de sport',
    description: 'Accès à une salle de sport équipée',
    equipment: ['machines', 'poids-libres', 'cardio', 'accessoires'],
    space: 'Salle complète'
  }
];

// Niveaux sportifs
export const SPORT_LEVELS = [
  { id: 'recreational', name: 'Loisir', description: 'Pour le plaisir et la forme' },
  { id: 'club', name: 'Club', description: 'Compétition locale/régionale' },
  { id: 'competitive', name: 'Compétitif', description: 'Compétition nationale' },
  { id: 'elite', name: 'Élite', description: 'Haut niveau, professionnel' }
];

// Périodes de saison
export const SEASON_PERIODS = [
  { id: 'off-season', name: 'Intersaison', description: 'Repos et développement général' },
  { id: 'pre-season', name: 'Préparation', description: 'Préparation physique spécifique' },
  { id: 'in-season', name: 'Saison', description: 'Maintien et récupération' },
  { id: 'post-season', name: 'Post-saison', description: 'Récupération active' }
];

// Disponibilité d'entraînement
export const TRAINING_AVAILABILITY = [
  { id: '1-2-sessions', name: '1-2 sessions/semaine', duration: '30-45 min', commitment: 'Faible' },
  { id: '3-4-sessions', name: '3-4 sessions/semaine', duration: '45-60 min', commitment: 'Modéré' },
  { id: '5-6-sessions', name: '5-6 sessions/semaine', duration: '60-90 min', commitment: 'Élevé' },
  { id: 'daily', name: 'Quotidien', duration: '60+ min', commitment: 'Très élevé' }
];

// Conditions de santé
export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: 'none',
    name: 'Aucune condition particulière',
    category: 'other',
    severity: 'mild',
    restrictions: [],
    recommendations: ['Écouter son corps', 'Progression graduelle']
  },
  {
    id: 'back-pain',
    name: 'Douleurs dorsales',
    category: 'musculoskeletal',
    severity: 'moderate',
    restrictions: ['mouvements-compression-vertebrale', 'charges-lourdes-sans-echauffement'],
    recommendations: ['Renforcement du core', 'Étirements réguliers', 'Posture correcte']
  },
  {
    id: 'knee-issues',
    name: 'Problèmes de genoux',
    category: 'musculoskeletal',
    severity: 'moderate',
    restrictions: ['sauts-repetitifs', 'squats-profonds', 'course-surfaces-dures'],
    recommendations: ['Renforcement quadriceps', 'Faible impact', 'Échauffement prolongé']
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    category: 'cardiovascular',
    severity: 'moderate',
    restrictions: ['efforts-maximaux-brutaux', 'positions-tete-en-bas'],
    recommendations: ['Cardio modéré', 'Surveillance FC', 'Hydratation importante']
  },
  {
    id: 'diabetes',
    name: 'Diabète',
    category: 'metabolic',
    severity: 'moderate',
    restrictions: ['jeune-avant-exercice', 'efforts-tres-longs-sans-surveillance'],
    recommendations: ['Surveillance glycémie', 'Collations adaptées', 'Régularité horaires']
  },
  {
    id: 'asthma',
    name: 'Asthme',
    category: 'respiratory',
    severity: 'mild',
    restrictions: ['efforts-intenses-sans-echauffement', 'environnements-poussieres'],
    recommendations: ['Échauffement prolongé', 'Inhalateur accessible', 'Cardio progressif']
  },
  {
    id: 'pregnancy',
    name: 'Grossesse',
    category: 'other',
    severity: 'moderate',
    restrictions: ['exercices-abdominaux-apres-t1', 'positions-allongee-dos', 'sports-contact'],
    recommendations: ['Exercices adaptés', 'Surveillance médicale', 'Hydratation++']
  }
];

// Questions d'onboarding détaillées
export const onboardingQuestions = {
  'pack-selection': {
    question: 'Quel pack correspond le mieux à vos objectifs ?',
    options: [
      { id: 'athlete', label: 'Athlète', description: 'Performance sportive spécifique' },
      { id: 'fitness', label: 'Fitness', description: 'Forme physique générale' },
      { id: 'wellness', label: 'Bien-être', description: 'Santé et équilibre de vie' }
    ]
  },
  'main-objectives': {
    question: 'Quels sont vos objectifs principaux ?',
    type: 'multiple',
    options: MAIN_OBJECTIVES
  },
  'fitness-experience': {
    question: 'Quel est votre niveau d\'expérience ?',
    options: FITNESS_EXPERIENCE_LEVELS
  },
  'equipment-available': {
    question: 'Quel équipement avez-vous ?',
    options: EQUIPMENT_LEVELS
  },
  'lifestyle-preferences': {
    question: 'Comment décririez-vous votre style de vie ?',
    type: 'multiple',
    options: LIFESTYLE_OPTIONS
  },
  'dietary-preferences': {
    question: 'Avez-vous des préférences alimentaires ?',
    options: DIETARY_PREFERENCES
  },
  'sport-level': {
    question: 'Quel est votre niveau dans ce sport ?',
    options: SPORT_LEVELS
  },
  'training-availability': {
    question: 'Quelle est votre disponibilité d\'entraînement ?',
    options: TRAINING_AVAILABILITY
  },
  'health-conditions': {
    question: 'Avez-vous des conditions de santé à signaler ?',
    type: 'multiple',
    options: HEALTH_CONDITIONS
  },
  'sleep-habits': {
    question: 'Décrivez vos habitudes de sommeil',
    type: 'form',
    fields: [
      { id: 'bedtime', label: 'Heure de coucher habituelle', type: 'time' },
      { id: 'wakeup', label: 'Heure de réveil habituelle', type: 'time' },
      { id: 'quality', label: 'Qualité du sommeil', type: 'scale', min: 1, max: 10 },
      { id: 'issues', label: 'Problèmes de sommeil', type: 'multiselect', options: [
        'Difficultés d\'endormissement',
        'Réveils nocturnes',
        'Réveil précoce',
        'Sommeil non réparateur',
        'Ronflements',
        'Aucun problème'
      ]}
    ]
  },
  'notifications-preferences': {
    question: 'Comment souhaitez-vous être accompagné ?',
    type: 'form',
    fields: [
      { id: 'workout-reminders', label: 'Rappels d\'entraînement', type: 'boolean' },
      { id: 'nutrition-tips', label: 'Conseils nutritionnels', type: 'boolean' },
      { id: 'motivation-messages', label: 'Messages de motivation', type: 'boolean' },
      { id: 'progress-updates', label: 'Mises à jour de progression', type: 'boolean' },
      { id: 'frequency', label: 'Fréquence des notifications', type: 'select', options: [
        'Quotidienne',
        'Quelques fois par semaine',
        'Hebdomadaire',
        'Mensuelle',
        'Uniquement pour les événements importants'
      ]}
    ]
  }
};

// Fonctions utilitaires
export function getSportById(sportId: string): SportOption | undefined {
  return AVAILABLE_SPORTS.find(sport => sport.id === sportId);
}

export function getSportsByCategory(category: string): SportOption[] {
  return AVAILABLE_SPORTS.filter(sport => sport.category === category);
}

export function getPositionsForSport(sportId: string): string[] {
  const sport = getSportById(sportId);
  return sport?.positions || [];
}

export function getPopularSports(limit: number = 5): SportOption[] {
  return AVAILABLE_SPORTS
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function searchSports(query: string): SportOption[] {
  const lowerQuery = query.toLowerCase();
  return AVAILABLE_SPORTS.filter(sport => 
    sport.name.toLowerCase().includes(lowerQuery) ||
    sport.category.toLowerCase().includes(lowerQuery)
  );
}