import React, { useCallback } from 'react';
// hooks/workout/useExerciseHistory.ts
import { appStore } from '../../../store/appStore';
import { supabase } from '../../../lib/supabase';
import type { SessionExercise } from '../types/WorkoutTypes';

export interface UseExerciseHistoryReturn {
  getLastWeightForExercise: (exerciseName: string) => number | null;
  saveWeightHistory: (exerciseName: string, weight: number) => void;
  loadExercisesFromLastSession: (workoutName: string) => Promise<SessionExercise[]>;
}

export const useExerciseHistory = (): UseExerciseHistoryReturn => {
  const { appStoreUser } = appStore();

  const getLastWeightForExercise = useCallback(
    (exerciseName: string): number | null => {
      try {
        const weightHistory = JSON.parse(localStorage.getItem('exerciseWeightHistory') || '{}');
        const exerciseHistory = weightHistory[exerciseName];

        if (!exerciseHistory?.length) return null;

        const userHistory = exerciseHistory.filter(
          (entry: any) => entry.userId === appStoreUser?.id
        );
        return userHistory.length ? userHistory[userHistory.length - 1].weight : null;
      } catch (error) {
      // Erreur silencieuse
        console.error('Erreur lecture historique poids:', error);
        return null;
      }
    },
    [appStoreUser?.id]
  );

  const saveWeightHistory = useCallback(
    (exerciseName: string, weight: number) => {
      if (!appStoreUser?.id || weight <= 0) return;

      try {
        const history = JSON.parse(localStorage.getItem('exerciseWeightHistory') || '{}');
        if (!history[exerciseName]) history[exerciseName] = [];

        history[exerciseName].push({
          weight,
          date: new Date().toISOString(),
          userId: appStoreUser.id,
        });

        // Garder seulement les 50 dernières entrées par exercice
        if (history[exerciseName].length > 50) {
          history[exerciseName] = history[exerciseName].slice(-50);
        }

        localStorage.setItem('exerciseWeightHistory', JSON.stringify(history));
      } catch (error) {
      // Erreur silencieuse
        console.error('Erreur sauvegarde historique poids:', error);
      }
    },
    [appStoreUser?.id]
  );

  const loadExercisesFromLastSession = useCallback(
    async (workoutName: string): Promise<SessionExercise[]> => {
      if (!appStoreUser?.id) return [];

      try {
        const { data: _data, error: _error } = await supabase
          .from('workouts')
          .select('exercises')
          .eq('user_id', appStoreUser.id)
          .eq('name', workoutName)
          .not('completed_at', 'is', null) // Sessions terminées
          .order('completed_at', { ascending: false })
          .limit(1);

        if (_error || !_data?.length) {
          console.log('Aucune session précédente trouvée pour:', workoutName);
          return [];
        }

        // Réinitialiser les exercices pour une nouvelle session
        return (_data[0].exercises as SessionExercise[]).map((ex: SessionExercise) => ({
          ...ex,
          id: crypto.randomUUID(),
          completed: false,
          sets: ex.sets.map((set: any) => ({
            ...set,
            completed: false,
            timestamp: new Date().toISOString(),
          })),
        }));
      } catch (error) {
      // Erreur silencieuse
        console.error('Erreur chargement dernière session:', error);
        return [];
      }
    },
    [appStoreUser?.id]
  );

  return {
    getLastWeightForExercise,
    saveWeightHistory,
    loadExercisesFromLastSession,
  };
};
