/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.svg$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@supabase|zustand|@tanstack|lucide-react|jest-axe))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp|avif)$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupAccessibilityTests.ts',
    '<rootDir>/src/setupTests.ts',
  ],
  testMatch: [
    '<rootDir>/src/__tests__/accessibility/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)(a11y|accessibility).(test|spec).(ts|tsx|js)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/setupTests.ts',
    '!src/setupAccessibilityTests.ts',
  ],
  coverageReporters: ['html', 'text', 'text-summary'],
  coverageDirectory: 'coverage/accessibility',
  testTimeout: 15000, // Plus de temps pour les tests d'accessibilité
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Configuration spécifique pour les tests d'accessibilité
  fakeTimers: {
    enableGlobally: true,
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Configuration spéciale pour jest-axe
  testRunner: 'jest-circus/runner',
};