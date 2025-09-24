// 🎯 STORE UNIFIÉ POUR LES PARAMÈTRES UTILISATEUR
// Centralise la gestion des paramètres avec sync automatique localStorage/Supabase/Zustand

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';

// 📊 TYPES CENTRALISÉS
export interface UserSettings {
  // Préférences générales
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr' | 'es';
  units: 'metric' | 'imperial';
  
  // Notifications
  notifications: {
    workoutReminders: boolean;
    nutritionReminders: boolean;
    hydrationReminders: boolean;
    sleepReminders: boolean;
    socialNotifications: boolean;
    challengeUpdates: boolean;
    systemUpdates: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    inAppSounds: boolean;
    vibration: boolean;
  };
  
  // Interface utilisateur
  ui: {
    compactMode: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    showAdvancedStats: boolean;
    autoStartWorkouts: boolean;
    showTips: boolean;
  };
  
  // Entraînement
  workout: {
    defaultRestTime: number;
    autoProgressSets: boolean;
    showRPE: boolean;
    showTempo: boolean;
    motivationalQuotes: boolean;
    warmupReminders: boolean;
  };
  
  // Confidentialité
  privacy: {
    shareWorkouts: boolean;
    shareNutrition: boolean;
    allowFriendRequests: boolean;
    showInLeaderboards: boolean;
    dataCollection: boolean;
    marketingEmails: boolean;
  };
  
  // Wearables
  wearables: {
    autoSync: boolean;
    syncInterval: number; // minutes
    preferredDevice: 'apple' | 'google' | 'garmin' | 'fitbit' | undefined;
    backgroundSync: boolean;
  };
}

interface SettingsState {
  // État
  settings: UserSettings;
  isLoading: boolean;
  error: string | undefined;
  lastSyncTime: Date | undefined;
  isDirty: boolean; // Modifications non sauvegardées
  
  // Actions
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  exportSettings: () => UserSettings;
  importSettings: (settings: UserSettings) => Promise<void>;
  
  // Utilitaires
  getSettingValue: <K extends keyof UserSettings>(key: K) => UserSettings[K];
  setSettingValue: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => Promise<void>;
  resetSection: <K extends keyof UserSettings>(section: K) => Promise<void>;
}

// 🎯 PARAMÈTRES PAR DÉFAUT OPTIMISÉS US
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  units: 'imperial', // US par défaut
  
  notifications: {
    workoutReminders: true,
    nutritionReminders: true,
    hydrationReminders: true,
    sleepReminders: false,
    socialNotifications: true,
    challengeUpdates: true,
    systemUpdates: true,
    pushNotifications: true,
    emailNotifications: false,
    inAppSounds: true,
    vibration: true,
  },
  
  ui: {
    compactMode: false,
    highContrast: false,
    reducedMotion: false,
    showAdvancedStats: true,
    autoStartWorkouts: false,
    showTips: true,
  },
  
  workout: {
    defaultRestTime: 90,
    autoProgressSets: true,
    showRPE: true,
    showTempo: false,
    motivationalQuotes: true,
    warmupReminders: true,
  },
  
  privacy: {
    shareWorkouts: true,
    shareNutrition: false,
    allowFriendRequests: true,
    showInLeaderboards: true,
    dataCollection: true,
    marketingEmails: false,
  },
  
  wearables: {
    autoSync: true,
    syncInterval: 15,
    preferredDevice: null,
    backgroundSync: true,
  },
};

// 🚀 STORE PRINCIPAL
export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // État initial
        settings: DEFAULT_SETTINGS,
        isLoading: false,
        error: null,
        lastSyncTime: null,
        isDirty: false,
        
        // 💾 MISE À JOUR DES PARAMÈTRES
        updateSettings: async (updates: Partial<UserSettings>) => {
          set({ isLoading: true, error: null });
          
          try {
            const currentSettings = get().settings;
            const newSettings = { ...currentSettings, ...updates };
            
            // Mise à jour locale immédiate
            set({ 
              settings: newSettings, 
              isDirty: true 
            });
            
            // Sync avec Supabase en arrière-plan
            await get().syncWithSupabase();
            
            set({ 
              isDirty: false,
              lastSyncTime: new Date() 
            });
            
          } catch (error: any) {
            set({ 
              error: error instanceof Error ? error.message : 'Erreur de sauvegarde',
              isDirty: true 
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // 🔄 SYNCHRONISATION SUPABASE
        syncWithSupabase: async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Utilisateur non authentifié');
            
            const { settings } = get();
            
            const { error } = await supabase
              .from('user_settings')
              .upsert({
                user_id: user.id,
                settings: settings,
                updated_at: new Date().toISOString(),
              });
              
            if (error) throw error;
            
          } catch (error: any) {
            console.error('Erreur sync Supabase:', error);
            throw error;
          }
        },
        
        // 📥 CHARGEMENT DEPUIS SUPABASE
        loadFromSupabase: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Utilisateur non authentifié');
            
            const { data, error }: any = await supabase
              .from('user_settings')
              .select('settings, updated_at')
              .eq('user_id', user.id)
              .single();
              
            if (error && error.code !== 'PGRST116') throw error;
            
            if (data?.settings) {
              // Fusionner avec les paramètres par défaut pour les nouvelles options
              const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
              
              set({ 
                settings: mergedSettings,
                lastSyncTime: new Date(data.updated_at),
                isDirty: false 
              });
            }
            
          } catch (error: any) {
            set({ 
              error: error instanceof Error ? error.message : 'Erreur de chargement'
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // 🔄 RESET DES PARAMÈTRES
        resetSettings: async () => {
          set({ isLoading: true });
          
          try {
            set({ settings: DEFAULT_SETTINGS, isDirty: true });
            await get().syncWithSupabase();
            set({ isDirty: false, lastSyncTime: new Date() });
            
          } catch (error: any) {
            set({ 
              error: error instanceof Error ? error.message : 'Erreur de reset'
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // 📤 EXPORT DES PARAMÈTRES
        exportSettings: () => {
          return get().settings;
        },
        
        // 📥 IMPORT DES PARAMÈTRES
        importSettings: async (settings: UserSettings) => {
          await get().updateSettings(settings);
        },
        
        // 🎯 UTILITAIRES
        getSettingValue: <K extends keyof UserSettings>(key: K) => {
          return get().settings[key];
        },
        
        setSettingValue: async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
          await get().updateSettings({ [key]: value } as Partial<UserSettings>);
        },
        
        resetSection: async <K extends keyof UserSettings>(section: K) => {
          const defaultValue = DEFAULT_SETTINGS[section];
          await get().updateSettings({ [section]: defaultValue } as Partial<UserSettings>);
        },
      }),
      {
        name: 'myfithero-settings-v2', // Nouvelle version
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return JSON.parse(str);
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
        // Ne persister que les paramètres essentiels
        partialize: (state) => ({
          settings: state.settings,
          lastSyncTime: state.lastSyncTime,
          isLoading: false,
          error: null,
          isDirty: false,
          updateSettings: state.updateSettings,
          resetSettings: state.resetSettings,
          syncWithSupabase: state.syncWithSupabase,
          loadFromSupabase: state.loadFromSupabase,
          exportSettings: state.exportSettings,
          importSettings: state.importSettings,
          getSettingValue: state.getSettingValue,
          setSettingValue: state.setSettingValue,
          resetSection: state.resetSection,
        }),
      }
    )
  )
);

// 🎯 HOOKS UTILITAIRES
export const useSettingsValue = <K extends keyof UserSettings>(key: K) => {
  return useSettingsStore((state) => state.settings[key]);
};

export const useSettingsActions = () => {
  return useSettingsStore((state) => ({
    updateSettings: state.updateSettings,
    resetSettings: state.resetSettings,
    syncWithSupabase: state.syncWithSupabase,
    loadFromSupabase: state.loadFromSupabase,
  }));
};

// 🔄 HOOK POUR LA SYNCHRONISATION AUTO

export const useSettingsSync = () => {
  const { isDirty, syncWithSupabase } = useSettingsStore();
  
  // Auto-sync toutes les 30 secondes si des modifications sont en attente
  useEffect(() => {
    if (!isDirty) return;
    
    const interval = setInterval(() => {
      syncWithSupabase().catch(console.error);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isDirty, syncWithSupabase]);
};