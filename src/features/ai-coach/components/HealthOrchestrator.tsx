import React, { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  BarChart3,
  Eye,
  Sparkles,
  Shield,
  Award,
  Clock,
  Flame,
  Settings,
  RefreshCw,
  ArrowRight,
  Star,
  Lightbulb,
  Users
} from 'lucide-react';
import { 
  HealthData, 
  HealthAnalysis, 
  HealthTrackingState, 
  WeeklyHealthSummary,
  HealthGoals,
  PillarStatus
} from '@/features/ai-coach/types/health-orchestrator';
import { 
  dbToHealthData, 
  healthDataToDb, 
  calculateGlobalHealthScore, 
  generateCrossPillarInsights,
  calculatePerformanceMetrics,
  evaluateHealthRisks,
  generatePredictiveMetrics
} from '@/features/ai-coach/utils/health-orchestrator-mapping';

// Types pour le state machine React
interface HealthOrchestratorState {
  currentState: HealthTrackingState;
  healthData: HealthData | null;
  healthAnalysis: HealthAnalysis | null;
  weeklySummary: WeeklyHealthSummary | null;
  healthGoals: HealthGoals | null;
  pillarStatuses: PillarStatus[];
  historicalData: HealthData[];
  isLoading: boolean;
  error: string | null;
  showDetailedAnalysis: boolean;
  selectedTimeframe: 'today' | 'week' | 'month' | 'quarter';
  globalHealthScore: number;
  pillarScores: {
    fitness: number;
    nutrition: number;
    recovery: number;
    hydration: number;
  };
  balanceScore: number;
  riskLevel: string;
  lastSyncTime: Date | null;
}

type HealthOrchestratorAction =
  | { type: 'SET_STATE'; payload: HealthTrackingState }
  | { type: 'SET_HEALTH_DATA'; payload: HealthData }
  | { type: 'SET_ANALYSIS'; payload: HealthAnalysis }
  | { type: 'SET_WEEKLY_SUMMARY'; payload: WeeklyHealthSummary }
  | { type: 'SET_GOALS'; payload: HealthGoals }
  | { type: 'SET_PILLAR_STATUSES'; payload: PillarStatus[] }
  | { type: 'SET_HISTORICAL_DATA'; payload: HealthData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_DETAILED_ANALYSIS' }
  | { type: 'SET_TIMEFRAME'; payload: 'today' | 'week' | 'month' | 'quarter' }
  | { type: 'UPDATE_SCORES'; payload: { global: number; pillars: any; balance: number; risk: string } }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'RESET_STATE' };

const initialHealthOrchestratorState: HealthOrchestratorState = {
  currentState: 'idle',
  healthData: null,
  healthAnalysis: null,
  weeklySummary: null,
  healthGoals: null,
  pillarStatuses: [],
  historicalData: [],
  isLoading: false,
  error: null,
  showDetailedAnalysis: false,
  selectedTimeframe: 'today',
  globalHealthScore: 0,
  pillarScores: {
    fitness: 0,
    nutrition: 0,
    recovery: 0,
    hydration: 0,
  },
  balanceScore: 0,
  riskLevel: 'low',
  lastSyncTime: null,
};

function healthOrchestratorReducer(state: HealthOrchestratorState, action: HealthOrchestratorAction): HealthOrchestratorState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload };
    case 'SET_HEALTH_DATA':
      return { ...state, healthData: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, healthAnalysis: action.payload };
    case 'SET_WEEKLY_SUMMARY':
      return { ...state, weeklySummary: action.payload };
    case 'SET_GOALS':
      return { ...state, healthGoals: action.payload };
    case 'SET_PILLAR_STATUSES':
      return { ...state, pillarStatuses: action.payload };
    case 'SET_HISTORICAL_DATA':
      return { ...state, historicalData: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_DETAILED_ANALYSIS':
      return { ...state, showDetailedAnalysis: !state.showDetailedAnalysis };
    case 'SET_TIMEFRAME':
      return { ...state, selectedTimeframe: action.payload };
    case 'UPDATE_SCORES':
      return { 
        ...state, 
        globalHealthScore: action.payload.global,
        pillarScores: action.payload.pillars,
        balanceScore: action.payload.balance,
        riskLevel: action.payload.risk 
      };
    case 'SET_LAST_SYNC':
      return { ...state, lastSyncTime: action.payload };
    case 'RESET_STATE':
      return initialHealthOrchestratorState;
    default:
      return state;
  }
}

