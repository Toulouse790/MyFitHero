// Export principal du module hydration
export * from './types';
export * from './utils/hydration-mapping';
export * from './components/HydrationOptimizer';

// Exports des services et hooks (à implémenter si nécessaire)
// export * from './services/hydration.service';
// export * from './hooks/useHydration';

// Export default du composant principal
export { default as HydrationOptimizer } from './components/HydrationOptimizer';
export const HydrationModule = {
  name: 'hydration',
  status: 'planned',
  description: 'Module hydration - À implémenter',
};
