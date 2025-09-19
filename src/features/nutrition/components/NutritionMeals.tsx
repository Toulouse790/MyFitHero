// src/features/nutrition/components/NutritionMeals.tsx
import React from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutritionMealsProps {
  meals: Meal[];
  onAddMeal: (type: string) => void;
  onDeleteMeal: (mealId: string) => void;
  sportEmoji: string;
}

export const NutritionMeals: React.FC<NutritionMealsProps> = ({
  meals,
  onAddMeal,
  onDeleteMeal,
  sportEmoji,
}) => {
  const mealTypes = [
    { key: 'breakfast', name: 'Petit-déjeuner', icon: '🌅', time: '7h-9h' },
    { key: 'lunch', name: 'Déjeuner', icon: '☀️', time: '12h-14h' },
    { key: 'dinner', name: 'Dîner', icon: '🌙', time: '19h-21h' },
    { key: 'snack', name: 'Collation', icon: '🍎', time: 'Variable' },
  ];

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  const getTotalCaloriesForType = (type: string) => {
    return getMealsByType(type).reduce((total, meal) => total + meal.calories, 0);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Repas du Jour</span>
          </h3>
          <span className="text-2xl">{sportEmoji}</span>
        </div>

        <div className="space-y-4">
          {mealTypes.map((mealType) => {
            const typeMeals = getMealsByType(mealType.key);
            const totalCalories = getTotalCaloriesForType(mealType.key);

            return (
              <div key={mealType.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{mealType.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{mealType.name}</h4>
                      <p className="text-sm text-gray-500">{mealType.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {totalCalories} kcal
                    </div>
                    <button
                      onClick={() => onAddMeal(mealType.key)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 mt-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>

                {typeMeals.length > 0 ? (
                  <div className="space-y-2">
                    {typeMeals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{meal.name}</div>
                          <div className="text-sm text-gray-500">{meal.time}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">
                            {meal.calories} kcal
                          </span>
                          <button
                            onClick={() => onDeleteMeal(meal.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-sm">Aucun repas ajouté</p>
                    <button
                      onClick={() => onAddMeal(mealType.key)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ajouter votre premier repas
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">⏰ Timing optimal</div>
            <div className="text-yellow-700">
              Mangez 2-3h avant l'entraînement et dans les 30min après pour maximiser la récupération.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionMeals;