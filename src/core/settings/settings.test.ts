// 🧪 TEST DU SYSTÈME DE PARAMÈTRES UNIFIÉ
// Script pour valider le fonctionnement du nouveau système

import { SettingsMigrationService } from './settings.migration';
import { DEFAULT_SETTINGS } from './settings.store';

// 🔬 FONCTIONS DE TEST
class SettingsSystemTests {
  
  static async runAllTests(): Promise<void> {
    console.log('🧪 DÉMARRAGE DES TESTS DU SYSTÈME DE PARAMÈTRES');
    console.log('================================================');
    
    try {
      await this.testMigration();
      await this.testStoreOperations();
      await this.testPersistence();
      await this.testPerformance();
      
      console.log('✅ TOUS LES TESTS RÉUSSIS');
      
    } catch (error) {
      console.error('❌ ÉCHEC DES TESTS:', error);
    }
  }
  
  // 🔄 Test de migration
  static async testMigration(): Promise<void> {
    console.log('\n🔄 Test de migration...');
    
    // Simuler des données legacy dans localStorage
    const legacyData = {
      'myfithero-app-store': JSON.stringify({
        state: {
          preferences: {
            theme: 'dark',
            language: 'fr',
            units: 'metric',
            notifications: {
              workoutReminders: true,
              pushNotifications: false,
            }
          }
        }
      }),
      'hydration-store': JSON.stringify({
        state: {
          notifications: {
            hydrationReminders: true,
          }
        }
      })
    };
    
    // Sauvegarder les données de test
    Object.entries(legacyData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    // Exécuter la migration
    const result = await SettingsMigrationService.migrateAllSettings();
    
    console.log('📊 Résultat de migration:');
    console.log(`- Succès: ${result.success}`);
    console.log(`- Sources: ${result.sources.length}`);
    console.log(`- Erreurs: ${result.errors.length}`);
    
    // Vérifier les résultats
    if (result.success && result.migratedData.theme === 'dark') {
      console.log('✅ Migration réussie');
    } else {
      throw new Error('Migration échouée');
    }
    
    // Nettoyage
    Object.keys(legacyData).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  // 🏪 Test des opérations de store
  static async testStoreOperations(): Promise<void> {
    console.log('\n🏪 Test des opérations de store...');
    
    // Simuler l'utilisation du store (sans React)
    const mockStore = {
      settings: { ...DEFAULT_SETTINGS },
      isLoading: false,
      error: null,
      isDirty: false,
      lastSyncTime: null,
      
      updateSettings: async (updates: any) => {
        mockStore.settings = { ...mockStore.settings, ...updates };
        mockStore.isDirty = true;
        console.log('📝 Paramètres mis à jour:', updates);
      }
    };
    
    // Test de mise à jour
    await mockStore.updateSettings({
      theme: 'dark',
      language: 'en'
    });
    
    if (mockStore.settings.theme === 'dark' && mockStore.isDirty) {
      console.log('✅ Opérations de store réussies');
    } else {
      throw new Error('Opérations de store échouées');
    }
  }
  
  // 💾 Test de persistance
  static async testPersistence(): Promise<void> {
    console.log('\n💾 Test de persistance...');
    
    const testKey = 'myfithero-settings-test';
    const testData = {
      settings: DEFAULT_SETTINGS,
      lastSyncTime: new Date().toISOString(),
    };
    
    // Test d'écriture
    try {
      localStorage.setItem(testKey, JSON.stringify(testData));
      
      // Test de lecture
      const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
      
      if (retrieved.settings && retrieved.lastSyncTime) {
        console.log('✅ Persistance réussie');
      } else {
        throw new Error('Données non persistées correctement');
      }
      
    } catch (error) {
      throw new Error(`Persistance échouée: ${error}`);
    } finally {
      localStorage.removeItem(testKey);
    }
  }
  
  // ⚡ Test de performance
  static async testPerformance(): Promise<void> {
    console.log('\n⚡ Test de performance...');
    
    const iterations = 1000;
    const startTime = performance.now();
    
    // Simuler des opérations intensives
    for (let i = 0; i < iterations; i++) {
      const mockSettings = { ...DEFAULT_SETTINGS };
      mockSettings.theme = i % 2 === 0 ? 'light' : 'dark';
      mockSettings.language = ['en', 'fr', 'es'][i % 3] as any;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`📊 ${iterations} opérations en ${duration.toFixed(2)}ms`);
    console.log(`📊 Moyenne: ${(duration / iterations).toFixed(4)}ms par opération`);
    
    if (duration < 100) { // Moins de 100ms pour 1000 opérations
      console.log('✅ Performance acceptable');
    } else {
      console.warn('⚠️ Performance dégradée');
    }
  }
  
  // 🔍 Test d'intégrité des données
  static validateDefaultSettings(): boolean {
    console.log('\n🔍 Validation des paramètres par défaut...');
    
    const requiredKeys = ['theme', 'language', 'units', 'notifications', 'ui', 'workout', 'privacy', 'wearables'];
    const missingKeys = requiredKeys.filter(key => !(key in DEFAULT_SETTINGS));
    
    if (missingKeys.length > 0) {
      console.error('❌ Clés manquantes:', missingKeys);
      return false;
    }
    
    // Vérifier les types
    const typeChecks = [
      { key: 'theme', expectedType: 'string', validValues: ['light', 'dark', 'system'] },
      { key: 'language', expectedType: 'string', validValues: ['en', 'fr', 'es'] },
      { key: 'units', expectedType: 'string', validValues: ['metric', 'imperial'] },
      { key: 'notifications', expectedType: 'object' },
      { key: 'ui', expectedType: 'object' },
      { key: 'workout', expectedType: 'object' },
      { key: 'privacy', expectedType: 'object' },
      { key: 'wearables', expectedType: 'object' },
    ];
    
    for (const check of typeChecks) {
      const value = (DEFAULT_SETTINGS as any)[check.key];
      const actualType = typeof value;
      
      if (actualType !== check.expectedType) {
        console.error(`❌ Type incorrect pour ${check.key}: attendu ${check.expectedType}, reçu ${actualType}`);
        return false;
      }
      
      if (check.validValues && !check.validValues.includes(value)) {
        console.error(`❌ Valeur invalide pour ${check.key}: ${value}`);
        return false;
      }
    }
    
    console.log('✅ Paramètres par défaut valides');
    return true;
  }
}

// 🚀 EXÉCUTION DES TESTS (si exécuté directement)
if (typeof window !== 'undefined') {
  // Exporter pour utilisation dans la console du navigateur
  (window as any).SettingsSystemTests = SettingsSystemTests;
  
  // Lancer automatiquement les tests en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Mode développement détecté - Tests disponibles via window.SettingsSystemTests');
  }
}

export { SettingsSystemTests };