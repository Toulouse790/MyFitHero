// src/features/onboarding/components/steps/PersonalInfoStep.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  genderValue?: 'male' | 'female' | 'other';
  onGenderChange: (value: 'male' | 'female' | 'other') => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  register,
  errors,
  genderValue,
  onGenderChange,
}) => {
  // Helper pour extraire le message d'erreur
  const getErrorMessage = (error: any): string => {
    if (typeof error?.message === 'string') {
      return error.message;
    }
    return 'Erreur de validation';
  };
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
            <p className="text-sm text-red-500">{String(errors.age.message) || 'Erreur de validation'}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Genre</Label>
          <Select onValueChange={onGenderChange} value={genderValue}>
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
            <p className="text-sm text-red-500">{getErrorMessage(errors.gender)}</p>
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
            <p className="text-sm text-red-500">{getErrorMessage(errors.weight)}</p>
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
            <p className="text-sm text-red-500">{getErrorMessage(errors.height)}</p>
          )}
        </div>
      </div>
    </div>
  );
};