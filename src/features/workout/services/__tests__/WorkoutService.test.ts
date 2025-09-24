/**
 * TESTS UNITAIRES - WorkoutService
 * Tests complets pour les services d'entraînement
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { WorkoutService } from '../WorkoutService';

// Mock fetch globalement
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('WorkoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('getWorkouts', () => {
    const userId = 'test-user-id';

    it('should fetch workouts successfully', async () => {
      const mockWorkouts = [
        {
          id: 'workout-1',
          name: 'Push Day',
          type: 'strength',
          duration: 60,
          exercises: [],
        },
        {
          id: 'workout-2',
          name: 'Pull Day',
          type: 'strength',
          duration: 45,
          exercises: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorkouts,
      });

      const result = await WorkoutService.getWorkouts(userId);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/workouts/user/${userId}`)
      );
      expect(result).toEqual(mockWorkouts);
    });

    it('should handle filters in query parameters', async () => {
      const filters = {
        type: 'strength',
        difficulty: 'intermediate',
        duration: { min: 30, max: 60 },
        muscleGroups: ['chest', 'shoulders'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await WorkoutService.getWorkouts(userId, filters);

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('type=strength');
      expect(calledUrl).toContain('difficulty=intermediate');
      expect(calledUrl).toContain('muscleGroups=chest%2Cshoulders');
    });

    it('should return mock data when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await WorkoutService.getWorkouts(userId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return mock data when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await WorkoutService.getWorkouts(userId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('createWorkout', () => {
    const userId = 'test-user-id';
    const workoutData = {
      name: 'New Workout',
      type: 'strength' as const,
      difficulty: 'intermediate' as const,
      estimatedDuration: 45,
      description: 'Test workout',
      exercises: [],
    };

    it('should create workout successfully', async () => {
      const createdWorkout = {
        id: 'new-workout-id',
        ...workoutData,
        userId,
        createdAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdWorkout,
      });

      const result = await WorkoutService.createWorkout(userId, workoutData);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/workouts',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining(workoutData.name),
        })
      );
      expect(result).toEqual(createdWorkout);
    });

    it('should handle creation errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(WorkoutService.createWorkout(userId, workoutData))
        .rejects.toThrow('Erreur lors de la création du workout');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      await expect(WorkoutService.createWorkout(userId, workoutData))
        .rejects.toThrow('Erreur lors de la création du workout');
    });
  });

  describe('updateWorkout', () => {
    const workoutId = 'workout-id';
    const updateData = {
      name: 'Updated Workout',
      difficulty: 'advanced' as const,
    };

    it('should update workout successfully', async () => {
      const updatedWorkout = {
        id: workoutId,
        name: updateData.name,
        difficulty: updateData.difficulty,
        updatedAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedWorkout,
      });

      const result = await WorkoutService.updateWorkout(workoutId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/workouts/${workoutId}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining(updateData.name),
        })
      );
      expect(result).toEqual(updatedWorkout);
    });
  });

  describe('deleteWorkout', () => {
    const workoutId = 'workout-to-delete';

    it('should delete workout successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await expect(WorkoutService.deleteWorkout(workoutId))
        .resolves.not.toThrow();

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/workouts/${workoutId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle deletion errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(WorkoutService.deleteWorkout(workoutId))
        .rejects.toThrow('Erreur lors de la suppression du workout');
    });
  });

  describe('getWorkoutStats', () => {
    const userId = 'test-user-id';

    it('should fetch workout statistics', async () => {
      const mockStats = {
        totalWorkouts: 25,
        totalDuration: 1250, // minutes
        totalCalories: 8500,
        averageDuration: 50,
        workoutsThisWeek: 4,
        workoutsThisMonth: 18,
        favoriteWorkoutType: 'strength',
        progressTrend: 'improving',
        lastWorkoutDate: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      const result = await WorkoutService.getWorkoutStats(userId);

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/workouts/user/${userId}/stats`
      );
      expect(result).toEqual(mockStats);
    });

    it('should return default stats when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Stats error'));

      const result = await WorkoutService.getWorkoutStats(userId);

      expect(result).toBeDefined();
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalDuration).toBe(0);
    });
  });

  describe('searchWorkouts', () => {
    const searchQuery = {
      query: 'push workout',
      filters: {
        type: 'strength',
        difficulty: 'intermediate',
      },
      userId: 'test-user-id',
    };

    it('should search workouts successfully', async () => {
      const mockResults = [
        {
          id: 'workout-1',
          name: 'Push Day Advanced',
          type: 'strength',
          relevanceScore: 0.95,
        },
        {
          id: 'workout-2',
          name: 'Upper Body Push',
          type: 'strength',
          relevanceScore: 0.87,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const result = await WorkoutService.searchWorkouts(searchQuery);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/workouts/search',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining(searchQuery.query),
        })
      );
      expect(result).toEqual(mockResults);
    });

    it('should handle empty search results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await WorkoutService.searchWorkouts({
        query: 'nonexistent workout',
      });

      expect(result).toEqual([]);
    });
  });

  describe('getWorkoutTemplates', () => {
    it('should fetch workout templates', async () => {
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Beginner Push',
          category: 'strength',
          duration: 30,
          difficulty: 'beginner',
          isPopular: true,
        },
        {
          id: 'template-2',
          name: 'HIIT Cardio',
          category: 'cardio',
          duration: 20,
          difficulty: 'intermediate',
          isPopular: false,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplates,
      });

      const result = await WorkoutService.getWorkoutTemplates();

      expect(mockFetch).toHaveBeenCalledWith('/api/workouts/templates');
      expect(result).toEqual(mockTemplates);
    });

    it('should filter templates by category', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await WorkoutService.getWorkoutTemplates({ category: 'strength' });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('category=strength');
    });
  });

  describe('Error handling', () => {
    it('should handle network timeouts', async () => {
      vi.useFakeTimers();
      
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 60000))
      );

      const promise = WorkoutService.getWorkouts('user-id');
      
      vi.advanceTimersByTime(60000);
      
      await expect(promise).resolves.toBeDefined();
      
      vi.useRealTimers();
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Malformed JSON');
        },
      });

      const result = await WorkoutService.getWorkouts('user-id');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Mock data fallbacks', () => {
    it('should provide realistic mock workouts', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API unavailable'));

      const result = await WorkoutService.getWorkouts('user-id');

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      
      const firstWorkout = result[0];
      expect(firstWorkout).toHaveProperty('id');
      expect(firstWorkout).toHaveProperty('name');
      expect(firstWorkout).toHaveProperty('type');
      expect(firstWorkout).toHaveProperty('exercises');
    });

    it('should provide consistent mock data structure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API unavailable'));

      const result = await WorkoutService.getWorkouts('user-id');

      result.forEach(workout => {
        expect(typeof workout.id).toBe('string');
        expect(typeof workout.name).toBe('string');
        expect(['strength', 'cardio', 'flexibility', 'sports'].includes(workout.type)).toBe(true);
        expect(Array.isArray(workout.exercises)).toBe(true);
      });
    });
  });
});