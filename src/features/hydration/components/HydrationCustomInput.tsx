// src/features/hydration/components/HydrationCustomInput.tsx
import React from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import { Database } from '../../workout/types/database';

type DrinkType = Database['public']['Tables']['hydration_logs']['Row']['drink_type'];
type HydrationContext = Database['public']['Tables']['hydration_logs']['Row']['hydration_context'];

interface HydrationCustomInputProps {
  selectedAmount: number;
  onAmountChange: (amount: number) => void;
  onAddWater: (amount: number, drinkType: DrinkType, context: HydrationContext) => void;
}

export const HydrationCustomInput: React.FC<HydrationCustomInputProps> = ({
  selectedAmount,
  onAmountChange,
  onAddWater,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <button
          onClick={() => onAmountChange(Math.max(50, selectedAmount - 50))}
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-semibold text-xl min-w-20 text-center text-gray-900">{selectedAmount}ml</span>
        <button
          onClick={() => onAmountChange(Math.min(2000, selectedAmount + 50))}
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => onAddWater(selectedAmount, 'water', 'normal')}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-medium transition-all duration-200"
      >
        <Droplets className="h-5 w-5 inline mr-2" />
        Ajouter {selectedAmount}ml
      </button>
    </div>
  );
};

export default HydrationCustomInput;