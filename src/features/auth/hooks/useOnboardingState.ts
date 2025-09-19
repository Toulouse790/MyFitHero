// src/features/auth/hooks/useOnboardingState.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ConversationalStep, 
  OnboardingData, 
  ValidationRule 
} from '../types/conversationalOnboarding';
import { 
  CONVERSATIONAL_ONBOARDING_FLOW,
  getConditionalNextStep 
} from '../data/conversationalFlow';
import { 
  getQuestionsForPack, 
  getEstimatedTimeForPack 
} from '../data/smartPacks';

interface OnboardingState {
  currentStepId: string;
  data: OnboardingData;
  currentResponse: any;
  validationErrors: string[];
  isLoading: boolean;
  showTips: boolean;
  selectedSport: any | null;
  stepHistory: string[];
  completedModuleSteps: Record<string, string[]>;
  skipCount: number;
  startTime: Date;
  availableSteps: string[];
}

export interface UseOnboardingStateReturn {
  // State
  state: OnboardingState;
  currentStep: ConversationalStep | undefined;
  progressPercentage: number;
  isLastStep: boolean;
  canGoBack: boolean;
  canProceed: boolean;
  
  // Actions
  setCurrentResponse: (response: any) => void;
  validateCurrentResponse: () => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  skipCurrentStep: () => void;
  toggleTips: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  estimatedTimeLeft: number;
}

