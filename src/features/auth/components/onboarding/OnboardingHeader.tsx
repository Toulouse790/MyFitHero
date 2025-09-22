// src/features/auth/components/onboarding/OnboardingHeader.tsx
import React from 'react';
import { ChevronLeft, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface OnboardingHeaderProps {
  currentStepTitle: string;
  currentStepSubtitle?: string;
  progressPercentage: number;
  estimatedTimeLeft: number;
  canGoBack: boolean;
  onBack: () => void;
  onSkip?: () => void;
  showTips: boolean;
  onToggleTips: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStepTitle,
  currentStepSubtitle,
  progressPercentage,
  estimatedTimeLeft,
  canGoBack,
  onBack,
  onSkip,
  showTips,
  onToggleTips,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Top Row - Navigation and Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {canGoBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Time Indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>~{estimatedTimeLeft} min restantes</span>
          </div>

          {/* Tips Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTips}
            className={`flex items-center space-x-2 ${
              showTips ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Conseils</span>
          </Button>

          {/* Skip Button */}
          {onSkip && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-gray-500">
              Passer
            </Button>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentStepTitle}</h1>
        {currentStepSubtitle && (
          <p className="text-gray-600 text-lg">{currentStepSubtitle}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progression</span>
          <Badge variant="secondary" className="text-xs">
            {progressPercentage}%
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};