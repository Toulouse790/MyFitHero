// src/shared/components/AIModal.tsx

import React from 'react';
import { Brain, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AIIntelligence from '../../features/ai-coach/components/AIIntelligence';

interface AIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pillar: 'hydration' | 'nutrition' | 'sleep';
  title?: string;
  description?: string;
  showPredictions?: boolean;
  showCoaching?: boolean;
  showRecommendations?: boolean;
}

export const AIModal: React.FC<AIModalProps> = ({
  open,
  onOpenChange,
  pillar,
  title,
  description,
  showPredictions = true,
  showCoaching = true,
  showRecommendations = true,
}) => {
  const getDefaultTitle = () => {
    switch (pillar) {
      case 'hydration':
        return 'Coaching IA - Hydratation';
      case 'nutrition':
        return 'Analyse Nutritionnelle IA';
      case 'sleep':
        return 'Analyse Sommeil IA';
      default:
        return 'Coaching IA';
    }
  };

  const getDefaultDescription = () => {
    switch (pillar) {
      case 'hydration':
        return 'Analyse personnalisée et conseils';
      case 'nutrition':
        return 'IA personnalisée et conseils';
      case 'sleep':
        return 'Optimisation du sommeil';
      default:
        return 'Analyse personnalisée';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {title || getDefaultTitle()}
              </h3>
              <p className="text-xs text-gray-600">
                {description || getDefaultDescription()}
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Ouvrir <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{title || getDefaultTitle()}</DialogTitle>
              </DialogHeader>
              <AIIntelligence
                pillar={pillar}
                showPredictions={showPredictions}
                showCoaching={showCoaching}
                showRecommendations={showRecommendations}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};