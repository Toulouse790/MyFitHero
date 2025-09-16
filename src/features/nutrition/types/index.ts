export interface NutritionData {
  id: string;
  userId: string;
  mealId: string;
  foodItemId?: string;
  name: string;
  quantity: number;
  unit: 'g' | 'ml' | 'piece' | 'cup' | 'tbsp' | 'tsp';
  calories: number;
  macros: {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  micronutrients?: {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
  };
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  mealTiming: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealAnalysis {
  id: string;
  userId: string;
  mealId: string;
  totalCalories: number;
  macroBreakdown: {
    protein: { grams: number; percentage: number; calories: number };
    carbs: { grams: number; percentage: number; calories: number };
    fat: { grams: number; percentage: number; calories: number };
  };
  nutritionScores: {
    overallQuality: number; // 0-100
    macroBalance: number; // 0-100
    micronutrientDensity: number; // 0-100
    processedFoodRatio: number; // 0-100 (lower is better)
    satietyIndex: number; // 0-100
    inflammatoryIndex: number; // -100 to +100
  };
  aiRecommendations: {
    improvements: string[];
    alternatives: string[];
    timing: string[];
    portionAdjustments: string[];
  };
  complianceMetrics: {
    calorieTarget: { actual: number; target: number; variance: number };
    proteinTarget: { actual: number; target: number; variance: number };
    carbTarget: { actual: number; target: number; variance: number };
    fatTarget: { actual: number; target: number; variance: number };
  };
  metabolicImpact: {
    estimatedGlycemicLoad: number;
    insulinResponse: 'low' | 'moderate' | 'high';
    satietyDuration: number; // hours
    energyProvision: 'quick' | 'sustained' | 'long_lasting';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyNutritionSummary {
  date: string;
  userId: string;
  totalCalories: number;
  macroTotals: {
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  mealBreakdown: {
    breakfast: { calories: number; percentage: number };
    lunch: { calories: number; percentage: number };
    dinner: { calories: number; percentage: number };
    snacks: { calories: number; percentage: number };
  };
  nutritionGoals: {
    calorieGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
  };
  adherenceScores: {
    calorieAdherence: number; // 0-100
    macroAdherence: number; // 0-100
    mealTimingAdherence: number; // 0-100
    foodQualityScore: number; // 0-100
  };
  aiInsights: {
    dayRating: number; // 0-100
    keyWins: string[];
    improvementAreas: string[];
    tomorrowSuggestions: string[];
  };
}

export interface NutritionGoals {
  userId: string;
  calorieTarget: number;
  macroTargets: {
    proteinPercentage: number;
    carbPercentage: number;
    fatPercentage: number;
  };
  specificGoals: {
    weightGoal: 'lose' | 'maintain' | 'gain';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    dietaryPreferences: string[];
    restrictions: string[];
  };
  micronutrientTargets?: {
    fiber: number;
    sodium: number;
    sugar: number;
  };
}

// States pour les composants React
export type NutritionTrackingState = 
  | 'idle'
  | 'searching_food'
  | 'adding_meal'
  | 'analyzing_meal'
  | 'updating_goals'
  | 'syncing_data'
  | 'error';

export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  category: string;
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  verified: boolean;
  popularity: number;
}

// Database mapping pour Supabase
export interface DbNutritionData {
  id: string;
  user_id: string;
  meal_id: string;
  food_item_id?: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  meal_type: string;
  meal_timing: string;
  created_at: string;
  updated_at: string;
}

export interface DbMealAnalysis {
  id: string;
  user_id: string;
  meal_id: string;
  total_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  meal_quality_score: number;
  nutrition_ai_analysis: any; // JSONB
  macro_balance_score: number;
  nutritional_density_score: number;
  satiety_prediction_score: number;
  created_at: string;
  updated_at: string;
}
