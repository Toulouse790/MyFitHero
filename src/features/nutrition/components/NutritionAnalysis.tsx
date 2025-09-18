// src/features/nutrition/components/NutritionAnalysis.tsx
import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart3, PieChart, Target, Award } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface WeeklyData {
  day: string;
  calories: number;
  goal: number;
}

interface NutritionAnalysisProps {
  weeklyData: WeeklyData[];
  monthlyProgress: {
    totalDays: number;
    goalsMet: number;
    avgCalories: number;
    avgGoal: number;
  };
  sportEmoji: string;
  selectedSport: string;
}

export const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({
  weeklyData,
  monthlyProgress,
  sportEmoji,
  selectedSport,
}) => {
  const [activeTab, setActiveTab] = useState('weekly');

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getMotivationMessage = (percentage: number) => {
    if (percentage >= 90) return "🏆 Performance exceptionnelle !";
    if (percentage >= 75) return "💪 Très bon suivi !";
    if (percentage >= 50) return "📈 Progrès encourageants";
    return "🎯 Continuez vos efforts";
  };

  const weeklyAverage = weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length;
  const weeklyGoalAverage = weeklyData.reduce((sum, day) => sum + day.goal, 0) / weeklyData.length;
  const weeklyPercentage = (weeklyAverage / weeklyGoalAverage) * 100;

  const monthlyPercentage = (monthlyProgress.goalsMet / monthlyProgress.totalDays) * 100;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span>Analyse Nutritionnelle</span>
          </h3>
          <span className="text-2xl">{sportEmoji}</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Semaine</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Mois</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-700">
                  {Math.round(weeklyAverage)} kcal
                </div>
                <div className="text-purple-600 text-sm">Moyenne hebdomadaire</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getProgressColor(weeklyPercentage)}`}>
                  {Math.round(weeklyPercentage)}% de l'objectif
                </div>
              </div>
              
              <div className="space-y-3">
                {weeklyData.map((day, index) => {
                  const percentage = (day.calories / day.goal) * 100;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium text-gray-700">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                      </div>
                      <div className="w-20 text-right text-sm text-gray-600">
                        {day.calories}/{day.goal}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {monthlyProgress.goalsMet}
                </div>
                <div className="text-green-600 text-sm">Objectifs atteints</div>
                <div className="text-xs text-green-500 mt-1">
                  sur {monthlyProgress.totalDays} jours
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(monthlyPercentage)}%
                </div>
                <div className="text-blue-600 text-sm">Taux de réussite</div>
                <div className="text-xs text-blue-500 mt-1">
                  {getMotivationMessage(monthlyPercentage)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Statistiques du mois</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories moyennes/jour :</span>
                  <span className="font-medium">{Math.round(monthlyProgress.avgCalories)} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Objectif moyen/jour :</span>
                  <span className="font-medium">{Math.round(monthlyProgress.avgGoal)} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Écart moyen :</span>
                  <span className={`font-medium ${monthlyProgress.avgCalories >= monthlyProgress.avgGoal ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(monthlyProgress.avgCalories - monthlyProgress.avgGoal)} kcal
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Recommandations personnalisées</span>
                </h4>
                <div className="space-y-2 text-sm text-orange-800">
                  <p>• Votre régularité s'améliore : +15% ce mois-ci</p>
                  <p>• Optimisez vos apports en protéines après l'entraînement</p>
                  <p>• Hydratation excellente les jours d'entraînement</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                  <span>{sportEmoji}</span>
                  <span>Adaptation {selectedSport}</span>
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Vos besoins énergétiques sont bien couverts</p>
                  <p>• Timing des repas optimal pour la performance</p>
                  <p>• Récupération nutritionnelle adaptée à votre sport</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
                  <span>🏆</span>
                  <span>Prochains objectifs</span>
                </h4>
                <div className="space-y-2 text-sm text-green-800">
                  <p>• Maintenir cette régularité pendant 2 semaines</p>
                  <p>• Tester de nouvelles recettes post-entraînement</p>
                  <p>• Affiner le timing des collations</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysis;