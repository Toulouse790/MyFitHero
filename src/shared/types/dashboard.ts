// Dashboard types
export interface SmartDashboardContext {
  userId: string;
  user?: any; // Utilisateur complet
  sport: string;
  position?: string;
  currentGoals: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableTime: number;
  preferences: {
    workoutIntensity: 'low' | 'medium' | 'high';
    focusAreas: string[];
    avoidAreas: string[];
  };
}

export interface DailyProgramDisplay {
  date: string;
  personalizedMessage: string;
  aiRecommendation: string;
  priorityLevel: 'low' | 'medium' | 'high';
  
  // Sections principales
  workout: {
    title: string;
    name?: string;
    description: string;
    duration: number;
    intensity: 'light' | 'moderate' | 'intense';
    exercises: Exercise[];
    warmup: Exercise[];
    cooldown: Exercise[];
    completed?: boolean;
  };
  
  nutrition: {
    title: string;
    description: string;
    calories: number;
    calories_current?: number;
    calories_target?: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    meals: Meal[];
    hydration: {
      target: number;
      current: number;
    };
  };

  // Propriétés d'hydratation au niveau principal
  hydration?: {
    target: number;
    current: number;
  };

  // Propriétés de sommeil au niveau principal  
  sleep?: {
    target: number;
    current: number;
  };
  
  recovery: {
    title: string;
    description: string;
    sleepTarget: number;
    restActivities: string[];
    stretchingRoutine: Exercise[];
  };
  
  // Statistiques
  stats: {
    completion: number;
    streak: number;
    weeklyProgress: number;
    monthlyGoals: number;
  };
  
  // Badges et récompenses
  badges: {
    earned: Badge[];
    available: Badge[];
    progress: BadgeProgress[];
  };
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: number;
  sets?: number;
  reps?: number | string;
  weight?: number;
  restTime?: number;
  targetMuscles: string[];
  equipment: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  videoUrl?: string;
  imageUrl?: string;
  tips: string[];
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  time: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Ingredient[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  recipe?: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'social' | 'achievement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
  reward?: {
    type: 'points' | 'feature' | 'cosmetic';
    value: number | string;
  };
}

export interface BadgeProgress {
  badgeId: string;
  progress: number;
  total: number;
  isCompleted: boolean;
  unlockedAt?: string;
}

// Dashboard analytics
export interface DashboardAnalytics {
  weeklyStats: WeeklyStats;
  monthlyTrends: MonthlyTrends;
  performanceMetrics: PerformanceMetrics;
  goals: GoalProgress[];
}

export interface WeeklyStats {
  workoutsCompleted: number;
  caloriesBurned: number;
  avgSleepHours: number;
  waterIntake: number;
  moodScore: number;
  weekCompletion: number;
}

export interface MonthlyTrends {
  weightChange: number;
  strengthProgress: number;
  enduranceProgress: number;
  flexibilityProgress: number;
  consistencyScore: number;
}

export interface PerformanceMetrics {
  overallScore: number;
  workoutScore: number;
  nutritionScore: number;
  recoveryScore: number;
  consistencyScore: number;
  improvementRate: number;
}

export interface GoalProgress {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'performance';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

export default DailyProgramDisplay;