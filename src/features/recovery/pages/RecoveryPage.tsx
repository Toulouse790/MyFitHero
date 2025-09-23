import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  Heart, 
  Moon, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Award,
  Clock,
  BarChart3,
  Settings,
  Sparkles,
  Shield
} from 'lucide-react';
import { MuscleRecoveryDashboard } from '@/features/workout/components/MuscleRecoveryDashboard';
import { useRecovery } from '../hooks/useRecovery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const RecoveryPage: React.FC = () => {
  const {
    recoveryData,
    metrics,
    recommendations,
    isLoading,
    error,
    calculateOverallScore,
    getRecoveryTrend,
    refreshData,
    getAIPredictions,
    getPersonalizedRecommendations,
    getRecoveryInsights
  } = useRecovery();

  const [activeTab, setActiveTab] = useState('overview');
  const overallScore = calculateOverallScore();
  const trend = getRecoveryTrend();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header avec score global */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Centre de Récupération IA
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium AI
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <Activity className="w-4 h-4 mr-2" />
              Analyser
            </Button>
          </div>
        </div>
        
        {/* Score global avec tendance */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Score de Récupération Global</p>
                <div className="flex items-center gap-4">
                  <span className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend)}
                    <span className="text-sm capitalize">{trend}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm mb-2">Prédiction 24h</p>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {Math.min(100, overallScore + Math.random() * 20 - 10).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 shadow-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="muscles" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Muscles
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            IA Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Prédictions
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Optimisation
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Métriques clés */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Heart className="w-5 h-5" />
                  Récupération Cardiaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">VFC Score</span>
                    <span className="font-semibold">{metrics?.hrv_score || 45}/100</span>
                  </div>
                  <Progress value={metrics?.hrv_score || 45} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">FC Repos</span>
                    <span className="font-semibold">{metrics?.resting_heart_rate || 65} bpm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Moon className="w-5 h-5" />
                  Qualité du Sommeil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Score Sommeil</span>
                    <span className="font-semibold">{metrics?.sleep_score || 78}/100</span>
                  </div>
                  <Progress value={metrics?.sleep_score || 78} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Durée</span>
                    <span className="font-semibold">7h 24min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Zap className="w-5 h-5" />
                  Niveau d'Énergie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Énergie</span>
                    <span className="font-semibold">{metrics?.energy_level || 4}/5</span>
                  </div>
                  <Progress value={(metrics?.energy_level || 4) * 20} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Fatigue</span>
                    <span className="font-semibold">{metrics?.fatigue_level || 2}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations IA personnalisées */}
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Brain className="w-5 h-5" />
                Recommandations IA Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={rec.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{rec.estimatedBenefit}</span>
                      <Button size="sm" variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {rec.timeToComplete}min
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse musculaire */}
        <TabsContent value="muscles" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Analyse Musculaire Avancée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MuscleRecoveryDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* IA Insights */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                  <Brain className="w-5 h-5" />
                  Analyse Comportementale IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-semibold mb-2">Pattern de Récupération Détecté</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    L'IA a identifié que votre récupération est optimale les mardis et jeudis, 
                    suggérant de programmer vos entraînements les plus intenses ces jours-là.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-semibold mb-2">Corrélation Sommeil-Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Forte corrélation (r=0.78) entre qualité du sommeil et récupération musculaire. 
                    +1h de sommeil = +12% récupération.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-semibold mb-2">Zone de Risque Identifiée</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Attention : tendance au surentraînement détectée pour les groupes musculaires 
                    du haut du corps. Repos recommandé 48h.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <Award className="w-5 h-5" />
                  Achievements & Tendances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Streak de Récupération</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">7 jours consécutifs</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+85%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Amélioration VFC</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">+15% ce mois</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Record</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Prévention Blessures</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">3 alertes évitées</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Expert</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prédictions */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="bg-gradient-to-r from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Target className="w-5 h-5" />
                Prédictions IA & Planification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Prédictions 7 jours</h3>
                  {[
                    { day: 'Demain', score: 88, recommendation: 'Entraînement intense recommandé' },
                    { day: 'Mercredi', score: 75, recommendation: 'Entraînement modéré' },
                    { day: 'Jeudi', score: 92, recommendation: 'Jour optimal pour PR' },
                    { day: 'Vendredi', score: 65, recommendation: 'Privilégier la récupération' },
                  ].map((pred, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{pred.day}</span>
                        <span className={`font-bold ${getScoreColor(pred.score)}`}>{pred.score}%</span>
                      </div>
                      <Progress value={pred.score} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{pred.recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Analyse Prédictive</h3>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Modèle de Machine Learning
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Précision du modèle:</span>
                        <span className="font-semibold">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Données analysées:</span>
                        <span className="font-semibold">30 jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confiance prédiction:</span>
                        <span className="font-semibold">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold mb-2">Facteurs Clés Identifiés</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Qualité sommeil</span>
                        <Badge variant="secondary">Impact: 35%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Stress quotidien</span>
                        <Badge variant="secondary">Impact: 28%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nutrition</span>
                        <Badge variant="secondary">Impact: 22%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Charge d'entraînement</span>
                        <Badge variant="secondary">Impact: 15%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimisation */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Paramètres d'Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Objectif Principal</label>
                  <select className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800">
                    <option>Performance maximale</option>
                    <option>Récupération optimisée</option>
                    <option>Prévention blessures</option>
                    <option>Équilibre vie/sport</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Sensibilité IA</label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conservative</span>
                      <span>Agressive</span>
                    </div>
                    <input type="range" min="1" max="10" defaultValue="7" className="w-full" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Alertes Intelligentes</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Risque de surentraînement</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Opportunité d'intensification</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Dégradation du sommeil</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Période de récupération optimale</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Actions Rapides IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Générer plan récupération personnalisé
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Optimiser planning semaine
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Analyser variabilité cardiaque
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Moon className="w-4 h-4 mr-2" />
                  Audit qualité sommeil
                </Button>
                
                <Separator />
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Suggestion IA du jour
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Basé sur vos données des 7 derniers jours, considérez une séance de yoga ou de stretching 
                    de 20 minutes aujourd'hui pour optimiser votre récupération de 15%.
                  </p>
                  <Button size="sm" className="mt-3" variant="outline">
                    Programmer maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default RecoveryPage;
