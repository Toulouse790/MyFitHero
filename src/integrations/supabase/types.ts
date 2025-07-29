export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          applicable_modules: string[] | null
          applied_at: string | null
          applied_by: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          is_applied: boolean | null
          metadata: Json | null
          pillar_type: string | null
          recommendation: string
          request_id: string | null
          user_id: string | null
        }
        Insert: {
          applicable_modules?: string[] | null
          applied_at?: string | null
          applied_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          metadata?: Json | null
          pillar_type?: string | null
          recommendation: string
          request_id?: string | null
          user_id?: string | null
        }
        Update: {
          applicable_modules?: string[] | null
          applied_at?: string | null
          applied_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          metadata?: Json | null
          pillar_type?: string | null
          recommendation?: string
          request_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "ai_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_requests: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          pillar_type: string | null
          prompt: string
          source: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          webhook_response: Json | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          pillar_type?: string | null
          prompt: string
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_response?: Json | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          pillar_type?: string | null
          prompt?: string
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_response?: Json | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          name_fr: string
        }
        Insert: {
          code: string
          name_fr: string
        }
        Update: {
          code?: string
          name_fr?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          created_at: string | null
          date: string
          energy: number | null
          id: string
          mood: number | null
          motivation: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          energy?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          energy?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_stats: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          hydration_goal_ml: number | null
          id: string
          sleep_duration_minutes: number | null
          sleep_quality: number | null
          stat_date: string
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          total_workout_minutes: number | null
          updated_at: string | null
          user_id: string | null
          water_intake_ml: number | null
          workouts_completed: number | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          hydration_goal_ml?: number | null
          id?: string
          sleep_duration_minutes?: number | null
          sleep_quality?: number | null
          stat_date: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          total_workout_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
          water_intake_ml?: number | null
          workouts_completed?: number | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          hydration_goal_ml?: number | null
          id?: string
          sleep_duration_minutes?: number | null
          sleep_quality?: number | null
          stat_date?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          total_workout_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
          water_intake_ml?: number | null
          workouts_completed?: number | null
        }
        Relationships: []
      }
      dietary_restrictions_reference: {
        Row: {
          category: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      exercises_complementarity: {
        Row: {
          complement_type: string | null
          drill_id: string | null
          id: string
          strength_ex_id: string | null
        }
        Insert: {
          complement_type?: string | null
          drill_id?: string | null
          id?: string
          strength_ex_id?: string | null
        }
        Update: {
          complement_type?: string | null
          drill_id?: string | null
          id?: string
          strength_ex_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_complementarity_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "sport_drills_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_complementarity_strength_ex_id_fkey"
            columns: ["strength_ex_id"]
            isOneToOne: false
            referencedRelation: "exercises_library"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises_library: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          equipment: string | null
          exercise_mechanic: string | null
          force_type: string | null
          id: string
          image_url: string | null
          instructions: string | null
          is_outdoor_friendly: boolean | null
          level_of_home_use: string | null
          movement_type: string | null
          muscle_groups: string[] | null
          name: string
          notes: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          exercise_mechanic?: string | null
          force_type?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_outdoor_friendly?: boolean | null
          level_of_home_use?: string | null
          movement_type?: string | null
          muscle_groups?: string[] | null
          name: string
          notes?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          equipment?: string | null
          exercise_mechanic?: string | null
          force_type?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_outdoor_friendly?: boolean | null
          level_of_home_use?: string | null
          movement_type?: string | null
          muscle_groups?: string[] | null
          name?: string
          notes?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      food_allergies_reference: {
        Row: {
          category: string | null
          description: string | null
          id: number
          name: string
          severity_default: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: number
          name: string
          severity_default?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: number
          name?: string
          severity_default?: string | null
        }
        Relationships: []
      }
      food_preferences: {
        Row: {
          expire_at: string | null
          food_name: string | null
          id: string
          preference: string | null
          recorded_at: string | null
          user_id: string | null
        }
        Insert: {
          expire_at?: string | null
          food_name?: string | null
          id?: string
          preference?: string | null
          recorded_at?: string | null
          user_id?: string | null
        }
        Update: {
          expire_at?: string | null
          food_name?: string | null
          id?: string
          preference?: string | null
          recorded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      foods_library: {
        Row: {
          allergens: string[] | null
          barcode: string | null
          brand: string | null
          calcium_per_100g: number | null
          calories_per_100g: number | null
          carbs_per_100g: number | null
          category: string | null
          common_units: Json | null
          created_at: string | null
          dietary_tags: string[] | null
          fat_per_100g: number | null
          fdc_id: string | null
          fiber_per_100g: number | null
          gtin_upc: string | null
          id: string
          iron_per_100g: number | null
          is_dairy_free: boolean | null
          is_gluten_free: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          origin: string | null
          portion_size_default: number | null
          protein_per_100g: number | null
          sodium_per_100g: number | null
          sugar_per_100g: number | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          barcode?: string | null
          brand?: string | null
          calcium_per_100g?: number | null
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          category?: string | null
          common_units?: Json | null
          created_at?: string | null
          dietary_tags?: string[] | null
          fat_per_100g?: number | null
          fdc_id?: string | null
          fiber_per_100g?: number | null
          gtin_upc?: string | null
          id?: string
          iron_per_100g?: number | null
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          origin?: string | null
          portion_size_default?: number | null
          protein_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          barcode?: string | null
          brand?: string | null
          calcium_per_100g?: number | null
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          category?: string | null
          common_units?: Json | null
          created_at?: string | null
          dietary_tags?: string[] | null
          fat_per_100g?: number | null
          fdc_id?: string | null
          fiber_per_100g?: number | null
          gtin_upc?: string | null
          id?: string
          iron_per_100g?: number | null
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          origin?: string | null
          portion_size_default?: number | null
          protein_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hydration_logs: {
        Row: {
          amount_ml: number
          created_at: string | null
          drink_type: string | null
          hydration_context: string | null
          id: string
          log_date: string
          logged_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_ml: number
          created_at?: string | null
          drink_type?: string | null
          hydration_context?: string | null
          id?: string
          log_date: string
          logged_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          drink_type?: string | null
          hydration_context?: string | null
          id?: string
          log_date?: string
          logged_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          allergens: string[] | null
          created_at: string | null
          foods: Json | null
          id: string
          is_dairy_free: boolean | null
          is_gluten_free: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          meal_date: string
          meal_photo_url: string | null
          meal_time: string | null
          meal_type: string | null
          notes: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string | null
        }
        Insert: {
          allergens?: string[] | null
          created_at?: string | null
          foods?: Json | null
          id?: string
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          meal_date: string
          meal_photo_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string | null
        }
        Update: {
          allergens?: string[] | null
          created_at?: string | null
          foods?: Json | null
          id?: string
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          meal_date?: string
          meal_photo_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      monthly_stats: {
        Row: {
          active_modules: string[] | null
          avg_daily_calories: number | null
          avg_daily_carbs: number | null
          avg_daily_fat: number | null
          avg_daily_protein: number | null
          avg_daily_water_ml: number | null
          avg_sleep_duration: number | null
          avg_sleep_quality: number | null
          avg_workout_duration: number | null
          created_at: string | null
          days_with_data: number | null
          hydration_goal_achievement_rate: number | null
          id: string
          month: string
          profile_type: string | null
          total_calories_burned: number | null
          total_sleep_sessions: number | null
          total_workout_minutes: number | null
          total_workouts: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_modules?: string[] | null
          avg_daily_calories?: number | null
          avg_daily_carbs?: number | null
          avg_daily_fat?: number | null
          avg_daily_protein?: number | null
          avg_daily_water_ml?: number | null
          avg_sleep_duration?: number | null
          avg_sleep_quality?: number | null
          avg_workout_duration?: number | null
          created_at?: string | null
          days_with_data?: number | null
          hydration_goal_achievement_rate?: number | null
          id?: string
          month: string
          profile_type?: string | null
          total_calories_burned?: number | null
          total_sleep_sessions?: number | null
          total_workout_minutes?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_modules?: string[] | null
          avg_daily_calories?: number | null
          avg_daily_carbs?: number | null
          avg_daily_fat?: number | null
          avg_daily_protein?: number | null
          avg_daily_water_ml?: number | null
          avg_sleep_duration?: number | null
          avg_sleep_quality?: number | null
          avg_workout_duration?: number | null
          created_at?: string | null
          days_with_data?: number | null
          hydration_goal_achievement_rate?: number | null
          id?: string
          month?: string
          profile_type?: string | null
          total_calories_burned?: number | null
          total_sleep_sessions?: number | null
          total_workout_minutes?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      muscle_recovery_data: {
        Row: {
          created_at: string | null
          estimated_full_recovery: string
          fatigue_level: number
          id: string
          last_updated: string | null
          last_workout_date: string | null
          muscle_group: string
          readiness_score: number
          recovery_percentage: number
          recovery_status: string
          soreness_level: number
          user_id: string | null
          workout_duration_minutes: number | null
          workout_intensity: string | null
          workout_volume: number | null
        }
        Insert: {
          created_at?: string | null
          estimated_full_recovery: string
          fatigue_level: number
          id?: string
          last_updated?: string | null
          last_workout_date?: string | null
          muscle_group: string
          readiness_score: number
          recovery_percentage: number
          recovery_status: string
          soreness_level: number
          user_id?: string | null
          workout_duration_minutes?: number | null
          workout_intensity?: string | null
          workout_volume?: number | null
        }
        Update: {
          created_at?: string | null
          estimated_full_recovery?: string
          fatigue_level?: number
          id?: string
          last_updated?: string | null
          last_workout_date?: string | null
          muscle_group?: string
          readiness_score?: number
          recovery_percentage?: number
          recovery_status?: string
          soreness_level?: number
          user_id?: string | null
          workout_duration_minutes?: number | null
          workout_intensity?: string | null
          workout_volume?: number | null
        }
        Relationships: []
      }
      pillar_coordination: {
        Row: {
          active: boolean | null
          coordination_data: Json
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          coordination_data: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          coordination_data?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      risk_alerts: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          pillar_type: string | null
          recommendation_id: string | null
          risk_code: string | null
          risk_level: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          pillar_type?: string | null
          recommendation_id?: string | null
          risk_code?: string | null
          risk_level?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          pillar_type?: string | null
          recommendation_id?: string | null
          risk_code?: string | null
          risk_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sleep_sessions: {
        Row: {
          bedtime: string | null
          created_at: string | null
          duration_minutes: number | null
          energy_level: number | null
          factors: Json | null
          hrv_ms: number | null
          id: string
          mood_rating: number | null
          notes: string | null
          quality_rating: number | null
          resting_hr: number | null
          sleep_date: string
          sleep_efficiency: number | null
          sleep_stage_data: Json | null
          user_id: string | null
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          factors?: Json | null
          hrv_ms?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          quality_rating?: number | null
          resting_hr?: number | null
          sleep_date: string
          sleep_efficiency?: number | null
          sleep_stage_data?: Json | null
          user_id?: string | null
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          factors?: Json | null
          hrv_ms?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          quality_rating?: number | null
          resting_hr?: number | null
          sleep_date?: string
          sleep_efficiency?: number | null
          sleep_stage_data?: Json | null
          user_id?: string | null
          wake_time?: string | null
        }
        Relationships: []
      }
      sport_drills_library: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_seconds: number | null
          equipment: string | null
          goal: string | null
          id: string
          instructions: string | null
          name: string
          position: string | null
          season_phase: string | null
          sport: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          equipment?: string | null
          goal?: string | null
          id?: string
          instructions?: string | null
          name: string
          position?: string | null
          season_phase?: string | null
          sport: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          equipment?: string | null
          goal?: string | null
          id?: string
          instructions?: string | null
          name?: string
          position?: string | null
          season_phase?: string | null
          sport?: string
          video_url?: string | null
        }
        Relationships: []
      }
      sports_library: {
        Row: {
          category: string | null
          country_code: string | null
          created_at: string | null
          id: number
          is_popular: boolean | null
          name: string
          name_en: string | null
          positions: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          country_code?: string | null
          created_at?: string | null
          id?: number
          is_popular?: boolean | null
          name: string
          name_en?: string | null
          positions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          country_code?: string | null
          created_at?: string | null
          id?: number
          is_popular?: boolean | null
          name?: string
          name_en?: string | null
          positions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      synthese_finale: {
        Row: {
          created_at: string | null
          horodatage: string | null
          id: string
          synthese: string | null
          thread_id: string | null
          type_demande: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          horodatage?: string | null
          id?: string
          synthese?: string | null
          thread_id?: string | null
          type_demande?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          horodatage?: string | null
          id?: string
          synthese?: string | null
          thread_id?: string | null
          type_demande?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "synthese_finale_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "ai_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      training_load: {
        Row: {
          acwr: number | null
          atl: number | null
          avg_hr: number | null
          ctl: number | null
          duration_min: number | null
          fatigue_flag: boolean | null
          hrv_rmssd: number | null
          rpe: number | null
          session_id: string
          start_ts: string | null
          trimp: number | null
          user_id: string
        }
        Insert: {
          acwr?: number | null
          atl?: number | null
          avg_hr?: number | null
          ctl?: number | null
          duration_min?: number | null
          fatigue_flag?: boolean | null
          hrv_rmssd?: number | null
          rpe?: number | null
          session_id: string
          start_ts?: string | null
          trimp?: number | null
          user_id: string
        }
        Update: {
          acwr?: number | null
          atl?: number | null
          avg_hr?: number | null
          ctl?: number | null
          duration_min?: number | null
          fatigue_flag?: boolean | null
          hrv_rmssd?: number | null
          rpe?: number | null
          session_id?: string
          start_ts?: string | null
          trimp?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string | null
          id: string
          metadata: Json | null
          pillar_type: string | null
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          pillar_type?: string | null
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          pillar_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          achieved_at: string | null
          category: string | null
          created_at: string | null
          current_value: number | null
          goal_type: string | null
          id: string
          is_active: boolean | null
          module: string | null
          progress_history: Json | null
          reminder_enabled: boolean | null
          start_date: string | null
          target_date: string | null
          target_value: number | null
          unit: string | null
          user_id: string | null
        }
        Insert: {
          achieved_at?: string | null
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type?: string | null
          id?: string
          is_active?: boolean | null
          module?: string | null
          progress_history?: Json | null
          reminder_enabled?: boolean | null
          start_date?: string | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          achieved_at?: string | null
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type?: string | null
          id?: string
          is_active?: boolean | null
          module?: string | null
          progress_history?: Json | null
          reminder_enabled?: boolean | null
          start_date?: string | null
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_injuries: {
        Row: {
          created_at: string | null
          id: string
          injury_type: string | null
          is_active: boolean | null
          notes: string | null
          occurred_on: string | null
          resolved_on: string | null
          severity: string | null
          side: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          injury_type?: string | null
          is_active?: boolean | null
          notes?: string | null
          occurred_on?: string | null
          resolved_on?: string | null
          severity?: string | null
          side?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          injury_type?: string | null
          is_active?: boolean | null
          notes?: string | null
          occurred_on?: string | null
          resolved_on?: string | null
          severity?: string | null
          side?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          pillar_type: string | null
          scheduled_for: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          pillar_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          pillar_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_pillar_data: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          pillar_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: string
          pillar_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          pillar_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          active_modules: string[] | null
          activity_level: string | null
          age: number | null
          available_time_per_day: number | null
          avatar_url: string | null
          coaching_style: string | null
          connected_devices: string[] | null
          country_code: string | null
          created_at: string | null
          device_brands: Json | null
          dietary_preference: string | null
          dietary_restrictions: string[] | null
          email_validated: boolean | null
          equipment_level: string | null
          first_name: string | null
          fitness_experience: string | null
          fitness_goal: string | null
          food_allergies: string[] | null
          food_dislikes: string[] | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          hydration_reminders: boolean | null
          id: string
          injuries: string[] | null
          language: string | null
          last_login: string | null
          lifestyle: string | null
          main_obstacles: string[] | null
          marketing_consent: boolean | null
          modules: string[] | null
          motivation: string | null
          notifications_enabled: boolean | null
          nutrition_objective: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          primary_goals: string[] | null
          privacy_consent: boolean | null
          profile_type: string | null
          role: string
          season_period: string | null
          sleep_difficulties: boolean | null
          sleep_hours_average: number | null
          sport: string | null
          sport_level: string | null
          sport_position: string | null
          strength_experience: string | null
          strength_objective: string | null
          subscription_status: string | null
          target_weight_kg: number | null
          timezone: string | null
          training_frequency: number | null
          updated_at: string | null
          username: string | null
          water_intake_goal: number | null
          weight_kg: number | null
        }
        Insert: {
          active_modules?: string[] | null
          activity_level?: string | null
          age?: number | null
          available_time_per_day?: number | null
          avatar_url?: string | null
          coaching_style?: string | null
          connected_devices?: string[] | null
          country_code?: string | null
          created_at?: string | null
          device_brands?: Json | null
          dietary_preference?: string | null
          dietary_restrictions?: string[] | null
          email_validated?: boolean | null
          equipment_level?: string | null
          first_name?: string | null
          fitness_experience?: string | null
          fitness_goal?: string | null
          food_allergies?: string[] | null
          food_dislikes?: string[] | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          hydration_reminders?: boolean | null
          id: string
          injuries?: string[] | null
          language?: string | null
          last_login?: string | null
          lifestyle?: string | null
          main_obstacles?: string[] | null
          marketing_consent?: boolean | null
          modules?: string[] | null
          motivation?: string | null
          notifications_enabled?: boolean | null
          nutrition_objective?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          primary_goals?: string[] | null
          privacy_consent?: boolean | null
          profile_type?: string | null
          role?: string
          season_period?: string | null
          sleep_difficulties?: boolean | null
          sleep_hours_average?: number | null
          sport?: string | null
          sport_level?: string | null
          sport_position?: string | null
          strength_experience?: string | null
          strength_objective?: string | null
          subscription_status?: string | null
          target_weight_kg?: number | null
          timezone?: string | null
          training_frequency?: number | null
          updated_at?: string | null
          username?: string | null
          water_intake_goal?: number | null
          weight_kg?: number | null
        }
        Update: {
          active_modules?: string[] | null
          activity_level?: string | null
          age?: number | null
          available_time_per_day?: number | null
          avatar_url?: string | null
          coaching_style?: string | null
          connected_devices?: string[] | null
          country_code?: string | null
          created_at?: string | null
          device_brands?: Json | null
          dietary_preference?: string | null
          dietary_restrictions?: string[] | null
          email_validated?: boolean | null
          equipment_level?: string | null
          first_name?: string | null
          fitness_experience?: string | null
          fitness_goal?: string | null
          food_allergies?: string[] | null
          food_dislikes?: string[] | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          hydration_reminders?: boolean | null
          id?: string
          injuries?: string[] | null
          language?: string | null
          last_login?: string | null
          lifestyle?: string | null
          main_obstacles?: string[] | null
          marketing_consent?: boolean | null
          modules?: string[] | null
          motivation?: string | null
          notifications_enabled?: boolean | null
          nutrition_objective?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          primary_goals?: string[] | null
          privacy_consent?: boolean | null
          profile_type?: string | null
          role?: string
          season_period?: string | null
          sleep_difficulties?: boolean | null
          sleep_hours_average?: number | null
          sport?: string | null
          sport_level?: string | null
          sport_position?: string | null
          strength_experience?: string | null
          strength_objective?: string | null
          subscription_status?: string | null
          target_weight_kg?: number | null
          timezone?: string | null
          training_frequency?: number | null
          updated_at?: string | null
          username?: string | null
          water_intake_goal?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_recovery_profiles: {
        Row: {
          age_factor: number | null
          created_at: string | null
          fitness_level_factor: number | null
          hydration_impact: number | null
          id: string
          injury_history: string[] | null
          nutrition_quality_impact: number | null
          recovery_rate_multiplier: number | null
          sleep_quality_impact: number | null
          stress_level_impact: number | null
          supplements: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age_factor?: number | null
          created_at?: string | null
          fitness_level_factor?: number | null
          hydration_impact?: number | null
          id?: string
          injury_history?: string[] | null
          nutrition_quality_impact?: number | null
          recovery_rate_multiplier?: number | null
          sleep_quality_impact?: number | null
          stress_level_impact?: number | null
          supplements?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age_factor?: number | null
          created_at?: string | null
          fitness_level_factor?: number | null
          hydration_impact?: number | null
          id?: string
          injury_history?: string[] | null
          nutrition_quality_impact?: number | null
          recovery_rate_multiplier?: number | null
          sleep_quality_impact?: number | null
          stress_level_impact?: number | null
          supplements?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          pillar_type: string
          stat_type: string
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          pillar_type: string
          stat_type: string
          updated_at?: string | null
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          pillar_type?: string
          stat_type?: string
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          exercises: Json | null
          id: string
          is_template: boolean | null
          muscle_objectives: string[] | null
          name: string
          notes: string | null
          plan_id: string | null
          started_at: string | null
          user_id: string | null
          workout_type: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          is_template?: boolean | null
          muscle_objectives?: string[] | null
          name: string
          notes?: string | null
          plan_id?: string | null
          started_at?: string | null
          user_id?: string | null
          workout_type?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json | null
          id?: string
          is_template?: boolean | null
          muscle_objectives?: string[] | null
          name?: string
          notes?: string | null
          plan_id?: string | null
          started_at?: string | null
          user_id?: string | null
          workout_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_stats: {
        Args: { user_uuid: string; target_date?: string }
        Returns: undefined
      }
      calculate_monthly_stats: {
        Args: { p_user_id: string; p_month: string }
        Returns: undefined
      }
      check_dietary_compatibility: {
        Args: {
          user_diet: string
          food_is_vegan: boolean
          food_is_vegetarian: boolean
        }
        Returns: boolean
      }
      cleanup_user_data_by_modules: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_demo_data: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_monthly_progress: {
        Args: { user_uuid: string; target_month?: number; target_year?: number }
        Returns: {
          week_number: number
          total_workouts: number
          avg_workout_duration: number
          total_calories_burned: number
          avg_daily_nutrition: number
          avg_hydration_goal_percentage: number
          avg_sleep_quality: number
        }[]
      }
      get_user_dashboard: {
        Args: { user_uuid: string }
        Returns: {
          full_name: string
          fitness_goal: string
          activity_level: string
          today_workouts: number
          today_workout_minutes: number
          today_calories_burned: number
          today_nutrition_calories: number
          today_hydration_ml: number
          today_hydration_percentage: number
          today_sleep_duration: number
          today_sleep_quality: number
          week_total_workouts: number
          week_avg_workout_minutes: number
          week_total_calories: number
          week_avg_sleep: number
          active_goals_count: number
          achieved_goals_count: number
        }[]
      }
      get_weekly_stats: {
        Args: { user_uuid: string; start_date?: string }
        Returns: {
          total_workouts: number
          total_workout_minutes: number
          total_calories_burned: number
          avg_daily_calories: number
          avg_daily_protein: number
          avg_daily_hydration: number
          avg_sleep_duration: number
          avg_sleep_quality: number
          days_with_data: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_workout_stats: {
        Args: {
          p_user_id: string
          p_date: string
          p_minutes: number
          p_calories: number
        }
        Returns: undefined
      }
      lock_ai_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      mark_onboarding_completed: {
        Args: Record<PropertyKey, never> | { user_uuid: string }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      user_has_module: {
        Args: { user_id: string; module_name: string }
        Returns: boolean
      }
      validate_sport_muscu_compatibility: {
        Args: { sport: string; category: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
