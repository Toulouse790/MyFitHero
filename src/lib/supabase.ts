import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for development
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  global: {
    headers: {
      'x-my-custom-header': 'myfithero-app',
    },
  },
});

// Database types (extend as needed)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          age: number | null;
          weight: number | null;
          height: number | null;
          gender: 'male' | 'female' | 'other' | null;
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          goals: string[] | null;
          preferred_sports: string[] | null;
          timezone: string | null;
          language: string | null;
          notifications_enabled: boolean | null;
          onboarding_completed: boolean | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          weight?: number | null;
          height?: number | null;
          gender?: 'male' | 'female' | 'other' | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          goals?: string[] | null;
          preferred_sports?: string[] | null;
          timezone?: string | null;
          language?: string | null;
          notifications_enabled?: boolean | null;
          onboarding_completed?: boolean | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          weight?: number | null;
          height?: number | null;
          gender?: 'male' | 'female' | 'other' | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          goals?: string[] | null;
          preferred_sports?: string[] | null;
          timezone?: string | null;
          language?: string | null;
          notifications_enabled?: boolean | null;
          onboarding_completed?: boolean | null;
          updated_at?: string;
        };
      };
      hydration_data: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          water_intake_ml: number;
          goal_ml: number;
          sport_category: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          water_intake_ml: number;
          goal_ml: number;
          sport_category?: string | null;
          notes?: string | null;
        };
        Update: {
          water_intake_ml?: number;
          goal_ml?: number;
          sport_category?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      nutrition_data: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          fiber_g: number;
          sport_category: string | null;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          food_items: any[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          fiber_g: number;
          sport_category?: string | null;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          food_items?: any[] | null;
          notes?: string | null;
        };
        Update: {
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number;
          sport_category?: string | null;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          food_items?: any[] | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      sleep_data: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          bedtime: string;
          wake_time: string;
          duration_hours: number;
          quality_score: number;
          deep_sleep_hours: number | null;
          rem_sleep_hours: number | null;
          sport_category: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          bedtime: string;
          wake_time: string;
          duration_hours: number;
          quality_score: number;
          deep_sleep_hours?: number | null;
          rem_sleep_hours?: number | null;
          sport_category?: string | null;
          notes?: string | null;
        };
        Update: {
          bedtime?: string;
          wake_time?: string;
          duration_hours?: number;
          quality_score?: number;
          deep_sleep_hours?: number | null;
          rem_sleep_hours?: number | null;
          sport_category?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      workout_data: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          workout_type: string;
          duration_minutes: number;
          intensity: 'low' | 'medium' | 'high';
          calories_burned: number | null;
          exercises: any[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          workout_type: string;
          duration_minutes: number;
          intensity: 'low' | 'medium' | 'high';
          calories_burned?: number | null;
          exercises?: any[] | null;
          notes?: string | null;
        };
        Update: {
          workout_type?: string;
          duration_minutes?: number;
          intensity?: 'low' | 'medium' | 'high';
          calories_burned?: number | null;
          exercises?: any[] | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Utility functions for common operations
export const supabaseHelpers = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    return data;
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    return data;
  },

  // Generic data fetcher
  fetchData: async <T>(
    table: string,
    userId: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: number
  ): Promise<T[]> => {
    let query = supabase
      .from(table)
      .select('*')
      .eq('user_id', userId);

    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('date', dateTo);
    }
    if (limit) {
      query = query.limit(limit);
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      throw error;
    }
    
    return data as T[];
  },

  // Generic data inserter
  insertData: async <T>(
    table: string,
    data: any
  ): Promise<T> => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error(`Error inserting data to ${table}:`, error);
      throw error;
    }
    
    return result as T;
  },

  // Generic data updater
  updateData: async <T>(
    table: string,
    id: string,
    updates: any
  ): Promise<T> => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating data in ${table}:`, error);
      throw error;
    }
    
    return data as T;
  },

  // Delete data
  deleteData: async (table: string, id: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting data from ${table}:`, error);
      throw error;
    }
  },

  // Subscribe to realtime changes
  subscribeToChanges: (
    table: string,
    userId: string,
    callback: (payload: any) => void
  ) => {
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// Auth helpers
export const authHelpers = {
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
    
    return data;
  },
};

export default supabase;