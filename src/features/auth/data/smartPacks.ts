import { Plus } from 'lucide-react';
// Packs intelligents prédéfinis selon le profil utilisateur

export interface SmartPack {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  sports: string[];
  goals: string[];
  features: string[];
  modules: string[];
  targetAudience: string[];
  estimatedTime: number; // minutes d'onboarding
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: string[]; // IDs des questions spécifiques à ce pack
  benefits: string[];
  examples: string[];
}

export interface PackRecommendation {
  pack: SmartPack;
  score: number;
  reasons: string[];
  missingFeatures?: string[];
}

export const SMART_PACKS: SmartPack[] = [
  {
    id: 'athlete',
    name: 'Athlète Performance',
    title: 'Optimisez vos performances sportives',
    description: 'Entraînement spécialisé pour améliorer vos performances dans votre sport',
    longDescription: 'Ce pack est conçu pour les athlètes qui veulent maximiser leurs performances dans un sport spécifique. Il inclut un coaching personnalisé, des plans d\'entraînement adaptés à votre discipline, et un suivi détaillé de vos progrès.',
    icon: '🏆',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    sports: ['football', 'basketball', 'tennis', 'rugby', 'running', 'cycling', 'swimming'],
    goals: ['performance-sport', 'increase-strength', 'improve-endurance'],
    features: [
      'Plans d\'entraînement spécifiques au sport',
      'Analyse biomécanique',
      'Périodisation avancée',
      'Suivi de performance en temps réel',
      'Conseils tactiques',
      'Récupération optimisée',
      'Nutrition pour la performance'
    ],
    modules: ['workout', 'analytics', 'recovery', 'nutrition', 'mental'],
    targetAudience: ['athlètes compétitifs', 'sportifs amateurs avancés', 'équipes'],
    estimatedTime: 12,
    popularity: 85,
    difficulty: 'advanced',
    questions: ['sport-selection', 'position-selection', 'sport-level', 'season-period', 'training-availability'],
    benefits: [
      'Amélioration mesurable des performances',
      'Réduction du risque de blessures',
      'Optimisation de la récupération',
      'Développement tactique',
      'Préparation mentale'
    ],
    examples: [
      'Préparation pour une compétition',
      'Amélioration du temps au 10km',
      'Augmentation de la détente verticale',
      'Perfectionnement technique'
    ]
  },

  {
    id: 'fitness',
    name: 'Fitness Complet',
    title: 'Forme physique optimale',
    description: 'Programme complet pour développer force, endurance et esthétique',
    longDescription: 'Le pack idéal pour ceux qui veulent une condition physique complète. Combine musculation, cardio, et flexibilité pour un développement harmonieux du corps.',
    icon: '💪',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    sports: ['weightlifting', 'crossfit', 'running', 'cycling'],
    goals: ['gain-muscle', 'lose-weight', 'increase-strength', 'improve-endurance'],
    features: [
      'Programs de musculation progressifs',
      'Entraînements cardiovasculaires variés',
      'Suivi de la composition corporelle',
      'Plans nutritionnels personnalisés',
      'Exercices de mobilité',
      'Défis motivants',
      'Communauté active'
    ],
    modules: ['workout', 'nutrition', 'analytics', 'social', 'hydration'],
    targetAudience: ['débutants en fitness', 'passionnés de musculation', 'personnes actives'],
    estimatedTime: 10,
    popularity: 92,
    difficulty: 'intermediate',
    questions: ['main-objectives', 'fitness-experience', 'equipment-available', 'training-availability'],
    benefits: [
      'Développement musculaire équilibré',
      'Amélioration de la composition corporelle',
      'Boost de confiance en soi',
      'Énergie au quotidien',
      'Habitudes saines durables'
    ],
    examples: [
      'Transformation physique en 3 mois',
      'Premier marathon',
      'Objectif bikini body',
      'Retour en forme après blessure'
    ]
  },

  {
    id: 'wellness',
    name: 'Bien-être Global',
    title: 'Équilibre de vie optimal',
    description: 'Approche holistique pour votre santé physique et mentale',
    longDescription: 'Ce pack privilégie une approche douce et globale de la santé. Il combine activité physique modérée, nutrition consciente, gestion du stress et optimisation du sommeil.',
    icon: '🧘',
    color: 'bg-gradient-to-r from-green-400 to-teal-500',
    sports: ['yoga', 'walking', 'swimming', 'tai-chi'],
    goals: ['stress-relief', 'health-maintenance', 'improve-flexibility', 'improve-sleep'],
    features: [
      'Exercices doux et progressifs',
      'Méditation guidée',
      'Suivi du sommeil',
      'Gestion du stress',
      'Nutrition intuitive',
      'Habitudes de vie saines',
      'Mindfulness quotidien'
    ],
    modules: ['sleep', 'mental', 'hydration', 'recovery', 'nutrition'],
    targetAudience: ['débutants sédentaires', 'seniors actifs', 'personnes stressées', 'convalescents'],
    estimatedTime: 8,
    popularity: 78,
    difficulty: 'beginner',
    questions: ['lifestyle-preferences', 'dietary-preferences', 'sleep-habits', 'health-conditions'],
    benefits: [
      'Réduction du stress et de l\'anxiété',
      'Amélioration de la qualité du sommeil',
      'Plus d\'énergie au quotidien',
      'Meilleur équilibre vie-travail',
      'Prévention des maladies'
    ],
    examples: [
      'Routine matinale énergisante',
      'Gestion du stress au travail',
      'Amélioration du sommeil',
      'Retour à l\'activité en douceur'
    ]
  },

  {
    id: 'weight-loss',
    name: 'Perte de Poids',
    title: 'Transformation corporelle durable',
    description: 'Programme complet pour perdre du poids sainement et durablement',
    longDescription: 'Un programme scientifiquement conçu pour une perte de poids saine et durable, combinant exercices adaptés, nutrition équilibrée et soutien psychologique.',
    icon: '📉',
    color: 'bg-gradient-to-r from-red-400 to-pink-500',
    sports: ['walking', 'running', 'cycling', 'swimming'],
    goals: ['lose-weight', 'improve-endurance', 'health-maintenance'],
    features: [
      'Déficit calorique optimisé',
      'Exercices brûle-graisses',
      'Suivi du poids et mensurations',
      'Coaching nutritionnel',
      'Support motivationnel',
      'Recipes minceur',
      'Gestion des fringales'
    ],
    modules: ['nutrition', 'workout', 'analytics', 'mental', 'hydration'],
    targetAudience: ['personnes en surpoids', 'post-grossesse', 'perte de poids médicale'],
    estimatedTime: 9,
    popularity: 88,
    difficulty: 'beginner',
    questions: ['main-objectives', 'dietary-preferences', 'training-availability', 'health-conditions'],
    benefits: [
      'Perte de poids progressive et durable',
      'Amélioration de la santé cardiovasculaire',
      'Boost de confiance',
      'Nouvelles habitudes alimentaires',
      'Énergie retrouvée'
    ],
    examples: [
      'Perdre 10kg en 6 mois',
      'Retrouver son poids de forme',
      'Préparer l\'été',
      'Améliorer sa santé'
    ]
  },

  {
    id: 'muscle-building',
    name: 'Prise de Masse',
    title: 'Développement musculaire optimal',
    description: 'Programme intensif pour maximiser la croissance musculaire',
    longDescription: 'Conçu pour ceux qui veulent développer leur masse musculaire de façon optimale, avec des protocoles d\'entraînement avancés et une nutrition précise.',
    icon: '🏋️',
    color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    sports: ['weightlifting', 'powerlifting', 'bodybuilding'],
    goals: ['gain-muscle', 'increase-strength'],
    features: [
      'Programs de musculation intensifs',
      'Périodisation pour l\'hypertrophie',
      'Nutrition hypercalorique optimisée',
      'Suivi des charges et volumes',
      'Techniques d\'intensification',
      'Récupération maximisée',
      'Supplémentation ciblée'
    ],
    modules: ['workout', 'nutrition', 'recovery', 'analytics'],
    targetAudience: ['bodybuilders', 'powerlifters', 'ectomorphes'],
    estimatedTime: 11,
    popularity: 75,
    difficulty: 'advanced',
    questions: ['fitness-experience', 'equipment-available', 'training-availability', 'nutrition-objectives'],
    benefits: [
      'Croissance musculaire maximisée',
      'Force significativement augmentée',
      'Physique impressionnant',
      'Confiance renforcée',
      'Performance améliorée'
    ],
    examples: [
      'Gagner 5kg de muscle en 6 mois',
      'Doubler sa force au développé couché',
      'Transformer son physique',
      'Préparer une compétition'
    ]
  },

  {
    id: 'senior',
    name: 'Senior Actif',
    title: 'Vitalité après 50 ans',
    description: 'Programme adapté pour rester en forme et en santé après 50 ans',
    longDescription: 'Spécialement conçu pour les seniors, ce programme privilégie la santé, la mobilité et l\'autonomie avec des exercices adaptés et sécurisés.',
    icon: '👴',
    color: 'bg-gradient-to-r from-amber-400 to-orange-400',
    sports: ['walking', 'swimming', 'tai-chi', 'golf'],
    goals: ['health-maintenance', 'improve-flexibility', 'increase-strength'],
    features: [
      'Exercices adaptés aux seniors',
      'Prévention des chutes',
      'Maintien de la densité osseuse',
      'Exercices cognitifs',
      'Suivi médical intégré',
      'Socialisation encouragée',
      'Progression très douce'
    ],
    modules: ['workout', 'health', 'social', 'mental', 'recovery'],
    targetAudience: ['seniors actifs', 'retraités', 'post-rééducation'],
    estimatedTime: 7,
    popularity: 65,
    difficulty: 'beginner',
    questions: ['health-conditions', 'lifestyle-preferences', 'training-availability'],
    benefits: [
      'Maintien de l\'autonomie',
      'Prévention des maladies',
      'Amélioration de l\'équilibre',
      'Lien social renforcé',
      'Bien-être mental'
    ],
    examples: [
      'Prévenir l\'ostéoporose',
      'Maintenir la mobilité',
      'Socialiser en groupe',
      'Rester indépendant'
    ]
  }
];

