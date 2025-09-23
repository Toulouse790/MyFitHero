// Hook simplifié pour l'onboarding conversationnel
import { useState, useCallback } from 'react';
import { OnboardingData } from '@/features/auth/types/conversationalOnboarding';

export interface UseConversationalOnboardingReturn {
  data: OnboardingData;
  currentStep: string;
  progress: number;
  isLoading: boolean;
  errors: string[];
  updateData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  complete: () => Promise<void>;
}

export function useConversationalOnboarding(
  initialData?: Partial<OnboardingData>
): UseConversationalOnboardingReturn {
  const [data, setData] = useState<OnboardingData>({
    version: '1.0',
    startedAt: new Date(),
    lastUpdated: new Date(),
    selectedModules: [],
    firstName: '',
    fitnessGoals: [],
    sport: '',
    foodAllergies: [],
    dietaryRestrictions: [],
    averageSleepHours: 8,
    sleepDifficulties: [],
    hydrationGoal: 2.5,
    hydrationReminders: true,
    healthConditions: [],
    availableTimePerDay: 60,
    privacyConsent: false,
    marketingConsent: false,
    progress: {
      currentStep: 'welcome',
      completedSteps: [],
      skippedSteps: [],
      totalSteps: 7,
      estimatedTimeLeft: 15,
      timeSpent: 0,
      startedAt: new Date(),
      lastActivity: new Date(),
      averageTimePerStep: 0,
      skipCount: 0,
      backCount: 0,
      errorCount: 0,
      helpViewCount: 0,
      moduleSpecificSteps: {
        sport: { steps: [], completed: [], skipped: [], timeSpent: 0 },
        strength: { steps: [], completed: [], skipped: [], timeSpent: 0 },
        nutrition: { steps: [], completed: [], skipped: [], timeSpent: 0 },
        hydration: { steps: [], completed: [], skipped: [], timeSpent: 0 },
        sleep: { steps: [], completed: [], skipped: [], timeSpent: 0 },
        wellness: { steps: [], completed: [], skipped: [], timeSpent: 0 },
      },
      userPreferences: {
        preferredInputTypes: [],
        skipsTendency: 0,
        detailLevel: 'standard',
        pace: 'normal',
      },
      completionQuality: 0,
      validationScore: 100,
      consistencyScore: 100,
    },
    ...initialData,
  });

  const [currentStep, setCurrentStep] = useState('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date(),
    }));
  }, []);

  const nextStep = useCallback(() => {
    // Logique simplifiée pour passer à l'étape suivante
    setCurrentStep(prev => {
      switch (prev) {
        case 'welcome': return 'main_objective';
        case 'main_objective': return 'pack_selection';
        case 'pack_selection': return 'personal_info';
        case 'personal_info': return 'sport_selection';
        case 'sport_selection': return 'completion';
        default: return 'completion';
      }
    });
  }, []);

  const previousStep = useCallback(() => {
    // Logique pour revenir en arrière
    setCurrentStep(prev => {
      switch (prev) {
        case 'main_objective': return 'welcome';
        case 'pack_selection': return 'main_objective';
        case 'personal_info': return 'pack_selection';
        case 'sport_selection': return 'personal_info';
        case 'completion': return 'sport_selection';
        default: return 'welcome';
      }
    });
  }, []);

  const complete = useCallback(async () => {
    setIsLoading(true);
    try {
      // Logique de finalisation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
    } catch (error) {
      setErrors(['Erreur lors de la finalisation']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const progress = Math.round((data.progress.completedSteps.length / data.progress.totalSteps) * 100);

  return {
    data,
    currentStep,
    progress,
    isLoading,
    errors,
    updateData,
    nextStep,
    previousStep,
    complete,
  };
}