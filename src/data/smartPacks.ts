// Configuration des packs d'entraînement intelligents
export interface SmartPack {
  id: string;
  name: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // en minutes
  difficulty: 'easy' | 'medium' | 'hard';
  modules: SmartPackModule[];
  estimatedCalories: number;
  requiredEquipment: string[];
}

export interface SmartPackModule {
  id: string;
  name: string;
  duration: number;
  exercises: string[];
  restTime: number;
}

export const SMART_PACKS: SmartPack[] = [
  {
    id: 'pack-cardio-basic',
    name: 'Cardio Express',
    description: 'Entraînement cardio rapide pour brûler des calories',
    category: 'beginner',
    duration: 20,
    difficulty: 'easy',
    estimatedCalories: 180,
    requiredEquipment: [],
    modules: [
      {
        id: 'warm-up',
        name: 'Échauffement',
        duration: 5,
        exercises: ['Marche sur place', 'Rotations des bras', 'Étirements'],
        restTime: 30
      },
      {
        id: 'cardio-main',
        name: 'Cardio principal',
        duration: 12,
        exercises: ['Jumping jacks', 'Burpees', 'Mountain climbers'],
        restTime: 45
      },
      {
        id: 'cool-down',
        name: 'Retour au calme',
        duration: 3,
        exercises: ['Étirements', 'Respiration'],
        restTime: 0
      }
    ]
  },
  {
    id: 'pack-strength-basic',
    name: 'Force & Endurance',
    description: 'Renforcement musculaire complet sans équipement',
    category: 'intermediate',
    duration: 30,
    difficulty: 'medium',
    estimatedCalories: 240,
    requiredEquipment: [],
    modules: [
      {
        id: 'warm-up',
        name: 'Échauffement',
        duration: 5,
        exercises: ['Rotations articulaires', 'Activation musculaire'],
        restTime: 30
      },
      {
        id: 'upper-body',
        name: 'Haut du corps',
        duration: 10,
        exercises: ['Pompes', 'Dips', 'Pike push-ups'],
        restTime: 60
      },
      {
        id: 'lower-body',
        name: 'Bas du corps',
        duration: 10,
        exercises: ['Squats', 'Lunges', 'Single leg deadlifts'],
        restTime: 60
      },
      {
        id: 'core',
        name: 'Gainage',
        duration: 5,
        exercises: ['Planche', 'Crunchs', 'Russian twists'],
        restTime: 45
      }
    ]
  },
  {
    id: 'pack-hiit-advanced',
    name: 'HIIT Intense',
    description: 'Entraînement haute intensité pour sportifs confirmés',
    category: 'advanced',
    duration: 25,
    difficulty: 'hard',
    estimatedCalories: 320,
    requiredEquipment: [],
    modules: [
      {
        id: 'warm-up',
        name: 'Échauffement dynamique',
        duration: 5,
        exercises: ['Dynamic stretching', 'Light cardio'],
        restTime: 30
      },
      {
        id: 'hiit-main',
        name: 'HIIT principal',
        duration: 16,
        exercises: ['Burpees', 'Jump squats', 'High knees', 'Plank jacks'],
        restTime: 30
      },
      {
        id: 'cool-down',
        name: 'Récupération',
        duration: 4,
        exercises: ['Étirements statiques', 'Respiration profonde'],
        restTime: 0
      }
    ]
  }
];

export function getEstimatedTimeForPack(packId: string): number {
  const pack = SMART_PACKS.find(p => p.id === packId);
  return pack?.duration || 0;
}

export function getPacksByCategory(category: SmartPack['category']): SmartPack[] {
  return SMART_PACKS.filter(pack => pack.category === category);
}

export function getPackById(packId: string): SmartPack | undefined {
  return SMART_PACKS.find(pack => pack.id === packId);
}