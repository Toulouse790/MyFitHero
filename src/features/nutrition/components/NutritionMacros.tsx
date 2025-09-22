// src/features/nutrition/components/NutritionMacros.tsx
import React from 'react';
import { Progress } from '@/features/components/ui/progress';
import { Card, CardContent } from '@/features/components/ui/card';

interface MacroData {
  current: number;
  goal: number;
  percentage: number;
  color: string;
  bgColor: string;
}

interface NutritionMacrosProps {
  proteins: MacroData;
  carbs: MacroData;
  fats: MacroData;
}

export const NutritionMacros: React.FC<NutritionMacrosProps> = ({
  proteins,
  carbs,
  fats,
}) => {
  const macros = [
    { name: 'Protéines', data: proteins, unit: 'g', icon: '🥩' },
    { name: 'Glucides', data: carbs, unit: 'g', icon: '🍞' },
    { name: 'Lipides', data: fats, unit: 'g', icon: '🥑' },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <span>📊</span>
          <span>Répartition Macronutriments</span>
        </h3>

        <div className="space-y-6">
          {macros.map((macro) => (
            <div key={macro.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{macro.icon}</span>
                  <span className="font-medium text-gray-900">{macro.name}</span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {Math.round(macro.data.current)}{macro.unit} / {Math.round(macro.data.goal)}{macro.unit}
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={Math.min(macro.data.percentage, 100)} 
                  className="h-2"
                  style={{
                    '--progress-background': macro.data.bgColor,
                    '--progress-foreground': macro.data.color,
                  } as React.CSSProperties}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round(macro.data.percentage)}%
                </div>
              </div>

              {macro.data.percentage >= 100 && (
                <div className="text-xs text-green-600 font-medium">
                  ✅ Objectif atteint !
                </div>
              )}
              
              {macro.data.percentage < 50 && (
                <div className="text-xs text-orange-600 font-medium">
                  ⚠️ Il reste {Math.round(macro.data.goal - macro.data.current)}{macro.unit} à consommer
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 Conseil nutrition</div>
            <div className="text-blue-700">
              Répartition idéale : Protéines 25-30%, Glucides 45-55%, Lipides 20-25% pour optimiser vos performances sportives.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionMacros;