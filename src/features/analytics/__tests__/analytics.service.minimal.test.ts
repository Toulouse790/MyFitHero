/**
 * 🧪 TESTS ANALYTICS SERVICE - EXCELLENCE 6★/5
 * Tests unitaires minimaux fonctionnels
 * 
 * @version 1.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { describe, it, expect } from '@jest/globals';
import { AnalyticsService } from '../services/analytics.service';

// ============================================================================
// TYPES & HELPERS
// ============================================================================

const createBasicConfig = () => ({
  userId: 'test-user-123',
  period: {
    start: '2025-09-01T00:00:00Z',
    end: '2025-09-30T23:59:59Z',
    granularity: 'day' as const
  },
  metrics: ['workouts', 'progress', 'achievements'],
  dimensions: ['time', 'category']
});

const createSecurityContext = (userId: string) => ({
  userId,
  sessionId: 'session-456',
  permissions: ['analytics:read'],
  ipAddress: '127.0.0.1',
  userAgent: 'Test-Agent/1.0',
  timestamp: new Date().toISOString()
});

const createExportOptions = () => ({
  userId: 'test-user-123',
  format: 'json' as const,
  period: {
    start: '2025-09-01T00:00:00Z',
    end: '2025-09-30T23:59:59Z',
    granularity: 'day' as const
  }
});

// ============================================================================
// TESTS AnalyticsService
// ============================================================================

describe('AnalyticsService - Excellence 6★/5', () => {

  // ============================================================================
  // TESTS CONSTRUCTION ET CONFIGURATION
  // ============================================================================

  describe('Service Availability', () => {
    it('should be defined and have required methods', () => {
      // Assert
      expect(AnalyticsService).toBeDefined();
      expect(typeof AnalyticsService.getUserAnalytics).toBe('function');
      expect(typeof AnalyticsService.getProgressReport).toBe('function');
      expect(typeof AnalyticsService.getComparativeAnalysis).toBe('function');
      expect(typeof AnalyticsService.exportData).toBe('function');
    });
  });

  // ============================================================================
  // TESTS getUserAnalytics
  // ============================================================================

  describe('getUserAnalytics', () => {
    it('should return analytics data structure', async () => {
      // Arrange
      const userId = 'test-user-123';
      const config = createBasicConfig();

      // Act
      const result = await AnalyticsService.getUserAnalytics(userId, config);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userId).toBe(userId);
    });

    it('should handle missing user gracefully', async () => {
      // Arrange
      const nonExistentUserId = 'non-existent-user';
      const config = createBasicConfig();

      // Act & Assert
      await expect(
        AnalyticsService.getUserAnalytics(nonExistentUserId, config)
      ).rejects.toThrow();
    });
  });

  // ============================================================================
  // TESTS getProgressReport
  // ============================================================================

  describe('getProgressReport', () => {
    it('should return progress report', async () => {
      // Arrange
      const userId = 'test-user-123';
      const securityContext = {
        userId,
        sessionId: 'session-456',
        permissions: ['analytics:read'],
        ipAddress: '127.0.0.1',
        userAgent: 'Test-Agent/1.0',
        timestamp: new Date().toISOString()
      };

      // Act
      const result = await AnalyticsService.getProgressReport(userId, securityContext);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userId).toBe(userId);
    });
  });

  // ============================================================================
  // TESTS getComparativeAnalysis
  // ============================================================================

  describe('getComparativeAnalysis', () => {
    it('should return comparative analysis', async () => {
      // Arrange
      const userId = 'test-user-123';
      const compareWith = 'peer_group';

      // Act
      const result = await AnalyticsService.getComparativeAnalysis(userId, compareWith);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.userPerformance).toBeDefined();
      expect(result.peerComparison).toBeDefined();
      expect(Array.isArray(result.insights)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  // ============================================================================
  // TESTS exportData
  // ============================================================================

  describe('exportData', () => {
    it('should export data successfully', async () => {
      // Arrange
      const userId = 'test-user-123';
      const options = createExportOptions();

      // Act
      const result = await AnalyticsService.exportData(userId, options);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.exportId).toBeDefined();
      expect(result.format).toBe('json');
      expect(result.data).toBeDefined();
    });

    it('should handle different export formats', async () => {
      // Arrange
      const userId = 'test-user-123';
      const formats = ['json', 'csv'] as const;

      // Act & Assert
      for (const format of formats) {
        const options = {
          ...createExportOptions(),
          format
        };
        const result = await AnalyticsService.exportData(userId, options);
        
        expect(result).toBeDefined();
        expect(result.format).toBe(format);
      }
    });
  });

  // ============================================================================
  // TESTS DE PERFORMANCE
  // ============================================================================

  describe('Performance Tests', () => {
    it('should complete analytics within acceptable time', async () => {
      // Arrange
      const userId = 'test-user-123';
      const config = createBasicConfig();

      // Act
      const startTime = performance.now();
      const result = await AnalyticsService.getUserAnalytics(userId, config);
      const duration = performance.now() - startTime;

      // Assert
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000); // Moins de 5 secondes
    });
  });

  // ============================================================================
  // TESTS DE SÉCURITÉ
  // ============================================================================

  describe('Security Tests', () => {
    it('should validate user inputs', async () => {
      // Arrange
      const maliciousUserId = '<script>alert("xss")</script>';
      const config = createBasicConfig();

      // Act & Assert - Le service doit rejeter ou nettoyer l'input malicieux
      await expect(
        AnalyticsService.getUserAnalytics(maliciousUserId, config)
      ).rejects.toThrow();
    });
  });
});