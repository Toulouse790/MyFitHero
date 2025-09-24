// 🔄 SYSTÈME DE MIGRATION DES PARAMÈTRES UTILISATEUR
// Unifie les données provenant de localStorage, Supabase et autres stores Zustand

import React from 'react';
import { supabase } from '@/lib/supabase';
import { UserSettings, DEFAULT_SETTINGS } from '@/core/settings/settings.store';

// 🏷️ TYPES DE SOURCES DE DONNÉES
interface LegacyAppStoreData {
  preferences?: {
    theme?: string;
    language?: string;
    units?: string;
    notifications?: any;
  };
  user?: {
    settings?: any;
  };
}

interface LegacySupabaseSettings {
  notification_settings?: any;
  privacy_settings?: any;
  preferences?: any;
  ui_settings?: any;
  workout_settings?: any;
}

interface MigrationResult {
  success: boolean;
  migratedData: Partial<UserSettings>;
  sources: string[];
  errors: string[];
}

// 🎯 CLASSE PRINCIPALE DE MIGRATION
export class SettingsMigrationService {
  
  /**
   * 🚀 MIGRATION COMPLÈTE
   * Collecte et unifie toutes les sources de paramètres
   */
  static async migrateAllSettings(userId?: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedData: {},
      sources: [],
      errors: []
    };
    
    try {
      // 1️⃣ Migration depuis localStorage (stores Zustand existants)
      await this.migrateFromLocalStorage(result);
      
      // 2️⃣ Migration depuis Supabase
      if (userId) {
        await this.migrateFromSupabase(userId, result);
      }
      
      // 3️⃣ Migration depuis l'ancien appStore
      await this.migrateFromAppStore(result);
      
      // 4️⃣ Fusion avec les paramètres par défaut
      result.migratedData = this.mergeWithDefaults(result.migratedData);
      
      result.success = true;
      
    } catch (error: any) {
      result.errors.push(`Migration failed: ${error}`);
    }
    
    return result;
  }
  
  /**
   * 📱 MIGRATION DEPUIS LOCALSTORAGE
   */
  private static async migrateFromLocalStorage(result: MigrationResult): Promise<void> {
    const sources = [
      'myfithero-app-store',
      'myfithero-auth-store', 
      'myfithero-preferences',
      'myfithero-settings',
      'hydration-store',
      'sleep-store',
      'workout-preferences',
    ];
    
    for (const storeName of sources) {
      try {
        const data = localStorage.getItem(storeName);
        if (!data) continue;
        
        const parsed = JSON.parse(data);
        this.extractSettingsFromStore(parsed, result);
        result.sources.push(`localStorage: ${storeName}`);
        
      } catch (error: any) {
        result.errors.push(`Failed to migrate from ${storeName}: ${error}`);
      }
    }
  }
  
  /**
   * 🗄️ MIGRATION DEPUIS SUPABASE
   */
  private static async migrateFromSupabase(userId: string, result: MigrationResult): Promise<void> {
    try {
      // Récupération des anciens paramètres Supabase
      const { data: legacySettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (legacySettings) {
        this.extractSettingsFromSupabase(legacySettings, result);
        result.sources.push('Supabase: user_settings');
      }
      
      // Récupération des paramètres de confidentialité
      const { data: privacySettings } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (privacySettings) {
        this.extractPrivacySettings(privacySettings, result);
        result.sources.push('Supabase: user_privacy_settings');
      }
      
    } catch (error: any) {
      result.errors.push(`Supabase migration error: ${error}`);
    }
  }
  
  /**
   * 🏪 MIGRATION DEPUIS L'ANCIEN APPSTORE
   */
  private static async migrateFromAppStore(result: MigrationResult): Promise<void> {
    try {
      // Récupération des données du store principal
      const appStoreData = localStorage.getItem('app-store-state');
      if (!appStoreData) return;
      
      const parsed = JSON.parse(appStoreData) as LegacyAppStoreData;
      
      // Migration des préférences
      if (parsed.preferences) {
        if (parsed.preferences.theme) {
          result.migratedData.theme = parsed.preferences.theme as any;
        }
        if (parsed.preferences.language) {
          result.migratedData.language = parsed.preferences.language as any;
        }
        if (parsed.preferences.units) {
          result.migratedData.units = parsed.preferences.units as any;
        }
        if (parsed.preferences.notifications) {
          result.migratedData.notifications = {
            ...DEFAULT_SETTINGS.notifications,
            ...parsed.preferences.notifications
          };
        }
      }
      
      result.sources.push('localStorage: app-store-state');
      
    } catch (error: any) {
      result.errors.push(`AppStore migration error: ${error}`);
    }
  }
  
  /**
   * 🔧 EXTRACTION DEPUIS UN STORE ZUSTAND
   */
  private static extractSettingsFromStore(storeData: any, result: MigrationResult): void {
    const { state } = storeData;
    if (!state) return;
    
    // Extraction des notifications
    if (state.notifications || state.notificationSettings) {
      const notifications = state.notifications || state.notificationSettings;
      result.migratedData.notifications = {
        ...DEFAULT_SETTINGS.notifications,
        ...notifications
      };
    }
    
    // Extraction des préférences UI
    if (state.preferences) {
      const prefs = state.preferences;
      result.migratedData.ui = {
        ...DEFAULT_SETTINGS.ui,
        compactMode: prefs.compactMode,
        highContrast: prefs.highContrast,
        reducedMotion: prefs.reducedMotion,
        showAdvancedStats: prefs.showAdvancedStats,
        autoStartWorkouts: prefs.autoStartWorkouts,
        showTips: prefs.showTips,
      };
    }
    
    // Extraction des paramètres d'entraînement
    if (state.workoutSettings || state.workout) {
      const workout = state.workoutSettings || state.workout;
      result.migratedData.workout = {
        ...DEFAULT_SETTINGS.workout,
        defaultRestTime: workout.defaultRestTime || workout.restTime,
        autoProgressSets: workout.autoProgressSets,
        showRPE: workout.showRPE,
        showTempo: workout.showTempo,
        motivationalQuotes: workout.motivationalQuotes,
        warmupReminders: workout.warmupReminders,
      };
    }
    
    // Extraction des paramètres de confidentialité
    if (state.privacy || state.privacySettings) {
      const privacy = state.privacy || state.privacySettings;
      result.migratedData.privacy = {
        ...DEFAULT_SETTINGS.privacy,
        ...privacy
      };
    }
    
    // Extraction des paramètres wearables
    if (state.wearables || state.wearableSettings) {
      const wearables = state.wearables || state.wearableSettings;
      result.migratedData.wearables = {
        ...DEFAULT_SETTINGS.wearables,
        autoSync: wearables.autoSync,
        syncInterval: wearables.syncInterval,
        preferredDevice: wearables.preferredDevice,
        backgroundSync: wearables.backgroundSync,
      };
    }
  }
  
  /**
   * 🗄️ EXTRACTION DEPUIS SUPABASE
   */
  private static extractSettingsFromSupabase(data: LegacySupabaseSettings, result: MigrationResult): void {
    // Notifications
    if (data.notification_settings) {
      result.migratedData.notifications = {
        ...DEFAULT_SETTINGS.notifications,
        ...data.notification_settings
      };
    }
    
    // Confidentialité
    if (data.privacy_settings) {
      result.migratedData.privacy = {
        ...DEFAULT_SETTINGS.privacy,
        ...data.privacy_settings
      };
    }
    
    // Préférences générales
    if (data.preferences) {
      const prefs = data.preferences;
      if (prefs.theme) result.migratedData.theme = prefs.theme;
      if (prefs.language) result.migratedData.language = prefs.language;
      if (prefs.units) result.migratedData.units = prefs.units;
    }
    
    // Interface utilisateur
    if (data.ui_settings) {
      result.migratedData.ui = {
        ...DEFAULT_SETTINGS.ui,
        ...data.ui_settings
      };
    }
    
    // Entraînement
    if (data.workout_settings) {
      result.migratedData.workout = {
        ...DEFAULT_SETTINGS.workout,
        ...data.workout_settings
      };
    }
  }
  
  /**
   * 🔒 EXTRACTION DES PARAMÈTRES DE CONFIDENTIALITÉ
   */
  private static extractPrivacySettings(data: any, result: MigrationResult): void {
    result.migratedData.privacy = {
      ...DEFAULT_SETTINGS.privacy,
      shareWorkouts: data.share_workouts ?? DEFAULT_SETTINGS.privacy.shareWorkouts,
      shareNutrition: data.share_nutrition ?? DEFAULT_SETTINGS.privacy.shareNutrition,
      allowFriendRequests: data.allow_friend_requests ?? DEFAULT_SETTINGS.privacy.allowFriendRequests,
      showInLeaderboards: data.show_in_leaderboards ?? DEFAULT_SETTINGS.privacy.showInLeaderboards,
      dataCollection: data.data_collection ?? DEFAULT_SETTINGS.privacy.dataCollection,
      marketingEmails: data.marketing_emails ?? DEFAULT_SETTINGS.privacy.marketingEmails,
    };
  }
  
  /**
   * 🔄 FUSION AVEC LES PARAMÈTRES PAR DÉFAUT
   */
  private static mergeWithDefaults(migratedData: Partial<UserSettings>): UserSettings {
    return {
      theme: migratedData.theme ?? DEFAULT_SETTINGS.theme,
      language: migratedData.language ?? DEFAULT_SETTINGS.language,
      units: migratedData.units ?? DEFAULT_SETTINGS.units,
      
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...migratedData.notifications
      },
      
      ui: {
        ...DEFAULT_SETTINGS.ui,
        ...migratedData.ui
      },
      
      workout: {
        ...DEFAULT_SETTINGS.workout,
        ...migratedData.workout
      },
      
      privacy: {
        ...DEFAULT_SETTINGS.privacy,
        ...migratedData.privacy
      },
      
      wearables: {
        ...DEFAULT_SETTINGS.wearables,
        ...migratedData.wearables
      },
    };
  }
  
  /**
   * 🧹 NETTOYAGE DES ANCIENNES DONNÉES
   */
  static async cleanupLegacyData(): Promise<void> {
    const legacyKeys = [
      'myfithero-app-store',
      'myfithero-auth-store',
      'myfithero-preferences',
      'myfithero-settings',
      'app-store-state',
      'hydration-store',
      'sleep-store',
      'workout-preferences',
    ];
    
    // Nettoyage localStorage
    legacyKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error: any) {
        console.warn(`Failed to remove ${key}:`, error);
      }
    });
  }
  
  /**
   * 📊 RAPPORT DE MIGRATION
   */
  static generateMigrationReport(result: MigrationResult): string {
    let report = '📊 MIGRATION REPORT\n';
    report += `✅ Success: ${result.success}\n`;
    report += `📁 Sources: ${result.sources.length}\n`;
    result.sources.forEach(source => {
      report += `  - ${source}\n`;
    });
    
    if (result.errors.length > 0) {
      report += `❌ Errors: ${result.errors.length}\n`;
      result.errors.forEach(error => {
        report += `  - ${error}\n`;
      });
    }
    
    report += `🔧 Migrated Settings:\n`;
    Object.keys(result.migratedData).forEach(key => {
      report += `  - ${key}\n`;
    });
    
    return report;
  }
}

// 🎯 HOOK POUR LA MIGRATION AUTOMATIQUE
export const useSettingsMigration = () => {
  const [migrationStatus, setMigrationStatus] = React.useState<{
    isRunning: boolean;
    completed: boolean;
    result?: MigrationResult;
  }>({
    isRunning: false,
    completed: false,
  });
  
  const runMigration = async (userId?: string) => {
    setMigrationStatus({ isRunning: true, completed: false });
    
    try {
      const result = await SettingsMigrationService.migrateAllSettings(userId);
      
      setMigrationStatus({
        isRunning: false,
        completed: true,
        result
      });
      
      return result;
      
    } catch (error: any) {
      setMigrationStatus({
        isRunning: false,
        completed: false,
        result: {
          success: false,
          migratedData: {},
          sources: [],
          errors: [`Migration failed: ${error}`]
        }
      });
      
      throw error;
    }
  };
  
  return {
    migrationStatus,
    runMigration,
  };
};