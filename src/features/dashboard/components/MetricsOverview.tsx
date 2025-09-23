import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Heart,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface MetricsOverviewProps {
  metrics: DashboardMetrics;
  lastWeekMetrics?: Partial<DashboardMetrics>;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ 
  metrics, 
  lastWeekMetrics 
}) => {
  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendPercentage = (current: number, previous?: number) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const scoreCards = [
    {
      title: 'Score Fitness',
      value: metrics.fitnessScore,
      icon: <Target className="w-5 h-5" />,
      description: 'Performance globale',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Récupération',
      value: metrics.recoveryScore,
      icon: <Heart className="w-5 h-5" />,
      description: 'Capacité de récupération',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Nutrition',
      value: metrics.nutritionScore,
      icon: <Zap className="w-5 h-5" />,
      description: 'Qualité nutritionnelle',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Consistance',
      value: metrics.consistencyScore,
      icon: <Brain className="w-5 h-5" />,
      description: 'Régularité des efforts',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const statsCards = [
    {
      title: 'Entraînements',
      current: metrics.weeklyWorkouts,
      total: metrics.totalWorkouts,
      previous: lastWeekMetrics?.weeklyWorkouts,
      unit: 'cette semaine',
      icon: '🏋️'
    },
    {
      title: 'Calories',
      current: metrics.weeklyCalories,
      total: metrics.totalCalories,
      previous: lastWeekMetrics?.weeklyCalories,
      unit: 'kcal',
      icon: '🔥'
    },
    {
      title: 'Série',
      current: metrics.streakDays,
      total: metrics.streakDays,
      previous: lastWeekMetrics?.streakDays,
      unit: 'jours',
      icon: '⚡'
    },
    {
      title: 'Objectifs',
      current: metrics.completedGoals,
      total: metrics.completedGoals,
      previous: lastWeekMetrics?.completedGoals,
      unit: 'atteints',
      icon: '🎯'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Scores Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Scores IA Premium
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Intelligence Artificielle
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {scoreCards.map((card) => (
              <div key={card.title} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  {/* Custom circular progress */}
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke={getScoreColor(card.value)}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(card.value / 100) * 201.06} 201.06`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold" style={{ color: getScoreColor(card.value) }}>
                        {card.value}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r ${card.gradient} text-white mb-2`}>
                  {card.icon}
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                {getTrendIcon(stat.current, stat.previous)}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.current.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.unit}
                  </p>
                </div>
                
                {stat.previous && (
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${
                      stat.current > stat.previous 
                        ? 'text-green-600' 
                        : stat.current < stat.previous 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {getTrendPercentage(stat.current, stat.previous) > 0 ? '+' : ''}
                      {getTrendPercentage(stat.current, stat.previous)}%
                    </span>
                    <span className="text-xs text-gray-500">vs semaine dernière</span>
                  </div>
                )}
                
                {stat.title === 'Entraînements' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Total</span>
                      <span>{stat.total}</span>
                    </div>
                    <Progress 
                      value={(stat.current / 7) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Progression Globale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progrès Hebdomadaire
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {metrics.weeklyProgress}%
                </span>
              </div>
              <Progress value={metrics.weeklyProgress} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">
                Excellent ! Vous dépassez vos objectifs
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progrès Mensuel
                </span>
                <span className="text-sm font-bold text-green-600">
                  {metrics.monthlyProgress}%
                </span>
              </div>
              <Progress value={metrics.monthlyProgress} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">
                Progression constante ce mois-ci
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;