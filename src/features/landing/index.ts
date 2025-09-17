// Export principal du module landing
export * from './types';
export * from './services/landing.service';
export * from './hooks';

// Pages
export { default as LandingPage } from './pages/LandingPage';

// Update module status
export const LandingModule = {
  name: 'landing',
  status: 'active',
  description: 'Module landing - Page d\'accueil fonctionnelle',
};
