/**
 * STATE MANAGEMENT OPTIMISÉ - Module Workout
 * Gestion d'état haute performance avec normalisation et memoization
 */

import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { WorkoutSession, Workout, WorkoutStats } from '@/features/workout/types/WorkoutTypes';
import type { MuscleRecoveryData, GlobalRecoveryMetrics } from '@/features/workout/types/muscleRecovery';

// === INTERFACES DU STORE ===

interface WorkoutState {
  // Sessions
  currentSession: WorkoutSession | null;
  isSessionActive: boolean;
  sessionHistory: WorkoutSession[];
  
  // Workouts
  workouts: Record<string, Workout>;
  workoutsList: string[];
  favoriteWorkouts: string[];
  
  // Récupération musculaire
  muscleRecovery: Record<string, MuscleRecoveryData>;
  globalRecoveryMetrics: GlobalRecoveryMetrics | null;
  
  // Stats et analytics
  workoutStats: WorkoutStats | null;
  weeklyProgress: any[];
  monthlyProgress: any[];
  
  // État UI
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  
  // Cache et optimisations
  cachedQueries: Record<string, { data: any; timestamp: number; ttl: number }>;
  prefetchedData: Record<string, any>;
}

interface WorkoutActions {
  // Session actions
  setCurrentSession: (session: WorkoutSession | null) => void;
  updateCurrentSession: (updates: Partial<WorkoutSession>) => void;
  setSessionActive: (isActive: boolean) => void;
  addToSessionHistory: (session: WorkoutSession) => void;
  
  // Workout actions
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  toggleFavoriteWorkout: (id: string) => void;
  
  // Recovery actions
  setMuscleRecovery: (recoveryData: MuscleRecoveryData[]) => void;
  updateMuscleRecovery: (muscleGroup: string, data: Partial<MuscleRecoveryData>) => void;
  setGlobalRecoveryMetrics: (metrics: GlobalRecoveryMetrics) => void;
  
  // Stats actions
  setWorkoutStats: (stats: WorkoutStats) => void;
  updateWeeklyProgress: (progress: any[]) => void;
  updateMonthlyProgress: (progress: any[]) => void;
  
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLastSync: (timestamp: string) => void;
  
  // Cache actions
  setCachedQuery: (key: string, data: any, ttl?: number) => void;
  getCachedQuery: (key: string) => any | null;
  clearCache: (pattern?: string) => void;
  setPrefetchedData: (key: string, data: any) => void;
  
  // Bulk actions pour optimisation
  batchUpdate: (updates: Partial<WorkoutState>) => void;
  reset: () => void;
}

// === ÉTAT INITIAL ===
const initialState: WorkoutState = {
  currentSession: null,
  isSessionActive: false,
  sessionHistory: [],
  
  workouts: {},
  workoutsList: [],
  favoriteWorkouts: [],
  
  muscleRecovery: {},
  globalRecoveryMetrics: null,
  
  workoutStats: null,
  weeklyProgress: [],
  monthlyProgress: [],
  
  isLoading: false,
  error: null,
  lastSync: null,
  
  cachedQueries: {},
  prefetchedData: {},
};

// === STORE PRINCIPAL ===
export const useWorkoutStore = create<WorkoutState & WorkoutActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // === SESSION ACTIONS ===
        setCurrentSession: (session) => {
          set((state) => {
            state.currentSession = session;
            state.isSessionActive = session?.status === 'active';
          });
        },

        updateCurrentSession: (updates) => {
          set((state) => {
            if (state.currentSession) {
              Object.assign(state.currentSession, updates);
            }
          });
        },

        setSessionActive: (isActive) => {
          set((state) => {
            state.isSessionActive = isActive;
            if (state.currentSession) {
              state.currentSession.status = isActive ? 'active' : 'paused';
            }
          });
        },

        addToSessionHistory: (session) => {
          set((state) => {
            state.sessionHistory.unshift(session);
            // Limiter l'historique à 50 sessions pour performance
            if (state.sessionHistory.length > 50) {
              state.sessionHistory.splice(50);
            }
          });
        },

        // === WORKOUT ACTIONS ===
        setWorkouts: (workouts) => {
          set((state) => {
            // Normalisation des données pour optimisation
            state.workouts = {};
            state.workoutsList = [];
            
            workouts.forEach(workout => {
              state.workouts[workout.id] = workout;
              state.workoutsList.push(workout.id);
            });
          });
        },

        addWorkout: (workout) => {
          set((state) => {
            state.workouts[workout.id] = workout;
            state.workoutsList.unshift(workout.id);
          });
        },

        updateWorkout: (id, updates) => {
          set((state) => {
            if (state.workouts[id]) {
              Object.assign(state.workouts[id], updates, {
                updated_at: new Date().toISOString()
              });
            }
          });
        },

        deleteWorkout: (id) => {
          set((state) => {
            delete state.workouts[id];
            state.workoutsList = state.workoutsList.filter(wId => wId !== id);
            state.favoriteWorkouts = state.favoriteWorkouts.filter(fId => fId !== id);
          });
        },

        toggleFavoriteWorkout: (id) => {
          set((state) => {
            const index = state.favoriteWorkouts.indexOf(id);
            if (index > -1) {
              state.favoriteWorkouts.splice(index, 1);
            } else {
              state.favoriteWorkouts.push(id);
            }
          });
        },

        // === RECOVERY ACTIONS ===
        setMuscleRecovery: (recoveryData) => {
          set((state) => {
            state.muscleRecovery = {};
            recoveryData.forEach(data => {
              state.muscleRecovery[data.muscle_group] = data;
            });
          });
        },

        updateMuscleRecovery: (muscleGroup, data) => {
          set((state) => {
            if (state.muscleRecovery[muscleGroup]) {
              Object.assign(state.muscleRecovery[muscleGroup], data, {
                last_updated: new Date().toISOString()
              });
            }
          });
        },

        setGlobalRecoveryMetrics: (metrics) => {
          set((state) => {
            state.globalRecoveryMetrics = metrics;
          });
        },

        // === STATS ACTIONS ===
        setWorkoutStats: (stats) => {
          set((state) => {
            state.workoutStats = stats;
          });
        },

        updateWeeklyProgress: (progress) => {
          set((state) => {
            state.weeklyProgress = progress;
          });
        },

        updateMonthlyProgress: (progress) => {
          set((state) => {
            state.monthlyProgress = progress;
          });
        },

        // === UI ACTIONS ===
        setLoading: (isLoading) => {
          set((state) => {
            state.isLoading = isLoading;
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        setLastSync: (timestamp) => {
          set((state) => {
            state.lastSync = timestamp;
          });
        },

        // === CACHE ACTIONS ===
        setCachedQuery: (key, data, ttl = 5 * 60 * 1000) => {
          set((state) => {
            state.cachedQueries[key] = {
              data,
              timestamp: Date.now(),
              ttl,
            };
          });
        },

        getCachedQuery: (key) => {
          const cached = get().cachedQueries[key];
          if (!cached) return null;
          
          const isExpired = Date.now() - cached.timestamp > cached.ttl;
          if (isExpired) {
            set((state) => {
              delete state.cachedQueries[key];
            });
            return null;
          }
          
          return cached.data;
        },

        clearCache: (pattern) => {
          set((state) => {
            if (pattern) {
              Object.keys(state.cachedQueries).forEach(key => {
                if (key.includes(pattern)) {
                  delete state.cachedQueries[key];
                }
              });
            } else {
              state.cachedQueries = {};
            }
          });
        },

        setPrefetchedData: (key, data) => {
          set((state) => {
            state.prefetchedData[key] = data;
          });
        },

        // === BULK ACTIONS ===
        batchUpdate: (updates) => {
          set((state) => {
            Object.assign(state, updates);
          });
        },

        reset: () => {
          set(initialState);
        },
      }))
    ),
    {
      name: 'workout-store',
      // Ne pas persister les données sensibles en développement
      partialize: (state) => ({
        favoriteWorkouts: state.favoriteWorkouts,
        workoutStats: state.workoutStats,
        lastSync: state.lastSync,
      }),
    }
  )
);

