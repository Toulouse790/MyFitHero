// Test du système d'abonnement et des restrictions
import React from 'react';

// Types pour les niveaux d'abonnement
export type SubscriptionTier = 'free' | 'pro' | 'premium';

// Interface pour les fonctionnalités selon l'abonnement
export interface FeatureAccess {
  workouts: {
    maxPerWeek: number;
    advanced: boolean;
    aiCoach: 'basic' | 'advanced' | 'premium';
  };
  nutrition: {
    enabled: boolean;
    personalizedPlans: boolean;
    aiNutrition: boolean;
  };
  recovery: {
    enabled: boolean;
    advanced: boolean;
    sleepAnalysis: boolean;
  };
  analytics: {
    enabled: boolean;
    advanced: boolean;
    predictive: boolean;
  };
  support: {
    level: 'community' | 'email' | 'phone';
    priority: boolean;
  };
}

// Configuration des fonctionnalités par tier
export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, FeatureAccess> = {
  free: {
    workouts: {
      maxPerWeek: 3,
      advanced: false,
      aiCoach: 'basic',
    },
    nutrition: {
      enabled: false,
      personalizedPlans: false,
      aiNutrition: false,
    },
    recovery: {
      enabled: true,
      advanced: false,
      sleepAnalysis: false,
    },
    analytics: {
      enabled: true,
      advanced: false,
      predictive: false,
    },
    support: {
      level: 'community',
      priority: false,
    },
  },
  pro: {
    workouts: {
      maxPerWeek: 999,
      advanced: true,
      aiCoach: 'advanced',
    },
    nutrition: {
      enabled: true,
      personalizedPlans: true,
      aiNutrition: true,
    },
    recovery: {
      enabled: true,
      advanced: true,
      sleepAnalysis: true,
    },
    analytics: {
      enabled: true,
      advanced: true,
      predictive: false,
    },
    support: {
      level: 'email',
      priority: true,
    },
  },
  premium: {
    workouts: {
      maxPerWeek: 999,
      advanced: true,
      aiCoach: 'premium',
    },
    nutrition: {
      enabled: true,
      personalizedPlans: true,
      aiNutrition: true,
    },
    recovery: {
      enabled: true,
      advanced: true,
      sleepAnalysis: true,
    },
    analytics: {
      enabled: true,
      advanced: true,
      predictive: true,
    },
    support: {
      level: 'phone',
      priority: true,
    },
  },
};

// Hook pour vérifier l'accès aux fonctionnalités
export const useSubscriptionAccess = (userTier: SubscriptionTier = 'free') => {
  const features = SUBSCRIPTION_FEATURES[userTier];

  const canAccess = (feature: keyof FeatureAccess, subFeature?: string) => {
    const featureConfig = features[feature];
    if (!featureConfig) return false;

    if (subFeature) {
      return featureConfig[subFeature as keyof typeof featureConfig] === true;
    }

    // Pour les features avec enabled
    if ('enabled' in featureConfig) {
      return featureConfig.enabled;
    }

    return true;
  };

  const getWorkoutLimit = () => features.workouts.maxPerWeek;
  
  const shouldShowUpgrade = (requiredTier: SubscriptionTier) => {
    const tierOrder: Record<SubscriptionTier, number> = {
      free: 0,
      pro: 1,
      premium: 2,
    };
    return tierOrder[userTier] < tierOrder[requiredTier];
  };

  return {
    features,
    canAccess,
    getWorkoutLimit,
    shouldShowUpgrade,
    userTier,
  };
};

// Composant pour afficher les restrictions et upselling
export const FeatureGate: React.FC<{
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  featureName: string;
  children: React.ReactNode;
}> = ({ requiredTier, currentTier, featureName, children }) => {
  const { shouldShowUpgrade } = useSubscriptionAccess(currentTier);

  if (shouldShowUpgrade(requiredTier)) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center p-4">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {featureName} - {requiredTier.toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Cette fonctionnalité nécessite un abonnement {requiredTier}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Mettre à niveau
            </button>
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Composant de test des fonctionnalités
export const SubscriptionTest: React.FC<{ userTier: SubscriptionTier }> = ({ userTier }) => {
  const { features, canAccess, getWorkoutLimit } = useSubscriptionAccess(userTier);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Test Abonnement: {userTier.toUpperCase()}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workouts */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">🏋️ Entraînements</h3>
          <ul className="space-y-2">
            <li>Limite: {getWorkoutLimit()}/semaine</li>
            <li>Avancés: {features.workouts.advanced ? '✅' : '❌'}</li>
            <li>IA Coach: {features.workouts.aiCoach}</li>
          </ul>
        </div>

        {/* Nutrition */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">🍎 Nutrition</h3>
          <ul className="space-y-2">
            <li>Activé: {features.nutrition.enabled ? '✅' : '❌'}</li>
            <li>Plans perso: {features.nutrition.personalizedPlans ? '✅' : '❌'}</li>
            <li>IA Nutrition: {features.nutrition.aiNutrition ? '✅' : '❌'}</li>
          </ul>
        </div>

        {/* Recovery */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">💤 Récupération</h3>
          <ul className="space-y-2">
            <li>Activé: {features.recovery.enabled ? '✅' : '❌'}</li>
            <li>Avancé: {features.recovery.advanced ? '✅' : '❌'}</li>
            <li>Analyse sommeil: {features.recovery.sleepAnalysis ? '✅' : '❌'}</li>
          </ul>
        </div>

        {/* Analytics */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">📊 Analytics</h3>
          <ul className="space-y-2">
            <li>Activé: {features.analytics.enabled ? '✅' : '❌'}</li>
            <li>Avancé: {features.analytics.advanced ? '✅' : '❌'}</li>
            <li>Prédictif: {features.analytics.predictive ? '✅' : '❌'}</li>
          </ul>
        </div>
      </div>

      {/* Tests des Feature Gates */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Tests Feature Gates</h2>
        
        <FeatureGate requiredTier="pro" currentTier={userTier} featureName="Plans Nutritionnels">
          <div className="border p-4 rounded">
            <h4 className="font-medium">Plan Nutritionnel Personnalisé</h4>
            <p>Contenu accessible seulement avec Pro+</p>
          </div>
        </FeatureGate>

        <FeatureGate requiredTier="premium" currentTier={userTier} featureName="Coach Personnel">
          <div className="border p-4 rounded">
            <h4 className="font-medium">Coach Personnel Dédié</h4>
            <p>Consultations vidéo et programmes sur mesure</p>
          </div>
        </FeatureGate>
      </div>
    </div>
  );
};

export default SubscriptionTest;