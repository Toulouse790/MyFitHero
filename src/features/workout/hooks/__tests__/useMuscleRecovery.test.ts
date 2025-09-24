/**
 * TESTS UNITAIRES - useMuscleRecovery Hook
 * Tests complets pour le système de récupération musculaire
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { useMuscleRecovery } from '../useMuscleRecovery';
import { appStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';

// Mocks
vi.mock('@/store/appStore');
vi.mock('@/lib/supabase');
vi.mock('@/shared/hooks/use-toast');

const mockAppStore = appStore as Mock;
const mockSupabase = supabase as any;
const mockUseToast = useToast as Mock;

describe('useMuscleRecovery', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAppStore.mockReturnValue({
      appStoreUser: mockUser,
    });

    mockUseToast.mockReturnValue({
      toast: mockToast,
    });

    // Mock Supabase par défaut
    mockSupabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      }),
    });
  });

  describe('État initial', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      expect(result.current.muscleRecoveryData).toEqual([]);
      expect(result.current.recoveryProfile).toBeUndefined();
      expect(result.current.recommendations).toEqual([]);
      expect(result.current.globalMetrics).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    it('should set error when user is not connected', async () => {
      mockAppStore.mockReturnValue({
        appStoreUser: null,
      });

      const { result } = renderHook(() => useMuscleRecovery());

      await act(async () => {
        await result.current.refreshRecoveryData();
      });

      expect(result.current.error).toBe('Utilisateur non connecté');
    });
  });

  describe('refreshRecoveryData', () => {
    it('should fetch and process recovery data successfully', async () => {
      const mockWorkoutHistory = [
        {
          id: 'workout-1',
          user_id: mockUser.id,
          created_at: new Date().toISOString(),
          status: 'completed',
          workout_exercises: [
            {
              exercise_id: 'exercise-1',
              sets: 3,
              exercises: {
                muscle_groups: ['chest', 'triceps'],
              },
            },
          ],
        },
      ];

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                data: mockWorkoutHistory,
                error: null,
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMuscleRecovery());

      await act(async () => {
        await result.current.refreshRecoveryData();
      });

      expect(result.current.muscleRecoveryData).toHaveLength(10); // Tous les groupes musculaires
      expect(result.current.globalMetrics).toBeDefined();
      expect(result.current.globalMetrics?.overall_recovery_score).toBeGreaterThan(0);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      });

      const { result } = renderHook(() => useMuscleRecovery());

      await act(async () => {
        await result.current.refreshRecoveryData();
      });

      expect(result.current.error).toBe('Database error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateRecoveryProfile', () => {
    it('should update recovery profile successfully', async () => {
      const mockUserProfile = {
        age: 30,
        fitness_level: 'intermediate',
        supplements: ['protein', 'creatine'],
      };

      const mockHealthData = [
        {
          sleep_quality: 8,
          stress_level: 3,
          hydration_liters: 3.0,
        },
      ];

      // Mock pour user_profiles
      mockSupabase.from = vi.fn().mockImplementation((table: string) => {
        if (table === 'user_profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockReturnValue({
                  data: mockUserProfile,
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === 'daily_health_metrics') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                  order: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                      data: mockHealthData,
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          };
        }
        if (table === 'injury_history') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  data: [],
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === 'user_recovery_profiles') {
          return {
            upsert: vi.fn().mockReturnValue({
              error: null,
            }),
          };
        }
      });

      const { result } = renderHook(() => useMuscleRecovery());

      await act(async () => {
        await result.current.updateRecoveryProfile();
      });

      expect(result.current.recoveryProfile).toBeDefined();
      expect(result.current.recoveryProfile?.user_id).toBe(mockUser.id);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Profil de récupération mis à jour",
        description: "Vos données de récupération ont été recalculées",
      });
    });
  });

  describe('Utility functions', () => {
    it('should get muscle recovery correctly', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      // Mock some recovery data
      act(() => {
        result.current.muscleRecoveryData = [
          {
            muscle_group: 'chest',
            recovery_percentage: 85,
            recovery_status: 'mostly_recovered',
            last_workout_date: new Date().toISOString(),
            workout_intensity: 'moderate',
            workout_volume: 3,
            workout_duration_minutes: 45,
            estimated_full_recovery: new Date().toISOString(),
            fatigue_level: 3,
            soreness_level: 2,
            readiness_score: 85,
            last_updated: new Date().toISOString(),
          },
        ];
      });

      const chestRecovery = result.current.getMuscleRecovery('chest');
      expect(chestRecovery).toBeDefined();
      expect(chestRecovery?.recovery_percentage).toBe(85);

      const shoulderRecovery = result.current.getMuscleRecovery('shoulders');
      expect(shoulderRecovery).toBeUndefined();
    });

    it('should check if ready for workout correctly', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      // Mock recovery data with high recovery
      act(() => {
        result.current.muscleRecoveryData = [
          {
            muscle_group: 'chest',
            recovery_percentage: 85,
            recovery_status: 'mostly_recovered',
            last_workout_date: new Date().toISOString(),
            workout_intensity: 'moderate',
            workout_volume: 3,
            workout_duration_minutes: 45,
            estimated_full_recovery: new Date().toISOString(),
            fatigue_level: 2,
            soreness_level: 1,
            readiness_score: 85,
            last_updated: new Date().toISOString(),
          },
          {
            muscle_group: 'triceps',
            recovery_percentage: 40,
            recovery_status: 'needs_recovery',
            last_workout_date: new Date().toISOString(),
            workout_intensity: 'high',
            workout_volume: 4,
            workout_duration_minutes: 30,
            estimated_full_recovery: new Date().toISOString(),
            fatigue_level: 7,
            soreness_level: 6,
            readiness_score: 40,
            last_updated: new Date().toISOString(),
          },
        ];
      });

      const readyForChest = result.current.isReadyForWorkout(['chest']);
      expect(readyForChest).toBe(true);

      const readyForTriceps = result.current.isReadyForWorkout(['triceps']);
      expect(readyForTriceps).toBe(false);

      const readyForBoth = result.current.isReadyForWorkout(['chest', 'triceps']);
      expect(readyForBoth).toBe(false);
    });

    it('should format recovery status correctly', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      expect(result.current.formatRecoveryStatus('fully_recovered')).toBe('Complètement récupéré');
      expect(result.current.formatRecoveryStatus('mostly_recovered')).toBe('Bien récupéré');
      expect(result.current.formatRecoveryStatus('needs_recovery')).toBe('Besoin de récupération');
      expect(result.current.formatRecoveryStatus('unknown_status')).toBe('unknown_status');
    });

    it('should get recovery color correctly', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      expect(result.current.getRecoveryColor(95)).toBe('#10B981'); // Vert
      expect(result.current.getRecoveryColor(75)).toBe('#F59E0B'); // Orange
      expect(result.current.getRecoveryColor(45)).toBe('#EF4444'); // Rouge
      expect(result.current.getRecoveryColor(25)).toBe('#DC2626'); // Rouge foncé
    });

    it('should provide workout recommendations based on recovery', () => {
      const { result } = renderHook(() => useMuscleRecovery());

      // Mock global metrics
      act(() => {
        result.current.globalMetrics = {
          overall_recovery_score: 85,
          most_recovered_muscle: 'chest',
          least_recovered_muscle: 'triceps',
          ready_for_training: ['chest', 'back', 'shoulders', 'biceps', 'quadriceps', 'hamstrings'],
          needs_rest: ['triceps'],
          optimal_workout_type: 'full_body',
          recovery_trend: 'stable',
          last_calculated: new Date().toISOString(),
        };
      });

      const recommendation = result.current.getNextWorkoutRecommendation();
      expect(recommendation).toContain('entraînement complet du corps');
    });
  });

  describe('Error handling', () => {
    it('should catch and handle unexpected errors', async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const { result } = renderHook(() => useMuscleRecovery());

      await act(async () => {
        await result.current.refreshRecoveryData();
      });

      expect(result.current.error).toBe('Unexpected error');
      expect(result.current.isLoading).toBe(false);
    });
  });
});