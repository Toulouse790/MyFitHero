// Export des types de la feature analytics

// ========================================
// ANALYTICS TYPES
// ========================================

export interface UserAnalytics {
  user_id: string;
  date_range: DateRange;
  fitness_score: number;
  progress_percentage: number;
  active_days: number;
  total_workouts: number;
  total_calories_burned: number;
  average_workout_duration: number;
  most_active_time: string;
  favorite_exercise_types: string[];
}

export interface WorkoutAnalytics {
  user_id: string;
  period: AnalyticsPeriod;
  total_sessions: number;
  average_duration: number;
  calories_burned: number;
  muscle_groups_trained: MuscleGroupStats[];
  intensity_distribution: IntensityStats;
  completion_rate: number;
  pr_achievements: PersonalRecord[];
}

export interface NutritionAnalytics {
  user_id: string;
  period: AnalyticsPeriod;
  average_calories: number;
  macros_distribution: MacroDistribution;
  water_intake_average: number;
  meal_timing_patterns: MealTimingStats;
  nutritional_goals_met: number;
  top_foods: PopularFood[];
}

export interface SleepAnalytics {
  user_id: string;
  period: AnalyticsPeriod;
  average_duration: number;
  average_quality: number;
  sleep_efficiency: number;
  bedtime_consistency: number;
  wake_time_consistency: number;
  sleep_debt: number;
  recovery_score: number;
}

export interface BodyCompositionAnalytics {
  user_id: string;
  measurements: BodyMeasurement[];
  trends: BodyTrend[];
  goals_progress: GoalProgress[];
  comparison_periods: ComparisonData[];
}

export interface DashboardAnalytics {
  user_id: string;
  last_updated: Date;
  quick_stats: QuickStats;
  weekly_summary: WeeklySummary;
  achievements: RecentAchievement[];
  recommendations: AnalyticsRecommendation[];
  trends: TrendData[];
}

// ========================================
// ENUMS & TYPES
// ========================================

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'heatmap';

export type MetricType = 
  | 'weight'
  | 'body_fat'
  | 'muscle_mass'
  | 'workout_frequency'
  | 'calories_burned'
  | 'sleep_quality'
  | 'nutrition_score'
  | 'hydration';

export type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'fluctuating';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface DateRange {
  start_date: Date;
  end_date: Date;
}

export interface MuscleGroupStats {
  muscle_group: string;
  sessions_count: number;
  total_volume: number;
  average_intensity: number;
}

export interface IntensityStats {
  low: number;
  moderate: number;
  high: number;
  peak: number;
}

export interface PersonalRecord {
  exercise_name: string;
  previous_best: number;
  new_record: number;
  improvement_percentage: number;
  achieved_at: Date;
}

export interface MacroDistribution {
  protein_percentage: number;
  carbs_percentage: number;
  fat_percentage: number;
  fiber_grams: number;
}

export interface MealTimingStats {
  breakfast_time: string;
  lunch_time: string;
  dinner_time: string;
  snack_frequency: number;
  eating_window: number;
}

export interface PopularFood {
  food_name: string;
  frequency: number;
  calories_per_serving: number;
  nutritional_score: number;
}

export interface BodyMeasurement {
  date: Date;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  waist_circumference?: number;
  chest_circumference?: number;
  arm_circumference?: number;
  thigh_circumference?: number;
}

export interface BodyTrend {
  metric: MetricType;
  direction: TrendDirection;
  change_percentage: number;
  time_period: AnalyticsPeriod;
}

export interface GoalProgress {
  goal_type: string;
  target_value: number;
  current_value: number;
  progress_percentage: number;
  estimated_completion: Date;
}

export interface ComparisonData {
  period_label: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
}

export interface QuickStats {
  workouts_this_week: number;
  calories_burned_today: number;
  sleep_score_last_night: number;
  water_intake_today: number;
  current_streak: number;
}

export interface WeeklySummary {
  total_workouts: number;
  total_active_time: number;
  average_intensity: number;
  calories_burned: number;
  goals_completed: number;
  consistency_score: number;
}

export interface RecentAchievement {
  title: string;
  description: string;
  earned_at: Date;
  icon: string;
  category: string;
}

export interface AnalyticsRecommendation {
  title: string;
  description: string;
  action_type: 'workout' | 'nutrition' | 'recovery' | 'habit';
  priority: 'low' | 'medium' | 'high';
}

export interface TrendData {
  label: string;
  data_points: DataPoint[];
  trend_direction: TrendDirection;
  chart_type: ChartType;
}

export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}
