// src/features/landing/components/features/FeatureCard.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Feature } from './types';

interface FeatureCardProps {
  feature: Feature;
  compact?: boolean;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  compact = false,
  className = '',
}) => {
  const cardSize = compact ? 'p-6' : 'p-8';
  const titleSize = compact ? 'text-lg' : 'text-xl';
  const descriptionSize = compact ? 'text-sm' : 'text-base';

  return (
    <div 
      className={`
        ${cardSize} 
        bg-white rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-1
        border border-gray-100 group cursor-pointer
        ${className}
      `}
    >
      {/* Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl">
          {feature.icon}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className={`${titleSize} font-semibold text-gray-900 group-hover:text-blue-600 transition-colors`}>
          {feature.title}
        </h3>
        
        <p className={`${descriptionSize} text-gray-600 leading-relaxed`}>
          {feature.description}
        </p>

        {/* Learn more link */}
        <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">En savoir plus</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};