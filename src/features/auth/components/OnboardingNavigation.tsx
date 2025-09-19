// src/features/auth/components/OnboardingNavigation.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLoading?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  backButtonText?: string;
  completeButtonText?: string;
  onNext: () => void;
  onBack: () => void;
  onComplete?: () => void;
  showStepIndicator?: boolean;
  className?: string;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
  isLastStep = false,
  nextButtonText = "Suivant",
  backButtonText = "Précédent",
  completeButtonText = "Terminer",
  onNext,
  onBack,
  onComplete,
  showStepIndicator = true,
  className = ''
}) => {

  const handlePrimaryAction = () => {
    if (isLastStep && onComplete) {
      onComplete();
    } else {
      onNext();
    }
  };

  const getPrimaryButtonText = () => {
    if (isLastStep) {
      return completeButtonText;
    }
    return nextButtonText;
  };

  const getPrimaryButtonIcon = () => {
    if (isLastStep) {
      return <Check className="h-4 w-4" />;
    }
    return <ChevronRight className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
    >
      {/* Indicateur d'étapes */}
      {showStepIndicator && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <motion.div
                  key={stepNumber}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: isCurrent ? 1.1 : 1, 
                    opacity: isCurrent || isCompleted ? 1 : 0.4 
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                      ${isCurrent 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  {stepNumber < totalSteps && (
                    <div 
                      className={`
                        w-8 h-0.5 mx-1 transition-colors duration-200
                        ${isCompleted ? 'bg-green-500' : 'bg-muted'}
                      `} 
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="flex items-center justify-between space-x-4">
        {/* Bouton Précédent */}
        <div className="flex-1">
          {canGoBack && currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {backButtonText}
            </Button>
          )}
        </div>

        {/* Indicateur de progression (mobile) */}
        <div className="block sm:hidden">
          <Badge variant="outline" className="text-xs">
            {currentStep}/{totalSteps}
          </Badge>
        </div>

        {/* Bouton Suivant/Terminer */}
        <div className="flex-1 flex justify-end">
          <Button
            size="lg"
            onClick={handlePrimaryAction}
            disabled={!canGoNext || isLoading}
            className={`
              w-full sm:w-auto transition-all duration-200
              ${isLastStep ? 'bg-green-600 hover:bg-green-700' : ''}
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Chargement...
              </>
            ) : (
              <>
                {getPrimaryButtonText()}
                <span className="ml-2">
                  {getPrimaryButtonIcon()}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Aide contextuelle */}
      {!canGoNext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Veuillez compléter les champs requis pour continuer
          </p>
        </motion.div>
      )}

      {/* Message de progression pour les dernières étapes */}
      {currentStep === totalSteps - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-3 bg-primary/5 rounded-lg"
        >
          <p className="text-sm text-primary font-medium">
            Plus qu'une étape ! Votre profil sera bientôt prêt 🎉
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};