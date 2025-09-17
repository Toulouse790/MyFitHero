// Export principal du module profile
// export * from './types/index';
// export * from './services/profile.service';
// export * from './hooks/useProfile';

// Pages
export { default as ProfilePage } from './pages/ProfilePage';
export { default as SettingsPage } from './pages/SettingsPage';

// Exports des composants (à implémenter)
// export * from './components';

// Placeholder pour éviter les erreurs d'import
export const ProfileModule = {
  name: 'profile',
  status: 'planned',
  description: 'Module profile - À implémenter',
};
