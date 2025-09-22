// Unified UserProfile interface for MyFitHero
// This is the single source of truth for UserProfile across the app

export interface UserProfile {
  // Base user information
  id: string;
  email?: string;
  username?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // Personal metrics
  age?: number | null;
  height?: number | null;  // Using consistent naming
  weight?: number | null;  // Using consistent naming
  gender?: 'male' | 'female' | 'other' | null;

  // Location for nutrition personalization (CRITICAL for global market)
  city?: string | null;
  country?: string | null;
  timezone?: string | null;
  language?: string | null;

  // Activity and fitness
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  fitness_experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  fitness_goal?: string | null;
  primary_goals?: string[];

  // Sport-specific
  sport?: string | null;
  sport_name?: string | null;
  sport_position?: string | null;
  sport_level?: 'recreational' | 'amateur_competitive' | 'semi_professional' | 'professional' | null;
  preferred_sports?: string[];

  // Training preferences
  training_frequency?: number | null;
  available_time_per_day?: number | null;
  season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | null;
  
  // Lifestyle
  lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired' | null;
  
  // Health and limitations
  injuries?: string[];

  // App features and onboarding
  onboarding_completed?: boolean | null;
  onboarding_completed_at?: string | null;
  active_modules?: string[];
  modules?: string[];
  profile_type?: 'complete' | 'wellness' | 'sport_only' | 'sleep_focus' | null;

  // Gamification
  level?: number | null;
  totalPoints?: number | null;
  goal?: string | null;

  // Permissions and settings
  role?: 'user' | 'admin' | 'coach' | 'moderator';
  notifications_enabled?: boolean | null;

  // Sport-specific stats (flexible for different sports)
  sport_specific_stats?: Record<string, number>;
  
  // Additional motivation and context
  motivation?: string | null;
}

// Legacy compatibility types (deprecated, use UserProfile instead)
export type UserProfileLegacy = UserProfile;

export default UserProfile;