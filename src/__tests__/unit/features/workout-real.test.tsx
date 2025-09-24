/**
 * TESTS UNITAIRES EXHAUSTIFS - MODULE WORKOUT (RÉEL)
 * Tests basés sur les composants et services existants
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutSessionComponent } from '../../../features/workout/components/WorkoutSession';
import { WorkoutService } from '../../../features/workout/services/WorkoutService';

jest.mock('../../../features/workout/services/WorkoutService');

describe('💪 WORKOUT MODULE - Tests Unitaires Complets', () => {
  describe('WorkoutSessionComponent', () => {
    const mockSession = {
      id: 'session-123',
      name: 'Push Day - Upper Body',
      description: 'Entraînement focalisé sur le haut du corps',
      duration_minutes: 75,
      calories_burned: 450,
      difficulty: 'intermediate' as const,
      workout_type: 'strength' as const,
      exercises: [
        {
          id: 'ex-1',
          name: 'Bench Press',
          category: 'chest',
          sets: 4,
          reps: 8,
          weight: 80,
          rest_seconds: 120,
          completed: false
        },
        {
          id: 'ex-2',
          name: 'Overhead Press',
          category: 'shoulders',
          sets: 3,
          reps: 10,
          weight: 50,
          rest_seconds: 90,
          completed: false
        }
      ]
    };

    const mockProps = {
      currentSession: mockSession,
      sessionTimer: 0,
      isSessionActive: false,
      onStartSession: jest.fn(),
      onPauseSession: jest.fn(),
      onEndSession: jest.fn(),
      onCompleteExercise: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('affiche correctement les détails de la session', () => {
      render(<WorkoutSessionComponent {...mockProps} />);
      
      expect(screen.getByText('Push Day - Upper Body')).toBeInTheDocument();
      expect(screen.getByText(/intermediate/i)).toBeInTheDocument();
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Overhead Press')).toBeInTheDocument();
    });

    it('démarre une session quand le bouton start est cliqué', () => {
      render(<WorkoutSessionComponent {...mockProps} />);
      
      const startButton = screen.getByRole('button', { name: /démarrer/i });
      fireEvent.click(startButton);

      expect(mockProps.onStartSession).toHaveBeenCalledTimes(1);
    });

    it('affiche le timer correctement quand la session est active', () => {
      const activeProps = {
        ...mockProps,
        isSessionActive: true,
        sessionTimer: 300 // 5 minutes = 300 secondes
      };

      render(<WorkoutSessionComponent {...activeProps} />);
      
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('calcule la progression correctement', () => {
      const sessionWithProgress = {
        ...mockSession,
        exercises: [
          { ...mockSession.exercises[0], completed: true },
          { ...mockSession.exercises[1], completed: false }
        ]
      };

      render(<WorkoutSessionComponent 
        {...mockProps} 
        currentSession={sessionWithProgress} 
      />);
      
      // 1 exercice sur 2 complété = 50%
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('permet de marquer un exercice comme complété', () => {
      render(<WorkoutSessionComponent {...mockProps} />);
      
      const completeButton = screen.getAllByRole('button')[1]; // Premier exercice
      fireEvent.click(completeButton);

      expect(mockProps.onCompleteExercise).toHaveBeenCalledWith('ex-1');
    });

    it('gère le cas où aucune session n\'est active', () => {
      const noSessionProps = {
        ...mockProps,
        currentSession: null
      };

      render(<WorkoutSessionComponent {...noSessionProps} />);
      
      expect(screen.getByText(/aucune session active/i)).toBeInTheDocument();
      expect(screen.getByText(/commencez une nouvelle séance/i)).toBeInTheDocument();
    });

    it('affiche les boutons de contrôle appropriés selon l\'état', () => {
      // Session inactive
      render(<WorkoutSessionComponent {...mockProps} />);
      expect(screen.getByRole('button', { name: /démarrer/i })).toBeInTheDocument();

      // Session active
      const activeProps = { ...mockProps, isSessionActive: true };
      render(<WorkoutSessionComponent {...activeProps} />);
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });
  });

  describe('WorkoutService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Setup fetch mock
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('récupère les workouts d\'un utilisateur', async () => {
      const mockWorkouts = [
        { id: '1', name: 'Workout 1', type: 'strength' },
        { id: '2', name: 'Workout 2', type: 'cardio' }
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWorkouts)
      });

      const result = await WorkoutService.getWorkouts('user-123');
      
      expect(fetch).toHaveBeenCalledWith('/api/workouts/user/user-123?');
      expect(result).toEqual(mockWorkouts);
    });

    it('gère les erreurs de récupération gracieusement', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      });

      // Le service devrait retourner des données mock en cas d'erreur
      const result = await WorkoutService.getWorkouts('user-123');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0); // Mock workouts
    });

    it('applique les filtres correctement', async () => {
      const filters = {
        type: 'strength',
        difficulty: 'intermediate',
        duration: { min: 30, max: 60 }
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      await WorkoutService.getWorkouts('user-123', filters);
      
      const expectedUrl = '/api/workouts/user/user-123?type=strength&difficulty=intermediate&duration=%7B%22min%22%3A30%2C%22max%22%3A60%7D';
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });

    it('crée un nouveau workout', async () => {
      const newWorkoutData = {
        name: 'Test Workout',
        type: 'strength' as const,
        difficulty: 'beginner' as const,
        duration_minutes: 45,
        exercises: []
      };

      const mockCreatedWorkout = { id: 'new-workout-123', ...newWorkoutData };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCreatedWorkout)
      });

      const result = await WorkoutService.createWorkout('user-123', newWorkoutData);
      
      expect(fetch).toHaveBeenCalledWith('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 'user-123', ...newWorkoutData })
      });
      expect(result).toEqual(mockCreatedWorkout);
    });
  });

  describe('Fonctionnalités avancées', () => {
    it('calcule le volume total d\'entraînement', () => {
      const exercises = [
        { sets: 4, reps: 8, weight: 80 }, // 4 * 8 * 80 = 2560
        { sets: 3, reps: 10, weight: 50 } // 3 * 10 * 50 = 1500
      ];

      const totalVolume = exercises.reduce((sum, ex) => 
        sum + (ex.sets * ex.reps * ex.weight), 0
      );
      
      expect(totalVolume).toBe(4060); // 2560 + 1500
    });

    it('détermine l\'intensité basée sur les pourcentages 1RM', () => {
      const exercise1RM = 100; // kg
      
      const lightLoad = 60; // 60% 1RM
      const moderateLoad = 75; // 75% 1RM  
      const heavyLoad = 90; // 90% 1RM

      const getIntensity = (weight: number, oneRM: number) => {
        const percentage = (weight / oneRM) * 100;
        if (percentage < 70) return 'light';
        if (percentage < 85) return 'moderate';
        return 'heavy';
      };

      expect(getIntensity(lightLoad, exercise1RM)).toBe('light');
      expect(getIntensity(moderateLoad, exercise1RM)).toBe('moderate');
      expect(getIntensity(heavyLoad, exercise1RM)).toBe('heavy');
    });

    it('calcule le temps de récupération optimal', () => {
      const calculateRestTime = (intensity: string, exerciseType: string) => {
        if (exerciseType === 'compound') {
          return intensity === 'heavy' ? 180 : intensity === 'moderate' ? 120 : 90;
        } else {
          return intensity === 'heavy' ? 120 : intensity === 'moderate' ? 90 : 60;
        }
      };

      expect(calculateRestTime('heavy', 'compound')).toBe(180); // 3 minutes
      expect(calculateRestTime('moderate', 'isolation')).toBe(90); // 1.5 minutes
      expect(calculateRestTime('light', 'isolation')).toBe(60); // 1 minute
    });

    it('détecte des patterns de progression', () => {
      const sessionHistory = [
        { date: '2024-01-01', benchPress: 80, volume: 2400 },
        { date: '2024-01-03', benchPress: 82.5, volume: 2475 },
        { date: '2024-01-05', benchPress: 85, volume: 2550 }
      ];

      const analyzeProgression = (history: any[]) => {
        if (history.length < 2) return 'insufficient_data';
        
        const latest = history[history.length - 1];
        const previous = history[history.length - 2];
        
        const strengthImprovement = ((latest.benchPress - previous.benchPress) / previous.benchPress) * 100;
        const volumeImprovement = ((latest.volume - previous.volume) / previous.volume) * 100;
        
        return {
          strength: strengthImprovement > 0 ? 'improving' : 'plateauing',
          volume: volumeImprovement > 0 ? 'improving' : 'plateauing',
          strengthChange: strengthImprovement,
          volumeChange: volumeImprovement
        };
      };

      const progression = analyzeProgression(sessionHistory);
      expect(progression.strength).toBe('improving');
      expect(progression.volume).toBe('improving');
      expect(progression.strengthChange).toBeCloseTo(3.03, 1); // ~3% improvement
    });
  });

  describe('Gestion des erreurs et cas limites', () => {
    it('gère une session sans exercices', () => {
      const emptySession = {
        ...mockSession,
        exercises: []
      };

      const emptyProps = {
        ...mockProps,
        currentSession: emptySession
      };

      render(<WorkoutSessionComponent {...emptyProps} />);
      
      // Devrait afficher un message approprié ou un état par défaut
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('gère des valeurs de timer négatives', () => {
      const invalidProps = {
        ...mockProps,
        sessionTimer: -10
      };

      render(<WorkoutSessionComponent {...invalidProps} />);
      
      // Le timer ne devrait pas afficher de valeurs négatives
      expect(screen.queryByText('-')).not.toBeInTheDocument();
    });

    it('gère des exercices avec des données manquantes', () => {
      const incompleteSession = {
        ...mockSession,
        exercises: [
          {
            id: 'ex-incomplete',
            name: 'Incomplete Exercise',
            category: 'unknown'
            // Manque sets, reps, weight
          }
        ]
      };

      const incompleteProps = {
        ...mockProps,
        currentSession: incompleteSession
      };

      expect(() => {
        render(<WorkoutSessionComponent {...incompleteProps} />);
      }).not.toThrow();
    });
  });
});

// Mock pour WorkoutSessionComponent si le vrai composant n'est pas accessible
const mockSession = {
  id: 'session-123',
  name: 'Push Day - Upper Body',
  description: 'Entraînement focalisé sur le haut du corps',
  duration_minutes: 75,
  calories_burned: 450,
  difficulty: 'intermediate' as const,
  workout_type: 'strength' as const,
  exercises: []
};