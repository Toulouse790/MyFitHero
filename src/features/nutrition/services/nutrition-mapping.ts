import { NutritionData, MealAnalysis, DbNutritionData, DbMealAnalysis } from '../types';

/**
 * Mapping sophistiqué pour les données nutrition entre Database (snake_case) et TypeScript (camelCase)
 * Inspiré de la même philosophie que database-mapping.ts pour les workouts
 */

// =====================================
// NUTRITION DATA MAPPING
// =====================================

export const dbToNutritionData = (dbData: DbNutritionData): NutritionData => {
  return {
    id: dbData.id,
    userId: dbData.user_id,
    mealId: dbData.meal_id,
    foodItemId: dbData.food_item_id,
    name: dbData.name,
    quantity: dbData.quantity,
    unit: dbData.unit as NutritionData['unit'],
    calories: dbData.calories,
    macros: {
      protein: dbData.protein_g,
      carbohydrates: dbData.carbohydrates_g,
      fat: dbData.fat_g,
      fiber: dbData.fiber_g,
      sugar: dbData.sugar_g,
      sodium: dbData.sodium_mg,
    },
    mealType: dbData.meal_type as NutritionData['mealType'],
    mealTiming: new Date(dbData.meal_timing),
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  };
};

export const nutritionDataToDb = (data: Partial<NutritionData>): Partial<DbNutritionData> => {
  const dbData: Partial<DbNutritionData> = {};

  if (data.id !== undefined) dbData.id = data.id;
  if (data.userId !== undefined) dbData.user_id = data.userId;
  if (data.mealId !== undefined) dbData.meal_id = data.mealId;
  if (data.foodItemId !== undefined) dbData.food_item_id = data.foodItemId;
  if (data.name !== undefined) dbData.name = data.name;
  if (data.quantity !== undefined) dbData.quantity = data.quantity;
  if (data.unit !== undefined) dbData.unit = data.unit;
  if (data.calories !== undefined) dbData.calories = data.calories;
  if (data.macros?.protein !== undefined) dbData.protein_g = data.macros.protein;
  if (data.macros?.carbohydrates !== undefined) dbData.carbohydrates_g = data.macros.carbohydrates;
  if (data.macros?.fat !== undefined) dbData.fat_g = data.macros.fat;
  if (data.macros?.fiber !== undefined) dbData.fiber_g = data.macros.fiber;
  if (data.macros?.sugar !== undefined) dbData.sugar_g = data.macros.sugar;
  if (data.macros?.sodium !== undefined) dbData.sodium_mg = data.macros.sodium;
  if (data.mealType !== undefined) dbData.meal_type = data.mealType;
  if (data.mealTiming !== undefined) dbData.meal_timing = data.mealTiming.toISOString();
  if (data.createdAt !== undefined) dbData.created_at = data.createdAt.toISOString();
  if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt.toISOString();

  return dbData;
};

// =====================================
// MEAL ANALYSIS MAPPING
// =====================================

export const dbToMealAnalysis = (dbData: DbMealAnalysis): MealAnalysis => {
  // Parse JSONB data with fallbacks
  const aiAnalysis = dbData.nutrition_ai_analysis || {};
  
  return {
    id: dbData.id,
    userId: dbData.user_id,
    mealId: dbData.meal_id,
    totalCalories: dbData.total_calories,
    macroBreakdown: {
      protein: {
        grams: dbData.protein_grams,
        percentage: (dbData.protein_grams * 4 / dbData.total_calories) * 100,
        calories: dbData.protein_grams * 4,
      },
      carbs: {
        grams: dbData.carbs_grams,
        percentage: (dbData.carbs_grams * 4 / dbData.total_calories) * 100,
        calories: dbData.carbs_grams * 4,
      },
      fat: {
        grams: dbData.fat_grams,
        percentage: (dbData.fat_grams * 9 / dbData.total_calories) * 100,
        calories: dbData.fat_grams * 9,
      },
    },
    nutritionScores: {
      overallQuality: dbData.meal_quality_score || 0,
      macroBalance: dbData.macro_balance_score || 0,
      micronutrientDensity: dbData.nutritional_density_score || 0,
      processedFoodRatio: aiAnalysis.processed_food_ratio || 0,
      satietyIndex: dbData.satiety_prediction_score || 0,
      inflammatoryIndex: aiAnalysis.inflammatory_index || 0,
    },
    aiRecommendations: {
      improvements: aiAnalysis.improvements || [],
      alternatives: aiAnalysis.alternatives || [],
      timing: aiAnalysis.timing_suggestions || [],
      portionAdjustments: aiAnalysis.portion_adjustments || [],
    },
    complianceMetrics: {
      calorieTarget: aiAnalysis.calorie_compliance || { actual: 0, target: 0, variance: 0 },
      proteinTarget: aiAnalysis.protein_compliance || { actual: 0, target: 0, variance: 0 },
      carbTarget: aiAnalysis.carb_compliance || { actual: 0, target: 0, variance: 0 },
      fatTarget: aiAnalysis.fat_compliance || { actual: 0, target: 0, variance: 0 },
    },
    metabolicImpact: {
      estimatedGlycemicLoad: aiAnalysis.glycemic_load || 0,
      insulinResponse: aiAnalysis.insulin_response || 'moderate',
      satietyDuration: aiAnalysis.satiety_duration || 3,
      energyProvision: aiAnalysis.energy_provision || 'sustained',
    },
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  };
};

