export interface HealthData {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  workoutData?: {
    totalWorkouts: number;
    totalDuration: number; // minutes
    avgIntensity: number; // 0-100
    workoutScore: number; // 0-100
    recoveryScore: number; // 0-100
    strengthProgress: number; // 0-100
    cardioProgress: number; // 0-100
  };
  nutritionData?: {
    totalCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    nutritionScore: number; // 0-100
    hydrationScore: number; // 0-100
    mealQuality: number; // 0-100
  };
  sleepData?: {
    sleepDuration: number; // minutes
    sleepEfficiency: number; // percentage
    sleepQuality: number; // 0-100
    recoveryScore: number; // 0-100
    circadianAlignment: number; // 0-100
  };
  hydrationData?: {
    totalIntake: number; // ml
    dailyGoal: number; // ml
    hydrationScore: number; // 0-100
    efficiencyScore: number; // 0-100
    dehydrationRisk: 'optimal' | 'mild' | 'moderate' | 'severe';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthAnalysis {
  id: string;
  userId: string;
  healthDataId: string;
  analysisDate: Date;
  globalHealthScore: number; // 0-100
  pillarScores: {
    fitness: number; // 0-100
    nutrition: number; // 0-100
    recovery: number; // 0-100
    hydration: number; // 0-100
  };
  balanceMetrics: {
    pillarHarmony: number; // 0-100 - équilibre entre les piliers
    consistencyScore: number; // 0-100 - régularité
    synergisticEffect: number; // 0-100 - effet combiné
    weakestLink: 'fitness' | 'nutrition' | 'recovery' | 'hydration';
    strongestPillar: 'fitness' | 'nutrition' | 'recovery' | 'hydration';
  };
  performanceMetrics: {
    physicalPerformance: number; // 0-100
    mentalPerformance: number; // 0-100
    energyLevel: number; // 0-100
    recoveryCapacity: number; // 0-100
    adaptationRate: number; // 0-100
  };
  healthRisks: {
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    specificRisks: string[];
    preventiveActions: string[];
    urgentConcerns: string[];
  };
  aiInsights: {
    keyStrengths: string[];
    improvementPriorities: string[];
    crossPillarRecommendations: string[];
    personalizedStrategy: string[];
    habitFormationTips: string[];
  };
  predictiveMetrics: {
    next7DaysProjection: {
      fitness: number;
      nutrition: number;
      recovery: number;
      hydration: number;
    };
    goalAchievementProbability: number; // 0-100
    burnoutRisk: number; // 0-100
    plateauPrediction: number; // 0-100
  };
  crossPillarCorrelations: {
    workoutNutritionCorr: number; // -100 to +100
    sleepPerformanceCorr: number; // -100 to +100
    hydrationRecoveryCorr: number; // -100 to +100
    nutritionSleepCorr: number; // -100 to +100
  };
  optimizationSuggestions: {
    workoutTiming: string[];
    nutritionTiming: string[];
    sleepOptimization: string[];
    hydrationStrategy: string[];
    recoveryProtocol: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthGoals {
  userId: string;
  targetGlobalScore: number; // 0-100
  pillarPriorities: {
    fitness: 'low' | 'medium' | 'high';
    nutrition: 'low' | 'medium' | 'high';
    recovery: 'low' | 'medium' | 'high';
    hydration: 'low' | 'medium' | 'high';
  };
  timeFrame: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  specificTargets: {
    workoutFrequency: number; // per week
    sleepQualityTarget: number; // 0-100
    nutritionConsistency: number; // 0-100
    hydrationGoal: number; // ml/day
  };
  personalContext: {
    lifestyle: 'sedentary' | 'active' | 'athletic' | 'professional_athlete';
    stressLevel: 'low' | 'medium' | 'high';
    availableTime: number; // hours per day
    healthConditions: string[];
  };
}

export interface WeeklyHealthSummary {
  weekStartDate: string;
  userId: string;
  averageScores: {
    globalHealth: number;
    fitness: number;
    nutrition: number;
    recovery: number;
    hydration: number;
  };
  weeklyTrends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  achievements: {
    milestones: string[];
    streaks: string[];
    improvements: string[];
  };
  challenges: {
    difficulties: string[];
    missedTargets: string[];
    concernAreas: string[];
  };
  aiWeeklyInsights: {
    keyWins: string[];
    focusAreas: string[];
    nextWeekStrategy: string[];
    longTermImpact: string[];
  };
}

// States pour le composant React
export type HealthTrackingState = 
  | 'idle'
  | 'loading_data'
  | 'analyzing_health'
  | 'generating_insights'
  | 'updating_goals'
  | 'syncing_pillars'
  | 'viewing_analytics'
  | 'error';

export interface PillarStatus {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
  dataPoints: number;
}

// Database mapping pour Supabase
export interface DbHealthData {
  id: string;
  user_id: string;
  health_date: string;
  global_health_score: number;
  fitness_score: number;
  nutrition_score: number;
  recovery_score: number;
  hydration_score: number;
  pillar_data: any; // JSONB
  health_ai_analysis: any; // JSONB
  created_at: string;
  updated_at: string;
}

export interface DbHealthAnalysis {
  id: string;
  user_id: string;
  health_data_id: string;
  analysis_date: string;
  global_health_score: number;
  fitness_score: number;
  nutrition_score: number;
  recovery_score: number;
  hydration_score: number;
  balance_harmony_score: number;
  consistency_score: number;
  synergistic_effect_score: number;
  risk_level: string;
  health_ai_analysis: any; // JSONB
  created_at: string;
  updated_at: string;
}