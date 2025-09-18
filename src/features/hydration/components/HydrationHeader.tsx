// src/features/hydration/components/HydrationHeader.tsx
import React from 'react';
import { Droplets } from 'lucide-react';

interface HydrationHeaderProps {
  sportEmoji: string;
  personalizedMessage: string;
}

export const HydrationHeader: React.FC<HydrationHeaderProps> = ({
  sportEmoji,
  personalizedMessage,
}) => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
        <Droplets className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Hydratation</h1>
      <p className="text-gray-600">{sportEmoji} {personalizedMessage}</p>
    </div>
  );
};

export default HydrationHeader;