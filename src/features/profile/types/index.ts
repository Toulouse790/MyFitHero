// Export des types de la feature profile
export * from './userProfile';

// ========================================
// PROFILE TYPES
// ========================================

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  height?: number;
  weight?: number;
  date_of_birth?: string;
  gender?: string;
  activity_level?: string;
  goals?: string[];
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  completed: boolean;
  date_earned?: string;
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  created_at: string;
}

export interface CreateGoalData {
  title: string;
  description: string;
  target_value: number;
  unit: string;
  deadline?: string;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  deadline?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  avatar?: string; // Alias pour avatar_url
  cover_image_url?: string;
  date_of_birth?: string;
  gender?: Gender;
  location?: UserLocation;
  timezone?: string;
  language: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  onboarding_completed: boolean;
}

export interface PhysicalProfile {
  user_id: string;
  height: number; // in cm
  weight: number; // in kg
  body_fat_percentage?: number;
  muscle_mass?: number;
  bone_density?: number;
  resting_heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  updated_at: string;
}

export interface FitnessProfile {
  user_id: string;
  activity_level: ActivityLevel;
  fitness_goals: FitnessGoal[];
  primary_goal: FitnessGoal;
  target_weight?: number;
  target_body_fat?: number;
  workout_frequency: number; // sessions per week
  preferred_workout_duration: number; // in minutes
  experience_level: ExperienceLevel;
  preferred_workout_types: WorkoutType[];
  equipment_access: EquipmentAccess[];
  injuries_limitations?: string[];
  medical_conditions?: string[];
}

export interface ProfileSettings {
  user_id: string;
  privacy_level: PrivacyLevel;
  notification_preferences: NotificationPreferences;
  measurement_units: MeasurementUnits;
  theme: ThemePreference;
  data_sharing: DataSharingPreferences;
  account_visibility: AccountVisibility;
}

export interface SocialProfile {
  user_id: string;
  followers_count: number;
  following_count: number;
  friends_count: number;
  public_workouts: number;
  achievements_shared: number;
  social_score: number;
  is_verified: boolean;
  badges: Badge[];
}

// ========================================
// ENUMS & TYPES
// ========================================

export type Gender = 'male' | 'female'; // Removed 'other' for better AI advice

export type ActivityLevel = 
  | 'sedentary'        // Little to no exercise
  | 'lightly_active'   // Light exercise 1-3 days/week
  | 'moderately_active' // Moderate exercise 3-5 days/week
  | 'very_active'      // Hard exercise 6-7 days/week
  | 'extremely_active'; // Very hard exercise, physical job

export type FitnessGoal = 
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_building'
  | 'strength_training'
  | 'endurance'
  | 'flexibility'
  | 'general_health'
  | 'sport_performance'
  | 'rehabilitation'
  | 'maintenance';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type WorkoutType = 
  | 'cardio'
  | 'strength_training'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'crossfit'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'martial_arts'
  | 'dance'
  | 'sports';

export type EquipmentAccess = 
  | 'home_bodyweight'
  | 'home_basic'
  | 'home_full'
  | 'gym_basic'
  | 'gym_full'
  | 'outdoor'
  | 'pool'
  | 'specialized';

export type PrivacyLevel = 'public' | 'friends' | 'private';

export type ThemePreference = 'light' | 'dark' | 'auto';

export type AccountVisibility = 'public' | 'searchable' | 'private';

export type MeasurementSystem = 'metric' | 'imperial';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface UserLocation {
  country: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  workout_reminders: boolean;
  achievement_notifications: boolean;
  social_notifications: boolean;
  marketing_emails: boolean;
  weekly_summary: boolean;
  goal_deadline_reminders: boolean;
}

export interface MeasurementUnits {
  system: MeasurementSystem;
  weight_unit: 'kg' | 'lbs';
  height_unit: 'cm' | 'ft_in';
  distance_unit: 'km' | 'miles';
  temperature_unit: 'celsius' | 'fahrenheit';
}

export interface DataSharingPreferences {
  share_with_coaches: boolean;
  share_anonymized_data: boolean;
  export_data_allowed: boolean;
  third_party_integrations: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  category: BadgeCategory;
  earned_at: Date;
  level?: number;
}

export type BadgeCategory = 
  | 'workout'
  | 'nutrition'
  | 'consistency'
  | 'achievement'
  | 'social'
  | 'milestone';

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  height?: number;
  weight?: number;
  fitness_goals?: FitnessGoal[];
  activity_level?: ActivityLevel;
}

export interface ProfileStats {
  total_workouts: number;
  total_calories_burned: number;
  total_active_days: number;
  current_streak: number;
  longest_streak: number;
  average_workout_duration: number;
  favorite_exercise_type: WorkoutType;
  join_date: Date;
}
