import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Progress } from '../../../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

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

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
    },
  });

  const watchedGoals = watch('goals', []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = watchedGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setValue('goals', newGoals);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    await onComplete(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Bienvenue dans MyFitHero ! 🎯</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Commençons par quelques questions pour personnaliser votre expérience
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sport">Quel est votre sport principal ?</Label>
                <Select onValueChange={(value) => setValue('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Musculation</SelectItem>
                    <SelectItem value="running">Course à pied</SelectItem>
                    <SelectItem value="cycling">Cyclisme</SelectItem>
                    <SelectItem value="swimming">Natation</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sport && (
                  <p className="text-sm text-red-500">{errors.sport.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="level">Votre niveau</Label>
                <Select onValueChange={(value) => setValue('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Vos objectifs 🎯</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sélectionnez tous les objectifs qui vous motivent
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'lose_weight', label: 'Perdre du poids', emoji: '⚖️' },
                { id: 'gain_muscle', label: 'Prendre du muscle', emoji: '💪' },
                { id: 'improve_endurance', label: 'Améliorer l\'endurance', emoji: '🏃' },
                { id: 'increase_strength', label: 'Augmenter la force', emoji: '🏋️' },
                { id: 'better_health', label: 'Améliorer la santé', emoji: '❤️' },
                { id: 'reduce_stress', label: 'Réduire le stress', emoji: '🧘' },
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    watchedGoals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-medium">{goal.label}</div>
                  </div>
                </button>
              ))}
            </div>
            {errors.goals && (
              <p className="text-sm text-red-500 text-center">{errors.goals.message}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Informations personnelles 👤</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ces données nous aident à personnaliser vos recommandations
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register('age', { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Genre</Label>
                <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  {...register('weight', { valueAsNumber: true })}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register('height', { valueAsNumber: true })}
                />
                {errors.height && (
                  <p className="text-sm text-red-500">{errors.height.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Prêt à commencer ! 🚀</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Votre profil est maintenant configuré. Commençons votre parcours fitness !
              </p>
            </div>
            
            <div>
              <Label htmlFor="lifestyle">Style de vie</Label>
              <Select onValueChange={(value) => setValue('lifestyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Décrivez votre activité quotidienne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sédentaire</SelectItem>
                  <SelectItem value="lightly_active">Légèrement actif</SelectItem>
                  <SelectItem value="moderately_active">Modérément actif</SelectItem>
                  <SelectItem value="very_active">Très actif</SelectItem>
                </SelectContent>
              </Select>
              {errors.lifestyle && (
                <p className="text-sm text-red-500">{errors.lifestyle.message}</p>
              )}
            </div>
          </div>
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
