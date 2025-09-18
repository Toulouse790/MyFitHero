// src/features/landing/components/features/FeatureHighlight.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Feature } from './types';

interface FeatureHighlightProps {
  feature: Feature;
  imagePosition?: 'left' | 'right';
  className?: string;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  feature,
  imagePosition = 'right',
  className = '',
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <div className={`flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12 ${className}`}>
      {/* Content */}
      <div className={`flex-1 ${isImageLeft ? 'lg:order-2' : ''}`}>
        <div className="space-y-6">
          {/* Icon & Title */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl">
              {feature.icon}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              {feature.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {feature.description}
          </p>

          {/* Benefits list (if any) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Interface intuitive et moderne</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Suivi en temps réel</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Analyses personnalisées</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Découvrir cette fonctionnalité
            </button>
          </div>
        </div>
      </div>

      {/* Image/Visual */}
      <div className={`flex-1 ${isImageLeft ? 'lg:order-1' : ''}`}>
        <div className="relative">
          {/* Placeholder for image/screenshot */}
          <div className="aspect-w-16 aspect-h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-center">
              <div className="text-6xl text-gray-400">
                {feature.icon}
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-500 rounded-full opacity-10"></div>
        </div>
      </div>
    </div>
  );
};