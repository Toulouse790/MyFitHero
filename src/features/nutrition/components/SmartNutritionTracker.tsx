import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { 
  Apple, Camera, Search, Plus, TrendingUp, Target, 
  Clock, Zap, AlertCircle, CheckCircle, Brain, 
  BarChart3, Utensils, Scale, Timer, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { 
  NutritionData, 
  MealAnalysis, 
  NutritionTrackingState, 
  FoodSearchResult,
  DailyNutritionSummary 
} from '../types';
import { 
  calculateNutritionScores, 
  generateNutritionRecommendations,
  dbToNutritionData,
  nutritionDataToDb,
  dbToMealAnalysis,
  mealAnalysisToDb
} from '../services/nutrition-mapping';

// =====================================
// STATE MANAGEMENT (à la façon Workout)
// =====================================

interface NutritionState {
  currentState: NutritionTrackingState;
  todaysSummary: DailyNutritionSummary | null;
  currentMeal: {
    type: NutritionData['mealType'] | null;
    items: NutritionData[];
    totalCalories: number;
    totalMacros: { protein: number; carbs: number; fat: number };
  };
  foodSearch: {
    query: string;
    results: FoodSearchResult[];
    isSearching: boolean;
  };
  aiAnalysis: {
    isAnalyzing: boolean;
    currentAnalysis: MealAnalysis | null;
    recommendations: string[];
    insights: string[];
  };
  goals: {
    dailyCalories: number;
    proteinTarget: number;
    carbTarget: number;
    fatTarget: number;
  };
  progress: {
    caloriesConsumed: number;
    caloriesRemaining: number;
    macroProgress: { protein: number; carbs: number; fat: number };
    adherenceScore: number;
  };
  error: string | null;
  lastUpdate: Date;
}

type NutritionAction = 
  | { type: 'SET_STATE'; state: NutritionTrackingState }
  | { type: 'SET_MEAL_TYPE'; mealType: NutritionData['mealType'] }
  | { type: 'RESET_MEAL_TYPE' }
  | { type: 'ADD_FOOD_ITEM'; item: NutritionData }
  | { type: 'REMOVE_FOOD_ITEM'; itemId: string }
  | { type: 'UPDATE_FOOD_SEARCH'; query: string; results?: FoodSearchResult[] }
  | { type: 'START_AI_ANALYSIS' }
  | { type: 'SET_AI_ANALYSIS'; analysis: MealAnalysis }
  | { type: 'UPDATE_DAILY_SUMMARY'; summary: DailyNutritionSummary }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_GOALS'; goals: Partial<NutritionState['goals']> }
  | { type: 'SYNC_COMPLETE' };

const initialState: NutritionState = {
  currentState: 'idle',
  todaysSummary: null,
  currentMeal: {
    type: null,
    items: [],
    totalCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0 }
  },
  foodSearch: {
    query: '',
    results: [],
    isSearching: false
  },
  aiAnalysis: {
    isAnalyzing: false,
    currentAnalysis: null,
    recommendations: [],
    insights: []
  },
  goals: {
    dailyCalories: 2000,
    proteinTarget: 150,
    carbTarget: 250,
    fatTarget: 67
  },
  progress: {
    caloriesConsumed: 0,
    caloriesRemaining: 2000,
    macroProgress: { protein: 0, carbs: 0, fat: 0 },
    adherenceScore: 100
  },
  error: null,
  lastUpdate: new Date()
};

