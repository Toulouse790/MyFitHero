import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Activity, Apple, Droplets, Moon, Users, Zap, Target, TrendingUp, Calendar } from 'lucide-react';
import { featureGradients, featureColors } from '../../../shared/theme';

interface DashboardProps {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    sport?: string;
    level?: string;
    goals?: string[];
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    workoutsThisWeek: 4,
    totalWorkouts: 127,
    caloriesBurned: 2450,
    sleepAverage: 7.2,
    waterIntake: 1.8, // Litres d'eau aujourd'hui
    waterGoal: 2.5,   // Objectif quotidien
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header moderne avec gradient */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="text-white w-6 h-6" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">MyFitHero</h1>
                <p className="text-blue-100 text-sm">Votre coach personnel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-white font-semibold">
                  Bonjour, {user.firstName || 'Champion'} ! 💪
                </p>
                <p className="text-blue-100 text-sm">Prêt à conquérir cette journée ?</p>
              </div>
              <Button 
                onClick={onLogout} 
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
        {/* Hero Section */}
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
                  <div className="flex items-center mt-4 space-x-4">
                    <Badge className="bg-green-500 text-white px-3 py-1 rounded-full">
                      <Target className="w-4 h-4 mr-1" />
                      En forme !
                    </Badge>
                    <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Progression +15%
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Activity className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-medium"
            >
              <Activity className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="sport" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-medium"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Sport
            </TabsTrigger>
            <TabsTrigger 
              value="nutrition" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-medium"
            >
              <Apple className="w-4 h-4 mr-2" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger 
              value="hydration" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-medium"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Hydratation
            </TabsTrigger>
            <TabsTrigger 
              value="wellness" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium"
            >
              <Moon className="w-4 h-4 mr-2" />
              Bien-être
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards Modernes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Séances cette semaine</CardTitle>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.workoutsThisWeek}</div>
                  <p className="text-sm text-white/80 flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2 par rapport à la semaine dernière
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Total séances</CardTitle>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
                  <p className="text-sm text-white/80 flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    Depuis le début
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Calories brûlées</CardTitle>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.caloriesBurned}</div>
                  <p className="text-sm text-white/80 flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Cette semaine
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Sommeil moyen</CardTitle>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.sleepAverage}h</div>
                  <p className="text-sm text-white/80 flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    Les 7 derniers jours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Modules d'action modernes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Entraînement</CardTitle>
                  <CardDescription className="text-gray-600">
                    Commencez votre séance d'entraînement
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl h-12">
                    Démarrer
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Nutrition</CardTitle>
                  <CardDescription className="text-gray-600">
                    Suivez votre alimentation quotidienne
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl h-12">
                    Gérer
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Hydratation</CardTitle>
                  <CardDescription className="text-gray-600">
                    Suivez votre consommation d'eau
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl h-12">
                    Enregistrer
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Bien-être</CardTitle>
                  <CardDescription className="text-gray-600">
                    Suivi du sommeil et récupération
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl h-12">
                    Analyser
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sport" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Entraînements</CardTitle>
                  <CardDescription className="text-orange-100">
                    Gérez vos séances d'entraînement
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl h-12">
                    Commencer un entraînement
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-800">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Séances cette semaine</span>
                      <span className="font-bold text-orange-500">{stats.workoutsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total séances</span>
                      <span className="font-bold text-orange-500">{stats.totalWorkouts}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-gray-500 text-center">75% de votre objectif mensuel</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <Apple className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Nutrition</CardTitle>
                  <CardDescription className="text-green-100">
                    Suivez votre alimentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl h-12">
                    Ajouter un repas
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-800">Objectifs du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Calories</span>
                      <span className="font-bold text-green-500">1850 / 2200</span>
                    </div>
                    <Progress value={84} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Protéines</p>
                        <p className="font-bold text-green-500">65g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Glucides</p>
                        <p className="font-bold text-green-500">220g</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lipides</p>
                        <p className="font-bold text-green-500">78g</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hydration" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <Droplets className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Hydratation</CardTitle>
                  <CardDescription className="text-blue-100">
                    Suivez votre consommation d'eau
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl h-12">
                    Ajouter de l'eau
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-800">Objectif du jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Eau consommée</span>
                      <span className="font-bold text-blue-500">1.8L / 2.5L</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Dernière prise</p>
                        <p className="font-bold text-blue-500">Il y a 45min</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reste</p>
                        <p className="font-bold text-blue-500">0.7L</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <Moon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Bien-être</CardTitle>
                  <CardDescription className="text-purple-100">
                    Sommeil et récupération
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl h-12">
                    Analyser le sommeil
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-800">Sommeil cette semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Moyenne</span>
                      <span className="font-bold text-purple-500">{stats.sleepAverage}h</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Qualité</p>
                        <p className="font-bold text-purple-500">Excellente</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Récupération</p>
                        <p className="font-bold text-purple-500">92%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
