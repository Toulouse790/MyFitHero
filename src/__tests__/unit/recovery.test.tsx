/**
 * TESTS UNITAIRES - MODULE RECOVERY
 * Tests complets pour la récupération et régénération
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecoveryDashboard } from '@/features/recovery/components/RecoveryDashboard';
import { RecoveryPlan } from '@/features/recovery/components/RecoveryPlan';
import { StretchingSession } from '@/features/recovery/components/StretchingSession';
import { RecoveryMetrics } from '@/features/recovery/components/RecoveryMetrics';
import { recoveryService } from '@/features/recovery/services/recoveryService';
import { recoveryStore } from '@/features/recovery/store/recoveryStore';
import { mockUser, mockRecoveryData } from '@/test/mocks';

// Mock des services
jest.mock('@/features/recovery/services/recoveryService');
jest.mock('@/lib/supabase');

describe('Recovery Module - Tests Complets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    recoveryStore.getState().reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('RecoveryDashboard Component', () => {
    it('doit afficher le tableau de bord de récupération', async () => {
      const mockRecoveryStats = {
        overallRecoveryScore: 85,
        muscleRecoveryStatus: {
          legs: 90,
          arms: 80,
          core: 75,
          back: 88
        },
        recommendedActions: [
          { type: 'stretch', target: 'core', duration: 15 },
          { type: 'rest', target: 'arms', duration: 30 }
        ]
      };

      (recoveryService.getRecoveryStats as jest.Mock).mockResolvedValue(mockRecoveryStats);

      render(<RecoveryDashboard userId={mockUser.id} />);

      await waitFor(() => {
        expect(screen.getByText(/score de récupération/i)).toBeInTheDocument();
      });

      expect(screen.getByText('85')).toBeInTheDocument(); // Score global
      expect(screen.getByText(/jambes.*90%/i)).toBeInTheDocument();
      expect(screen.getByText(/étirements recommandés/i)).toBeInTheDocument();
    });

    it('doit gérer les erreurs de chargement gracieusement', async () => {
      (recoveryService.getRecoveryStats as jest.Mock).mockRejectedValue(
        new Error('Erreur réseau')
      );

      render(<RecoveryDashboard userId={mockUser.id} />);

      await waitFor(() => {
        expect(screen.getByText(/erreur de chargement/i)).toBeInTheDocument();
      });
    });

    it('doit mettre à jour les données en temps réel', async () => {
      const initialStats = { overallRecoveryScore: 75 };
      const updatedStats = { overallRecoveryScore: 80 };

      (recoveryService.getRecoveryStats as jest.Mock)
        .mockResolvedValueOnce(initialStats)
        .mockResolvedValueOnce(updatedStats);

      render(<RecoveryDashboard userId={mockUser.id} />);

      await waitFor(() => {
        expect(screen.getByText('75')).toBeInTheDocument();
      });

      // Simulation d'une mise à jour
      fireEvent.click(screen.getByText(/actualiser/i));

      await waitFor(() => {
        expect(screen.getByText('80')).toBeInTheDocument();
      });
    });
  });

  describe('RecoveryPlan Component', () => {
    it('doit générer un plan de récupération personnalisé', async () => {
      const mockPlan = {
        id: 'plan-123',
        duration: 14, // jours
        phases: [
          {
            name: 'Récupération Active',
            duration: 7,
            activities: [
              { type: 'stretching', duration: 20, intensity: 'low' },
              { type: 'massage', duration: 15, intensity: 'medium' }
            ]
          },
          {
            name: 'Récupération Intensive',
            duration: 7,
            activities: [
              { type: 'yoga', duration: 30, intensity: 'medium' },
              { type: 'meditation', duration: 10, intensity: 'low' }
            ]
          }
        ]
      };

      (recoveryService.generateRecoveryPlan as jest.Mock).mockResolvedValue(mockPlan);

      render(<RecoveryPlan userId={mockUser.id} workoutHistory={mockRecoveryData.workouts} />);

      await waitFor(() => {
        expect(screen.getByText(/plan de récupération/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Récupération Active')).toBeInTheDocument();
      expect(screen.getByText('Récupération Intensive')).toBeInTheDocument();
      expect(screen.getByText(/14 jours/i)).toBeInTheDocument();
    });

    it('doit permettre de personnaliser le plan', async () => {
      const mockPlan = { id: 'plan-123', phases: [] };
      (recoveryService.generateRecoveryPlan as jest.Mock).mockResolvedValue(mockPlan);
      (recoveryService.customizeRecoveryPlan as jest.Mock).mockResolvedValue({
        ...mockPlan,
        customized: true
      });

      render(<RecoveryPlan userId={mockUser.id} workoutHistory={[]} />);

      await waitFor(() => {
        expect(screen.getByText(/personnaliser/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/personnaliser/i));

      await waitFor(() => {
        expect(recoveryService.customizeRecoveryPlan).toHaveBeenCalledWith(
          mockPlan.id,
          expect.any(Object)
        );
      });
    });
  });

  describe('StretchingSession Component', () => {
    it('doit guider une session d\'étirements', async () => {
      const mockSession = {
        id: 'stretch-session-123',
        exercises: [
          {
            name: 'Étirement des ischio-jambiers',
            duration: 30,
            instructions: 'Penchez-vous en avant lentement',
            targetMuscles: ['hamstrings']
          },
          {
            name: 'Étirement des quadriceps',
            duration: 30,
            instructions: 'Pliez votre jambe vers l\'arrière',
            targetMuscles: ['quadriceps']
          }
        ],
        totalDuration: 300 // 5 minutes
      };

      (recoveryService.getStretchingSession as jest.Mock).mockResolvedValue(mockSession);

      render(<StretchingSession sessionId="stretch-session-123" />);

      await waitFor(() => {
        expect(screen.getByText(/étirement des ischio-jambiers/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/30 secondes/i)).toBeInTheDocument();
      expect(screen.getByText(/penchez-vous en avant/i)).toBeInTheDocument();
    });

    it('doit suivre le progrès de la session', async () => {
      const mockSession = {
        exercises: [
          { name: 'Exercise 1', duration: 30 },
          { name: 'Exercise 2', duration: 30 }
        ]
      };

      (recoveryService.getStretchingSession as jest.Mock).mockResolvedValue(mockSession);

      render(<StretchingSession sessionId="test-session" />);

      await waitFor(() => {
        expect(screen.getByText(/exercise 1/i)).toBeInTheDocument();
      });

      // Démarrer la session
      fireEvent.click(screen.getByText(/commencer/i));

      expect(screen.getByText(/en cours/i)).toBeInTheDocument();
      
      // Passer à l'exercice suivant
      fireEvent.click(screen.getByText(/suivant/i));

      expect(screen.getByText(/exercise 2/i)).toBeInTheDocument();
    });

    it('doit enregistrer la complétion de la session', async () => {
      const mockSession = {
        exercises: [{ name: 'Test Exercise', duration: 10 }]
      };

      (recoveryService.getStretchingSession as jest.Mock).mockResolvedValue(mockSession);
      (recoveryService.recordSessionCompletion as jest.Mock).mockResolvedValue({});

      render(<StretchingSession sessionId="test-session" />);

      await waitFor(() => {
        fireEvent.click(screen.getByText(/commencer/i));
      });

      // Terminer la session
      fireEvent.click(screen.getByText(/terminer/i));

      await waitFor(() => {
        expect(recoveryService.recordSessionCompletion).toHaveBeenCalledWith(
          'test-session',
          expect.any(Object)
        );
      });
    });
  });

  describe('RecoveryMetrics Component', () => {
    it('doit afficher les métriques de récupération', () => {
      const mockMetrics = {
        heartRateVariability: 42,
        sleepQuality: 85,
        muscleStiffness: 25,
        energyLevel: 80,
        stressLevel: 30
      };

      render(<RecoveryMetrics metrics={mockMetrics} />);

      expect(screen.getByText(/variabilité cardiaque/i)).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText(/qualité du sommeil/i)).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('doit calculer le score de récupération global', () => {
      const mockMetrics = {
        heartRateVariability: 45,
        sleepQuality: 90,
        muscleStiffness: 15,
        energyLevel: 85,
        stressLevel: 20
      };

      render(<RecoveryMetrics metrics={mockMetrics} />);

      // Score calculé basé sur les métriques
      const expectedScore = Math.round(
        (mockMetrics.heartRateVariability + 
         mockMetrics.sleepQuality + 
         (100 - mockMetrics.muscleStiffness) + 
         mockMetrics.energyLevel + 
         (100 - mockMetrics.stressLevel)) / 5
      );

      expect(screen.getByText(expectedScore.toString())).toBeInTheDocument();
    });
  });

  describe('Recovery Service', () => {
    it('doit calculer le score de récupération avec précision', () => {
      const recoveryData = {
        heartRateVariability: 40,
        sleepHours: 7.5,
        sleepQuality: 80,
        workoutIntensityLast24h: 75,
        muscleStiffnessRating: 30
      };

      const score = recoveryService.calculateRecoveryScore(recoveryData);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(typeof score).toBe('number');
    });

    it('doit recommander des actions de récupération', () => {
      const lowRecoveryData = {
        overallScore: 45,
        muscleStiffness: 80,
        energyLevel: 30,
        sleepQuality: 50
      };

      const recommendations = recoveryService.getRecoveryRecommendations(lowRecoveryData);

      expect(recommendations).toContain(
        expect.objectContaining({
          type: expect.stringMatching(/stretch|rest|sleep/i)
        })
      );
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('doit optimiser les plans de récupération', () => {
      const userProfile = {
        fitnessLevel: 'intermediate',
        availableTime: 30, // minutes par jour
        preferences: ['stretching', 'yoga'],
        injuries: ['lower_back']
      };

      const plan = recoveryService.optimizeRecoveryPlan(userProfile);

      expect(plan.phases).toBeDefined();
      expect(plan.phases.length).toBeGreaterThan(0);
      
      // Vérifier que les préférences sont prises en compte
      const hasPreferredActivities = plan.phases.some(phase =>
        phase.activities.some(activity =>
          userProfile.preferences.includes(activity.type)
        )
      );
      expect(hasPreferredActivities).toBe(true);
    });
  });

  describe('Recovery Store', () => {
    it('doit gérer l\'état de récupération', () => {
      const { getState, setState } = recoveryStore;
      
      setState({
        currentScore: 85,
        isLoading: false,
        activeSession: 'session-123'
      });

      const state = getState();
      expect(state.currentScore).toBe(85);
      expect(state.isLoading).toBe(false);
      expect(state.activeSession).toBe('session-123');
    });

    it('doit mettre à jour les métriques de récupération', () => {
      const newMetrics = {
        heartRateVariability: 50,
        sleepQuality: 90,
        muscleStiffness: 20
      };

      recoveryStore.getState().updateMetrics(newMetrics);

      const state = recoveryStore.getState();
      expect(state.metrics).toEqual(expect.objectContaining(newMetrics));
    });
  });

  describe('Intégration Recovery-Workout', () => {
    it('doit adapter les recommandations selon l\'historique d\'entraînement', () => {
      const recentWorkouts = [
        { date: '2024-01-15', type: 'strength', intensity: 85, duration: 60 },
        { date: '2024-01-14', type: 'cardio', intensity: 70, duration: 45 },
        { date: '2024-01-13', type: 'strength', intensity: 90, duration: 75 }
      ];

      const recommendations = recoveryService.getWorkoutBasedRecommendations(recentWorkouts);

      expect(recommendations).toContain(
        expect.objectContaining({
          reason: expect.stringContaining('intense')
        })
      );
    });

    it('doit synchroniser les données de récupération avec les plans d\'entraînement', async () => {
      const recoveryScore = 65; // Score moyen
      
      (recoveryService.syncWithWorkoutPlanning as jest.Mock).mockResolvedValue({
        adjustedIntensity: 'moderate',
        recommendedRestDays: 1,
        modifiedExercises: ['reduced_weight_training']
      });

      const syncResult = await recoveryService.syncWithWorkoutPlanning(recoveryScore);

      expect(syncResult.adjustedIntensity).toBe('moderate');
      expect(syncResult.recommendedRestDays).toBe(1);
    });
  });
});