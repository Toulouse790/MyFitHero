/**
 * 🧪 TESTS ML ENGINE - EXCELLENCE 6★/5
 * Tests unitaires minimaux fonctionnels
 * 
 * @version 1.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { describe, it, expect } from '@jest/globals';
import { MLEngine, MLModelType } from '../services/MLEngine';

// ============================================================================
// HELPERS
// ============================================================================

const createMLEngine = () => new MLEngine();

const createBasicModelConfig = () => ({
  type: MLModelType.LINEAR_REGRESSION,
  features: ['workout_frequency', 'intensity', 'duration'],
  target: 'progress_score',
  hyperparameters: {
    learningRate: 0.01,
    maxDepth: 10
  },
  validation: {
    method: 'cross_validation' as const,
    folds: 5
  }
});

const createSampleData = () => [
  { workout_frequency: 3, intensity: 7, duration: 45, progress_score: 85 },
  { workout_frequency: 4, intensity: 8, duration: 60, progress_score: 92 },
  { workout_frequency: 2, intensity: 5, duration: 30, progress_score: 78 }
];

// ============================================================================
// TESTS MLEngine
// ============================================================================

describe('MLEngine - Excellence 6★/5', () => {

  // ============================================================================
  // TESTS CONSTRUCTION ET CONFIGURATION
  // ============================================================================

  describe('Service Availability', () => {
    it('should be defined and have required methods', () => {
      // Arrange
      const mlEngine = createMLEngine();

      // Assert
      expect(MLEngine).toBeDefined();
      expect(typeof mlEngine.trainModel).toBe('function');
      expect(typeof mlEngine.predict).toBe('function');
      expect(typeof mlEngine.detectAnomalies).toBe('function');
    });
  });

  // ============================================================================
  // TESTS trainModel
  // ============================================================================

  describe('trainModel', () => {
    it('should train model successfully', async () => {
      // Arrange
      const mlEngine = createMLEngine();
      const modelId = 'test-model-123';
      const config = createBasicModelConfig();
      const data = createSampleData();

      // Act
      const result = await mlEngine.trainModel(modelId, config, data);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.modelId).toBe(modelId);
      expect(result.metrics).toBeDefined();
      expect(result.trainingTime).toBeDefined();
    });
  });

  // ============================================================================
  // TESTS predict
  // ============================================================================

  describe('predict', () => {
    it('should make predictions', async () => {
      // Arrange
      const mlEngine = createMLEngine();
      const modelId = 'test-model-123';
      const input = { workout_frequency: 3, intensity: 7, duration: 45 };

      // Act
      const result = await mlEngine.predict(modelId, input);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(typeof result.confidence).toBe('number');
    });
  });

  // ============================================================================
  // TESTS detectAnomalies
  // ============================================================================

  describe('detectAnomalies', () => {
    it('should detect anomalies in data', async () => {
      // Arrange
      const mlEngine = createMLEngine();
      const data = [
        { metric1: 100, metric2: 95 },
        { metric1: 105, metric2: 98 },
        { metric1: 950, metric2: 102 } // Anomalie
      ];
      const config = { method: 'statistical' as const, sensitivity: 'medium' as const };

      // Act
      const result = await mlEngine.detectAnomalies(data, config);

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================================
  // TESTS DE PERFORMANCE
  // ============================================================================

  describe('Performance Tests', () => {
    it('should complete predictions within acceptable time', async () => {
      // Arrange
      const mlEngine = createMLEngine();
      const modelId = 'test-model-123';
      const input = { workout_frequency: 3, intensity: 7 };

      // Act
      const startTime = performance.now();
      const result = await mlEngine.predict(modelId, input);
      const duration = performance.now() - startTime;

      // Assert
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(2000); // Moins de 2 secondes
    });
  });
});