// === SÉLECTEURS OPTIMISÉS ===

// Sélecteurs memoizés pour éviter les re-renders inutiles
export const useCurrentSession = () => useWorkoutStore(state => state.currentSession);
export const useIsSessionActive = () => useWorkoutStore(state => state.isSessionActive);
export const useWorkoutsList = () => useWorkoutStore(state => 
  state.workoutsList.map(id => state.workouts[id]).filter(Boolean)
);
export const useFavoriteWorkouts = () => useWorkoutStore(state => 
  state.favoriteWorkouts.map(id => state.workouts[id]).filter(Boolean)
);
export const useMuscleRecoveryArray = () => useWorkoutStore(state => 
  Object.values(state.muscleRecovery)
);
export const useWorkoutStats = () => useWorkoutStore(state => state.workoutStats);
export const useWorkoutError = () => useWorkoutStore(state => state.error);
export const useWorkoutLoading = () => useWorkoutStore(state => state.isLoading);

// Sélecteur pour workout spécifique
export const useWorkout = (id: string) => useWorkoutStore(state => state.workouts[id]);

// Sélecteur pour récupération d'un muscle spécifique
export const useMuscleRecovery = (muscleGroup: string) => 
  useWorkoutStore(state => state.muscleRecovery[muscleGroup]);

// === HOOKS D'OPTIMISATION ===

// Hook pour optimiser les mises à jour de session
export const useOptimizedSessionUpdates = () => {
  const updateCurrentSession = useWorkoutStore(state => state.updateCurrentSession);
  
  const updateSessionThrottled = useCallback(
    throttle(updateCurrentSession, 1000), // Throttle les mises à jour à 1/seconde
    [updateCurrentSession]
  );
  
  return updateSessionThrottled;
};

// Hook pour les actions batch
export const useBatchWorkoutActions = () => {
  const batchUpdate = useWorkoutStore(state => state.batchUpdate);
  
  const performBatchUpdate = useCallback((updates: Partial<WorkoutState>) => {
    batchUpdate(updates);
  }, [batchUpdate]);
  
  return performBatchUpdate;
};

// === MIDDLEWARE DE PERSISTANCE OPTIMISÉE ===

// Sauvegarde locale optimisée
export const useWorkoutPersistence = () => {
  const store = useWorkoutStore();
  
  useEffect(() => {
    const unsubscribe = useWorkoutStore.subscribe(
      (state) => ({
        currentSession: state.currentSession,
        sessionHistory: state.sessionHistory.slice(0, 10), // Seulement les 10 dernières
        favoriteWorkouts: state.favoriteWorkouts,
      }),
      (persistableState) => {
        try {
          localStorage.setItem('workout-store-minimal', JSON.stringify(persistableState));
        } catch (error) {
          console.warn('Failed to persist workout store:', error);
        }
      }
    );
    
    return unsubscribe;
  }, []);
  
  // Fonction de restauration
  const restore = useCallback(() => {
    try {
      const stored = localStorage.getItem('workout-store-minimal');
      if (stored) {
        const parsed = JSON.parse(stored);
        store.batchUpdate(parsed);
      }
    } catch (error) {
      console.warn('Failed to restore workout store:', error);
    }
  }, [store]);
  
  return { restore };
};

// Fonction utilitaire throttle simple
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  
  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(null, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(null, args);
      }, remaining);
    }
  };
}

export default useWorkoutStore;