export const useOnboardingState = (
  initialData: Partial<OnboardingData> = {},
  onComplete?: (data: OnboardingData) => void
): UseOnboardingStateReturn => {
  
  // État principal
  const [state, setState] = useState<OnboardingState>(() => ({
    currentStepId: 'welcome',
    data: {
      ...initialData,
      progress: {
        currentStep: 'welcome',
        completedSteps: [],
        skippedSteps: [],
        totalSteps: CONVERSATIONAL_ONBOARDING_FLOW.length,
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
      version: '1.0',
      startedAt: new Date(),
      lastUpdated: new Date(),
      selectedPack: initialData.selectedPack,
      selectedModules: initialData.selectedModules || [],
      firstName: initialData.firstName || '',
      age: initialData.age,
      gender: initialData.gender,
      lifestyle: initialData.lifestyle,
      mainObjective: initialData.mainObjective,
      sport: initialData.sport || '',
      sportPosition: initialData.sportPosition || '',
      sportLevel: initialData.sportLevel,
      seasonPeriod: initialData.seasonPeriod,
      trainingFrequency: initialData.trainingFrequency || '',
      equipmentLevel: initialData.equipmentLevel,
      strengthObjective: initialData.strengthObjective,
      strengthExperience: initialData.strengthExperience,
      dietaryPreference: initialData.dietaryPreference,
      foodAllergies: initialData.foodAllergies || [],
      nutritionObjective: initialData.nutritionObjective,
      dietaryRestrictions: initialData.dietaryRestrictions || [],
      averageSleepHours: initialData.averageSleepHours || 8,
      sleepDifficulties: initialData.sleepDifficulties || [],
      hydrationGoal: initialData.hydrationGoal || 2.5,
      hydrationReminders: initialData.hydrationReminders !== undefined ? initialData.hydrationReminders : true,
      motivation: initialData.motivation || '',
      availableTimePerDay: initialData.availableTimePerDay || 60,
      privacyConsent: initialData.privacyConsent || false,
      marketingConsent: initialData.marketingConsent || false,
      healthConditions: initialData.healthConditions || [],
      fitnessGoals: initialData.fitnessGoals || [],
      currentWeight: initialData.currentWeight,
      targetWeight: initialData.targetWeight,
      height: initialData.height,
    } as OnboardingData,
    currentResponse: null,
    validationErrors: [],
    isLoading: false,
    showTips: false,
    selectedSport: null,
    stepHistory: [],
    completedModuleSteps: {},
    skipCount: 0,
    startTime: new Date(),
    availableSteps: [],
  }));

  // Mise à jour des étapes disponibles selon le pack
  useEffect(() => {
    if (state.data.selectedPack) {
      const steps = getQuestionsForPack(state.data.selectedPack);
      setState(prev => ({ 
        ...prev, 
        availableSteps: steps,
        data: {
          ...prev.data,
          progress: {
            ...prev.data.progress,
            totalSteps: steps.length,
          },
        },
      }));
    }
  }, [state.data.selectedPack]);

  // Récupération de l'étape courante
  const currentStep = useMemo(() => {
    return CONVERSATIONAL_ONBOARDING_FLOW.find(step => step.id === state.currentStepId);
  }, [state.currentStepId]);

  // Calcul du pourcentage de progression
  const progressPercentage = useMemo(() => {
    const completed = state.data.progress.completedSteps.length;
    const total = state.data.progress.totalSteps;
    return Math.round((completed / total) * 100);
  }, [state.data.progress.completedSteps.length, state.data.progress.totalSteps]);

  // Vérification si c'est la dernière étape
  const isLastStep = useMemo(() => {
    if (state.availableSteps.length > 0) {
      return state.currentStepId === state.availableSteps[state.availableSteps.length - 1];
    }
    return state.currentStepId === CONVERSATIONAL_ONBOARDING_FLOW[CONVERSATIONAL_ONBOARDING_FLOW.length - 1].id;
  }, [state.currentStepId, state.availableSteps]);

  // Vérification si on peut revenir en arrière
  const canGoBack = useMemo(() => {
    return state.stepHistory.length > 0;
  }, [state.stepHistory.length]);

  // Vérification si on peut procéder
  const canProceed = useMemo(() => {
    return state.validationErrors.length === 0 && !state.isLoading;
  }, [state.validationErrors.length, state.isLoading]);

  // Calcul du temps estimé restant
  const estimatedTimeLeft = useMemo(() => {
    const elapsed = (new Date().getTime() - state.startTime.getTime()) / 1000 / 60;
    const completed = state.data.progress.completedSteps.length;
    const remaining = state.data.progress.totalSteps - completed;
    const avgTimePerStep = completed > 0 ? elapsed / completed : 1.5;
    return Math.max(2, Math.round(remaining * avgTimePerStep));
  }, [state.startTime, state.data.progress.completedSteps.length, state.data.progress.totalSteps]);

  // Validation des réponses
  const validateResponse = useCallback((step: ConversationalStep, response: any): string[] => {
    const errors: string[] = [];
    
    if (!step.validation) return errors;

    step.validation.forEach((rule: ValidationRule) => {
      switch (rule.type) {
        case 'required':
          if (!response || 
              (Array.isArray(response) && response.length === 0) ||
              (typeof response === 'string' && response.trim() === '')) {
            errors.push(rule.message);
          }
          break;
        case 'min':
          if (typeof response === 'string' && response.length < rule.value) {
            errors.push(rule.message);
          } else if (typeof response === 'number' && response < rule.value) {
            errors.push(rule.message);
          }
          break;
        case 'max':
          if (typeof response === 'string' && response.length > rule.value) {
            errors.push(rule.message);
          } else if (typeof response === 'number' && response > rule.value) {
            errors.push(rule.message);
          }
          break;
        case 'pattern':
          if (typeof response === 'string' && !new RegExp(rule.value).test(response)) {
            errors.push(rule.message);
          }
          break;
      }
    });

    return errors;
  }, []);

  // Actions
  const setCurrentResponse = useCallback((response: any) => {
    setState(prev => ({ ...prev, currentResponse: response }));
    
    // Validation en temps réel
    if (currentStep) {
      const errors = validateResponse(currentStep, response);
      setState(prev => ({ ...prev, validationErrors: errors }));
    }
  }, [currentStep, validateResponse]);

  const validateCurrentResponse = useCallback(() => {
    if (!currentStep) return false;
    const errors = validateResponse(currentStep, state.currentResponse);
    setState(prev => ({ ...prev, validationErrors: errors }));
    return errors.length === 0;
  }, [currentStep, state.currentResponse, validateResponse]);

  const goToNextStep = useCallback(() => {
    if (!currentStep || !validateCurrentResponse()) return;

    // Marquer l'étape comme complétée
    setState(prev => ({
      ...prev,
      stepHistory: [...prev.stepHistory, prev.currentStepId],
      data: {
        ...prev.data,
        progress: {
          ...prev.data.progress,
          completedSteps: [...prev.data.progress.completedSteps, prev.currentStepId],
        },
        [currentStep.id]: prev.currentResponse,
      },
    }));

    // Déterminer la prochaine étape
    const nextStepId = getConditionalNextStep(currentStep, state.currentResponse, state.data);
    
    if (nextStepId) {
      setState(prev => ({ 
        ...prev, 
        currentStepId: nextStepId,
        currentResponse: null,
        validationErrors: [],
      }));
    } else if (isLastStep && onComplete) {
      // Onboarding terminé
      onComplete(state.data);
    }
  }, [currentStep, state.currentResponse, state.data, validateCurrentResponse, isLastStep, onComplete]);

  const goToPreviousStep = useCallback(() => {
    if (state.stepHistory.length === 0) return;

    const previousStepId = state.stepHistory[state.stepHistory.length - 1];
    
    setState(prev => ({
      ...prev,
      currentStepId: previousStepId,
      stepHistory: prev.stepHistory.slice(0, -1),
      currentResponse: prev.data[previousStepId] || null,
      validationErrors: [],
      data: {
        ...prev.data,
        progress: {
          ...prev.data.progress,
          completedSteps: prev.data.progress.completedSteps.filter(id => id !== prev.currentStepId),
        },
      },
    }));
  }, [state.stepHistory]);

  const skipCurrentStep = useCallback(() => {
    if (!currentStep) return;

    setState(prev => ({
      ...prev,
      stepHistory: [...prev.stepHistory, prev.currentStepId],
      skipCount: prev.skipCount + 1,
      data: {
        ...prev.data,
        progress: {
          ...prev.data.progress,
          skippedSteps: [...prev.data.progress.skippedSteps, prev.currentStepId],
        },
      },
    }));

    // Aller à l'étape suivante
    const nextStepId = getConditionalNextStep(currentStep, null, state.data);
    if (nextStepId) {
      setState(prev => ({ 
        ...prev, 
        currentStepId: nextStepId,
        currentResponse: null,
        validationErrors: [],
      }));
    }
  }, [currentStep, state.data]);

  const toggleTips = useCallback(() => {
    setState(prev => ({ ...prev, showTips: !prev.showTips }));
  }, []);

  const updateData = useCallback((data: Partial<OnboardingData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...data },
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  return {
    // State
    state,
    currentStep,
    progressPercentage,
    isLastStep,
    canGoBack,
    canProceed,
    
    // Actions
    setCurrentResponse,
    validateCurrentResponse,
    goToNextStep,
    goToPreviousStep,
    skipCurrentStep,
    toggleTips,
    updateData,
    setLoading,
    
    // Computed
    estimatedTimeLeft,
  };
};