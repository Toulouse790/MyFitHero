// src/features/workout/components/WorkoutProgress.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Award,
  Calendar,
  BarChart3 
} from 'lucide-react';

interface WorkoutProgressProps {
  // Vous pouvez ajouter plus de props selon vos besoins
}

export const WorkoutProgress: React.FC<WorkoutProgressProps> = () => {
  // Données simulées - remplacez par vos vraies données
  const progressData = {
    monthlyGoal: 16,
    completedWorkouts: 12,
    strengthProgress: 85,
    cardioProgress: 70,
    flexibilityProgress: 45,
    personalRecords: [
      { exercise: 'Développé couché', previous: 80, current: 85, unit: 'kg' },
      { exercise: 'Squat', previous: 100, current: 110, unit: 'kg' },
      { exercise: 'Course', previous: 5.2, current: 4.8, unit: 'min/km' },
    ]
  };

  const monthlyProgress = (progressData.completedWorkouts / progressData.monthlyGoal) * 100;

  return (
    <div className="space-y-4">
      {/* Objectif mensuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Objectif mensuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Séances ce mois</span>
              <span>{progressData.completedWorkouts}/{progressData.monthlyGoal}</span>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(monthlyProgress)}% de votre objectif mensuel atteint
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progrès par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Progrès par catégorie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Force</span>
              <span>{progressData.strengthProgress}%</span>
            </div>
            <Progress value={progressData.strengthProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Cardio</span>
              <span>{progressData.cardioProgress}%</span>
            </div>
            <Progress value={progressData.cardioProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Flexibilité</span>
              <span>{progressData.flexibilityProgress}%</span>
            </div>
            <Progress value={progressData.flexibilityProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Records personnels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Records personnels récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.personalRecords.map((record, index) => {
              const improvement = record.unit === 'min/km' 
                ? ((record.previous - record.current) / record.previous) * 100
                : ((record.current - record.previous) / record.previous) * 100;
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">{record.exercise}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.previous}{record.unit} → {record.current}{record.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">
                      +{Math.abs(improvement).toFixed(1)}%
                    </p>
                    <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de régularité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Régularité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">7</p>
              <p className="text-xs text-muted-foreground">Jours consécutifs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">4.2</p>
              <p className="text-xs text-muted-foreground">Séances/semaine</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-xs text-muted-foreground">Assiduité</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};