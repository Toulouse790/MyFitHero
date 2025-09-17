// Export principal du module AI Coach
export * from './types';
export * from './services/ai-coach.service';
export * from './hooks';
export * from './components';

// Pages
export { default as AICoachPage } from './pages/AICoachPage';

// Module AI Coach complet
export const AiCoachModule = {
  name: 'ai-coach',
  status: 'active',
  description: 'Module AI Coach - Orchestrateur de santé global avec analyse cross-piliers',
  components: [
    'HealthOrchestrator',
  ],
  features: [
    'Scoring santé global',
    'Analyse cross-piliers',
    'Prédictions IA',
    'Recommandations personnalisées',
    'Dashboard unifié',
    'Optimisation continue',
  ],
};
