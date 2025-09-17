import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Dumbbell, Activity, Apple, Droplets, Moon, Users, Zap, Target, TrendingUp } from 'lucide-react';
import { featureGradients } from '../../../shared/theme';
import { useAuth } from '../../auth/hooks/useAuth';
import { useLocation } from 'wouter';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const stats = {
    workoutsThisWeek: 4,
    totalWorkouts: 127,
    caloriesBurned: 2450,
    sleepAverage: 7.2,
    waterIntake: 1.8,
    waterGoal: 2.5,
  };

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
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-white to-blue-50 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Tableau de bord
                  </h2>
                  <p className="text-xl text-gray-600">
                    Suivez vos progrès et atteignez vos objectifs
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {stats.workoutsThisWeek}
                  </div>
                  <p className="text-gray-600 font-medium">Entraînements cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 mr-3">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Entraînements</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalWorkouts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 mr-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Calories</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.caloriesBurned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-3">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hydratation</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.waterIntake}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mr-3">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Sommeil</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.sleepAverage}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="workouts">Entraînements</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Votre progression cette semaine</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Entraînements</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Historique de vos entraînements</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Suivi nutritionnel</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connectez-vous avec d'autres athlètes</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
