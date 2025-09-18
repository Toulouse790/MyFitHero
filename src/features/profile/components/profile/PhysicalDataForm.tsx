// src/features/profile/components/profile/PhysicalDataForm.tsx
import React from 'react';
import { Activity, Loader2 } from 'lucide-react';

interface PhysicalDataFormProps {
  currentWeight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  fitnessGoal: string;
  isLoading: boolean;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onActivityLevelChange: (value: string) => void;
  onFitnessGoalChange: (value: string) => void;
  onSave: () => void;
}

export const PhysicalDataForm: React.FC<PhysicalDataFormProps> = ({
  currentWeight,
  height,
  age,
  gender,
  activityLevel,
  fitnessGoal,
  isLoading,
  onWeightChange,
  onHeightChange,
  onAgeChange,
  onGenderChange,
  onActivityLevelChange,
  onFitnessGoalChange,
  onSave,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-500" size={20} />
        Données physiques
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Poids actuel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poids actuel (kg)
          </label>
          <input
            type="number"
            min="20"
            max="300"
            step="0.1"
            value={currentWeight}
            onChange={e => onWeightChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 70.5"
            disabled={isLoading}
          />
        </div>

        {/* Taille */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille (cm)
          </label>
          <input
            type="number"
            min="100"
            max="250"
            value={height}
            onChange={e => onHeightChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 175"
            disabled={isLoading}
          />
        </div>

        {/* Âge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Âge
          </label>
          <input
            type="number"
            min="10"
            max="120"
            value={age}
            onChange={e => onAgeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 25"
            disabled={isLoading}
          />
        </div>

        {/* Sexe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexe
          </label>
          <select
            value={gender}
            onChange={e => onGenderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Sélectionner</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Niveau d'activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau d'activité
          </label>
          <select
            value={activityLevel}
            onChange={e => onActivityLevelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="sedentary">Sédentaire</option>
            <option value="light">Légèrement actif</option>
            <option value="moderate">Modérément actif</option>
            <option value="active">Très actif</option>
            <option value="extra_active">Extrêmement actif</option>
          </select>
        </div>

        {/* Objectif principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objectif principal
          </label>
          <select
            value={fitnessGoal}
            onChange={e => onFitnessGoalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="lose_weight">Perdre du poids</option>
            <option value="maintain">Maintenir le poids</option>
            <option value="gain_weight">Prendre du poids</option>
            <option value="build_muscle">Prendre du muscle</option>
            <option value="improve_fitness">Améliorer la condition physique</option>
          </select>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <button
        onClick={onSave}
        disabled={isLoading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Enregistrement...
          </>
        ) : (
          'Enregistrer les modifications'
        )}
      </button>
    </div>
  );
};

export default PhysicalDataForm;