/**
 * MOCKS DE TEST - DONNÉES FICTIVES POUR TESTS
 * Mocks réutilisables pour tous les modules de tests
 */

// Mock User
export const mockUser = {
  id: 'test-user-123',
  email: 'test@myfithero.com',
  name: 'Test User',
  profile: {
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate',
    goals: ['weight_loss', 'muscle_gain']
  }
};

// Mock AI Coach Data
export const mockAICoachData = {
  recommendations: [
    { type: 'exercise', message: 'Ajoutez 10 minutes de cardio', priority: 'high' },
    { type: 'nutrition', message: 'Augmentez vos protéines', priority: 'medium' }
  ],
  insights: [
    { category: 'performance', insight: 'Vos performances s\'améliorent de 15%', confidence: 0.85 }
  ]
};

// Mock Workout Data
export const mockWorkoutData = {
  sessions: [
    {
      id: 'workout-1',
      name: 'Upper Body Strength',
      duration: 45,
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12, weight: 0 },
        { name: 'Bench Press', sets: 3, reps: 10, weight: 60 }
      ],
      date: '2024-01-15'
    }
  ]
};

// Mock Nutrition Data
export const mockNutritionData = {
  meals: [
    {
      id: 'meal-1',
      name: 'Breakfast',
      calories: 450,
      macros: { protein: 25, carbs: 40, fat: 15 },
      date: '2024-01-15'
    }
  ],
  dailyGoals: {
    calories: 2200,
    protein: 120,
    carbs: 200,
    fat: 80
  }
};

// Mock Sleep Data
export const mockSleepData = {
  sessions: [
    {
      id: 'sleep-1',
      bedTime: '23:00',
      wakeTime: '07:00',
      quality: 8.5,
      duration: 8,
      date: '2024-01-15'
    }
  ]
};

// Mock Recovery Data
export const mockRecoveryData = {
  workouts: [
    { date: '2024-01-14', intensity: 8, muscle_groups: ['chest', 'shoulders'] },
    { date: '2024-01-13', intensity: 6, muscle_groups: ['legs'] }
  ],
  metrics: {
    heartRateVariability: 45,
    sleepQuality: 85,
    muscleStiffness: 20,
    energyLevel: 80
  }
};

// Mock Analytics Data  
export const mockAnalyticsData = {
  dashboard: {
    overviewMetrics: {
      totalWorkouts: 150,
      totalDuration: 7500,
      caloriesBurned: 45000,
      strengthGains: 22.5
    }
  },
  trends: {
    weekly: [80, 85, 82, 88, 90, 87, 92],
    monthly: { current: 88, previous: 81 }
  }
};

// Mock Services
export const mockServices = {
  aiCoach: {
    getRecommendations: jest.fn().mockResolvedValue(mockAICoachData.recommendations),
    getInsights: jest.fn().mockResolvedValue(mockAICoachData.insights)
  },
  workout: {
    getSessions: jest.fn().mockResolvedValue(mockWorkoutData.sessions),
    createSession: jest.fn().mockResolvedValue({ id: 'new-workout' })
  },
  nutrition: {
    getMeals: jest.fn().mockResolvedValue(mockNutritionData.meals),
    getDailyGoals: jest.fn().mockResolvedValue(mockNutritionData.dailyGoals)
  },
  sleep: {
    getSessions: jest.fn().mockResolvedValue(mockSleepData.sessions),
    analyzeQuality: jest.fn().mockResolvedValue({ score: 8.5, recommendations: [] })
  },
  recovery: {
    getMetrics: jest.fn().mockResolvedValue(mockRecoveryData.metrics),
    generatePlan: jest.fn().mockResolvedValue({ id: 'recovery-plan-1' })
  },
  analytics: {
    getDashboard: jest.fn().mockResolvedValue(mockAnalyticsData.dashboard),
    getTrends: jest.fn().mockResolvedValue(mockAnalyticsData.trends)
  }
};

// Mock Supabase Client
export const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
    then: jest.fn().mockResolvedValue({ data: [mockUser], error: null })
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signIn: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null })
  }
};

// Mock React Router
export const mockNavigate = jest.fn();
export const mockLocation = { pathname: '/', search: '', hash: '', state: null };

// Mock Zustand Stores
export const mockStores = {
  auth: {
    user: mockUser,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  },
  workout: {
    currentSession: null,
    sessions: mockWorkoutData.sessions,
    addSession: jest.fn(),
    updateSession: jest.fn()
  },
  nutrition: {
    meals: mockNutritionData.meals,
    dailyGoals: mockNutritionData.dailyGoals,
    addMeal: jest.fn(),
    updateGoals: jest.fn()
  }
};

// Helper pour reset tous les mocks
export const resetAllMocks = () => {
  Object.values(mockServices).forEach(service => {
    Object.values(service).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear();
      }
    });
  });
  
  if (jest.isMockFunction(mockNavigate)) {
    mockNavigate.mockClear();
  }
};