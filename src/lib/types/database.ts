export type Json = string | number | boolean | undefined | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string | undefined;
          request_id: string | undefined;
          pillar_type: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          recommendation: string;
          metadata: Json | undefined;
          is_applied: boolean | undefined;
          created_at: string | undefined;
          applied_at: string | undefined;
          applied_by: 'user' | 'auto' | undefined;
          applicable_modules: string[] | undefined;
          confidence_score: number | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          request_id?: string | undefined;
          pillar_type?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          recommendation: string;
          metadata?: Json | undefined;
          is_applied?: boolean | undefined;
          created_at?: string | undefined;
          applied_at?: string | undefined;
          applied_by?: 'user' | 'auto' | undefined;
          applicable_modules?: string[] | undefined;
          confidence_score?: number | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          request_id?: string | undefined;
          pillar_type?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          recommendation?: string;
          metadata?: Json | undefined;
          is_applied?: boolean | undefined;
          created_at?: string | undefined;
          applied_at?: string | undefined;
          applied_by?: 'user' | 'auto' | undefined;
          applicable_modules?: string[] | undefined;
          confidence_score?: number | undefined;
        };
      };
      ai_requests: {
        Row: {
          id: string;
          user_id: string | undefined;
          pillar_type: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          prompt: string;
          context: Json | undefined;
          status: 'pending' | 'processing' | 'completed' | 'failed' | undefined;
          webhook_response: Json | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
          source: 'app' | 'voice' | 'chat' | 'api' | 'webhook' | 'mobile' | 'wearable' | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          pillar_type?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          prompt: string;
          context?: Json | undefined;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | undefined;
          webhook_response?: Json | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
          source?: 'app' | 'voice' | 'chat' | 'api' | 'webhook' | 'mobile' | 'wearable' | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          pillar_type?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'general' | undefined;
          prompt?: string;
          context?: Json | undefined;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | undefined;
          webhook_response?: Json | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
          source?: 'app' | 'voice' | 'chat' | 'api' | 'webhook' | 'mobile' | 'wearable' | undefined;
        };
      };
      countries: {
        Row: {
          code: string;
          name_fr: string;
        };
        Insert: {
          code: string;
          name_fr: string;
        };
        Update: {
          code?: string;
          name_fr?: string;
        };
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mood: number | undefined;
          energy: number | undefined;
          motivation: number | undefined;
          sleep_quality: number | undefined;
          stress_level: number | undefined;
          notes: string | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          mood?: number | undefined;
          energy?: number | undefined;
          motivation?: number | undefined;
          sleep_quality?: number | undefined;
          stress_level?: number | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          mood?: number | undefined;
          energy?: number | undefined;
          motivation?: number | undefined;
          sleep_quality?: number | undefined;
          stress_level?: number | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
        };
      };
      daily_stats: {
        Row: {
          id: string;
          user_id: string | undefined;
          stat_date: string;
          workouts_completed: number | undefined;
          total_workout_minutes: number | undefined;
          calories_burned: number | undefined;
          total_calories: number | undefined;
          total_protein: number | undefined;
          total_carbs: number | undefined;
          total_fat: number | undefined;
          sleep_duration_minutes: number | undefined;
          sleep_quality: number | undefined;
          water_intake_ml: number | undefined;
          hydration_goal_ml: number | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          stat_date: string;
          workouts_completed?: number | undefined;
          total_workout_minutes?: number | undefined;
          calories_burned?: number | undefined;
          total_calories?: number | undefined;
          total_protein?: number | undefined;
          total_carbs?: number | undefined;
          total_fat?: number | undefined;
          sleep_duration_minutes?: number | undefined;
          sleep_quality?: number | undefined;
          water_intake_ml?: number | undefined;
          hydration_goal_ml?: number | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          stat_date?: string;
          workouts_completed?: number | undefined;
          total_workout_minutes?: number | undefined;
          calories_burned?: number | undefined;
          total_calories?: number | undefined;
          total_protein?: number | undefined;
          total_carbs?: number | undefined;
          total_fat?: number | undefined;
          sleep_duration_minutes?: number | undefined;
          sleep_quality?: number | undefined;
          water_intake_ml?: number | undefined;
          hydration_goal_ml?: number | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      dietary_restrictions_reference: {
        Row: {
          id: number;
          name: string;
          category: string | undefined;
          description: string | undefined;
        };
        Insert: {
          id?: number;
          name: string;
          category?: string | undefined;
          description?: string | undefined;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string | undefined;
          description?: string | undefined;
        };
      };
      exercises_complementarity: {
        Row: {
          id: string;
          drill_id: string | undefined;
          strength_ex_id: string | undefined;
          complement_type: string | undefined;
        };
        Insert: {
          id?: string;
          drill_id?: string | undefined;
          strength_ex_id?: string | undefined;
          complement_type?: string | undefined;
        };
        Update: {
          id?: string;
          drill_id?: string | undefined;
          strength_ex_id?: string | undefined;
          complement_type?: string | undefined;
        };
      };
      exercises_library: {
        Row: {
          id: string;
          name: string;
          description: string | undefined;
          category:
            | 'chest'
            | 'back'
            | 'shoulders'
            | 'arms'
            | 'legs'
            | 'core'
            | 'cardio'
            | 'flexibility'
            | undefined;
          muscle_groups: string[] | undefined;
          equipment:
            | 'bodyweight'
            | 'dumbbells'
            | 'barbell'
            | 'resistance_band'
            | 'machine'
            | 'other'
            | undefined;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | undefined;
          instructions: string | undefined;
          notes: string | undefined;
          image_url: string | undefined;
          video_url: string | undefined;
          created_at: string | undefined;
          movement_type: 'push' | 'pull' | 'legs' | 'core' | 'full_body' | undefined;
          exercise_mechanic: 'compound' | 'isolation' | undefined;
          force_type: 'push' | 'pull' | 'static' | undefined;
          level_of_home_use: 'no_equipment' | 'minimal_equipment' | 'some_equipment' | undefined;
          is_outdoor_friendly: boolean | undefined;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | undefined;
          category?:
            | 'chest'
            | 'back'
            | 'shoulders'
            | 'arms'
            | 'legs'
            | 'core'
            | 'cardio'
            | 'flexibility'
            | undefined;
          muscle_groups?: string[] | undefined;
          equipment?:
            | 'bodyweight'
            | 'dumbbells'
            | 'barbell'
            | 'resistance_band'
            | 'machine'
            | 'other'
            | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          instructions?: string | undefined;
          notes?: string | undefined;
          image_url?: string | undefined;
          video_url?: string | undefined;
          created_at?: string | undefined;
          movement_type?: 'push' | 'pull' | 'legs' | 'core' | 'full_body' | undefined;
          exercise_mechanic?: 'compound' | 'isolation' | undefined;
          force_type?: 'push' | 'pull' | 'static' | undefined;
          level_of_home_use?: 'no_equipment' | 'minimal_equipment' | 'some_equipment' | undefined;
          is_outdoor_friendly?: boolean | undefined;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | undefined;
          category?:
            | 'chest'
            | 'back'
            | 'shoulders'
            | 'arms'
            | 'legs'
            | 'core'
            | 'cardio'
            | 'flexibility'
            | undefined;
          muscle_groups?: string[] | undefined;
          equipment?:
            | 'bodyweight'
            | 'dumbbells'
            | 'barbell'
            | 'resistance_band'
            | 'machine'
            | 'other'
            | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          instructions?: string | undefined;
          notes?: string | undefined;
          image_url?: string | undefined;
          video_url?: string | undefined;
          created_at?: string | undefined;
          movement_type?: 'push' | 'pull' | 'legs' | 'core' | 'full_body' | undefined;
          exercise_mechanic?: 'compound' | 'isolation' | undefined;
          force_type?: 'push' | 'pull' | 'static' | undefined;
          level_of_home_use?: 'no_equipment' | 'minimal_equipment' | 'some_equipment' | undefined;
          is_outdoor_friendly?: boolean | undefined;
        };
      };
      food_allergies_reference: {
        Row: {
          id: number;
          name: string;
          category: string | undefined;
          severity_default: string | undefined;
          description: string | undefined;
        };
        Insert: {
          id?: number;
          name: string;
          category?: string | undefined;
          severity_default?: string | undefined;
          description?: string | undefined;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string | undefined;
          severity_default?: string | undefined;
          description?: string | undefined;
        };
      };
      food_preferences: {
        Row: {
          id: string;
          user_id: string | undefined;
          food_name: string | undefined;
          preference: 'intolerance' | 'dislike' | 'temporary' | undefined;
          recorded_at: string | undefined;
          expire_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          food_name?: string | undefined;
          preference?: 'intolerance' | 'dislike' | 'temporary' | undefined;
          recorded_at?: string | undefined;
          expire_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          food_name?: string | undefined;
          preference?: 'intolerance' | 'dislike' | 'temporary' | undefined;
          recorded_at?: string | undefined;
          expire_at?: string | undefined;
        };
      };
      foods_library: {
        Row: {
          id: string;
          name: string;
          brand: string | undefined;
          category:
            | 'fruits'
            | 'vegetables'
            | 'proteins'
            | 'grains'
            | 'dairy'
            | 'fats'
            | 'beverages'
            | 'snacks'
            | 'other'
            | undefined;
          calories_per_100g: number | undefined;
          protein_per_100g: number | undefined;
          carbs_per_100g: number | undefined;
          fat_per_100g: number | undefined;
          fiber_per_100g: number | undefined;
          sugar_per_100g: number | undefined;
          common_units: Json | undefined;
          created_at: string | undefined;
          sodium_per_100g: number | undefined;
          calcium_per_100g: number | undefined;
          iron_per_100g: number | undefined;
          is_vegetarian: boolean | undefined;
          is_vegan: boolean | undefined;
          is_gluten_free: boolean | undefined;
          origin: string | undefined;
          is_dairy_free: boolean | undefined;
          allergens: string[] | undefined;
          dietary_tags: string[] | undefined;
          barcode: string | undefined;
          portion_size_default: number | undefined;
          fdc_id: string | undefined;
          gtin_upc: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          name: string;
          brand?: string | undefined;
          category?:
            | 'fruits'
            | 'vegetables'
            | 'proteins'
            | 'grains'
            | 'dairy'
            | 'fats'
            | 'beverages'
            | 'snacks'
            | 'other'
            | undefined;
          calories_per_100g?: number | undefined;
          protein_per_100g?: number | undefined;
          carbs_per_100g?: number | undefined;
          fat_per_100g?: number | undefined;
          fiber_per_100g?: number | undefined;
          sugar_per_100g?: number | undefined;
          common_units?: Json | undefined;
          created_at?: string | undefined;
          sodium_per_100g?: number | undefined;
          calcium_per_100g?: number | undefined;
          iron_per_100g?: number | undefined;
          is_vegetarian?: boolean | undefined;
          is_vegan?: boolean | undefined;
          is_gluten_free?: boolean | undefined;
          origin?: string | undefined;
          is_dairy_free?: boolean | undefined;
          allergens?: string[] | undefined;
          dietary_tags?: string[] | undefined;
          barcode?: string | undefined;
          portion_size_default?: number | undefined;
          fdc_id?: string | undefined;
          gtin_upc?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string | undefined;
          category?:
            | 'fruits'
            | 'vegetables'
            | 'proteins'
            | 'grains'
            | 'dairy'
            | 'fats'
            | 'beverages'
            | 'snacks'
            | 'other'
            | undefined;
          calories_per_100g?: number | undefined;
          protein_per_100g?: number | undefined;
          carbs_per_100g?: number | undefined;
          fat_per_100g?: number | undefined;
          fiber_per_100g?: number | undefined;
          sugar_per_100g?: number | undefined;
          common_units?: Json | undefined;
          created_at?: string | undefined;
          sodium_per_100g?: number | undefined;
          calcium_per_100g?: number | undefined;
          iron_per_100g?: number | undefined;
          is_vegetarian?: boolean | undefined;
          is_vegan?: boolean | undefined;
          is_gluten_free?: boolean | undefined;
          origin?: string | undefined;
          is_dairy_free?: boolean | undefined;
          allergens?: string[] | undefined;
          dietary_tags?: string[] | undefined;
          barcode?: string | undefined;
          portion_size_default?: number | undefined;
          fdc_id?: string | undefined;
          gtin_upc?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      hydration_logs: {
        Row: {
          id: string;
          user_id: string | undefined;
          log_date: string;
          amount_ml: number;
          drink_type:
            | 'water'
            | 'tea'
            | 'coffee'
            | 'juice'
            | 'sports_drink'
            | 'other'
            | 'electrolytes'
            | undefined;
          logged_at: string | undefined;
          created_at: string | undefined;
          hydration_context:
            | 'normal'
            | 'workout'
            | 'meal'
            | 'wake_up'
            | 'before_sleep'
            | 'medication'
            | 'thirst'
            | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          log_date: string;
          amount_ml: number;
          drink_type?: 'water' | 'tea' | 'coffee' | 'juice' | 'sports_drink' | 'other' | undefined;
          logged_at?: string | undefined;
          created_at?: string | undefined;
          hydration_context?:
            | 'normal'
            | 'workout'
            | 'meal'
            | 'wake_up'
            | 'before_sleep'
            | 'medication'
            | 'thirst'
            | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          log_date?: string;
          amount_ml?: number;
          drink_type?: 'water' | 'tea' | 'coffee' | 'juice' | 'sports_drink' | 'other' | undefined;
          logged_at?: string | undefined;
          created_at?: string | undefined;
          hydration_context?:
            | 'normal'
            | 'workout'
            | 'meal'
            | 'wake_up'
            | 'before_sleep'
            | 'medication'
            | 'thirst'
            | undefined;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string | undefined;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined;
          meal_date: string;
          foods: Json | undefined;
          total_calories: number | undefined;
          total_protein: number | undefined;
          total_carbs: number | undefined;
          total_fat: number | undefined;
          notes: string | undefined;
          created_at: string | undefined;
          is_vegetarian: boolean | undefined;
          is_vegan: boolean | undefined;
          is_gluten_free: boolean | undefined;
          is_dairy_free: boolean | undefined;
          allergens: string[] | undefined;
          meal_photo_url: string | undefined;
          meal_time: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined;
          meal_date: string;
          foods?: Json | undefined;
          total_calories?: number | undefined;
          total_protein?: number | undefined;
          total_carbs?: number | undefined;
          total_fat?: number | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
          is_vegetarian?: boolean | undefined;
          is_vegan?: boolean | undefined;
          is_gluten_free?: boolean | undefined;
          is_dairy_free?: boolean | undefined;
          allergens?: string[] | undefined;
          meal_photo_url?: string | undefined;
          meal_time?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined;
          meal_date?: string;
          foods?: Json | undefined;
          total_calories?: number | undefined;
          total_protein?: number | undefined;
          total_carbs?: number | undefined;
          total_fat?: number | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
          is_vegetarian?: boolean | undefined;
          is_vegan?: boolean | undefined;
          is_gluten_free?: boolean | undefined;
          is_dairy_free?: boolean | undefined;
          allergens?: string[] | undefined;
          meal_photo_url?: string | undefined;
          meal_time?: string | undefined;
        };
      };
      monthly_stats: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          total_workouts: number | undefined;
          total_workout_minutes: number | undefined;
          avg_workout_duration: number | undefined;
          total_calories_burned: number | undefined;
          avg_daily_calories: number | undefined;
          avg_daily_protein: number | undefined;
          avg_daily_carbs: number | undefined;
          avg_daily_fat: number | undefined;
          avg_sleep_duration: number | undefined;
          avg_sleep_quality: number | undefined;
          total_sleep_sessions: number | undefined;
          avg_daily_water_ml: number | undefined;
          hydration_goal_achievement_rate: number | undefined;
          days_with_data: number | undefined;
          profile_type: string | undefined;
          active_modules: string[] | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          total_workouts?: number | undefined;
          total_workout_minutes?: number | undefined;
          avg_workout_duration?: number | undefined;
          total_calories_burned?: number | undefined;
          avg_daily_calories?: number | undefined;
          avg_daily_protein?: number | undefined;
          avg_daily_carbs?: number | undefined;
          avg_daily_fat?: number | undefined;
          avg_sleep_duration?: number | undefined;
          avg_sleep_quality?: number | undefined;
          total_sleep_sessions?: number | undefined;
          avg_daily_water_ml?: number | undefined;
          hydration_goal_achievement_rate?: number | undefined;
          days_with_data?: number | undefined;
          profile_type?: string | undefined;
          active_modules?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          total_workouts?: number | undefined;
          total_workout_minutes?: number | undefined;
          avg_workout_duration?: number | undefined;
          total_calories_burned?: number | undefined;
          avg_daily_calories?: number | undefined;
          avg_daily_protein?: number | undefined;
          avg_daily_carbs?: number | undefined;
          avg_daily_fat?: number | undefined;
          avg_sleep_duration?: number | undefined;
          avg_sleep_quality?: number | undefined;
          total_sleep_sessions?: number | undefined;
          avg_daily_water_ml?: number | undefined;
          hydration_goal_achievement_rate?: number | undefined;
          days_with_data?: number | undefined;
          profile_type?: string | undefined;
          active_modules?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      muscle_recovery_data: {
        Row: {
          id: string;
          user_id: string | undefined;
          muscle_group: string;
          last_workout_date: string | undefined;
          workout_intensity: string | undefined;
          workout_volume: number | undefined;
          workout_duration_minutes: number | undefined;
          recovery_status: string;
          recovery_percentage: number;
          estimated_full_recovery: string;
          fatigue_level: number;
          soreness_level: number;
          readiness_score: number;
          last_updated: string | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          muscle_group: string;
          last_workout_date?: string | undefined;
          workout_intensity?: string | undefined;
          workout_volume?: number | undefined;
          workout_duration_minutes?: number | undefined;
          recovery_status: string;
          recovery_percentage: number;
          estimated_full_recovery: string;
          fatigue_level: number;
          soreness_level: number;
          readiness_score: number;
          last_updated?: string | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          muscle_group?: string;
          last_workout_date?: string | undefined;
          workout_intensity?: string | undefined;
          workout_volume?: number | undefined;
          workout_duration_minutes?: number | undefined;
          recovery_status?: string;
          recovery_percentage?: number;
          estimated_full_recovery?: string;
          fatigue_level?: number;
          soreness_level?: number;
          readiness_score?: number;
          last_updated?: string | undefined;
          created_at?: string | undefined;
        };
      };
      pillar_coordination: {
        Row: {
          id: string;
          user_id: string | undefined;
          coordination_data: Json;
          active: boolean | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          coordination_data: Json;
          active?: boolean | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          coordination_data?: Json;
          active?: boolean | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      risk_alerts: {
        Row: {
          id: string;
          user_id: string | undefined;
          recommendation_id: string | undefined;
          pillar_type: string | undefined;
          risk_code: string | undefined;
          risk_level: 'info' | 'warning' | 'critical' | undefined;
          message: string | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          recommendation_id?: string | undefined;
          pillar_type?: string | undefined;
          risk_code?: string | undefined;
          risk_level?: 'info' | 'warning' | 'critical' | undefined;
          message?: string | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          recommendation_id?: string | undefined;
          pillar_type?: string | undefined;
          risk_code?: string | undefined;
          risk_level?: 'info' | 'warning' | 'critical' | undefined;
          message?: string | undefined;
          created_at?: string | undefined;
        };
      };
      sleep_sessions: {
        Row: {
          id: string;
          user_id: string | undefined;
          sleep_date: string;
          bedtime: string | undefined;
          wake_time: string | undefined;
          duration_minutes: number | undefined;
          quality_rating: number | undefined;
          mood_rating: number | undefined;
          energy_level: number | undefined;
          factors: Json | undefined;
          notes: string | undefined;
          created_at: string | undefined;
          hrv_ms: number | undefined;
          resting_hr: number | undefined;
          sleep_efficiency: number | undefined;
          sleep_stage_data: Json | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          sleep_date: string;
          bedtime?: string | undefined;
          wake_time?: string | undefined;
          duration_minutes?: number | undefined;
          quality_rating?: number | undefined;
          mood_rating?: number | undefined;
          energy_level?: number | undefined;
          factors?: Json | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
          hrv_ms?: number | undefined;
          resting_hr?: number | undefined;
          sleep_efficiency?: number | undefined;
          sleep_stage_data?: Json | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          sleep_date?: string;
          bedtime?: string | undefined;
          wake_time?: string | undefined;
          duration_minutes?: number | undefined;
          quality_rating?: number | undefined;
          mood_rating?: number | undefined;
          energy_level?: number | undefined;
          factors?: Json | undefined;
          notes?: string | undefined;
          created_at?: string | undefined;
          hrv_ms?: number | undefined;
          resting_hr?: number | undefined;
          sleep_efficiency?: number | undefined;
          sleep_stage_data?: Json | undefined;
        };
      };
      sport_drills_library: {
        Row: {
          id: string;
          name: string;
          description: string | undefined;
          sport: string;
          position: string | undefined;
          season_phase: 'pre_season' | 'in_season' | 'off_season' | 'recovery' | undefined;
          goal: 'speed' | 'power' | 'endurance' | 'skill' | 'agility' | 'technical' | undefined;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | undefined;
          duration_seconds: number | undefined;
          equipment: string | undefined;
          instructions: string | undefined;
          video_url: string | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | undefined;
          sport: string;
          position?: string | undefined;
          season_phase?: 'pre_season' | 'in_season' | 'off_season' | 'recovery' | undefined;
          goal?: 'speed' | 'power' | 'endurance' | 'skill' | 'agility' | 'technical' | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          duration_seconds?: number | undefined;
          equipment?: string | undefined;
          instructions?: string | undefined;
          video_url?: string | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | undefined;
          sport?: string;
          position?: string | undefined;
          season_phase?: 'pre_season' | 'in_season' | 'off_season' | 'recovery' | undefined;
          goal?: 'speed' | 'power' | 'endurance' | 'skill' | 'agility' | 'technical' | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          duration_seconds?: number | undefined;
          equipment?: string | undefined;
          instructions?: string | undefined;
          video_url?: string | undefined;
          created_at?: string | undefined;
        };
      };
      sports_library: {
        Row: {
          id: number;
          name: string;
          name_en: string | undefined;
          category: string | undefined;
          country_code: string | undefined;
          is_popular: boolean | undefined;
          positions: string[] | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: number;
          name: string;
          name_en?: string | undefined;
          category?: string | undefined;
          country_code?: string | undefined;
          is_popular?: boolean | undefined;
          positions?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: number;
          name?: string;
          name_en?: string | undefined;
          category?: string | undefined;
          country_code?: string | undefined;
          is_popular?: boolean | undefined;
          positions?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      synthese_finale: {
        Row: {
          id: string;
          user_id: string | undefined;
          thread_id: string | undefined;
          synthese: string | undefined;
          type_demande: string | undefined;
          horodatage: string | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          thread_id?: string | undefined;
          synthese?: string | undefined;
          type_demande?: string | undefined;
          horodatage?: string | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          thread_id?: string | undefined;
          synthese?: string | undefined;
          type_demande?: string | undefined;
          horodatage?: string | undefined;
          created_at?: string | undefined;
        };
      };
      training_load: {
        Row: {
          user_id: string;
          session_id: string;
          start_ts: string | undefined;
          duration_min: number | undefined;
          avg_hr: number | undefined;
          trimp: number | undefined;
          atl: number | undefined;
          ctl: number | undefined;
          acwr: number | undefined;
          hrv_rmssd: number | undefined;
          fatigue_flag: boolean | undefined;
          rpe: number | undefined;
        };
        Insert: {
          user_id: string;
          session_id: string;
          start_ts?: string | undefined;
          duration_min?: number | undefined;
          avg_hr?: number | undefined;
          trimp?: number | undefined;
          atl?: number | undefined;
          ctl?: number | undefined;
          acwr?: number | undefined;
          hrv_rmssd?: number | undefined;
          fatigue_flag?: boolean | undefined;
          rpe?: number | undefined;
        };
        Update: {
          user_id?: string;
          session_id?: string;
          start_ts?: string | undefined;
          duration_min?: number | undefined;
          avg_hr?: number | undefined;
          trimp?: number | undefined;
          atl?: number | undefined;
          ctl?: number | undefined;
          acwr?: number | undefined;
          hrv_rmssd?: number | undefined;
          fatigue_flag?: boolean | undefined;
          rpe?: number | undefined;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          badge_name: string;
          description: string | undefined;
          earned_at: string | undefined;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          metadata: Json | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          badge_name: string;
          description?: string | undefined;
          earned_at?: string | undefined;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          metadata?: Json | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          badge_name?: string;
          description?: string | undefined;
          earned_at?: string | undefined;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          metadata?: Json | undefined;
        };
      };
      user_goals: {
        Row: {
          id: string;
          user_id: string | undefined;
          category: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'weight' | undefined;
          goal_type: string | undefined;
          target_value: number | undefined;
          current_value: number | undefined;
          unit: string | undefined;
          start_date: string | undefined;
          target_date: string | undefined;
          is_active: boolean | undefined;
          achieved_at: string | undefined;
          created_at: string | undefined;
          module: 'general' | 'sport' | 'nutrition' | 'sleep' | 'hydration' | undefined;
          progress_history: Json | undefined;
          reminder_enabled: boolean | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          category?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'weight' | undefined;
          goal_type?: string | undefined;
          target_value?: number | undefined;
          current_value?: number | undefined;
          unit?: string | undefined;
          start_date?: string | undefined;
          target_date?: string | undefined;
          is_active?: boolean | undefined;
          achieved_at?: string | undefined;
          created_at?: string | undefined;
          module?: 'general' | 'sport' | 'nutrition' | 'sleep' | 'hydration' | undefined;
          progress_history?: Json | undefined;
          reminder_enabled?: boolean | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          category?: 'workout' | 'nutrition' | 'sleep' | 'hydration' | 'weight' | undefined;
          goal_type?: string | undefined;
          target_value?: number | undefined;
          current_value?: number | undefined;
          unit?: string | undefined;
          start_date?: string | undefined;
          target_date?: string | undefined;
          is_active?: boolean | undefined;
          achieved_at?: string | undefined;
          created_at?: string | undefined;
          module?: 'general' | 'sport' | 'nutrition' | 'sleep' | 'hydration' | undefined;
          progress_history?: Json | undefined;
          reminder_enabled?: boolean | undefined;
        };
      };
      user_injuries: {
        Row: {
          id: string;
          user_id: string | undefined;
          injury_type: string | undefined;
          side: 'left' | 'right' | 'bilateral' | undefined;
          severity: 'mild' | 'moderate' | 'severe' | undefined;
          occurred_on: string | undefined;
          resolved_on: string | undefined;
          notes: string | undefined;
          is_active: boolean | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          injury_type?: string | undefined;
          side?: 'left' | 'right' | 'bilateral' | undefined;
          severity?: 'mild' | 'moderate' | 'severe' | undefined;
          occurred_on?: string | undefined;
          resolved_on?: string | undefined;
          notes?: string | undefined;
          is_active?: boolean | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          injury_type?: string | undefined;
          side?: 'left' | 'right' | 'bilateral' | undefined;
          severity?: 'mild' | 'moderate' | 'severe' | undefined;
          occurred_on?: string | undefined;
          resolved_on?: string | undefined;
          notes?: string | undefined;
          is_active?: boolean | undefined;
          created_at?: string | undefined;
        };
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          is_read: boolean | undefined;
          scheduled_for: string | undefined;
          sent_at: string | undefined;
          metadata: Json | undefined;
          created_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          is_read?: boolean | undefined;
          scheduled_for?: string | undefined;
          sent_at?: string | undefined;
          metadata?: Json | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general' | undefined;
          is_read?: boolean | undefined;
          scheduled_for?: string | undefined;
          sent_at?: string | undefined;
          metadata?: Json | undefined;
          created_at?: string | undefined;
        };
      };
      user_pillar_data: {
        Row: {
          id: string;
          user_id: string;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout';
          data: Json;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout';
          data?: Json;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout';
          data?: Json;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          username: string | undefined;
          full_name: string | undefined;
          avatar_url: string | undefined;
          age: number | undefined;
          height_cm: number | undefined;
          weight_kg: number | undefined;
          gender: 'male' | 'female' | 'other' | undefined;
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined;
          fitness_goal:
            | 'weight_loss'
            | 'muscle_gain'
            | 'maintenance'
            | 'strength'
            | 'endurance'
            | 'performance'
            | 'recovery'
            | 'energy'
            | 'sleep_quality'
            | 'general_health'
            | 'general'
            | 'none'
            | undefined;
          timezone: string | undefined;
          notifications_enabled: boolean | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
          available_time_per_day: number | undefined;
          fitness_experience: 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined;
          injuries: string[] | undefined;
          primary_goals: string[] | undefined;
          motivation: string | undefined;
          sport: string | undefined;
          sport_position: string | undefined;
          sport_level:
            | 'recreational'
            | 'amateur_competitive'
            | 'semi_professional'
            | 'professional'
            | 'none'
            | undefined;
          training_frequency: number | undefined;
          season_period: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | undefined;
          lifestyle: 'student' | 'office_worker' | 'physical_job' | 'retired' | undefined;
          profile_type: 'complete' | 'wellness' | 'sport_only' | 'sleep_focus' | undefined;
          modules: string[] | undefined;
          active_modules: string[] | undefined;
          dietary_preference:
            | 'omnivore'
            | 'vegetarian'
            | 'vegan'
            | 'pescatarian'
            | 'flexitarian'
            | 'keto'
            | 'paleo'
            | 'mediterranean'
            | 'halal'
            | 'kosher'
            | 'other'
            | undefined;
          dietary_restrictions: string[] | undefined;
          food_allergies: string[] | undefined;
          food_dislikes: string[] | undefined;
          country_code: string | undefined;
          equipment_level:
            | 'no_equipment'
            | 'minimal_equipment'
            | 'some_equipment'
            | 'full_gym'
            | undefined;
          first_name: string | undefined;
          coaching_style: string | undefined;
          target_weight_kg: number | undefined;
          sleep_hours_average: number | undefined;
          water_intake_goal: number | undefined;
          main_obstacles: string[] | undefined;
          connected_devices: string[] | undefined;
          device_brands: Json | undefined;
          email_validated: boolean | undefined;
          last_login: string | undefined;
          language: 'fr' | 'en' | 'es' | 'de' | 'it' | undefined;
          subscription_status:
            | 'free'
            | 'premium'
            | 'pro'
            | 'enterprise'
            | 'trial'
            | 'expired'
            | undefined;
          strength_objective: string | undefined;
          strength_experience: string | undefined;
          nutrition_objective: string | undefined;
          sleep_difficulties: boolean | undefined;
          hydration_reminders: boolean | undefined;
          privacy_consent: boolean | undefined;
          marketing_consent: boolean | undefined;
          onboarding_completed: boolean | undefined;
          onboarding_completed_at: string | undefined;
          role: 'user' | 'admin' | 'coach' | 'moderator';
          height: number | undefined;
          target_weight: number | undefined;
          preferred_workout_time: string | undefined;
          ai_coaching_style: string | undefined;
          profile_version: number | undefined;
        };
        Insert: {
          id: string;
          username?: string | undefined;
          full_name?: string | undefined;
          avatar_url?: string | undefined;
          age?: number | undefined;
          height_cm?: number | undefined;
          weight_kg?: number | undefined;
          gender?: 'male' | 'female' | 'other' | undefined;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined;
          fitness_goal?:
            | 'weight_loss'
            | 'muscle_gain'
            | 'maintenance'
            | 'strength'
            | 'endurance'
            | 'performance'
            | 'recovery'
            | 'energy'
            | 'sleep_quality'
            | 'general_health'
            | 'general'
            | 'none'
            | undefined;
          timezone?: string | undefined;
          notifications_enabled?: boolean | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
          available_time_per_day?: number | undefined;
          fitness_experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined;
          injuries?: string[] | undefined;
          primary_goals?: string[] | undefined;
          motivation?: string | undefined;
          sport?: string | undefined;
          sport_position?: string | undefined;
          sport_level?:
            | 'recreational'
            | 'amateur_competitive'
            | 'semi_professional'
            | 'professional'
            | 'none'
            | undefined;
          training_frequency?: number | undefined;
          season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | undefined;
          lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired' | undefined;
          profile_type?: 'complete' | 'wellness' | 'sport_only' | 'sleep_focus' | undefined;
          modules?: string[] | undefined;
          active_modules?: string[] | undefined;
          dietary_preference?:
            | 'omnivore'
            | 'vegetarian'
            | 'vegan'
            | 'pescatarian'
            | 'flexitarian'
            | 'keto'
            | 'paleo'
            | 'mediterranean'
            | 'halal'
            | 'kosher'
            | 'other'
            | undefined;
          dietary_restrictions?: string[] | undefined;
          food_allergies?: string[] | undefined;
          food_dislikes?: string[] | undefined;
          country_code?: string | undefined;
          equipment_level?:
            | 'no_equipment'
            | 'minimal_equipment'
            | 'some_equipment'
            | 'full_gym'
            | undefined;
          first_name?: string | undefined;
          coaching_style?: string | undefined;
          target_weight_kg?: number | undefined;
          sleep_hours_average?: number | undefined;
          water_intake_goal?: number | undefined;
          main_obstacles?: string[] | undefined;
          connected_devices?: string[] | undefined;
          device_brands?: Json | undefined;
          email_validated?: boolean | undefined;
          last_login?: string | undefined;
          language?: 'fr' | 'en' | 'es' | 'de' | 'it' | undefined;
          subscription_status?:
            | 'free'
            | 'premium'
            | 'pro'
            | 'enterprise'
            | 'trial'
            | 'expired'
            | undefined;
          strength_objective?: string | undefined;
          strength_experience?: string | undefined;
          nutrition_objective?: string | undefined;
          sleep_difficulties?: boolean | undefined;
          hydration_reminders?: boolean | undefined;
          privacy_consent?: boolean | undefined;
          marketing_consent?: boolean | undefined;
          onboarding_completed?: boolean | undefined;
          onboarding_completed_at?: string | undefined;
          role?: 'user' | 'admin' | 'coach' | 'moderator';
          height?: number | undefined;
          target_weight?: number | undefined;
          preferred_workout_time?: string | undefined;
          ai_coaching_style?: string | undefined;
          profile_version?: number | undefined;
        };
        Update: {
          id?: string;
          username?: string | undefined;
          full_name?: string | undefined;
          avatar_url?: string | undefined;
          age?: number | undefined;
          height_cm?: number | undefined;
          weight_kg?: number | undefined;
          gender?: 'male' | 'female' | 'other' | undefined;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined;
          fitness_goal?:
            | 'weight_loss'
            | 'muscle_gain'
            | 'maintenance'
            | 'strength'
            | 'endurance'
            | 'performance'
            | 'recovery'
            | 'energy'
            | 'sleep_quality'
            | 'general_health'
            | 'general'
            | 'none'
            | undefined;
          timezone?: string | undefined;
          notifications_enabled?: boolean | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
          available_time_per_day?: number | undefined;
          fitness_experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined;
          injuries?: string[] | undefined;
          primary_goals?: string[] | undefined;
          motivation?: string | undefined;
          sport?: string | undefined;
          sport_position?: string | undefined;
          sport_level?:
            | 'recreational'
            | 'amateur_competitive'
            | 'semi_professional'
            | 'professional'
            | 'none'
            | undefined;
          training_frequency?: number | undefined;
          season_period?: 'off_season' | 'pre_season' | 'in_season' | 'recovery' | undefined;
          lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired' | undefined;
          profile_type?: 'complete' | 'wellness' | 'sport_only' | 'sleep_focus' | undefined;
          modules?: string[] | undefined;
          active_modules?: string[] | undefined;
          dietary_preference?:
            | 'omnivore'
            | 'vegetarian'
            | 'vegan'
            | 'pescatarian'
            | 'flexitarian'
            | 'keto'
            | 'paleo'
            | 'mediterranean'
            | 'halal'
            | 'kosher'
            | 'other'
            | undefined;
          dietary_restrictions?: string[] | undefined;
          food_allergies?: string[] | undefined;
          food_dislikes?: string[] | undefined;
          country_code?: string | undefined;
          equipment_level?:
            | 'no_equipment'
            | 'minimal_equipment'
            | 'some_equipment'
            | 'full_gym'
            | undefined;
          first_name?: string | undefined;
          coaching_style?: string | undefined;
          target_weight_kg?: number | undefined;
          sleep_hours_average?: number | undefined;
          water_intake_goal?: number | undefined;
          main_obstacles?: string[] | undefined;
          connected_devices?: string[] | undefined;
          device_brands?: Json | undefined;
          email_validated?: boolean | undefined;
          last_login?: string | undefined;
          language?: 'fr' | 'en' | 'es' | 'de' | 'it' | undefined;
          subscription_status?:
            | 'free'
            | 'premium'
            | 'pro'
            | 'enterprise'
            | 'trial'
            | 'expired'
            | undefined;
          strength_objective?: string | undefined;
          strength_experience?: string | undefined;
          nutrition_objective?: string | undefined;
          sleep_difficulties?: boolean | undefined;
          hydration_reminders?: boolean | undefined;
          privacy_consent?: boolean | undefined;
          marketing_consent?: boolean | undefined;
          onboarding_completed?: boolean | undefined;
          onboarding_completed_at?: string | undefined;
          role?: 'user' | 'admin' | 'coach' | 'moderator';
          height?: number | undefined;
          target_weight?: number | undefined;
          preferred_workout_time?: string | undefined;
          ai_coaching_style?: string | undefined;
          profile_version?: number | undefined;
        };
      };
      user_recovery_profiles: {
        Row: {
          id: string;
          user_id: string | undefined;
          recovery_rate_multiplier: number | undefined;
          sleep_quality_impact: number | undefined;
          nutrition_quality_impact: number | undefined;
          stress_level_impact: number | undefined;
          hydration_impact: number | undefined;
          age_factor: number | undefined;
          fitness_level_factor: number | undefined;
          injury_history: string[] | undefined;
          supplements: string[] | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          recovery_rate_multiplier?: number | undefined;
          sleep_quality_impact?: number | undefined;
          nutrition_quality_impact?: number | undefined;
          stress_level_impact?: number | undefined;
          hydration_impact?: number | undefined;
          age_factor?: number | undefined;
          fitness_level_factor?: number | undefined;
          injury_history?: string[] | undefined;
          supplements?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          recovery_rate_multiplier?: number | undefined;
          sleep_quality_impact?: number | undefined;
          nutrition_quality_impact?: number | undefined;
          stress_level_impact?: number | undefined;
          hydration_impact?: number | undefined;
          age_factor?: number | undefined;
          fitness_level_factor?: number | undefined;
          injury_history?: string[] | undefined;
          supplements?: string[] | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general';
          stat_type: string;
          value: number;
          date: string;
          metadata: Json | undefined;
          created_at: string | undefined;
          updated_at: string | undefined;
        };
        Insert: {
          id?: string;
          user_id: string;
          pillar_type: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general';
          stat_type: string;
          value?: number;
          date?: string;
          metadata?: Json | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string;
          user_id?: string;
          pillar_type?: 'hydration' | 'nutrition' | 'sleep' | 'workout' | 'general';
          stat_type?: string;
          value?: number;
          date?: string;
          metadata?: Json | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string | undefined;
          name: string;
          description: string | undefined;
          workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other' | undefined;
          duration_minutes: number | undefined;
          calories_burned: number | undefined;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | undefined;
          exercises: Json | undefined;
          notes: string | undefined;
          started_at: string | undefined;
          completed_at: string | undefined;
          created_at: string | undefined;
          plan_id: string | undefined;
          is_template: boolean | undefined;
          muscle_objectives: string[] | undefined;
        };
        Insert: {
          id?: string;
          user_id?: string | undefined;
          name: string;
          description?: string | undefined;
          workout_type?: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other' | undefined;
          duration_minutes?: number | undefined;
          calories_burned?: number | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          exercises?: Json | undefined;
          notes?: string | undefined;
          started_at?: string | undefined;
          completed_at?: string | undefined;
          created_at?: string | undefined;
          plan_id?: string | undefined;
          is_template?: boolean | undefined;
          muscle_objectives?: string[] | undefined;
        };
        Update: {
          id?: string;
          user_id?: string | undefined;
          name?: string;
          description?: string | undefined;
          workout_type?: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other' | undefined;
          duration_minutes?: number | undefined;
          calories_burned?: number | undefined;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | undefined;
          exercises?: Json | undefined;
          notes?: string | undefined;
          started_at?: string | undefined;
          completed_at?: string | undefined;
          created_at?: string | undefined;
          plan_id?: string | undefined;
          is_template?: boolean | undefined;
          muscle_objectives?: string[] | undefined;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Types extraits pour faciliter l'utilisation
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type DailyStats = Database['public']['Tables']['daily_stats']['Row'];
export type DailyStatsInsert = Database['public']['Tables']['daily_stats']['Insert'];
export type DailyStatsUpdate = Database['public']['Tables']['daily_stats']['Update'];

export type Workout = Database['public']['Tables']['workouts']['Row'];
export type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];
export type WorkoutUpdate = Database['public']['Tables']['workouts']['Update'];

export type Meal = Database['public']['Tables']['meals']['Row'];
export type MealInsert = Database['public']['Tables']['meals']['Insert'];

export type SleepSession = Database['public']['Tables']['sleep_sessions']['Row'];
export type SleepSessionInsert = Database['public']['Tables']['sleep_sessions']['Insert'];

export type HydrationLog = Database['public']['Tables']['hydration_logs']['Row'];
export type HydrationLogInsert = Database['public']['Tables']['hydration_logs']['Insert'];

export type AiRecommendation = Database['public']['Tables']['ai_recommendations']['Row'];
export type UserGoal = Database['public']['Tables']['user_goals']['Row'];
export type UserNotification = Database['public']['Tables']['user_notifications']['Row'];

// Types pour la récupération musculaire
export interface UserRecoveryProfile {
  id: string;
  user_id: string;
  recovery_rate_preference: 'slow' | 'moderate' | 'fast';
  muscle_sensitivity_scores: Record<string, number>;
  preferred_recovery_methods: string[];
  sleep_quality_weight: number;
  nutrition_quality_weight: number;
  stress_level_weight: number;
  workout_intensity_weight: number;
  created_at: string;
  updated_at: string;
}

export interface MuscleRecoveryData {
  id: string;
  user_id: string;
  muscle_group: string;
  soreness_level: number;
  recovery_percentage: number;
  recommended_rest_hours: number;
  last_workout_date: string;
  recovery_methods_used: string[];
  effectiveness_scores: Record<string, number>;
  created_at: string;
  updated_at: string;
}