export const mealAnalysisToDb = (analysis: Partial<MealAnalysis>): Partial<DbMealAnalysis> => {
  const dbData: Partial<DbMealAnalysis> = {};

  if (analysis.id !== undefined) dbData.id = analysis.id;
  if (analysis.userId !== undefined) dbData.user_id = analysis.userId;
  if (analysis.mealId !== undefined) dbData.meal_id = analysis.mealId;
  if (analysis.totalCalories !== undefined) dbData.total_calories = analysis.totalCalories;
  if (analysis.macroBreakdown?.protein?.grams !== undefined) dbData.protein_grams = analysis.macroBreakdown.protein.grams;
  if (analysis.macroBreakdown?.carbs?.grams !== undefined) dbData.carbs_grams = analysis.macroBreakdown.carbs.grams;
  if (analysis.macroBreakdown?.fat?.grams !== undefined) dbData.fat_grams = analysis.macroBreakdown.fat.grams;
  if (analysis.nutritionScores?.overallQuality !== undefined) dbData.meal_quality_score = analysis.nutritionScores.overallQuality;
  if (analysis.nutritionScores?.macroBalance !== undefined) dbData.macro_balance_score = analysis.nutritionScores.macroBalance;
  if (analysis.nutritionScores?.micronutrientDensity !== undefined) dbData.nutritional_density_score = analysis.nutritionScores.micronutrientDensity;
  if (analysis.nutritionScores?.satietyIndex !== undefined) dbData.satiety_prediction_score = analysis.nutritionScores.satietyIndex;
  
  // Construire le JSONB pour nutrition_ai_analysis
  if (analysis.aiRecommendations || analysis.complianceMetrics || analysis.metabolicImpact || analysis.nutritionScores) {
    dbData.nutrition_ai_analysis = {
      ...(analysis.aiRecommendations && {
        improvements: analysis.aiRecommendations.improvements,
        alternatives: analysis.aiRecommendations.alternatives,
        timing_suggestions: analysis.aiRecommendations.timing,
        portion_adjustments: analysis.aiRecommendations.portionAdjustments,
      }),
      ...(analysis.complianceMetrics && {
        calorie_compliance: analysis.complianceMetrics.calorieTarget,
        protein_compliance: analysis.complianceMetrics.proteinTarget,
        carb_compliance: analysis.complianceMetrics.carbTarget,
        fat_compliance: analysis.complianceMetrics.fatTarget,
      }),
      ...(analysis.metabolicImpact && {
        glycemic_load: analysis.metabolicImpact.estimatedGlycemicLoad,
        insulin_response: analysis.metabolicImpact.insulinResponse,
        satiety_duration: analysis.metabolicImpact.satietyDuration,
        energy_provision: analysis.metabolicImpact.energyProvision,
      }),
      ...(analysis.nutritionScores && {
        processed_food_ratio: analysis.nutritionScores.processedFoodRatio,
        inflammatory_index: analysis.nutritionScores.inflammatoryIndex,
      }),
    };
  }
  
  if (analysis.createdAt !== undefined) dbData.created_at = analysis.createdAt.toISOString();
  if (analysis.updatedAt !== undefined) dbData.updated_at = analysis.updatedAt.toISOString();

  return dbData;
};

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Calcule les scores nutritionnels automatiquement
 */
export const calculateNutritionScores = (
  calories: number, 
  protein: number, 
  carbs: number, 
  fat: number, 
  fiber: number,
  sugar: number
) => {
  // Score qualité globale (0-100)
  const overallQuality = Math.min(100, Math.max(0,
    (calories >= 300 && calories <= 800 ? 30 : 15) + // Calories appropriées
    (protein >= 15 ? 25 : protein >= 8 ? 15 : 5) + // Protéines suffisantes
    (fiber >= 5 ? 20 : fiber >= 2 ? 10 : 0) + // Fibres élevées
    (sugar <= 10 ? 15 : sugar <= 25 ? 8 : 0) + // Sucre modéré
    10 // Score de base
  ));

  // Score équilibre macros (0-100)
  const proteinPercentage = (protein * 4 / calories);
  const carbPercentage = (carbs * 4 / calories);
  const fatPercentage = (fat * 9 / calories);
  
  const macroBalance = Math.min(100, Math.max(0,
    50 + 
    (proteinPercentage >= 0.15 && proteinPercentage <= 0.35 ? 20 : -10) +
    (carbPercentage >= 0.45 && carbPercentage <= 0.65 ? 20 : -10) +
    (fatPercentage >= 0.20 && fatPercentage <= 0.35 ? 10 : -5)
  ));

  return {
    overallQuality: Math.round(overallQuality),
    macroBalance: Math.round(macroBalance),
  };
};

/**
 * Génère des recommandations IA basées sur l'analyse nutritionnelle
 */
export const generateNutritionRecommendations = (
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  mealType: string
): string[] => {
  const recommendations: string[] = [];

  // Recommandations calories
  if (calories < 300) {
    recommendations.push("Considérez augmenter la taille des portions pour un apport énergétique suffisant");
  } else if (calories > 800) {
    recommendations.push("Repas copieux - parfait pour l'activité physique intense");
  }

  // Recommandations protéines
  if (protein < 15) {
    recommendations.push("Ajoutez une source de protéines (œufs, légumineuses, viande maigre)");
  } else if (protein > 40) {
    recommendations.push("Excellent apport en protéines pour la récupération musculaire");
  }

  // Recommandations fibres
  if (fiber < 3) {
    recommendations.push("Intégrez plus de légumes ou céréales complètes pour les fibres");
  }

  // Recommandations par type de repas
  if (mealType === 'breakfast' && carbs < 30) {
    recommendations.push("Le petit-déjeuner bénéficierait de plus de glucides pour l'énergie matinale");
  }
  
  if (mealType === 'post_workout' && protein < 20) {
    recommendations.push("Augmentez les protéines dans les 30min post-entraînement pour la récupération");
  }

  return recommendations;
};