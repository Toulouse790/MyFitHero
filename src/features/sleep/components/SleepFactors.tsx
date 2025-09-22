// src/features/sleep/components/SleepFactors.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { defaultSleepFactors } from '../utils/sleepConfig';

interface SleepFactorsProps {
  selectedFactors: string[];
  onToggleFactor: (factorId: string) => void;
}

export const SleepFactors: React.FC<SleepFactorsProps> = ({
  selectedFactors,
  onToggleFactor
}) => {
  const getFactorClasses = (factor: any, isSelected: boolean): string => {
    if (!isSelected) {
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
    
    return factor.type === 'positive'
      ? 'bg-green-50 border-green-300 text-green-800'
      : 'bg-red-50 border-red-300 text-red-800';
  };

  return (
    <div className="space-y-3">
      <Label>Facteurs ayant influencé votre sommeil</Label>
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {defaultSleepFactors.map(factor => {
          const isSelected = selectedFactors.includes(factor.id);
          
          return (
            <button
              key={factor.id}
              type="button"
              onClick={() => onToggleFactor(factor.id)}
              className={`text-left p-2 rounded-lg border transition-colors ${getFactorClasses(factor, isSelected)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{factor.name}</span>
                <div className="flex items-center space-x-1">
                  <Badge
                    variant={factor.type === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {factor.type === 'positive' ? '+' : '-'}
                  </Badge>
                  {isSelected && (
                    <CheckCircle size={16} className="text-blue-600" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};