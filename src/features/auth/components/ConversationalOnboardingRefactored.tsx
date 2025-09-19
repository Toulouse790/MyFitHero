// src/features/auth/components/ConversationalOnboardingRefactored.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Skip, 
  Sparkles,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

// Composants modulaires
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingTips } from './OnboardingTips';
import { OnboardingValidation } from './OnboardingValidation';
import { OnboardingNavigation } from './OnboardingNavigation';
import { OnboardingFormFields } from './OnboardingFormFields';

// Hook et types
import { useOnboardingState } from '../hooks/useOnboardingState';
import { OnboardingData } from '../types/conversationalOnboarding';

interface ConversationalOnboardingRefactoredProps {
  onComplete: (data: OnboardingData) => void;
  initialData?: Partial<OnboardingData>;
  className?: string;
}

export const ConversationalOnboardingRefactored: React.FC<ConversationalOnboardingRefactoredProps> = ({
  onComplete,
  initialData = {},
  className = '',
}) => {
  const {
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
  } = useOnboardingState(initialData, onComplete);

  // Animation des étapes
  const stepVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && canProceed && !event.shiftKey) {
        event.preventDefault();
        if (isLastStep) {
          onComplete(state.data);
        } else {
          goToNextStep();
        }
      } else if (event.key === 'Escape' && canGoBack) {
        event.preventDefault();
        goToPreviousStep();
      } else if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        toggleTips();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, canGoBack, isLastStep, goToNextStep, goToPreviousStep, toggleTips, onComplete, state.data]);

  // Sauvegarde automatique des données
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('myfithero_onboarding_data', JSON.stringify(state.data));
        localStorage.setItem('myfithero_onboarding_step', state.currentStepId);
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde:', error);
      }
    };

    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [state.data, state.currentStepId]);

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Chargement de votre parcours personnalisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 ${className}`}>
      {/* Header */}
      <OnboardingHeader
        currentStep={currentStep}
        progressPercentage={progressPercentage}
        estimatedTimeLeft={estimatedTimeLeft}
        stepHistory={state.stepHistory}
        completedSteps={state.data.progress.completedSteps}
      />

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Colonne principale - Formulaire */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      
                      {/* En-tête de l'étape */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs">
                            Étape {state.data.progress.completedSteps.length + 1} sur {state.data.progress.totalSteps}
                          </Badge>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{estimatedTimeLeft} min restantes</span>
                          </div>
                        </div>

                        {/* Titre et description */}
                        <div className="space-y-2">
                          <h1 className="text-2xl font-bold text-foreground">
                            {currentStep.title}
                          </h1>
                          {currentStep.description && (
                            <p className="text-muted-foreground leading-relaxed">
                              {currentStep.description}
                            </p>
                          )}
                        </div>

                        {/* Tags et métadonnées */}
                        {currentStep.tags && currentStep.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {currentStep.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator className="mb-8" />

                      {/* Champs de formulaire */}
                      <OnboardingFormFields
                        step={currentStep}
                        currentResponse={state.currentResponse}
                        onResponseChange={setCurrentResponse}
                        data={state.data}
                        className="mb-8"
                      />

                      {/* Validation des erreurs */}
                      <OnboardingValidation
                        errors={state.validationErrors}
                        warnings={[]}
                        step={currentStep}
                        className="mb-6"
                      />

                      {/* Navigation */}
                      <OnboardingNavigation
                        canGoBack={canGoBack}
                        canProceed={canProceed}
                        isLastStep={isLastStep}
                        isLoading={state.isLoading}
                        onBack={goToPreviousStep}
                        onNext={() => {
                          if (isLastStep) {
                            onComplete(state.data);
                          } else {
                            goToNextStep();
                          }
                        }}
                        onSkip={currentStep.skippable ? skipCurrentStep : undefined}
                        className="mt-8"
                      />

                      {/* Raccourcis clavier */}
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">Entrée</kbd>
                            <span>Continuer</span>
                          </div>
                          {canGoBack && (
                            <div className="flex items-center space-x-1">
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Échap</kbd>
                              <span>Retour</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift</kbd>
                            <span>+</span>
                            <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                            <span>Aide</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Colonne latérale - Aide et conseils */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Conseils contextuels */}
                <OnboardingTips
                  step={currentStep}
                  isVisible={state.showTips}
                  onToggle={toggleTips}
                  className="transition-all duration-300"
                />

                {/* Résumé du progrès */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4 flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Votre progression</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Complétées</span>
                        <span className="font-medium">
                          {state.data.progress.completedSteps.length}/{state.data.progress.totalSteps}
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>

                      {state.data.progress.skippedSteps.length > 0 && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Ignorées</span>
                          <span>{state.data.progress.skippedSteps.length}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>~{estimatedTimeLeft} minutes restantes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Motivation */}
                {state.data.progress.completedSteps.length > 2 && (
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">Excellent travail !</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vous êtes sur la bonne voie. Chaque réponse nous aide à personnaliser votre expérience.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalOnboardingRefactored;