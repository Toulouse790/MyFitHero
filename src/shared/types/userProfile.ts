// Unified UserProfile interface for MyFitHero
// This is the single source of truth for UserProfile across the app

export interface UserProfile {
  // Base user information
  id: string;
  email?: string;
  username?: string | undefined;
  full_name?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  bio?: string | undefined;
  avatar_url?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;

  // Personal metrics
  age?: number | undefined;
  height?: number | undefined;  // Using consistent naming
  weight?: number | undefined;  // Using consistent naming
  gender?: 'male' | 'female' | undefined; // Removed 'other' for better AI nutrition/sport advice

  // Location for nutrition personalization (CRITICAL for global market)
  city?: string | undefined;
  country?: string | undefined;
  timezone?: string | undefined;
  language?: string | undefined;

  // Activity and fitness
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined;
  fitness_experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined;
  fitness_goal?: string | undefined;
  primary_goals?: string[];

  // Sport-specific
  sport?: string | undefined;
  sport_name?: string | undefined;
  sport_position?: string | undefined;
  sport_level?: 'recreational' | 'amateur_competitive' | 'semi_professional' | 'professional' | undefined;
  preferred_sports?: string[];

  // Training preferences
  training_frequency?: number | undefined;
  available_time_per_day?: number | undefined;
  season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | undefined;
  
  // Lifestyle
  lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired' | undefined;
  
  // Health and limitations
  injuries?: string[];

  // App features and onboarding
  onboarding_completed?: boolean | undefined;
  onboarding_completed_at?: string | undefined;
  active_modules?: string[];
  modules?: string[];
  profile_type?: 'complete' | 'wellness' | 'sport_only' | 'sleep_focus' | undefined;

  // Gamification
  level?: number | undefined;
  totalPoints?: number | undefined;
  goal?: string | undefined;

  // Permissions and settings
  role?: 'user' | 'admin' | 'coach' | 'moderator';
  notifications_enabled?: boolean | undefined;

  // Sport-specific stats (flexible for different sports)
  sport_specific_stats?: Record<string, number>;
  
  // Additional motivation and context
  motivation?: string | undefined;
}

// Legacy compatibility types (deprecated, use UserProfile instead)
export type UserProfileLegacy = UserProfile;

export default UserProfile;