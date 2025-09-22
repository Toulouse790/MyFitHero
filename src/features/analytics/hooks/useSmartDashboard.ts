// src/features/analytics/hooks/useSmartDashboard.ts
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { appStore } from '@/store/appStore';
import { 
  SmartDashboardContext, 
  DailyProgramDisplay, 
  DailyStats, 
  Exercise 
} from '../../../shared/types/dashboard';
import { User as SupabaseAuthUserType } from '@supabase/supabase-js';
import { UserProfile } from '../../../shared/types/user';

// Types locaux
interface ChatMessage {
  id: number;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface PersonalizedWidget {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
  color: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  path?: string;
}

interface SmartDashboardState {
  messages: ChatMessage[];
  inputMessage: string;
  isListening: boolean;
  isLoading: boolean;
  dailyStats: DailyStats | null;
  loadingDailyStats: boolean;
  dailyProgram: DailyProgramDisplay;
}

export interface UseSmartDashboardReturn {
  // État principal
  state: SmartDashboardState;
  
  // Actions
  setInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  toggleListening: () => void;
  
  // Données personnalisées
  personalizedGreeting: string;
  personalizedMotivation: string;
  smartReminders: PersonalizedWidget[];
  personalizedWorkout: string;
  personalizedExercises: Exercise[];
  
  // Utilitaires
  refreshData: () => Promise<void>;
  detectMessageType: (message: string) => string;
}

export const useSmartDashboard = (
  userProfile?: SupabaseAuthUserType
): UseSmartDashboardReturn => {
  
  const { appStoreUser } = appStore();
  const today = new Date().toISOString().split('T')[0];
  
  // Valeurs par défaut pour les objectifs quotidiens
  const dailyGoals = {
    calories: 2200,
    water: 2.5, // en litres
    sleep: 8, // en heures
    steps: 10000,
    workout_minutes: 30
  };

  // État principal
  const [state, setState] = useState<SmartDashboardState>({
    messages: [],
    inputMessage: '',
    isListening: false,
    isLoading: false,
    dailyStats: null,
    loadingDailyStats: true,
    dailyProgram: {
      date: today,
      personalizedMessage: 'Message personnalisé',
      aiRecommendation: 'Recommandation IA',
      priorityLevel: 'medium',
      workout: {
        title: 'Entraînement du jour',
        name: 'Entraînement personnalisé',
        description: 'Entraînement personnalisé',
        duration: 45,
        intensity: 'moderate',
        exercises: [],
        warmup: [],
        cooldown: [],
        completed: false,
      },
      nutrition: {
        title: 'Nutrition du jour',
        description: 'Plan nutritionnel personnalisé',
        calories: 2200,
        calories_current: 0,
        calories_target: 2200,
        macros: { protein: 150, carbs: 250, fat: 80 },
        meals: [],
        hydration: {
          target: dailyGoals.water * 1000,
          current: 0,
        },
      },
      recovery: {
        title: 'Récupération',
        description: 'Programme de récupération',
        sleepTarget: dailyGoals.sleep,
        restActivities: [],
        stretchingRoutine: []
      },
      hydration: {
        target: dailyGoals.water * 1000,
        current: 0,
        target_ml: dailyGoals.water * 1000,
        current_ml: 0,
        percentage: 0,
      },
      sleep: {
        target: dailyGoals.sleep,
        current: 0,
        target_hours: dailyGoals.sleep,
        last_night_hours: 0,
        quality: 0,
      },
      stats: {
        completion: 0,
        streak: 0,
        weeklyProgress: 0,
        monthlyGoals: 0
      },
      badges: {
        earned: [],
        available: [],
        progress: []
      }
    }
  });

  // ===== FONCTIONS UTILITAIRES =====
  
  const fetchDailyStats = async (userId: string, date: string): Promise<DailyStats> => {
    // Mock function - remplacer par l'implémentation réelle
    return {
      total_calories: 0,
      hydration_ml: 0,
      hydration_goal_ml: dailyGoals.water * 1000,
      sleep_hours: 0,
      steps_count: 0,
      workouts_completed: 0,
      water_intake_ml: 0
    };
  };

  const fetchAiRecommendations = async (userId: string, type: string, limit: number) => {
    // Mock function - remplacer par l'implémentation réelle
    return [];
  };

  const detectMessageType = useCallback((message: string): string => {
    const msg = message.toLowerCase();
    
    if (msg.includes('workout') || msg.includes('entraînement') || msg.includes('exercice')) {
      return 'workout';
    }
    if (msg.includes('nutrition') || msg.includes('manger') || msg.includes('calorie')) {
      return 'nutrition';
    }
    if (msg.includes('sleep') || msg.includes('sommeil') || msg.includes('dormir')) {
      return 'sleep';
    }
    if (msg.includes('hydration') || msg.includes('eau') || msg.includes('boire')) {
      return 'hydration';
    }
    if (msg.includes('recovery') || msg.includes('récupération') || msg.includes('repos')) {
      return 'recovery';
    }
    
    return 'general';
  }, []);

  // ===== FONCTIONS DE PERSONNALISATION =====

  const getPersonalizedGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    const user = appStoreUser;
    const firstName = user?.username?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Champion';

    // Salutations selon l'heure ET le profil sportif
    if (hour < 6) {
      return `🌙 ${firstName}, encore debout ? ${user?.sport === 'rugby' ? 'Les piliers se lèvent tôt !' : 'Repos = gains !'}`;
    } else if (hour < 12) {
      if (user?.sport === 'rugby' && user?.sport_position === 'pilier') {
        return `🏉 Bonjour ${firstName} ! Prêt à dominer la mêlée aujourd'hui ?`;
      } else if (user?.primary_goals?.includes('weight_loss')) {
        return `🔥 Salut ${firstName} ! Ready to burn some calories ?`;
      } else if (user?.primary_goals?.includes('muscle_gain')) {
        return `💪 Morning ${firstName} ! Time to build that muscle !`;
      } else {
        return `☀️ Bonjour ${firstName} ! Prêt à conquérir cette journée ?`;
      }
    } else if (hour < 18) {
      return `👋 Salut ${firstName} ! ${user?.sport ? 'Comment se passe ta prep ?' : 'Tu gères ta journée !'}`;
    } else {
      return `🌆 Bonsoir ${firstName} ! ${user?.primary_goals?.includes('sleep_quality') ? 'Time to wind down ?' : 'Fini ta journée fitness ?'}`;
    }
  }, [appStoreUser]);

  const getPersonalizedWorkout = useCallback((): string => {
    const profile = appStoreUser;
    if (!profile) return 'Entraînement Général';

    const day = new Date().getDay(); // 0 = dimanche, 1 = lundi, etc.

    // Programme ultra-spécifique selon sport + poste + jour
    if (profile.sport === 'rugby') {
      if (profile.sport_position === 'pilier') {
        if ([1, 3, 5].includes(day)) {
          return '🏉 Force Explosive - Mêlée';
        } else if ([2, 4].includes(day)) {
          return '🏃 Mobilité & Cardio Rugby';
        } else {
          return '😌 Récupération Active - Pilier';
        }
      } else if (profile.sport_position?.includes('arrière')) {
        return '⚡ Vitesse & Agilité - Arrière';
      } else {
        return '🏉 Entraînement Rugby - ' + (profile.sport_position || 'All Positions');
      }
    }

    // Programme selon objectifs
    if (profile.primary_goals?.includes('muscle_gain')) {
      const workouts = [
        '💪 Hypertrophie Pectoraux',
        '🎯 Dos & Largeur',
        '🦵 Leg Day Intense',
        '🔥 Bras & Épaules',
      ];
      return workouts[day % workouts.length];
    }

    if (profile.primary_goals?.includes('weight_loss')) {
      const workouts = [
        '🔥 HIIT Cardio',
        '⚡ Métabolique Intense',
        '🏃 Circuit Training',
        '💥 Tabata Express',
      ];
      return workouts[day % workouts.length];
    }

    if (profile.primary_goals?.includes('endurance')) {
      return '🏃 Cardio Endurance - Zone 2';
    }

    return 'Entraînement Personnalisé';
  }, [appStoreUser]);

  const getPersonalizedExercises = useCallback((): Exercise[] => {
    const profile = appStoreUser;
    
    const convertToExercises = (exerciseNames: string[]): Exercise[] => {
      return exerciseNames.map((name, index) => ({
        id: `exercise-${index}`,
        name,
        description: `Description pour ${name}`,
        sets: 3,
        reps: '8-12',
        duration: 30,
        targetMuscles: ['général'],
        equipment: ['poids libre'],
        difficulty: 'medium' as const,
        tips: [`Conseil pour ${name}`]
      }));
    };

    if (!profile) return convertToExercises(['Squats', 'Push-ups', 'Planches', 'Fentes']);

    // Exercices spécifiques au sport
    if (profile.sport === 'rugby' && profile.sport_position === 'pilier') {
      return convertToExercises([
        'Squat lourd 5x3',
        'Développé couché 4x6',
        'Rowing barre 4x8',
        'Poussée traîneau 3x20m',
      ]);
    }

    if (profile.sport === 'rugby' && profile.sport_position?.includes('arrière')) {
      return convertToExercises(['Sprint 40m x6', 'Pliométrie', 'Agilité échelle', 'Récupération ballon']);
    }

    // Exercices selon objectifs
    if (profile.primary_goals?.includes('weight_loss')) {
      return convertToExercises(['HIIT 20min', 'Burpees 4x15', 'Mountain climbers 3x30s', 'Jump squats 4x12']);
    }

    if (profile.primary_goals?.includes('muscle_gain')) {
      return convertToExercises(['Squat 4x8', 'Développé 4x10', 'Tractions 4x8', 'Dips 3x12']);
    }

    return convertToExercises(['Squats', 'Push-ups', 'Planches', 'Fentes']);
  }, [appStoreUser]);

  const getSmartReminders = useCallback((): PersonalizedWidget[] => {
    const profile = appStoreUser;
    const stats = state.dailyStats;
    const reminders: PersonalizedWidget[] = [];
    const firstName = profile?.username?.split(' ')[0] || 'Champion';

    // Reminders hyper-contextuels
    if (!stats?.workouts_completed) {
      if (profile?.sport === 'rugby' && profile?.sport_position === 'pilier') {
        reminders.push({
          id: 'workout_rugby',
          title: "🏉 Ton pack d'avant t'attend !",
          content: `${firstName}, la mêlée ne se gagnera pas toute seule ! Time to hit the gym 💪`,
          icon: () => React.createElement('div', null, '🏋️'),
          color: 'bg-red-500',
          priority: 'high',
          action: 'Commencer',
          path: '/workout',
        });
      } else if (profile?.primary_goals?.includes('weight_loss')) {
        reminders.push({
          id: 'workout_weightloss',
          title: '🔥 Brûle-graisse mode ON',
          content: `${firstName}, chaque calorie compte ! Ready for some HIIT ?`,
          icon: () => React.createElement('div', null, '🔥'),
          color: 'bg-orange-500',
          priority: 'high',
          action: "Let's go",
          path: '/workout',
        });
      } else {
        reminders.push({
          id: 'workout_general',
          title: '💪 Workout Time !',
          content: `${firstName}, ton corps attend ton signal ! Let's move`,
          icon: () => React.createElement('div', null, '⚡'),
          color: 'bg-blue-500',
          priority: 'medium',
          action: 'Start',
          path: '/workout',
        });
      }
    }

    // Hydratation contextuelle
    const waterMl = stats?.water_intake_ml || 0;
    const waterGoal = dailyGoals.water * 1000;
    if (waterMl < waterGoal * 0.5) {
      reminders.push({
        id: 'hydration',
        title: '💧 Hydrate-toi !',
        content: `${firstName}, tu n'as bu que ${Math.round((waterMl / 1000) * 10) / 10}L sur ${dailyGoals.water}L`,
        icon: () => React.createElement('div', null, '💧'),
        color: 'bg-cyan-500',
        priority: 'medium',
        action: 'Boire',
        path: '/hydration',
      });
    }

    // Nutrition contextuelle
    const cals = stats?.total_calories || 0;
    const calorieGoal = dailyGoals.calories;
    if (cals > calorieGoal * 1.1) {
      reminders.push({
        id: 'calories_over',
        title: '⚠️ Calories dépassées',
        content: `${firstName}, +${cals - calorieGoal} kcal. Un petit HIIT ce soir ?`,
        icon: () => React.createElement('div', null, '⚠️'),
        color: 'bg-yellow-500',
        priority: 'low',
        action: 'Cardio',
        path: '/workout',
      });
    } else if (cals < calorieGoal * 0.7) {
      reminders.push({
        id: 'calories_under',
        title: "🍎 Tu manques d'énergie",
        content: `${firstName}, seulement ${cals} kcal. Mange pour performer !`,
        icon: () => React.createElement('div', null, '🍎'),
        color: 'bg-green-500',
        priority: 'medium',
        action: 'Manger',
        path: '/nutrition',
      });
    }

    return reminders
      .sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
      })
      .slice(0, 2); // Max 2 reminders
  }, [appStoreUser, state.dailyStats, dailyGoals]);

  const getPersonalizedMotivation = useCallback((): string => {
    const profile = appStoreUser;
    const stats = state.dailyStats;
    const firstName = profile?.username?.split(' ')[0] || 'Champion';
    const motivations: string[] = [];

    // Motivation selon progression
    if (stats?.workouts_completed && stats.workouts_completed > 0) {
      if (profile?.sport === 'rugby') {
        motivations.push(`🏉 ${firstName}, encore un workout de warrior ! La mêlée sera à toi !`);
      } else {
        motivations.push(`🔥 ${firstName}, encore une victoire ! Tu es unstoppable !`);
      }
    }

    // Motivation selon objectifs
    if (profile?.primary_goals?.includes('performance') && stats?.workouts_completed) {
      motivations.push(`⚡ Performance mode ON ! ${firstName}, tu repousses tes limites !`);
    }

    if (
      profile?.primary_goals?.includes('weight_loss') &&
      (stats?.total_calories || 0) < dailyGoals.calories
    ) {
      motivations.push(`🎯 ${firstName}, tu contrôles ton alimentation comme un pro !`);
    }

    // Motivation par défaut
    if (motivations.length === 0) {
      const hour = new Date().getHours();
      if (hour < 12) {
        motivations.push(`💪 ${firstName}, prêt à transformer cette journée en victoire ?`);
      } else {
        motivations.push(`🌟 ${firstName}, continue comme ça, tu es sur la bonne voie !`);
      }
    }

    return motivations[0];
  }, [appStoreUser, state.dailyStats, dailyGoals]);

  // ===== ACTIONS =====

  const setInputMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, inputMessage: message }));
  }, []);

  const toggleListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: !prev.isListening }));
  }, []);

  const sendMessage = useCallback(async () => {
    if (!state.inputMessage.trim() || !userProfile?.id) return;

    const userMessage: ChatMessage = {
      id: state.messages.length + 1,
      type: 'user',
      content: state.inputMessage,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputMessage: '',
      isLoading: true,
    }));

    try {
      const contextData: SmartDashboardContext = {
        user: {
          id: userProfile.id,
          username: appStoreUser?.username,
          age: appStoreUser?.age,
          gender: appStoreUser?.gender,
          fitness_goal: appStoreUser?.goal,
          primary_goals: appStoreUser?.primary_goals,
          sport: appStoreUser?.sport,
          sport_position: appStoreUser?.sport_position,
          fitness_experience: appStoreUser?.fitness_experience,
          lifestyle: appStoreUser?.lifestyle,
          available_time_per_day: appStoreUser?.available_time_per_day,
          training_frequency: typeof appStoreUser?.training_frequency === 'string' 
            ? parseInt(appStoreUser.training_frequency) 
            : appStoreUser?.training_frequency,
          season_period: appStoreUser?.season_period,
          injuries: appStoreUser?.injuries,
        },
        dailyStats: state.dailyStats,
        currentDate: new Date().toISOString().split('T')[0],
        currentTime: new Date().toLocaleTimeString(),
        isWeekend: [0, 6].includes(new Date().getDay()),
        weatherContext: 'normal',
        motivationLevel: 'normal',
        recentActivity: 'none',
        upcomingEvents: [],
        personalizedTips: state.messages
          .filter(m => m.type === 'ai')
          .map(m => m.content)
          .slice(-3),
      };

      const { data: requestData, error: requestError } = await supabase
        .from('ai_requests')
        .insert({
          user_id: userProfile.id,
          pillar_type: detectMessageType(state.inputMessage),
          prompt: state.inputMessage,
          context: contextData,
          status: 'pending',
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Simulated AI response - remplacer par la vraie logique
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: state.messages.length + 2,
          type: 'ai',
          content: 'Merci pour votre message ! Je traite votre demande...',
          timestamp: new Date(),
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
          isLoading: false,
        }));
      }, 1000);

    } catch (error) {
      console.error('Erreur envoi message:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.inputMessage, state.messages, userProfile?.id, appStoreUser, state.dailyStats, detectMessageType]);

  const refreshData = useCallback(async () => {
    if (!userProfile?.id) return;

    setState(prev => ({ ...prev, loadingDailyStats: true }));
    
    try {
      const fetchedDailyStats = await fetchDailyStats(userProfile.id, today);
      setState(prev => ({ ...prev, dailyStats: fetchedDailyStats }));

      if (fetchedDailyStats) {
        setState(prev => ({
          ...prev,
          dailyProgram: {
            ...prev.dailyProgram,
            workout: {
              ...prev.dailyProgram.workout,
              completed: (fetchedDailyStats.workouts_completed || 0) > 0,
            },
            nutrition: {
              ...prev.dailyProgram.nutrition,
              calories_current: fetchedDailyStats.total_calories || 0,
            },
            hydration: {
              ...prev.dailyProgram.hydration,
              current_ml: fetchedDailyStats.water_intake_ml || 0,
              percentage: Math.round(
                ((fetchedDailyStats.water_intake_ml || 0) /
                  (fetchedDailyStats.hydration_goal_ml || dailyGoals.water * 1000)) *
                  100
              ),
            },
            sleep: {
              ...prev.dailyProgram.sleep,
              last_night_hours: fetchedDailyStats.sleep_duration_minutes
                ? fetchedDailyStats.sleep_duration_minutes / 60
                : 0,
              quality: fetchedDailyStats.sleep_quality || 0,
            },
          },
        }));
      }
    } catch (error) {
      console.error('Erreur actualisation données:', error);
    } finally {
      setState(prev => ({ ...prev, loadingDailyStats: false }));
    }
  }, [userProfile?.id, today, dailyGoals]);

  // ===== EFFECTS =====

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ===== RETURN =====

  return {
    // État principal
    state,
    
    // Actions
    setInputMessage,
    sendMessage,
    toggleListening,
    
    // Données personnalisées
    personalizedGreeting: getPersonalizedGreeting(),
    personalizedMotivation: getPersonalizedMotivation(),
    smartReminders: getSmartReminders(),
    personalizedWorkout: getPersonalizedWorkout(),
    personalizedExercises: getPersonalizedExercises(),
    
    // Utilitaires
    refreshData,
    detectMessageType,
  };
};