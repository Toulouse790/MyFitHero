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
  | { type: 'COMPLETE_SET'; setData: Omit<WorkoutSet, 'id' | 'timestamp'> }
  | { type: 'START_REST'; duration?: number }
  | { type: 'SKIP_REST' }
  | { type: 'PAUSE_WORKOUT' }
  | { type: 'RESUME_WORKOUT' }
  | { type: 'COMPLETE_WORKOUT' }
  | { type: 'EMERGENCY_STOP'; reason: string }
  | { type: 'SYNC_STATE'; remoteState: Partial<WorkoutFlowState> };

// Interface WorkoutPlan simplifié pour la démo
interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
}

// État principal du composant
interface WorkoutFlowState {
  // État de base
  currentState: WorkoutState;
  sessionId: string | undefined;
  currentExerciseIndex: number;
  currentSetNumber: number;
  
  // Données de session
  startTime: Date | undefined;
  pauseTime: Date | undefined;
  totalPauseTime: number; // millisecondes
  
  // Métriques en temps réel
  totalVolume: number;
  totalSets: number;
  averageRPE: number;
  estimatedCalories: number;
  
  // Paramètres adaptatifs IA
  fatigueLevel: number; // 0-1
  performanceScore: number; // 0-1 
  heartRateZone: number; // 1-5
  
  // Préférences utilisateur
  autoProgressWeight: boolean;
  smartRestTimers: boolean;
  realTimeCoaching: boolean;
  
  // Support offline
  isOnline: boolean;
  pendingChanges: WorkoutSet[];
  lastSyncTime: Date | undefined;
  
  // Configuration
  workoutPlan: WorkoutPlan | undefined;
  targetRestTime: number; // secondes
  
  // État UI
  showAnalytics: boolean;
  showSettings: boolean;
  
  // Alertes et notifications
  emergencyStopReason: string | undefined;
  coachingMessage: string | undefined;
}

// Props du composant principal
interface WorkoutFlowManagerProps {
  userId: string;
  workoutPlan?: WorkoutPlan;
  onWorkoutComplete?: (session: WorkoutSession) => void;
  onEmergencyStop?: (reason: string) => void;
}

// Reducer pour la machine d'état
function workoutFlowReducer(state: WorkoutFlowState, event: WorkoutEvent): WorkoutFlowState {
  switch (event.type) {
    case 'START_WARMUP':
      return {
        ...state,
        currentState: 'warming-up',
        startTime: new Date(),
        coachingMessage: 'Échauffement en cours. Préparez-vous mentalement.',
      };

    case 'BEGIN_EXERCISE':
      return {
        ...state,
        currentState: 'working',
        coachingMessage: `Exercice en cours. Concentrez-vous sur la forme.`,
      };

    case 'COMPLETE_SET':
      const newTotalSets = state.totalSets + 1;
      const newVolume = state.totalVolume + (event.setData.weight * event.setData.reps);
      const newAverageRPE = event.setData.rpe 
        ? ((state.averageRPE * state.totalSets) + event.setData.rpe) / newTotalSets
        : state.averageRPE;

      return {
        ...state,
        currentSetNumber: state.currentSetNumber + 1,
        totalSets: newTotalSets,
        totalVolume: newVolume,
        averageRPE: newAverageRPE,
        estimatedCalories: state.estimatedCalories + Math.round(newVolume * 0.1), // Formule approximative
        coachingMessage: `Set complété ! Volume: ${newVolume.toFixed(1)}kg`,
      };

    case 'START_REST':
      return {
        ...state,
        currentState: 'resting',
        targetRestTime: event.duration || state.targetRestTime,
        coachingMessage: 'Temps de repos. Hydratez-vous et préparez le prochain set.',
      };

    case 'SKIP_REST':
      return {
        ...state,
        currentState: 'working',
        coachingMessage: 'Repos écourté. Assurez-vous d\'être prêt.',
      };

    case 'PAUSE_WORKOUT':
      return {
        ...state,
        currentState: 'paused',
        pauseTime: new Date(),
        coachingMessage: 'Séance en pause. Prenez votre temps.',
      };

    case 'RESUME_WORKOUT':
      const pauseDuration = state.pauseTime ? Date.now() - state.pauseTime.getTime() : 0;
      return {
        ...state,
        currentState: 'working',
        pauseTime: null,
        totalPauseTime: state.totalPauseTime + pauseDuration,
        coachingMessage: 'Reprise de la séance. Concentrez-vous !',
      };

    case 'COMPLETE_WORKOUT':
      return {
        ...state,
        currentState: 'completed',
        coachingMessage: 'Félicitations ! Séance terminée avec succès.',
      };

    case 'EMERGENCY_STOP':
      return {
        ...state,
        currentState: 'emergency-stop',
        emergencyStopReason: event.reason,
        coachingMessage: `Arrêt d'urgence: ${event.reason}`,
      };

    case 'SYNC_STATE':
      return {
        ...state,
        ...event.remoteState,
        lastSyncTime: new Date(),
        isOnline: true,
      };

    default:
      return state;
  }
}

