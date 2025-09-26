// Données statiques pour le processus d'onboarding
import { OnboardingData } from '@/shared/types/onboarding';

/** Objectifs disponibles pour l'onboarding */
export const AVAILABLE_GOALS = [
  'perdre_poids',
  'gagner_muscle',
  'améliorer_endurance',
  'accroître_force',
  'rester_en_forme',
  'reduire_stress',
  'améliorer_sommeil',
  'augmenter_flexibilité',
  'réabilitation',
  'préparation_compétition'
] as const;

/** Niveaux de fitness disponibles */
export const FITNESS_LEVELS: Array<{
  id: 'beginner' | 'intermediate' | 'advanced';
  label: string;
  description: string;
}> = [
  {
    id: 'beginner',
    label: 'Débutant',
    description: 'Je commence ou je reprends le sport après une pause'
  },
  {
    id: 'intermediate',
    label: 'Intermédiaire',
    description: 'Je fais du sport régulièrement (2-3 fois par semaine)'
  },
  {
    id: 'advanced',
    label: 'Avancé',
    description: 'Je suis un sportif expérimenté (4+ fois par semaine)'
  }
];

/** Types d'entraînement disponibles */
export const WORKOUT_TYPES = [
  'force',
  'cardio',
  'flexibilite',
  'yoga',
  'pilates',
  'cours6e',
  'randonnee',
  'velo',
  'natation',
  'musculation',
  'hiit',
  'fonctionnel'
] as const;

/** Équipements disponibles */
export const AVAILABLE_EQUIPMENT = [
  'aucun_equipement',
  'alteres',
  'elastique',
  'tapis_yoga',
  'halteres',
  'barre',
  'banc_musculation',
  'cardio_frequencemetre',
  'salle_complete'
] as const;

/** Profil type pour onboarding */
export interface OnboardingProfile {
  goals: typeof AVAILABLE_GOALS[number][];
  fitnessLevel: string;
  workoutTypes: typeof WORKOUT_TYPES[number][];
  equipment: typeof AVAILABLE_EQUPMMENTS�number][];
  schedule: {
    daysPerWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    duration: 15 | 30 | 45 | 60;
    timePreference: 'morning' | 'afternoon' | 'evening';
  };
}

/** Données par défaut */
export const DEFAULT_ONBOARDING_DATA = {
  goals: [],
  fitnessLevel: 'beginner' as const,
  workoutTypes: [],
  equipment: [],
  schedule: {
    daysPerWeek: 3 as const,
    duration: 30 as const,
    timePreference: 'morning' as const
  }
};
