export type Sport = 
  | 'strength'
  | 'basketball'
  | 'american_football'
  | 'tennis'
  | 'endurance'
  | 'football'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'crossfit'
  | 'martial_arts'
  | 'yoga';

export interface SportConfig {
  id: Sport;
  name: string;
  emoji: string;
  category: 'strength' | 'endurance' | 'team' | 'combat' | 'flexibility';
  description: string;
  // Modificateurs nutritionnels
  nutrition: {
    calorieModifier: number;
    proteinMultiplier: number;
    carbMultiplier: number;
    fatMultiplier: number;
  };
  // Recommandations
  recommendations: {
    dailyWaterIntake: number; // ml par kg de poids
    sleepHours: number;
    restDays: number;
  };
  // Types d'entraînements recommandés
  workoutTypes: string[];
}

export const sportsConfig: Record<Sport, SportConfig> = {
  strength: {
    id: 'strength',
    name: 'Musculation',
    emoji: '💪',
    category: 'strength',
    description: 'Développement de la force et de la masse musculaire',
    nutrition: {
      calorieModifier: 300,
      proteinMultiplier: 1.5,
      carbMultiplier: 1.0,
      fatMultiplier: 1.0,
    },
    recommendations: {
      dailyWaterIntake: 35,
      sleepHours: 8,
      restDays: 2,
    },
    workoutTypes: ['push', 'pull', 'legs', 'upper', 'lower', 'full_body'],
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    category: 'team',
    description: 'Sport collectif nécessitant endurance et explosivité',
    nutrition: {
      calorieModifier: 250,
      proteinMultiplier: 1.2,
      carbMultiplier: 1.3,
      fatMultiplier: 0.9,
    },
    recommendations: {
      dailyWaterIntake: 40,
      sleepHours: 8,
      restDays: 2,
    },
    workoutTypes: ['cardio', 'plyometric', 'agility', 'shooting_drills'],
  },
  american_football: {
    id: 'american_football',
    name: 'Football Américain',
    emoji: '🏈',
    category: 'team',
    description: 'Sport de contact nécessitant force et puissance',
    nutrition: {
      calorieModifier: 500,
      proteinMultiplier: 1.6,
      carbMultiplier: 1.1,
      fatMultiplier: 1.1,
    },
    recommendations: {
      dailyWaterIntake: 45,
      sleepHours: 9,
      restDays: 2,
    },
    workoutTypes: ['power', 'speed', 'agility', 'contact_drills'],
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    category: 'endurance',
    description: 'Sport de raquette alliant endurance et précision',
    nutrition: {
      calorieModifier: 150,
      proteinMultiplier: 1.1,
      carbMultiplier: 1.2,
      fatMultiplier: 0.9,
    },
    recommendations: {
      dailyWaterIntake: 35,
      sleepHours: 8,
      restDays: 2,
    },
    workoutTypes: ['cardio', 'agility', 'core', 'technique'],
  },
  endurance: {
    id: 'endurance',
    name: 'Endurance',
    emoji: '🏃',
    category: 'endurance',
    description: 'Sports d\'endurance longue durée',
    nutrition: {
      calorieModifier: 400,
      proteinMultiplier: 1.2,
      carbMultiplier: 1.5,
      fatMultiplier: 0.8,
    },
    recommendations: {
      dailyWaterIntake: 40,
      sleepHours: 8,
      restDays: 1,
    },
    workoutTypes: ['long_run', 'intervals', 'tempo', 'recovery'],
  },
  football: {
    id: 'football',
    name: 'Football',
    emoji: '⚽',
    category: 'team',
    description: 'Sport collectif nécessitant endurance et technique',
    nutrition: {
      calorieModifier: 200,
      proteinMultiplier: 1.1,
      carbMultiplier: 1.4,
      fatMultiplier: 0.9,
    },
    recommendations: {
      dailyWaterIntake: 40,
      sleepHours: 8,
      restDays: 2,
    },
    workoutTypes: ['cardio', 'agility', 'technique', 'tactical'],
  },
  running: {
    id: 'running',
    name: 'Course à pied',
    emoji: '🏃‍♂️',
    category: 'endurance',
    description: 'Course de fond et d\'endurance',
    nutrition: {
      calorieModifier: 350,
      proteinMultiplier: 1.2,
      carbMultiplier: 1.4,
      fatMultiplier: 0.8,
    },
    recommendations: {
      dailyWaterIntake: 40,
      sleepHours: 8,
      restDays: 2,
    },
    workoutTypes: ['easy_run', 'long_run', 'intervals', 'hills'],
  },
  cycling: {
    id: 'cycling',
    name: 'Cyclisme',
    emoji: '🚴',
    category: 'endurance',
    description: 'Sport d\'endurance sur vélo',
    nutrition: {
