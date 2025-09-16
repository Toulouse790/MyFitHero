// Exports des composants social modernisés
export { BadgeNotification } from './social/components/BadgeNotification';
export type { BadgeData, BadgeRarity } from './social/components/BadgeNotification';

// Exports des composants analytics modernisés  
export { ModernStatsOverview } from './analytics/components/ModernStatsOverview';

// Exports des composants IA Coach
export { HealthOrchestrator } from './ai-coach/components/HealthOrchestrator';
export type { 
  HealthData, 
  HealthAnalysis, 
  WeeklyHealthSummary,
  HealthGoals 
} from './ai-coach/types/health-orchestrator';

// Exports des hooks modernisés
export { useUnifiedLoading } from './ai-coach/hooks/useUnifiedLoading';
export { useUserPreferences } from './ai-coach/hooks/useUserPreferences';

// Composants nutrition, sommeil, hydratation déjà exportés dans leurs modules respectifs
export { SmartNutritionTracker } from './nutrition/components/SmartNutritionTracker';
export { SleepQualityAnalyzer } from './sleep/components/SleepQualityAnalyzer';
export { HydrationOptimizer } from './hydration/components/HydrationOptimizer';

// Module de fonctionnalités modernisées MyFitHero
export const ModernFeaturesModule = {
  name: 'modern-features',
  status: 'active',
  description: 'Composants modernisés avec animations et IA avancée',
  version: '2.0',
  components: [
    'BadgeNotification',
    'ModernStatsOverview', 
    'HealthOrchestrator',
    'SmartNutritionTracker',
    'SleepQualityAnalyzer',
    'HydrationOptimizer',
  ],
  features: [
    'Notifications badges sophistiquées',
    'Stats overview avec animations Framer Motion',
    'Dashboard IA cross-piliers',
    'Tracking nutrition intelligent',
    'Analyse sommeil avancée',
    'Optimisation hydratation',
    'Interfaces glassmorphism',
    'Performance 60fps',
    'TypeScript 100%',
  ],
};