/**
 * Calcule les recommandations de packs selon le profil utilisateur
 */
export function getRecommendedPacks(userProfile: any): PackRecommendation[] {
  const recommendations: PackRecommendation[] = [];

  for (const pack of SMART_PACKS) {
    let score = 0;
    const reasons: string[] = [];
    const missingFeatures: string[] = [];

    // Score basé sur les objectifs
    if (userProfile.objectives) {
      const matchingGoals = pack.goals.filter(goal => 
        userProfile.objectives.includes(goal)
      );
      score += matchingGoals.length * 20;
      if (matchingGoals.length > 0) {
        reasons.push(`Correspond à ${matchingGoals.length} de vos objectifs`);
      }
    }

    // Score basé sur le sport
    if (userProfile.sport && pack.sports.includes(userProfile.sport)) {
      score += 25;
      reasons.push('Adapté à votre sport principal');
    }

    // Score basé sur l'expérience
    if (userProfile.experience) {
      if (pack.difficulty === userProfile.experience) {
        score += 15;
        reasons.push('Niveau de difficulté adapté');
      } else if (
        (pack.difficulty === 'intermediate' && userProfile.experience === 'beginner') ||
        (pack.difficulty === 'beginner' && userProfile.experience === 'intermediate')
      ) {
        score += 10;
        reasons.push('Niveau proche de votre expérience');
      }
    }

    // Score basé sur l'âge
    if (userProfile.age) {
      if (userProfile.age >= 50 && pack.id === 'senior') {
        score += 20;
        reasons.push('Spécialement conçu pour votre tranche d\'âge');
      } else if (userProfile.age < 30 && ['athlete', 'fitness', 'muscle-building'].includes(pack.id)) {
        score += 10;
        reasons.push('Adapté aux jeunes adultes actifs');
      }
    }

    // Score basé sur la disponibilité
    if (userProfile.availability) {
      if (userProfile.availability === 'daily' && ['athlete', 'muscle-building'].includes(pack.id)) {
        score += 15;
        reasons.push('Parfait pour un entraînement quotidien');
      } else if (userProfile.availability === '1-2-sessions' && ['wellness', 'senior'].includes(pack.id)) {
        score += 15;
        reasons.push('Adapté à votre disponibilité limitée');
      }
    }

    // Score basé sur les conditions de santé
    if (userProfile.healthConditions) {
      if (userProfile.healthConditions.includes('none') && ['athlete', 'fitness', 'muscle-building'].includes(pack.id)) {
        score += 10;
        reasons.push('Aucune restriction de santé');
      } else if (userProfile.healthConditions.length > 1 && ['wellness', 'senior'].includes(pack.id)) {
        score += 15;
        reasons.push('Approche douce adaptée à vos conditions');
      }
    }

    // Vérifier les fonctionnalités manquantes
    if (userProfile.wantedFeatures) {
      for (const feature of userProfile.wantedFeatures) {
        if (!pack.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
          missingFeatures.push(feature);
        }
      }
    }

    // Bonus popularité
    score += pack.popularity * 0.1;

    recommendations.push({
      pack,
      score: Math.round(score),
      reasons,
      missingFeatures: missingFeatures.length > 0 ? missingFeatures : undefined
    });
  }

  // Trier par score décroissant
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Retourner les 3 meilleures recommandations
}

