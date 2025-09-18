// src/features/hydration/components/HydrationProgress.tsx
import React from 'react';

interface HydrationProgressProps {
  currentHydrationL: number;
  goalHydrationL: number;
  percentage: number;
  remaining: number;
}

export const HydrationProgress: React.FC<HydrationProgressProps> = ({
  currentHydrationL,
  goalHydrationL,
  percentage,
  remaining,
}) => {
  return (
    <div className="text-center mb-6">
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {currentHydrationL.toFixed(2).replace(/\.?0+$/, '')}L
      </div>
      <div className="text-gray-600 mb-4">
        sur {goalHydrationL.toFixed(2).replace(/\.?0+$/, '')}L objectif
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-sm text-gray-600">
        {remaining > 0
          ? `${(remaining / 1000).toFixed(2).replace(/\.?0+$/, '')}L restants`
          : 'Objectif atteint ! 🎉'}
      </div>
    </div>
  );
};

export default HydrationProgress;