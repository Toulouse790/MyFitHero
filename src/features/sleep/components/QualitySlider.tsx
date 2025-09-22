// src/features/sleep/components/QualitySlider.tsx
import React from 'react';
import { Label } from '@/components/ui/label';

interface QualitySliderProps {
  quality: number;
  onQualityChange: (quality: number) => void;
}

export const QualitySlider: React.FC<QualitySliderProps> = ({
  quality,
  onQualityChange
}) => {
  const getQualityColor = (value: number): string => {
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3">
      <Label>Qualité du sommeil (1-10)</Label>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min="1"
          max="10"
          value={quality}
          onChange={e => onQualityChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <div className={`w-12 text-center font-bold ${getQualityColor(quality)}`}>
          {quality}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Très mauvais</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};