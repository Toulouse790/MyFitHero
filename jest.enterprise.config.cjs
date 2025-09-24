/**
 * CONFIGURATION JEST ENTERPRISE - COVERAGE 85%+ OBLIGATOIRE
 * Configuration avancée pour tests de niveau production
 */

module.exports = {
  // Configuration de base
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/src/setupAccessibilityTests.ts'
  ],
  
  // Modules et chemins
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': 'jest-transform-stub',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
  },

  // Patterns de fichiers de test
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],

  // Fichiers à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.next/'
  ],

  // Couverture de code - OBLIGATOIRE 85%+
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
    'cobertura' // Pour CI/CD
  ],

  // Seuils de couverture CRITIQUES - Échec si non atteints
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Seuils spécifiques par module critique
    './src/features/ai-coach/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/features/auth/': {
      branches: 88,
      functions: 88,
      lines: 88,
      statements: 88,
    },
    './src/core/security/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/core/api/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    }
  },

  // Fichiers à inclure dans la couverture
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/test/**',
    '!src/main.tsx',
    '!src/App.tsx', // Composant principal, testé via E2E
    '!src/lib/utils.ts', // Utilitaires simples
    '!src/**/types/**', // Définitions de types
    '!src/**/*.config.{ts,js}',
  ],

  // Transformers
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Variables d'environnement pour les tests
  setupFiles: ['<rootDir>/jest.env.js'],

  // Timeout et performance
  testTimeout: 30000, // 30 secondes pour tests complexes
  maxWorkers: '50%', // Utiliser 50% des CPUs disponibles
  
  // Reporting avancé
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/html-report',
      filename: 'report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'MyFitHero Test Report',
      logoImgPath: './public/icon-192.svg'
    }],
    ['jest-junit', {
      outputDirectory: './coverage',
      outputName: 'junit.xml',
      ancestorSeparator: ' › ',
      uniqueOutputName: 'false',
      suiteNameTemplate: '{filepath}',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }]
  ],

  // Configuration avancée
  verbose: true,
  detectOpenHandles: true,
  detectLeaks: true,
  forceExit: true,
  clearMocks: true,
  restoreMocks: true,

  // Patterns globaux - temporairement désactivés pour éviter les erreurs
  // globalSetup: '<rootDir>/jest.global-setup.js',
  // globalTeardown: '<rootDir>/jest.global-teardown.js',

  // Extensions et plugins
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Configuration pour tests parallèles
  maxConcurrency: 5,
  
  // Gestion des erreurs
  errorOnDeprecated: true,
  
  // Cache pour performance
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // Ignore patterns pour node_modules spécifiques
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@radix-ui|@supabase|framer-motion))'
  ],

  // Configuration pour tests de snapshot
  snapshotSerializers: [
    'jest-serializer-html'
  ],

  // Hooks de test
  testResultsProcessor: '<rootDir>/jest.results-processor.js'
};