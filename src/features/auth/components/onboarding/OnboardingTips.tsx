// src/features/auth/components/onboarding/OnboardingTips.tsx
import React from 'react';
import { AlertCircle, BookOpen, Zap } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface OnboardingTipsProps {
  tips?: string[];
  estimatedTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  visible: boolean;
}

export const OnboardingTips: React.FC<OnboardingTipsProps> = ({
  tips = [],
  estimatedTime,
  difficulty = 'medium',
  visible,
}) => {
  if (!visible) return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Avancé';
      default:
        return diff;
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">Conseils pour cette étape</h3>
          <div className="flex items-center space-x-2 ml-auto">
            {estimatedTime && (
              <Badge variant="outline" className="text-xs">
                {estimatedTime}s
              </Badge>
            )}
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {getDifficultyLabel(difficulty)}
            </Badge>
          </div>
        </div>

        {tips.length > 0 ? (
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                <Zap className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <AlertCircle className="w-4 h-4" />
            <span>Prenez votre temps pour répondre de manière réfléchie</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};