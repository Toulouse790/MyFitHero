// Export principal du module sleep
export * from './types';
export * from './utils/sleep-mapping';
export * from './components/SleepQualityAnalyzer';

// Exports des services et hooks (à implémenter si nécessaire)
// export * from './services/sleep.service';
// export * from './hooks/useSleep';

// Export default du composant principal
export { default as SleepQualityAnalyzer } from './components/SleepQualityAnalyzer';
export const SleepModule = {
  name: 'sleep',
  status: 'planned',
  description: 'Module sleep - À implémenter',
};
