// Export principal du module social
export * from './types';
export * from './services/social.service';
export * from './hooks';
export * from './components';

// Pages
export { default as SocialPage } from './pages/SocialPage';
export { default as ChallengesPage } from './pages/ChallengesPage';

// Update module status
export const SocialModule = {
  name: 'social',
  status: 'active',
  description: 'Module social - Connexions et défis fonctionnels',
};
