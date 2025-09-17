// Export principal du module hydration
export * from './types';
export * from './services/hydration.service';
export * from './hooks';
export * from './components';

// Pages
export { default as HydrationPage } from './pages/HydrationPage';

// Update module status
export const HydrationModule = {
  name: 'hydration',
  status: 'active',
  description: 'Module hydration - Fonctionnel avec optimisateur et rappels',
};
