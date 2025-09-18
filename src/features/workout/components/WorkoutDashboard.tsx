import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../shared/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  BarChart,
  Calendar,
  Dumbbell,
  Settings,
  Timer,
  TrendingUp
} from 'lucide-react';

// Import des sous-composants
import {
  WorkoutOverview,
  WorkoutSessionComponent,
  WorkoutPlans,
  WorkoutHistory,
  WorkoutProgress,
  WorkoutSettings,
} from './index';

/* ================================================================== */
/*                           TYPES                                    */
/* ================================================================== */

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  completed?: boolean;
}

interface WorkoutSession {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  calories_burned?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  started_at?: Date;
  completed_at?: Date;
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
}

interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgDuration: number;
  weeklyProgress: number;
  currentStreak: number;
  favoriteExercise: string;
  strongestLift: { exercise: string; weight: number };
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  difficulty: string;
  workouts_per_week: number;
  target_muscles: string[];
  created_at: Date;
  is_active: boolean;
}

/* ================================================================== */
/*                        COMPOSANT PRINCIPAL                         */
/* ================================================================== */

export default function WorkoutDashboard() {
  /* ========================== HOOKS ET STATE ========================= */

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  /* ========================= COMPUTED VALUES ========================== */

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart },
    { id: 'session', label: 'Session', icon: Dumbbell },
    { id: 'plans', label: 'Plans', icon: Calendar },
    { id: 'progress', label: 'Progrès', icon: TrendingUp },
    { id: 'history', label: 'Historique', icon: Timer },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ], []);

  const progressPercentage = useMemo(() => {
    if (!workoutStats) return 0;
    return Math.min((workoutStats.weeklyProgress / 4) * 100, 100);
  }, [workoutStats]);

  /* ========================= EFFECTS ET TIMERS ======================== */

  // Timer pour la session active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Chargement initial
  useEffect(() => {
    loadDashboardData();
  }, []);

  /* ========================= DATA LOADING ========================== */

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Charger les statistiques
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workouts) {
        const totalMinutes = workouts.reduce((sum: number, w: any) => sum + (w.duration_minutes || 0), 0);
        const totalCalories = workouts.reduce((sum: number, w: any) => sum + (w.calories_burned || 0), 0);
        
        const stats: WorkoutStats = {
          totalWorkouts: workouts.length,
          totalMinutes,
          totalCalories,
          avgDuration: workouts.length > 0 ? Math.round(totalMinutes / workouts.length) : 0,
          currentStreak: calculateStreak(workouts),
          weeklyProgress: getWeeklyProgress(workouts),
          favoriteExercise: 'Développé couché', // Valeur par défaut pour l'instant
          strongestLift: { exercise: 'Développé couché', weight: 80 }, // Valeur par défaut
        };
        setWorkoutStats(stats);
        setRecentWorkouts(workouts.slice(0, 10));
      }

      // Charger les plans
      const { data: plans } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id);

      if (plans) {
        setWorkoutPlans(plans);
      }

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ========================= UTILITY FUNCTIONS ======================== */

  const calculateStreak = (workouts: WorkoutSession[]): number => {
    // Logique simplifiée pour calculer la série
    const completedWorkouts = workouts.filter(w => w.completed_at);
    return completedWorkouts.length > 0 ? Math.min(completedWorkouts.length, 30) : 0;
  };

  const getWeeklyProgress = (workouts: WorkoutSession[]): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(w => 
      w.completed_at && new Date(w.completed_at) >= oneWeekAgo
    );
    
    return weeklyWorkouts.length;
  };

  /* ========================= EVENT HANDLERS ========================== */

  // Handlers pour les composants
  const handleStartSession = useCallback(() => {
    // Logique pour démarrer une session
    toast({
      title: 'Session démarrée',
      description: 'Bonne séance d\'entraînement !',
    });
  }, [toast]);

  const handlePauseSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  const handleEndSession = useCallback(() => {
    setIsSessionActive(false);
    setCurrentSession(null);
    setSessionTimer(0);
    toast({
      title: 'Session terminée',
      description: 'Excellente séance !',
    });
  }, [toast]);

  const handleCompleteExercise = useCallback((exerciseId: string) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, completed: true } : ex
        )
      };
    });
  }, []);

  const handleStartPlan = useCallback((planId: string) => {
    toast({
      title: 'Plan démarré',
      description: 'Bon entraînement !',
    });
  }, [toast]);

  const handleCreatePlan = useCallback(() => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La création de plans sera bientôt disponible',
    });
  }, [toast]);

  const handleFilterChange = useCallback((filter: string) => {
    // Logique de filtrage
  }, []);

  const handleExportData = useCallback(() => {
    toast({
      title: 'Export en cours',
      description: 'Vos données sont en cours d\'export',
    });
  }, [toast]);

  const handleSyncData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleClearData = useCallback(() => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La suppression des données sera bientôt disponible',
      variant: 'destructive',
    });
  }, [toast]);

  const handleShareProgress = useCallback(() => {
    toast({
      title: 'Partage en cours',
      description: 'Vos progrès sont en cours de partage',
    });
  }, [toast]);

  /* ========================== RENDER PRINCIPAL ======================= */

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord Entraînement</h1>
          <p className="text-gray-600">Suivez vos progrès et gérez vos séances d'entraînement</p>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview">
            <WorkoutOverview 
              stats={workoutStats} 
              progressPercentage={progressPercentage} 
            />
          </TabsContent>

          <TabsContent value="session">
            <WorkoutSessionComponent
              currentSession={currentSession}
              sessionTimer={sessionTimer}
              isSessionActive={isSessionActive}
              onStartSession={handleStartSession}
              onPauseSession={handlePauseSession}
              onEndSession={handleEndSession}
              onCompleteExercise={handleCompleteExercise}
            />
          </TabsContent>

          <TabsContent value="plans">
            <WorkoutPlans
              plans={workoutPlans}
              onStartPlan={handleStartPlan}
              onCreatePlan={handleCreatePlan}
            />
          </TabsContent>

          <TabsContent value="progress">
            <WorkoutProgress />
          </TabsContent>

          <TabsContent value="history">
            <WorkoutHistory
              recentWorkouts={recentWorkouts}
              onFilterChange={handleFilterChange}
              onExportData={handleExportData}
            />
          </TabsContent>

          <TabsContent value="settings">
            <WorkoutSettings
              onExportData={handleExportData}
              onSyncData={handleSyncData}
              onClearData={handleClearData}
              onShareProgress={handleShareProgress}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}