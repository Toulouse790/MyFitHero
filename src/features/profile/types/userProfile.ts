import { Activity } from 'lucide-react';

// Types de base pour MyFitHero
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type FitnessGoals =
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'strength'
  | 'flexibility'
  | 'general_health';

export type ModuleType =
  | 'nutrition'
  | 'workout'
  | 'sleep'
  | 'hydration'
  | 'recovery'
  | 'mental_health';

// Re-export the unified UserProfile interface
export type { UserProfile } from '@/shared/types/userProfile';

// Additional profile-related types
export interface UserProfileUpdate {
  [key: string]: any;
}

export interface ProfileMetrics {
  completionPercentage: number;
  missingFields: string[];
  lastUpdated: Date;
}

// Interface pour les données spécifiques au sport
export interface SportProfileData {
  sport?: string | null;
  sport_position?: string | null;
  sport_level?: 'recreational' | 'amateur_competitive' | 'semi_professional' | 'professional' | null;
  sport_specific_stats?: Record<string, number>;
  training_frequency?: number | null;
  season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | null;
  available_time_per_day?: number | null;
}

// Interface pour les préférences nutritionnelles
export interface NutritionPreferences {
  dietary_restrictions?: string[];
  meal_preferences?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | null;
  daily_calories?: number | null;
  city?: string | null; // CRITICAL for nutrition personalization
  country?: string | null;
}

// Interface pour les préférences d'entraînement
export interface WorkoutPreferences {
  preferred_workout_time?: 'morning' | 'afternoon' | 'evening' | 'flexible' | null;
  ai_coaching_style?: 'encouraging' | 'direct' | 'analytical' | 'motivational' | null;
  preferred_measurement_system?: 'metric' | 'imperial' | null;
}