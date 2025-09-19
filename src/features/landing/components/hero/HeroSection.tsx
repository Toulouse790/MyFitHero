// src/features/landing/components/hero/HeroSection.tsx
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { HeroCTA } from './HeroCTA';
import { HeroVideo } from './HeroVideo';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryAction?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  videoUrl?: string;
  trustIndicators?: Array<{
    text: string;
    icon?: React.ReactNode;
  }>;
  variant?: 'default' | 'gradient' | 'minimal';
  backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  videoUrl,
  trustIndicators,
  variant = 'default',
  backgroundImage,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800';
      case 'minimal':
        return 'bg-white text-gray-900';
      default:
        return 'bg-blue-600';
    }
  };

  const getTextStyles = () => {
    return variant === 'minimal' ? 'text-gray-900' : 'text-white';
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${getVariantStyles()}`}>
      {/* Background */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${getTextStyles()}`}>
            {title}
          </h1>
          
          <p className={`text-xl md:text-2xl mb-4 ${getTextStyles()} opacity-90`}>
            {subtitle}
          </p>

          {description && (
            <p className={`text-lg mb-8 ${getTextStyles()} opacity-80 max-w-2xl mx-auto`}>
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                {primaryAction.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={`inline-flex items-center px-8 py-4 border-2 border-white ${getTextStyles()} font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg`}
              >
                <Play className="w-5 h-5 mr-2" />
                {secondaryAction.text}
              </button>
            )}
          </div>

          {/* Trust Indicators */}
          {trustIndicators && trustIndicators.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {indicator.icon}
                  <span className={`text-sm ${getTextStyles()} opacity-80`}>
                    {indicator.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Video Section */}
          {videoUrl && (
            <div className="mt-12">
              <HeroVideo videoSrc={videoUrl} title="Démo MyFitHero" />
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${getTextStyles()} animate-bounce`}>
        <div className="w-6 h-10 border-2 border-current rounded-full p-1">
          <div className="w-1 h-3 bg-current rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};