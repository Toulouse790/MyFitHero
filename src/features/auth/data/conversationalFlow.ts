import { Info } from 'lucide-react';
import { ConversationalStep } from '@/features/auth/types/conversationalOnboarding';

export interface ConversationalStep {
  id: string;
  type: 'question' | 'selector' | 'form' | 'info' | 'pack-selection';
  title: string;
  subtitle?: string;
  description?: string;
  component?: string;
  validation?: (value: any) => boolean | string;
  nextStep?: string | ((value: any, data: any) => string);
  previousStep?: string;
  isRequired?: boolean;
  category?: string;
  estimatedTime?: number; // en secondes
  tips?: string[];
  dependencies?: string[]; // IDs des étapes requises
}

export const CONVERSATIONAL_ONBOARDING_FLOW: ConversationalStep[] = [
  {
    id: 'welcome',
    type: 'info',
    title: 'Bienvenue dans MyFitHero !',
    subtitle: 'Créons ensemble votre profil personnalisé',
    description: 'Nous allons vous poser quelques questions pour personnaliser votre expérience. Cela ne prendra que quelques minutes.',
    nextStep: 'pack-selection',
    estimatedTime: 30,
    tips: [
      'Soyez honnête dans vos réponses pour obtenir les meilleurs conseils',
      'Vous pourrez modifier vos préférences à tout moment'
    ]
  },
  
  {
    id: 'pack-selection',
    type: 'pack-selection',
    title: 'Choisissez votre pack intelligent',
    subtitle: 'Sélectionnez le pack qui correspond le mieux à vos objectifs',
    component: 'PackSelector',
    validation: (value) => value ? true : 'Veuillez sélectionner un pack',
    nextStep: (value, data) => {
      const pack = value;
      if (pack === 'athlete') return 'sport-selection';
      if (pack === 'fitness') return 'main-objectives';
      if (pack === 'wellness') return 'lifestyle-preferences';
      return 'personal-info';
    },
    estimatedTime: 60,
    isRequired: true
  },

  {
    id: 'sport-selection',
    type: 'selector',
    title: 'Quel est votre sport principal ?',
    subtitle: 'Nous adapterons votre entraînement en conséquence',
    component: 'SportSelector',
    validation: (value) => value ? true : 'Veuillez sélectionner un sport',
    nextStep: 'position-selection',
    category: 'athlete',
    estimatedTime: 45,
    isRequired: true,
    tips: [
      'Choisissez votre sport principal ou celui que vous voulez améliorer',
      'Vous pourrez ajouter d\'autres sports plus tard'
    ]
  },

  {
    id: 'position-selection',
    type: 'selector',
    title: 'Quelle est votre position ?',
    subtitle: 'Pour un coaching plus spécifique à votre rôle',
    component: 'PositionSelector',
    validation: (value) => value ? true : 'Veuillez sélectionner une position',
    nextStep: 'sport-level',
    category: 'athlete',
    estimatedTime: 30,
    dependencies: ['sport-selection']
  },

  {
    id: 'sport-level',
    type: 'question',
    title: 'Quel est votre niveau dans ce sport ?',
    subtitle: 'Nous adapterons la complexité de vos entraînements',
    validation: (value) => value ? true : 'Veuillez indiquer votre niveau',
    nextStep: 'training-availability',
    category: 'athlete',
    estimatedTime: 20
  },

  {
    id: 'main-objectives',
    type: 'question',
    title: 'Quels sont vos objectifs principaux ?',
    subtitle: 'Vous pouvez en sélectionner plusieurs',
    validation: (value) => Array.isArray(value) && value.length > 0 ? true : 'Sélectionnez au moins un objectif',
    nextStep: 'fitness-experience',
    category: 'fitness',
    estimatedTime: 40
  },

  {
    id: 'fitness-experience',
    type: 'question',
    title: 'Quel est votre niveau d\'expérience en fitness ?',
    subtitle: 'Cela nous aide à calibrer vos programmes',
    validation: (value) => value ? true : 'Veuillez indiquer votre niveau',
    nextStep: 'equipment-available',
    category: 'fitness',
    estimatedTime: 20
  },

  {
    id: 'equipment-available',
    type: 'question',
    title: 'Quel équipement avez-vous à disposition ?',
    subtitle: 'Nous adapterons vos exercices en conséquence',
    validation: (value) => value ? true : 'Veuillez indiquer votre équipement',
    nextStep: 'training-availability',
    category: 'fitness',
    estimatedTime: 30
  },

  {
    id: 'lifestyle-preferences',
    type: 'question',
    title: 'Comment décririez-vous votre style de vie ?',
    subtitle: 'Cela nous aide à personnaliser vos recommandations',
    validation: (value) => Array.isArray(value) && value.length > 0 ? true : 'Sélectionnez au moins une option',
    nextStep: 'dietary-preferences',
    category: 'wellness',
    estimatedTime: 35
  },

  {
    id: 'dietary-preferences',
    type: 'question',
    title: 'Avez-vous des préférences alimentaires ?',
    subtitle: 'Pour des conseils nutritionnels adaptés',
    validation: (value) => true, // Optionnel
    nextStep: 'sleep-habits',
    category: 'wellness',
    estimatedTime: 30
  },

  {
    id: 'sleep-habits',
    type: 'question',
    title: 'Parlez-nous de vos habitudes de sommeil',
    subtitle: 'Le sommeil est crucial pour votre récupération',
    validation: (value) => value ? true : 'Veuillez renseigner vos habitudes de sommeil',
    nextStep: 'training-availability',
    category: 'wellness',
    estimatedTime: 25
  },

  {
    id: 'training-availability',
    type: 'question',
    title: 'Combien de temps pouvez-vous consacrer à l\'entraînement ?',
    subtitle: 'Par semaine et par session',
    validation: (value) => value && value.sessionsPerWeek && value.sessionDuration ? true : 'Veuillez indiquer votre disponibilité',
    nextStep: 'personal-info',
    estimatedTime: 40
  },

  {
    id: 'personal-info',
    type: 'form',
    title: 'Informations personnelles',
    subtitle: 'Pour personnaliser vos recommandations',
    component: 'PersonalInfoForm',
    validation: (value) => {
      if (!value.age || value.age < 16 || value.age > 100) return 'Âge requis (16-100 ans)';
      if (!value.gender) return 'Genre requis';
      if (!value.height || value.height < 120 || value.height > 250) return 'Taille requise (120-250 cm)';
      if (!value.weight || value.weight < 40 || value.weight > 200) return 'Poids requis (40-200 kg)';
      return true;
    },
    nextStep: 'health-conditions',
    estimatedTime: 60,
    isRequired: true
  },

  {
    id: 'health-conditions',
    type: 'question',
    title: 'Avez-vous des conditions de santé particulières ?',
    subtitle: 'Ces informations restent confidentielles et nous aident à adapter vos programmes',
    validation: (value) => true, // Optionnel
    nextStep: 'notifications-preferences',
    estimatedTime: 45
  },

  {
    id: 'notifications-preferences',
    type: 'question',
    title: 'Préférences de notifications',
    subtitle: 'Comment souhaitez-vous être accompagné ?',
    validation: (value) => true, // Optionnel
    nextStep: 'completion',
    estimatedTime: 30
  },

  {
    id: 'completion',
    type: 'info',
    title: 'Félicitations !',
    subtitle: 'Votre profil est maintenant configuré',
    description: 'Nous préparons votre expérience personnalisée. Vous allez recevoir vos premiers conseils dans quelques instants.',
    estimatedTime: 0
  }
];

