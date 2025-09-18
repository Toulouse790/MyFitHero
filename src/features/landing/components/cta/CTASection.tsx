// src/features/landing/components/cta/CTASection.tsx
import React from 'react';
import { ArrowRight, CheckCircle, Zap, Star } from 'lucide-react';
import { CTAButton } from './CTAButton';

export interface CTAData {
  title: string;
  subtitle?: string;
  description: string;
  primaryAction: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  trustIndicators?: Array<{
    icon?: React.ReactNode;
    text: string;
  }>;
  urgency?: {
    text: string;
    highlight?: string;
  };
  socialProof?: {
    text: string;
    count?: number;
  };
}

interface CTASectionProps {
  data: CTAData;
  variant?: 'default' | 'gradient' | 'minimal' | 'feature-rich';
  backgroundImage?: string;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  data,
  variant = 'default',
  backgroundImage,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white';
      case 'minimal':
        return 'bg-white border-t border-gray-200';
      case 'feature-rich':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getContentStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };

  return (
    <section 
      className={`py-16 lg:py-20 relative overflow-hidden ${getVariantStyles()} ${className}`}
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Overlay for background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Decorative elements */}
      {variant === 'gradient' && (
        <>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-30 translate-y-30" />
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            {data.subtitle && (
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>{data.subtitle}</span>
              </div>
            )}
            
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${getContentStyles()}`}>
              {data.title}
            </h2>
            
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              variant === 'minimal' ? 'text-gray-600' : 'text-white/90'
            }`}>
              {data.description}
            </p>
          </div>

          {/* Urgency */}
          {data.urgency && (
            <div className="inline-block">
              <div className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold animate-pulse">
                {data.urgency.text}
                {data.urgency.highlight && (
                  <span className="font-bold"> {data.urgency.highlight}</span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <CTAButton
              variant="primary"
              size="large"
              onClick={data.primaryAction.onClick}
              href={data.primaryAction.href}
              className={variant === 'minimal' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
            >
              {data.primaryAction.text}
              <ArrowRight className="w-5 h-5 ml-2" />
            </CTAButton>

            {data.secondaryAction && (
              <CTAButton
                variant={variant === 'minimal' ? 'outline' : 'secondary'}
                size="large"
                onClick={data.secondaryAction.onClick}
                href={data.secondaryAction.href}
              >
                {data.secondaryAction.text}
              </CTAButton>
            )}
          </div>

          {/* Trust Indicators */}
          {data.trustIndicators && data.trustIndicators.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
              {data.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {indicator.icon || <CheckCircle className="w-5 h-5 text-green-400" />}
                  <span className={`text-sm ${
                    variant === 'minimal' ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    {indicator.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Social Proof */}
          {data.socialProof && (
            <div className="pt-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className={`text-sm ${
                  variant === 'minimal' ? 'text-gray-600' : 'text-white/80'
                }`}>
                  {data.socialProof.text}
                  {data.socialProof.count && (
                    <span className="font-semibold"> ({data.socialProof.count.toLocaleString()}+ avis)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional info */}
          <p className={`text-sm ${
            variant === 'minimal' ? 'text-gray-500' : 'text-white/60'
          }`}>
            Essai gratuit • Aucune carte bancaire requise • Annulation en 1 clic
          </p>
        </div>
      </div>
    </section>
  );
};