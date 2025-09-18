// src/features/workout/components/WorkoutPlans.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Target, 
  Play,
  PlusCircle 
} from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  difficulty: string;
  workouts_per_week: number;
  target_muscles: string[];
  created_at: Date;
  is_active: boolean;
}

interface WorkoutPlansProps {
  plans: WorkoutPlan[];
  onStartPlan: (planId: string) => void;
  onCreatePlan: () => void;
}

export const WorkoutPlans: React.FC<WorkoutPlansProps> = ({
  plans,
  onStartPlan,
  onCreatePlan
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'Débutant';
      case 'intermediate':
        return 'Intermédiaire';
      case 'advanced':
        return 'Avancé';
      default:
        return difficulty;
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton créer */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mes programmes d'entraînement</h3>
        <Button onClick={onCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau programme
        </Button>
      </div>

      {/* Liste des plans */}
      {plans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium mb-2">Aucun programme</h4>
            <p className="text-muted-foreground mb-4">
              Créez votre premier programme d'entraînement personnalisé
            </p>
            <Button onClick={onCreatePlan}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer un programme
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.is_active ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex gap-2">
                    {plan.is_active && (
                      <Badge className="bg-blue-100 text-blue-800">Actif</Badge>
                    )}
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {formatDifficulty(plan.difficulty)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {plan.duration_weeks} semaines
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {plan.workouts_per_week}x/semaine
                  </div>
                </div>

                {plan.target_muscles.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm font-medium">Muscles ciblés:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.target_muscles.slice(0, 3).map((muscle, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {plan.target_muscles.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.target_muscles.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => onStartPlan(plan.id)} 
                  className="w-full"
                  variant={plan.is_active ? "default" : "outline"}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {plan.is_active ? "Continuer" : "Commencer"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};