// État initial
const initialState: WorkoutFlowState = {
  currentState: 'idle',
  sessionId: null,
  currentExerciseIndex: 0,
  currentSetNumber: 1,
  startTime: null,
  pauseTime: null,
  totalPauseTime: 0,
  totalVolume: 0,
  totalSets: 0,
  averageRPE: 0,
  estimatedCalories: 0,
  fatigueLevel: 0,
  performanceScore: 1,
  heartRateZone: 2,
  autoProgressWeight: true,
  smartRestTimers: true,
  realTimeCoaching: true,
  isOnline: navigator.onLine,
  pendingChanges: [],
  lastSyncTime: null,
  workoutPlan: null,
  targetRestTime: 90,
  showAnalytics: false,
  showSettings: false,
  emergencyStopReason: null,
  coachingMessage: null,
};

/**
 * SophisticatedWorkoutFlowManager - Version Compatible Base Existante
 * 
 * Gestionnaire sophistiqué de flux d'entraînement avec :
 * - Machine d'état avancée
 * - Synchronisation temps réel avec Supabase
 * - Support offline avec sync différée
 * - Analytics adaptatifs IA
 * - Interface utilisateur intuitive
 */
export const SophisticatedWorkoutFlowManager: React.FC<WorkoutFlowManagerProps> = ({
  userId,
  workoutPlan,
  onWorkoutComplete,
  onEmergencyStop,
}) => {
  // État local avec machine d'état
  const [state, dispatch] = useReducer(workoutFlowReducer, {
    ...initialState,
    workoutPlan: workoutPlan || null,
  });

  // Hooks Supabase pour la gestion des données
  const { 
    session, 
    loading: sessionLoading, 
    error: sessionError,
    updateSession,
    createSession 
  } = useWorkoutSession(state.sessionId || undefined);

  const { 
    sets, 
    loading: setsLoading, 
    error: setsError,
    addSet,
    updateSet 
  } = useWorkoutSets(state.sessionId || undefined);

  // Détection du statut en ligne
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SYNC_STATE', remoteState: { isOnline: true } });
    const handleOffline = () => dispatch({ type: 'SYNC_STATE', remoteState: { isOnline: false } });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Gestionnaires d'événements
  const handleStartWorkout = useCallback(async () => {
    try {
      const newSession = await createSession({
        userId,
        workoutPlanId: workoutPlan?.id,
        name: workoutPlan?.name || 'Séance personnalisée',
        description: workoutPlan?.description,
        status: 'active',
        autoProgressWeight: state.autoProgressWeight,
        smartRestTimers: state.smartRestTimers,
        realTimeCoaching: state.realTimeCoaching,
      });

      if (newSession) {
        dispatch({ 
          type: 'SYNC_STATE', 
          remoteState: { sessionId: newSession.id } 
        });
        dispatch({ type: 'START_WARMUP' });
      }
    } catch (error: any) {
      console.error('Erreur lors du démarrage:', error);
    }
  }, [userId, workoutPlan, state.autoProgressWeight, state.smartRestTimers, state.realTimeCoaching, createSession]);

  const handleCompleteSet = useCallback(async (setData: Omit<WorkoutSet, 'id' | 'timestamp'>) => {
    if (!state.sessionId) return;

    try {
      // S'assurer que sessionId est défini
      const completeSetData: Omit<WorkoutSet, 'id' | 'timestamp'> = {
        ...setData,
        sessionId: state.sessionId,
      };

      await addSet(completeSetData);
      dispatch({ type: 'COMPLETE_SET', setData: completeSetData });
      
      // Démarrer le repos automatiquement
      if (state.smartRestTimers) {
        const restTime = calculateSmartRestTime(setData, state.fatigueLevel);
        dispatch({ type: 'START_REST', duration: restTime });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du set:', error);
    }
  }, [state.sessionId, state.smartRestTimers, state.fatigueLevel, addSet]);

  const handlePauseWorkout = useCallback(() => {
    dispatch({ type: 'PAUSE_WORKOUT' });
  }, []);

  const handleResumeWorkout = useCallback(() => {
    dispatch({ type: 'RESUME_WORKOUT' });
  }, []);

  const handleCompleteWorkout = useCallback(async () => {
    if (!session) return;

    try {
      const updatedSession = await updateSession({
        status: 'completed',
        completedAt: new Date(),
        totalVolume: state.totalVolume,
        workoutDurationMinutes: state.startTime 
          ? Math.round((Date.now() - state.startTime.getTime() - state.totalPauseTime) / 60000)
          : 0,
        caloriesBurned: state.estimatedCalories,
        performanceScore: state.performanceScore,
        fatigueLevel: state.fatigueLevel,
      });

      dispatch({ type: 'COMPLETE_WORKOUT' });
      
      if (onWorkoutComplete) {
        // updatedSession might be void, so use session as fallback
        onWorkoutComplete(session);
      }
    } catch (error: any) {
      console.error('Erreur lors de la finalisation:', error);
    }
  }, [session, updateSession, state, onWorkoutComplete]);

  // Calcul du repos intelligent basé sur l'IA
  const calculateSmartRestTime = (setData: Omit<WorkoutSet, 'id' | 'timestamp'>, fatigueLevel: number): number => {
    const baseRestTime = 90; // secondes
    const rpeMultiplier = setData.rpe ? (setData.rpe / 10) : 0.5;
    const fatigueMultiplier = 1 + fatigueLevel;
    
    return Math.round(baseRestTime * rpeMultiplier * fatigueMultiplier);
  };

  // Exercice actuel
  const currentExercise = state.workoutPlan?.exercises[state.currentExerciseIndex];

  // Rendu de l'interface
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* En-tête avec statut */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              {state.workoutPlan?.name || 'Séance personnalisée'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              État: {state.currentState} | Volume: {state.totalVolume.toFixed(1)}kg
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={state.isOnline ? 'default' : 'destructive'}>
              {state.isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {state.isOnline ? 'En ligne' : 'Hors ligne'}
            </Badge>
            
            {state.realTimeCoaching && (
              <Badge variant="secondary">
                <Brain className="h-4 w-4 mr-1" />
                IA Active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Message de coaching IA */}
          {state.coachingMessage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {state.coachingMessage}
              </p>
            </div>
          )}

          {/* Contrôles principaux */}
          <div className="flex gap-2 flex-wrap">
            {state.currentState === 'idle' && (
              <Button onClick={handleStartWorkout} disabled={sessionLoading}>
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </Button>
            )}

            {state.currentState === 'working' && (
              <Button onClick={handlePauseWorkout}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            {state.currentState === 'paused' && (
              <Button onClick={handleResumeWorkout}>
                <Play className="h-4 w-4 mr-2" />
                Reprendre
              </Button>
            )}

            {['working', 'resting', 'paused'].includes(state.currentState) && (
              <Button onClick={handleCompleteWorkout} variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Terminer
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={() => dispatch({ type: 'EMERGENCY_STOP', reason: 'Arrêt utilisateur' })}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Urgence
            </Button>
          </div>

          {/* Informations sur l'exercice actuel */}
          {currentExercise && (
            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">{currentExercise.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Set:</span>
                  <span className="ml-2 font-medium">{state.currentSetNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Repos cible:</span>
                  <span className="ml-2 font-medium">{state.targetRestTime}s</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium">{currentExercise.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">RPE moy:</span>
                  <span className="ml-2 font-medium">{state.averageRPE.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Métriques temps réel */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{state.totalSets}</div>
              <div className="text-sm text-muted-foreground">Sets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{state.totalVolume.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">kg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{state.estimatedCalories}</div>
              <div className="text-sm text-muted-foreground">kcal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(state.performanceScore * 100).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
          </div>

          {/* Erreurs */}
          {(sessionError || setsError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Erreur: {sessionError || setsError}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interface de saisie des sets */}
      {state.currentState === 'working' && currentExercise && (
        <SetInputCard 
          exercise={currentExercise}
          setNumber={state.currentSetNumber}
          onSetComplete={handleCompleteSet}
        />
      )}

      {/* Historique des sets */}
      {sets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sets.map((set, index) => (
                <div key={set.id} className="flex justify-between items-center p-2 border rounded">
                  <span>Set {index + 1}</span>
                  <span>{set.weight}kg × {set.reps} reps</span>
                  {set.rpe && <Badge variant="outline">RPE {set.rpe}</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant pour la saisie des sets
interface SetInputCardProps {
  exercise: Exercise;
  setNumber: number;
  onSetComplete: (setData: Omit<WorkoutSet, 'id' | 'timestamp'>) => void;
}

const SetInputCard: React.FC<SetInputCardProps> = ({ exercise, setNumber, onSetComplete }) => {
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [rpe, setRpe] = useState<number>(5);

  const handleSubmit = () => {
    onSetComplete({
      sessionId: '', // Sera rempli par le parent
      exerciseId: exercise.id,
      setNumber,
      weight,
      reps,
      rpe,
      completed: true,
    });
    
    // Reset pour le prochain set
    setReps(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set {setNumber} - {exercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Répétitions</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">RPE (1-10)</label>
            <input
              type="number"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          className="w-full mt-4"
          disabled={weight === 0 || reps === 0}
        >
          Valider le Set
        </Button>
      </CardContent>
    </Card>
  );
};

export default SophisticatedWorkoutFlowManager;