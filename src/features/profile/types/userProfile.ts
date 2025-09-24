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
  sport?: string | undefined;
  sport_position?: string | undefined;
  sport_level?: 'recreational' | 'amateur_competitive' | 'semi_professional' | 'professional' | undefined;
  sport_specific_stats?: Record<string, number>;
  training_frequency?: number | undefined;
  season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | undefined;
  available_time_per_day?: number | undefined;
}

// Interface pour les préférences nutritionnelles
export interface NutritionPreferences {
  dietary_restrictions?: string[];
  meal_preferences?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | undefined;
  daily_calories?: number | undefined;
  city?: string | undefined; // CRITICAL for nutrition personalization
  country?: string | undefined;
}

// Interface pour les préférences d'entraînement
export interface WorkoutPreferences {
  preferred_workout_time?: 'morning' | 'afternoon' | 'evening' | 'flexible' | undefined;
  ai_coaching_style?: 'encouraging' | 'direct' | 'analytical' | 'motivational' | undefined;
  preferred_measurement_system?: 'metric' | 'imperial' | undefined;
}