// 🚀 HOOK D'INITIALISATION DES PARAMÈTRES UNIFIÉS
// Gère la migration automatique et l'initialisation des paramètres au démarrage

import { useEffect, useState } from 'react';
import { useSettingsStore, useSettingsActions } from '@/core/settings/settings.store';
import { SettingsMigrationService } from '@/core/settings/settings.migration';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface InitializationState {
  isInitializing: boolean;
  migrationCompleted: boolean;
  error: string | null;
  migrationSources: string[];
}

/**
 * 🎯 HOOK PRINCIPAL D'INITIALISATION
 * Utiliser dans App.tsx ou au niveau racine de l'application
 */
export const useSettingsInitialization = () => {
  const { toast } = useToast();
  const { settings, isLoading: settingsLoading } = useSettingsStore();
  const { updateSettings, loadFromSupabase } = useSettingsActions();
  
  const [initState, setInitState] = useState<InitializationState>({
    isInitializing: true,
    migrationCompleted: false,
    error: null,
    migrationSources: [],
  });
  
  useEffect(() => {
    let mounted = true;
    
    const initializeSettings = async () => {
      try {
        setInitState(prev => ({
          ...prev,
          isInitializing: true,
          error: null
        }));
        
        // 1️⃣ Vérifier l'authentification
        const { data: { user } } = await supabase.auth.getUser();
        
        // 2️⃣ Vérifier si les nouveaux paramètres existent déjà
        const hasNewSettings = localStorage.getItem('myfithero-settings-v2');
        
        if (!hasNewSettings) {
          // 3️⃣ Lancer la migration des anciens paramètres
          console.log('🔄 Démarrage de la migration des paramètres...');
          
          const migrationResult = await SettingsMigrationService.migrateAllSettings(user?.id);
          
          if (!mounted) return;
          
          // 4️⃣ Appliquer les paramètres migrés
          if (migrationResult.success && Object.keys(migrationResult.migratedData).length > 0) {
            await updateSettings(migrationResult.migratedData);
            
            // 📊 Afficher le rapport de migration
            console.log(SettingsMigrationService.generateMigrationReport(migrationResult));
            
            setInitState(prev => ({
              ...prev,
              migrationSources: migrationResult.sources,
            }));
            
            // 5️⃣ Nettoyage des anciennes données (après confirmation)
            setTimeout(() => {
              SettingsMigrationService.cleanupLegacyData();
            }, 1000);
            
            toast({
              title: '✅ Settings Migrated',
              description: `Successfully migrated settings from ${migrationResult.sources.length} sources.`
            });
          }
        } else if (user?.id) {
          // 6️⃣ Charger depuis Supabase si disponible
          try {
            await loadFromSupabase();
          } catch (error) {
            // Erreur silencieuse, les paramètres locaux seront utilisés
            console.warn('Could not load settings from Supabase:', error);
          }
        }
        
        if (!mounted) return;
        
        setInitState(prev => ({
          ...prev,
          isInitializing: false,
          migrationCompleted: true,
        }));
        
      } catch (error) {
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
        
        setInitState(prev => ({
          ...prev,
          isInitializing: false,
          error: errorMessage,
        }));
        
        console.error('Settings initialization failed:', error);
        
        toast({
          title: '⚠️ Settings Initialization Failed',
          description: 'Using default settings. You can customize them in the Settings page.',
          variant: 'destructive'
        });
      }
    };
    
    initializeSettings();
    
    return () => {
      mounted = false;
    };
  }, []); // Exécuter seulement au montage initial
  
  return {
    isInitializing: initState.isInitializing || settingsLoading,
    migrationCompleted: initState.migrationCompleted,
    error: initState.error,
    migrationSources: initState.migrationSources,
    settings,
  };
};

/**
 * 🔄 HOOK POUR LA SYNCHRONISATION CONTINUE
 * Utiliser dans les composants qui modifient souvent les paramètres
 */
export const useSettingsAutoSync = (enabled: boolean = true) => {
  const { isDirty, lastSyncTime } = useSettingsStore();
  const { syncWithSupabase } = useSettingsActions();
  
  useEffect(() => {
    if (!enabled || !isDirty) return;
    
    // Sync automatique après 5 secondes d'inactivité
    const timeout = setTimeout(async () => {
      try {
        await syncWithSupabase();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isDirty, enabled, syncWithSupabase]);
  
  return {
    isDirty,
    lastSyncTime,
  };
};

/**
 * 🔔 HOOK POUR LES NOTIFICATIONS DE PARAMÈTRES
 * Réagit aux changements de paramètres pour mettre à jour l'interface
 */
export const useSettingsNotifications = () => {
  const theme = useSettingsStore(state => state.settings.theme);
  const language = useSettingsStore(state => state.settings.language);
  const notifications = useSettingsStore(state => state.settings.notifications);
  
  // Appliquer le thème
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      return;
    } 
    
    if (theme === 'light') {
      root.classList.remove('dark');
      return;
    }
    
    // Système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = () => {
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    
    applySystemTheme();
    mediaQuery.addEventListener('change', applySystemTheme);
    
    return () => mediaQuery.removeEventListener('change', applySystemTheme);
  }, [theme]);
  
  // Mettre à jour la langue du document
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  // Configurer les notifications Push
  useEffect(() => {
    if ('Notification' in window && notifications.pushNotifications) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [notifications.pushNotifications]);
  
  return {
    theme,
    language,
    notifications,
  };
};

/**
 * 📱 HOOK POUR LA GESTION DES PRÉFÉRENCES PWA
 * Synchronise les paramètres avec les fonctionnalités PWA
 */
export const useSettingsPWAIntegration = () => {
  const { vibration, inAppSounds } = useSettingsStore(state => state.settings.notifications);
  
  // Configuration de la vibration
  const triggerVibration = (pattern: number | number[] = 200) => {
    if (vibration && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };
  
  // Jouer un son
  const playSound = (soundType: 'success' | 'error' | 'notification' = 'notification') => {
    if (!inAppSounds) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = {
      success: 800,
      error: 400,
      notification: 600,
    };
    
    oscillator.frequency.value = frequencies[soundType];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };
  
  return {
    triggerVibration,
    playSound,
    vibrationEnabled: vibration,
    soundsEnabled: inAppSounds,
  };
};