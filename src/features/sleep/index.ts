// Export principal du module sleep
export * from './types';
export * from './services/sleep.service';
export * from './hooks';
export * from './components';

// Pages
export { default as SleepPage } from './pages/SleepPage';

// Update module status
export const SleepModule = {
  name: 'sleep',
  status: 'active',
  description: 'Module sleep - Analyse qualité sommeil fonctionnelle',
};
