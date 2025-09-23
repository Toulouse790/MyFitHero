import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  Clock,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react';
import { PersonalizedGoal } from '../types';

interface PersonalizedGoalsProps {
  goals: PersonalizedGoal[];
  onCompleteGoal: (goalId: string) => void;
  onViewGoal: (goal: PersonalizedGoal) => void;
}

const PersonalizedGoals: React.FC<PersonalizedGoalsProps> = ({ 
  goals, 
  onCompleteGoal, 
  onViewGoal 
}) => {
  const getCategoryIcon = (category: PersonalizedGoal['category']) => {
    switch (category) {
      case 'workout':
        return '🏋️';
      case 'nutrition':
        return '🥗';
      case 'recovery':
        return '😴';
      case 'sleep':
        return '🌙';
      default:
        return '🎯';
    }
  };

  const getCategoryColor = (category: PersonalizedGoal['category']) => {
    switch (category) {
      case 'workout':
        return 'from-blue-500 to-purple-500';
      case 'nutrition':
        return 'from-green-500 to-emerald-500';
      case 'recovery':
        return 'from-orange-500 to-red-500';
      case 'sleep':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBadge = (priority: PersonalizedGoal['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Priorité</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Important</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Optionnel</Badge>;
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expiré';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays <= 7) return `${diffDays} jours`;
    return `${Math.ceil(diffDays / 7)} semaines`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (goals.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Objectifs Personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun objectif personnalisé</p>
            <p className="text-sm">L'IA va créer des objectifs adaptés à vos performances</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Objectifs Personnalisés
            {goals.some(g => g.aiGenerated) && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Brain className="w-3 h-3 mr-1" />
                IA
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {goals.length} actif{goals.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal.currentValue, goal.targetValue);
          const isCompleted = progressPercentage >= 100;
          const timeRemaining = getTimeRemaining(goal.deadline);
          
          return (
            <div
              key={goal.id}
              className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                isCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(goal.category)} text-white flex-shrink-0`}>
                    <span className="text-lg">
                      {getCategoryIcon(goal.category)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {goal.title}
                      </h4>
                      {getPriorityBadge(goal.priority)}
                      {goal.aiGenerated && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
                
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progression: {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                
                <Progress 
                  value={progressPercentage} 
                  className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{timeRemaining}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewGoal(goal)}
                    className="text-xs h-7 px-3"
                  >
                    Détails
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  
                  {isCompleted && (
                    <Button
                      size="sm"
                      onClick={() => onCompleteGoal(goal.id)}
                      className="text-xs h-7 px-3 bg-green-600 hover:bg-green-700"
                    >
                      Marquer comme terminé
                      <CheckCircle className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {goals.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {goals.filter(g => getProgressPercentage(g.currentValue, g.targetValue) >= 100).length} / {goals.length} objectifs atteints
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {/* Navigate to goals page */}}
                className="text-xs"
              >
                Gérer les objectifs
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedGoals;