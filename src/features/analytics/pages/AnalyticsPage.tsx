import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/core/auth/auth.store';

interface AnalyticsData {
  workouts: {
    total: number;
    thisWeek: number;
    trend: number;
  };
  nutrition: {
    caloriesGoal: number;
    caloriesConsumed: number;
    trend: number;
  };
  sleep: {
    averageHours: number;
    goalHours: number;
    trend: number;
  };
  consistency: {
    score: number;
    streak: number;
  };
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    // Placeholder - remplacer par vraie logique
    const mockData: AnalyticsData = {
      workouts: {
        total: 24,
        thisWeek: 4,
        trend: 12
      },
      nutrition: {
        caloriesGoal: 2200,
        caloriesConsumed: 2050,
        trend: 5
      },
      sleep: {
        averageHours: 7.2,
        goalHours: 8,
        trend: -8
      },
      consistency: {
        score: 85,
        streak: 7
      }
    };
    setAnalyticsData(mockData);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (!analyticsData) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <p className="text-gray-600">Analysez vos progrès et tendances</p>
        
        <div className="flex space-x-2 mt-4">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              onClick={() => setTimeframe(period)}
              className="capitalize"
            >
              {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Entraînements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Entraînements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analyticsData.workouts.thisWeek}</div>
                <div className="text-sm text-gray-600">cette semaine</div>
              </div>
              <div className={`flex items-center ${getTrendColor(analyticsData.workouts.trend)}`}>
                {getTrendIcon(analyticsData.workouts.trend)}
                <span className="ml-1 text-sm">
                  {analyticsData.workouts.trend > 0 ? '+' : ''}{analyticsData.workouts.trend}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{analyticsData.nutrition.caloriesConsumed}</span>
                <span className="text-sm text-gray-600">/ {analyticsData.nutrition.caloriesGoal}</span>
              </div>
              <Progress 
                value={(analyticsData.nutrition.caloriesConsumed / analyticsData.nutrition.caloriesGoal) * 100} 
                className="h-2" 
              />
              <div className={`flex items-center justify-end ${getTrendColor(analyticsData.nutrition.trend)}`}>
                {getTrendIcon(analyticsData.nutrition.trend)}
                <span className="ml-1 text-sm">
                  {analyticsData.nutrition.trend > 0 ? '+' : ''}{analyticsData.nutrition.trend}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sommeil */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sommeil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{analyticsData.sleep.averageHours}h</span>
                <span className="text-sm text-gray-600">/ {analyticsData.sleep.goalHours}h</span>
              </div>
              <Progress 
                value={(analyticsData.sleep.averageHours / analyticsData.sleep.goalHours) * 100} 
                className="h-2" 
              />
              <div className={`flex items-center justify-end ${getTrendColor(analyticsData.sleep.trend)}`}>
                {getTrendIcon(analyticsData.sleep.trend)}
                <span className="ml-1 text-sm">
                  {analyticsData.sleep.trend > 0 ? '+' : ''}{analyticsData.sleep.trend}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consistance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Consistance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{analyticsData.consistency.score}%</div>
              <div className="text-sm text-gray-600">
                Streak: {analyticsData.consistency.streak} jours
              </div>
              <Progress value={analyticsData.consistency.score} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques détaillés */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progression des entraînements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Graphique à implémenter</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Musculation</span>
                <div className="flex items-center space-x-2">
                  <Progress value={65} className="w-20 h-2" />
                  <span className="text-sm">65%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Cardio</span>
                <div className="flex items-center space-x-2">
                  <Progress value={25} className="w-20 h-2" />
                  <span className="text-sm">25%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Yoga/Étirements</span>
                <div className="flex items-center space-x-2">
                  <Progress value={10} className="w-20 h-2" />
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Objectifs et recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Objectifs de la semaine</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm">4 séances d'entraînement</span>
                    <span className="text-sm text-blue-600">4/4 ✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">56h de sommeil</span>
                    <span className="text-sm text-yellow-600">50/56</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Calories équilibrées</span>
                    <span className="text-sm text-green-600">6/7 ✓</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Recommandations AI</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="text-sm">Augmentez légèrement l'intensité de vos entraînements cardio</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-sm">Essayez de vous coucher 30 min plus tôt pour atteindre vos objectifs de sommeil</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-sm">Excellente consistance ! Continuez sur cette lancée</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;