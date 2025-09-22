import React, { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Droplets, 
  Target, 
  Clock, 
  Brain, 
  Heart, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  BarChart3,
  Thermometer,
  Timer,
  Lightbulb,
  Settings,
  Plus,
  Minus,
  Coffee,
  Wine,
  Milk
} from 'lucide-react';
import { 
  HydrationData, 
  HydrationAnalysis, 
  HydrationTrackingState, 
  WeeklyHydrationSummary,
  HydrationGoals,
  FluidIntakeEvent
} from '../types';
import { 
  dbToHydrationData, 
  hydrationDataToDb, 
  calculateHydrationScores, 
  generateHydrationAIInsights,
  calculateDehydrationRisk
} from '../utils/hydration-mapping';

// Types pour le state machine React
interface HydrationState {
  currentState: HydrationTrackingState;
  hydrationData: HydrationData | null;
  hydrationAnalysis: HydrationAnalysis | null;
  weeklySummary: WeeklyHydrationSummary | null;
  hydrationGoals: HydrationGoals | null;
  recentDays: HydrationData[];
  todayIntakes: FluidIntakeEvent[];
  isLoading: boolean;
  error: string | null;
  showInsights: boolean;
  selectedDate: string;
  hydrationScore: number;
  efficiencyScore: number;
  dehydrationRisk: string;
  currentProgress: number;
  dailyGoal: number;
}

type HydrationAction =
  | { type: 'SET_STATE'; payload: HydrationTrackingState }
  | { type: 'SET_HYDRATION_DATA'; payload: HydrationData }
  | { type: 'SET_ANALYSIS'; payload: HydrationAnalysis }
  | { type: 'SET_WEEKLY_SUMMARY'; payload: WeeklyHydrationSummary }
  | { type: 'SET_GOALS'; payload: HydrationGoals }
  | { type: 'SET_RECENT_DAYS'; payload: HydrationData[] }
  | { type: 'SET_TODAY_INTAKES'; payload: FluidIntakeEvent[] }
  | { type: 'ADD_INTAKE'; payload: FluidIntakeEvent }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_INSIGHTS' }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'UPDATE_SCORES'; payload: { hydration: number; efficiency: number; risk: string } }
  | { type: 'UPDATE_PROGRESS'; payload: { current: number; goal: number } }
  | { type: 'RESET_STATE' };

const initialHydrationState: HydrationState = {
  currentState: 'idle',
  hydrationData: null,
  hydrationAnalysis: null,
  weeklySummary: null,
  hydrationGoals: null,
  recentDays: [],
  todayIntakes: [],
  isLoading: false,
  error: null,
  showInsights: false,
  selectedDate: new Date().toISOString().split('T')[0],
  hydrationScore: 0,
  efficiencyScore: 0,
  dehydrationRisk: 'optimal',
  currentProgress: 0,
  dailyGoal: 2500,
};

function hydrationReducer(state: HydrationState, action: HydrationAction): HydrationState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload };
    case 'SET_HYDRATION_DATA':
      return { ...state, hydrationData: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, hydrationAnalysis: action.payload };
    case 'SET_WEEKLY_SUMMARY':
      return { ...state, weeklySummary: action.payload };
    case 'SET_GOALS':
      return { ...state, hydrationGoals: action.payload };
    case 'SET_RECENT_DAYS':
      return { ...state, recentDays: action.payload };
    case 'SET_TODAY_INTAKES':
      return { ...state, todayIntakes: action.payload };
    case 'ADD_INTAKE':
      return { ...state, todayIntakes: [...state.todayIntakes, action.payload] };
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
        hydrationScore: action.payload.hydration,
        efficiencyScore: action.payload.efficiency,
        dehydrationRisk: action.payload.risk 
      };
    case 'UPDATE_PROGRESS':
      return { 
        ...state, 
        currentProgress: action.payload.current,
        dailyGoal: action.payload.goal 
      };
    case 'RESET_STATE':
      return initialHydrationState;
    default:
      return state;
  }
}

