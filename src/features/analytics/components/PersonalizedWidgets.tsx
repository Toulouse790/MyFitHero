// src/features/analytics/components/PersonalizedWidgets.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Heart,
  Dumbbell,
  Apple,
  Droplets,
  Moon,
  AlertTriangle,
  Info,
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import { Exercise } from '@/shared/types/dashboard';

interface PersonalizedWidget {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
  color: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  path?: string;
}

interface PersonalizedWidgetsProps {
  smartReminders: PersonalizedWidget[];
  personalizedExercises: Exercise[];
  userProfile?: any;
  currentStreak?: number;
  weeklyGoals?: {
    workouts: { current: number; target: number };
    nutrition: { current: number; target: number };
    hydration: { current: number; target: number };
  };
  upcomingEvents?: Array<{
    id: string;
    title: string;
    date: Date;
    type: 'workout' | 'nutrition' | 'sleep' | 'recovery';
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
  onNavigate?: (path: string) => void;
  onStartWorkout?: () => void;
  className?: string;
}

export const PersonalizedWidgets: React.FC<PersonalizedWidgetsProps> = ({
  smartReminders,
  personalizedExercises,
  userProfile,
  currentStreak = 0,
  weeklyGoals = {
    workouts: { current: 3, target: 5 },
    nutrition: { current: 4, target: 7 },
    hydration: { current: 6, target: 7 }
  },
  upcomingEvents = [],
  achievements = [],
  onNavigate,
  onStartWorkout,
  className = '',
}) => {

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Star className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Rappels intelligents */}
      {smartReminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Recommandations personnalisées</span>
          </h3>
          
          <div className="space-y-3">
            {smartReminders.map((reminder) => {
              const IconComponent = reminder.icon;
              return (
                <Card 
                  key={reminder.id}
                  className={`border-l-4 ${getPriorityColor(reminder.priority)} hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => reminder.path && onNavigate?.(reminder.path)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 rounded-lg bg-white">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{reminder.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {reminder.content}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(reminder.priority)}
                        {reminder.action && (
                          <Button size="sm" variant="ghost" className="h-6 text-xs">
                            {reminder.action}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Entraînement recommandé */}
      {personalizedExercises.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-4 w-4 text-red-500" />
                <span>Ton workout du jour</span>
              </div>
              <Button size="sm" onClick={onStartWorkout}>
                <Play className="h-3 w-3 mr-1" />
                Démarrer
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {personalizedExercises.slice(0, 4).map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{exercise.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {exercise.sets} x {exercise.reps} • {exercise.duration}s
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {exercise.difficulty}
                  </Badge>
                </div>
              ))}
              
              {personalizedExercises.length > 4 && (
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onNavigate?.('/workout')}>
                  Voir tous les exercices ({personalizedExercises.length})
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Objectifs de la semaine */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>Objectifs hebdomadaires</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            
            {/* Entraînements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-3 w-3" />
                  <span>Workouts</span>
                </div>
                <span className="font-medium">
                  {weeklyGoals.workouts.current}/{weeklyGoals.workouts.target}
                </span>
              </div>
              <Progress 
                value={(weeklyGoals.workouts.current / weeklyGoals.workouts.target) * 100} 
                className="h-2"
              />
            </div>

            {/* Nutrition */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Apple className="h-3 w-3" />
                  <span>Nutrition</span>
                </div>
                <span className="font-medium">
                  {weeklyGoals.nutrition.current}/{weeklyGoals.nutrition.target}
                </span>
              </div>
              <Progress 
                value={(weeklyGoals.nutrition.current / weeklyGoals.nutrition.target) * 100} 
                className="h-2"
              />
            </div>

            {/* Hydratation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-3 w-3" />
                  <span>Hydratation</span>
                </div>
                <span className="font-medium">
                  {weeklyGoals.hydration.current}/{weeklyGoals.hydration.target}
                </span>
              </div>
              <Progress 
                value={(weeklyGoals.hydration.current / weeklyGoals.hydration.target) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Série en cours */}
      {currentStreak > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Série en cours</h4>
                  <p className="text-xs text-muted-foreground">
                    {currentStreak} jour{currentStreak > 1 ? 's' : ''} consécutif{currentStreak > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-orange-500">
                🔥 {currentStreak}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Événements à venir */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>À venir</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => {
                const getEventIcon = () => {
                  switch (event.type) {
                    case 'workout': return <Dumbbell className="h-3 w-3" />;
                    case 'nutrition': return <Apple className="h-3 w-3" />;
                    case 'sleep': return <Moon className="h-3 w-3" />;
                    case 'recovery': return <Heart className="h-3 w-3" />;
                  }
                };
                
                return (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getEventIcon()}
                      <div>
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.date.toLocaleDateString('fr-FR', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Derniers succès */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Derniers succès</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.unlockedAt.toLocaleDateString('fr-FR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              ))}
              
              {achievements.length > 2 && (
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onNavigate?.('/achievements')}>
                  Voir tous les succès
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widget motivationnel */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl">💪</div>
            <h4 className="font-semibold text-sm">
              {(() => {
                const firstName = userProfile?.username?.split(' ')[0] || 'Champion';
                const motivations = [
                  `${firstName}, tu es sur la bonne voie !`,
                  `Chaque pas compte, ${firstName} !`,
                  `Continue comme ça, ${firstName} !`,
                  `Tu progresses chaque jour, ${firstName} !`
                ];
                return motivations[Math.floor(Math.random() * motivations.length)];
              })()}
            </h4>
            <p className="text-xs text-muted-foreground">
              Tes efforts d'aujourd'hui sont les résultats de demain
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedWidgets;