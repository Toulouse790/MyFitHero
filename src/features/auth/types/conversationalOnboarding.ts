// Types pour l'onboarding conversationnel moderne
export interface ConversationalStep {
  id: string;
  title: string;
  description: string;
  question: string;
  inputType: 'text' | 'textarea' | 'number' | 'slider' | 'single_choice' | 'multi_choice' | 'boolean' | 'pack_selector' | 'module_selector' | 'sport_selector' | 'position_selector' | 'personal_info';
  options?: QuestionOption[];
  placeholder?: string;
  defaultValue?: any;
  validation?: ValidationRule[];
  skippable?: boolean;
  nextStep?: string | ((response: any, data: OnboardingData) => string);
  tips?: string[];
  icon?: string;
  category?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  showProgress?: boolean;
  estimatedTime?: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  value: any;
  disabled?: boolean;
  recommended?: boolean;
  badge?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'email' | 'range' | 'custom';
  value?: any;
  min?: number;
  max?: number;
  message: string;
  validator?: (value: any, data: OnboardingData) => boolean;
}

export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  skippedSteps: string[];
  totalSteps: number;
  estimatedTimeLeft: number;
  timeSpent: number;
  startedAt: Date;
  lastActivity: Date;
  averageTimePerStep: number;
  skipCount: number;
  backCount: number;
  errorCount: number;
  helpViewCount: number;
  moduleSpecificSteps: {
    sport: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
    strength: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
    nutrition: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
    hydration: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
    sleep: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
    wellness: { steps: string[]; completed: string[]; skipped: string[]; timeSpent: number };
  };
  userPreferences: {
    preferredInputTypes: string[];
    skipsTendency: number;
    detailLevel: 'minimal' | 'standard' | 'detailed';
    pace: 'slow' | 'normal' | 'fast';
  };
  completionQuality: number;
  validationScore: number;
  consistencyScore: number;
}

export interface OnboardingData {
  // Méta-données
  version: string;
  startedAt: Date;
  lastUpdated: Date;
  completedAt?: Date;
  progress: OnboardingProgress;

  // Sélection de pack et modules
  selectedPack?: string;
  selectedModules: string[];

  // Informations personnelles
  firstName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  lifestyle?: string;

  // Objectifs principaux
  mainObjective?: string;
  fitnessGoals: string[];

  // Sport
  sport: string;
  sportPosition?: string;
  sportLevel?: string;
  seasonPeriod?: string;
  trainingFrequency?: string;

  // Force et équipement
  equipmentLevel?: string;
  strengthObjective?: string;
  strengthExperience?: string;

  // Nutrition
  dietaryPreference?: string;
  foodAllergies: string[];
  nutritionObjective?: string;
  dietaryRestrictions: string[];

  // Sommeil
  averageSleepHours: number;
  sleepDifficulties: string[];

  // Hydratation
  hydrationGoal: number;
  hydrationReminders: boolean;

  // Bien-être et santé
  healthConditions: string[];
  motivation?: string;

  // Temps et disponibilité
  availableTimePerDay: number;

  // Consentements
  privacyConsent: boolean;
  marketingConsent: boolean;
}