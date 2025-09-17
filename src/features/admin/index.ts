// Export principal du module admin
export * from './types';
export * from './services/admin.service';
export * from './hooks';
export * from './components';

// Keep legacy placeholder for compatibility
export const AdminModule = {
  name: 'admin',
  status: 'active',
  description: 'Module admin - Disponible',
};
