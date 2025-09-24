import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Activity, 
  Apple, 
  Droplets, 
  Moon, 
  Users, 
  Zap, 
  Target, 
  TrendingUp,
  RefreshCw,
  Sparkles,
  Brain,
  BarChart3
} from 'lucide-react';
import { featureGradients } from '@/shared/theme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLocation } from 'wouter';
import { useDashboard } from '../hooks/useDashboard';
import MetricsOverview from '../components/MetricsOverview';
import SmartInsightsWidget from '../components/SmartInsightsWidget';
import PersonalizedGoals from '../components/PersonalizedGoals';
import { SmartInsight, PersonalizedGoal } from '../types';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Hook dashboard premium avec IA
  const {
    metrics,
    insights,
    goals,
    weeklyTrends,
    achievements,
    isLoading,
    error,
    refreshData,
    markInsightAsRead,
    completeGoal,
    lastUpdated
  } = useDashboard();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleInsightAction = (insight: SmartInsight) => {
    if (insight.actionUrl) {
      setLocation(insight.actionUrl);
    }
    markInsightAsRead(insight.id);
  };

  const handleViewGoal = (goal: PersonalizedGoal) => {
    // Navigate to goal details or open modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Analyse IA en cours...</p>
          <p className="text-sm text-gray-500">Calcul de vos métriques personnalisées</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="text-white w-6 h-6" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">MyFitHero</h1>
                <p className="text-blue-100 text-sm">
                  Bienvenue {user?.first_name || user?.username || 'Champion'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-white font-semibold">
                  Bonjour, {user?.first_name || user?.username || 'Champion'} ! 💪
                </p>
                <p className="text-blue-100 text-sm">Prêt à conquérir cette journée ?</p>
              </div>
              
              <Button
                onClick={refreshData}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm mr-2"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualiser
              </Button>
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-white to-blue-50 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Dashboard Premium IA
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">
                    Analytics intelligents et insights personnalisés
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <Brain className="w-3 h-3 mr-1" />
                      Intelligence Artificielle
                    </Badge>
                    <Badge variant="outline">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Série de {metrics.streakDays} jours
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Dernière mise à jour: {new Date(lastUpdated).toLocaleTimeString('fr-FR')}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {metrics.weeklyWorkouts}
                  </div>
                  <p className="text-gray-600 font-medium">Entraînements cette semaine</p>
                  <div className="mt-2">
                    <Badge variant={metrics.weeklyProgress >= 80 ? "default" : "secondary"}>
                      {metrics.weeklyProgress}% de progression
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Dashboard Content */}
        <div className="space-y-8">
          {/* Metrics Overview avec scores IA */}
          <MetricsOverview metrics={metrics} />

          {/* Smart Insights + Goals Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SmartInsightsWidget
              insights={insights}
              onInsightAction={handleInsightAction}
              onDismissInsight={markInsightAsRead}
            />
            
            <PersonalizedGoals
              goals={goals}
              onCompleteGoal={completeGoal}
              onViewGoal={handleViewGoal}
            />
          </div>

          {/* Detailed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="workouts">Entraînements</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Vue d'ensemble Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <h3 className="font-semibold text-blue-800 mb-2">Tendance de la semaine</h3>
                      <p className="text-2xl font-bold text-blue-600">+{metrics.weeklyProgress}%</p>
                      <p className="text-sm text-blue-600">Performance en hausse</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <h3 className="font-semibold text-green-800 mb-2">Score Fitness Global</h3>
                      <p className="text-2xl font-bold text-green-600">{metrics.fitnessScore}/100</p>
                      <p className="text-sm text-green-600">Excellent niveau</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <h3 className="font-semibold text-purple-800 mb-2">Objectifs atteints</h3>
                      <p className="text-2xl font-bold text-purple-600">{metrics.completedGoals}</p>
                      <p className="text-sm text-purple-600">Ce mois-ci</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workouts">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                    Entraînements Intelligents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Analytics avancés de vos entraînements avec recommandations IA
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span>Total entraînements</span>
                      <span className="font-bold">{metrics.totalWorkouts}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span>Calories brûlées (semaine)</span>
                      <span className="font-bold">{metrics.weeklyCalories.toLocaleString()} kcal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-green-600" />
                    Nutrition Optimisée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Suivi nutritionnel intelligent avec score IA: {metrics.nutritionScore}/100
                  </p>
                  <Progress value={metrics.nutritionScore} className="mb-4" />
                  <p className="text-sm text-gray-500">
                    Analyse basée sur vos objectifs et performances
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Analytics Premium IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Score Fitness</h4>
                      <p className="text-2xl font-bold text-blue-600">{metrics.fitnessScore}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Récupération</h4>
                      <p className="text-2xl font-bold text-green-600">{metrics.recoveryScore}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Nutrition</h4>
                      <p className="text-2xl font-bold text-orange-600">{metrics.nutritionScore}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Consistance</h4>
                      <p className="text-2xl font-bold text-purple-600">{metrics.consistencyScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
