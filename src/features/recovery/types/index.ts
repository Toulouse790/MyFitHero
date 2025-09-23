// Export des types de la feature recovery

// ========================================
// RECOVERY TYPES
// ========================================

export interface RecoveryData {
  user_id: string;
  current_metrics: RecoveryMetrics;
  recent_activities: RecoveryActivity[];
  trends: RecoveryTrendData[];
  overall_score: number;
  last_updated: Date;
}

export interface RecoveryActivity {
  id: string;
  user_id: string;
  type: RecoveryType;
  duration: number; // in minutes
  intensity?: number; // 1-5
  notes?: string;
  started_at: Date;
  completed_at?: Date;
  effectiveness_rating?: number; // 1-5
}

export interface RecoveryTrendData {
  date: string;
  overall: number;
  sleep: number;
  stress: number;
  energy: number;
  hrv: number;
}

export interface RecoverySession {
  id: string;
  user_id: string;
  type: RecoveryType;
  duration: number; // in minutes
  intensity: RecoveryIntensity;
  notes?: string;
  started_at: Date;
  completed_at?: Date;
  effectiveness_rating?: number; // 1-5
  sleep_quality_before?: number; // 1-5
  sleep_quality_after?: number; // 1-5
  stress_level_before?: number; // 1-5
  stress_level_after?: number; // 1-5
}

export interface RecoveryMetrics {
  user_id: string;
  date: Date;
  hrv_score?: number; // Heart Rate Variability
  resting_heart_rate?: number;
  sleep_score?: number;
  stress_level?: number;
  recovery_score: number; // Overall 0-100
  readiness_score: number; // Training readiness 0-100
  fatigue_level: number; // 1-5
  soreness_level: number; // 1-5
  energy_level: number; // 1-5
}

export interface SleepData {
  id: string;
  user_id: string;
  date: Date;
  bedtime: Date;
  wake_time: Date;
  total_sleep_duration: number; // in minutes
  deep_sleep_duration?: number;
  rem_sleep_duration?: number;
  light_sleep_duration?: number;
  sleep_efficiency?: number; // percentage
  sleep_quality: number; // 1-5
  sleep_disturbances?: number;
  wake_ups?: number;
  time_to_sleep?: number; // minutes to fall asleep
}

export interface StressManagement {
  id: string;
  user_id: string;
  date: Date;
  stress_level: number; // 1-5
  stress_sources: StressSource[];
  coping_strategies: CopingStrategy[];
  meditation_minutes?: number;
  breathing_exercises?: number;
  relaxation_techniques?: RelaxationTechnique[];
  mood_rating: number; // 1-5
}

export interface RecoveryPlan {
  id: string;
  user_id: string;
  name: string;
  description: string;
  duration_weeks: number;
  recovery_activities: PlannedRecoveryActivity[];
  goals: RecoveryGoal[];
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
  is_active: boolean;
}

// ========================================
// ENUMS & TYPES
// ========================================

export type RecoveryType = 
  | 'active_recovery'
  | 'passive_recovery'
  | 'stretching'
  | 'foam_rolling'
  | 'massage'
  | 'sauna'
  | 'ice_bath'
  | 'meditation'
  | 'breathing_exercises'
  | 'yoga'
  | 'tai_chi'
  | 'walking'
  | 'swimming'
  | 'cycling_easy';

export type RecoveryIntensity = 'very_light' | 'light' | 'moderate';

export type StressSource = 
  | 'work'
  | 'family'
  | 'health'
  | 'finances'
  | 'relationships'
  | 'training'
  | 'competition'
  | 'travel'
  | 'sleep_deprivation'
  | 'other';

export type CopingStrategy = 
  | 'meditation'
  | 'breathing_exercises'
  | 'physical_activity'
  | 'social_support'
  | 'time_management'
  | 'problem_solving'
  | 'relaxation'
  | 'hobby'
  | 'professional_help';

export type RelaxationTechnique = 
  | 'progressive_muscle_relaxation'
  | 'guided_imagery'
  | 'autogenic_training'
  | 'mindfulness'
  | 'body_scan'
  | 'mantra_meditation'
  | 'loving_kindness';

export type RecoveryGoal = 
  | 'improve_sleep_quality'
  | 'reduce_stress'
  | 'increase_hrv'
  | 'reduce_fatigue'
  | 'improve_mood'
  | 'enhance_performance'
  | 'prevent_injury'
  | 'maintain_consistency';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface PlannedRecoveryActivity {
  id: string;
  type: RecoveryType;
  duration: number;
  frequency_per_week: number;
  intensity: RecoveryIntensity;
  instructions?: string;
  equipment_needed?: string[];
}

export interface RecoveryRecommendation {
  id: string;
  user_id?: string;
  type: RecoveryType;
  title: string;
  description: string;
  action: string;
  recovery_type?: RecoveryType;
  priority: 'low' | 'medium' | 'high';
  duration: number;
  timeToComplete: number; // minutes
  estimatedBenefit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  created_at?: Date;
  expires_at?: Date;
}

// Types IA avancés pour les nouvelles fonctionnalités
export interface AIInsight {
  id: string;
  type: 'pattern' | 'correlation' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  data_points: number;
}

export interface RecoveryPrediction {
  date: string;
  predicted_score: number;
  confidence: number;
  factors: PredictionFactor[];
  recommendation: string;
}

export interface PredictionFactor {
  name: string;
  impact: number; // percentage
  trend: 'positive' | 'negative' | 'neutral';
  current_value: number;
}

export interface RecoveryPattern {
  pattern_type: 'weekly' | 'monthly' | 'seasonal';
  description: string;
  strength: number; // 0-1
  detected_at: Date;
  recommendations: string[];
}

export interface BiometricTrend {
  metric: string;
  current_value: number;
  trend_7d: number;
  trend_30d: number;
  percentile: number; // compared to user's history
  status: 'improving' | 'stable' | 'declining';
}

export interface RecoveryProgress {
  user_id: string;
  week_start: Date;
  total_recovery_time: number;
  activities_completed: number;
  average_effectiveness: number;
  sleep_quality_improvement: number;
  stress_reduction: number;
  recovery_score_trend: number;
}

export interface WellnessCheckIn {
  id: string;
  user_id: string;
  date: Date;
  energy_level: number; // 1-5
  mood: number; // 1-5
  stress_level: number; // 1-5
  motivation: number; // 1-5
  muscle_soreness: number; // 1-5
  sleep_quality: number; // 1-5
  hydration_level: number; // 1-5
  nutrition_quality: number; // 1-5
  overall_wellness: number; // 1-5
  notes?: string;
}

export interface RecoveryAnalytics {
  user_id: string;
  period: 'week' | 'month' | 'quarter';
  average_recovery_score: number;
  sleep_quality_trend: number;
  stress_level_trend: number;
  most_effective_activities: RecoveryType[];
  recovery_consistency: number;
  recommendations: RecoveryRecommendation[];
}