const nutritionReducer = (state: NutritionState, action: NutritionAction): NutritionState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.state, error: null };
      
    case 'SET_MEAL_TYPE':
      return {
        ...state,
        currentMeal: { ...state.currentMeal, type: action.mealType },
        currentState: 'adding_meal'
      };

    case 'RESET_MEAL_TYPE':
      return {
        ...state,
        currentMeal: { ...initialState.currentMeal },
        currentState: 'idle'
      };
      
    case 'ADD_FOOD_ITEM': {
      const newItems = [...state.currentMeal.items, action.item];
      const totalCalories = newItems.reduce((sum, item) => sum + item.calories, 0);
      const totalMacros = newItems.reduce(
        (totals, item) => ({
          protein: totals.protein + item.macros.protein,
          carbs: totals.carbs + item.macros.carbohydrates,
          fat: totals.fat + item.macros.fat
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );
      
      return {
        ...state,
        currentMeal: { ...state.currentMeal, items: newItems, totalCalories, totalMacros },
        lastUpdate: new Date()
      };
    }
    
    case 'REMOVE_FOOD_ITEM': {
      const newItems = state.currentMeal.items.filter(item => item.id !== action.itemId);
      const totalCalories = newItems.reduce((sum, item) => sum + item.calories, 0);
      const totalMacros = newItems.reduce(
        (totals, item) => ({
          protein: totals.protein + item.macros.protein,
          carbs: totals.carbs + item.macros.carbohydrates,
          fat: totals.fat + item.macros.fat
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );
      
      return {
        ...state,
        currentMeal: { ...state.currentMeal, items: newItems, totalCalories, totalMacros }
      };
    }
    
    case 'UPDATE_FOOD_SEARCH':
      return {
        ...state,
        foodSearch: {
          query: action.query,
          results: action.results || state.foodSearch.results,
          isSearching: !action.results
        }
      };
      
    case 'START_AI_ANALYSIS':
      return {
        ...state,
        currentState: 'analyzing_meal',
        aiAnalysis: { ...state.aiAnalysis, isAnalyzing: true }
      };
      
    case 'SET_AI_ANALYSIS':
      return {
        ...state,
        currentState: 'idle',
        aiAnalysis: {
          isAnalyzing: false,
          currentAnalysis: action.analysis,
          recommendations: action.analysis.aiRecommendations.improvements,
          insights: action.analysis.aiRecommendations.alternatives
        }
      };
      
    case 'UPDATE_DAILY_SUMMARY':
      return {
        ...state,
        todaysSummary: action.summary,
        progress: {
          caloriesConsumed: action.summary.totalCalories,
          caloriesRemaining: action.summary.nutritionGoals.calorieGoal - action.summary.totalCalories,
          macroProgress: {
            protein: (action.summary.macroTotals.protein / action.summary.nutritionGoals.proteinGoal) * 100,
            carbs: (action.summary.macroTotals.carbohydrates / action.summary.nutritionGoals.carbGoal) * 100,
            fat: (action.summary.macroTotals.fat / action.summary.nutritionGoals.fatGoal) * 100
          },
          adherenceScore: action.summary.adherenceScores.calorieAdherence
        }
      };
      
    case 'SET_ERROR':
      return { ...state, error: action.error, currentState: 'error' };
      
    case 'CLEAR_ERROR':
      return { ...state, error: null };
      
    case 'UPDATE_GOALS':
      return { ...state, goals: { ...state.goals, ...action.goals } };
      
    case 'SYNC_COMPLETE':
      return { ...state, currentState: 'idle', lastUpdate: new Date() };
      
    default:
      return state;
  }
};

// =====================================
// COMPOSANT PRINCIPAL
// =====================================

interface SmartNutritionTrackerProps {
  userId: string;
  className?: string;
}

export const SmartNutritionTracker: React.FC<SmartNutritionTrackerProps> = ({
  userId,
  className = ''
}) => {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // =====================================
  // HOOKS ET EFFETS
  // =====================================

  // Chargement des données journalières
  useEffect(() => {
    loadDailyData();
  }, [userId, selectedDate]);

  const loadDailyData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_STATE', state: 'syncing_data' });
      
      // Charger les repas du jour
      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select(`
          *,
          meal_analysis:meal_analysis(*)
        `)
        .eq('user_id', userId)
        .gte('created_at', `${selectedDate}T00:00:00`)
        .lt('created_at', `${selectedDate}T23:59:59`);

      if (mealsError) throw mealsError;

      // Construire le résumé journalier
      const dailySummary = buildDailySummary(mealsData || []);
      dispatch({ type: 'UPDATE_DAILY_SUMMARY', summary: dailySummary });
      dispatch({ type: 'SYNC_COMPLETE' });
      
    } catch (error) {
      console.error('Erreur chargement données:', error);
      dispatch({ type: 'SET_ERROR', error: 'Erreur lors du chargement des données' });
    }
  }, [userId, selectedDate]);

  const buildDailySummary = (mealsData: any[]): DailyNutritionSummary => {
    const totalCalories = mealsData.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const macroTotals = mealsData.reduce(
      (totals, meal) => ({
        protein: totals.protein + (meal.protein_g || 0),
        carbohydrates: totals.carbohydrates + (meal.carbs_g || 0),
        fat: totals.fat + (meal.fat_g || 0),
        fiber: totals.fiber + (meal.fiber_g || 0)
      }),
      { protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
    );

    return {
      date: selectedDate,
      userId,
      totalCalories,
      macroTotals,
      mealBreakdown: {
        breakfast: { calories: 0, percentage: 0 },
        lunch: { calories: 0, percentage: 0 },
        dinner: { calories: 0, percentage: 0 },
        snacks: { calories: 0, percentage: 0 }
      },
      nutritionGoals: {
        calorieGoal: state.goals.dailyCalories,
        proteinGoal: state.goals.proteinTarget,
        carbGoal: state.goals.carbTarget,
        fatGoal: state.goals.fatTarget,
      },
      adherenceScores: {
        calorieAdherence: Math.min(100, (totalCalories / state.goals.dailyCalories) * 100),
        macroAdherence: 85,
        mealTimingAdherence: 90,
        foodQualityScore: 88
      },
      aiInsights: {
        dayRating: 85,
        keyWins: ["Excellent apport en protéines", "Hydratation optimale"],
        improvementAreas: ["Augmenter les fibres", "Équilibrer les collations"],
        tomorrowSuggestions: ["Préparer des légumes à croquer", "Planifier le petit-déjeuner"]
      }
    };
  };

  // =====================================
  // GESTION DES REPAS
  // =====================================

  const handleStartMeal = (mealType: NutritionData['mealType']) => {
    dispatch({ type: 'SET_MEAL_TYPE', mealType });
    setShowMealTypeSelector(false);
  };

  const handleAddFoodItem = async (foodData: FoodSearchResult, quantity: number = 100) => {
    try {
      const newItem: NutritionData = {
        id: `temp_${Date.now()}`,
        userId,
        mealId: `meal_${Date.now()}`,
        name: foodData.name,
        quantity,
        unit: 'g',
        calories: Math.round((foodData.nutritionPer100g.calories * quantity) / 100),
        macros: {
          protein: (foodData.nutritionPer100g.protein * quantity) / 100,
          carbohydrates: (foodData.nutritionPer100g.carbohydrates * quantity) / 100,
          fat: (foodData.nutritionPer100g.fat * quantity) / 100,
          fiber: (foodData.nutritionPer100g.fiber * quantity) / 100,
          sugar: 0,
          sodium: 0
        },
        mealType: state.currentMeal.type!,
        mealTiming: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      dispatch({ type: 'ADD_FOOD_ITEM', item: newItem });
      
    } catch (error) {
      console.error('Erreur ajout aliment:', error);
      dispatch({ type: 'SET_ERROR', error: 'Erreur lors de l\'ajout de l\'aliment' });
    }
  };

  const handleFinalizeMeal = async () => {
    if (state.currentMeal.items.length === 0) return;
    
    try {
      dispatch({ type: 'START_AI_ANALYSIS' });
      
      // Sauvegarder le repas
      const mealData = {
        id: `meal_${Date.now()}`,
        user_id: userId,
        name: `${state.currentMeal.type} - ${new Date().toLocaleTimeString()}`,
        meal_type: state.currentMeal.type,
        calories: state.currentMeal.totalCalories,
        protein_g: state.currentMeal.totalMacros.protein,
        carbs_g: state.currentMeal.totalMacros.carbs,
        fat_g: state.currentMeal.totalMacros.fat,
        fiber_g: 0,
        created_at: new Date().toISOString()
      };

      const { data: savedMeal, error: mealError } = await supabase
        .from('meals')
        .insert(mealData)
        .select()
        .single();

      if (mealError) throw mealError;

      // Analyse IA
      const scores = calculateNutritionScores(
        state.currentMeal.totalCalories,
        state.currentMeal.totalMacros.protein,
        state.currentMeal.totalMacros.carbs,
        state.currentMeal.totalMacros.fat,
        0, // fiber
        0  // sugar
      );

      const recommendations = generateNutritionRecommendations(
        state.currentMeal.totalCalories,
        state.currentMeal.totalMacros.protein,
        state.currentMeal.totalMacros.carbs,
        state.currentMeal.totalMacros.fat,
        0,
        state.currentMeal.type!
      );

      const analysis: MealAnalysis = {
        id: `analysis_${Date.now()}`,
        userId,
        mealId: savedMeal.id,
        totalCalories: state.currentMeal.totalCalories,
        macroBreakdown: {
          protein: {
            grams: state.currentMeal.totalMacros.protein,
            percentage: (state.currentMeal.totalMacros.protein * 4 / state.currentMeal.totalCalories) * 100,
            calories: state.currentMeal.totalMacros.protein * 4
          },
          carbs: {
            grams: state.currentMeal.totalMacros.carbs,
            percentage: (state.currentMeal.totalMacros.carbs * 4 / state.currentMeal.totalCalories) * 100,
            calories: state.currentMeal.totalMacros.carbs * 4
          },
          fat: {
            grams: state.currentMeal.totalMacros.fat,
            percentage: (state.currentMeal.totalMacros.fat * 9 / state.currentMeal.totalCalories) * 100,
            calories: state.currentMeal.totalMacros.fat * 9
          }
        },
        nutritionScores: {
          overallQuality: scores.overallQuality,
          macroBalance: scores.macroBalance,
          micronutrientDensity: 75,
          processedFoodRatio: 30,
          satietyIndex: 80,
          inflammatoryIndex: 10
        },
        aiRecommendations: {
          improvements: recommendations,
          alternatives: ["Remplacer par des alternatives complètes", "Ajouter des légumes colorés"],
          timing: ["Optimal pour ce moment de la journée"],
          portionAdjustments: []
        },
        complianceMetrics: {
          calorieTarget: { actual: state.currentMeal.totalCalories, target: 500, variance: 0 },
          proteinTarget: { actual: state.currentMeal.totalMacros.protein, target: 25, variance: 0 },
          carbTarget: { actual: state.currentMeal.totalMacros.carbs, target: 60, variance: 0 },
          fatTarget: { actual: state.currentMeal.totalMacros.fat, target: 20, variance: 0 }
        },
        metabolicImpact: {
          estimatedGlycemicLoad: 25,
          insulinResponse: 'moderate',
          satietyDuration: 3.5,
          energyProvision: 'sustained'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      dispatch({ type: 'SET_AI_ANALYSIS', analysis });
      
      // Recharger les données journalières
      await loadDailyData();
      
    } catch (error) {
      console.error('Erreur finalisation repas:', error);
      dispatch({ type: 'SET_ERROR', error: 'Erreur lors de la sauvegarde du repas' });
    }
  };

  // =====================================
  // RECHERCHE D'ALIMENTS
  // =====================================

  const searchFood = useCallback(async (query: string) => {
    if (query.length < 2) {
      dispatch({ type: 'UPDATE_FOOD_SEARCH', query: '', results: [] });
      return;
    }

    dispatch({ type: 'UPDATE_FOOD_SEARCH', query });

    try {
      // Simulation base de données alimentaire (remplacer par vraie API)
      const mockResults: FoodSearchResult[] = [
        {
          id: '1',
          name: 'Pomme Golden',
          category: 'Fruits',
          nutritionPer100g: { calories: 52, protein: 0.3, carbohydrates: 14, fat: 0.2, fiber: 2.4 },
          verified: true,
          popularity: 95
        },
        {
          id: '2', 
          name: 'Blanc de poulet grillé',
          category: 'Viandes',
          nutritionPer100g: { calories: 165, protein: 31, carbohydrates: 0, fat: 3.6, fiber: 0 },
          verified: true,
          popularity: 88
        },
        {
          id: '3',
          name: 'Avoine complète',
          category: 'Céréales',
          nutritionPer100g: { calories: 389, protein: 17, carbohydrates: 66, fat: 7, fiber: 10 },
          verified: true,
          popularity: 82
        }
      ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

      setTimeout(() => {
        dispatch({ type: 'UPDATE_FOOD_SEARCH', query, results: mockResults });
      }, 500);

    } catch (error) {
      console.error('Erreur recherche aliments:', error);
      dispatch({ type: 'SET_ERROR', error: 'Erreur lors de la recherche d\'aliments' });
    }
  }, []);

  // =====================================
  // RENDU INTERFACE
  // =====================================

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}>
      {/* Header avec stats rapides */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Apple className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Smart Nutrition</h2>
              <p className="text-green-100">IA Nutritionnelle Avancée</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{state.progress.caloriesConsumed}</div>
            <div className="text-sm text-green-100">kcal aujourd'hui</div>
          </div>
        </div>

        {/* Progress bars rapides */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs mb-1">Protéines</div>
            <div className="bg-green-800 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, state.progress.macroProgress.protein)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs mb-1">Glucides</div>
            <div className="bg-green-800 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, state.progress.macroProgress.carbs)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs mb-1">Lipides</div>
            <div className="bg-green-800 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, state.progress.macroProgress.fat)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {/* État actuel avec machine d'état */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              state.currentState === 'idle' ? 'bg-green-500' :
              state.currentState === 'analyzing_meal' ? 'bg-yellow-500 animate-pulse' :
              state.currentState === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <span className="text-sm font-medium text-gray-600">
              {state.currentState === 'idle' && 'Prêt pour l\'analyse'}
              {state.currentState === 'adding_meal' && 'Ajout en cours...'}
              {state.currentState === 'analyzing_meal' && 'Analyse IA en cours...'}
              {state.currentState === 'syncing_data' && 'Synchronisation...'}
              {state.currentState === 'error' && 'Erreur détectée'}
            </span>
          </div>
        </div>

        {/* Bouton principal */}
        {!state.currentMeal.type ? (
          <button
            onClick={() => setShowMealTypeSelector(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter un repas</span>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Repas en cours */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 capitalize">
                  {state.currentMeal.type?.replace('_', ' ')}
                </h3>
                <div className="text-lg font-bold text-green-600">
                  {state.currentMeal.totalCalories} kcal
                </div>
              </div>
              
              {/* Aliments ajoutés */}
              <div className="space-y-2 mb-4">
                {state.currentMeal.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.quantity}{item.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.calories} kcal</div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FOOD_ITEM', itemId: item.id })}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recherche d'aliments */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={state.foodSearch.query}
                    onChange={(e) => searchFood(e.target.value)}
                    placeholder="Rechercher un aliment..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                {/* Résultats de recherche */}
                {state.foodSearch.results.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {state.foodSearch.results.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleAddFoodItem(food)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.nutritionPer100g.calories} kcal/100g - {food.category}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={handleFinalizeMeal}
                  disabled={state.currentMeal.items.length === 0 || state.currentState === 'analyzing_meal'}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.currentState === 'analyzing_meal' ? (
                    <div className="flex items-center justify-center">
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analyse IA...
                    </div>
                  ) : (
                    'Finaliser le repas'
                  )}
                </button>
                <button
                  onClick={() => dispatch({ type: 'RESET_MEAL_TYPE' })}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analyse IA récente */}
        {state.aiAnalysis.currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Analyse IA du dernier repas</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {state.aiAnalysis.currentAnalysis.nutritionScores.overallQuality}
                </div>
                <div className="text-sm text-gray-600">Qualité globale</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {state.aiAnalysis.currentAnalysis.nutritionScores.macroBalance}
                </div>
                <div className="text-sm text-gray-600">Équilibre macros</div>
              </div>
            </div>

            {/* Recommandations */}
            {state.aiAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommandations IA</h4>
                <div className="space-y-1">
                  {state.aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Résumé journalier */}
        {state.todaysSummary && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Résumé de la journée</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(state.todaysSummary.adherenceScores.calorieAdherence)}%
                </div>
                <div className="text-sm text-gray-600">Adhérence calorique</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {state.todaysSummary.aiInsights.dayRating}
                </div>
                <div className="text-sm text-gray-600">Score IA du jour</div>
              </div>
            </div>

            {/* Insights IA */}
            {state.todaysSummary.aiInsights.keyWins.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Points forts aujourd'hui</span>
                </h4>
                <div className="space-y-1">
                  {state.todaysSummary.aiInsights.keyWins.map((win, index) => (
                    <div key={index} className="text-sm text-green-700">• {win}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Erreurs */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{state.error}</span>
              <button
                onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal sélection type de repas */}
      <AnimatePresence>
        {showMealTypeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowMealTypeSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Type de repas</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'breakfast' as const, label: 'Petit-déjeuner', icon: '🌅' },
                  { type: 'lunch' as const, label: 'Déjeuner', icon: '☀️' },
                  { type: 'dinner' as const, label: 'Dîner', icon: '🌙' },
                  { type: 'snack' as const, label: 'Collation', icon: '🍎' },
                  { type: 'pre_workout' as const, label: 'Pré-training', icon: '💪' },
                  { type: 'post_workout' as const, label: 'Post-training', icon: '🏆' }
                ].map((meal) => (
                  <button
                    key={meal.type}
                    onClick={() => handleStartMeal(meal.type)}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-300 transition-all text-center"
                  >
                    <div className="text-2xl mb-2">{meal.icon}</div>
                    <div className="font-medium text-gray-800">{meal.label}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMealTypeSelector(false)}
                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};