/**
 * Retourne les questions spécifiques à un pack
 */
export function getQuestionsForPack(packId: string): string[] {
  const pack = SMART_PACKS.find(p => p.id === packId);
  return pack?.questions || [];
}

/**
 * Détermine si une question doit être posée selon le pack sélectionné
 */
export function shouldAskQuestion(questionId: string, selectedPack: string): boolean {
  const pack = SMART_PACKS.find(p => p.id === selectedPack);
  if (!pack) return true; // Par défaut, poser la question
  
  // Questions toujours posées
  const alwaysAsk = ['personal-info', 'health-conditions', 'notifications-preferences'];
  if (alwaysAsk.includes(questionId)) return true;
  
  // Questions spécifiques au pack
  return pack.questions.includes(questionId);
}

/**
 * Estime le temps restant pour un pack donné
 */
export function getEstimatedTimeForPack(packId: string, currentStep: string, completedSteps: string[]): number {
  const pack = SMART_PACKS.find(p => p.id === packId);
  if (!pack) return 0;
  
  const remainingQuestions = pack.questions.filter(q => !completedSteps.includes(q));
  return remainingQuestions.length * 30; // 30 secondes par question en moyenne
}

/**
 * Retourne un pack par son ID
 */
export function getPackById(packId: string): SmartPack | undefined {
  return SMART_PACKS.find(pack => pack.id === packId);
}

/**
 * Retourne les packs recommandés pour un sport spécifique
 */
export function getPacksForSport(sportId: string): SmartPack[] {
  return SMART_PACKS.filter(pack => pack.sports.includes(sportId));
}

/**
 * Retourne les packs adaptés à un niveau d'expérience
 */
export function getPacksForExperience(experienceLevel: string): SmartPack[] {
  return SMART_PACKS.filter(pack => {
    if (experienceLevel === 'beginner') return pack.difficulty === 'beginner';
    if (experienceLevel === 'intermediate') return ['beginner', 'intermediate'].includes(pack.difficulty);
    if (experienceLevel === 'advanced') return ['intermediate', 'advanced'].includes(pack.difficulty);
    return true;
  });
}

/**
 * Retourne les packs les plus populaires
 */
export function getPopularPacks(limit: number = 3): SmartPack[] {
  return SMART_PACKS
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}