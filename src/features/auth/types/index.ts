// Export des types de la feature auth
export * from './conversationalOnboarding';
export * from './onboarding-types';

// ========================================
// AUTH CORE TYPES
// ========================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  weight?: number;
  activity_level?: ActivityLevel;
  fitness_goals?: FitnessGoal[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
  success: boolean;
}

// ========================================
// PROFILE & ONBOARDING TYPES
// ========================================

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type FitnessGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'endurance'
  | 'strength'
  | 'flexibility'
  | 'general_health'
  | 'sport_performance';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  completed: boolean;
  required: boolean;
}

export interface OnboardingProgress {
  current_step: number;
  total_steps: number;
  completed_steps: string[];
  data: Record<string, any>;
}

// ========================================
// SESSION & SECURITY TYPES
// ========================================

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
  email: string;
}
