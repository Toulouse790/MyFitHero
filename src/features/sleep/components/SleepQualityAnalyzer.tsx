import React, { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { 
  Moon, 
  Sun, 
  Clock, 
  Brain, 
  Heart, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Target,
  Calendar,
  BarChart3,
  Activity,
  BedDouble,
  Timer,
  Lightbulb,
  Settings
} from 'lucide-react';
import { 
  SleepData, 
  SleepAnalysis, 
  SleepTrackingState, 
  WeeklySleepSummary,
  SleepGoals
} from '../types';
import { 
  dbToSleepData, 
  sleepDataToDb, 
  calculateSleepScores, 
  generateSleepAIInsights 
} from '../utils/sleep-mapping';

// Types pour le state machine React
interface SleepState {
  currentState: SleepTrackingState;
  sleepData: SleepData | null;
  sleepAnalysis: SleepAnalysis | null;
  weeklySummary: WeeklySleepSummary | null;
  sleepGoals: SleepGoals | null;
  recentNights: SleepData[];
  isLoading: boolean;
  error: string | null;
  showInsights: boolean;
  selectedDate: string;
  sleepScore: number;
  recoveryScore: number;
  circadianRhythm: number;
}

type SleepAction =
  | { type: 'SET_STATE'; payload: SleepTrackingState }
  | { type: 'SET_SLEEP_DATA'; payload: SleepData }
  | { type: 'SET_ANALYSIS'; payload: SleepAnalysis }
  | { type: 'SET_WEEKLY_SUMMARY'; payload: WeeklySleepSummary }
  | { type: 'SET_GOALS'; payload: SleepGoals }
  | { type: 'SET_RECENT_NIGHTS'; payload: SleepData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_INSIGHTS' }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'UPDATE_SCORES'; payload: { sleep: number; recovery: number; circadian: number } }
  | { type: 'RESET_STATE' };

const initialSleepState: SleepState = {
  currentState: 'idle',
  sleepData: null,
  sleepAnalysis: null,
  weeklySummary: null,
  sleepGoals: null,
  recentNights: [],
  isLoading: false,
  error: null,
  showInsights: false,
  selectedDate: new Date().toISOString().split('T')[0],
  sleepScore: 0,
  recoveryScore: 0,
  circadianRhythm: 0,
};

function sleepReducer(state: SleepState, action: SleepAction): SleepState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload };
    case 'SET_SLEEP_DATA':
      return { ...state, sleepData: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, sleepAnalysis: action.payload };
    case 'SET_WEEKLY_SUMMARY':
      return { ...state, weeklySummary: action.payload };
    case 'SET_GOALS':
      return { ...state, sleepGoals: action.payload };
    case 'SET_RECENT_NIGHTS':
      return { ...state, recentNights: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_INSIGHTS':
      return { ...state, showInsights: !state.showInsights };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'UPDATE_SCORES':
      return { 
        ...state, 
        sleepScore: action.payload.sleep,
        recoveryScore: action.payload.recovery,
        circadianRhythm: action.payload.circadian 
      };
    case 'RESET_STATE':
      return initialSleepState;
    default:
      return state;
  }
}

