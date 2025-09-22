// Onboarding data and configuration
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  order: number;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  steps: OnboardingStep[];
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'personal-info',
    title: 'Informations personnelles',
    description: 'Renseignez vos informations de base',
    component: 'PersonalInfoStep',
    required: true,
    order: 1
  },
  {
    id: 'fitness-goals',
    title: 'Objectifs fitness',
    description: 'Définissez vos objectifs principaux',
    component: 'FitnessGoalsStep',
    required: true,
    order: 2
  },
  {
    id: 'sport-selection',
    title: 'Sélection des sports',
    description: 'Choisissez vos sports favoris',
    component: 'SportSelectionStep',
    required: true,
    order: 3
  },
  {
    id: 'nutrition-preferences',
    title: 'Préférences nutritionnelles',
    description: 'Configurez vos préférences alimentaires',
    component: 'NutritionStep',
    required: false,
    order: 4
  },
  {
    id: 'wearables-setup',
    title: 'Appareils connectés',
    description: 'Connectez vos appareils de mesure',
    component: 'WearablesStep',
    required: false,
    order: 5
  }
];

export const onboardingFlows: OnboardingFlow[] = [
  {
    id: 'standard',
    name: 'Parcours standard',
    steps: onboardingSteps
  },
  {
    id: 'quick',
    name: 'Parcours rapide',
    steps: onboardingSteps.filter(step => step.required)
  }
];

export const getOnboardingFlow = (flowId: string): OnboardingFlow | undefined => {
  return onboardingFlows.find(flow => flow.id === flowId);
};

export const getNextStep = (currentStepId: string, flowId = 'standard'): OnboardingStep | undefined => {
  const flow = getOnboardingFlow(flowId);
  if (!flow) return undefined;
  
  const currentIndex = flow.steps.findIndex(step => step.id === currentStepId);
  if (currentIndex === -1 || currentIndex === flow.steps.length - 1) return undefined;
  
  return flow.steps[currentIndex + 1];
};

export const getPreviousStep = (currentStepId: string, flowId = 'standard'): OnboardingStep | undefined => {
  const flow = getOnboardingFlow(flowId);
  if (!flow) return undefined;
  
  const currentIndex = flow.steps.findIndex(step => step.id === currentStepId);
  if (currentIndex <= 0) return undefined;
  
  return flow.steps[currentIndex - 1];
};