export const HealthOrchestrator: React.FC = () => {
  const [state, dispatch] = useReducer(healthOrchestratorReducer, initialHealthOrchestratorState);
  const [userId, setUserId] = useState<string | null>(null);

  // Gestion de l'authentification
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await syncAllPillarsData(user.id);
      }
    };
    getUser();
  }, []);

  // Synchronisation de toutes les données des piliers
  const syncAllPillarsData = async (userIdParam: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_STATE', payload: 'syncing_pillars' });

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Chargement parallèle de toutes les données des piliers
      const [workoutData, nutritionData, sleepData, hydrationData] = await Promise.allSettled([
        fetchWorkoutData(userIdParam, today),
        fetchNutritionData(userIdParam, today),
        fetchSleepData(userIdParam, today),
        fetchHydrationData(userIdParam, today),
      ]);

      // Agrégation des données
      const healthData: HealthData = {
        id: `health_${Date.now()}`,
        userId: userIdParam,
        date: today,
        workoutData: workoutData.status === 'fulfilled' ? workoutData.value : undefined,
        nutritionData: nutritionData.status === 'fulfilled' ? nutritionData.value : undefined,
        sleepData: sleepData.status === 'fulfilled' ? sleepData.value : undefined,
        hydrationData: hydrationData.status === 'fulfilled' ? hydrationData.value : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'SET_HEALTH_DATA', payload: healthData });
      
      // Mise à jour des statuts des piliers
      const pillarStatuses = calculatePillarStatuses(healthData);
      dispatch({ type: 'SET_PILLAR_STATUSES', payload: pillarStatuses });

      // Analyse IA globale
      await performGlobalAnalysis(healthData);
      
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
      dispatch({ type: 'SET_STATE', payload: 'idle' });
    } catch (error) {
      console.error('Erreur synchronisation piliers:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la synchronisation des données' });
      dispatch({ type: 'SET_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Analyse IA globale sophistiquée
  const performGlobalAnalysis = async (healthData: HealthData) => {
    dispatch({ type: 'SET_STATE', payload: 'analyzing_health' });

    try {
      // Calcul du score global
      const globalHealthScore = calculateGlobalHealthScore(healthData);
      
      // Génération des insights cross-piliers
      const aiInsights = generateCrossPillarInsights(healthData);
      
      // Calcul des métriques de performance
      const performanceMetrics = calculatePerformanceMetrics(healthData);
      
      // Évaluation des risques
      const healthRisks = evaluateHealthRisks(healthData);
      
      // Prédictions
      const predictiveMetrics = generatePredictiveMetrics(healthData, state.historicalData);
      
      // Métriques d'équilibre
      const pillarScores = {
        fitness: healthData.workoutData?.workoutScore || 0,
        nutrition: healthData.nutritionData?.nutritionScore || 0,
        recovery: healthData.sleepData?.sleepQuality || 0,
        hydration: healthData.hydrationData?.hydrationScore || 0,
      };
      
      const balanceScore = calculatePillarBalance(pillarScores);

      // Création de l'analyse complète
      const analysis: HealthAnalysis = {
        id: `analysis_${healthData.id}`,
        userId: healthData.userId,
        healthDataId: healthData.id,
        analysisDate: new Date(),
        globalHealthScore,
        pillarScores,
        balanceMetrics: {
          pillarHarmony: balanceScore,
          consistencyScore: 75, // Nécessiterait historique complet
          synergisticEffect: calculateSynergyEffect(healthData),
          weakestLink: findWeakestPillar(pillarScores),
          strongestPillar: findStrongestPillar(pillarScores),
        },
        performanceMetrics,
        healthRisks,
        aiInsights,
        predictiveMetrics,
        crossPillarCorrelations: calculateCrossPillarCorrelations(healthData),
        optimizationSuggestions: generateOptimizationSuggestions(healthData),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      dispatch({ type: 'UPDATE_SCORES', payload: { 
        global: globalHealthScore,
        pillars: pillarScores,
        balance: balanceScore,
        risk: healthRisks.overallRiskLevel 
      }});

      // Sauvegarde en base
      await saveHealthAnalysis(healthData, analysis);
      
    } catch (error) {
      console.error('Erreur analyse globale:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'analyse globale' });
    }
  };

  // Sauvegarde des données et analyses
  const saveHealthAnalysis = async (healthData: HealthData, analysis: HealthAnalysis) => {
    try {
      // Sauvegarde données santé
      const dbHealthData = healthDataToDb(healthData);
      const { error: healthError } = await supabase
        .from('health_data')
        .upsert(dbHealthData);

      if (healthError) throw healthError;

      // Sauvegarde analyse
      const { error: analysisError } = await supabase
        .from('health_analysis')
        .upsert({
          id: analysis.id,
          user_id: analysis.userId,
          health_data_id: analysis.healthDataId,
          analysis_date: analysis.analysisDate.toISOString(),
          global_health_score: analysis.globalHealthScore,
          fitness_score: analysis.pillarScores.fitness,
          nutrition_score: analysis.pillarScores.nutrition,
          recovery_score: analysis.pillarScores.recovery,
          hydration_score: analysis.pillarScores.hydration,
          balance_harmony_score: analysis.balanceMetrics.pillarHarmony,
          consistency_score: analysis.balanceMetrics.consistencyScore,
          synergistic_effect_score: analysis.balanceMetrics.synergisticEffect,
          risk_level: analysis.healthRisks.overallRiskLevel,
          health_ai_analysis: {
            balanceMetrics: analysis.balanceMetrics,
            performanceMetrics: analysis.performanceMetrics,
            healthRisks: analysis.healthRisks,
            aiInsights: analysis.aiInsights,
            predictiveMetrics: analysis.predictiveMetrics,
            crossPillarCorrelations: analysis.crossPillarCorrelations,
            optimizationSuggestions: analysis.optimizationSuggestions,
          }
        });

      if (analysisError) throw analysisError;
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  // Rendu du composant principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec score global */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Health Orchestrator AI
            </h1>
          </div>

          {/* Score global et badge de santé */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 relative overflow-hidden"
            >
              {/* Effet de particules de fond */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -100, y: Math.random() * 400 }}
                    animate={{ x: 500, y: Math.random() * 400 }}
                    transition={{ duration: 8, repeat: Infinity, delay: i * 1.5 }}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-white mb-2">
                    {state.globalHealthScore}/100
                  </div>
                  <div className="text-xl text-white/80 mb-4">
                    Score Santé Global
                  </div>
                  <Badge 
                    className={`text-lg px-4 py-2 ${getHealthScoreBadgeColor(state.globalHealthScore)}`}
                  >
                    {getHealthScoreLabel(state.globalHealthScore)}
                  </Badge>
                </div>
                
                {/* Barre de progression circulaire */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/20"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 350" }}
                        animate={{ strokeDasharray: `${state.globalHealthScore * 3.5} 350` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Dernière synchronisation */}
                <div className="text-center text-white/60 text-sm">
                  Dernière mise à jour: {state.lastSyncTime?.toLocaleTimeString('fr-FR') || 'Jamais'}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scores des piliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {Object.entries(state.pillarScores).map(([pillar, score], index) => {
            const pillarIcons = {
              fitness: Activity,
              nutrition: Heart,
              recovery: Clock,
              hydration: Zap,
            };
            const pillarColors = {
              fitness: 'from-red-500 to-orange-500',
              nutrition: 'from-green-500 to-emerald-500',
              recovery: 'from-purple-500 to-pink-500',
              hydration: 'from-blue-500 to-cyan-500',
            };
            const Icon = pillarIcons[pillar as keyof typeof pillarIcons];
            
            return (
              <motion.div
                key={pillar}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-gradient-to-r ${pillarColors[pillar as keyof typeof pillarColors]} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 font-medium capitalize">{pillar}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {score}/100
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`bg-gradient-to-r ${pillarColors[pillar as keyof typeof pillarColors]} h-2 rounded-full`}
                  />
                </div>
                <div className="mt-2 text-xs text-white/60">
                  {getPillarStatusText(score)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interface principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Analyse et insights */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Analyse IA */}
            {state.healthAnalysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse IA Cross-Piliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Métriques de performance */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Performance Physique</div>
                        <div className="text-xl font-bold text-white">
                          {state.healthAnalysis.performanceMetrics.physicalPerformance}/100
                        </div>
                        <Activity className="w-4 h-4 text-red-400 mx-auto mt-1" />
                      </div>
                      
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Performance Mentale</div>
                        <div className="text-xl font-bold text-white">
                          {state.healthAnalysis.performanceMetrics.mentalPerformance}/100
                        </div>
                        <Brain className="w-4 h-4 text-purple-400 mx-auto mt-1" />
                      </div>
                      
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Niveau d'énergie</div>
                        <div className="text-xl font-bold text-white">
                          {state.healthAnalysis.performanceMetrics.energyLevel}/100
                        </div>
                        <Zap className="w-4 h-4 text-yellow-400 mx-auto mt-1" />
                      </div>
                    </div>

                    {/* Équilibre des piliers */}
                    <div className="space-y-3">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Équilibre des piliers ({state.balanceScore}/100)
                      </h4>
                      <div className="relative">
                        <div className="w-full bg-white/20 rounded-full h-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${state.balanceScore}%` }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                          </motion.div>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-sm text-white/70">
                            {state.balanceScore >= 80 ? 'Excellent équilibre' :
                             state.balanceScore >= 60 ? 'Bon équilibre' :
                             state.balanceScore >= 40 ? 'Équilibre moyen' : 'Déséquilibre à corriger'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommandations cross-piliers */}
                    {state.healthAnalysis.aiInsights.crossPillarRecommendations.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-blue-300 font-medium flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Recommandations cross-piliers
                        </h5>
                        <div className="space-y-1">
                          {state.healthAnalysis.aiInsights.crossPillarRecommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <ArrowRight className="w-3 h-3 text-blue-400" />
                              {recommendation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prédictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Probabilité d'atteinte des objectifs</div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-400" />
                          <span className="text-white font-medium">
                            {state.healthAnalysis.predictiveMetrics.goalAchievementProbability}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Risque de burnout</div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-400" />
                          <span className="text-white font-medium">
                            {state.healthAnalysis.predictiveMetrics.burnoutRisk}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Insights et stratégie personnalisée */}
            {state.healthAnalysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Stratégie personnalisée IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Forces clés */}
                    {state.healthAnalysis.aiInsights.keyStrengths.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-green-300 font-medium flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Vos forces
                        </h5>
                        <div className="space-y-1">
                          {state.healthAnalysis.aiInsights.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {strength}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Priorités d'amélioration */}
                    {state.healthAnalysis.aiInsights.improvementPriorities.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-orange-300 font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Priorités d'amélioration
                        </h5>
                        <div className="space-y-1">
                          {state.healthAnalysis.aiInsights.improvementPriorities.map((priority, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <AlertTriangle className="w-3 h-3 text-orange-400" />
                              {priority}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stratégie personnalisée */}
                    {state.healthAnalysis.aiInsights.personalizedStrategy.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-purple-300 font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Votre plan d'action
                        </h5>
                        <div className="space-y-1">
                          {state.healthAnalysis.aiInsights.personalizedStrategy.map((strategy, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <Star className="w-3 h-3 text-purple-400" />
                              {strategy}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Colonne droite - Actions et statuts */}
          <div className="space-y-6">
            
            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  <Button 
                    onClick={() => userId && syncAllPillarsData(userId)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    disabled={state.isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
                    Synchroniser tous les piliers
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => dispatch({ type: 'TOGGLE_DETAILED_ANALYSIS' })}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {state.showDetailedAnalysis ? 'Masquer' : 'Afficher'} l'analyse détaillée
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Définir objectifs santé
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Objectifs de santé personnalisés</DialogTitle>
                      </DialogHeader>
                      <HealthGoalsForm />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Statut des piliers */}
            {state.pillarStatuses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Statut des piliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {state.pillarStatuses.map((pillar, index) => {
                      const statusColors = {
                        excellent: 'text-green-400 bg-green-500/20',
                        good: 'text-blue-400 bg-blue-500/20',
                        fair: 'text-yellow-400 bg-yellow-500/20',
                        poor: 'text-orange-400 bg-orange-500/20',
                        critical: 'text-red-400 bg-red-500/20',
                      };
                      
                      const trendIcons = {
                        improving: TrendingUp,
                        stable: BarChart3,
                        declining: TrendingDown,
                      };
                      
                      const TrendIcon = trendIcons[pillar.trend];
                      
                      return (
                        <motion.div
                          key={pillar.name}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="text-sm text-white font-medium capitalize">
                              {pillar.name}
                            </div>
                            <div className="text-xs text-white/70">
                              Mis à jour: {pillar.lastUpdated.toLocaleTimeString('fr-FR')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`${statusColors[pillar.status]} border-current`}
                            >
                              {pillar.score}/100
                            </Badge>
                            <TrendIcon className={`w-4 h-4 ${
                              pillar.trend === 'improving' ? 'text-green-400' :
                              pillar.trend === 'stable' ? 'text-blue-400' : 'text-red-400'
                            }`} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Alertes santé */}
            {state.healthAnalysis?.healthRisks?.urgentConcerns && state.healthAnalysis.healthRisks.urgentConcerns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Alertes santé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {state.healthAnalysis?.healthRisks?.urgentConcerns?.map((concern, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-red-200">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        {concern}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* État de chargement global */}
        <AnimatePresence>
          {state.isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                <div className="text-white font-medium">
                  {state.currentState === 'syncing_pillars' && 'Synchronisation des piliers...'}
                  {state.currentState === 'analyzing_health' && 'Analyse IA globale...'}
                  {state.currentState === 'generating_insights' && 'Génération des insights...'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Erreurs */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Erreur</span>
              </div>
              <div className="text-sm mt-1">{state.error}</div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10 mt-2"
                onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              >
                Fermer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composant formulaire d'objectifs
const HealthGoalsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    targetGlobalScore: 85,
    pillarPriorities: {
      fitness: 'high' as const,
      nutrition: 'high' as const,
      recovery: 'medium' as const,
      hydration: 'medium' as const,
    },
    timeFrame: 'monthly' as const,
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Score santé cible: {formData.targetGlobalScore}/100
        </label>
        <input
          type="range"
          min="60"
          max="100"
          value={formData.targetGlobalScore}
          onChange={(e) => setFormData({ ...formData, targetGlobalScore: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">Priorités par pilier</label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.pillarPriorities).map(([pillar, priority]) => (
            <div key={pillar}>
              <label className="block text-xs text-white/70 mb-1 capitalize">{pillar}</label>
              <select
                value={priority}
                onChange={(e) => setFormData({
                  ...formData,
                  pillarPriorities: {
                    ...formData.pillarPriorities,
                    [pillar]: e.target.value as any
                  }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      
      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
        <Target className="w-4 h-4 mr-2" />
        Définir les objectifs
      </Button>
    </div>
  );
};

// Fonctions utilitaires
async function fetchWorkoutData(userId: string, date: string) {
  // Simulation - en réalité, on ferait appel aux données workout
  return {
    totalWorkouts: 1,
    totalDuration: 60,
    avgIntensity: 75,
    workoutScore: 80,
    recoveryScore: 75,
    strengthProgress: 78,
    cardioProgress: 82,
  };
}

async function fetchNutritionData(userId: string, date: string) {
  // Simulation - en réalité, on ferait appel aux données nutrition
  return {
    totalCalories: 2200,
    proteinGrams: 120,
    carbsGrams: 250,
    fatGrams: 80,
    nutritionScore: 85,
    hydrationScore: 80,
    mealQuality: 88,
  };
}

async function fetchSleepData(userId: string, date: string) {
  // Simulation - en réalité, on ferait appel aux données sleep
  return {
    sleepDuration: 480,
    sleepEfficiency: 85,
    sleepQuality: 82,
    recoveryScore: 78,
    circadianAlignment: 80,
  };
}

async function fetchHydrationData(userId: string, date: string) {
  // Simulation - en réalité, on ferait appel aux données hydration
  return {
    totalIntake: 2500,
    dailyGoal: 2500,
    hydrationScore: 90,
    efficiencyScore: 85,
    dehydrationRisk: 'optimal' as const,
  };
}

function calculatePillarStatuses(healthData: HealthData): PillarStatus[] {
  return [
    {
      name: 'fitness',
      score: healthData.workoutData?.workoutScore || 0,
      status: getStatusFromScore(healthData.workoutData?.workoutScore || 0),
      lastUpdated: new Date(),
      trend: 'stable',
      dataPoints: 7,
    },
    {
      name: 'nutrition',
      score: healthData.nutritionData?.nutritionScore || 0,
      status: getStatusFromScore(healthData.nutritionData?.nutritionScore || 0),
      lastUpdated: new Date(),
      trend: 'improving',
      dataPoints: 7,
    },
    {
      name: 'recovery',
      score: healthData.sleepData?.sleepQuality || 0,
      status: getStatusFromScore(healthData.sleepData?.sleepQuality || 0),
      lastUpdated: new Date(),
      trend: 'stable',
      dataPoints: 7,
    },
    {
      name: 'hydration',
      score: healthData.hydrationData?.hydrationScore || 0,
      status: getStatusFromScore(healthData.hydrationData?.hydrationScore || 0),
      lastUpdated: new Date(),
      trend: 'improving',
      dataPoints: 7,
    },
  ];
}

function getStatusFromScore(score: number): PillarStatus['status'] {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'critical';
}

function getHealthScoreBadgeColor(score: number): string {
  if (score >= 90) return 'bg-green-500 text-white';
  if (score >= 75) return 'bg-blue-500 text-white';
  if (score >= 60) return 'bg-yellow-500 text-white';
  if (score >= 40) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
}

function getHealthScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Très bon';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'À améliorer';
}

function getPillarStatusText(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Bon';
  if (score >= 55) return 'Moyen';
  if (score >= 40) return 'Faible';
  return 'Critique';
}

function calculatePillarBalance(scores: Record<string, number>): number {
  const values = Object.values(scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  return Math.max(0, Math.round(100 - (standardDeviation * 2)));
}

function calculateSynergyEffect(healthData: HealthData): number {
  // Calcul de l'effet synergique entre les piliers
  let synergyScore = 70; // Base
  
  const workoutScore = healthData.workoutData?.workoutScore || 0;
  const nutritionScore = healthData.nutritionData?.nutritionScore || 0;
  const recoveryScore = healthData.sleepData?.recoveryScore || 0;
  const hydrationScore = healthData.hydrationData?.hydrationScore || 0;

  // Bonus pour les synergies
  if (workoutScore >= 80 && nutritionScore >= 80) synergyScore += 10;
  if (recoveryScore >= 80 && workoutScore >= 70) synergyScore += 8;
  if (hydrationScore >= 80 && recoveryScore >= 70) synergyScore += 6;
  if (nutritionScore >= 80 && recoveryScore >= 80) synergyScore += 6;
  
  return Math.min(100, synergyScore);
}

function findWeakestPillar(scores: Record<string, number>): 'fitness' | 'nutrition' | 'recovery' | 'hydration' {
  const entries = Object.entries(scores);
  const weakest = entries.reduce((min, current) => 
    current[1] < min[1] ? current : min
  );
  return weakest[0] as 'fitness' | 'nutrition' | 'recovery' | 'hydration';
}

function findStrongestPillar(scores: Record<string, number>): 'fitness' | 'nutrition' | 'recovery' | 'hydration' {
  const entries = Object.entries(scores);
  const strongest = entries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );
  return strongest[0] as 'fitness' | 'nutrition' | 'recovery' | 'hydration';
}

function calculateCrossPillarCorrelations(healthData: HealthData) {
  // Corrélations simplifiées pour démo
  return {
    workoutNutritionCorr: 75,
    sleepPerformanceCorr: 80,
    hydrationRecoveryCorr: 70,
    nutritionSleepCorr: 65,
  };
}

function generateOptimizationSuggestions(healthData: HealthData) {
  return {
    workoutTiming: ['Entraînez-vous 2-3h avant le coucher pour optimiser la récupération'],
    nutritionTiming: ['Consommez des protéines dans les 30min post-entraînement'],
    sleepOptimization: ['Maintenez une température de 18-20°C dans votre chambre'],
    hydrationStrategy: ['Buvez 500ml au réveil, hydratez-vous toutes les 2h'],
    recoveryProtocol: ['Intégrez 10min de méditation avant le coucher'],
  };
}

export default HealthOrchestrator;