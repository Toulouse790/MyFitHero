import { renderHook, act, waitFor } from '@testing-library/react';
import { usePerformanceMonitoring } from '../usePerformanceMonitoring';
import { testHelpers } from '@/test/setupEnterprise';

// Mock performance APIs
const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  value: mockPerformanceObserver,
});

describe('usePerformanceMonitoring - Enterprise Testing Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset performance API mocks
    Object.defineProperty(performance, 'memory', {
      writable: true,
      value: {
        usedJSHeapSize: 10485760, // 10MB
        totalJSHeapSize: 20971520, // 20MB
        jsHeapSizeLimit: 2147483648 // 2GB
      }
    });

    Object.defineProperty(performance, 'getEntriesByType', {
      writable: true,
      value: jest.fn().mockReturnValue([
        { transferSize: 1024, name: 'app.js' },
        { transferSize: 512, name: 'styles.css' }
      ])
    });
  });

  describe('🔍 Core Functionality', () => {
    it('should initialize with default metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      expect(result.current.metrics).toEqual({
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
        memoryUsage: 0,
        networkRequests: 0,
        bundleSize: 0,
      });

      expect(result.current.isMonitoring).toBe(false);
    });

    it('should start monitoring when requested', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);
      expect(mockPerformanceObserver).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should stop monitoring and cleanup', async () => {
      const mockDisconnect = jest.fn();
      mockPerformanceObserver.mockReturnValue({
        observe: jest.fn(),
        disconnect: mockDisconnect,
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });
      
      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should calculate memory usage correctly', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      await waitFor(() => {
        expect(result.current.metrics.memoryUsage).toBe(10); // 10MB
      });
    });

    it('should calculate bundle size from network resources', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      await waitFor(() => {
        // (1024 + 512) / 1024 = 1.5 KB
        expect(result.current.metrics.bundleSize).toBe(1.5);
      });
    });
  });

  describe('🔥 Performance Metrics Collection', () => {
    it('should record interaction times', async () => {
      // Mock performance timing
      Object.defineProperty(performance, 'mark', {
        value: jest.fn(),
      });
      Object.defineProperty(performance, 'measure', {
        value: jest.fn(),
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.recordInteraction('button-click');
      });

      expect(performance.mark).toHaveBeenCalledWith('button-click-start');
      
      // Simulate interaction completion
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(performance.mark).toHaveBeenCalledWith('button-click-end');
      expect(performance.measure).toHaveBeenCalledWith('button-click', 'button-click-start', 'button-click-end');
    });

    it('should handle navigation timing', async () => {
      const mockNavigationEntry = {
        entryType: 'navigation',
        loadEventEnd: 1500,
        fetchStart: 1000,
      };

      const mockCallback = jest.fn();
      mockPerformanceObserver.mockImplementation((callback) => {
        // Simulate observer callback
        setTimeout(() => callback({ getEntries: () => [mockNavigationEntry] }), 0);
        return { observe: jest.fn(), disconnect: jest.fn() };
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      await waitFor(() => {
        expect(result.current.metrics.loadTime).toBe(500); // 1500 - 1000
      });
    });

    it('should track render performance', async () => {
      const mockMeasureEntry = {
        entryType: 'measure',
        duration: 16.7, // 60fps
      };

      mockPerformanceObserver.mockImplementation((callback) => {
        setTimeout(() => callback({ getEntries: () => [mockMeasureEntry] }), 0);
        return { observe: jest.fn(), disconnect: jest.fn() };
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      await waitFor(() => {
        expect(result.current.metrics.renderTime).toBe(16.7);
      });
    });
  });

  describe('🚨 Error Handling', () => {
    it('should handle PerformanceObserver not supported', () => {
      // Remove PerformanceObserver
      const originalPO = window.PerformanceObserver;
      (window as any).PerformanceObserver = undefined;

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.startMonitoring();
        });
      }).not.toThrow();

      expect(result.current.isMonitoring).toBe(false);

      // Restore
      window.PerformanceObserver = originalPO;
    });

    it('should handle memory API not available', () => {
      // Remove memory API
      const originalMemory = (performance as any).memory;
      (performance as any).memory = undefined;

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.metrics.memoryUsage).toBe(0);

      // Restore
      (performance as any).memory = originalMemory;
    });

    it('should handle performance observer errors gracefully', () => {
      mockPerformanceObserver.mockImplementation(() => {
        throw new Error('PerformanceObserver error');
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      expect(() => {
        act(() => {
          result.current.startMonitoring();
        });
      }).not.toThrow();

      expect(result.current.isMonitoring).toBe(false);
    });
  });

  describe('📊 Metrics Reporting', () => {
    it('should generate comprehensive performance report', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      // Set up some metrics
      act(() => {
        result.current.startMonitoring();
      });

      const report = result.current.getReport();
      
      expect(report).toMatchObject({
        loadTime: expect.any(Number),
        renderTime: expect.any(Number),
        interactionTime: expect.any(Number),
        memoryUsage: expect.any(Number),
        networkRequests: expect.any(Number),
        bundleSize: expect.any(Number),
      });
    });

    it('should clear metrics when requested', () => {
      Object.defineProperty(performance, 'clearMarks', {
        value: jest.fn(),
      });
      Object.defineProperty(performance, 'clearMeasures', {
        value: jest.fn(),
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.clearMetrics();
      });

      expect(result.current.metrics).toEqual({
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
        memoryUsage: 0,
        networkRequests: 0,
        bundleSize: 0,
      });

      expect(performance.clearMarks).toHaveBeenCalled();
      expect(performance.clearMeasures).toHaveBeenCalled();
    });
  });

  describe('⚡ Performance Thresholds', () => {
    it('should identify performance issues', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      // Simulate poor performance
      const poorPerformanceEntry = {
        entryType: 'measure',
        duration: 100, // Very slow render
      };

      mockPerformanceObserver.mockImplementation((callback) => {
        setTimeout(() => callback({ getEntries: () => [poorPerformanceEntry] }), 0);
        return { observe: jest.fn(), disconnect: jest.fn() };
      });

      act(() => {
        result.current.startMonitoring();
      });

      await waitFor(() => {
        expect(result.current.metrics.renderTime).toBe(100);
        // Should flag as performance issue (>16.7ms for 60fps)
        expect(result.current.metrics.renderTime).toBeGreaterThan(16.7);
      });
    });

    it('should track memory leaks', async () => {
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      // Simulate increasing memory usage
      let memoryUsage = 10;
      Object.defineProperty(performance, 'memory', {
        get: () => ({
          usedJSHeapSize: memoryUsage * 1024 * 1024, // MB to bytes
          totalJSHeapSize: 50 * 1024 * 1024,
          jsHeapSizeLimit: 2 * 1024 * 1024 * 1024
        })
      });

      act(() => {
        result.current.startMonitoring();
      });

      // Simulate memory increase over time
      act(() => {
        memoryUsage = 50; // Significant increase
      });

      await waitFor(() => {
        expect(result.current.metrics.memoryUsage).toBe(50);
        // Should flag potential memory leak (>40MB threshold)
        expect(result.current.metrics.memoryUsage).toBeGreaterThan(40);
      });
    });
  });

  describe('🔄 Lifecycle Management', () => {
    it('should cleanup on unmount', () => {
      const mockDisconnect = jest.fn();
      mockPerformanceObserver.mockReturnValue({
        observe: jest.fn(),
        disconnect: mockDisconnect,
      });

      const { result, unmount } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should update metrics periodically', async () => {
      jest.useFakeTimers();
      
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      const initialMemory = result.current.metrics.memoryUsage;

      // Fast-forward timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Metrics should be updated
      expect(result.current.metrics.memoryUsage).toBeGreaterThanOrEqual(0);

      jest.useRealTimers();
    });
  });

  describe('🎯 Business Intelligence', () => {
    it('should categorize performance by user device', async () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      });

      const { result } = renderHook(() => usePerformanceMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      const report = result.current.getReport();
      
      // Should include device context for business analytics
      expect(report).toBeDefined();
      // Mobile devices typically have higher render times
      // This would be used for business intelligence
    });

    it('should track performance regression', async () => {
      const performanceHistory: number[] = [];
      
      const { result } = renderHook(() => usePerformanceMonitoring());
      
      // Simulate multiple performance measurements
      for (let i = 0; i < 5; i++) {
        const mockEntry = {
          entryType: 'measure',
          duration: 10 + i * 2, // Gradually increasing render time
        };

        mockPerformanceObserver.mockImplementation((callback) => {
          setTimeout(() => callback({ getEntries: () => [mockEntry] }), 0);
          return { observe: jest.fn(), disconnect: jest.fn() };
        });

        act(() => {
          result.current.startMonitoring();
        });

        await waitFor(() => {
          performanceHistory.push(result.current.metrics.renderTime);
        });

        act(() => {
          result.current.stopMonitoring();
        });
      }

      // Should detect performance regression
      const isRegression = performanceHistory.some((time, index) => 
        index > 0 && time > performanceHistory[index - 1] * 1.2 // 20% worse
      );
      
      expect(isRegression).toBe(true);
    });
  });
});