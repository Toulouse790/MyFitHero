/**
 * TESTS UNITAIRES - MODULE ANALYTICS
 * Tests complets pour analytics et métriques avancées
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnalyticsDashboard } from '@/features/analytics/components/AnalyticsDashboard';
import { PerformanceChart } from '@/features/analytics/components/PerformanceChart';
import { MetricsCalculator } from '@/features/analytics/components/MetricsCalculator';
import { ProgressTracker } from '@/features/analytics/components/ProgressTracker';
import { analyticsService } from '@/features/analytics/services/analyticsService';
import { analyticsStore } from '@/features/analytics/store/analyticsStore';
import { mockUser, mockAnalyticsData } from '@/test/mocks';

// Mock des services
jest.mock('@/features/analytics/services/analyticsService');
jest.mock('@/lib/supabase');

describe('Analytics Module - Tests Complets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    analyticsStore.getState().reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AnalyticsDashboard Component', () => {
    it('doit afficher le tableau de bord analytique complet', async () => {
      const mockDashboardData = {
        overviewMetrics: {
          totalWorkouts: 156,
          totalDuration: 8760, // minutes
          averageIntensity: 75,
          caloriesBurned: 45200,
          strengthGains: 23.5,
          cardioImprovement: 18.2
        },
        trendsData: {
          weeklyProgress: [85, 87, 90, 88, 92, 89, 94],
          monthlyComparison: { current: 89, previous: 82 },
          yearlyGrowth: 15.7
        },
        achievements: [
          { id: 1, title: 'Consistency King', description: '30 jours consécutifs', date: '2024-01-15' },
          { id: 2, title: 'Strength Master', description: '100% gains force', date: '2024-01-10' }
        ]
      };

      (analyticsService.getDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);

      render(<AnalyticsDashboard userId={mockUser.id} />);

      await waitFor(() => {
        expect(screen.getByText(/tableau de bord analytique/i)).toBeInTheDocument();
      });

      expect(screen.getByText('156')).toBeInTheDocument(); // Total workouts
      expect(screen.getByText(/45,200 calories/i)).toBeInTheDocument();
      expect(screen.getByText('Consistency King')).toBeInTheDocument();
      expect(screen.getByText(/23.5%/i)).toBeInTheDocument(); // Strength gains
    });

    it('doit permettre de filtrer les données par période', async () => {
      const mockFilteredData = {
        overviewMetrics: { totalWorkouts: 45 }
      };

      (analyticsService.getDashboardData as jest.Mock).mockResolvedValue(mockFilteredData);

      render(<AnalyticsDashboard userId={mockUser.id} />);

      await waitFor(() => {
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '30days' } });
      });

      await waitFor(() => {
        expect(analyticsService.getDashboardData).toHaveBeenCalledWith(
          mockUser.id,
          expect.objectContaining({ period: '30days' })
        );
      });
    });

    it('doit gérer les métriques en temps réel', async () => {
      const initialData = { overviewMetrics: { totalWorkouts: 100 } };
      const updatedData = { overviewMetrics: { totalWorkouts: 101 } };

      (analyticsService.getDashboardData as jest.Mock)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);

      render(<AnalyticsDashboard userId={mockUser.id} />);

      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument();
      });

      // Simulation d'une nouvelle séance
      analyticsStore.getState().updateRealTimeMetrics({ newWorkout: true });

      await waitFor(() => {
        expect(screen.getByText('101')).toBeInTheDocument();
      });
    });
  });

  describe('PerformanceChart Component', () => {
    it('doit afficher les graphiques de performance', () => {
      const mockChartData = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Force',
            data: [65, 70, 75, 80, 85, 90],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          },
          {
            label: 'Cardio',
            data: [60, 65, 68, 72, 78, 82],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }
        ]
      };

      render(
        <PerformanceChart 
          data={mockChartData} 
          type="line" 
          title="Évolution des performances"
        />
      );

      expect(screen.getByText(/évolution des performances/i)).toBeInTheDocument();
      expect(screen.getByText('Force')).toBeInTheDocument();
      expect(screen.getByText('Cardio')).toBeInTheDocument();
    });

    it('doit permettre de changer le type de graphique', () => {
      const mockData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
        datasets: [{ label: 'Test', data: [1, 2, 3, 4, 5] }]
      };

      const { rerender } = render(
        <PerformanceChart data={mockData} type="line" />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();

      rerender(<PerformanceChart data={mockData} type="bar" />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('doit gérer les interactions utilisateur sur le graphique', () => {
      const mockOnDataPointClick = jest.fn();
      const mockData = {
        labels: ['Point 1', 'Point 2'],
        datasets: [{ label: 'Test', data: [10, 20] }]
      };

      render(
        <PerformanceChart 
          data={mockData} 
          type="line" 
          onDataPointClick={mockOnDataPointClick}
        />
      );

      // Simulation d'un clic sur un point de données
      fireEvent.click(screen.getByTestId('chart-point-0'));

      expect(mockOnDataPointClick).toHaveBeenCalledWith(
        expect.objectContaining({ index: 0, value: 10 })
      );
    });
  });

  describe('MetricsCalculator Component', () => {
    it('doit calculer les métriques avancées', () => {
      const mockUserData = {
        workouts: [
          { date: '2024-01-15', type: 'strength', volume: 5000, intensity: 80 },
          { date: '2024-01-14', type: 'cardio', duration: 45, heartRate: 150 },
          { date: '2024-01-13', type: 'strength', volume: 5200, intensity: 85 }
        ],
        userProfile: {
          weight: 75,
          height: 180,
          age: 30,
          gender: 'male'
        }
      };

      render(<MetricsCalculator data={mockUserData} />);

      // Vérifier que les métriques calculées sont affichées
      expect(screen.getByText(/volume d'entraînement/i)).toBeInTheDocument();
      expect(screen.getByText(/intensité moyenne/i)).toBeInTheDocument();
      expect(screen.getByText(/charge progressive/i)).toBeInTheDocument();
    });

    it('doit calculer le score de forme physique composite', () => {
      const mockMetrics = {
        strengthScore: 85,
        cardioScore: 78,
        flexibilityScore: 70,
        enduranceScore: 82,
        recoveryScore: 88
      };

      render(<MetricsCalculator compositeMetrics={mockMetrics} />);

      // Score composite calculé : (85+78+70+82+88)/5 = 80.6
      expect(screen.getByText(/80\.6/)).toBeInTheDocument();
      expect(screen.getByText(/score composite/i)).toBeInTheDocument();
    });

    it('doit identifier les tendances et recommandations', () => {
      const mockTrendData = [
        { week: 1, performance: 70 },
        { week: 2, performance: 75 },
        { week: 3, performance: 73 },
        { week: 4, performance: 78 }
      ];

      render(<MetricsCalculator trendData={mockTrendData} />);

      expect(screen.getByText(/tendance positive/i)).toBeInTheDocument();
      expect(screen.getByText(/amélioration de 11%/i)).toBeInTheDocument();
    });
  });

  describe('ProgressTracker Component', () => {
    it('doit suivre les objectifs et les progrès', () => {
      const mockGoals = [
        {
          id: 1,
          title: 'Perdre 5kg',
          target: 70,
          current: 73,
          unit: 'kg',
          deadline: '2024-03-01',
          progress: 40
        },
        {
          id: 2,
          title: 'Courir 10km',
          target: 10,
          current: 7.5,
          unit: 'km',
          deadline: '2024-02-15',
          progress: 75
        }
      ];

      render(<ProgressTracker goals={mockGoals} />);

      expect(screen.getByText('Perdre 5kg')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('Courir 10km')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('doit permettre de mettre à jour les objectifs', async () => {
      const mockOnGoalUpdate = jest.fn();
      const mockGoals = [
        { id: 1, title: 'Test Goal', current: 5, target: 10 }
      ];

      render(
        <ProgressTracker 
          goals={mockGoals} 
          onGoalUpdate={mockOnGoalUpdate}
        />
      );

      fireEvent.click(screen.getByText(/mettre à jour/i));
      
      const input = screen.getByDisplayValue('5');
      fireEvent.change(input, { target: { value: '6' } });
      fireEvent.click(screen.getByText(/sauvegarder/i));

      await waitFor(() => {
        expect(mockOnGoalUpdate).toHaveBeenCalledWith(1, { current: 6 });
      });
    });

    it('doit calculer les projections et estimations', () => {
      const mockGoal = {
        id: 1,
        title: 'Objectif Fitness',
        target: 100,
        current: 60,
        startDate: '2024-01-01',
        deadline: '2024-03-01',
        progressHistory: [
          { date: '2024-01-01', value: 40 },
          { date: '2024-01-15', value: 50 },
          { date: '2024-01-30', value: 60 }
        ]
      };

      render(<ProgressTracker goals={[mockGoal]} showProjections={true} />);

      expect(screen.getByText(/projection/i)).toBeInTheDocument();
      expect(screen.getByText(/estimation.*mars/i)).toBeInTheDocument();
    });
  });

  describe('Analytics Service', () => {
    it('doit calculer les métriques de performance avancées', () => {
      const workoutData = [
        { type: 'strength', volume: 5000, intensity: 80, date: '2024-01-15' },
        { type: 'strength', volume: 5200, intensity: 82, date: '2024-01-16' },
        { type: 'cardio', duration: 45, avgHeartRate: 150, date: '2024-01-17' }
      ];

      const metrics = analyticsService.calculateAdvancedMetrics(workoutData);

      expect(metrics).toHaveProperty('volumeProgression');
      expect(metrics).toHaveProperty('intensityTrend');
      expect(metrics).toHaveProperty('workoutFrequency');
      expect(metrics.volumeProgression).toBeGreaterThan(0); // Progression positive
    });

    it('doit générer des insights personnalisés', () => {
      const userData = {
        fitnessLevel: 'intermediate',
        goals: ['weight_loss', 'strength'],
        preferences: ['morning_workouts'],
        limitations: ['knee_injury'],
        recentPerformance: { trend: 'improving', consistency: 85 }
      };

      const insights = analyticsService.generatePersonalizedInsights(userData);

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toHaveProperty('type');
      expect(insights[0]).toHaveProperty('message');
      expect(insights[0]).toHaveProperty('actionable');
    });

    it('doit prédire les performances futures', () => {
      const historicalData = [
        { month: 1, performance: 70 },
        { month: 2, performance: 75 },
        { month: 3, performance: 78 },
        { month: 4, performance: 82 }
      ];

      const predictions = analyticsService.predictFuturePerformance(
        historicalData, 
        3 // 3 mois futurs
      );

      expect(Array.isArray(predictions)).toBe(true);
      expect(predictions.length).toBe(3);
      expect(predictions[0]).toHaveProperty('month');
      expect(predictions[0]).toHaveProperty('predictedPerformance');
      expect(predictions[0]).toHaveProperty('confidenceInterval');
    });

    it('doit analyser les patterns comportementaux', () => {
      const behaviorData = {
        workoutTimes: ['07:00', '07:30', '06:45', '07:15', '08:00'],
        workoutDurations: [45, 60, 50, 55, 40],
        skipPatterns: ['sunday', 'friday_evening'],
        preferredExercises: ['squat', 'deadlift', 'bench_press']
      };

      const analysis = analyticsService.analyzeBehaviorPatterns(behaviorData);

      expect(analysis).toHaveProperty('optimalWorkoutTime');
      expect(analysis).toHaveProperty('preferredDuration');
      expect(analysis).toHaveProperty('riskFactors');
      expect(analysis.optimalWorkoutTime).toMatch(/07:00|07:30|morning/i);
    });
  });

  describe('Analytics Store', () => {
    it('doit gérer l\'état analytique global', () => {
      const { getState, setState } = analyticsStore;

      setState({
        dashboardData: mockAnalyticsData.dashboard,
        selectedPeriod: '90days',
        isLoading: false,
        lastUpdated: new Date().toISOString()
      });

      const state = getState();
      expect(state.dashboardData).toEqual(mockAnalyticsData.dashboard);
      expect(state.selectedPeriod).toBe('90days');
      expect(state.isLoading).toBe(false);
    });

    it('doit mettre à jour les métriques en temps réel', () => {
      const newMetrics = {
        totalWorkouts: 157,
        weeklyProgress: [85, 87, 90, 88, 92, 89, 95]
      };

      analyticsStore.getState().updateRealTimeMetrics(newMetrics);

      const state = analyticsStore.getState();
      expect(state.dashboardData.overviewMetrics.totalWorkouts).toBe(157);
    });

    it('doit gérer le cache des données analytiques', () => {
      const testData = { test: 'data' };
      const cacheKey = 'dashboard_30days_user123';

      analyticsStore.getState().setCacheData(cacheKey, testData);
      
      const cachedData = analyticsStore.getState().getCacheData(cacheKey);
      expect(cachedData).toEqual(testData);
    });
  });

  describe('Intégration Cross-Module Analytics', () => {
    it('doit agréger les données de tous les modules', async () => {
      const mockAggregatedData = {
        workout: { sessions: 45, totalVolume: 15000 },
        nutrition: { mealsLogged: 135, avgCalories: 2200 },
        sleep: { avgDuration: 7.5, avgQuality: 82 },
        recovery: { avgScore: 78, sessionsCompleted: 12 }
      };

      (analyticsService.aggregateCrossModuleData as jest.Mock).mockResolvedValue(
        mockAggregatedData
      );

      const result = await analyticsService.aggregateCrossModuleData(mockUser.id);

      expect(result).toEqual(mockAggregatedData);
      expect(result.workout.sessions).toBe(45);
      expect(result.nutrition.mealsLogged).toBe(135);
    });

    it('doit générer des corrélations inter-modules', () => {
      const moduleData = {
        sleep: [7.5, 8.0, 6.5, 7.8, 8.2],
        workout_performance: [75, 82, 68, 78, 85],
        nutrition_compliance: [85, 90, 75, 88, 92],
        recovery_score: [78, 85, 70, 82, 88]
      };

      const correlations = analyticsService.calculateCrossModuleCorrelations(moduleData);

      expect(correlations).toHaveProperty('sleep_workout');
      expect(correlations).toHaveProperty('nutrition_recovery');
      expect(correlations.sleep_workout).toBeGreaterThan(0.5); // Corrélation positive
    });

    it('doit optimiser les recommandations cross-module', () => {
      const userMetrics = {
        workoutConsistency: 75,
        sleepQuality: 60, // Faible
        nutritionScore: 85,
        recoveryRate: 70
      };

      const recommendations = analyticsService.getCrossModuleRecommendations(userMetrics);

      expect(recommendations).toContain(
        expect.objectContaining({
          module: 'sleep',
          priority: 'high',
          reason: expect.stringContaining('qualité du sommeil')
        })
      );
    });
  });
});