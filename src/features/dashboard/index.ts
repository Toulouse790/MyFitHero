// Export principal du module dashboard
export { default as Dashboard } from './pages/Dashboard';

// Components
export { default as MetricsOverview } from './components/MetricsOverview';
export { default as SmartInsightsWidget } from './components/SmartInsightsWidget';
export { default as PersonalizedGoals } from './components/PersonalizedGoals';

// Hooks
export { useDashboard } from './hooks/useDashboard';

// Types
export * from './types';

export const DashboardModule = {
  name: 'dashboard',
  status: 'premium',
  description: 'Dashboard Premium avec Intelligence Artificielle',
  features: [
    'Analytics IA avancés',
    'Insights personnalisés',
    'Objectifs adaptatifs',
    'Scores de performance',
    'Prédictions intelligentes'
  ]
};