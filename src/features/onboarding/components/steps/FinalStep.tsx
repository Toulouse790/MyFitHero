// src/features/onboarding/components/steps/FinalStep.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinalStepProps {
  errors: {
    lifestyle?: { message?: string };
  };
  lifestyleValue?: string;
  onLifestyleChange: (value: string) => void;
}

export const FinalStep: React.FC<FinalStepProps> = ({
  errors,
  lifestyleValue,
  onLifestyleChange,
}) => {
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
        <Select onValueChange={onLifestyleChange} value={lifestyleValue}>
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
};