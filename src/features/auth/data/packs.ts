// Smart packs data for conversational onboarding
export interface SmartPack {
  id: string;
  name: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'recovery' | 'performance';
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: string[];
  estimatedDuration: number; // en minutes
  features: string[];
  popular?: boolean;
  icon?: string;
}

export const smartPacks: SmartPack[] = [
  {
    id: 'fitness-beginner',
    name: 'Débutant Fitness',
    description: 'Pack parfait pour commencer votre parcours fitness',
    category: 'fitness',
    level: 'beginner',
    modules: ['basic-workouts', 'nutrition-basics', 'habit-tracking'],
    estimatedDuration: 30,
    features: ['Plans d\'entraînement simples', 'Conseils nutrition', 'Suivi des habitudes'],
    popular: true,
    icon: '🏃‍♂️'
  },
  {
    id: 'nutrition-expert',
    name: 'Nutrition Avancée',
    description: 'Programme complet pour optimiser votre nutrition',
    category: 'nutrition',
    level: 'advanced',
    modules: ['macro-tracking', 'meal-planning', 'supplements'],
    estimatedDuration: 45,
    features: ['Suivi des macros', 'Planification des repas', 'Guide des suppléments'],
    popular: false,
    icon: '🥗'
  },
  {
    id: 'recovery-pro',
    name: 'Récupération Pro',
    description: 'Optimisez votre récupération et vos performances',
    category: 'recovery',
    level: 'intermediate',
    modules: ['sleep-tracking', 'stress-management', 'recovery-protocols'],
    estimatedDuration: 35,
    features: ['Analyse du sommeil', 'Gestion du stress', 'Protocoles de récupération'],
    popular: false,
    icon: '🧘‍♀️'
  }
];

export const getPacksByCategory = (category: SmartPack['category']): SmartPack[] => {
  return smartPacks.filter(pack => pack.category === category);
};

export const getPacksByLevel = (level: SmartPack['level']): SmartPack[] => {
  return smartPacks.filter(pack => pack.level === level);
};

export const getPackById = (id: string): SmartPack | undefined => {
  return smartPacks.find(pack => pack.id === id);
};

export const getEstimatedTimeForPack = (packId: string): number => {
  const pack = getPackById(packId);
  return pack?.estimatedDuration || 30;
};