export const HydrationOptimizer: React.FC = () => {
  const [state, dispatch] = useReducer(hydrationReducer, initialHydrationState);
  const [userId, setUserId] = useState<string | null>(null);

  // Gestion de l'authentification
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadHydrationData(user.id);
      }
    };
    getUser();
  }, []);

  // Chargement des données d'hydratation
  const loadHydrationData = async (userIdParam: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_STATE', payload: 'syncing_data' });

    try {
      // Chargement des données récentes
      const { data: recentHydrationData, error: hydrationError } = await supabase
        .from('hydration_data')
        .select('*')
        .eq('user_id', userIdParam)
        .order('hydration_date', { ascending: false })
        .limit(7);

      if (hydrationError) throw hydrationError;

      const recentDays = recentHydrationData?.map(dbToHydrationData) || [];
      dispatch({ type: 'SET_RECENT_DAYS', payload: recentDays });

      // Données du jour sélectionné
      const todayData = recentDays.find(day => 
        day.hydrationDate === state.selectedDate
      );

      if (todayData) {
        dispatch({ type: 'SET_HYDRATION_DATA', payload: todayData });
        dispatch({ type: 'UPDATE_PROGRESS', payload: { 
          current: todayData.totalIntake, 
          goal: todayData.dailyGoal 
        }});
        
        // Conversion des timestamps en events
        const todayIntakes: FluidIntakeEvent[] = todayData.hydrationTimestamps.map((ts, index) => ({
          id: `intake_${index}`,
          timestamp: new Date(`${todayData.hydrationDate}T${ts.time}`),
          amount: ts.amount,
          fluidType: ts.fluidType,
          temperature: ts.temperature,
          context: 'habit',
        }));
        dispatch({ type: 'SET_TODAY_INTAKES', payload: todayIntakes });
        
        await analyzeHydrationData(todayData);
      } else {
        // Créer données par défaut pour aujourd'hui
        await createTodayHydrationData(userIdParam);
      }

      // Chargement des objectifs
      const { data: goalsData } = await supabase
        .from('hydration_goals')
        .select('*')
        .eq('user_id', userIdParam)
        .single();

      if (goalsData) {
        dispatch({ type: 'SET_GOALS', payload: goalsData });
      }

      dispatch({ type: 'SET_STATE', payload: 'idle' });
    } catch (error) {
      console.error('Erreur chargement données hydratation:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' });
      dispatch({ type: 'SET_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Création données par défaut aujourd'hui
  const createTodayHydrationData = async (userIdParam: string) => {
    const todayData: HydrationData = {
      id: `hydration_${Date.now()}`,
      userId: userIdParam,
      hydrationDate: state.selectedDate,
      dailyGoal: 2500,
      totalIntake: 0,
      waterIntake: 0,
      otherFluids: {
        coffee: 0,
        tea: 0,
        juice: 0,
        alcohol: 0,
        sportsDrinks: 0,
        sodas: 0,
      },
      hydrationTimestamps: [],
      physicalActivity: {
        exerciseDuration: 0,
        exerciseIntensity: 'low',
        sweatRate: 500,
        environmentalTemp: 20,
        humidity: 50,
      },
      bodyMetrics: {
        weight: 70,
        urineColor: 3,
        urineFrequency: 6,
      },
      symptoms: {
        thirst: 'none',
        headache: false,
        fatigue: false,
        dizziness: false,
        drymouth: false,
        darkUrine: false,
        constipation: false,
      },
      mood: {
        energyLevel: 7,
        concentration: 7,
        overallMood: 'good',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'SET_HYDRATION_DATA', payload: todayData });
    dispatch({ type: 'UPDATE_PROGRESS', payload: { current: 0, goal: 2500 }});
  };

  // Analyse IA de l'hydratation
  const analyzeHydrationData = async (hydrationData: HydrationData) => {
    dispatch({ type: 'SET_STATE', payload: 'analyzing_hydration' });

    try {
      // Calcul des scores
      const hydrationScores = calculateHydrationScores(hydrationData);
      const aiInsights = generateHydrationAIInsights(hydrationData, hydrationScores);
      const dehydrationRisk = calculateDehydrationRisk(hydrationData);

      // Création de l'analyse complète
      const analysis: HydrationAnalysis = {
        id: `analysis_${hydrationData.id}`,
        userId: hydrationData.userId,
        hydrationDataId: hydrationData.id,
        analysisDate: new Date(),
        hydrationScores,
        fluidBalance: {
          optimalIntake: calculateOptimalIntake(hydrationData),
          actualIntake: hydrationData.totalIntake,
          deficit: Math.max(0, hydrationData.dailyGoal - hydrationData.totalIntake),
          surplus: Math.max(0, hydrationData.totalIntake - hydrationData.dailyGoal),
          absorptionRate: calculateAbsorptionRate(hydrationData),
          retentionScore: calculateRetentionScore(hydrationData),
        },
        performanceImpact: {
          cognitiveFunction: calculateCognitiveImpact(hydrationData),
          physicalPerformance: calculatePhysicalImpact(hydrationData),
          recoveryRate: calculateRecoveryImpact(hydrationData),
          metabolicEfficiency: calculateMetabolicImpact(hydrationData),
        },
        dehydrationRisk,
        aiInsights,
        predictiveMetrics: {
          nextHourNeed: calculateNextHourNeed(hydrationData),
          endOfDayProjection: calculateEndOfDayProjection(hydrationData),
          performanceImpactTomorrow: hydrationScores.overallHydration > 75 ? 'positive' : 
                                      hydrationScores.overallHydration > 50 ? 'neutral' : 'negative',
          optimalNextIntake: calculateOptimalNextIntake(),
        },
        environmentalFactors: {
          temperatureImpact: calculateTemperatureImpact(hydrationData),
          humidityImpact: calculateHumidityImpact(hydrationData),
          altitudeAdjustment: 0, // Simplifiée
          seasonalFactors: getSeasonalFactors(),
        },
        personalizedTargets: {
          baselineNeed: 2000,
          exerciseAdjustment: calculateExerciseAdjustment(hydrationData),
          environmentalAdjustment: calculateEnvironmentalAdjustment(hydrationData),
          finalTarget: hydrationData.dailyGoal,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      dispatch({ type: 'UPDATE_SCORES', payload: { 
        hydration: hydrationScores.overallHydration,
        efficiency: hydrationScores.hydrationEfficiency,
        risk: dehydrationRisk.currentLevel 
      }});

      // Sauvegarde en base
      await saveHydrationAnalysis(analysis);
      
    } catch (error) {
      console.error('Erreur analyse hydratation:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'analyse' });
    }
  };

  // Sauvegarde de l'analyse
  const saveHydrationAnalysis = async (analysis: HydrationAnalysis) => {
    try {
      const { error } = await supabase
        .from('hydration_analysis')
        .upsert({
          id: analysis.id,
          user_id: analysis.userId,
          hydration_data_id: analysis.hydrationDataId,
          analysis_date: analysis.analysisDate.toISOString(),
          overall_hydration_score: analysis.hydrationScores.overallHydration,
          hydration_efficiency_score: analysis.hydrationScores.hydrationEfficiency,
          quality_score: analysis.hydrationScores.qualityScore,
          timing_optimization_score: analysis.hydrationScores.timingOptimization,
          recovery_hydration_score: analysis.hydrationScores.recoveryHydration,
          balance_score: analysis.hydrationScores.balanceScore,
          dehydration_risk_level: analysis.dehydrationRisk.currentLevel,
          hydration_ai_analysis: {
            fluidBalance: analysis.fluidBalance,
            performanceImpact: analysis.performanceImpact,
            dehydrationRisk: analysis.dehydrationRisk,
            aiInsights: analysis.aiInsights,
            predictiveMetrics: analysis.predictiveMetrics,
            environmentalFactors: analysis.environmentalFactors,
            personalizedTargets: analysis.personalizedTargets,
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur sauvegarde analyse:', error);
    }
  };

  // Ajout d'une nouvelle prise
  const addFluidIntake = async (amount: number, fluidType: HydrationData['hydrationTimestamps'][0]['fluidType'], temperature: HydrationData['hydrationTimestamps'][0]['temperature'] = 'room') => {
    if (!userId || !state.hydrationData) return;

    dispatch({ type: 'SET_STATE', payload: 'logging_intake' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      
      // Nouvel event d'intake
      const newIntake: FluidIntakeEvent = {
        id: `intake_${Date.now()}`,
        timestamp: now,
        amount,
        fluidType,
        temperature,
        context: 'habit',
      };

      // Nouveau timestamp pour les données
      const newTimestamp = {
        time: timeString,
        amount,
        fluidType,
        temperature,
      };

      // Mise à jour des données d'hydratation
      const updatedHydrationData: HydrationData = {
        ...state.hydrationData,
        totalIntake: state.hydrationData.totalIntake + amount,
        waterIntake: fluidType === 'water' ? state.hydrationData.waterIntake + amount : state.hydrationData.waterIntake,
        otherFluids: {
          ...state.hydrationData.otherFluids,
          [fluidType === 'coffee' ? 'coffee' :
           fluidType === 'tea' ? 'tea' :
           fluidType === 'juice' ? 'juice' :
           fluidType === 'alcohol' ? 'alcohol' :
           fluidType === 'sports' ? 'sportsDrinks' :
           fluidType === 'soda' ? 'sodas' : 'coffee']: 
           state.hydrationData.otherFluids[
             fluidType === 'coffee' ? 'coffee' :
             fluidType === 'tea' ? 'tea' :
             fluidType === 'juice' ? 'juice' :
             fluidType === 'alcohol' ? 'alcohol' :
             fluidType === 'sports' ? 'sportsDrinks' :
             fluidType === 'soda' ? 'sodas' : 'coffee'
           ] + (fluidType !== 'water' ? amount : 0)
        },
        hydrationTimestamps: [...state.hydrationData.hydrationTimestamps, newTimestamp],
        updatedAt: new Date(),
      };

      // Sauvegarde en base
      const dbData = hydrationDataToDb(updatedHydrationData);
      const { error } = await supabase
        .from('hydration_data')
        .upsert(dbData);

      if (error) throw error;

      // Mise à jour du state
      dispatch({ type: 'SET_HYDRATION_DATA', payload: updatedHydrationData });
      dispatch({ type: 'ADD_INTAKE', payload: newIntake });
      dispatch({ type: 'UPDATE_PROGRESS', payload: { 
        current: updatedHydrationData.totalIntake, 
        goal: updatedHydrationData.dailyGoal 
      }});

      // Re-analyse
      await analyzeHydrationData(updatedHydrationData);

      dispatch({ type: 'SET_STATE', payload: 'idle' });
    } catch (error) {
      console.error('Erreur ajout prise fluide:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'ajout' });
      dispatch({ type: 'SET_STATE', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Calcul du pourcentage de progression
  const progressPercentage = state.dailyGoal > 0 ? Math.min(100, (state.currentProgress / state.dailyGoal) * 100) : 0;

  // Rendu du composant principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec progression principale */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Hydration Optimizer
            </h1>
          </div>

          {/* Progression principale */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-white mb-2">
                  {state.currentProgress}ml
                </div>
                <div className="text-xl text-white/80">
                  sur {state.dailyGoal}ml ({progressPercentage.toFixed(0)}%)
                </div>
              </div>
              
              {/* Barre de progression liquide */}
              <div className="relative w-full h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
              
              {/* Indicateur de reste */}
              {state.currentProgress < state.dailyGoal && (
                <div className="text-center mt-4 text-white/70">
                  Plus que {state.dailyGoal - state.currentProgress}ml pour atteindre votre objectif
                </div>
              )}
            </motion.div>
          </div>

          {/* Scores principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="w-6 h-6 text-blue-400" />
                <span className="text-white/80 font-medium">Hydratation</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {state.hydrationScore}/100
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.hydrationScore}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-white/80 font-medium">Efficacité</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {state.efficiencyScore}/100
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${state.efficiencyScore}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span className="text-white/80 font-medium">Risque</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                {state.dehydrationRisk === 'optimal' ? 'Optimal' :
                 state.dehydrationRisk === 'mild' ? 'Léger' :
                 state.dehydrationRisk === 'moderate' ? 'Modéré' : 'Sévère'}
              </div>
              <Badge 
                className={`${
                  state.dehydrationRisk === 'optimal' ? 'bg-green-500' :
                  state.dehydrationRisk === 'mild' ? 'bg-yellow-500' :
                  state.dehydrationRisk === 'moderate' ? 'bg-orange-500' : 'bg-red-500'
                } text-white`}
              >
                {state.dehydrationRisk}
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Interface principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Prises rapides */}
          <div className="space-y-6">
            
            {/* Actions de prise rapide */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Ajouter une prise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  {/* Boutons prises rapides */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => addFluidIntake(250, 'water')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-16 flex flex-col items-center justify-center"
                      disabled={state.isLoading}
                    >
                      <Droplets className="w-5 h-5 mb-1" />
                      Eau 250ml
                    </Button>
                    
                    <Button 
                      onClick={() => addFluidIntake(500, 'water')}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-16 flex flex-col items-center justify-center"
                      disabled={state.isLoading}
                    >
                      <Droplets className="w-5 h-5 mb-1" />
                      Eau 500ml
                    </Button>
                    
                    <Button 
                      onClick={() => addFluidIntake(200, 'coffee', 'hot')}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-16 flex flex-col items-center justify-center"
                      disabled={state.isLoading}
                    >
                      <Coffee className="w-5 h-5 mb-1" />
                      Café 200ml
                    </Button>
                    
                    <Button 
                      onClick={() => addFluidIntake(250, 'tea', 'hot')}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-16 flex flex-col items-center justify-center"
                      disabled={state.isLoading}
                    >
                      <Milk className="w-5 h-5 mb-1" />
                      Thé 250ml
                    </Button>
                  </div>

                  {/* Prise personnalisée */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Prise personnalisée
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Ajouter une prise personnalisée</DialogTitle>
                      </DialogHeader>
                      <CustomIntakeForm onSubmit={addFluidIntake} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Historique aujourd'hui */}
            {state.todayIntakes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Prises d'aujourd'hui
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                    {state.todayIntakes.slice().reverse().map((intake, index) => {
                      const fluidIcons = {
                        water: Droplets,
                        coffee: Coffee,
                        tea: Milk,
                        juice: Milk,
                        alcohol: Wine,
                        sports: Zap,
                        soda: Milk
                      };
                      const Icon = fluidIcons[intake.fluidType];
                      
                      return (
                        <motion.div
                          key={intake.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="text-sm text-white font-medium">
                                {intake.amount}ml
                              </div>
                              <div className="text-xs text-white/70">
                                {intake.timestamp.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className="bg-blue-500/20 text-blue-300 border-blue-400/30"
                          >
                            {intake.fluidType}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Colonne centrale - Analyse et insights */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Données d'hydratation */}
            {state.hydrationData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Analyse détaillée - {new Date(state.hydrationData.hydrationDate).toLocaleDateString('fr-FR')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Répartition des fluides */}
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Répartition des fluides</h4>
                      <div className="space-y-2">
                        {Object.entries({
                          'Eau': state.hydrationData.waterIntake,
                          'Café': state.hydrationData.otherFluids.coffee,
                          'Thé': state.hydrationData.otherFluids.tea,
                          'Jus': state.hydrationData.otherFluids.juice,
                          'Sports': state.hydrationData.otherFluids.sportsDrinks,
                          'Sodas': state.hydrationData.otherFluids.sodas,
                          'Alcool': state.hydrationData.otherFluids.alcohol,
                        }).map(([fluid, amount]) => {
                          if (amount === 0) return null;
                          const percentage = (amount / state.hydrationData!.totalIntake) * 100;
                          const colors = {
                            'Eau': 'bg-blue-500',
                            'Café': 'bg-amber-600',
                            'Thé': 'bg-green-500',
                            'Jus': 'bg-orange-500',
                            'Sports': 'bg-purple-500',
                            'Sodas': 'bg-red-500',
                            'Alcool': 'bg-red-600'
                          };
                          
                          return (
                            <div key={fluid} className="flex items-center gap-3">
                              <div className="w-20 text-sm text-white/70">{fluid}</div>
                              <div className="flex-1 bg-white/10 rounded-full h-4">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={`${colors[fluid as keyof typeof colors]} h-4 rounded-full relative overflow-hidden`}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                </motion.div>
                              </div>
                              <div className="w-24 text-sm text-white text-right">
                                {amount}ml ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                          );
                        }).filter(Boolean)}
                      </div>
                    </div>

                    {/* Métriques corporelles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Couleur urine</div>
                        <div className="text-lg font-bold text-white">
                          {state.hydrationData.bodyMetrics.urineColor}/8
                        </div>
                        <div className={`w-4 h-4 mx-auto mt-1 rounded-full ${
                          state.hydrationData.bodyMetrics.urineColor <= 3 ? 'bg-yellow-200' :
                          state.hydrationData.bodyMetrics.urineColor <= 5 ? 'bg-yellow-400' :
                          state.hydrationData.bodyMetrics.urineColor <= 7 ? 'bg-orange-500' : 'bg-red-600'
                        }`} />
                      </div>
                      
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Fréquence</div>
                        <div className="text-lg font-bold text-white">
                          {state.hydrationData.bodyMetrics.urineFrequency}/jour
                        </div>
                        <Badge className={`mt-1 ${
                          state.hydrationData.bodyMetrics.urineFrequency >= 6 && 
                          state.hydrationData.bodyMetrics.urineFrequency <= 8 ? 
                          'bg-green-500' : 'bg-orange-500'
                        } text-white`}>
                          {state.hydrationData.bodyMetrics.urineFrequency >= 6 && 
                           state.hydrationData.bodyMetrics.urineFrequency <= 8 ? 'Normal' : 'Attention'}
                        </Badge>
                      </div>
                      
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Énergie</div>
                        <div className="text-lg font-bold text-white">
                          {state.hydrationData.mood.energyLevel}/10
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${state.hydrationData.mood.energyLevel * 10}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">Concentration</div>
                        <div className="text-lg font-bold text-white">
                          {state.hydrationData.mood.concentration}/10
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${state.hydrationData.mood.concentration * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Insights IA */}
            {state.hydrationAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse IA de l'hydratation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Suggestions d'amélioration */}
                    {state.hydrationAnalysis.aiInsights.improvementSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-blue-300 font-medium flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Suggestions d'amélioration
                        </h5>
                        <div className="space-y-1">
                          {state.hydrationAnalysis.aiInsights.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <CheckCircle className="w-3 h-3 text-blue-400" />
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommandations de fluides */}
                    {state.hydrationAnalysis.aiInsights.fluidRecommendations.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-green-300 font-medium flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          Recommandations de fluides
                        </h5>
                        <div className="space-y-1">
                          {state.hydrationAnalysis.aiInsights.fluidRecommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <div className="w-1 h-1 bg-green-400 rounded-full" />
                              {recommendation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prédictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Besoin prochaine heure</div>
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-medium">
                            {state.hydrationAnalysis.predictiveMetrics.nextHourNeed}ml
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">Projection fin de journée</div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium">
                            {state.hydrationAnalysis.predictiveMetrics.endOfDayProjection}ml
                          </span>
                        </div>
                      </div>
                    </div>
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
                  {state.currentState === 'analyzing_hydration' && 'Analyse IA en cours...'}
                  {state.currentState === 'logging_intake' && 'Enregistrement...'}
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

// Composant formulaire de prise personnalisée
const CustomIntakeForm: React.FC<{ onSubmit: (amount: number, fluidType: any, temperature: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: 250,
    fluidType: 'water' as HydrationData['hydrationTimestamps'][0]['fluidType'],
    temperature: 'room' as HydrationData['hydrationTimestamps'][0]['temperature']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.amount, formData.fluidType, formData.temperature);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Quantité */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Quantité: {formData.amount}ml
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>50ml</span>
          <span>1000ml</span>
        </div>
      </div>

      {/* Type de fluide */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Type de fluide</label>
        <select
          value={formData.fluidType}
          onChange={(e) => setFormData({ ...formData, fluidType: e.target.value as any })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
        >
          <option value="water">Eau</option>
          <option value="coffee">Café</option>
          <option value="tea">Thé</option>
          <option value="juice">Jus</option>
          <option value="sports">Boisson sportive</option>
          <option value="soda">Soda</option>
          <option value="alcohol">Alcool</option>
        </select>
      </div>

      {/* Température */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Température</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'cold', label: 'Froid', icon: '🧊' },
            { value: 'room', label: 'Ambient', icon: '🌡️' },
            { value: 'warm', label: 'Tiède', icon: '☕' },
            { value: 'hot', label: 'Chaud', icon: '🔥' }
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, temperature: value as any })}
              className={`p-2 rounded-lg text-xs transition-colors ${
                formData.temperature === value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <div className="text-lg">{icon}</div>
              <div>{label}</div>
            </button>
          ))}
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter {formData.amount}ml
      </Button>
    </form>
  );
};

// Fonctions utilitaires
function calculateOptimalIntake(hydrationData: HydrationData): number {
  return hydrationData.dailyGoal + calculateExerciseAdjustment(hydrationData) + calculateEnvironmentalAdjustment(hydrationData);
}

function calculateAbsorptionRate(hydrationData: HydrationData): number {
  // Calcul simplifié basé sur le type de fluides et la répartition
  const waterRatio = hydrationData.waterIntake / hydrationData.totalIntake;
  return Math.round(80 + (waterRatio * 20));
}

function calculateRetentionScore(hydrationData: HydrationData): number {
  let retentionScore = 85;
  
  // Facteurs qui réduisent la rétention
  const alcoholRatio = hydrationData.otherFluids.alcohol / hydrationData.totalIntake;
  const caffeineRatio = hydrationData.otherFluids.coffee / hydrationData.totalIntake;
  
  retentionScore -= alcoholRatio * 40;
  retentionScore -= caffeineRatio * 15;
  
  return Math.max(0, Math.round(retentionScore));
}

function calculateCognitiveImpact(hydrationData: HydrationData): number {
  const hydrationLevel = hydrationData.totalIntake / hydrationData.dailyGoal;
  return Math.min(100, Math.round(hydrationLevel * 100));
}

function calculatePhysicalImpact(hydrationData: HydrationData): number {
  const hydrationLevel = hydrationData.totalIntake / hydrationData.dailyGoal;
  const exerciseBonus = hydrationData.physicalActivity.exerciseDuration > 0 ? 10 : 0;
  return Math.min(100, Math.round(hydrationLevel * 90 + exerciseBonus));
}

function calculateRecoveryImpact(hydrationData: HydrationData): number {
  const hydrationLevel = hydrationData.totalIntake / hydrationData.dailyGoal;
  const qualityBonus = (hydrationData.waterIntake / hydrationData.totalIntake) * 10;
  return Math.min(100, Math.round(hydrationLevel * 85 + qualityBonus));
}

function calculateMetabolicImpact(hydrationData: HydrationData): number {
  const hydrationLevel = hydrationData.totalIntake / hydrationData.dailyGoal;
  return Math.min(100, Math.round(hydrationLevel * 95));
}

function calculateNextHourNeed(hydrationData: HydrationData): number {
  const currentHour = new Date().getHours();
  const baseNeed = 150; // ml/heure base
  
  // Ajustement selon l'heure
  if (currentHour >= 6 && currentHour <= 10) return baseNeed + 100; // Matin
  if (currentHour >= 14 && currentHour <= 18) return baseNeed + 50; // Après-midi
  if (currentHour >= 20) return baseNeed - 50; // Soir
  
  return baseNeed;
}

function calculateEndOfDayProjection(hydrationData: HydrationData): number {
  const currentHour = new Date().getHours();
  const hoursLeft = 24 - currentHour;
  const averageHourlyNeed = 120; // ml
  
  return hydrationData.totalIntake + (hoursLeft * averageHourlyNeed);
}

function calculateOptimalNextIntake(): string {
  const now = new Date();
  const nextIntake = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
  return nextIntake.toTimeString().slice(0, 5);
}

function calculateTemperatureImpact(hydrationData: HydrationData): number {
  const temp = hydrationData.physicalActivity.environmentalTemp;
  if (temp <= 20) return 30;
  if (temp <= 25) return 50;
  if (temp <= 30) return 70;
  return 90;
}

function calculateHumidityImpact(hydrationData: HydrationData): number {
  const humidity = hydrationData.physicalActivity.humidity;
  if (humidity <= 30) return 80; // Air sec = plus de perte
  if (humidity <= 50) return 50;
  if (humidity <= 70) return 30;
  return 20; // Humidité élevée = moins de perte
}

function getSeasonalFactors(): string[] {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 8) return ['Été: besoins accrus', 'Transpiration élevée'];
  if (month >= 11 || month <= 2) return ['Hiver: air sec', 'Chauffage déshydratant'];
  return ['Saison tempérée'];
}

function calculateExerciseAdjustment(hydrationData: HydrationData): number {
  const duration = hydrationData.physicalActivity.exerciseDuration;
  const intensityMultiplier = {
    low: 1.2,
    moderate: 1.5,
    high: 2.0,
    extreme: 2.5
  };
  
  return Math.round(duration * 8 * intensityMultiplier[hydrationData.physicalActivity.exerciseIntensity]);
}

function calculateEnvironmentalAdjustment(hydrationData: HydrationData): number {
  const temp = hydrationData.physicalActivity.environmentalTemp;
  const humidity = hydrationData.physicalActivity.humidity;
  
  let adjustment = 0;
  if (temp > 25) adjustment += (temp - 25) * 20;
  if (humidity < 40) adjustment += (40 - humidity) * 5;
  
  return Math.round(adjustment);
}

export default HydrationOptimizer;