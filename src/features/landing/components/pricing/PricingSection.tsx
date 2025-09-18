// src/features/landing/components/pricing/PricingSection.tsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { PricingCard } from './PricingCard';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: Array<{
    name: string;
    included: boolean;
    description?: string;
  }>;
  popular?: boolean;
  cta: {
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  badge?: string;
  limits?: {
    workouts?: number;
    storage?: string;
    support?: string;
  };
}

interface PricingSectionProps {
  plans: PricingPlan[];
  billingPeriod?: 'monthly' | 'yearly';
  onBillingChange?: (period: 'monthly' | 'yearly') => void;
  showComparison?: boolean;
  maxFeaturesToShow?: number;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  plans,
  billingPeriod = 'monthly',
  onBillingChange,
  showComparison = false,
  maxFeaturesToShow = 10,
  className = '',
}) => {
  const yearlyDiscount = 20; // 20% discount for yearly billing

  const getAllFeatures = () => {
    const featuresSet = new Set<string>();
    plans.forEach(plan => {
      plan.features.forEach(feature => featuresSet.add(feature.name));
    });
    return Array.from(featuresSet).slice(0, maxFeaturesToShow);
  };

  const renderBillingToggle = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
        Mensuel
      </span>
      <button
        onClick={() => onBillingChange?.(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
        className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span
          className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full shadow-lg ${
            billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
        Annuel
      </span>
      {billingPeriod === 'yearly' && (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
          -{yearlyDiscount}%
        </span>
      )}
    </div>
  );

  const renderComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-6 font-semibold text-gray-900">Fonctionnalités</th>
            {plans.map(plan => (
              <th key={plan.id} className="text-center p-6">
                <div className="font-semibold text-gray-900">{plan.name}</div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  {plan.price[billingPeriod]}€
                  <span className="text-sm font-normal text-gray-500">
                    /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getAllFeatures().map((featureName, index) => (
            <tr key={featureName} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-6 font-medium text-gray-900">{featureName}</td>
              {plans.map(plan => {
                const feature = plan.features.find(f => f.name === featureName);
                return (
                  <td key={plan.id} className="p-6 text-center">
                    {feature?.included ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins
          </p>
        </div>

        {/* Billing Toggle */}
        {onBillingChange && renderBillingToggle()}

        {/* Pricing Cards */}
        {!showComparison && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingPeriod={billingPeriod}
                yearlyDiscount={yearlyDiscount}
              />
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {showComparison && (
          <div className="mb-12">
            {renderComparisonTable()}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Aucun engagement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Annulation en 1 clic</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Support 24/7</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Plus de 10 000 utilisateurs nous font confiance. 
            Essayez MyFitHero gratuitement pendant 14 jours, sans carte bancaire.
          </p>
        </div>
      </div>
    </section>
  );
};