// src/features/analytics/components/DashboardStats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dumbbell,
  Apple,
  Droplets,
  Moon,
  Flame,
  Heart,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Activity,
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';
import { DailyStats } from '../../../shared/types/dashboard';

interface StatCard {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  description?: string;
  actionPath?: string;
}

interface DashboardStatsProps {
  dailyStats: DailyStats | null;
  isLoading?: boolean;
  personalizedWorkout: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  dailyStats,
  isLoading = false,
  personalizedWorkout,
  onNavigate,
  className = '',
}) => {
  
  // Configuration des cartes de statistiques
  const getStatsCards = (): StatCard[] => {
    if (!dailyStats) return [];

    return [
      {
        id: 'workout',
        title: 'Entraînements',
        value: dailyStats.workouts_completed || 0,
        target: 1,
        unit: 'séance',
        icon: Dumbbell,
        color: 'text-red-500',
        trend: {
          value: 15,
          isPositive: true,
          period: 'cette semaine'
        },
        description: (dailyStats.workouts_completed ?? 0) > 0 ? 'Objectif atteint !' : personalizedWorkout,
        actionPath: '/workout'
      },
      {
        id: 'calories',
        title: 'Calories',
        value: dailyStats.total_calories || 0,
        target: 2200,
        unit: 'kcal',
        icon: Flame,
        color: 'text-orange-500',
        trend: {
          value: 8,
          isPositive: false,
          period: 'vs hier'
        },
        description: 'Équilibre énergétique',
        actionPath: '/nutrition'
      },
      {
        id: 'hydration',
        title: 'Hydratation',
        value: dailyStats.water_intake_ml || 0,
        target: dailyStats.hydration_goal_ml || 2500,
        unit: 'ml',
        icon: Droplets,
        color: 'text-blue-500',
        trend: {
          value: 12,
          isPositive: true,
          period: 'objectif quotidien'
        },
        description: 'Bon niveau d\'hydratation',
        actionPath: '/hydration'
      },
      {
        id: 'sleep',
        title: 'Sommeil',
        value: dailyStats.sleep_hours || 0,
        target: 8,
        unit: 'h',
        icon: Moon,
        color: 'text-purple-500',
        trend: {
          value: 5,
          isPositive: true,
          period: 'qualité'
        },
        description: 'Récupération optimale',
        actionPath: '/sleep'
      },
      {
        id: 'steps',
        title: 'Pas',
        value: dailyStats.steps_count || 0,
        target: 10000,
        unit: 'pas',
        icon: Activity,
        color: 'text-green-500',
        trend: {
          value: 3,
          isPositive: false,
          period: 'vs objectif'
        },
        description: 'Activité quotidienne',
        actionPath: '/activity'
      },
      {
        id: 'heart_rate',
        title: 'Rythme cardiaque',
        value: 72, // Mock data
        target: 75,
        unit: 'bpm',
        icon: Heart,
        color: 'text-pink-500',
        trend: {
          value: 2,
          isPositive: true,
          period: 'au repos'
        },
        description: 'Fréquence de repos',
        actionPath: '/health'
      }
    ];
  };

  const statsCards = getStatsCards();

  const getProgressPercentage = (value: number, target: number): number => {
    return target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (value: number, target: number) => {
    const percentage = getProgressPercentage(value, target);
    if (percentage >= 100) return <Badge className="bg-green-500">Objectif atteint</Badge>;
    if (percentage >= 75) return <Badge variant="secondary">En bonne voie</Badge>;
    if (percentage >= 50) return <Badge variant="outline">À mi-parcours</Badge>;
    return <Badge variant="destructive">Besoin d'effort</Badge>;
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Titre de section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Statistiques du jour</span>
        </h2>
        <Button variant="outline" size="sm" onClick={() => onNavigate?.('/analytics')}>
          Voir tout
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Grille des cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const IconComponent = stat.icon;
          const percentage = getProgressPercentage(stat.value, stat.target);
          
          return (
            <Card 
              key={stat.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => stat.actionPath && onNavigate?.(stat.actionPath)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    <span>{stat.title}</span>
                  </div>
                  {stat.trend && (
                    <div className="flex items-center space-x-1 text-xs">
                      {stat.trend.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                        {stat.trend.value}%
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  
                  {/* Valeur principale */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold">{stat.value.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/ {stat.target.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{stat.unit}</span>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {percentage}%
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      {getStatusBadge(stat.value, stat.target)}
                      {stat.trend && (
                        <span className="text-xs text-muted-foreground">
                          {stat.trend.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {stat.description && (
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé rapide */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center space-x-2">
                <Award className="h-4 w-4 text-primary" />
                <span>Performance du jour</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  const completedGoals = statsCards.filter(stat => 
                    getProgressPercentage(stat.value, stat.target) >= 100
                  ).length;
                  const totalGoals = statsCards.length;
                  const percentage = Math.round((completedGoals / totalGoals) * 100);
                  
                  if (percentage >= 80) return 'Excellente journée ! Tu domines tes objectifs 🔥';
                  if (percentage >= 60) return 'Bonne progression ! Continue comme ça 💪';
                  if (percentage >= 40) return 'Tu es sur la bonne voie ! 👍';
                  return 'Il est encore temps de rattraper ! 💫';
                })()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {statsCards.filter(stat => 
                  getProgressPercentage(stat.value, stat.target) >= 100
                ).length}/{statsCards.length}
              </div>
              <div className="text-xs text-muted-foreground">
                objectifs atteints
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;