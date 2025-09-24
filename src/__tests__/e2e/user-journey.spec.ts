/**
 * TESTS E2E CRITIQUES - PARCOURS UTILISATEUR COMPLET
 * Tests End-to-End avec Playwright pour MyFitHero
 */

import { test, expect, Page } from '@playwright/test';

// Configuration pour tous les tests E2E
test.beforeEach(async ({ page }) => {
  // Configuration initiale pour chaque test
  await page.goto('/');
});

test.describe('🚀 PARCOURS UTILISATEUR COMPLET - E2E TESTS', () => {
  test.describe('Authentification et Onboarding', () => {
    test('utilisateur peut s\'inscrire et compléter l\'onboarding conversationnel', async ({ page }) => {
      // ÉTAPE 1: Page d'accueil
      await expect(page.locator('h1')).toContainText('MyFitHero');
      await page.click('button:has-text("Commencer")');

      // ÉTAPE 2: Inscription
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'SecurePass123!');
      await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
      await page.click('button[type="submit"]');

      // ÉTAPE 3: Vérification redirection vers onboarding
      await expect(page).toHaveURL(/.*onboarding/);
      await expect(page.locator('[data-testid="conversational-onboarding"]')).toBeVisible();

      // ÉTAPE 4: Onboarding conversationnel - Interaction IA
      await expect(page.locator('.ai-message')).toContainText('Bonjour');
      
      // Répondre aux questions de l'IA
      await page.fill('input[placeholder*="Tapez votre réponse"]', 'Je veux gagner en force et perdre du poids');
      await page.press('input[placeholder*="Tapez votre réponse"]', 'Enter');

      // Attendre réponse IA
      await expect(page.locator('.ai-message').last()).toBeVisible();
      
      // Continuer le parcours conversationnel
      await page.fill('input[placeholder*="Tapez votre réponse"]', 'Intermédiaire');
      await page.press('input[placeholder*="Tapez votre réponse"]', 'Enter');

      await page.fill('input[placeholder*="Tapez votre réponse"]', '4 fois par semaine');
      await page.press('input[placeholder*="Tapez votre réponse"]', 'Enter');

      // ÉTAPE 5: Finalisation onboarding
      await page.click('button:has-text("Terminer")');
      
      // ÉTAPE 6: Vérification redirection vers dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="dashboard-welcome"]')).toBeVisible();
    });

    test('utilisateur existant peut se connecter', async ({ page }) => {
      await page.click('button:has-text("Se connecter")');
      
      await page.fill('input[name="email"]', 'existing@example.com');
      await page.fill('input[name="password"]', 'ExistingPass123!');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });
  });

  test.describe('Fonctionnalités Core - Modules Principaux', () => {
    test.beforeEach(async ({ page }) => {
      // Se connecter en tant qu'utilisateur test
      await loginAsTestUser(page);
    });

    test('parcours workout complet - de la sélection à la complétion', async ({ page }) => {
      // ÉTAPE 1: Navigation vers workouts
      await page.click('[data-testid="nav-workout"]');
      await expect(page).toHaveURL(/.*workout/);

      // ÉTAPE 2: Sélection d'un workout
      await expect(page.locator('[data-testid="workout-card"]').first()).toBeVisible();
      await page.click('[data-testid="workout-card"]', { first: true });

      // ÉTAPE 3: Démarrage de la session
      await expect(page.locator('[data-testid="workout-details"]')).toBeVisible();
      await page.click('button:has-text("Commencer l\'entraînement")');

      // ÉTAPE 4: Session active - Compléter des exercices
      await expect(page.locator('[data-testid="active-session"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-timer"]')).toBeVisible();

      // Compléter le premier exercice
      await page.click('[data-testid="complete-set-0"]');
      await expect(page.locator('[data-testid="set-completed-0"]')).toBeVisible();

      // Ajouter poids et reps
      await page.fill('[data-testid="weight-input-0"]', '80');
      await page.fill('[data-testid="reps-input-0"]', '10');
      await page.click('[data-testid="log-set-0"]');

      // ÉTAPE 5: Finir la session
      await page.click('button:has-text("Terminer l\'entraînement")');
      
      // ÉTAPE 6: Résumé de session
      await expect(page.locator('[data-testid="session-summary"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-volume"]')).toContainText('800'); // 80kg x 10 reps
      await expect(page.locator('[data-testid="session-duration"]')).toBeVisible();

      // ÉTAPE 7: Sauvegarde et retour dashboard
      await page.click('button:has-text("Sauvegarder")');
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="recent-workout"]')).toBeVisible();
    });

    test('parcours nutrition - logging et suivi quotidien', async ({ page }) => {
      // Navigation vers nutrition
      await page.click('[data-testid="nav-nutrition"]');
      await expect(page).toHaveURL(/.*nutrition/);

      // Ajouter un repas
      await page.click('button:has-text("Ajouter un repas")');
      
      // Rechercher un aliment
      await page.fill('[data-testid="food-search"]', 'Poulet grillé');
      await page.press('[data-testid="food-search"]', 'Enter');
      
      // Sélectionner le premier résultat
      await expect(page.locator('[data-testid="food-result"]').first()).toBeVisible();
      await page.click('[data-testid="food-result"]', { first: true });

      // Ajuster la quantité
      await page.fill('[data-testid="quantity-input"]', '150');
      await page.selectOption('[data-testid="unit-select"]', 'g');

      // Sélectionner type de repas
      await page.selectOption('[data-testid="meal-type-select"]', 'lunch');

      // Confirmer l'ajout
      await page.click('button:has-text("Ajouter")');

      // Vérifier l'ajout dans le dashboard nutrition
      await expect(page.locator('[data-testid="nutrition-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="calories-consumed"]')).toContainText('248'); // Calories du poulet
      await expect(page.locator('[data-testid="protein-consumed"]')).toContainText('46.2');
    });

    test('parcours sleep - enregistrement et analyse', async ({ page }) => {
      // Navigation vers sleep
      await page.click('[data-testid="nav-sleep"]');
      await expect(page).toHaveURL(/.*sleep/);

      // Enregistrer les données de sommeil d'hier
      await page.click('button:has-text("Enregistrer le sommeil")');

      // Remplir les informations
      await page.fill('[data-testid="bedtime-input"]', '22:30');
      await page.fill('[data-testid="waketime-input"]', '06:30');
      
      // Évaluer la qualité (1-10)
      await page.click('[data-testid="quality-rating-8"]');

      // Facteurs additionnels
      await page.check('[data-testid="factor-caffeine"]');
      await page.fill('[data-testid="caffeine-hours"]', '8');
      
      await page.click('button:has-text("Enregistrer")');

      // Vérifier l'analyse
      await expect(page.locator('[data-testid="sleep-score"]')).toBeVisible();
      await expect(page.locator('[data-testid="sleep-efficiency"]')).toContainText('90%');
      await expect(page.locator('[data-testid="recommendations"]')).toBeVisible();
    });

    test('AI Coach - orchestrateur santé globale', async ({ page }) => {
      // Navigation vers AI Coach
      await page.click('[data-testid="nav-ai-coach"]');
      await expect(page).toHaveURL(/.*ai-coach/);

      // Vérifier le dashboard de santé global
      await expect(page.locator('[data-testid="health-orchestrator"]')).toBeVisible();
      await expect(page.locator('[data-testid="global-health-score"]')).toBeVisible();

      // Vérifier les piliers de santé
      await expect(page.locator('[data-testid="fitness-pillar"]')).toBeVisible();
      await expect(page.locator('[data-testid="nutrition-pillar"]')).toBeVisible();
      await expect(page.locator('[data-testid="sleep-pillar"]')).toBeVisible();
      await expect(page.locator('[data-testid="recovery-pillar"]')).toBeVisible();

      // Interagir avec les recommandations IA
      await expect(page.locator('[data-testid="ai-recommendations"]')).toBeVisible();
      
      // Accepter une recommandation
      await page.click('[data-testid="accept-recommendation-0"]');
      await expect(page.locator('[data-testid="recommendation-accepted"]')).toBeVisible();

      // Vérifier mise à jour du score global
      await expect(page.locator('[data-testid="score-update-animation"]')).toBeVisible();
    });
  });

  test.describe('Fonctionnalités Avancées', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsTestUser(page, 'premium');
    });

    test('analytics avancées et insights personnalisés', async ({ page }) => {
      await page.click('[data-testid="nav-analytics"]');
      
      // Vérifier les graphiques avancés
      await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="progress-trends"]')).toBeVisible();
      await expect(page.locator('[data-testid="predictive-insights"]')).toBeVisible();

      // Interagir avec les filtres
      await page.selectOption('[data-testid="time-range-select"]', '30days');
      await page.check('[data-testid="metric-strength"]');
      await page.check('[data-testid="metric-endurance"]');

      // Vérifier mise à jour des données
      await expect(page.locator('[data-testid="chart-loading"]')).toBeHidden();
      await expect(page.locator('[data-testid="strength-trend"]')).toBeVisible();
    });

    test('social et challenges communautaires', async ({ page }) => {
      await page.click('[data-testid="nav-social"]');
      
      // Participer à un challenge
      await page.click('[data-testid="join-challenge"]', { first: true });
      await expect(page.locator('[data-testid="challenge-joined"]')).toBeVisible();

      // Voir le classement
      await page.click('[data-testid="view-leaderboard"]');
      await expect(page.locator('[data-testid="leaderboard-table"]')).toBeVisible();

      // Partager une performance
      await page.click('[data-testid="share-achievement"]');
      await page.fill('[data-testid="share-message"]', 'Nouveau PR au bench press! 💪');
      await page.click('button:has-text("Partager")');
      
      await expect(page.locator('[data-testid="share-success"]')).toBeVisible();
    });

    test('intégration wearables et synchronisation temps réel', async ({ page }) => {
      await page.click('[data-testid="nav-wearables"]');
      
      // Connecter un wearable (simulation)
      await page.click('button:has-text("Connecter une montre")');
      await page.click('[data-testid="connect-apple-watch"]');
      
      // Simuler autorisation
      await page.click('button:has-text("Autoriser")');
      await expect(page.locator('[data-testid="wearable-connected"]')).toBeVisible();

      // Vérifier synchronisation des données
      await expect(page.locator('[data-testid="heart-rate-data"]')).toBeVisible();
      await expect(page.locator('[data-testid="steps-data"]')).toBeVisible();
      await expect(page.locator('[data-testid="calories-data"]')).toBeVisible();

      // Test de synchronisation temps réel
      await page.click('button:has-text("Synchroniser maintenant")');
      await expect(page.locator('[data-testid="sync-in-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Gestion des Erreurs et Cas Limites', () => {
    test('gestion réseau offline et synchronisation', async ({ page }) => {
      await loginAsTestUser(page);
      
      // Simuler perte de connexion
      await page.context().setOffline(true);
      
      // Tenter d'ajouter un workout offline
      await page.click('[data-testid="nav-workout"]');
      await page.click('button:has-text("Commencer l\'entraînement")');
      
      // Vérifier mode offline
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="offline-message"]')).toContainText('Mode hors ligne actif');

      // Effectuer des actions offline
      await page.click('[data-testid="complete-set-0"]');
      await expect(page.locator('[data-testid="pending-sync"]')).toBeVisible();

      // Restaurer connexion
      await page.context().setOffline(false);
      
      // Vérifier synchronisation automatique
      await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeHidden();
    });

    test('gestion des erreurs serveur et fallbacks', async ({ page }) => {
      // Simuler erreur serveur 500
      await page.route('**/api/**', route => route.fulfill({ status: 500 }));
      
      await loginAsTestUser(page);
      await page.click('[data-testid="nav-nutrition"]');
      
      // Vérifier affichage de l'erreur et fallback
      await expect(page.locator('[data-testid="error-fallback"]')).toBeVisible();
      await expect(page.locator('[data-testid="offline-data"]')).toBeVisible();
      
      // Bouton retry
      await page.click('button:has-text("Réessayer")');
      await expect(page.locator('[data-testid="retry-loading"]')).toBeVisible();
    });

    test('validation des limites utilisateur (tier gratuit)', async ({ page }) => {
      await loginAsTestUser(page, 'free');
      
      // Tenter d'accéder aux analytics premium
      await page.click('[data-testid="nav-analytics"]');
      
      // Vérifier restriction et upselling
      await expect(page.locator('[data-testid="premium-required"]')).toBeVisible();
      await expect(page.locator('[data-testid="upgrade-cta"]')).toBeVisible();
      
      // Tenter de commencer un 4ème workout cette semaine (limite gratuite: 3)
      await page.click('[data-testid="nav-workout"]');
      await page.click('button:has-text("Commencer l\'entraînement")');
      
      await expect(page.locator('[data-testid="workout-limit-reached"]')).toBeVisible();
      await expect(page.locator('button:has-text("Passer à Pro")')).toBeVisible();
    });
  });

  test.describe('Performance et UX', () => {
    test('temps de chargement et métriques Web Vitals', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // < 3 secondes

      // Vérifier que les éléments critiques sont chargés
      await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
      await expect(page.locator('[data-testid="navigation-menu"]')).toBeVisible();
    });

    test('responsive design - mobile et desktop', async ({ page }) => {
      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await loginAsTestUser(page);
      
      // Vérifier menu mobile
      await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
      await page.click('[data-testid="mobile-menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

      // Test desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeHidden();
    });

    test('accessibilité - navigation clavier et lecteur d\'écran', async ({ page }) => {
      await loginAsTestUser(page);
      
      // Navigation au clavier
      await page.press('body', 'Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      // Tester navigation dans les workouts
      await page.press('body', 'Tab'); // Navigation item
      await page.press(':focus', 'Enter');
      
      // Vérifier focus management
      await expect(page.locator('[data-testid="workout-grid"] :focus')).toBeVisible();
      
      // Vérifier les aria-labels
      const workoutCards = page.locator('[data-testid="workout-card"]');
      for (let i = 0; i < await workoutCards.count(); i++) {
        await expect(workoutCards.nth(i)).toHaveAttribute('aria-label');
      }
    });
  });
});

// Fonctions utilitaires pour les tests E2E
async function loginAsTestUser(page: Page, tier: 'free' | 'pro' | 'premium' = 'pro') {
  const credentials = {
    free: { email: 'free@test.com', password: 'FreeUser123!' },
    pro: { email: 'pro@test.com', password: 'ProUser123!' },
    premium: { email: 'premium@test.com', password: 'PremiumUser123!' }
  };

  await page.goto('/login');
  await page.fill('input[name="email"]', credentials[tier].email);
  await page.fill('input[name="password"]', credentials[tier].password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/);
}

// Configuration hooks pour performance monitoring
test.afterEach(async ({ page }, testInfo) => {
  // Capturer les métriques de performance
  const perfTiming = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
  
  if (testInfo.status === 'failed') {
    // Capturer screenshot en cas d'échec
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    
    // Capturer les logs console
    const logs = await page.evaluate(() => 
      (window as any).__consoleLogs__ || []
    );
    await testInfo.attach('console-logs', { 
      body: JSON.stringify(logs, null, 2), 
      contentType: 'application/json' 
    });
  }
  
  // Attacher métriques performance
  await testInfo.attach('performance-metrics', {
    body: JSON.stringify({
      loadTime: perfTiming.loadEventEnd - perfTiming.navigationStart,
      domContentLoaded: perfTiming.domContentLoadedEventEnd - perfTiming.navigationStart,
      firstPaint: perfTiming.loadEventStart - perfTiming.navigationStart
    }, null, 2),
    contentType: 'application/json'
  });
});