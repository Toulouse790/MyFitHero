/**
 * 🎯 MYFITHERO AUTH - TYPES INDEX 6★/5
 * Point d'entrée principal pour tous les types d'authentification
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

// ============================================================================
// EXPORTS PRINCIPAUX - TYPES AVANCÉS 6★/5
// ============================================================================

// Types ultra-rigoureux niveau enterprise
export * from './advanced';
export * from './validators';

// Types conversationnels (existants)
export * from './conversationalOnboarding';

// ========================================
// AUTH CORE TYPES (COMPATIBILITÉ LEGACY)
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
  gender?: 'male' | 'female'; // Removed 'other' for better AI advice
  height?: number;
  weight?: number;
  activity_level?: ActivityLevel;
  fitness_goals?: FitnessGoal[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | undefined;
  profile: UserProfile | undefined;
  loading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User | undefined;
  error: string | undefined;
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

export interface SessionValidation {
  isValid: boolean;
  expiresIn: number;
  user: User | undefined;
  permissions: string[];
  lastActivity: string;
}

export interface SessionInfo {
  deviceId: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  lastSeen: string;
  isActive: boolean;
}

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

// ========================================
// ADDITIONAL MISSING TYPES
// ========================================

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female'; // Removed 'other' for better AI advice
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  fitnessGoals?: FitnessGoal[];
}

export interface UpdatePreferencesData {
  language?: string;
  timezone?: string;
  units?: 'metric' | 'imperial';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  avatar?: string;
}

export interface LoginResponse {
  session: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    deviceInfo?: {
      deviceId: string;
      platform: string;
      osVersion: string;
      appVersion: string;
      lastSeen: string;
      isActive: boolean;
    };
  };
  isFirstLogin: boolean;
  requiresTwoFactor: boolean;
  twoFactorMethods: string[];
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserStatsResponse {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkout: string;
  joinedDaysAgo: number;
}

export interface SessionInfo {
  deviceId: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  lastSeen: string;
  isActive: boolean;
}

export interface OAuthCredentials {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
  email?: string;
}
