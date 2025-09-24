/**
 * CONFIGURATION PLAYWRIGHT - TESTS E2E ENTERPRISE
 * Configuration avancée pour tests end-to-end de niveau production
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration pour CI/CD
 */
export default defineConfig({
  // Répertoire des tests E2E
  testDir: './src/__tests__/e2e',
  
  // Répertoire des fichiers de test
  testMatch: '**/*.spec.ts',
  
  // Configuration des timeouts
  timeout: 45000, // 45 secondes par test
  expect: {
    timeout: 10000 // 10 secondes pour les assertions
  },
  
  // Configuration globale
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporters
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure' 
    }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ...(process.env.CI ? [['github']] : [['list']])
  ],
  
  // Configuration globale des tests
  use: {
    // URL de base pour les tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    
    // Configuration du navigateur
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    
    // Actions et timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Captures d'écran
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Configuration des permissions
    permissions: ['geolocation', 'notifications'],
    
    // User Agent
    userAgent: 'MyFitHero-E2E-Tests/1.0.0',
    
    // Configuration du cache
    storageState: undefined // Pas de session persistante par défaut
  },

  // Configuration des projets (navigateurs)
  projects: [
    // Setup projet pour l'authentification
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup'
    },
    
    // Cleanup projet
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/,
    },

    // Desktop - Chrome
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'test-results/auth-state.json'
      },
      dependencies: ['setup'],
    },

    // Desktop - Firefox
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'test-results/auth-state.json'
      },
      dependencies: ['setup'],
    },

    // Desktop - Safari
    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'test-results/auth-state.json'
      },
      dependencies: ['setup'],
    },

    // Mobile - Chrome
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: 'test-results/auth-state.json'
      },
      dependencies: ['setup'],
    },

    // Mobile - Safari
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        storageState: 'test-results/auth-state.json'
      },
      dependencies: ['setup'],
    },

    // Tests API uniquement
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001'
      }
    }
  ],

  // Configuration du serveur de développement
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 5173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      VITE_E2E_MODE: 'true'
    }
  },

  // Configuration des captures
  outputDir: 'test-results/',
  
  // Configuration globale des fixtures
  globalSetup: require.resolve('./src/__tests__/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./src/__tests__/e2e/global-teardown.ts'),
});