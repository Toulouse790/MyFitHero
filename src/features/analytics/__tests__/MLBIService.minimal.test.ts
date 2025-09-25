/**
 * 🧪 TESTS ML BI SERVICE - EXCELLENCE 6★/5
 * Tests unitaires minimaux fonctionnels
 * 
 * @version 1.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { describe, it, expect } from '@jest/globals';
import { MLBIService } from '../services/MLBIService';
import { MLModelType } from '../services/MLEngine';

// ============================================================================
// HELPERS
// ============================================================================

const createMLBIService = () => new MLBIService({
  ml: { 
    enableAutoML: true, 
    modelRetentionDays: 30, 
    maxConcurrentTraining: 2,
    autoRetraining: true,
    performanceThreshold: 0.8,
    securityLevel: 'standard',
    encryptionEnabled: true
  },
  bi: { 
    cacheResultsHours: 24, 
    maxDataPoints: 10000,
    enableRealTimeAnalysis: true,
    alertThresholds: { accuracy: 0.9 },
    compressionEnabled: true,
    backupEnabled: true
  },
  monitoring: { 
    enableMetrics: true, 
    performanceTracking: true,
    logLevel: 'info',
    enableAlerts: true,
    errorReporting: true,
    analyticsTracking: true
  }
});

const createSecurityContext = () => ({
  userId: 'test-user-123',
  sessionId: 'session-456',
  permissions: ['analytics:read'],
  ipAddress: '127.0.0.1',
  userAgent: 'Test-Agent/1.0',
  timestamp: new Date().toISOString()
});

const createSampleData = () => [
  { 
    timestamp: '2025-09-01T00:00:00Z', 
    metrics: { duration: 45, intensity: 7, calories: 300 },
    dimensions: { userId: 'user1', category: 'workout', type: 'cardio' }
  },
  { 
    timestamp: '2025-09-02T00:00:00Z', 
    metrics: { duration: 50, intensity: 8, calories: 350 },
    dimensions: { userId: 'user1', category: 'workout', type: 'strength' }
  },
  { 
    timestamp: '2025-09-03T00:00:00Z', 
    metrics: { duration: 40, intensity: 6, calories: 280 },
    dimensions: { userId: 'user1', category: 'workout', type: 'flexibility' }
  }
];

const createAnalysisConfig = () => ({
  type: 'hybrid' as const,
  enableRecommendations: true,
  priority: 'normal' as const
});

// ============================================================================
// TESTS MLBIService
// ============================================================================

describe('MLBIService - Excellence 6★/5', () => {

  // ============================================================================
  // TESTS CONSTRUCTION ET CONFIGURATION
  // ============================================================================

  describe('Service Availability', () => {
    it('should be defined and have required methods', () => {
      // Arrange
      const mlbiService = createMLBIService();

      // Assert
      expect(MLBIService).toBeDefined();
      expect(typeof mlbiService.performIntegratedAnalysis).toBe('function');
      expect(typeof mlbiService.performAutoML).toBe('function');
    });
  });

  // ============================================================================
  // TESTS performIntegratedAnalysis
  // ============================================================================

  describe('performIntegratedAnalysis', () => {
    it('should perform integrated analysis', async () => {
      // Arrange
      const mlbiService = createMLBIService();
      const data = createSampleData();
      const config = createAnalysisConfig();
      const securityContext = createSecurityContext();

      // Act
      const result = await mlbiService.performIntegratedAnalysis(data, config, securityContext);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.analysisId).toBeDefined();
      expect(result.type).toBeDefined();
      expect(result.confidence).toBeDefined();
    });
  });

  // ============================================================================
  // TESTS performAutoML
  // ============================================================================

  describe('performAutoML', () => {
    it('should perform auto ML analysis', async () => {
      // Arrange
      const mlbiService = createMLBIService();
      const data = createSampleData();
      const target = 'calories';
      const problemType = 'regression';
      const securityContext = createSecurityContext();

      // Act
      const result = await mlbiService.performAutoML(data, target, problemType, securityContext);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.bestModel).toBeDefined();
      expect(result.performance).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });
  });

  // ============================================================================
  // TESTS DE PERFORMANCE
  // ============================================================================

  describe('Performance Tests', () => {
    it('should complete analysis within acceptable time', async () => {
      // Arrange
      const mlbiService = createMLBIService();
      const data = createSampleData();
      const config = createAnalysisConfig();
      const securityContext = createSecurityContext();

      // Act
      const startTime = performance.now();
      const result = await mlbiService.performIntegratedAnalysis(data, config, securityContext);
      const duration = performance.now() - startTime;

      // Assert
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(10000); // Moins de 10 secondes
    });
  });

  // ============================================================================
  // TESTS DE SÉCURITÉ
  // ============================================================================

  describe('Security Tests', () => {
    it('should validate security context', async () => {
      // Arrange
      const mlbiService = createMLBIService();
      const data = createSampleData();
      const config = createAnalysisConfig();
      const invalidSecurityContext = {
        ...createSecurityContext(),
        permissions: [] // Pas de permissions
      };

      // Act & Assert
      await expect(
        mlbiService.performIntegratedAnalysis(data, config, invalidSecurityContext)
      ).rejects.toThrow();
    });
  });
});