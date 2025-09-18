// src/features/workout/components/WorkoutOverview.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Clock, 
  Dumbbell,
  BarChart3 
} from 'lucide-react';

interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgDuration: number;
  weeklyProgress: number;
  currentStreak: number;
  favoriteExercise: string;
  strongestLift: { exercise: string; weight: number };
}

interface WorkoutOverviewProps {
  stats: WorkoutStats | null;
  progressPercentage: number;
}

export const WorkoutOverview: React.FC<WorkoutOverviewProps> = ({
  stats,
  progressPercentage
}) => {
  if (!stats) {
    return <div>Chargement des statistiques...</div>;
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Séances</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{formatTime(stats.totalMinutes)}</p>
                <p className="text-xs text-muted-foreground">Temps total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCalories}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Jours consécutifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progrès hebdomadaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Progrès de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Objectif : 4 séances/semaine</span>
              <span>{stats.weeklyProgress}/4</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progressPercentage >= 100 
                ? "🎉 Objectif atteint ! Excellent travail !" 
                : `${Math.round(progressPercentage)}% de votre objectif hebdomadaire`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Records et favoris */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5" />
              Exercice favori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{stats.favoriteExercise}</p>
            <Badge variant="secondary">Le plus pratiqué</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Record personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{stats.strongestLift.exercise}</p>
            <p className="text-2xl font-bold text-green-600">{stats.strongestLift.weight}kg</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};