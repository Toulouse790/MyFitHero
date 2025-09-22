// src/features/workout/components/WorkoutSession.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  CheckCircle,
  Dumbbell 
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  completed?: boolean;
}

interface WorkoutSession {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  calories_burned?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  started_at?: Date;
  completed_at?: Date;
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
}

interface WorkoutSessionProps {
  currentSession: WorkoutSession | null;
  sessionTimer: number;
  isSessionActive: boolean;
  onStartSession: () => void;
  onPauseSession: () => void;
  onEndSession: () => void;
  onCompleteExercise: (exerciseId: string) => void;
}

export const WorkoutSessionComponent: React.FC<WorkoutSessionProps> = ({
  currentSession,
  sessionTimer,
  isSessionActive,
  onStartSession,
  onPauseSession,
  onEndSession,
  onCompleteExercise
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedExercises = currentSession?.exercises.filter(e => e.completed).length || 0;
  const totalExercises = currentSession?.exercises.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  if (!currentSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 h-5 w-5" />
            Aucune session active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Commencez une nouvelle séance d'entraînement
          </p>
          <Button onClick={onStartSession} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Démarrer un entraînement
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête de session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5" />
              {currentSession.name}
            </div>
            <Badge variant={isSessionActive ? 'default' : 'secondary'}>
              {isSessionActive ? 'En cours' : 'En pause'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{formatTime(sessionTimer)}</p>
              <p className="text-xs text-muted-foreground">Temps écoulé</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{completedExercises}/{totalExercises}</p>
              <p className="text-xs text-muted-foreground">Exercices</p>
            </div>
          </div>

          <Progress value={progressPercentage} className="mb-4" />

          <div className="flex gap-2">
            {!isSessionActive ? (
              <Button onClick={onStartSession} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Reprendre
              </Button>
            ) : (
              <Button onClick={onPauseSession} variant="outline" className="flex-1">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={onEndSession} variant="destructive">
              <Square className="mr-2 h-4 w-4" />
              Terminer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des exercices */}
      <Card>
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentSession.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-3 rounded-lg border ${
                  exercise.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets && exercise.reps 
                        ? `${exercise.sets} séries × ${exercise.reps} reps`
                        : exercise.duration_seconds 
                        ? `${Math.floor(exercise.duration_seconds / 60)}min`
                        : exercise.category
                      }
                      {exercise.weight && ` - ${exercise.weight}kg`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={exercise.completed ? "secondary" : "default"}
                    onClick={() => onCompleteExercise(exercise.id)}
                  >
                    {exercise.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      "Compléter"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};