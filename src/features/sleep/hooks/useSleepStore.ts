import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { SleepStore, SleepEntry, SleepGoal, SleepStats, SleepDayData } from '../types';

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      // État initial
      entries: [],
      currentEntry: null,
      goals: [],
      currentGoal: null,
      stats: null,
      isLoading: false,
      error: null,

      // Actions - Entries
      addEntry: async (entryData: Partial<SleepEntry>) => {
        set({ isLoading: true, error: null });

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('Utilisateur non authentifié');

          const newEntry: Omit<SleepEntry, 'id'> = {
            ...entryData,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Omit<SleepEntry, 'id'>;

          const { data, error } = await supabase
            .from('sleep_entries')
            .insert([newEntry])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            entries: [...state.entries, data],
            currentEntry: data,
            isLoading: false,
          }));

          // Recalculer les stats après ajout
          get().calculateStats();
        } catch (error: any) {
          set({
            error: error.message || "Erreur lors de l'ajout de l'entrée",
            isLoading: false,
          });
        }
      },

      updateEntry: async (id, updates) => {
        set({ isLoading: true, error: null });

        try {
          const updatedData = {
            ...updates,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('sleep_entries')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            entries: state.entries.map(entry => (entry.id === id ? { ...entry, ...data } : entry)),
            currentEntry:
              state.currentEntry?.id === id
                ? { ...state.currentEntry, ...data }
                : state.currentEntry,
            isLoading: false,
          }));

          // Recalculer les stats
          get().calculateStats();
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la mise à jour',
            isLoading: false,
          });
        }
      },

      deleteEntry: async id => {
        set({ isLoading: true, error: null });

        try {
          const { error: _error } = await supabase.from('sleep_entries').delete().eq('id', id);

          if (_error) throw _error;

          set(state => ({
            entries: state.entries.filter(entry => entry.id !== id),
            currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
            isLoading: false,
          }));

          // Recalculer les stats
          get().calculateStats();
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la suppression',
            isLoading: false,
          });
        }
      },

      loadEntries: async () => {
        set({ isLoading: true, error: null });

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('Utilisateur non authentifié');

          const { data, error } = await supabase
            .from('sleep_entries')
            .select('*')
            .eq('userId', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          set({
            entries: data || [],
            currentEntry: data?.[0] || null,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors du chargement',
            isLoading: false,
          });
        }
      },

      // Actions - Goals
      addGoal: async (goalData: Partial<SleepGoal>) => {
        set({ isLoading: true, error: null });

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('Utilisateur non authentifié');

          // Désactiver les anciens objectifs
          await supabase.from('sleep_goals').update({ isActive: false }).eq('userId', user.id);

          const newGoal: Omit<SleepGoal, 'id'> = {
            userId: user.id,
            targetDuration: goalData.targetDuration || 480, // 8h par défaut
            targetBedtime: goalData.targetBedtime || '23:00',
            targetWakeTime: goalData.targetWakeTime || '07:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const { data, error } = await supabase
            .from('sleep_goals')
            .insert([newGoal])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            goals: [...state.goals.map(g => ({ ...g, isActive: false })), data],
            currentGoal: data,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || "Erreur lors de la définition de l'objectif",
            isLoading: false,
          });
        }
      },

      updateGoal: async (id, updates) => {
        set({ isLoading: true, error: null });

        try {
          const updatedData = {
            ...updates,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('sleep_goals')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            goals: state.goals.map(goal => (goal.id === id ? { ...goal, ...data } : goal)),
            currentGoal:
              state.currentGoal?.id === id ? { ...state.currentGoal, ...data } : state.currentGoal,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || "Erreur lors de la mise à jour de l'objectif",
            isLoading: false,
          });
        }
      },

      deleteGoal: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const { error: _error } = await supabase.from('sleep_goals').delete().eq('id', id);

          if (_error) throw _error;

          set(state => ({
            goals: state.goals.filter(goal => goal.id !== id),
            currentGoal: state.currentGoal?.id === id ? null : state.currentGoal,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la suppression de l\'objectif',
            isLoading: false,
          });
        }
      },

      loadGoals: async () => {
        set({ isLoading: true, error: null });

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('Utilisateur non authentifié');

          const { data, error } = await supabase
            .from('sleep_goals')
            .select('*')
            .eq('userId', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const activeGoal = data?.find(goal => goal.isActive) || null;

          set({
            goals: data || [],
            currentGoal: activeGoal,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors du chargement des objectifs',
            isLoading: false,
          });
        }
      },

      // Actions - Stats
      calculateStats: async () => {
        const { entries } = get();

        if (entries.length === 0) {
          set({ stats: null });
          return;
        }

        try {
          // Calculs statistiques
          const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
          const averageDuration = totalDuration / entries.length;

          const totalQuality = entries.reduce((sum, entry) => sum + entry.quality, 0);
          const averageQuality = totalQuality / entries.length;

          // Calcul de la consistance des heures de coucher
          const bedtimes = entries.map(entry => {
            const time = new Date(`2000-01-01T${entry.bedtime}`);
            return time.getHours() * 60 + time.getMinutes();
          });

          const averageBedtime = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
          const bedtimeVariance =
            bedtimes.reduce((sum, time) => sum + Math.pow(time - averageBedtime, 2), 0) /
            bedtimes.length;
          const bedtimeConsistency = Math.max(0, 100 - Math.sqrt(bedtimeVariance) / 2);

          // Calcul de la dette de sommeil (basé sur objectif de 8h)
          const targetDuration = get().currentGoal?.targetDuration || 480; // 8h par défaut
          const recentEntries = entries.slice(0, 7); // 7 derniers jours
          const recentDeficit = recentEntries.reduce((debt, entry) => {
            return debt + Math.max(0, targetDuration - entry.duration);
          }, 0);

          // Calcul de la tendance
          const recentAvg =
            recentEntries.slice(0, 3).reduce((sum, entry) => sum + entry.quality, 0) /
            Math.min(3, recentEntries.length);
          const olderAvg =
            recentEntries.slice(3, 6).reduce((sum, entry) => sum + entry.quality, 0) /
            Math.min(3, recentEntries.slice(3, 6).length);

          let trendDirection: 'up' | 'down' | 'stable' = 'stable';
          let trendPercentage = 0;
          if (recentAvg > olderAvg + 0.5) {
            trendDirection = 'up';
            trendPercentage = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
          } else if (recentAvg < olderAvg - 0.5) {
            trendDirection = 'down';
            trendPercentage = Math.round(((olderAvg - recentAvg) / olderAvg) * 100);
          }

          const trend = {
            direction: trendDirection,
            percentage: trendPercentage,
            description: trendDirection === 'up' ? 'En amélioration' : trendDirection === 'down' ? 'En baisse' : 'Stable'
          };

          // Données hebdomadaires pour les graphiques
          const weeklyData: SleepDayData[] = entries.slice(0, 7).map(entry => ({
            date: entry.createdAt.toISOString().split('T')[0],
            duration: entry.duration,
            quality: entry.quality,
            efficiency: Math.round((entry.duration / 480) * 100), // Calculer l'efficacité basée sur 8h de référence
          }));

          const stats: SleepStats = {
            averageDuration,
            averageQuality,
            bedtimeConsistency,
            totalSessions: entries.length,
            improvementTrend: trendPercentage,
            sleepDebt: recentDeficit,
            trend,
            weeklyData,
          };

          set({ stats });
        } catch (error: any) {
          console.error('Erreur lors du calcul des statistiques:', error);
        }
      },

      loadStats: async () => {
        await get().calculateStats();
      },

      // Actions - Utility
      clearError: () => set({ error: null }),

      resetStore: () =>
        set({
          entries: [],
          currentEntry: null,
          goals: [],
          currentGoal: null,
          stats: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'sleep-storage',
      partialize: state => ({
        entries: state.entries,
        goals: state.goals,
        currentGoal: state.currentGoal,
        stats: state.stats,
      }),
    }
  )
);
