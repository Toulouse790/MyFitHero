export interface SleepData {
  id: string;
  userId: string;
  sleepDate: string; // YYYY-MM-DD
  bedtime: Date;
  wakeTime: Date;
  sleepDuration: number; // minutes
  sleepLatency: number; // minutes to fall asleep
  nightAwakenings: number;
  timeAwakeDuringNight: number; // minutes
  sleepEfficiency: number; // percentage
  sleepStages: {
    lightSleep: number; // minutes
    deepSleep: number; // minutes
    remSleep: number; // minutes
    awakeTime: number; // minutes
  };
  heartRateVariability?: {
    avgHrv: number;
    minHrv: number;
    maxHrv: number;
    restingHeartRate: number;
  };
  environmentalFactors: {
    roomTemperature?: number;
    noiseLevel?: 'quiet' | 'moderate' | 'noisy';
    lightExposure?: 'dark' | 'dim' | 'bright';
    mattressComfort?: number; // 1-10
  };
  preSleepActivities: {
    screenTime: number; // minutes before bed
    caffeine: boolean;
    alcohol: boolean;
    exercise: boolean;
    meditation: boolean;
    reading: boolean;
  };
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  morningMood: 'terrible' | 'poor' | 'ok' | 'good' | 'excellent';
  energyLevel: number; // 1-10
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepAnalysis {
  id: string;
  userId: string;
  sleepDataId: string;
  analysisDate: Date;
  sleepScores: {
    overallQuality: number; // 0-100
    recoveryScore: number; // 0-100
    sleepDebt: number; // minutes
    circadianAlignment: number; // 0-100
    sleepConsistency: number; // 0-100
    restorationIndex: number; // 0-100
  };
  sleepPhases: {
    optimalDeepSleep: boolean;
    remQuality: number; // 0-100
    sleepCycleCompleteness: number; // 0-100
    wakefulnessPattern: 'normal' | 'fragmented' | 'restless';
  };
  circadianMetrics: {
    chronotype: 'early' | 'intermediate' | 'late';
    optimalBedtime: string; // HH:MM
    optimalWakeTime: string; // HH:MM
    lightExposureRecommendation: string;
    mealTimingImpact: 'positive' | 'neutral' | 'negative';
  };
  recoveryMetrics: {
    physicalRecovery: number; // 0-100
    mentalRecovery: number; // 0-100
    emotionalRecovery: number; // 0-100
    autonomicRecovery: number; // 0-100 (based on HRV)
  };
  aiInsights: {
    primaryIssues: string[];
    improvementSuggestions: string[];
    optimizationStrategies: string[];
    lifestyleRecommendations: string[];
  };
  predictiveMetrics: {
    tomorrowEnergyPrediction: number; // 0-100
    recoveryTimeEstimate: number; // hours
    performanceImpact: 'minimal' | 'moderate' | 'significant';
    optimalWorkoutTiming: string[];
  };
  trends: {
    weeklyPattern: 'improving' | 'stable' | 'declining';
    seasonalFactors: string[];
    stressImpact: number; // 0-100
    workoutCorrelation: number; // -100 to +100
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklySleepSummary {
  weekStartDate: string;
  userId: string;
  averageMetrics: {
    sleepDuration: number;
    sleepEfficiency: number;
    sleepQuality: number;
    recoveryScore: number;
    bedtimeConsistency: number;
  };
  sleepDebtAccumulation: number; // total minutes
  bestNight: {
    date: string;
    score: number;
    reason: string;
  };
  worstNight: {
    date: string;
    score: number;
    issues: string[];
  };
  weeklyTrends: {
    improvementAreas: string[];
    consistencyRating: number; // 0-100
    recoveryPattern: 'excellent' | 'good' | 'needs_improvement';
  };
  aiWeeklyInsights: {
    keyWins: string[];
    majorConcerns: string[];
    nextWeekStrategy: string[];
    lifestyleCorrelations: string[];
  };
}

export interface SleepGoals {
  userId: string;
  targetSleepDuration: number; // minutes
  targetBedtime: string; // HH:MM
  targetWakeTime: string; // HH:MM
  sleepQualityTarget: number; // 0-100
  priorityAreas: {
    improveSleepDuration: boolean;
    improveDeepSleep: boolean;
    reduceAwakenings: boolean;
    optimizeCircadianRhythm: boolean;
    enhanceRecovery: boolean;
  };
  lifestyleFactors: {
    workSchedule: 'fixed' | 'shift' | 'flexible';
    exercisePreference: 'morning' | 'afternoon' | 'evening';
    socialCommitments: 'low' | 'moderate' | 'high';
    travelFrequency: 'rare' | 'occasional' | 'frequent';
  };
}

// States pour le composant React
export type SleepTrackingState = 
  | 'idle'
  | 'logging_sleep'
  | 'analyzing_sleep'
  | 'updating_goals'
  | 'syncing_data'
  | 'viewing_insights'
  | 'error';

export interface SleepEnvironment {
  temperature: number;
  humidity: number;
  noiseLevel: number;
  lightLevel: number;
  airQuality: number;
}

// Database mapping pour Supabase
export interface DbSleepData {
  id: string;
  user_id: string;
  sleep_date: string;
  bedtime: string;
  wake_time: string;
  sleep_duration_minutes: number;
  sleep_latency_minutes: number;
  night_awakenings: number;
  time_awake_minutes: number;
  sleep_efficiency: number;
  light_sleep_minutes: number;
  deep_sleep_minutes: number;
  rem_sleep_minutes: number;
  awake_minutes: number;
  sleep_quality_score: number;
  sleep_ai_analysis: any; // JSONB
  recovery_score: number;
  circadian_rhythm_score: number;
  created_at: string;
  updated_at: string;
}

export interface DbSleepAnalysis {
  id: string;
  user_id: string;
  sleep_data_id: string;
  analysis_date: string;
  overall_quality_score: number;
  recovery_score: number;
  sleep_debt_minutes: number;
  circadian_alignment_score: number;
  sleep_consistency_score: number;
  restoration_index: number;
  sleep_ai_analysis: any; // JSONB
  created_at: string;
  updated_at: string;
}

// Types pour SleepChart
export interface SleepStats {
  averageDuration: number;
  averageQuality: number;
  bedtimeConsistency: number;
  totalSessions: number;
  improvementTrend: number;
  weeklyData: SleepDayData[];
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
  sleepDebt?: number;
}

export interface SleepDayData {
  date: string;
  duration: number;
  quality: number;
  efficiency: number;
}

// Types pour useSleepStore
export interface SleepEntry {
  id: string;
  userId: string;
  date: string;
  bedtime: Date;
  wakeTime: Date;
  quality: number; // 1-10
  duration: number; // minutes
  notes?: string;
  factors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepGoal {
  id: string;
  userId: string;
  targetDuration: number; // minutes
  targetBedtime: string; // HH:mm
  targetWakeTime: string; // HH:mm
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepStore {
  entries: SleepEntry[];
  currentEntry: SleepEntry | undefined;
  goals: SleepGoal[];
  currentGoal: SleepGoal | undefined;
  stats: SleepStats | undefined;
  isLoading: boolean;
  error: string | undefined;
  
  // Actions
  addEntry: (entryData: Partial<SleepEntry>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<SleepEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loadEntries: () => Promise<void>;
  addGoal: (goalData: Partial<SleepGoal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<SleepGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  loadGoals: () => Promise<void>;
  calculateStats: () => void;
}

// 🔧 MISSING TYPES FOR TYPESCRIPT FIXES

export interface SportSleepConfig {
  sport: string;
  emoji?: string;
  recommendedSleepHours: number;
  recoveryImportance: 'low' | 'medium' | 'high' | 'critical';
  sleepFactors: SleepFactor[];
  recommendations: string[];
}

export interface SleepFactor {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  impact: 'positive' | 'negative' | 'neutral' | 'high' | 'medium' | 'low';
  severity: 'low' | 'medium' | 'high';
  category: 'environment' | 'lifestyle' | 'nutrition' | 'training' | 'technology' | 'mental' | 'physical';
}
