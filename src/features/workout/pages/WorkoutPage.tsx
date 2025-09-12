import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/core/auth/auth.store';

interface Workout {
  id: string;
  name: string;
  duration: number;
  exercises: Exercise[];
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

const WorkoutPage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Charger les entraînements
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    // Placeholder - remplacer par vraie logique
    const mockWorkouts: Workout[] = [
      {
        id: '1',
        name: 'Entraînement Push',
        duration: 45,
        completed: false,
        exercises: [
          { id: '1', name: 'Développé couché', sets: 3, reps: 10, weight: 80, completed: false },
          { id: '2', name: 'Développé incliné', sets: 3, reps: 10, weight: 70, completed: false },
          { id: '3', name: 'Dips', sets: 3, reps: 12, completed: false },
        ]
      },
      {
        id: '2',
        name: 'Entraînement Pull',
        duration: 40,
        completed: false,
        exercises: [
          { id: '4', name: 'Tractions', sets: 3, reps: 8, completed: false },
          { id: '5', name: 'Rowing barre', sets: 3, reps: 10, weight: 60, completed: false },
          { id: '6', name: 'Curl biceps', sets: 3, reps: 12, weight: 20, completed: false },
        ]
      }
    ];
    setWorkouts(mockWorkouts);
  };

  const startWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
  };

  const completeExercise = (exerciseId: string) => {
    if (!currentWorkout) return;
    
    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      )
    };
    setCurrentWorkout(updatedWorkout);
  };

  const finishWorkout = () => {
    if (!currentWorkout) return;
    
    const completedWorkout = { ...currentWorkout, completed: true };
    setWorkouts(prev => prev.map(w => w.id === completedWorkout.id ? completedWorkout : w));
    setCurrentWorkout(null);
  };

  const getWorkoutProgress = (workout: Workout) => {
    const completedExercises = workout.exercises.filter(ex => ex.completed).length;
    return (completedExercises / workout.exercises.length) * 100;
  };

  if (currentWorkout) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{currentWorkout.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Durée estimée: {currentWorkout.duration} min</span>
            <Progress value={getWorkoutProgress(currentWorkout)} className="w-32" />
          </div>
        </div>

        <div className="space-y-4">
          {currentWorkout.exercises.map((exercise) => (
            <Card key={exercise.id} className={exercise.completed ? 'bg-green-50' : ''}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{exercise.name}</span>
                  {exercise.completed && <span className="text-green-600">✓</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p>{exercise.sets} séries × {exercise.reps} répétitions</p>
                    {exercise.weight && <p className="text-sm text-gray-600">{exercise.weight} kg</p>}
                  </div>
                  {!exercise.completed && (
                    <Button onClick={() => completeExercise(exercise.id)}>
                      Terminer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setCurrentWorkout(null)}>
            Annuler
          </Button>
          <Button 
            onClick={finishWorkout}
            disabled={getWorkoutProgress(currentWorkout) < 100}
            className="bg-green-600 hover:bg-green-700"
          >
            Terminer l'entraînement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mes Entraînements</h1>
        <p className="text-gray-600">Choisissez un entraînement pour commencer</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className={workout.completed ? 'bg-green-50' : ''}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{workout.name}</span>
                {workout.completed && <span className="text-green-600">✓ Terminé</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">Durée: {workout.duration} minutes</p>
                <p className="text-sm text-gray-600">{workout.exercises.length} exercices</p>
                {getWorkoutProgress(workout) > 0 && (
                  <Progress value={getWorkoutProgress(workout)} className="w-full" />
                )}
              </div>
              <Button 
                onClick={() => startWorkout(workout)}
                disabled={workout.completed}
                className="w-full"
              >
                {workout.completed ? 'Terminé' : 'Commencer'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;