// src/features/onboarding/components/steps/GoalsStep.tsx
import React from 'react';

interface GoalsStepProps {
  selectedGoals: string[];
  errors: {
    goals?: { message?: string };
  };
  onGoalToggle: (goal: string) => void;
}

const GOALS_OPTIONS = [
  { id: 'lose_weight', label: 'Perdre du poids', emoji: '⚖️' },
  { id: 'gain_muscle', label: 'Prendre du muscle', emoji: '💪' },
  { id: 'improve_endurance', label: 'Améliorer l\'endurance', emoji: '🏃' },
  { id: 'increase_strength', label: 'Augmenter la force', emoji: '🏋️' },
  { id: 'better_health', label: 'Améliorer la santé', emoji: '❤️' },
  { id: 'reduce_stress', label: 'Réduire le stress', emoji: '🧘' },
];

export const GoalsStep: React.FC<GoalsStepProps> = ({
  selectedGoals,
  errors,
  onGoalToggle,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Vos objectifs 🎯</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sélectionnez tous les objectifs qui vous motivent
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {GOALS_OPTIONS.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => onGoalToggle(goal.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedGoals.includes(goal.id)
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
};