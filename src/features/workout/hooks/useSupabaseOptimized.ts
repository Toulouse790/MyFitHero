// =============================================================================
// HOOKS OPTIMISÉS POUR UTILISER LES VRAIES DONNÉES SUPABASE
// Remplacer les données hardcodées dans WorkoutDetailPage et ExerciseDetailPage
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// =============================================================================
// 1. HOOKS POUR WORKOUT DETAIL PAGE
// =============================================================================

/**
 * Hook pour récupérer les détails d'une session de workout
 */
export function useWorkoutSessionDetail(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['workout-session-detail', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID required');
      
      const { data, error } = await supabase
        .from('workout_sessions_with_metrics') // Vue avec métriques
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
    staleTime: 30000, // 30 secondes
  });
}

/**
 * Hook pour récupérer les sets d'une session
 */
export function useWorkoutSets(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['workout-sets', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID required');
      
      const { data, error } = await supabase
        .from('workout_sets')
        .select(`
          *,
          exercise:exercises_library(name, category, muscle_groups, equipment)
        `)
        .eq('session_id', sessionId)
        .order('exercise_order', { ascending: true })
        .order('set_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });
}

/**
 * Hook pour mettre à jour une session de workout
 */
export function useUpdateWorkoutSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId, updates }: { 
      sessionId: string; 
      updates: Partial<any> 
    }) => {
      const { data, error } = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workout-session-detail', data.id] });
      queryClient.invalidateQueries({ queryKey: ['workout-sets', data.id] });
    },
  });
}

/**
 * Hook pour ajouter/mettre à jour un set
 */
export function useUpsertWorkoutSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setData: any) => {
      const { data, error } = await supabase
        .from('workout_sets')
        .upsert(setData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workout-sets', data.session_id] });
    },
  });
}

// =============================================================================
// 2. HOOKS POUR EXERCISE DETAIL PAGE
// =============================================================================

/**
 * Hook pour récupérer les détails d'un exercice avec historique
 */
export function useExerciseDetail(exerciseId: string | undefined) {
  return useQuery({
    queryKey: ['exercise-detail', exerciseId],
    queryFn: async () => {
      if (!exerciseId) throw new Error('Exercise ID required');
      
      const { data, error } = await supabase
        .from('exercise_details_with_history') // Vue avec historique
        .select('*')
        .eq('id', exerciseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook pour récupérer l'historique personnel d'un exercice
 */
export function useExercisePersonalHistory(
  exerciseId: string | undefined, 
  userId: string | undefined,
  limit: number = 10
) {
  return useQuery({
    queryKey: ['exercise-history', exerciseId, userId, limit],
    queryFn: async () => {
      if (!exerciseId || !userId) throw new Error('Exercise ID and User ID required');
      
      const { data, error } = await supabase
        .from('workout_sets')
        .select(`
          *,
          session:workout_sessions(name, completed_at)
        `)
        .eq('exercise_id', exerciseId)
        .eq('user_id', userId)
        .eq('is_completed', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId && !!userId,
  });
}

/**
 * Hook pour récupérer les records personnels d'un exercice
 */
export function useExercisePersonalRecords(
  exerciseId: string | undefined, 
  userId: string | undefined
) {
  return useQuery({
    queryKey: ['exercise-records', exerciseId, userId],
    queryFn: async () => {
      if (!exerciseId || !userId) throw new Error('Exercise ID and User ID required');
      
      const { data, error } = await supabase
        .rpc('get_exercise_personal_records', {
          p_user_id: userId,
          p_exercise_id: exerciseId
        });
      
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!exerciseId && !!userId,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Hook pour récupérer la progression d'un exercice
 */
export function useExerciseProgression(
  exerciseId: string | undefined, 
  userId: string | undefined,
  daysBack: number = 90
) {
  return useQuery({
    queryKey: ['exercise-progression', exerciseId, userId, daysBack],
    queryFn: async () => {
      if (!exerciseId || !userId) throw new Error('Exercise ID and User ID required');
      
      const { data, error } = await supabase
        .rpc('get_exercise_progression', {
          p_user_id: userId,
          p_exercise_id: exerciseId,
          p_days_back: daysBack
        });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!exerciseId && !!userId,
  });
}

/**
 * Hook pour récupérer les variantes d'un exercice
 */
export function useExerciseVariants(exerciseId: string | undefined) {
  return useQuery({
    queryKey: ['exercise-variants', exerciseId],
    queryFn: async () => {
      if (!exerciseId) throw new Error('Exercise ID required');
      
      // Récupérer l'exercice principal
      const { data: mainExercise, error: mainError } = await supabase
        .from('exercises_library')
        .select('category, muscle_groups, equipment')
        .eq('id', exerciseId)
        .single();
      
      if (mainError) throw mainError;
      
      // Trouver des exercices similaires
      const { data, error } = await supabase
        .from('exercises_library')
        .select('*')
        .eq('category', mainExercise.category)
        .neq('id', exerciseId)
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId,
    staleTime: 300000, // 5 minutes
  });
}

// =============================================================================
// 3. HOOKS POUR LES STATISTIQUES ET MÉTRIQUES
// =============================================================================

/**
 * Hook pour récupérer les métriques d'une session
 */
export function useSessionMetrics(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['session-metrics', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID required');
      
      const { data, error } = await supabase
        .from('session_metrics')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found"
      return data;
    },
    enabled: !!sessionId,
  });
}

/**
 * Hook pour récupérer les statistiques quotidiennes d'un utilisateur
 */
export function useDailyStats(userId: string | undefined, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['daily-stats', userId, targetDate],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('stat_date', targetDate)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found"
      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Hook pour récupérer les objectifs d'un utilisateur
 */
export function useUserGoals(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-goals', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// =============================================================================
// 4. HOOKS POUR LA RÉCUPÉRATION MUSCULAIRE
// =============================================================================

/**
 * Hook pour récupérer les données de récupération musculaire
 */
export function useMuscleRecoveryData(userId: string | undefined) {
  return useQuery({
    queryKey: ['muscle-recovery', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('muscle_recovery_data')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// =============================================================================
// 5. HOOKS UTILITAIRES
// =============================================================================

/**
 * Hook pour récupérer le profil complet d'un utilisateur avec stats
 */
export function useUserCompleteProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-complete-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('user_complete_stats') // Vue avec toutes les stats
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook pour rechercher des exercices
 */
export function useExerciseSearch(
  searchTerm: string,
  filters: {
    category?: string[];
    difficulty?: string[];
    equipment?: string[];
  } = {}
) {
  return useQuery({
    queryKey: ['exercise-search', searchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('exercises_library')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (filters.category?.length) {
        query = query.in('category', filters.category);
      }
      
      if (filters.difficulty?.length) {
        query = query.in('difficulty', filters.difficulty);
      }
      
      if (filters.equipment?.length) {
        query = query.in('equipment', filters.equipment);
      }
      
      const { data, error } = await query
        .order('name')
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2 || Object.keys(filters).length > 0,
    staleTime: 30000,
  });
}