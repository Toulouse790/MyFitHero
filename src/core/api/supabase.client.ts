import { createClient } from '@supabase/supabase-js';
import { env } from '@/core/config/env.config';

// Types pour Supabase (à adapter selon ton schéma)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username?: string;
          first_name?: string;
          last_name?: string;
          sport?: string;
          weight?: number;
          height?: number;
          age?: number;
          gender?: 'male' | 'female';
          lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired';
          primary_goals?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      daily_stats: {
        Row: {
          id: string;
          user_id: string;
          stat_date: string;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          water_intake_ml: number;
          sleep_hours?: number;
          workout_minutes?: number;
          created_at: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          duration_minutes: number;
          calories_burned: number;
          exercises: any[];
          completed_at: string;
          created_at: string;
        };
      };
      nutrition_entries: {
        Row: {
          id: string;
          user_id: string;
          food_name: string;
          quantity: number;
          unit: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          consumed_at: string;
        };
      };
    };
  };
}

// Client Supabase singleton
export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper functions
export const supabaseAuth = {
  // Inscription
  async signUp(email: string, password: string, metadata?: any) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  // Connexion
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Déconnexion
  async signOut() {
    return await supabase.auth.signOut();
  },

  // Récupération session
  async getSession() {
    return await supabase.auth.getSession();
  },

  // Récupération utilisateur
  async getUser() {
    return await supabase.auth.getUser();
  },

  // Réinitialisation mot de passe
  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  // Mise à jour utilisateur
  async updateUser(attributes: any) {
    return await supabase.auth.updateUser(attributes);
  },
};

export default supabase;
