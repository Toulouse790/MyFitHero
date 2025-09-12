import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Progress } from '../../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Badge } from '../../../../components/ui/badge';

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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MFH</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                MyFitHero
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Bonjour, {user.firstName || user.email}
              </span>
              <Button onClick={onLogout} variant="outline" size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tableau de bord
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="sport">Sport</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="wellness">Bien-être</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Séances cette semaine</CardTitle>
                  <span className="text-2xl">🏋️</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.workoutsThisWeek}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    +2 par rapport à la semaine dernière
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total séances</CardTitle>
                  <span className="text-2xl">📊</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Depuis le début
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories brûlées</CardTitle>
                  <span className="text-2xl">🔥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.caloriesBurned}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Cette semaine
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sommeil moyen</CardTitle>
                  <span className="text-2xl">😴</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.sleepAverage}h</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Les 7 derniers jours
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Module Sport</CardTitle>
                <CardDescription>
                  Planifiez et suivez vos entraînements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  Modules sport, nutrition et bien-être en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Sport</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Module sport en développement...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Module nutrition en développement...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Bien-être</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Module bien-être en développement...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
