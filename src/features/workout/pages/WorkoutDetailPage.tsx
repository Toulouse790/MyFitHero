import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Target, TrendingUp, MessageSquare, Plus, Edit3, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';

// Types pour l'entraînement
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // en secondes
  restTime: number; // en secondes
  completed: boolean;
  notes?: string;
  targetMuscles: string[];
}

interface WorkoutData {
  id: string;
  name: string;
  description: string;
  duration: number; // durée estimée en minutes
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completedAt?: string;
  totalSets: number;
  completedSets: number;
}

const WorkoutDetailPage = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const workoutId = location.split('/').pop();
  
  // États pour le minuteur et le suivi
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [adjustedRestTime, setAdjustedRestTime] = useState<number | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // Données d'exemple (à remplacer par un fetch API)
  const [workout, setWorkout] = useState<WorkoutData>({
    id: workoutId || '1',
    name: 'Entraînement Pectoraux & Triceps',
    description: 'Session intensive pour développer la force et la masse musculaire du haut du corps',
    duration: 60,
    difficulty: 'intermediate',
    category: 'Musculation',
    totalSets: 12,
    completedSets: 0,
    exercises: [
      {
        id: '1',
        name: 'Développé couché',
        sets: 4,
        reps: 10,
        weight: 80,
        restTime: 120,
        completed: false,
        targetMuscles: ['Pectoraux', 'Triceps', 'Épaules'],
        notes: ''
      },
      {
        id: '2', 
        name: 'Développé incliné haltères',
        sets: 3,
        reps: 12,
        weight: 30,
        restTime: 90,
        completed: false,
        targetMuscles: ['Pectoraux supérieurs', 'Épaules'],
        notes: ''
      },
      {
        id: '3',
        name: 'Dips',
        sets: 3,
        reps: 15,
        restTime: 60,
        completed: false,
        targetMuscles: ['Triceps', 'Pectoraux inférieurs'],
        notes: ''
      },
      {
        id: '4',
        name: 'Extension triceps',
        sets: 2,
        reps: 12,
        weight: 25,
        restTime: 45,
        completed: false,
        targetMuscles: ['Triceps'],
        notes: ''
      }
    ]
  });

  // Minuteur principal
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Minuteur de repos
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (restTimer > 0) {
      restInterval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            toast({
              title: "Repos terminé !",
              description: "C'est parti pour la série suivante 💪",
              variant: "default",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [restTimer, toast]);

  // Fonctions utilitaires
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentExercise = (): Exercise => {
    return workout.exercises[currentExerciseIndex] || workout.exercises[0];
  };

  const getProgressPercentage = (): number => {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = workout.exercises.reduce((sum, ex) => 
      sum + (ex.completed ? ex.sets : 0), 0
    ) + (currentSet - 1);
    return Math.round((completedSets / totalSets) * 100);
  };

  // Actions utilisateur
  const startWorkout = () => {
    setIsTimerRunning(true);
    toast({
      title: "Entraînement commencé !",
      description: "Bon courage pour votre session 🔥",
      variant: "default",
    });
  };

  const pauseWorkout = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const completeSet = () => {
    const currentExercise = getCurrentExercise();
    
    if (currentSet < currentExercise.sets) {
      // Passer à la série suivante
      setCurrentSet(prev => prev + 1);
      const restTime = adjustedRestTime ?? currentExercise.restTime;
      setRestTimer(restTime);
      setAdjustedRestTime(null); // Reset pour la prochaine série
      toast({
        title: `Série ${currentSet} terminée !`,
        description: `Repos: ${restTime}s avant la série ${currentSet + 1}`,
        variant: "default",
      });
    } else {
      // Exercice terminé
      const updatedExercises = [...workout.exercises];
      updatedExercises[currentExerciseIndex].completed = true;
      
      setWorkout(prev => ({
        ...prev,
        exercises: updatedExercises,
        completedSets: prev.completedSets + currentExercise.sets
      }));

      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Passer à l'exercice suivant
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        toast({
          title: `${currentExercise.name} terminé ! 🎉`,
          description: `Exercice suivant: ${workout.exercises[currentExerciseIndex + 1].name}`,
          variant: "default",
        });
      } else {
        // Entraînement terminé
        setIsTimerRunning(false);
        toast({
          title: "Entraînement terminé ! 🏆",
          description: "Félicitations pour cette excellente session !",
          variant: "default",
        });
      }
    }
  };

  const resetWorkout = () => {
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTimeElapsed(0);
    setRestTimer(0);
    setAdjustedRestTime(null);
    setIsTimerRunning(false);
    
    const resetExercises = workout.exercises.map(ex => ({ ...ex, completed: false }));
    setWorkout(prev => ({
      ...prev,
      exercises: resetExercises,
      completedSets: 0
    }));
  };

  const adjustRestTime = (increment: number) => {
    if (restTimer > 0) {
      const currentExercise = getCurrentExercise();
      const baseTime = adjustedRestTime ?? currentExercise.restTime;
      const newTime = Math.max(15, baseTime + increment); // Minimum 15 secondes
      setAdjustedRestTime(newTime);
      setRestTimer(newTime);
      
      toast({
        title: `Temps de repos ajusté`,
        description: `Nouveau temps: ${newTime}s (${increment > 0 ? '+' : ''}${increment}s)`,
        variant: "default",
      });
    }
  };

  const goBack = () => {
    setLocation('/dashboard');
  };

  const currentExercise = getCurrentExercise();
  const isWorkoutCompleted = workout.exercises.every(ex => ex.completed);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header avec retour */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
          <p className="text-gray-600">{workout.description}</p>
        </div>
      </div>

      {/* Barre de progression globale */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-gray-600">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="mb-4" />
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-gray-600">Temps écoulé</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{workout.completedSets}</div>
              <div className="text-xs text-gray-600">Séries faites</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{workout.totalSets}</div>
              <div className="text-xs text-gray-600">Séries totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{restTimer}</div>
              <div className="text-xs text-gray-600">Repos (s)</div>
              {restTimer > 0 && (
                <div className="flex gap-1 mt-1 justify-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => adjustRestTime(-15)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => adjustRestTime(15)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="workout" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">Entraînement</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Onglet Entraînement */}
        <TabsContent value="workout" className="space-y-4">
          {/* Exercice actuel */}
          {!isWorkoutCompleted && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentExercise.name}</span>
                  <Badge variant="outline">
                    Exercice {currentExerciseIndex + 1}/{workout.exercises.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{currentSet}</div>
                    <div className="text-sm text-gray-600">Série {currentSet}/{currentExercise.sets}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{currentExercise.reps}</div>
                    <div className="text-sm text-gray-600">Répétitions</div>
                  </div>
                </div>

                {currentExercise.weight && (
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-orange-600">{currentExercise.weight} kg</div>
                    <div className="text-sm text-gray-600">Poids</div>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  {currentExercise.targetMuscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  {!isTimerRunning ? (
                    <Button onClick={startWorkout} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Commencer
                    </Button>
                  ) : (
                    <Button onClick={pauseWorkout} variant="outline" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={completeSet} variant="default" className="flex-1">
                    <Target className="h-4 w-4 mr-2" />
                    Série terminée
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des exercices */}
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <Card 
                key={exercise.id} 
                className={`
                  ${exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white'}
                  ${index === currentExerciseIndex && !exercise.completed ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} séries × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight}kg`}
                      </p>
                    </div>
                    <div className="text-right">
                      {exercise.completed ? (
                        <Badge variant="default" className="bg-green-600">
                          Terminé ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contrôles */}
          <div className="flex gap-2 pt-4">
            <Button onClick={resetWorkout} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
            {isWorkoutCompleted && (
              <Button onClick={goBack} variant="default" className="flex-1">
                Retour au dashboard
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Temps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Écoulé:</span>
                    <span className="font-bold">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Estimé:</span>
                    <span className="text-gray-600">{workout.duration}min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Séries:</span>
                    <span className="font-bold">{workout.completedSets}/{workout.totalSets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Exercices:</span>
                    <span className="font-bold">
                      {workout.exercises.filter(ex => ex.completed).length}/{workout.exercises.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Muscles ciblés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(workout.exercises.flatMap(ex => ex.targetMuscles))).map((muscle) => (
                  <Badge key={muscle} variant="outline" className="text-sm">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notes */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                Notes de l'entraînement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Notez vos impressions, difficultés, améliorations..."
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                className="min-h-[120px] mb-4"
              />
              <Button onClick={() => {
                toast({
                  title: "Notes sauvegardées",
                  description: "Vos notes ont été enregistrées avec succès",
                  variant: "default",
                });
              }}>
                <Edit3 className="h-4 w-4 mr-2" />
                Sauvegarder les notes
              </Button>
            </CardContent>
          </Card>

          {/* Historique des performances (exemple) */}
          <Card>
            <CardHeader>
              <CardTitle>Dernières performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">Il y a 3 jours</div>
                    <div className="text-sm text-gray-600">Durée: 58min • 12/12 séries</div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Terminé</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">Il y a 1 semaine</div>
                    <div className="text-sm text-gray-600">Durée: 62min • 10/12 séries</div>
                  </div>
                  <Badge variant="outline">Incomplet</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutDetailPage;
