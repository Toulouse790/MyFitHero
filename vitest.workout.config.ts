/**
 * CONFIGURATION JEST - Module Workout
 * Configuration spécialisée pour les tests du module workout
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    name: 'workout-module',
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: [
      'src/features/workout/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '**/*.d.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/workout',
      include: [
        'src/features/workout/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/features/workout/**/*.{test,spec}.{ts,tsx}',
        'src/features/workout/**/*.d.ts',
        'src/features/workout/**/index.ts',
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        'src/features/workout/hooks/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'src/features/workout/services/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    globals: true,
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});