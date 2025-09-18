// src/features/landing/components/pricing/PricingCard.tsx
import React from 'react';
import { Check, Crown, Zap } from 'lucide-react';
import { PricingPlan } from './PricingSection';

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: 'monthly' | 'yearly';
  yearlyDiscount?: number;
  onSelect?: (planId: string) => void;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingPeriod,
  yearlyDiscount = 20,
  onSelect,
  className = '',
}) => {
  const currentPrice = plan.price[billingPeriod];
  const monthlyPrice = plan.price.monthly;
  const yearlyOriginalPrice = monthlyPrice * 12;
  const yearlyDiscountAmount = billingPeriod === 'yearly' ? yearlyOriginalPrice - plan.price.yearly : 0;

  const handleSelect = () => {
    onSelect?.(plan.id);
  };

  const getButtonStyles = () => {
    switch (plan.cta.variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
      case 'secondary':
        return 'bg-gray-900 text-white hover:bg-gray-800 border-gray-900';
      case 'outline':
        return 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
    }
  };

  const getCardStyles = () => {
    if (plan.popular) {
      return 'border-2 border-blue-500 shadow-xl scale-105 relative';
    }
    return 'border border-gray-200 shadow-sm hover:shadow-md transition-shadow';
  };

  return (
    <div className={`bg-white rounded-xl p-8 ${getCardStyles()} ${className}`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Crown className="w-4 h-4" />
            <span>Le plus populaire</span>
          </div>
        </div>
      )}

      {/* Custom Badge */}
      {plan.badge && !plan.popular && (
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{plan.badge}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold text-gray-900">{currentPrice}</span>
            <span className="text-xl text-gray-600 ml-1">{plan.price.currency}</span>
          </div>
          <div className="text-gray-500">
            /{billingPeriod === 'monthly' ? 'mois' : 'an'}
          </div>
          
          {/* Yearly Discount */}
          {billingPeriod === 'yearly' && yearlyDiscountAmount > 0 && (
            <div className="space-y-1">
              <div className="text-sm text-gray-500 line-through">
                {yearlyOriginalPrice}€/an
              </div>
              <div className="text-sm text-green-600 font-semibold">
                Économisez {yearlyDiscountAmount}€ par an
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              )}
            </div>
            <div>
              <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                {feature.name}
              </span>
              {feature.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {feature.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Limits */}
      {plan.limits && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 space-y-2">
            {plan.limits.workouts && (
              <div>Jusqu'à {plan.limits.workouts} entraînements/mois</div>
            )}
            {plan.limits.storage && (
              <div>{plan.limits.storage} de stockage</div>
            )}
            {plan.limits.support && (
              <div>Support {plan.limits.support}</div>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleSelect}
        className={`w-full py-3 px-6 rounded-lg font-semibold border transition-colors ${getButtonStyles()}`}
      >
        {plan.cta.text}
      </button>

      {/* Trial Info */}
      {plan.id !== 'free' && (
        <p className="text-center text-xs text-gray-500 mt-4">
          Essai gratuit de 14 jours
        </p>
      )}
    </div>
  );
};