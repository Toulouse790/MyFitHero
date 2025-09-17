// Export principal du module sleep
export * from './types';
export { SleepService } from './services/sleep.service';
export { useSleep, useSleepAnalysis, useSleepStore } from './hooks';
export { SleepAnalytics, SleepChart, SleepQualityAnalyzer, SleepQualityForm } from './components';

// Pages
export { default as SleepPage } from './pages/SleepPage';

// Update module status
export const SleepModule = {
  name: 'sleep',
  status: 'active',
  description: 'Module sleep - Analyse qualité sommeil fonctionnelle',
};
