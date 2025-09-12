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
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl mb-6">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{currentWorkout.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Durée estimée: {currentWorkout.duration} min</span>
                <Progress value={getWorkoutProgress(currentWorkout)} className="w-32" />
              </div>
            </CardContent>
          </Card>

        <div className="space-y-4">
          {currentWorkout.exercises.map((exercise) => (
            <Card key={exercise.id} className={`${exercise.completed ? 'bg-green-50/90' : 'bg-white/95'} backdrop-blur-sm shadow-lg rounded-xl`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-gray-800">{exercise.name}</span>
                  {exercise.completed && <span className="text-green-600 text-xl">✓</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">{exercise.sets} séries × {exercise.reps} répétitions</p>
                    {exercise.weight && <p className="text-sm text-gray-600">{exercise.weight} kg</p>}
                  </div>
                  {!exercise.completed && (
                    <Button 
                      onClick={() => completeExercise(exercise.id)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentWorkout(null)}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-white/100 rounded-xl"
          >
            Annuler
          </Button>
          <Button 
            onClick={finishWorkout}
            disabled={getWorkoutProgress(currentWorkout) < 100}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl disabled:opacity-50"
          >
            Terminer l'entraînement
          </Button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl mb-8">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Mes Entraînements</h1>
            <p className="text-gray-600">Choisissez un entraînement pour commencer</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className={`${workout.completed ? 'bg-green-50/90' : 'bg-white/95'} backdrop-blur-sm shadow-lg rounded-xl`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-gray-800">{workout.name}</span>
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
                  className={`w-full rounded-xl ${
                    workout.completed 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                  }`}
                >
                  {workout.completed ? 'Terminé' : 'Commencer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;