// ============================================================================
// HOOKS SUPABASE POUR WORKOUT AVEC MAPPING AUTOMATIQUE
// Compatible avec la base de données existante
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  WorkoutSession, 
  WorkoutSet, 
  DbWorkoutSession, 
  DbWorkoutSet,
  dbToWorkoutSession,
  dbToWorkoutSet,
  workoutSessionToDb,
  workoutSetToDb
} from '@/shared/types/database-mapping';

// ============================================================================
// HOOKS POUR WORKOUT SESSIONS
// ============================================================================

export function useWorkoutSession(sessionId?: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSession(dbToWorkoutSession(data as DbWorkoutSession));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la session');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSession = useCallback(async (updates: Partial<WorkoutSession>) => {
    if (!session) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dbUpdates = workoutSessionToDb({ ...session, ...updates });
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .update(dbUpdates)
        .eq('id', session.id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSession(dbToWorkoutSession(data as DbWorkoutSession));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createSession = useCallback(async (newSession: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionWithDefaults: WorkoutSession = {
        ...newSession,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'idle',
        // Valeurs par défaut IA
        autoProgressWeight: true,
        smartRestTimers: true,
        realTimeCoaching: true,
        sessionState: {},
        pendingChanges: [],
      };
      
      const dbSession = workoutSessionToDb(sessionWithDefaults);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(dbSession)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newSessionData = dbToWorkoutSession(data as DbWorkoutSession);
        setSession(newSessionData);
        return newSessionData;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  return {
    session,
    loading,
    error,
    updateSession,
    createSession,
    loadSession,
  };
}

// ============================================================================
// HOOKS POUR WORKOUT SETS
// ============================================================================

export function useWorkoutSets(sessionId?: string) {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSets = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('*')
        .eq('session_id', id)
        .order('set_number', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setSets(data.map(set => dbToWorkoutSet(set as DbWorkoutSet)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des sets');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSet = useCallback(async (newSet: Omit<WorkoutSet, 'id' | 'timestamp'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const setWithDefaults: WorkoutSet = {
        ...newSet,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        completed: false,
      };
      
      const dbSet = workoutSetToDb(setWithDefaults);
      
      const { data, error } = await supabase
        .from('workout_sets')
        .insert(dbSet)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newSetData = dbToWorkoutSet(data as DbWorkoutSet);
        setSets(prev => [...prev, newSetData]);
        return newSetData;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du set');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSet = useCallback(async (setId: string, updates: Partial<WorkoutSet>) => {
    setLoading(true);
    setError(null);
    
    try {
      const existingSet = sets.find(s => s.id === setId);
      if (!existingSet) throw new Error('Set introuvable');
      
      const updatedSet = { ...existingSet, ...updates };
      const dbUpdates = workoutSetToDb(updatedSet);
      
      const { data, error } = await supabase
        .from('workout_sets')
        .update(dbUpdates)
        .eq('id', setId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const updatedSetData = dbToWorkoutSet(data as DbWorkoutSet);
        setSets(prev => prev.map(s => s.id === setId ? updatedSetData : s));
        return updatedSetData;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du set');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sets]);

  const deleteSet = useCallback(async (setId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('workout_sets')
        .delete()
        .eq('id', setId);
      
      if (error) throw error;
      
      setSets(prev => prev.filter(s => s.id !== setId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du set');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSets(sessionId);
    }
  }, [sessionId, loadSets]);

  return {
    sets,
    loading,
    error,
    addSet,
    updateSet,
    deleteSet,
    loadSets,
  };
}

// ============================================================================
// HOOKS POUR LES STATISTIQUES AVANCÉES
// ============================================================================

export function useWorkoutAnalytics(userId: string, timeRange: 'week' | 'month' | 'year' = 'month') {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calcul des dates selon la plage
      const now = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Récupérer les sessions avec leurs sets
      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_sets (*)
        `)
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      if (sessionsError) throw sessionsError;

      if (sessions) {
        // Calculer les métriques avancées
        const totalSessions = sessions.length;
        const totalVolume = sessions.reduce((sum, session) => sum + (session.total_volume || 0), 0);
        const totalDuration = sessions.reduce((sum, session) => sum + (session.workout_duration_minutes || 0), 0);
        const averagePerformance = sessions.reduce((sum, session) => sum + (session.performance_score || 1), 0) / totalSessions;
        const averageFatigue = sessions.reduce((sum, session) => sum + (session.fatigue_level || 0), 0) / totalSessions;

        setAnalytics({
          totalSessions,
          totalVolume,
          totalDuration,
          averagePerformance,
          averageFatigue,
          sessions: sessions.map(s => dbToWorkoutSession(s as DbWorkoutSession)),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  }, [userId, timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: loadAnalytics,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  useWorkoutSession,
  useWorkoutSets,
  useWorkoutAnalytics,
};