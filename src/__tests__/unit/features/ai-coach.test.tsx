/**
 * TESTS UNITAIRES EXHAUSTIFS - MODULE AI-COACH
 * Composant le plus critique : Orchestrateur de santé globale
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HealthOrchestrator } from '../../../features/ai-coach/components/HealthOrchestrator';
import { AICoachService } from '../../../features/ai-coach/services/ai-coach.service';

// Mock des dépendances critiques
jest.mock('../../../features/ai-coach/services/ai-coach.service');
jest.mock('../../../core/api/supabase.client');

describe('🤖 AI-COACH MODULE - Tests Unitaires Exhaustifs', () => {
  describe('HealthOrchestrator Component', () => {
    const mockUser = {
      id: 'user-123',
      active_modules: ['workout', 'nutrition', 'sleep', 'recovery'],
      goals: ['strength', 'weight-loss'],
      fitness_experience: 'intermediate'
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('affiche correctement le dashboard de santé global', () => {
      render(<HealthOrchestrator user={mockUser} />);
      
      // Vérifications d'affichage critiques
      expect(screen.getByText(/orchestrateur/i)).toBeInTheDocument();
      expect(screen.getByTestId('health-score')).toBeInTheDocument();
      expect(screen.getByTestId('pillar-overview')).toBeInTheDocument();
    });

    it('calcule et affiche le score de santé global (0-100)', async () => {
      // Mock du service de calcul de score
      const mockHealthScore = {
        global: 87,
        pillars: {
          fitness: 92,
          nutrition: 85,
          sleep: 88,
          recovery: 83
        }
      };

      (AICoachService.calculateHealthScore as jest.Mock).mockResolvedValue(mockHealthScore);

      render(<HealthOrchestrator user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByText('87')).toBeInTheDocument(); // Score global
        expect(screen.getByText('92')).toBeInTheDocument(); // Fitness
        expect(screen.getByText('85')).toBeInTheDocument(); // Nutrition
      });
    });

    it('génère des recommandations personnalisées basées sur l\'IA', async () => {
      const mockRecommendations = [
        { 
          id: '1', 
          type: 'workout',
          priority: 'high',
          title: 'Augmenter l\'intensité cardio',
          description: 'Basé sur votre progression, il est temps d\'intensifier',
          evidence: { data_points: 15, confidence: 0.89 }
        },
        {
          id: '2',
          type: 'nutrition',
          priority: 'medium', 
          title: 'Optimiser les protéines post-workout',
          description: 'Améliorer la récupération musculaire',
          evidence: { data_points: 23, confidence: 0.76 }
        }
      ];

      (AICoachService.generateRecommendations as jest.Mock).mockResolvedValue(mockRecommendations);

      render(<HealthOrchestrator user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByText('Augmenter l\'intensité cardio')).toBeInTheDocument();
        expect(screen.getByText('Optimiser les protéines post-workout')).toBeInTheDocument();
      });
    });

    it('gère les erreurs d\'analyse IA gracieusement', async () => {
      // Simulation d'erreur service IA
      (AICoachService.calculateHealthScore as jest.Mock).mockRejectedValue(
        new Error('Service IA temporairement indisponible')
      );

      render(<HealthOrchestrator user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByText(/temporairement indisponible/i)).toBeInTheDocument();
        expect(screen.getByTestId('fallback-metrics')).toBeInTheDocument();
      });
    });

    it('met à jour en temps réel lors de changements de données', async () => {
      const { rerender } = render(<HealthOrchestrator user={mockUser} />);

      // Simulation changement données utilisateur
      const updatedUser = {
        ...mockUser,
        active_modules: [...mockUser.active_modules, 'mental-health']
      };

      rerender(<HealthOrchestrator user={updatedUser} />);

      await waitFor(() => {
        expect(screen.getByTestId('mental-health-pillar')).toBeInTheDocument();
      });
    });

    it('optimise les performances avec lazy loading des widgets', () => {
      render(<HealthOrchestrator user={mockUser} />);
      
      // Vérification que les widgets non critiques sont en lazy loading
      const lazyWidgets = screen.queryAllByTestId(/lazy-widget/);
      expect(lazyWidgets.length).toBeGreaterThan(0);
    });

    describe('Interactions utilisateur critiques', () => {
      it('permet d\'explorer les détails de chaque pilier', async () => {
        render(<HealthOrchestrator user={mockUser} />);
        
        // Clic sur pilier fitness
        const fitnessCard = screen.getByTestId('fitness-pillar-card');
        fireEvent.click(fitnessCard);

        await waitFor(() => {
          expect(screen.getByTestId('fitness-detailed-view')).toBeInTheDocument();
          expect(screen.getByText(/progression/i)).toBeInTheDocument();
        });
      });

      it('permet d\'accepter/rejeter les recommandations IA', async () => {
        const mockRecommendations = [
          { 
            id: '1', 
            type: 'workout',
            priority: 'high',
            title: 'Test recommendation'
          }
        ];

        (AICoachService.generateRecommendations as jest.Mock).mockResolvedValue(mockRecommendations);

        render(<HealthOrchestrator user={mockUser} />);

        await waitFor(() => {
          const acceptButton = screen.getByTestId('accept-recommendation-1');
          const rejectButton = screen.getByTestId('reject-recommendation-1');
          
          expect(acceptButton).toBeInTheDocument();
          expect(rejectButton).toBeInTheDocument();
        });

        // Test interaction
        const acceptButton = screen.getByTestId('accept-recommendation-1');
        fireEvent.click(acceptButton);

        expect(AICoachService.recordRecommendationFeedback).toHaveBeenCalledWith('1', 'accepted');
      });
    });

    describe('Cas limites et edge cases', () => {
      it('gère un utilisateur sans modules actifs', () => {
        const userNoModules = { ...mockUser, active_modules: [] };
        render(<HealthOrchestrator user={userNoModules} />);

        expect(screen.getByText(/aucun module actif/i)).toBeInTheDocument();
        expect(screen.getByTestId('onboarding-suggestion')).toBeInTheDocument();
      });

      it('gère des données de santé incomplètes', async () => {
        const partialHealthData = {
          global: null,
          pillars: {
            fitness: 85,
            nutrition: null,
            sleep: 75,
            recovery: null
          }
        };

        (AICoachService.calculateHealthScore as jest.Mock).mockResolvedValue(partialHealthData);

        render(<HealthOrchestrator user={mockUser} />);

        await waitFor(() => {
          expect(screen.getByText(/données insuffisantes/i)).toBeInTheDocument();
          expect(screen.getByTestId('data-collection-prompt')).toBeInTheDocument();
        });
      });

      it('handle des scores de santé extrêmes (0 et 100)', async () => {
        const extremeScores = {
          global: 100,
          pillars: { fitness: 100, nutrition: 0, sleep: 100, recovery: 0 }
        };

        (AICoachService.calculateHealthScore as jest.Mock).mockResolvedValue(extremeScores);

        render(<HealthOrchestrator user={mockUser} />);

        await waitFor(() => {
          expect(screen.getByTestId('perfect-score-celebration')).toBeInTheDocument();
          expect(screen.getByTestId('critical-pillars-alert')).toBeInTheDocument();
        });
      });
    });

    describe('Performance et optimisation', () => {
      it('debounce les appels API pour éviter le spam', async () => {
        const { rerender } = render(<HealthOrchestrator user={mockUser} />);

        // Multiples re-renders rapides
        for (let i = 0; i < 5; i++) {
          rerender(<HealthOrchestrator user={{ ...mockUser, id: `user-${i}` }} />);
        }

        // Attendre la stabilisation
        await waitFor(() => {
          // Vérifier qu'une seule requête a été faite
          expect(AICoachService.calculateHealthScore).toHaveBeenCalledTimes(1);
        }, { timeout: 2000 });
      });

      it('utilise la mise en cache intelligente pour les données', async () => {
        // Premier rendu
        render(<HealthOrchestrator user={mockUser} />);
        
        await waitFor(() => {
          expect(AICoachService.calculateHealthScore).toHaveBeenCalledTimes(1);
        });

        // Deuxième rendu avec même utilisateur
        render(<HealthOrchestrator user={mockUser} />);

        // Vérifier que le cache est utilisé (pas d'appel supplémentaire)
        expect(AICoachService.calculateHealthScore).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('AICoachService', () => {
    it('calcule correctement le score de santé global basé sur les piliers', () => {
      const pillarScores = {
        fitness: 85,
        nutrition: 90,
        sleep: 75,
        recovery: 80
      };

      const globalScore = AICoachService.calculateGlobalHealthScore(pillarScores);
      
      // Moyenne pondérée attendue
      expect(globalScore).toBeCloseTo(82.5, 1);
    });

    it('applique les pondérations correctes selon le profil utilisateur', () => {
      const athleteProfile = { type: 'athlete', focus: 'performance' };
      const casualProfile = { type: 'casual', focus: 'wellness' };

      const pillarScores = { fitness: 90, nutrition: 70, sleep: 80, recovery: 85 };

      const athleteScore = AICoachService.calculateWeightedScore(pillarScores, athleteProfile);
      const casualScore = AICoachService.calculateWeightedScore(pillarScores, casualProfile);

      // Athlète devrait avoir fitness et recovery plus pondérés
      expect(athleteScore).toBeGreaterThan(casualScore);
    });
  });
});