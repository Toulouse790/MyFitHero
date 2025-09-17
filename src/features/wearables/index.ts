// Export principal du module wearables
export * from './types';
export * from './services/wearable.service';
export { WearablesService } from './services/wearables.service';
export { useWearables } from './hooks';
export * from './components';

// Pages
export { default as WearableHubPage } from './pages/WearableHubPage';

// Update module status
export const WearablesModule = {
  name: 'wearables',
  status: 'active',
  description: 'Module wearables - Synchronisation appareils connectés',
};
