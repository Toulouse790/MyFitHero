import { Activity } from 'lucide-react';
// Re-export the unified UserProfile interface
export type { UserProfile } from './userProfile';
import type { UserProfile } from './userProfile';

// Types Supabase Auth
export interface SupabaseAuthUserType {
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    [key: string]: any;
  };
  identities?: Array<{
    id: string;
    user_id: string;
    identity_data: {
      [key: string]: any;
    };
    provider: string;
    created_at: string;
    last_sign_in_at: string;
  }>;
  created_at: string;
  updated_at?: string;
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'fr';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    reminders: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private';
    data_sharing: boolean;
    analytics: boolean;
  };
  units: {
    weight: 'kg' | 'lb';
    distance: 'km' | 'mi';
    temperature: 'c' | 'f';
  };
}

// Types pour l'onboarding
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

export interface OnboardingData {
  steps: OnboardingStep[];
  current_step: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
}

// Types pour les objectifs
export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: 'fitness' | 'nutrition' | 'sleep' | 'hydration' | 'general';
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
  completed_at?: string;
}

// Types pour l'activité utilisateur
export interface UserActivity {
  id: string;
  user_id: string;
  type: 'workout' | 'meal' | 'sleep' | 'hydration' | 'check_in' | 'goal' | 'badge';
  action: string;
  details?: any;
  timestamp: string;
  metadata?: {
    [key: string]: any;
  };
}

// Types pour les réalisations
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  title: string;
  description: string;
  category: string;
  earned_at: string;
  progress: number;
  completed: boolean;
}

export type { UserProfile as default };