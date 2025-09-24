/**
 * TEARDOWN GLOBAL PLAYWRIGHT
 * Nettoyage après tous les tests E2E
 */

import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Nettoyage global Playwright - MyFit Hero E2E');
  
  try {
    // Nettoyage des fichiers d'état d'authentification
    const authStatePath = 'test-results/auth-state.json';
    if (fs.existsSync(authStatePath)) {
      fs.unlinkSync(authStatePath);
      console.log('🗑️ État d\'authentification supprimé');
    }
    
    // Nettoyage des données de test via API si nécessaire
    console.log('🧽 Nettoyage des données de test...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Nettoyage via localStorage ou API
    await page.evaluate(() => {
      localStorage.removeItem('e2e-test-mode');
      localStorage.removeItem('test-user-id');
      localStorage.clear();
    });
    
    await browser.close();
    
    // Nettoyage des fichiers temporaires
    const tempFiles = [
      'test-results/temp',
      'screenshots/temp',
      'videos/temp'
    ];
    
    tempFiles.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
    
    console.log('✅ Teardown global terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur durant le teardown global:', error);
    // Ne pas faire échouer le processus pour les erreurs de nettoyage
  }
}

export default globalTeardown;