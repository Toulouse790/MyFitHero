export interface HydrationEntry {
  id: string;
  userId: string;
  amount_ml: number;
  timestamp: string;
  drink_type: 'water' | 'coffee' | 'tea' | 'juice' | 'alcohol' | 'sports' | 'soda';
  temperature: 'cold' | 'room' | 'warm' | 'hot';
  created_at: string;
  updated_at: string;
}

export interface HydrationGoal {
  id?: string;
  userId: string;
  dailyTarget: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface HydrationStats {
  daily: {
    current: number;
    target: number;
    percentage: number;
    entries: HydrationEntry[];
  };
  weekly: {
    total: number;
    average: number;
    target: number;
    percentage: number;
    dailyBreakdown: any[];
  };
}

export interface HydrationStore {
  entries: HydrationEntry[];
  goals: HydrationGoal[];
  currentGoal: HydrationGoal | undefined;
  stats: HydrationStats | undefined;
  isLoading: boolean;
  error: string | undefined;
  
  // Actions
  addEntry: (entryData: Omit<HydrationEntry, 'id' | 'userId' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<HydrationEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loadEntries: (startDate?: string, endDate?: string) => Promise<void>;
  
  setGoal: (dailyTarget: number) => Promise<void>;
  updateGoal: (id: string, updates: Partial<HydrationGoal>) => Promise<void>;
  loadGoals: () => Promise<void>;
  
  calculateStats: (period: 'daily' | 'weekly' | 'monthly') => Promise<void>;
}

export interface HydrationData {
  id: string;
  userId: string;
  hydrationDate: string; // YYYY-MM-DD
  dailyGoal: number; // ml
  totalIntake: number; // ml
  waterIntake: number; // ml
  otherFluids: {
    coffee: number; // ml
    tea: number; // ml
    juice: number; // ml
    alcohol: number; // ml
    sportsDrinks: number; // ml
    sodas: number; // ml
  };
  hydrationTimestamps: {
    time: string; // HH:MM
    amount: number; // ml
    fluidType: 'water' | 'coffee' | 'tea' | 'juice' | 'alcohol' | 'sports' | 'soda';
    temperature: 'cold' | 'room' | 'warm' | 'hot';
  }[];
  physicalActivity: {
    exerciseDuration: number; // minutes
    exerciseIntensity: 'low' | 'moderate' | 'high' | 'extreme';
    sweatRate: number; // ml/hour estimated
    environmentalTemp: number; // celsius
    humidity: number; // percentage
  };
  bodyMetrics: {
    weight: number; // kg
    bodyFatPercentage?: number;
    urineColor: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Urine color chart
    urineFrequency: number; // times per day
  };
  symptoms: {
    thirst: 'none' | 'mild' | 'moderate' | 'severe';
    headache: boolean;
    fatigue: boolean;
    dizziness: boolean;
    drymouth: boolean;
    darkUrine: boolean;
    constipation: boolean;
  };
  mood: {
    energyLevel: number; // 1-10
    concentration: number; // 1-10
    overallMood: 'terrible' | 'poor' | 'ok' | 'good' | 'excellent';
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HydrationAnalysis {
  id: string;
  userId: string;
  hydrationDataId: string;
  analysisDate: Date;
  hydrationScores: {
    overallHydration: number; // 0-100
    hydrationEfficiency: number; // 0-100
    qualityScore: number; // 0-100
    timingOptimization: number; // 0-100
    recoveryHydration: number; // 0-100
    balanceScore: number; // 0-100
  };
  fluidBalance: {
    optimalIntake: number; // ml
    actualIntake: number; // ml
    deficit: number; // ml
    surplus: number; // ml
    absorptionRate: number; // percentage
    retentionScore: number; // 0-100
  };
  performanceImpact: {
    cognitiveFunction: number; // 0-100
    physicalPerformance: number; // 0-100
    recoveryRate: number; // 0-100
    metabolicEfficiency: number; // 0-100
  };
  dehydrationRisk: {
    currentLevel: 'optimal' | 'mild' | 'moderate' | 'severe';
    riskFactors: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    timeToOptimal: number; // minutes
  };
  aiInsights: {
    primaryIssues: string[];
    improvementSuggestions: string[];
    optimizationStrategies: string[];
    hydrationTiming: string[];
    fluidRecommendations: string[];
  };
  predictiveMetrics: {
    nextHourNeed: number; // ml
    endOfDayProjection: number; // ml
    performanceImpactTomorrow: 'positive' | 'neutral' | 'negative';
    optimalNextIntake: string; // time
  };
  environmentalFactors: {
    temperatureImpact: number; // 0-100
    humidityImpact: number; // 0-100
    altitudeAdjustment: number; // ml
    seasonalFactors: string[];
  };
  personalizedTargets: {
    baselineNeed: number; // ml/day
    exerciseAdjustment: number; // ml
    environmentalAdjustment: number; // ml
    finalTarget: number; // ml
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyHydrationSummary {
  weekStartDate: string;
  userId: string;
  averageMetrics: {
    dailyIntake: number; // ml
    goalAchievement: number; // percentage
    hydrationQuality: number; // 0-100
    consistency: number; // 0-100
  };
  bestDay: {
    date: string;
    score: number;
    achievement: string;
  };
  worstDay: {
    date: string;
    score: number;
    issues: string[];
  };
  weeklyTrends: {
    improvementAreas: string[];
    consistencyRating: number; // 0-100
    performanceCorrelation: number; // -100 to +100
  };
  aiWeeklyInsights: {
    keyWins: string[];
    majorConcerns: string[];
    nextWeekStrategy: string[];
    habitRecommendations: string[];
  };
}

export interface HydrationGoals {
  userId: string;
  baseTarget: number; // ml/day
  activityMultiplier: number; // 1.0-2.0
  environmentalAdjustment: boolean;
  wakeUpHydration: number; // ml
  preWorkoutHydration: number; // ml
  duringWorkoutRate: number; // ml/15min
  postWorkoutHydration: number; // ml
  bedtimeLimit: number; // hours before bed
  preferredFluids: {
    water: number; // percentage
    electrolyteBalance: boolean;
    caffeineLimit: number; // mg/day
    alcoholLimit: number; // ml/week
  };
  reminderSettings: {
    enabled: boolean;
    frequency: number; // minutes
    smartReminders: boolean; // based on activity
    customMessages: string[];
  };
}

// States pour le composant React
export type HydrationTrackingState = 
  | 'idle'
  | 'logging_intake'
  | 'analyzing_hydration'
  | 'updating_goals'
  | 'syncing_data'
  | 'viewing_insights'
  | 'setting_reminders'
  | 'error';

export interface FluidIntakeEvent {
  id: string;
  timestamp: Date;
  amount: number; // ml
  fluidType: HydrationData['hydrationTimestamps'][0]['fluidType'];
  temperature: HydrationData['hydrationTimestamps'][0]['temperature'];
  context?: 'meal' | 'workout' | 'reminder' | 'thirst' | 'habit';
}

// Database mapping pour Supabase
export interface DbHydrationData {
  id: string;
  user_id: string;
  hydration_date: string;
  daily_goal_ml: number;
  total_intake_ml: number;
  water_intake_ml: number;
  other_fluids_ml: any; // JSONB
  hydration_timestamps: any; // JSONB
  physical_activity: any; // JSONB
  body_metrics: any; // JSONB
  symptoms: any; // JSONB
  mood_data: any; // JSONB
  hydration_score: number;
  quality_score: number;
  efficiency_score: number;
  hydration_ai_analysis: any; // JSONB
  created_at: string;
  updated_at: string;
}

export interface DbHydrationAnalysis {
  id: string;
  user_id: string;
  hydration_data_id: string;
  analysis_date: string;
  overall_hydration_score: number;
  hydration_efficiency_score: number;
  quality_score: number;
  timing_optimization_score: number;
  recovery_hydration_score: number;
  balance_score: number;
  dehydration_risk_level: string;
  hydration_ai_analysis: any; // JSONB
  created_at: string;
  updated_at: string;
}
