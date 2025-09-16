// Export principal du module AI Coach
export * from './types/health-orchestrator';
export * from './utils/health-orchestrator-mapping';
export * from './components/HealthOrchestrator';

// Exports des hooks
export * from './hooks/useUnifiedLoading';
export * from './hooks/useUserPreferences';

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
