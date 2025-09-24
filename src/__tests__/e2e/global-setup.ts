/**
 * SETUP GLOBAL PLAYWRIGHT
 * Configuration d'environnement avant tous les tests E2E
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🎭 Configuration globale Playwright - MyFit Hero E2E');
  
  const { baseURL } = config.projects[0].use;
  
  // Démarrer un navigateur pour le setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🔧 Configuration de l\'environnement de test...');
    
    // Navigation vers l'application
    await page.goto(baseURL!);
    
    // Attendre que l'application soit chargée
    await page.waitForSelector('[data-testid="app-loaded"]', { 
      timeout: 30000 
    }).catch(() => {
      console.log('⚠️ Selector app-loaded non trouvé, continuons...');
    });
    
    // Configuration de l'état d'authentification pour les tests
    console.log('🔐 Configuration de l\'authentification de test...');
    
    // Naviguer vers la page de connexion
    await page.goto(`${baseURL}/login`);
    
    // Se connecter avec un utilisateur de test
    await page.fill('[data-testid="email-input"]', 'test@myfithero.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.click('[data-testid="login-button"]');
    
    // Attendre la redirection après connexion
    await page.waitForURL(/dashboard|profile|home/, { timeout: 15000 });
    
    // Sauvegarder l'état d'authentification
    await page.context().storageState({ 
      path: 'test-results/auth-state.json' 
    });
    
    console.log('✅ État d\'authentification sauvegardé');
    
    // Initialisation des données de test si nécessaire
    console.log('📊 Initialisation des données de test...');
    
    // Injection de données de test via localStorage ou API
    await page.evaluate(() => {
      localStorage.setItem('e2e-test-mode', 'true');
      localStorage.setItem('test-user-id', 'test-user-123');
    });
    
    console.log('✅ Setup global terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur durant le setup global:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;