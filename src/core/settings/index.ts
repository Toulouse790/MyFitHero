// 🎯 SYSTÈME DE PARAMÈTRES UNIFIÉ - INDEX
// Point d'entrée principal pour le système de gestion des paramètres

export { 
  useSettingsStore, 
  useSettingsActions, 
  useSettingsValue,
  useSettingsSync,
  DEFAULT_SETTINGS,
  type UserSettings 
} from './settings.store';

export { 
  SettingsMigrationService,
  useSettingsMigration 
} from './settings.migration';

export {
  useSettingsInitialization,
  useSettingsAutoSync,
  useSettingsNotifications,
  useSettingsPWAIntegration
} from './useSettingsInitialization';

// 🚀 HOOK PRINCIPAL À UTILISER DANS L'APP
import { useSettingsStore, useSettingsActions } from './settings.store';

export const useSettings = () => {
  const store = useSettingsStore();
  const actions = useSettingsActions();
  
  return {
    // État
    ...store,
    
    // Actions
    ...actions,
    
    // Utilitaires de convenance
    isThemeDark: store.settings.theme === 'dark' || 
      (store.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isMetricUnits: store.settings.units === 'metric',
    hasNotificationsEnabled: store.settings.notifications.pushNotifications,
  };
};