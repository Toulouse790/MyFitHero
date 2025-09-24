/**
 * TESTS UNITAIRES EXHAUSTIFS - MODULE WORKOUT  
 * Tests pour tous les composants critiques workout
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutSessionComponent } from '../../../features/workout/components/WorkoutSession';
import { WorkoutService } from '../../../features/workout/services/WorkoutService';

jest.mock('../../../features/workout/services/WorkoutService');

describe('💪 WORKOUT MODULE - Tests Unitaires Exhaustifs', () => {
  describe('WorkoutSession Component', () => {
    const mockWorkout = {
      id: 'workout-123',
      name: 'Push Day - Upper Body',
      exercises: [
        {
          id: 'ex-1',
          name: 'Bench Press',
          sets: 4,
          reps: [8, 8, 6, 6],
          weight: [80, 80, 85, 85],
          rest_time: 120,
          muscle_groups: ['chest', 'triceps', 'shoulders']
        },
        {
          id: 'ex-2', 
          name: 'Overhead Press',
          sets: 3,
          reps: [10, 8, 8],
          weight: [50, 52.5, 52.5],
          rest_time: 90,
          muscle_groups: ['shoulders', 'triceps']
        }
      ],
      estimated_duration: 75,
      difficulty: 'intermediate',
      target_muscles: ['chest', 'shoulders', 'triceps']
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (useWorkout as jest.Mock).mockReturnValue({
        currentWorkout: mockWorkout,
        isActive: false,
        startWorkout: jest.fn(),
        completeSet: jest.fn(),
        isLoading: false
      });
    });

    it('affiche correctement les détails du workout', () => {
      render(<WorkoutSession workout={mockWorkout} />);
      
      expect(screen.getByText('Push Day - Upper Body')).toBeInTheDocument();
      expect(screen.getByText('75 min')).toBeInTheDocument();
      expect(screen.getByText('Intermédiaire')).toBeInTheDocument();
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Overhead Press')).toBeInTheDocument();
    });

    it('démarre une session de workout correctement', async () => {
      const mockStartWorkout = jest.fn();
      (useWorkout as jest.Mock).mockReturnValue({
        currentWorkout: mockWorkout,
        isActive: false,
        startWorkout: mockStartWorkout,
        completeSet: jest.fn(),
        isLoading: false
      });

      render(<WorkoutSession workout={mockWorkout} />);
      
      const startButton = screen.getByTestId('start-workout-button');
      fireEvent.click(startButton);

      expect(mockStartWorkout).toHaveBeenCalledWith(mockWorkout.id);
    });

    it('track les séries et répétitions en temps réel', async () => {
      const mockCompleteSet = jest.fn();
      (useWorkout as jest.Mock).mockReturnValue({
        currentWorkout: mockWorkout,
        isActive: true,
        startWorkout: jest.fn(),
        completeSet: mockCompleteSet,
        isLoading: false
      });

      render(<WorkoutSession workout={mockWorkout} />);

      // Compléter la première série du bench press
      const completeSetButton = screen.getByTestId('complete-set-ex-1-0');
      fireEvent.click(completeSetButton);

      expect(mockCompleteSet).toHaveBeenCalledWith('ex-1', 0, {
        reps: 8,
        weight: 80
      });
    });

    it('calcule et affiche la progression en temps réel', () => {
      render(<WorkoutSession workout={mockWorkout} />);

      // Vérifier l'affichage des métriques de progression
      expect(screen.getByTestId('workout-progress')).toBeInTheDocument();
      expect(screen.getByTestId('volume-tracker')).toBeInTheDocument();
      expect(screen.getByTestId('time-elapsed')).toBeInTheDocument();
    });

    it('gère le timer de repos entre les séries', async () => {
      (useWorkout as jest.Mock).mockReturnValue({
        currentWorkout: mockWorkout,
        isActive: true,
        startWorkout: jest.fn(),
        completeSet: jest.fn(),
        isLoading: false,
        restTimer: { timeLeft: 120, isActive: true }
      });

      render(<WorkoutSession workout={mockWorkout} />);

      expect(screen.getByTestId('rest-timer')).toBeInTheDocument();
      expect(screen.getByText('2:00')).toBeInTheDocument();
    });

    it('affiche les conseils de forme et technique', () => {
      render(<WorkoutSession workout={mockWorkout} />);

      const benchPressCard = screen.getByTestId('exercise-card-ex-1');
      fireEvent.click(benchPressCard);

      expect(screen.getByTestId('exercise-tips')).toBeInTheDocument();
      expect(screen.getByText(/technique/i)).toBeInTheDocument();
    });

    describe('Gestion des erreurs et edge cases', () => {
      it('gère un workout sans exercices', () => {
        const emptyWorkout = { ...mockWorkout, exercises: [] };
        render(<WorkoutSession workout={emptyWorkout} />);

        expect(screen.getByText(/aucun exercice/i)).toBeInTheDocument();
      });

      it('gère l\'interruption d\'une session', async () => {
        (useWorkout as jest.Mock).mockReturnValue({
          currentWorkout: mockWorkout,
          isActive: true,
          startWorkout: jest.fn(),
          pauseWorkout: jest.fn(),
          completeSet: jest.fn(),
          isLoading: false
        });

        render(<WorkoutSession workout={mockWorkout} />);

        const pauseButton = screen.getByTestId('pause-workout');
        fireEvent.click(pauseButton);

        expect(screen.getByTestId('pause-confirmation')).toBeInTheDocument();
      });

      it('sauvegarde automatiquement la progression', async () => {
        const mockSaveProgress = jest.fn();
        (WorkoutService.saveWorkoutProgress as jest.Mock).mockImplementation(mockSaveProgress);

        render(<WorkoutSession workout={mockWorkout} />);

        // Simuler complétion d'une série
        const completeSetButton = screen.getByTestId('complete-set-ex-1-0');
        fireEvent.click(completeSetButton);

        await waitFor(() => {
          expect(mockSaveProgress).toHaveBeenCalled();
        });
      });
    });
  });

  describe('WorkoutService', () => {
    it('calcule correctement le volume total d\'entraînement', () => {
      const workoutData = {
        exercises: [
          { sets: 4, reps: [8, 8, 6, 6], weight: [80, 80, 85, 85] },
          { sets: 3, reps: [10, 8, 8], weight: [50, 52.5, 52.5] }
        ]
      };

      const totalVolume = WorkoutService.calculateTotalVolume(workoutData);
      
      // Bench: (8*80 + 8*80 + 6*85 + 6*85) = 2300
      // OHP: (10*50 + 8*52.5 + 8*52.5) = 1340  
      // Total: 3640
      expect(totalVolume).toBe(3640);
    });

    it('détecte automatiquement la progression de force', () => {
      const previousSession = {
        'bench-press': { best_set: { weight: 80, reps: 8 } }
      };

      const currentSession = {
        'bench-press': { best_set: { weight: 85, reps: 8 } }
      };

      const progression = WorkoutService.analyzeProgression(previousSession, currentSession);
      
      expect(progression['bench-press'].type).toBe('strength');
      expect(progression['bench-press'].improvement).toBe(6.25); // +6.25%
    });

    it('recommande des ajustements de charge basés sur la performance', () => {
      const performanceData = {
        exerciseId: 'bench-press',
        target_reps: 8,
        completed_reps: [10, 9, 8, 7],
        rpe_scores: [6, 7, 8, 9], // Rate of Perceived Exertion
        weight: 80
      };

      const recommendation = WorkoutService.recommendLoadAdjustment(performanceData);
      
      // Si l'utilisateur fait plus de reps que prévu avec RPE faible, augmenter la charge
      expect(recommendation.action).toBe('increase');
      expect(recommendation.new_weight).toBeGreaterThan(80);
    });

    it('calcule le temps de récupération optimal basé sur l\'intensité', () => {
      const highIntensitySet = { weight: 100, reps: 3, intensity: 95 }; // 95% 1RM
      const moderateIntensitySet = { weight: 75, reps: 10, intensity: 75 }; // 75% 1RM

      const highRestTime = WorkoutService.calculateOptimalRest(highIntensitySet);
      const moderateRestTime = WorkoutService.calculateOptimalRest(moderateIntensitySet);

      expect(highRestTime).toBeGreaterThanOrEqual(180); // 3+ minutes pour haute intensité
      expect(moderateRestTime).toBeLessThanOrEqual(90); // ≤90s pour intensité modérée
    });
  });

  describe('Smart Features', () => {
    it('détecte automatiquement les plateaux de progression', () => {
      // Simulation 4 semaines sans progression
      const workoutHistory = Array(4).fill(null).map((_, week) => ({
        week: week + 1,
        bench_press_max: 80, // Pas d'amélioration
        total_volume: 3500
      }));

      const plateauAnalysis = WorkoutService.detectPlateau(workoutHistory);
      
      expect(plateauAnalysis.detected).toBe(true);
      expect(plateauAnalysis.exercise).toBe('bench_press');
      expect(plateauAnalysis.recommendations).toContain('deload');
    });

    it('génère des workouts personnalisés basés sur l\'historique', () => {
      const userProfile = {
        experience: 'intermediate',
        goals: ['strength', 'hypertrophy'],
        available_time: 60,
        equipment: ['barbell', 'dumbbells', 'rack'],
        weak_points: ['triceps', 'rear-delts']
      };

      const previousWorkouts = [
        { focus: 'chest', frequency: 'twice-weekly', response: 'good' },
        { focus: 'legs', frequency: 'once-weekly', response: 'poor' }
      ];

      const generatedWorkout = WorkoutService.generatePersonalizedWorkout(
        userProfile, 
        previousWorkouts
      );

      expect(generatedWorkout.exercises).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ target_muscle: 'triceps' }),
          expect.objectContaining({ target_muscle: 'rear-delts' })
        ])
      );
      expect(generatedWorkout.estimated_duration).toBeLessThanOrEqual(60);
    });

    it('ajuste automatiquement la difficulté basée sur la récupération', () => {
      const recoveryMetrics = {
        hrv_score: 35, // Faible (fatigue élevée)
        sleep_quality: 6, // Mauvaise récupération
        muscle_soreness: 8, // Très douloureux
        stress_level: 7 // Élevé
      };

      const adjustment = WorkoutService.adjustWorkoutDifficulty(
        mockWorkout, 
        recoveryMetrics
      );

      expect(adjustment.intensity_modifier).toBeLessThan(1.0); // Réduction d'intensité
      expect(adjustment.recommended_change).toBe('deload');
      expect(adjustment.volume_reduction).toBeGreaterThan(0.2); // Au moins 20% de réduction
    });
  });
});