/**
 * Obtient l'étape suivante en fonction de la logique conditionnelle
 */
export function getConditionalNextStep(currentStepId: string, value: any, allData: any): string | null {
  const currentStep = CONVERSATIONAL_ONBOARDING_FLOW.find(step => step.id === currentStepId);
  
  if (!currentStep) return null;
  
  if (typeof currentStep.nextStep === 'function') {
    return currentStep.nextStep(value, allData);
  }
  
  return currentStep.nextStep || null;
}

/**
 * Calcule le temps estimé restant pour l'onboarding
 */
export function calculateEstimatedTime(currentStepId: string, completedSteps: string[]): number {
  const currentStepIndex = CONVERSATIONAL_ONBOARDING_FLOW.findIndex(step => step.id === currentStepId);
  
  if (currentStepIndex === -1) return 0;
  
  const remainingSteps = CONVERSATIONAL_ONBOARDING_FLOW.slice(currentStepIndex);
  
  return remainingSteps.reduce((total, step) => {
    if (!completedSteps.includes(step.id)) {
      return total + (step.estimatedTime || 30);
    }
    return total;
  }, 0);
}

/**
 * Obtient l'étape précédente
 */
export function getPreviousStep(currentStepId: string, stepHistory: string[]): string | null {
  if (stepHistory.length === 0) return null;
  return stepHistory[stepHistory.length - 1] || null;
}

/**
 * Valide si une étape peut être affichée selon ses dépendances
 */
export function canShowStep(stepId: string, completedSteps: string[]): boolean {
  const step = CONVERSATIONAL_ONBOARDING_FLOW.find(s => s.id === stepId);
  
  if (!step || !step.dependencies) return true;
  
  return step.dependencies.every(depId => completedSteps.includes(depId));
}

/**
 * Obtient les étapes disponibles pour un pack donné
 */
export function getStepsForPack(packId: string): string[] {
  const baseSteps = ['welcome', 'pack-selection', 'personal-info', 'health-conditions', 'notifications-preferences', 'completion'];
  
  switch (packId) {
    case 'athlete':
      return [...baseSteps, 'sport-selection', 'position-selection', 'sport-level', 'training-availability'];
    case 'fitness':
      return [...baseSteps, 'main-objectives', 'fitness-experience', 'equipment-available', 'training-availability'];
    case 'wellness':
      return [...baseSteps, 'lifestyle-preferences', 'dietary-preferences', 'sleep-habits', 'training-availability'];
    default:
      return baseSteps;
  }
}