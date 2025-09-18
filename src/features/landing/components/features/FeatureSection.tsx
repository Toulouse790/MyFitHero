// src/features/landing/components/features/FeatureSection.tsx
import React from 'react';
import { FeatureCard } from './FeatureCard';
import { FeatureHighlight } from './FeatureHighlight';
import { Feature } from './types';

interface FeatureSectionProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list' | 'carousel';
  showHighlights?: boolean;
  maxColumns?: number;
  className?: string;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  features,
  title = 'Nos fonctionnalités',
  subtitle,
  layout = 'grid',
  showHighlights = false,
  maxColumns = 3,
  className = '',
}) => {
  const gridCols = Math.min(features.length, maxColumns);
  
  const renderGridLayout = () => (
    <div className={`grid gap-8 ${
      gridCols === 1 ? 'grid-cols-1' :
      gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
        />
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-12">
      {features.map((feature, index) => (
        <FeatureHighlight
          key={feature.id}
          feature={feature}
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
    </div>
  );

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Features Display */}
        {layout === 'grid' && renderGridLayout()}
        {layout === 'list' && renderListLayout()}
      </div>
    </section>
  );
};