export const SleepQualityAnalyzer: React.FC = () => {
  const [state, dispatch] = useReducer(sleepReducer, initialSleepState);
  const [userId, setUserId] = useState<string | null>(null);

  // Gestion de l'authentification
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadSleepData(user.id);
      }
    };
    getUser();
  }, []);

  // Chargement des données de sommeil
  const loadSleepData = async (userIdParam: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_STATE', payload: 'syncing_data' });

    try {
      // Chargement des données récentes
      const { data: recentSleepData, error: sleepError } = await supabase
        .from('sleep_data')
        .select('*')
        .eq('user_id', userIdParam)
        .order('sleep_date', { ascending: false })
        .limit(7);

      if (sleepError) throw sleepError;

      const recentNights = recentSleepData?.map(dbToSleepData) || [];
      dispatch({ type: 'SET_RECENT_NIGHTS', payload: recentNights });

      // Données du jour sélectionné
      const todayData = recentNights.find(night => 
        night.sleepDate === state.selectedDate
      );

      if (todayData) {
        dispatch({ type: 'SET_SLEEP_DATA', payload: todayData });
        await analyzeSleepData(todayData);
      }

      // Chargement des objectifs
      const { data: goalsData } = await supabase
        .from('sleep_goals')
        .select('*')
        .eq('user_id', userIdParam)
        .single();

      if (goalsData) {
        dispatch({ type: 'SET_GOALS', payload: goalsData });
      }

      dispatch({ type: 'SET_STATE', payload: 'idle' });
    } catch (error) {
      console.error('Erreur chargement données sommeil:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' });
      dispatch({ type: 'SET_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Analyse IA du sommeil
  const analyzeSleepData = async (sleepData: SleepData) => {
    dispatch({ type: 'SET_STATE', payload: 'analyzing_sleep' });

    try {
      // Calcul des scores
      const sleepScores = calculateSleepScores(sleepData);
      const aiInsights = generateSleepAIInsights(sleepData, sleepScores);

      // Création de l'analyse complète
      const analysis: SleepAnalysis = {
        id: `analysis_${sleepData.id}`,
        userId: sleepData.userId,
        sleepDataId: sleepData.id,
        analysisDate: new Date(),
        sleepScores,
        sleepPhases: {
          optimalDeepSleep: sleepData.sleepStages.deepSleep >= sleepData.sleepDuration * 0.15,
          remQuality: (sleepData.sleepStages.remSleep / sleepData.sleepDuration) * 100 * 4,
          sleepCycleCompleteness: calculateSleepCycleCompleteness(sleepData),
          wakefulnessPattern: sleepData.nightAwakenings > 3 ? 'fragmented' : 'normal',
        },
        circadianMetrics: {
          chronotype: 'intermediate', // Simplifiée pour démo
          optimalBedtime: calculateOptimalBedtime(sleepData),
          optimalWakeTime: calculateOptimalWakeTime(sleepData),
          lightExposureRecommendation: 'Exposition lumière naturelle le matin',
          mealTimingImpact: 'neutral',
        },
        recoveryMetrics: {
          physicalRecovery: sleepScores.recoveryScore,
          mentalRecovery: sleepScores.overallQuality,
          emotionalRecovery: mapMoodToScore(sleepData.morningMood),
          autonomicRecovery: sleepData.heartRateVariability?.avgHrv ? 
            calculateHRVScore(sleepData.heartRateVariability.avgHrv) : 70,
        },
        aiInsights,
        predictiveMetrics: {
          tomorrowEnergyPrediction: sleepScores.restorationIndex,
          recoveryTimeEstimate: calculateRecoveryTime(sleepScores),
          performanceImpact: sleepScores.overallQuality > 80 ? 'minimal' : 
                             sleepScores.overallQuality > 60 ? 'moderate' : 'significant',
          optimalWorkoutTiming: generateOptimalWorkoutTiming(sleepData),
        },
        trends: {
          weeklyPattern: 'stable', // Nécessite historique
          seasonalFactors: [],
          stressImpact: 100 - sleepScores.overallQuality,
          workoutCorrelation: 0, // Nécessite corrélation avec données workout
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      dispatch({ type: 'UPDATE_SCORES', payload: { 
        sleep: sleepScores.overallQuality,
        recovery: sleepScores.recoveryScore,
        circadian: sleepScores.circadianAlignment 
      }});

      // Sauvegarde en base
      await saveSleepAnalysis(analysis);
      
    } catch (error) {
      console.error('Erreur analyse sommeil:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'analyse' });
    }
  };

  // Sauvegarde de l'analyse
  const saveSleepAnalysis = async (analysis: SleepAnalysis) => {
    try {
      const { error } = await supabase
        .from('sleep_analysis')
        .upsert({
          id: analysis.id,
          user_id: analysis.userId,
          sleep_data_id: analysis.sleepDataId,
          analysis_date: analysis.analysisDate.toISOString(),
          overall_quality_score: analysis.sleepScores.overallQuality,
          recovery_score: analysis.sleepScores.recoveryScore,
          sleep_debt_minutes: analysis.sleepScores.sleepDebt,
          circadian_alignment_score: analysis.sleepScores.circadianAlignment,
          sleep_consistency_score: analysis.sleepScores.sleepConsistency,
          restoration_index: analysis.sleepScores.restorationIndex,
          sleep_ai_analysis: {
            sleepPhases: analysis.sleepPhases,
            circadianMetrics: analysis.circadianMetrics,
            recoveryMetrics: analysis.recoveryMetrics,
            aiInsights: analysis.aiInsights,
            predictiveMetrics: analysis.predictiveMetrics,
            trends: analysis.trends,
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur sauvegarde analyse:', error);
    }
  };

  // Enregistrement nouveau sommeil
  const logNewSleep = async (newSleepData: Partial<SleepData>) => {
    if (!userId) return;

    dispatch({ type: 'SET_STATE', payload: 'logging_sleep' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const sleepData: SleepData = {
        id: `sleep_${Date.now()}`,
        userId,
        sleepDate: state.selectedDate,
        bedtime: newSleepData.bedtime || new Date(),
        wakeTime: newSleepData.wakeTime || new Date(),
        sleepDuration: newSleepData.sleepDuration || 480,
        sleepLatency: newSleepData.sleepLatency || 15,
        nightAwakenings: newSleepData.nightAwakenings || 1,
        timeAwakeDuringNight: newSleepData.timeAwakeDuringNight || 10,
        sleepEfficiency: newSleepData.sleepEfficiency || 85,
        sleepStages: newSleepData.sleepStages || {
          lightSleep: 240,
          deepSleep: 120,
          remSleep: 120,
          awakeTime: 20,
        },
        heartRateVariability: newSleepData.heartRateVariability,
        environmentalFactors: newSleepData.environmentalFactors || {
          roomTemperature: 20,
          noiseLevel: 'quiet',
          lightExposure: 'dark',
          mattressComfort: 8,
        },
        preSleepActivities: newSleepData.preSleepActivities || {
          screenTime: 30,
          caffeine: false,
          alcohol: false,
          exercise: false,
          meditation: false,
          reading: true,
        },
        sleepQuality: newSleepData.sleepQuality || 'good',
        morningMood: newSleepData.morningMood || 'good',
        energyLevel: newSleepData.energyLevel || 7,
        notes: newSleepData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Sauvegarde en base
      const dbData = sleepDataToDb(sleepData);
      const { error } = await supabase
        .from('sleep_data')
        .upsert(dbData);

      if (error) throw error;

      dispatch({ type: 'SET_SLEEP_DATA', payload: sleepData });
      await analyzeSleepData(sleepData);
      await loadSleepData(userId); // Rechargement complet

      dispatch({ type: 'SET_STATE', payload: 'idle' });
    } catch (error) {
      console.error('Erreur enregistrement sommeil:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'enregistrement' });
      dispatch({ type: 'SET_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Rendu du composant principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec scores principaux */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sleep Quality Analyzer
            </h1>
          </div>

          {/* Scores principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <BedDouble className="w-6 h-6 text-blue-400" />
                <span className="text-white/80 font-medium">Score Sommeil</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {state.sleepScore}/100
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.sleepScore}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-green-400" />
                <span className="text-white/80 font-medium">Récupération</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {state.recoveryScore}/100
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.recoveryScore}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-orange-400" />
                <span className="text-white/80 font-medium">Rythme Circadien</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {state.circadianRhythm}/100
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.circadianRhythm}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Interface principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Données actuelles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Données de sommeil */}
            {state.sleepData && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Nuit du {new Date(state.sleepData.sleepDate).toLocaleDateString('fr-FR')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Métriques principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Timer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-sm text-white/70">Durée</div>
                        <div className="text-lg font-bold text-white">
                          {Math.floor(state.sleepData.sleepDuration / 60)}h{state.sleepData.sleepDuration % 60}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Activity className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-sm text-white/70">Efficacité</div>
                        <div className="text-lg font-bold text-white">
                          {state.sleepData.sleepEfficiency}%
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Moon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-sm text-white/70">Endormissement</div>
                        <div className="text-lg font-bold text-white">
                          {state.sleepData.sleepLatency}min
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Brain className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                        <div className="text-sm text-white/70">Réveils</div>
                        <div className="text-lg font-bold text-white">
                          {state.sleepData.nightAwakenings}
                        </div>
                      </div>
                    </div>

                    {/* Phases de sommeil */}
                    <div className="space-y-3">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Phases de sommeil
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(state.sleepData.sleepStages).map(([phase, minutes]) => {
                          const percentage = (minutes / state.sleepData!.sleepDuration) * 100;
                          const colors = {
                            lightSleep: 'bg-blue-500',
                            deepSleep: 'bg-purple-600',
                            remSleep: 'bg-pink-500',
                            awakeTime: 'bg-red-500'
                          };
                          const labels = {
                            lightSleep: 'Sommeil léger',
                            deepSleep: 'Sommeil profond',
                            remSleep: 'Sommeil REM',
                            awakeTime: 'Éveil'
                          };
                          return (
                            <div key={phase} className="flex items-center gap-3">
                              <div className="w-24 text-xs text-white/70">
                                {labels[phase as keyof typeof labels]}
                              </div>
                              <div className="flex-1 bg-white/10 rounded-full h-3">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={`${colors[phase as keyof typeof colors]} h-3 rounded-full`}
                                />
                              </div>
                              <div className="w-16 text-xs text-white text-right">
                                {minutes}min ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Insights IA */}
            {state.sleepAnalysis && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse IA du sommeil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Problèmes identifiés */}
                    {state.sleepAnalysis.aiInsights.primaryIssues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-orange-300 font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Points d'attention
                        </h5>
                        <div className="space-y-1">
                          {state.sleepAnalysis.aiInsights.primaryIssues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <div className="w-1 h-1 bg-orange-400 rounded-full" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions d'amélioration */}
                    {state.sleepAnalysis.aiInsights.improvementSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-blue-300 font-medium flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Suggestions d'amélioration
                        </h5>
                        <div className="space-y-1">
                          {state.sleepAnalysis.aiInsights.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <CheckCircle className="w-3 h-3 text-blue-400" />
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prédictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Énergie prévue demain</div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-medium">
                            {state.sleepAnalysis.predictiveMetrics.tomorrowEnergyPrediction}/100
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Temps de récupération</div>
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-green-400" />
                          <span className="text-white font-medium">
                            {state.sleepAnalysis.predictiveMetrics.recoveryTimeEstimate}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Colonne droite - Actions et historique */}
          <div className="space-y-6">
            
            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        disabled={state.isLoading}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Enregistrer nouveau sommeil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Enregistrer votre nuit</DialogTitle>
                      </DialogHeader>
                      <SleepLoggingForm onSubmit={logNewSleep} />
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => dispatch({ type: 'TOGGLE_INSIGHTS' })}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {state.showInsights ? 'Masquer' : 'Afficher'} les insights
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => userId && loadSleepData(userId)}
                    disabled={state.isLoading}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Actualiser les données
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Historique récent */}
            {state.recentNights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Historique (7 derniers jours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {state.recentNights.slice(0, 7).map((night, index) => {
                      const qualityColor = {
                        excellent: 'text-green-400',
                        good: 'text-blue-400',
                        fair: 'text-yellow-400',
                        poor: 'text-red-400'
                      };
                      
                      return (
                        <motion.div
                          key={night.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: night.sleepDate })}
                        >
                          <div className="space-y-1">
                            <div className="text-sm text-white font-medium">
                              {new Date(night.sleepDate).toLocaleDateString('fr-FR', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs text-white/70">
                              {Math.floor(night.sleepDuration / 60)}h{night.sleepDuration % 60}
                            </div>
                          </div>
                          <Badge 
                            className={`${qualityColor[night.sleepQuality]} bg-transparent border-current`}
                          >
                            {night.sleepQuality}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* État de chargement */}
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
                  {state.currentState === 'analyzing_sleep' && 'Analyse IA en cours...'}
                  {state.currentState === 'logging_sleep' && 'Enregistrement...'}
                  {state.currentState === 'syncing_data' && 'Synchronisation...'}
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
                <AlertCircle className="w-5 h-5" />
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

// Composant formulaire d'enregistrement du sommeil
const SleepLoggingForm: React.FC<{ onSubmit: (data: Partial<SleepData>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bedtime: '22:30',
    wakeTime: '07:00',
    sleepQuality: 'good' as SleepData['sleepQuality'],
    morningMood: 'good' as SleepData['morningMood'],
    energyLevel: 7,
    sleepLatency: 15,
    nightAwakenings: 1,
    screenTime: 30,
    caffeine: false,
    alcohol: false,
    exercise: false,
    meditation: false,
    reading: false,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    const bedtime = new Date(today);
    const [bedHour, bedMin] = formData.bedtime.split(':').map(Number);
    bedtime.setHours(bedHour, bedMin, 0, 0);
    
    const wakeTime = new Date(today);
    const [wakeHour, wakeMin] = formData.wakeTime.split(':').map(Number);
    wakeTime.setHours(wakeHour, wakeMin, 0, 0);
    
    // Si réveil avant coucher, c'est le jour suivant
    if (wakeTime < bedtime) {
      wakeTime.setDate(wakeTime.getDate() + 1);
    }
    
    const sleepDuration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60); // minutes
    
    const sleepData: Partial<SleepData> = {
      bedtime,
      wakeTime,
      sleepDuration,
      sleepLatency: formData.sleepLatency,
      nightAwakenings: formData.nightAwakenings,
      sleepQuality: formData.sleepQuality,
      morningMood: formData.morningMood,
      energyLevel: formData.energyLevel,
      preSleepActivities: {
        screenTime: formData.screenTime,
        caffeine: formData.caffeine,
        alcohol: formData.alcohol,
        exercise: formData.exercise,
        meditation: formData.meditation,
        reading: formData.reading,
      },
      notes: formData.notes || undefined,
    };
    
    onSubmit(sleepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Horaires */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Heure de coucher</label>
          <input
            type="time"
            value={formData.bedtime}
            onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Heure de réveil</label>
          <input
            type="time"
            value={formData.wakeTime}
            onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      {/* Qualité et humeur */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Qualité du sommeil</label>
          <select
            value={formData.sleepQuality}
            onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value as SleepData['sleepQuality'] })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="poor">Mauvaise</option>
            <option value="fair">Correcte</option>
            <option value="good">Bonne</option>
            <option value="excellent">Excellente</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Humeur matinale</label>
          <select
            value={formData.morningMood}
            onChange={(e) => setFormData({ ...formData, morningMood: e.target.value as SleepData['morningMood'] })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="terrible">Terrible</option>
            <option value="poor">Mauvaise</option>
            <option value="ok">Correct</option>
            <option value="good">Bonne</option>
            <option value="excellent">Excellente</option>
          </select>
        </div>
      </div>

      {/* Niveau d'énergie */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Niveau d'énergie: {formData.energyLevel}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.energyLevel}
          onChange={(e) => setFormData({ ...formData, energyLevel: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Activités pré-sommeil */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">Activités avant le coucher</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'caffeine', label: 'Caféine' },
            { key: 'alcohol', label: 'Alcool' },
            { key: 'exercise', label: 'Exercice' },
            { key: 'meditation', label: 'Méditation' },
            { key: 'reading', label: 'Lecture' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-white/80">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="rounded border-white/20 bg-white/10"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Notes (optionnel)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Observations particulières..."
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 h-20 resize-none"
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
      >
        <Moon className="w-4 h-4 mr-2" />
        Enregistrer cette nuit
      </Button>
    </form>
  );
};

// Fonctions utilitaires
function calculateSleepCycleCompleteness(sleepData: SleepData): number {
  const totalSleep = sleepData.sleepStages.lightSleep + sleepData.sleepStages.deepSleep + sleepData.sleepStages.remSleep;
  const expectedCycles = Math.floor(totalSleep / 90); // Cycle de 90min
  const completeness = Math.min(100, (expectedCycles / 5) * 100); // 5 cycles optimaux
  return Math.round(completeness);
}

function calculateOptimalBedtime(sleepData: SleepData): string {
  const bedtimeHour = sleepData.bedtime.getHours();
  const bedtimeMin = sleepData.bedtime.getMinutes();
  
  // Ajustement basé sur la qualité
  let optimalHour = bedtimeHour;
  if (sleepData.sleepQuality === 'poor' && bedtimeHour > 23) {
    optimalHour = 22; // Plus tôt si sommeil difficile
  }
  
  return `${optimalHour.toString().padStart(2, '0')}:${bedtimeMin.toString().padStart(2, '0')}`;
}

function calculateOptimalWakeTime(sleepData: SleepData): string {
  const wakeTimeHour = sleepData.wakeTime.getHours();
  const wakeTimeMin = sleepData.wakeTime.getMinutes();
  return `${wakeTimeHour.toString().padStart(2, '0')}:${wakeTimeMin.toString().padStart(2, '0')}`;
}

function mapMoodToScore(mood: SleepData['morningMood']): number {
  const moodScores = {
    terrible: 20,
    poor: 40,
    ok: 60,
    good: 80,
    excellent: 100
  };
  return moodScores[mood];
}

function calculateHRVScore(hrv: number): number {
  // Conversion HRV en score de récupération (formule simplifiée)
  return Math.min(100, Math.max(0, (hrv / 50) * 100));
}

function calculateRecoveryTime(scores: SleepAnalysis['sleepScores']): number {
  const avgScore = (scores.overallQuality + scores.recoveryScore + scores.restorationIndex) / 3;
  if (avgScore >= 80) return 6;
  if (avgScore >= 60) return 8;
  if (avgScore >= 40) return 10;
  return 12;
}

function generateOptimalWorkoutTiming(sleepData: SleepData): string[] {
  const wakeHour = sleepData.wakeTime.getHours();
  const timings = [];
  
  // 2-3h après réveil pour le pic de cortisol
  timings.push(`${(wakeHour + 2).toString().padStart(2, '0')}:00-${(wakeHour + 3).toString().padStart(2, '0')}:00`);
  
  // Fin d'après-midi si énergie suffisante
  if (sleepData.energyLevel >= 6) {
    timings.push('16:00-18:00');
  }
  
  return timings;
}

export default SleepQualityAnalyzer;