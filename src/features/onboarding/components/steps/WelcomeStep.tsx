// src/features/onboarding/components/steps/WelcomeStep.tsx
import React from 'react';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

interface WelcomeStepProps {
  errors: {
    sport?: { message?: string };
    level?: { message?: string };
  };
  onSportChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  errors,
  onSportChange,
  onLevelChange,
}) => {
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
          <Select onValueChange={onSportChange}>
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
          <Select onValueChange={onLevelChange}>
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
};