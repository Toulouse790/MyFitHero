// client/src/components/ConversationalOnboarding.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Star,
  Check,
  AlertCircle,
  User,
  Target,
  Zap,
  Heart,
  Shield,
  Settings,
  BookOpen,
  Award,
  Coffee,
  Moon,
  Droplets,
  Brain,
  Package,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';
import {
  ConversationalStep,
  OnboardingData,
  ValidationRule,
  QuestionOption,
} from '@/features/auth/types/conversationalOnboarding';
import {
  CONVERSATIONAL_ONBOARDING_FLOW,
  getConditionalNextStep,
  calculateEstimatedTime,
} from '@/features/auth/data/conversationalFlow';
import {
  AVAILABLE_SPORTS,
  MAIN_OBJECTIVES,
  AVAILABLE_MODULES,
  LIFESTYLE_OPTIONS,
  DIETARY_PREFERENCES,
  STRENGTH_OBJECTIVES,
  NUTRITION_OBJECTIVES,
  FITNESS_EXPERIENCE_LEVELS,
  EQUIPMENT_LEVELS,
  SPORT_LEVELS,
  SEASON_PERIODS,
  TRAINING_AVAILABILITY,
  HEALTH_CONDITIONS,
} from '@/features/auth/data/onboardingData';
import { SMART_PACKS } from '@/features/auth/data/smartPacks';
import SportSelector from '@/features/auth/components/SportSelector';
import PositionSelector from '@/features/auth/components/PositionSelector';
import SportsService, { type SportOption } from '@/features/auth/services/sportsService';

// Utility function to combine classNames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface ConversationalOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  initialData?: Partial<OnboardingData>;
  debug?: boolean;
}

interface OnboardingState {
  currentStepId: string;
  data: OnboardingData;
  currentResponse: any;
  validationErrors: string[];
  isLoading: boolean;
  showTips: boolean;
  selectedSport: SportOption | null;
  stepHistory: string[];
  completedModuleSteps: Record<string, string[]>;
  skipCount: number;
  startTime: Date;
  availableSteps: string[]; // Étapes disponibles selon le pack
}

export default function ConversationalOnboarding({
  onComplete,
  onSkip,
  initialData = {},
  debug = false,
}: ConversationalOnboardingProps) {
  const { toast } = useToast();
  const sportsService = new SportsService();
  const dynamicSports = AVAILABLE_SPORTS;
  const sportsLoading = false;

  // État principal consolidé
  const [state, setState] = useState<OnboardingState>(() => ({
    currentStepId: 'welcome', // Premier step du flow
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
      // Valeurs par défaut
      selectedPack: initialData.selectedPack || undefined,
      selectedModules: initialData.selectedModules || [],
      firstName: initialData.firstName || '',
      age: initialData.age ?? undefined,
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
      currentWeight: initialData.currentWeight ?? undefined,
      targetWeight: initialData.targetWeight ?? undefined,
      height: initialData.height ?? undefined,
    },
    currentResponse: null,
    validationErrors: [],
    isLoading: false,
    showTips: false,
    selectedSport: null,
    stepHistory: [],
    completedModuleSteps: {},
    skipCount: 0,
    startTime: new Date(),
    availableSteps: [], // Sera mis à jour selon le pack
  }));

  // Simple render for now - can be extended later
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Bienvenue sur MyFitHero !
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Commençons par configurer votre profil pour une expérience personnalisée.
            </p>
            
            {/* Progress bar */}
            <Progress value={33} className="w-full" />
            
            <Input 
              placeholder="Votre prénom..."
              className="w-full"
            />
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              <Button className="flex-1">
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}