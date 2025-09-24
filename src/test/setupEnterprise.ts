import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

// Enterprise-grade MSW server for API mocking
export const server = setupServer(
  // Supabase Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock_access_token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token',
      user: {
        id: 'mock_user_id',
        email: 'test@example.com',
        role: 'authenticated'
      }
    });
  }),

  // User profiles
  http.get('*/rest/v1/user_profiles', () => {
    return HttpResponse.json([
      {
        id: 'mock_user_id',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        onboarding_completed: true,
        preferences: {
          units: 'metric',
          language: 'en',
          notifications: true
        }
      }
    ]);
  }),

  // Workouts endpoints
  http.get('*/rest/v1/workouts', () => {
    return HttpResponse.json([
      {
        id: 'workout_1',
        user_id: 'mock_user_id',
        name: 'Morning Workout',
        type: 'strength',
        duration: 45,
        exercises: [
          {
            id: 'exercise_1',
            name: 'Push-ups',
            sets: 3,
            reps: 15,
            weight: null
          }
        ],
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ]);
  }),

  // Nutrition endpoints
  http.get('*/rest/v1/nutrition_entries', () => {
    return HttpResponse.json([
      {
        id: 'nutrition_1',
        user_id: 'mock_user_id',
        food_name: 'Apple',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        logged_at: new Date().toISOString()
      }
    ]);
  }),

  // Sleep tracking
  http.get('*/rest/v1/sleep_records', () => {
    return HttpResponse.json([
      {
        id: 'sleep_1',
        user_id: 'mock_user_id',
        bedtime: '22:00',
        wake_time: '07:00',
        quality: 8,
        duration: 540, // minutes
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  }),

  // AI Coach endpoints
  http.post('*/ai/chat', () => {
    return HttpResponse.json({
      message: 'Great job on your workout! Here are some recommendations...',
      recommendations: [
        {
          type: 'recovery',
          priority: 'high',
          content: 'Consider a 10-minute cool down stretch'
        }
      ]
    });
  }),

  // Analytics endpoints
  http.get('*/rest/v1/user_analytics', () => {
    return HttpResponse.json({
      workouts_this_week: 3,
      calories_burned: 1200,
      average_sleep: 7.5,
      hydration_goal: 0.8,
      streak_days: 5
    });
  }),

  // Error simulation endpoints for testing error handling
  http.get('*/api/error/500', () => {
    return new HttpResponse(null, { status: 500 });
  }),

  http.get('*/api/error/401', () => {
    return new HttpResponse(null, { status: 401 });
  }),

  http.get('*/api/error/network', () => {
    return HttpResponse.error();
  })
);

// Enterprise test setup
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
  
  // Security test setup
  process.env.NODE_ENV = 'test';
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'test_anon_key';
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
  
  // Clean up DOM after each test
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

afterAll(() => {
  server.close();
});

// Enterprise testing utilities
export const testHelpers = {
  // Create authenticated user session
  createAuthenticatedUser: () => ({
    id: 'mock_user_id',
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'authenticated'
  }),

  // Create mock workout data
  createMockWorkout: (overrides = {}) => ({
    id: 'workout_1',
    user_id: 'mock_user_id',
    name: 'Test Workout',
    type: 'strength',
    duration: 30,
    exercises: [],
    completed_at: new Date().toISOString(),
    ...overrides
  }),

  // Create mock nutrition data
  createMockNutrition: (overrides = {}) => ({
    id: 'nutrition_1',
    user_id: 'mock_user_id',
    food_name: 'Test Food',
    calories: 100,
    protein: 10,
    carbs: 15,
    fat: 5,
    logged_at: new Date().toISOString(),
    ...overrides
  }),

  // Simulate network latency
  simulateNetworkDelay: (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Performance testing helper
  measurePerformance: async (fn: () => Promise<void> | void) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    return end - start;
  },

  // Security testing helper
  sanitizeInput: (input: string) => {
    // Basic XSS protection for testing
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
};

// Global test configuration
export const testConfig = {
  timeout: 10000,
  retries: 2,
  performanceThreshold: 1000, // ms
  coverageThreshold: 85, // percentage
};