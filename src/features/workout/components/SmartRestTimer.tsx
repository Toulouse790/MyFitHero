import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Slider } from '../../components/ui/slider';
import { 
  Timer, 
  Brain, 
  Zap, 
  Heart, 
  TrendingUp, 
  SkipForward,
  RotateCcw,
  Settings,
  Activity,
  Target
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

// Types pour le système de repos intelligent
interface RestRecommendation {
  suggested: number; // temps suggéré en secondes
  minimum: number;
  maximum: number;
  confidence: number; // 0-1, confiance de la prédiction
  reasoning: string[];
  adaptiveFactors: {
    fatigue: number; // 0-1
    heartRate?: number;
    previousSetPerformance: number; // 0-1
    exerciseIntensity: number; // 0-1
    timeOfDay: number; // 0-1
    hydrationLevel?: number; // 0-1
  };
}

interface ExerciseContext {
  type: 'strength' | 'cardio' | 'power' | 'endurance' | 'flexibility';
  muscleGroups: string[];
  intensity: number; // 1-10
  setNumber: number;
  totalSets: number;
  weight?: number;
  reps?: number;
  previousRest?: number[];
  targetRPE?: number; // Rate of Perceived Exertion
}

interface RestTimerState {
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  originalDuration: number;
  recommendation: RestRecommendation | null;
  adaptiveMode: boolean;
  autoStart: boolean;
}

interface SmartRestTimerProps {
  exerciseContext?: ExerciseContext;
  userId?: string;
  onRestComplete?: () => void;
  onRestSkip?: () => void;
  onRestExtend?: (additionalTime: number) => void;
  className?: string;
}

export const SmartRestTimer: React.FC<SmartRestTimerProps> = ({
  exerciseContext,
  userId,
  onRestComplete,
  onRestSkip,
  onRestExtend,
  className = ''
}) => {
  const [timerState, setTimerState] = useState<RestTimerState>({
    isActive: false,
    isPaused: false,
    timeRemaining: 0,
    originalDuration: 0,
    recommendation: null,
    adaptiveMode: true,
    autoStart: false
  });

  const [userPreferences, setUserPreferences] = useState({
    preferredRestTimes: {
      strength: 180, // 3 minutes
      cardio: 60,    // 1 minute
      power: 300,    // 5 minutes
      endurance: 45, // 45 secondes
      flexibility: 30 // 30 secondes
    },
    adaptiveEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const [biometrics, setBiometrics] = useState({
    currentHeartRate: 0,
    restingHeartRate: 65,
    maxHeartRate: 190,
    currentRPE: 5
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  // Algorithme d'IA pour prédire le temps de repos optimal
  const calculateOptimalRest = useCallback((context: ExerciseContext): RestRecommendation => {
    const baseTime = userPreferences.preferredRestTimes[context.type];
    
    // Facteurs adaptatifs
    const factors = {
      fatigue: Math.min(context.setNumber / context.totalSets, 1),
      heartRate: biometrics.currentHeartRate > 0 ? 
        (biometrics.currentHeartRate - biometrics.restingHeartRate) / 
        (biometrics.maxHeartRate - biometrics.restingHeartRate) : 0.5,
      previousSetPerformance: context.reps && context.targetRPE ? 
        Math.max(0, 1 - (biometrics.currentRPE - context.targetRPE) / 10) : 0.7,
      exerciseIntensity: context.intensity / 10,
      timeOfDay: (() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 10) return 0.9; // Matin - énergie élevée
        if (hour >= 14 && hour <= 18) return 1.0; // Après-midi - pic
        if (hour >= 19 && hour <= 22) return 0.8; // Soir - déclin
        return 0.6; // Nuit/très tôt
      })(),
      hydrationLevel: 0.8 // Placeholder - à connecter avec hydratation
    };

    // Modèle de prédiction sophistiqué
    let adjustmentFactor = 1.0;
    
    // Fatigue croissante = plus de repos
    adjustmentFactor += factors.fatigue * 0.4;
    
    // Fréquence cardiaque élevée = plus de repos
    adjustmentFactor += factors.heartRate * 0.3;
    
    // Performance déclinante = plus de repos
    adjustmentFactor += (1 - factors.previousSetPerformance) * 0.3;
    
    // Intensité élevée = plus de repos
    adjustmentFactor += factors.exerciseIntensity * 0.2;
    
    // Moment de la journée
    adjustmentFactor *= factors.timeOfDay;
    
    // Hydratation
    adjustmentFactor += (1 - factors.hydrationLevel) * 0.1;

    const suggestedTime = Math.round(baseTime * adjustmentFactor);
    const confidence = Math.min(
      0.6 + // Base confidence
      (context.previousRest?.length || 0) * 0.05 + // Plus de données = plus de confiance
      (biometrics.currentHeartRate > 0 ? 0.2 : 0) + // Données biométriques
      (factors.previousSetPerformance > 0.5 ? 0.1 : 0), // Performance cohérente
      1.0
    );

    const reasoning = [];
    
    if (factors.fatigue > 0.7) reasoning.push("Fatigue détectée - repos prolongé");
    if (factors.heartRate > 0.8) reasoning.push("FC élevée - récupération cardio");
    if (factors.exerciseIntensity > 0.8) reasoning.push("Exercice intensif - repos maximal");
    if (factors.previousSetPerformance < 0.5) reasoning.push("Performance déclinante");
    if (factors.timeOfDay < 0.7) reasoning.push("Moment non-optimal - compensation");

    return {
      suggested: suggestedTime,
      minimum: Math.round(suggestedTime * 0.6),
      maximum: Math.round(suggestedTime * 1.5),
      confidence,
      reasoning,
      adaptiveFactors: factors
    };
  }, [userPreferences, biometrics]);

  // Démarrage intelligent du timer
  const startRestTimer = useCallback((customDuration?: number) => {
    const recommendation = exerciseContext ? calculateOptimalRest(exerciseContext) : null;
    const duration = customDuration || recommendation?.suggested || 120;

    setTimerState({
      isActive: true,
      isPaused: false,
      timeRemaining: duration,
      originalDuration: duration,
      recommendation,
      adaptiveMode: true,
      autoStart: false
    });

    // Notification de démarrage
    if (recommendation) {
      toast.info('Repos intelligent démarré', {
        description: `${Math.floor(duration / 60)}m ${duration % 60}s suggérés (${Math.round(recommendation.confidence * 100)}% confiance)`
      });
    }

    // Sauvegarde du début de repos
    if (userId && exerciseContext) {
      saveRestSession('start', {
        suggested_duration: duration,
        confidence: recommendation?.confidence || 0,
        context: exerciseContext,
        biometrics: biometrics
      });
    }
  }, [exerciseContext, calculateOptimalRest, userId, biometrics]);

  // Timer principal
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            // Timer terminé
            onRestComplete?.();
            playCompletionSound();
            
            toast.success('Repos terminé !', {
              description: 'Prêt pour la prochaine série'
            });

            return {
              ...prev,
              isActive: false,
              timeRemaining: 0
            };
          }
          
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
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
  }, [timerState.isActive, timerState.isPaused, timerState.timeRemaining, onRestComplete]);

  // Son de fin de repos
  const playCompletionSound = useCallback(() => {
    if (!userPreferences.soundEnabled) return;

    // Séquence de bips sophistiquée
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContext.current;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    // Triple bip avec harmoniques
    [0, 0.2, 0.4].forEach((delay, index) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(800 + index * 200, ctx.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
      }, delay * 1000);
    });

    // Vibration si supportée
    if (userPreferences.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, [userPreferences]);

  // Sauvegarde des données de repos
  const saveRestSession = useCallback(async (
    action: 'start' | 'complete' | 'skip' | 'extend',
    data: any
  ) => {
    if (!userId) return;

    try {
      await supabase.from('rest_sessions').insert({
        user_id: userId,
        action,
        timestamp: new Date().toISOString(),
        data: {
          ...data,
          timer_state: timerState
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde rest session:', error);
    }
  }, [userId, timerState]);

  // Actions utilisateur
  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const skipRest = () => {
    setTimerState(prev => ({ ...prev, isActive: false, timeRemaining: 0 }));
    onRestSkip?.();
    saveRestSession('skip', { remaining_time: timerState.timeRemaining });
    
    toast.info('Repos écourté', {
      description: 'Passage à la série suivante'
    });
  };

  const extendRest = (additionalSeconds: number) => {
    setTimerState(prev => ({
      ...prev,
      timeRemaining: prev.timeRemaining + additionalSeconds,
      originalDuration: prev.originalDuration + additionalSeconds
    }));
    
    onRestExtend?.(additionalSeconds);
    saveRestSession('extend', { additional_time: additionalSeconds });
    
    toast.info(`+${additionalSeconds}s ajoutés`, {
      description: 'Repos prolongé'
    });
  };

  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      timeRemaining: prev.originalDuration,
      isPaused: false
    }));
  };

  // Format temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Couleur progressive du timer
  const getTimerColor = (): string => {
    const progress = timerState.timeRemaining / timerState.originalDuration;
    
    if (progress > 0.7) return 'from-green-500 to-emerald-600';
    if (progress > 0.3) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const progressPercentage = timerState.originalDuration > 0 ? 
    ((timerState.originalDuration - timerState.timeRemaining) / timerState.originalDuration) * 100 : 0;

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>Repos Intelligent</span>
          </div>
          {timerState.recommendation && (
            <Badge variant="outline" className="text-xs">
              {Math.round(timerState.recommendation.confidence * 100)}% confiance
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer principal */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-bold font-mono bg-gradient-to-r ${getTimerColor()} bg-clip-text text-transparent`}>
            {formatTime(timerState.timeRemaining)}
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />

          <div className="text-sm text-gray-500">
            {timerState.isActive ? 
              `${formatTime(timerState.originalDuration)} suggérés` : 
              'Timer en attente'
            }
          </div>
        </div>

        {/* Recommandation IA */}
        {timerState.recommendation && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <Brain className="w-4 h-4" />
              Analyse IA
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              {timerState.recommendation.reasoning.map((reason, index) => (
                <div key={index}>• {reason}</div>
              ))}
            </div>
            
            {/* Facteurs adaptatifs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Fatigue:</span>
                <span className="font-medium">
                  {Math.round(timerState.recommendation.adaptiveFactors.fatigue * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Intensité:</span>
                <span className="font-medium">
                  {Math.round(timerState.recommendation.adaptiveFactors.exerciseIntensity * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles */}
        <div className="space-y-3">
          {!timerState.isActive ? (
            <div className="space-y-2">
              <Button 
                onClick={() => startRestTimer()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Timer className="w-4 h-4 mr-2" />
                Démarrer Repos Intelligent
              </Button>
              
              {/* Sélecteur manuel */}
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Ou durée personnalisée:</div>
                <div className="flex gap-2">
                  {[60, 90, 120, 180, 240, 300].map(duration => (
                    <Button
                      key={duration}
                      variant="outline"
                      size="sm"
                      onClick={() => startRestTimer(duration)}
                      className="flex-1 text-xs"
                    >
                      {Math.floor(duration / 60)}m
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={pauseTimer}
                variant="outline"
                size="sm"
              >
                {timerState.isPaused ? 'Reprendre' : 'Pause'}
              </Button>
              
              <Button 
                onClick={skipRest}
                variant="outline"
                size="sm"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Passer
              </Button>
              
              <Button 
                onClick={() => extendRest(30)}
                variant="outline"
                size="sm"
              >
                +30s
              </Button>
              
              <Button 
                onClick={resetTimer}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Biométriques si disponibles */}
        {biometrics.currentHeartRate > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Fréquence cardiaque</span>
              </div>
              <span className="font-bold text-red-500">
                {biometrics.currentHeartRate} bpm
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Zone: {biometrics.currentHeartRate > biometrics.maxHeartRate * 0.8 ? 
                'Anaérobie' : biometrics.currentHeartRate > biometrics.maxHeartRate * 0.7 ? 
                'Aérobie' : 'Récupération'
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRestTimer;