/**
 * TESTS UNITAIRES - useWorkoutSessionCore Hook
 * Tests complets pour le système de session d'entraînement
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { useWorkoutSessionCore } from '../useWorkoutSessionCore';
import { appStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Mocks
vi.mock('@/store/appStore');
vi.mock('@/lib/supabase');
vi.mock('@/shared/hooks/use-toast');
vi.mock('@tanstack/react-query');

const mockAppStore = appStore as Mock;
const mockSupabase = supabase as any;
const mockUseToast = useToast as Mock;
const mockUseQueryClient = useQueryClient as Mock;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
  },
});

describe('useWorkoutSessionCore', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockToast = vi.fn();
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAppStore.mockReturnValue({
      appStoreUser: mockUser,
    });

    mockUseToast.mockReturnValue({
      toast: mockToast,
    });

    mockUseQueryClient.mockReturnValue(mockQueryClient);

    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock Supabase par défaut
    mockSupabase.from = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        data: null,
        error: null,
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
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
    it('should initialize with no active session', () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      expect(result.current.currentSession).toBeUndefined();
      expect(result.current.isSessionActive).toBe(false);
    });

    it('should load session from localStorage if available', () => {
      const mockSession = {
        id: 'test-session',
        user_id: mockUser.id,
        name: 'Test Workout',
        status: 'active',
        startTime: new Date().toISOString(),
        duration: 0,
        target_duration: 30,
        caloriesBurned: 0,
        workout_type: 'strength',
        difficulty: 'intermediate',
        exercises: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSession));

      const { result } = renderHook(() => useWorkoutSessionCore());

      expect(result.current.currentSession).toEqual(mockSession);
      expect(result.current.isSessionActive).toBe(true);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      const { result } = renderHook(() => useWorkoutSessionCore());

      expect(result.current.currentSession).toBeUndefined();
      expect(result.current.isSessionActive).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentWorkoutSession');
    });
  });

  describe('startSession', () => {
    it('should start a new workout session successfully', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout', {
          targetDuration: 45,
          workout_type: 'strength',
          difficulty: 'intermediate',
        });
      });

      expect(result.current.currentSession).toBeDefined();
      expect(result.current.currentSession?.name).toBe('Test Workout');
      expect(result.current.currentSession?.status).toBe('active');
      expect(result.current.isSessionActive).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Session démarrée',
        description: '« Test Workout » en cours',
      });
    });

    it('should not start session if user is not connected', async () => {
      mockAppStore.mockReturnValue({
        appStoreUser: null,
      });

      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      expect(result.current.currentSession).toBeUndefined();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: 'Utilisateur non connecté',
        variant: 'destructive',
      });
    });

    it('should handle database errors during session start', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      // Session should still be created locally even if DB save fails
      expect(result.current.currentSession).toBeDefined();
      expect(result.current.isSessionActive).toBe(true);
    });
  });

  describe('pauseSession', () => {
    it('should pause an active session', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      // Démarrer une session d'abord
      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      // Puis la mettre en pause
      await act(async () => {
        await result.current.pauseSession();
      });

      expect(result.current.currentSession?.status).toBe('paused');
      expect(result.current.isSessionActive).toBe(false);
    });

    it('should not pause if no active session', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.pauseSession();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: 'Aucune session active à mettre en pause',
        variant: 'destructive',
      });
    });
  });

  describe('resumeSession', () => {
    it('should resume a paused session', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      // Démarrer et mettre en pause
      await act(async () => {
        await result.current.startSession('Test Workout');
        await result.current.pauseSession();
      });

      // Reprendre
      await act(async () => {
        await result.current.resumeSession();
      });

      expect(result.current.currentSession?.status).toBe('active');
      expect(result.current.isSessionActive).toBe(true);
    });
  });

  describe('completeSession', () => {
    it('should complete an active session', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      // Démarrer une session
      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      // Simuler un peu de temps écoulé
      vi.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

      await act(async () => {
        await result.current.completeSession();
      });

      expect(result.current.currentSession).toBeUndefined();
      expect(result.current.isSessionActive).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentWorkoutSession');
    });

    it('should calculate calories and duration on completion', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      // Mock que la session a duré 45 minutes
      const mockSession = {
        ...result.current.currentSession!,
        startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      };
      
      act(() => {
        result.current.updateSession(mockSession);
      });

      await act(async () => {
        await result.current.completeSession();
      });

      // Vérifier que les calories ont été calculées
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          calories_burned: expect.any(Number),
          duration_minutes: expect.any(Number),
        })
      );
    });
  });

  describe('cancelSession', () => {
    it('should cancel an active session', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      await act(async () => {
        await result.current.cancelSession();
      });

      expect(result.current.currentSession).toBeUndefined();
      expect(result.current.isSessionActive).toBe(false);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Session annulée',
        description: 'Votre session d\'entraînement a été annulée',
        variant: 'destructive',
      });
    });
  });

  describe('calculateCalories', () => {
    it('should calculate calories based on duration', () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      const calories30min = result.current.calculateCalories(30);
      const calories60min = result.current.calculateCalories(60);

      expect(calories30min).toBeGreaterThan(0);
      expect(calories60min).toBeGreaterThan(calories30min);
      expect(calories60min).toBe(calories30min * 2); // Linear relationship
    });
  });

  describe('updateSession', () => {
    it('should update session data', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      const updates = {
        name: 'Updated Workout Name',
        difficulty: 'advanced' as const,
      };

      act(() => {
        result.current.updateSession(updates);
      });

      expect(result.current.currentSession?.name).toBe('Updated Workout Name');
      expect(result.current.currentSession?.difficulty).toBe('advanced');
    });
  });

  describe('localStorage integration', () => {
    it('should save session to localStorage on changes', async () => {
      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'currentWorkoutSession',
        expect.any(String)
      );
    });

    it('should handle localStorage errors gracefully', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la session localement",
        variant: "destructive",
      });
    });
  });

  describe('Analytics integration', () => {
    it('should track workout events with gtag if available', async () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout', {
          workout_type: 'strength',
        });
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'workout_started', {
        workout_name: 'Test Workout',
        workout_type: 'strength',
        user_id: mockUser.id,
      });
    });

    it('should handle gtag errors gracefully', async () => {
      const mockGtag = vi.fn().mockImplementation(() => {
        throw new Error('Analytics error');
      });
      (window as any).gtag = mockGtag;

      const { result } = renderHook(() => useWorkoutSessionCore());

      await act(async () => {
        await result.current.startSession('Test Workout');
      });

      // Should not throw, just log the error
      expect(result.current.currentSession).toBeDefined();
    });
  });
});