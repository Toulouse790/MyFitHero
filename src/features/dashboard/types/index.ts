// ========================================
// DASHBOARD TYPES - Premium Analytics Hub
// ========================================

export interface DashboardMetrics {
  // Core Stats
  totalWorkouts: number;
  weeklyWorkouts: number;
  totalCalories: number;
  weeklyCalories: number;
  averageSleep: number;
  hydrationLevel: number;
  
  // Progress Tracking
  weeklyProgress: number; // percentage
  monthlyProgress: number;
  streakDays: number;
  completedGoals: number;
  
  // Advanced Metrics
  fitnessScore: number; // 0-100 AI calculated score
  recoveryScore: number;
  nutritionScore: number;
  consistencyScore: number;
}

export interface SmartInsight {
  id: string;
  type: 'achievement' | 'recommendation' | 'alert' | 'prediction';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  icon: string;
  timestamp: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'sleep' | 'general';
}

export interface WeeklyTrend {
  day: string;
  workouts: number;
  calories: number;
  sleep: number;
  recovery: number;
  nutrition: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number; // for ongoing achievements
  maxProgress?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
  enabled: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
  data?: any;
}

export interface PersonalizedGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category: 'workout' | 'nutrition' | 'recovery' | 'sleep';
  aiGenerated: boolean;
}

export interface SocialComparison {
  metric: string;
  userValue: number;
  averageValue: number;
  rank: number;
  totalUsers: number;
  improvement: number; // percentage change from last week
}

export interface WeatherImpact {
  temperature: number;
  condition: string;
  workoutRecommendation: string;
  icon: string;
}

export interface DashboardState {
  metrics: DashboardMetrics;
  insights: SmartInsight[];
  weeklyTrends: WeeklyTrend[];
  achievements: Achievement[];
  quickActions: QuickAction[];
  widgets: DashboardWidget[];
  goals: PersonalizedGoal[];
  socialComparisons: SocialComparison[];
  weather: WeatherImpact | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}