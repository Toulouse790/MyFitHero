// src/features/auth/components/onboarding/OnboardingNavigation.tsx
import React from 'react';
import { ChevronRight, ChevronLeft, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  canGoBack: boolean;
  canProceed: boolean;
  isLoading: boolean;
  isLastStep: boolean;
  hasErrors: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextButtonText?: string;
  backButtonText?: string;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  canGoBack,
  canProceed,
  isLoading,
  isLastStep,
  hasErrors,
  onBack,
  onNext,
  onSkip,
  nextButtonText,
  backButtonText = 'Retour',
}) => {
  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText;
    if (isLastStep) return 'Terminer';
    return 'Continuer';
  };

  const getNextButtonIcon = () => {
    if (isLoading) return <Clock className="w-4 h-4 animate-spin" />;
    if (isLastStep) return <Check className="w-4 h-4" />;
    return <ChevronRight className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
      {/* Back Button */}
      <div>
        {canGoBack ? (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{backButtonText}</span>
          </Button>
        ) : (
          <div></div> // Placeholder for spacing
        )}
      </div>

      {/* Right Side - Skip and Next */}
      <div className="flex items-center space-x-3">
        {/* Skip Button */}
        {onSkip && !isLastStep && (
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            Passer cette étape
          </Button>
        )}

        {/* Next/Continue/Finish Button */}
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading || hasErrors}
          className={`flex items-center space-x-2 min-w-[120px] justify-center ${
            isLastStep
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <span>{getNextButtonText()}</span>
          {getNextButtonIcon()}
        </Button>
      </div>
    </div>
  );
};