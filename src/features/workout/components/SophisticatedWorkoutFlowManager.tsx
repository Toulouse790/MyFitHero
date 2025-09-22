import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  RotateCcw, 
  Settings, 
  Brain,
  Zap,
  Activity,
  Timer,
  Target,
  TrendingUp,
  Wifi,
  WifiOff,
  Save,
  AlertTriangle
} from 'lucide-react';

// Import des types et hooks compatibles avec la base existante
import { 
  WorkoutSet, 
  WorkoutSession, 
  Exercise 
} from '@/shared/types/database-mapping';
import { useWorkoutSession, useWorkoutSets } from '@/features/workout/hooks/useSupabaseWorkout';
import { supabase } from '@/lib/supabase';
import { AdvancedSessionTimer } from './AdvancedSessionTimer';
import { SmartRestTimer } from './SmartRestTimer';
import VolumeAnalyticsEngine from './VolumeAnalyticsEngine';

// Types pour la machine d'état sophistiquée
type WorkoutState = 
  | 'idle'
  | 'warming-up' 
  | 'working'
  | 'resting'
  | 'transitioning'
  | 'paused'
  | 'completed'
  | 'emergency-stop';

type WorkoutEvent = 
  | { type: 'START_WARMUP' }
  | { type: 'BEGIN_EXERCISE'; exerciseId: string }
  | { type: 'COMPLETE_SET'; setData: WorkoutSet }
  | { type: 'START_REST'; duration?: number }
  | { type: 'SKIP_REST' }
  | { type: 'PAUSE_WORKOUT' }
  | { type: 'RESUME_WORKOUT' }
  | { type: 'COMPLETE_WORKOUT' }
  | { type: 'EMERGENCY_STOP'; reason: string }
  | { type: 'SYNC_STATE'; remoteState: Partial<WorkoutFlowState> };

// Interface WorkoutPlan temporaire (sera remplacée par celle de la base)
interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
}

interface WorkoutFlowState {
  // État principal
  currentState: WorkoutState;
  currentExerciseIndex: number;
  currentSetIndex: number;
  
  // Données de session
  workoutPlan: WorkoutPlan | null;
  completedSets: WorkoutSet[];
  sessionMetrics: {
    totalVolume: number;
    averageRPE: number;
    totalSets: number;
    workoutDuration: number;
    caloriesBurned: number;
  };
  
  // Synchronisation
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: WorkoutSet[];
  syncStatus: 'synced' | 'pending' | 'error';
  
  // Adaptation intelligente
  adaptiveFactors: {
    fatigueLevel: number; // 0-1
    performanceScore: number; // 0-1
    heartRateZone: number; // 1-5
    timeConstraint?: number; // minutes restantes
  };
  
  // Préférences utilisateur
  preferences: {
    autoProgressWeight: boolean;
    smartRestTimers: boolean;
    realTimeCoaching: boolean;
    offlineMode: boolean;
  };
}

interface SyncQueueItem {
  id: string;
  type: 'set' | 'session' | 'metrics';
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface WorkoutFlowManagerProps {
  userId: string;
  workoutPlan?: WorkoutPlan;
  onWorkoutComplete?: (summary: any) => void;
  onEmergencyStop?: (reason: string) => void;
  className?: string;
}

// Réducteur pour la machine d'état sophistiquée
const workoutReducer = (state: WorkoutFlowState, event: WorkoutEvent): WorkoutFlowState => {
  switch (event.type) {
    case 'START_WARMUP':
      if (state.currentState === 'idle') {
        return {
          ...state,
          currentState: 'warming-up'
        };
      }
      return state;

    case 'BEGIN_EXERCISE':
      if (state.currentState === 'warming-up' || state.currentState === 'transitioning') {
        return {
          ...state,
          currentState: 'working'
        };
      }
      return state;

    case 'COMPLETE_SET': {
      const newSet = event.setData;
      const updatedSets = [...state.completedSets, newSet];
      
      // Calcul des métriques en temps réel
      const totalVolume = updatedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const totalSets = updatedSets.length;
      const averageRPE = updatedSets.reduce((sum, set) => sum + (set.rpe || 7), 0) / totalSets;
      
      return {
        ...state,
        completedSets: updatedSets,
        currentSetIndex: state.currentSetIndex + 1,
        sessionMetrics: {
          ...state.sessionMetrics,
          totalVolume,
          totalSets,
          averageRPE
        },
        pendingChanges: [...state.pendingChanges, newSet]
      };
    }

    case 'START_REST':
      if (state.currentState === 'working') {
        return {
          ...state,
          currentState: 'resting'
        };
      }
      return state;

    case 'SKIP_REST':
      if (state.currentState === 'resting') {
        return {
          ...state,
          currentState: 'working'
        };
      }
      return state;

    case 'PAUSE_WORKOUT':
      if (['working', 'resting', 'warming-up'].includes(state.currentState)) {
        return {
          ...state,
          currentState: 'paused'
        };
      }
      return state;

    case 'RESUME_WORKOUT':
      if (state.currentState === 'paused') {
        return {
          ...state,
          currentState: 'working' // Retourne à l'état de travail
        };
      }
      return state;

    case 'COMPLETE_WORKOUT':
      return {
        ...state,
        currentState: 'completed'
      };

    case 'EMERGENCY_STOP':
      return {
        ...state,
        currentState: 'emergency-stop'
      };

    case 'SYNC_STATE':
      return {
        ...state,
        ...event.remoteState,
        lastSync: new Date(),
        syncStatus: 'synced'
      };

    default:
      return state;
  }
};

export const SophisticatedWorkoutFlowManager: React.FC<WorkoutFlowManagerProps> = ({
  userId,
  workoutPlan,
  onWorkoutComplete,
  onEmergencyStop,
  className = ''
}) => {
  // Generate unique session ID
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`).current;
  
  // État principal avec réducteur
  const [state, dispatch] = useReducer(workoutReducer, {
    currentState: 'idle',
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    workoutPlan: workoutPlan || null,
    completedSets: [],
    sessionMetrics: {
      totalVolume: 0,
      averageRPE: 0,
      totalSets: 0,
      workoutDuration: 0,
      caloriesBurned: 0
    },
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: [],
    syncStatus: 'synced',
    adaptiveFactors: {
      fatigueLevel: 0,
      performanceScore: 1,
      heartRateZone: 2
    },
    preferences: {
      autoProgressWeight: true,
      smartRestTimers: true,
      realTimeCoaching: true,
      offlineMode: false
    }
  });

  // Refs pour la persistance
  const syncQueueRef = useRef<SyncQueueItem[]>([]);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // État de connexion en temps réel
  useEffect(() => {
    const handleOnlineStatus = () => {
      dispatch({ type: 'SYNC_STATE', remoteState: { isOnline: navigator.onLine } });
      
      if (navigator.onLine && syncQueueRef.current.length > 0) {
        processSyncQueue();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Auto-sauvegarde locale toutes les 30 secondes
  useEffect(() => {
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }

    autoSaveRef.current = setInterval(() => {
      saveLocalState();
    }, 30000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [state]);

  // Sauvegarde locale pour mode hors ligne
  const saveLocalState = useCallback(() => {
    try {
      const stateToSave = {
        ...state,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`workout_session_${userId}`, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Erreur sauvegarde locale:', error);
    }
  }, [state, userId]);

  // Chargement de l'état local au démarrage
  useEffect(() => {
    const loadLocalState = () => {
      try {
        const savedState = localStorage.getItem(`workout_session_${userId}`);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Vérifier si la session est récente (< 24h)
          const sessionTime = new Date(parsedState.timestamp);
          const now = new Date();
          const hoursElapsed = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursElapsed < 24) {
            dispatch({ type: 'SYNC_STATE', remoteState: parsedState });
          }
        }
      } catch (error) {
        console.error('Erreur chargement état local:', error);
      }
    };

    loadLocalState();
  }, [userId]);

  // Gestion de la queue de synchronisation
  const processSyncQueue = useCallback(async () => {
    const queue = [...syncQueueRef.current];
    
    for (const item of queue) {
      try {
        switch (item.type) {
          case 'set':
            await supabase
              .from('workout_sets')
              .upsert(item.data);
            break;
            
          case 'session':
            await supabase
              .from('workout_sessions')
              .upsert(item.data);
            break;
            
          case 'metrics':
            await supabase
              .from('session_metrics')
              .upsert(item.data);
            break;
        }
        
        // Retirer de la queue après succès
        syncQueueRef.current = syncQueueRef.current.filter(qItem => qItem.id !== item.id);
        
      } catch (error) {
        console.error(`Erreur sync ${item.type}:`, error);
        
        // Incrémenter le compteur de retry
        item.retryCount++;
        
        // Abandonner après 3 tentatives
        if (item.retryCount >= 3) {
          syncQueueRef.current = syncQueueRef.current.filter(qItem => qItem.id !== item.id);
        }
      }
    }
    
    // Mettre à jour le statut de sync
    const newSyncStatus = syncQueueRef.current.length > 0 ? 'pending' : 'synced';
    dispatch({ type: 'SYNC_STATE', remoteState: { syncStatus: newSyncStatus } });
  }, []);

  // Synchronisation en temps réel avec Supabase
  useEffect(() => {
    if (!state.isOnline || state.pendingChanges.length === 0) return;

    const syncPendingChanges = async () => {
      for (const set of state.pendingChanges) {
        const syncItem: SyncQueueItem = {
          id: `set_${set.id}`,
          type: 'set',
          data: {
            id: set.id,
            exercise_id: set.exerciseId,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
            tempo: set.tempo,
            notes: set.notes,
            completed_at: set.timestamp.toISOString(),
            user_id: userId
          },
          timestamp: new Date(),
          retryCount: 0
        };
        
        syncQueueRef.current.push(syncItem);
      }
      
      await processSyncQueue();
    };

    syncPendingChanges();
  }, [state.pendingChanges, state.isOnline, userId, processSyncQueue]);

  // Gestion des événements de workout
  const handleStartWorkout = useCallback(() => {
    dispatch({ type: 'START_WARMUP' });
  }, []);

  const handleCompleteSet = useCallback((setData: Partial<WorkoutSet>) => {
    const newSet: WorkoutSet = {
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: sessionId,
      exerciseId: state.workoutPlan?.exercises[state.currentExerciseIndex]?.id || '',
      setNumber: state.currentSetIndex + 1,
      weight: setData.weight || 0,
      reps: setData.reps || 0,
      rpe: setData.rpe || 0,
      tempo: setData.tempo || '',
      notes: setData.notes || '',
      timestamp: new Date(),
      completed: true,
      ...setData
    };

    dispatch({ type: 'COMPLETE_SET', setData: newSet });
    
    // Démarrer automatiquement le repos si configuré
    if (state.preferences.smartRestTimers) {
      const currentExercise = state.workoutPlan?.exercises[state.currentExerciseIndex];
      if (currentExercise) {
        dispatch({ type: 'START_REST', duration: currentExercise.restTime });
      }
    }
  }, [state.currentExerciseIndex, state.workoutPlan, state.preferences.smartRestTimers]);

  const handlePauseWorkout = useCallback(() => {
    dispatch({ type: 'PAUSE_WORKOUT' });
  }, []);

  const handleResumeWorkout = useCallback(() => {
    dispatch({ type: 'RESUME_WORKOUT' });
  }, []);

  const handleEmergencyStop = useCallback((reason: string) => {
    dispatch({ type: 'EMERGENCY_STOP', reason });
    onEmergencyStop?.(reason);
  }, [onEmergencyStop]);

  // Recommandations intelligentes basées sur l'état
  const getSmartRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    
    if (state.adaptiveFactors.fatigueLevel > 0.8) {
      recommendations.push('Niveau de fatigue élevé - Réduire l\'intensité');
    }
    
    if (state.sessionMetrics.averageRPE > 8.5) {
      recommendations.push('RPE très élevé - Envisager une pause plus longue');
    }
    
    if (state.completedSets.length > 0) {
      const lastSet = state.completedSets[state.completedSets.length - 1];
      if (lastSet.rpe && lastSet.rpe < 6) {
        recommendations.push('Dernière série facile - Augmenter le poids');
      }
    }
    
    if (!state.isOnline && state.pendingChanges.length > 0) {
      recommendations.push('Mode hors ligne - Données seront synchronisées');
    }
    
    return recommendations;
  }, [state]);

  // Rendu du composant principal
  const currentExercise = state.workoutPlan?.exercises[state.currentExerciseIndex];
  const recommendations = getSmartRecommendations();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec statut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Workout Flow Manager
              <Badge variant={state.currentState === 'working' ? 'default' : 'outline'}>
                {state.currentState}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {state.isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              
              <Badge variant={state.syncStatus === 'synced' ? 'outline' : 'destructive'}>
                {state.syncStatus}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {state.sessionMetrics.totalSets}
              </div>
              <div className="text-sm text-gray-500">Séries</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(state.sessionMetrics.totalVolume)}kg
              </div>
              <div className="text-sm text-gray-500">Volume</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {state.sessionMetrics.averageRPE.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">RPE Moyen</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(state.sessionMetrics.workoutDuration / 60)}min
              </div>
              <div className="text-sm text-gray-500">Durée</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles principaux */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-3 mb-4">
            {state.currentState === 'idle' && (
              <Button onClick={handleStartWorkout} size="lg" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Démarrer l'Entraînement
              </Button>
            )}
            
            {['working', 'resting', 'warming-up'].includes(state.currentState) && (
              <>
                <Button onClick={handlePauseWorkout} variant="outline" size="lg">
                  <Pause className="w-4 h-4" />
                </Button>
                
                <Button 
                  onClick={() => handleEmergencyStop('Arrêt manuel')} 
                  variant="destructive" 
                  size="lg"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {state.currentState === 'paused' && (
              <Button onClick={handleResumeWorkout} size="lg" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Reprendre
              </Button>
            )}
          </div>

          {/* Recommandations intelligentes */}
          {recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Recommandations IA
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timers intégrés */}
      {state.currentState === 'working' && (
        <AdvancedSessionTimer
          userId={userId}
          workoutId={sessionId}
          onSessionEnd={(metrics) => console.log('Session metrics:', metrics)}
        />
      )}

      {state.currentState === 'resting' && currentExercise && (
        <SmartRestTimer
          userId={userId}
          exerciseContext={{
            type: currentExercise.type,
            muscleGroups: currentExercise.muscleGroups || [],
            intensity: 5, // Default intensity
            setNumber: state.currentSetIndex + 1,
            totalSets: currentExercise.targetSets || 3,
            weight: state.completedSets[state.completedSets.length - 1]?.weight,
            reps: state.completedSets[state.completedSets.length - 1]?.reps
          }}
          onRestComplete={() => dispatch({ type: 'SKIP_REST' })}
        />
      )}

      {/* Analytics en temps réel */}
      {state.completedSets.length > 0 && (
        <VolumeAnalyticsEngine
          userId={userId}
          timeRange="1w"
          workoutData={state.completedSets.map(set => ({
            ...set,
            exercise: currentExercise?.name || 'Unknown',
            exerciseType: currentExercise?.type || 'strength',
            muscleGroups: currentExercise?.muscleGroups || []
          }))}
        />
      )}

      {/* Statut de synchronisation détaillé */}
      {!state.isOnline && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <WifiOff className="w-4 h-4" />
              <span className="font-medium">Mode Hors Ligne</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {state.pendingChanges.length} modification(s) en attente de synchronisation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SophisticatedWorkoutFlowManager;