// Export principal du module profile
export * from './types';
export * from './services/profile.service';
export * from './hooks';
export * from './components';

// Pages
export { default as ProfilePage } from './pages/ProfilePage';
export { default as SettingsPage } from './pages/SettingsPage';

// Update module status
export const ProfileModule = {
  name: 'profile',
  status: 'active',
  description: 'Module profile - Gestion profil utilisateur fonctionnelle',
};
