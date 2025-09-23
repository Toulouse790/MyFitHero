// Flow conversationnel pour l'onboarding moderne
import { ConversationalStep, OnboardingData } from '@/features/auth/types/conversationalOnboarding';

export const CONVERSATIONAL_ONBOARDING_FLOW: ConversationalStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur MyFitHero !',
    description: 'Commençons par faire connaissance',
    question: 'Comment puis-je vous appeler ?',
    inputType: 'text',
    placeholder: 'Votre prénom...',
    validation: [
      { type: 'required', message: 'Votre prénom est requis' },
      { type: 'min', value: 2, message: 'Votre prénom doit contenir au moins 2 caractères' }
    ],
    nextStep: 'main_objective',
    icon: 'User',
    estimatedTime: 1
  },
  {
    id: 'main_objective',
    title: 'Votre objectif principal',
    description: 'Définissons ensemble votre priorité',
    question: 'Quel est votre objectif principal avec MyFitHero ?',
    inputType: 'single_choice',
    validation: [{ type: 'required', message: 'Veuillez choisir un objectif' }],
    nextStep: 'pack_selection',
    icon: 'Target',
    estimatedTime: 2
  },
  {
    id: 'pack_selection',
    title: 'Choisissez votre pack',
    description: 'Sélectionnez le pack qui vous correspond',
    question: 'Quel pack correspond le mieux à vos besoins ?',
    inputType: 'pack_selector',
    validation: [{ type: 'required', message: 'Veuillez choisir un pack' }],
    nextStep: (response: string) => response === 'custom' ? 'module_selection' : 'personal_info',
    icon: 'Package',
    estimatedTime: 3
  },
  {
    id: 'module_selection',
    title: 'Modules personnalisés',
    description: 'Choisissez les modules qui vous intéressent',
    question: 'Quels aspects souhaitez-vous suivre ?',
    inputType: 'multi_choice',
    validation: [
      { type: 'required', message: 'Veuillez sélectionner au moins un module' },
      { type: 'min', value: 1, message: 'Sélectionnez au moins un module' }
    ],
    nextStep: 'personal_info',
    icon: 'Settings',
    estimatedTime: 2
  },
  {
    id: 'personal_info',
    title: 'Informations personnelles',
    description: 'Quelques infos pour personnaliser votre expérience',
    question: 'Parlez-nous un peu de vous',
    inputType: 'personal_info',
    validation: [{ type: 'required', message: 'Ces informations sont importantes pour votre suivi' }],
    nextStep: 'sport_selection',
    icon: 'User',
    estimatedTime: 4
  },
  {
    id: 'sport_selection',
    title: 'Votre sport principal',
    description: 'Sélectionnez votre discipline principale',
    question: 'Quel est votre sport de prédilection ?',
    inputType: 'sport_selector',
    validation: [{ type: 'required', message: 'Veuillez choisir un sport' }],
    nextStep: 'completion',
    icon: 'Zap',
    estimatedTime: 3
  },
  {
    id: 'completion',
    title: 'Configuration terminée !',
    description: 'Votre profil MyFitHero est prêt',
    question: 'Félicitations ! Vous êtes prêt à commencer votre parcours.',
    inputType: 'text',
    nextStep: '',
    icon: 'Check',
    estimatedTime: 1
  }
];

export function getConditionalNextStep(
  currentStepId: string,
  response: any,
  data: OnboardingData
): string | null {
  switch (currentStepId) {
    case 'pack_selection':
      return response === 'custom' ? 'module_selection' : 'personal_info';
    
    case 'module_selection':
      return 'personal_info';
    
    case 'sport_selection':
      // Si le sport nécessite une position, aller à position_selector
      // Sinon, aller à completion
      return 'completion';
    
    default:
      return null;
  }
}

export function calculateEstimatedTime(currentStepId: string, completedSteps: string[]): number {
  const totalSteps = CONVERSATIONAL_ONBOARDING_FLOW.length;
  const remainingSteps = totalSteps - completedSteps.length;
  const avgTimePerStep = 2; // minutes
  
  return Math.max(2, remainingSteps * avgTimePerStep);
}

export function getQuestionsForPack(packId: string): string[] {
  const baseFlow = ['welcome', 'main_objective', 'pack_selection', 'personal_info'];
  
  switch (packId) {
    case 'sport_performance':
      return [...baseFlow, 'sport_selection', 'completion'];
    
    case 'health_wellness':
      return [...baseFlow, 'sport_selection', 'completion'];
    
    case 'body_transformation':
      return [...baseFlow, 'sport_selection', 'completion'];
    
    case 'custom':
      return [...baseFlow, 'module_selection', 'sport_selection', 'completion'];
    
    default:
      return [...baseFlow, 'sport_selection', 'completion'];
  }
}