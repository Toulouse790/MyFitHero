// src/features/onboarding/components/OnboardingProgress.tsx
import React from 'react';
import { Progress } from '../../../components/ui/progress';
import { Button } from '../../../components/ui/button';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  isLoading,
  onPrevStep,
  onNextStep,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Étape {currentStep} sur {totalSteps}</h3>
        <div className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}%
        </div>
      </div>
      
      <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 1}
        >
          Précédent
        </Button>
        
        {currentStep === totalSteps ? (
          <Button type="button" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Finalisation...' : 'Terminer'}
          </Button>
        ) : (
          <Button type="button" onClick={onNextStep}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};