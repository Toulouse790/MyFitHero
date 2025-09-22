import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep, GoalsStep, PersonalInfoStep, FinalStep } from '../components/steps';

const onboardingSchema = z.object({
  sport: z.string().min(1, 'Sélectionnez votre sport principal'),
  level: z.string().min(1, 'Sélectionnez votre niveau'),
  goals: z.array(z.string()).min(1, 'Sélectionnez au moins un objectif'),
  age: z.number().min(16, 'Vous devez avoir au moins 16 ans').max(100, 'Âge invalide'),
  weight: z.number().min(30, 'Poids minimum: 30kg').max(300, 'Poids maximum: 300kg'),
  height: z.number().min(100, 'Taille minimum: 100cm').max(250, 'Taille maximum: 250cm'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Sélectionnez votre genre' }),
  lifestyle: z.string().min(1, 'Sélectionnez votre style de vie'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFlowProps {
  onComplete?: (data: OnboardingFormData) => Promise<void>;
  isLoading?: boolean;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete = async () => {}, 
  isLoading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
    },
  });

  // Watch des valeurs pour les passer aux composants
  const watchedValues = {
    sport: watch('sport'),
    level: watch('level'),
    goals: watch('goals', []),
    gender: watch('gender'),
    lifestyle: watch('lifestyle'),
  };

  const nextStep = async () => {
    // Validation des champs requis pour l'étape courante
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['sport', 'level'];
        break;
      case 2:
        fieldsToValidate = ['goals'];
        break;
      case 3:
        fieldsToValidate = ['age', 'weight', 'height', 'gender'];
        break;
      case 4:
        fieldsToValidate = ['lifestyle'];
        break;
    }

    // Déclencher la validation pour les champs de l'étape
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    // Si invalid, les erreurs s'affichent automatiquement
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = watchedValues.goals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setValue('goals', newGoals, { shouldValidate: true });
  };

  // Handlers pour les setValue avec validation
  const handleSportChange = (value: string) => {
    setValue('sport', value, { shouldValidate: true });
  };

  const handleLevelChange = (value: string) => {
    setValue('level', value, { shouldValidate: true });
  };

  const handleGenderChange = (value: 'male' | 'female' | 'other') => {
    setValue('gender', value, { shouldValidate: true });
  };

  const handleLifestyleChange = (value: string) => {
    setValue('lifestyle', value, { shouldValidate: true });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    await onComplete(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep
            errors={errors}
            sportValue={watchedValues.sport}
            levelValue={watchedValues.level}
            onSportChange={handleSportChange}
            onLevelChange={handleLevelChange}
          />
        );

      case 2:
        return (
          <GoalsStep
            selectedGoals={watchedValues.goals}
            errors={errors}
            onGoalToggle={handleGoalToggle}
          />
        );

      case 3:
        return (
          <PersonalInfoStep
            register={register}
            errors={errors}
            genderValue={watchedValues.gender}
            onGenderChange={handleGenderChange}
          />
        );

      case 4:
        return (
          <FinalStep
            errors={errors}
            lifestyleValue={watchedValues.lifestyle}
            onLifestyleChange={handleLifestyleChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Étape {currentStep} sur {totalSteps}</CardTitle>
                <div className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</div>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Finalisation...' : 'Terminer'}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    Suivant
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
