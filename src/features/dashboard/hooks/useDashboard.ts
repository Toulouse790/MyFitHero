import { useCallback, useEffect, useState } from 'react';
import { DashboardState, DashboardMetrics, SmartInsight, WeeklyTrend, Achievement, PersonalizedGoal } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

export const useDashboard = () => {
  const { user } = useAuth();
  
  const [state, setState] = useState<DashboardState>({
    metrics: {
      totalWorkouts: 0,
      weeklyWorkouts: 0,
      totalCalories: 0,
      weeklyCalories: 0,
      averageSleep: 0,
      hydrationLevel: 0,
      weeklyProgress: 0,
      monthlyProgress: 0,
      streakDays: 0,
      completedGoals: 0,
      fitnessScore: 0,
      recoveryScore: 0,
      nutritionScore: 0,
      consistencyScore: 0,
    },
    insights: [],
    weeklyTrends: [],
    achievements: [],
    quickActions: [],
    widgets: [],
    goals: [],
    socialComparisons: [],
    weather: null,
    loading: true,
    error: null,
    lastUpdated: new Date().toISOString(),
  });

  // Fetch comprehensive dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate AI-powered data aggregation
      const [metrics, insights, trends, achievements, goals] = await Promise.all([
        fetchUserMetrics(),
        fetchSmartInsights(),
        fetchWeeklyTrends(),
        fetchUserAchievements(),
        fetchPersonalizedGoals(),
      ]);

      setState(prev => ({
        ...prev,
        metrics,
        insights,
        weeklyTrends: trends,
        achievements,
        goals,
        loading: false,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur lors du chargement du dashboard',
        loading: false,
      }));
      
      toast.error("Impossible de charger les données du dashboard");
    }
  }, [user?.id, toast]);

  // Mock advanced metrics calculation
  const fetchUserMetrics = async (): Promise<DashboardMetrics> => {
    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      totalWorkouts: 127,
      weeklyWorkouts: 5,
      totalCalories: 24680,
      weeklyCalories: 3420,
      averageSleep: 7.3,
      hydrationLevel: 85,
      weeklyProgress: 78,
      monthlyProgress: 65,
      streakDays: 12,
      completedGoals: 8,
      fitnessScore: 82, // AI-calculated comprehensive score
      recoveryScore: 76,
      nutritionScore: 88,
      consistencyScore: 91,
    };
  };

  // AI-powered insights generation
  const fetchSmartInsights = async (): Promise<SmartInsight[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '1',
        type: 'achievement',
        priority: 'high',
        title: '🔥 Série record !',
        message: 'Vous venez de battre votre record avec 12 jours consécutifs d\'entraînement !',
        actionText: 'Voir les détails',
        actionUrl: '/achievements',
        icon: 'Trophy',
        timestamp: new Date().toISOString(),
        category: 'workout',
      },
      {
        id: '2',
        type: 'recommendation',
        priority: 'medium',
        title: '💡 Optimisation détectée',
        message: 'Vos performances sont meilleures les mardis. Planifiez vos entraînements intensifs ce jour.',
        actionText: 'Planifier',
        actionUrl: '/workout/schedule',
        icon: 'Brain',
        timestamp: new Date().toISOString(),
        category: 'workout',
      },
      {
        id: '3',
        type: 'alert',
        priority: 'medium',
        title: '😴 Récupération importante',
        message: 'Votre score de récupération est à 76%. Un jour de repos pourrait optimiser vos performances.',
        actionText: 'Voir conseils',
        actionUrl: '/recovery',
        icon: 'Moon',
        timestamp: new Date().toISOString(),
        category: 'recovery',
      },
    ];
  };

  // Weekly performance trends
  const fetchWeeklyTrends = async (): Promise<WeeklyTrend[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      { day: 'Lun', workouts: 1, calories: 420, sleep: 7.5, recovery: 85, nutrition: 90 },
      { day: 'Mar', workouts: 1, calories: 580, sleep: 7.2, recovery: 78, nutrition: 85 },
      { day: 'Mer', workouts: 0, calories: 0, sleep: 8.1, recovery: 92, nutrition: 88 },
      { day: 'Jeu', workouts: 1, calories: 520, sleep: 6.8, recovery: 72, nutrition: 82 },
      { day: 'Ven', workouts: 1, calories: 490, sleep: 7.4, recovery: 80, nutrition: 87 },
      { day: 'Sam', workouts: 1, calories: 630, sleep: 7.9, recovery: 88, nutrition: 91 },
      { day: 'Dim', workouts: 0, calories: 180, sleep: 8.5, recovery: 95, nutrition: 89 },
    ];
  };

  // User achievements with gamification
  const fetchUserAchievements = async (): Promise<Achievement[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        title: 'Guerrier de la constance',
        description: '10 jours d\'entraînement consécutifs',
        icon: 'Sword',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic',
      },
      {
        id: '2',
        title: 'Maître de l\'hydratation',
        description: 'Objectif hydratation atteint 7 jours de suite',
        icon: 'Droplets',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Machine à calories',
        description: 'Plus de 500 calories brûlées en une séance',
        icon: 'Zap',
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        rarity: 'common',
      },
    ];
  };

  // AI-generated personalized goals
  const fetchPersonalizedGoals = async (): Promise<PersonalizedGoal[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: '1',
        title: 'Objectif Cardio Intelligent',
        description: 'Basé sur vos performances, visez 4 séances cardio cette semaine',
        targetValue: 4,
        currentValue: 2,
        unit: 'séances',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'workout',
        aiGenerated: true,
      },
      {
        id: '2',
        title: 'Optimisation Sommeil',
        description: 'Votre récupération serait optimale avec 7.5h de sommeil minimum',
        targetValue: 7.5,
        currentValue: 7.1,
        unit: 'heures',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        category: 'sleep',
        aiGenerated: true,
      },
    ];
  };

  // Refresh dashboard data
  const refreshData = useCallback(() => {
    fetchDashboardData();
    toast.success("Votre dashboard a été mis à jour");
  }, [fetchDashboardData]);

  // Mark insight as read
  const markInsightAsRead = useCallback((insightId: string) => {
    setState(prev => ({
      ...prev,
      insights: prev.insights.filter(insight => insight.id !== insightId),
    }));
  }, []);

  // Complete a goal
  const completeGoal = useCallback((goalId: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId),
      metrics: {
        ...prev.metrics,
        completedGoals: prev.metrics.completedGoals + 1,
      },
    }));
    
    toast.success("🎉 Félicitations pour avoir atteint votre objectif !");
  }, []);

  // Initialize dashboard
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, fetchDashboardData]);

  return {
    ...state,
    refreshData,
    markInsightAsRead,
    completeGoal,
    isLoading: state.loading,
  };
};