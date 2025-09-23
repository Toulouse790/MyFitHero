// src/features/nutrition/components/NutritionCalories.tsx
import React from 'react';
import { Target, Plus, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface NutritionCaloriesProps {
  currentCalories: number;
  goalCalories: number;
  percentage: number;
  sportEmoji: string;
  onAddMeal: () => void;
  onScanPhoto: () => void;
}

export const NutritionCalories: React.FC<NutritionCaloriesProps> = ({
  currentCalories,
  goalCalories,
  percentage,
  sportEmoji,
  onAddMeal,
  onScanPhoto,
}) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-800 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Calories Aujourd'hui</span>
          </h2>
          <span className="text-2xl">{sportEmoji}</span>
        </div>

        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-green-800 mb-2">
            {Math.round(currentCalories)}
          </div>
          <div className="text-green-600 text-sm">
            sur {Math.round(goalCalories)} kcal
          </div>
        </div>

        <Progress 
          value={Math.min(percentage, 100)} 
          className="h-3 mb-4" 
        />

        <div className="text-center text-sm text-green-700 mb-4">
          {percentage >= 100 ? (
            <span>🎉 Objectif atteint ! Excellent travail !</span>
          ) : percentage >= 80 ? (
            <span>👏 Plus que {Math.round(goalCalories - currentCalories)} kcal</span>
          ) : (
            <span>💪 Continuez, il reste {Math.round(goalCalories - currentCalories)} kcal</span>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onAddMeal}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Ajouter un repas
          </button>
          
          <button
            onClick={onScanPhoto}
            className="bg-white/20 hover:bg-white/30 text-green-700 font-medium py-2 px-4 rounded-lg border border-green-300 transition-colors duration-200"
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Scanner photo
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionCalories;