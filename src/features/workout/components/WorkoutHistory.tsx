// src/features/workout/components/WorkoutHistory.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/components/ui/card';
import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import { 
  Clock, 
  Calendar, 
  Zap, 
  TrendingUp,
  Filter,
  Download 
} from 'lucide-react';

interface WorkoutSession {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  calories_burned?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: any[];
  started_at?: Date;
  completed_at?: Date;
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
}

interface WorkoutHistoryProps {
  recentWorkouts: WorkoutSession[];
  onFilterChange: (filter: string) => void;
  onExportData: () => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({
  recentWorkouts,
  onFilterChange,
  onExportData
}) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getWorkoutTypeLabel = (type: string) => {
    const labels = {
      strength: 'Force',
      cardio: 'Cardio',
      flexibility: 'Flexibilité',
      sports: 'Sport',
      other: 'Autre'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors = {
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
      sports: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec filtres */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Historique des séances</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onFilterChange('all')}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Liste des séances */}
      {recentWorkouts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium mb-2">Aucune séance enregistrée</h4>
            <p className="text-muted-foreground">
              Vos séances d'entraînement apparaîtront ici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentWorkouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{workout.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {workout.completed_at && formatDate(workout.completed_at)}
                    </p>
                  </div>
                  <Badge className={getWorkoutTypeColor(workout.workout_type)}>
                    {getWorkoutTypeLabel(workout.workout_type)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatTime(workout.duration_minutes)}
                  </div>
                  {workout.calories_burned && (
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-muted-foreground" />
                      {workout.calories_burned} cal
                    </div>
                  )}
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                    {workout.exercises.length} exercices
                  </div>
                </div>

                {workout.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {workout.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};