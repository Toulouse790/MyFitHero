import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  TrendingUp, 
  Zap, 
  Target,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Types avancés pour le timer de session
interface SessionMetrics {
  totalDuration: number;
  activeDuration: number; // temps réel d'entraînement
  restDuration: number;
  exerciseCount: number;
  setCount: number;
  avgRestTime: number;
  workRestRatio: number;
  caloriesBurned: number;
  heartRateZones?: {
    zone1: number; // Recovery
    zone2: number; // Aerobic
    zone3: number; // Anaerobic
    zone4: number; // VO2 Max
    zone5: number; // Neuromuscular
  };
}

interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  startTime: Date | null;
  lastPauseTime: Date | null;
  totalPausedTime: number;
  currentPhase: 'warmup' | 'workout' | 'rest' | 'cooldown';
  sessionId: string | null;
}

interface SessionTimerProps {
  userId?: string;
  workoutId?: string;
  onSessionEnd?: (metrics: SessionMetrics) => void;
  onPhaseChange?: (phase: SessionState['currentPhase']) => void;
  className?: string;
}

export const AdvancedSessionTimer: React.FC<SessionTimerProps> = ({
  userId,
  workoutId,
  onSessionEnd,
  onPhaseChange,
  className = ''
}) => {
  // State principal
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    isPaused: false,
    startTime: null,
    lastPauseTime: null,
    totalPausedTime: 0,
    currentPhase: 'warmup',
    sessionId: null
  });

  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalDuration: 0,
    activeDuration: 0,
    restDuration: 0,
    exerciseCount: 0,
    setCount: 0,
    avgRestTime: 0,
    workRestRatio: 0,
    caloriesBurned: 0
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [targetDuration, setTargetDuration] = useState(3600); // 1 heure par défaut
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartRateRef = useRef<number>(0);

  // Calcul du temps en temps réel
  const updateTimer = useCallback(() => {
    if (!sessionState.isActive || sessionState.isPaused || !sessionState.startTime) {
      return;
    }

    const now = new Date();
    const elapsed = now.getTime() - sessionState.startTime.getTime() - sessionState.totalPausedTime;
    setCurrentTime(Math.floor(elapsed / 1000));

    // Mise à jour des métriques en temps réel
    setMetrics(prev => ({
      ...prev,
      totalDuration: Math.floor(elapsed / 1000),
      activeDuration: Math.floor(elapsed / 1000) - prev.restDuration
    }));
  }, [sessionState]);

  // Timer principal
  useEffect(() => {
    if (sessionState.isActive && !sessionState.isPaused) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionState.isActive, sessionState.isPaused, updateTimer]);

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    if (sessionState.isActive && sessionState.sessionId) {
      const saveInterval = setInterval(async () => {
        await saveSessionProgress();
      }, 30000);

      return () => clearInterval(saveInterval);
    }
  }, [sessionState.isActive, sessionState.sessionId]);

  // Démarrage de session
  const startSession = useCallback(async () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date();

    setSessionState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime,
      sessionId,
      currentPhase: 'warmup'
    }));

    // Sauvegarde initiale en base
    if (userId) {
      try {
        await supabase.from('workout_sessions').insert({
          id: sessionId,
          user_id: userId,
          workout_id: workoutId,
          start_time: startTime.toISOString(),
          phase: 'warmup',
          status: 'active'
        });
      } catch (error) {
        console.error('Erreur sauvegarde session:', error);
      }
    }

    toast.success('Session démarrée !', {
      description: 'Votre entraînement est maintenant tracké.'
    });
  }, [userId, workoutId]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    const now = new Date();

    if (sessionState.isPaused) {
      // Resume
      const pauseDuration = now.getTime() - (sessionState.lastPauseTime?.getTime() || 0);
      setSessionState(prev => ({
        ...prev,
        isPaused: false,
        lastPauseTime: null,
        totalPausedTime: prev.totalPausedTime + pauseDuration
      }));
    } else {
      // Pause
      setSessionState(prev => ({
        ...prev,
        isPaused: true,
        lastPauseTime: now
      }));
    }
  }, [sessionState.isPaused, sessionState.lastPauseTime]);

  // Fin de session
  const endSession = useCallback(async () => {
    if (!sessionState.isActive) return;

    const finalMetrics = {
      ...metrics,
      workRestRatio: metrics.restDuration > 0 ? metrics.activeDuration / metrics.restDuration : 0
    };

    setSessionState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentPhase: 'cooldown'
    }));

    // Sauvegarde finale
    if (sessionState.sessionId && userId) {
      try {
        await supabase.from('workout_sessions').update({
          end_time: new Date().toISOString(),
          status: 'completed',
          total_duration: finalMetrics.totalDuration,
          active_duration: finalMetrics.activeDuration,
          rest_duration: finalMetrics.restDuration,
          exercise_count: finalMetrics.exerciseCount,
          set_count: finalMetrics.setCount,
          calories_burned: finalMetrics.caloriesBurned,
          metrics: finalMetrics
        }).eq('id', sessionState.sessionId);
      } catch (error) {
        console.error('Erreur sauvegarde finale:', error);
      }
    }

    onSessionEnd?.(finalMetrics);
    
    toast.success('Session terminée !', {
      description: `Durée: ${formatTime(finalMetrics.totalDuration)} | ${finalMetrics.setCount} séries`
    });
  }, [sessionState, metrics, userId, onSessionEnd]);

  // Sauvegarde progressive
  const saveSessionProgress = useCallback(async () => {
    if (!sessionState.sessionId || !userId) return;

    try {
      await supabase.from('workout_sessions').update({
        current_duration: currentTime,
        metrics: metrics,
        last_update: new Date().toISOString()
      }).eq('id', sessionState.sessionId);
    } catch (error) {
      console.error('Erreur sauvegarde progress:', error);
    }
  }, [sessionState.sessionId, userId, currentTime, metrics]);

  // Changement de phase
  const changePhase = useCallback((newPhase: SessionState['currentPhase']) => {
    setSessionState(prev => ({ ...prev, currentPhase: newPhase }));
    onPhaseChange?.(newPhase);

    // Analytics de phase
    const phaseColors = {
      warmup: 'bg-yellow-500',
      workout: 'bg-red-500', 
      rest: 'bg-blue-500',
      cooldown: 'bg-green-500'
    };

    toast.info(`Phase: ${newPhase}`, {
      description: 'Transition détectée automatiquement'
    });
  }, [onPhaseChange]);

  // Utilitaires
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPhaseColor = (phase: SessionState['currentPhase']): string => {
    const colors = {
      warmup: 'from-yellow-400 to-orange-500',
      workout: 'from-red-500 to-pink-600',
      rest: 'from-blue-400 to-cyan-500',
      cooldown: 'from-green-400 to-emerald-500'
    };
    return colors[phase];
  };

  const progressPercentage = targetDuration > 0 ? Math.min((currentTime / targetDuration) * 100, 100) : 0;
  const estimatedCalories = Math.floor(currentTime * 0.15); // Approximation

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span>Session Timer</span>
          </div>
          <Badge 
            variant="outline" 
            className={`bg-gradient-to-r ${getPhaseColor(sessionState.currentPhase)} text-white border-0`}
          >
            {sessionState.currentPhase}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer principal */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold font-mono tracking-wider">
            {formatTime(currentTime)}
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          <div className="text-sm text-gray-500">
            Objectif: {formatTime(targetDuration)}
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex justify-center gap-3">
          {!sessionState.isActive ? (
            <Button 
              onClick={startSession}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Démarrer
            </Button>
          ) : (
            <>
              <Button 
                onClick={togglePause}
                variant="outline"
                size="sm"
              >
                {sessionState.isPaused ? (
                  <><Play className="w-4 h-4 mr-2" />Reprendre</>
                ) : (
                  <><Pause className="w-4 h-4 mr-2" />Pause</>
                )}
              </Button>
              <Button 
                onClick={endSession}
                variant="destructive"
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                Terminer
              </Button>
            </>
          )}
        </div>

        {/* Métriques en temps réel */}
        {sessionState.isActive && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                <div>
                  <div className="font-medium">Actif</div>
                  <div className="text-gray-500">{formatTime(metrics.activeDuration)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium">Repos</div>
                  <div className="text-gray-500">{formatTime(metrics.restDuration)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <div>
                  <div className="font-medium">Séries</div>
                  <div className="text-gray-500">{metrics.setCount}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="font-medium">Calories</div>
                  <div className="text-gray-500">{estimatedCalories}</div>
                </div>
              </div>
            </div>

            {/* Ratio Work/Rest */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ratio Travail/Repos</span>
                <span className="font-medium">
                  {metrics.restDuration > 0 ? (metrics.activeDuration / metrics.restDuration).toFixed(1) : '∞'}:1
                </span>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((metrics.activeDuration / (metrics.activeDuration + metrics.restDuration)) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Phases rapides */}
        {sessionState.isActive && (
          <>
            <Separator />
            <div className="flex gap-2">
              {(['warmup', 'workout', 'rest', 'cooldown'] as const).map((phase) => (
                <Button
                  key={phase}
                  onClick={() => changePhase(phase)}
                  variant={sessionState.currentPhase === phase ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                >
                  {phase}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSessionTimer;