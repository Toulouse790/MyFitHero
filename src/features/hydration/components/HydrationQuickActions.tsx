// src/features/hydration/components/HydrationQuickActions.tsx
import React from 'react';
import { Droplets } from 'lucide-react';
import { Database } from '@/lib/types/database';

type DrinkType = Database['public']['Tables']['hydration_logs']['Row']['drink_type'];
type HydrationContext = Database['public']['Tables']['hydration_logs']['Row']['hydration_context'];

interface HydrationQuickActionsProps {
  onAddWater: (amount: number, drinkType: DrinkType, context: HydrationContext) => void;
}

export const HydrationQuickActions: React.FC<HydrationQuickActionsProps> = ({
  onAddWater,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button 
        onClick={() => onAddWater(250, 'water', 'normal')}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
      >
        <Droplets className="h-5 w-5 mx-auto mb-1" />
        +250ml
      </button>
      <button 
        onClick={() => onAddWater(500, 'water', 'normal')}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
      >
        <Droplets className="h-5 w-5 mx-auto mb-1" />
        +500ml
      </button>
    </div>
  );
};

export default HydrationQuickActions;