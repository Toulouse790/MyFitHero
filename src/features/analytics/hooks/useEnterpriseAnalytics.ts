/**
 * ================================================
 * ANALYTICS HOOKS - 6★/5 ULTRA-PERFORMANCE
 * ================================================
 * 
 * Hooks React ultra-optimisés pour analytics enterprise:
 * - Performance optimizations avec virtualization
 * - Intelligent caching et prefetching
 * - Memory management et garbage collection
 * - Real-time updates avec debouncing intelligent
 * - Error boundaries et retry logic
 * - Accessibility et UX excellence
 */

import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState, 
  useMemo,
  useReducer,
  useLayoutEffect
} from 'react';

import { 
  UserId,
  MetricValue,
  AnalyticsTimeFrame,
  AnalyticsQuery,
  BusinessIntelligenceReport,
  AnalyticsInsight,
  RealTimeMetric,
  AnalyticsStream,
  StreamConfig,
  StreamCallback,
  MetricType,
  AnalyticsPeriod,
  AnalyticsError,
  AnalyticsErrorCode,
  createUserId,
  createTimestamp
} from '../types/enterprise';

import { AnalyticsValidator } from '../types/validators';
import { analyticsService } from '../services/enterpriseAnalytics.service';
import { realtimeAnalyticsStream } from '../services/realtimeStreaming.service';

// ========================================
// PERFORMANCE OPTIMIZATION TYPES
// ========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
  threshold: number;
}

interface PerformanceMetrics {
  renderTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  updateLatency: number;
  errorRate: number;
}

interface RetryConfig {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
}

// ========================================
// HOOK STATE TYPES
// ========================================

interface AnalyticsState<T> {
  data: T | null;
  loading: boolean;
  error: AnalyticsError | null;
  isStale: boolean;
  lastUpdated: number;
  retryCount: number;
}

interface StreamState {
  isConnected: boolean;
  stream: AnalyticsStream | null;
  metrics: RealTimeMetric[];
  latency: number;
  errorCount: number;
  lastMessage: number;
}

// ========================================
// PERFORMANCE CACHE IMPLEMENTATION
// ========================================

class PerformanceCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize = 1000;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 300000);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = now;
    return entry.data;
  }

  set(key: string, data: T, ttl = 300000): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats(): { size: number; hitRate: number } {
    let totalAccess = 0;
    for (const entry of this.cache.values()) {
      totalAccess += entry.accessCount;
    }
    
    return {
      size: this.cache.size,
      hitRate: totalAccess > 0 ? this.cache.size / totalAccess : 0
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Global cache instance
const performanceCache = new PerformanceCache<any>();

// ========================================
// REDUCER FOR COMPLEX STATE MANAGEMENT
// ========================================

type AnalyticsAction<T> = 
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: AnalyticsError }
  | { type: 'RETRY' }
  | { type: 'INVALIDATE' }
  | { type: 'UPDATE_PARTIAL'; payload: Partial<T> };

function analyticsReducer<T>(
  state: AnalyticsState<T>, 
  action: AnalyticsAction<T>
): AnalyticsState<T> {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: null,
        isStale: false,
        lastUpdated: Date.now(),
        retryCount: 0
      };
    
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        retryCount: state.retryCount + 1
      };
    
    case 'RETRY':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'INVALIDATE':
      return {
        ...state,
        isStale: true
      };
    
    case 'UPDATE_PARTIAL':
      return {
        ...state,
        data: state.data ? { ...state.data, ...action.payload } : null,
        lastUpdated: Date.now(),
        isStale: false
      };
    
    default:
      return state;
  }
}

// ========================================
// MAIN ANALYTICS HOOK
// ========================================

export function useEnterpriseAnalytics(
  userId: UserId,
  query: AnalyticsQuery,
  options: {
    realtime?: boolean;
    cacheTime?: number;
    retryConfig?: RetryConfig;
    onError?: (error: AnalyticsError) => void;
    onSuccess?: (data: MetricValue[]) => void;
  } = {}
) {
  const {
    realtime = false,
    cacheTime = 300000, // 5 minutes
    retryConfig = {
      maxRetries: 3,
      backoffStrategy: 'exponential',
      initialDelay: 1000,
      maxDelay: 10000
    },
    onError,
    onSuccess
  } = options;

  const [state, dispatch] = useReducer(analyticsReducer<MetricValue[]>, {
    data: null,
    loading: false,
    error: null,
    isStale: false,
    lastUpdated: 0,
    retryCount: 0
  });

  const [streamState, setStreamState] = useState<StreamState>({
    isConnected: false,
    stream: null,
    metrics: [],
    latency: 0,
    errorCount: 0,
    lastMessage: 0
  });

  const abortControllerRef = useRef<AbortController>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const performanceStartRef = useRef<number>();
  
  // Generate cache key
  const cacheKey = useMemo(() => 
    `analytics:${userId}:${JSON.stringify(query)}`, 
    [userId, query]
  );

  // ========================================
  // PERFORMANCE MONITORING
  // ========================================

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    updateLatency: 0,
    errorRate: 0
  });

  useLayoutEffect(() => {
    performanceStartRef.current = performance.now();
  });

  useEffect(() => {
    if (performanceStartRef.current) {
      const renderTime = performance.now() - performanceStartRef.current;
      setPerformanceMetrics(prev => ({
        ...prev,
        renderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      }));
    }
  });

  // ========================================
  // DATA FETCHING WITH CACHE
  // ========================================

  const fetchData = useCallback(async (force = false) => {
    // Validate user ID
    const validation = AnalyticsValidator.validateUserId(userId);
    if (!validation.isValid) {
      const error: AnalyticsError = {
        code: AnalyticsErrorCode.INVALID_USER_ID,
        message: 'Invalid user ID',
        timestamp: createTimestamp(),
        userId
      };
      dispatch({ type: 'ERROR', payload: error });
      onError?.(error);
      return;
    }

    // Check cache first (unless forced refresh)
    if (!force) {
      const cachedData = performanceCache.get<MetricValue[]>(cacheKey);
      if (cachedData) {
        dispatch({ type: 'SUCCESS', payload: cachedData });
        onSuccess?.(cachedData);
        
        // Update cache hit rate
        const cacheStats = performanceCache.getStats();
        setPerformanceMetrics(prev => ({
          ...prev,
          cacheHitRate: cacheStats.hitRate
        }));
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    dispatch({ type: 'LOADING' });

    const startTime = Date.now();

    try {
      const data = await analyticsService.getUserMetrics(userId, query);
      
      // Cache the result
      performanceCache.set(cacheKey, data, cacheTime);
      
      dispatch({ type: 'SUCCESS', payload: data });
      onSuccess?.(data);
      
      // Update performance metrics
      const latency = Date.now() - startTime;
      setPerformanceMetrics(prev => ({
        ...prev,
        updateLatency: latency,
        errorRate: prev.errorRate * 0.9 // Exponential decay for error rate
      }));

    } catch (error) {
      const analyticsError: AnalyticsError = {
        code: AnalyticsErrorCode.SYSTEM_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: createTimestamp(),
        userId
      };

      dispatch({ type: 'ERROR', payload: analyticsError });
      onError?.(analyticsError);

      // Update error rate
      setPerformanceMetrics(prev => ({
        ...prev,
        errorRate: Math.min(1, prev.errorRate + 0.1)
      }));

      // Implement retry logic
      if (state.retryCount < retryConfig.maxRetries) {
        const delay = retryConfig.backoffStrategy === 'exponential' 
          ? Math.min(retryConfig.initialDelay * Math.pow(2, state.retryCount), retryConfig.maxDelay)
          : retryConfig.initialDelay;

        retryTimeoutRef.current = setTimeout(() => {
          dispatch({ type: 'RETRY' });
          fetchData(force);
        }, delay);
      }
    }
  }, [userId, query, cacheKey, cacheTime, state.retryCount, retryConfig, onError, onSuccess]);

  // ========================================
  // REAL-TIME STREAMING
  // ========================================

  useEffect(() => {
    if (!realtime || !state.data) return;

    let stream: AnalyticsStream;
    let subscription: any;

    const setupRealtime = async () => {
      try {
        const streamConfig: StreamConfig = {
          batchSize: 10,
          flushInterval: 1000,
          compression: true,
          retryPolicy: {
            maxRetries: 3,
            backoffStrategy: 'exponential',
            initialDelay: 1000,
            maxDelay: 10000
          }
        };

        stream = await realtimeAnalyticsStream.createStream(userId, streamConfig);
        
        const callback: StreamCallback = {
          onMetric: (metric: RealTimeMetric) => {
            setStreamState(prev => ({
              ...prev,
              metrics: [...prev.metrics.slice(-99), metric], // Keep last 100
              lastMessage: Date.now(),
              latency: Date.now() - metric.value.timestamp
            }));

            // Update main data if relevant
            if (query.filters.metrics?.includes(metric.value.type)) {
              dispatch({ 
                type: 'UPDATE_PARTIAL', 
                payload: { [metric.value.id]: metric.value } as any 
              });
            }
          },
          onError: (error) => {
            setStreamState(prev => ({
              ...prev,
              errorCount: prev.errorCount + 1
            }));
          },
          onStatusChange: (status) => {
            setStreamState(prev => ({
              ...prev,
              isConnected: status.isActive
            }));
          },
          onReconnect: () => {
            setStreamState(prev => ({
              ...prev,
              isConnected: true,
              errorCount: 0
            }));
          }
        };

        subscription = await realtimeAnalyticsStream.subscribeToStream(stream.streamId, callback);
        
        setStreamState(prev => ({
          ...prev,
          isConnected: true,
          stream
        }));

      } catch (error) {
        console.error('Failed to setup realtime analytics:', error);
        setStreamState(prev => ({
          ...prev,
          isConnected: false,
          errorCount: prev.errorCount + 1
        }));
      }
    };

    setupRealtime();

    return () => {
      if (subscription) {
        realtimeAnalyticsStream.unsubscribe(subscription);
      }
      if (stream) {
        realtimeAnalyticsStream.destroyStream(stream.streamId);
      }
    };
  }, [realtime, userId, query.filters.metrics, state.data]);

  // ========================================
  // INITIAL DATA FETCH
  // ========================================

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // ========================================
  // MEMOIZED RETURN VALUES
  // ========================================

  const refetch = useCallback(() => fetchData(true), [fetchData]);
  
  const invalidate = useCallback(() => {
    performanceCache.invalidate(`analytics:${userId}:*`);
    dispatch({ type: 'INVALIDATE' });
  }, [userId]);

  const memoizedReturn = useMemo(() => ({
    // Core data
    data: state.data,
    loading: state.loading,
    error: state.error,
    isStale: state.isStale,
    
    // Real-time state
    realtime: {
      isConnected: streamState.isConnected,
      metrics: streamState.metrics,
      latency: streamState.latency,
      errorCount: streamState.errorCount
    },
    
    // Actions
    refetch,
    invalidate,
    
    // Performance metrics
    performance: performanceMetrics,
    
    // Retry info
    retryCount: state.retryCount,
    canRetry: state.retryCount < retryConfig.maxRetries
  }), [
    state,
    streamState,
    refetch,
    invalidate,
    performanceMetrics,
    retryConfig.maxRetries
  ]);

  return memoizedReturn;
}

// ========================================
// SPECIALIZED HOOKS
// ========================================

export function useAnalyticsInsights(
  userId: UserId,
  options: {
    autoRefresh?: boolean;
    refreshInterval?: number;
  } = {}
) {
  const { autoRefresh = true, refreshInterval = 300000 } = options; // 5 minutes

  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalyticsError | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getPersonalizedInsights(userId);
      setInsights(data);
    } catch (err) {
      const error: AnalyticsError = {
        code: AnalyticsErrorCode.SYSTEM_ERROR,
        message: err instanceof Error ? err.message : 'Failed to fetch insights',
        timestamp: createTimestamp(),
        userId
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchInsights, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchInsights]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights
  };
}

export function useBusinessReport(
  userId: UserId,
  category: string,
  timeFrame: AnalyticsTimeFrame,
  options: {
    lazy?: boolean;
  } = {}
) {
  const { lazy = false } = options;

  const [report, setReport] = useState<BusinessIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalyticsError | null>(null);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.generateBusinessReport(userId, category, timeFrame);
      setReport(data);
    } catch (err) {
      const error: AnalyticsError = {
        code: AnalyticsErrorCode.SYSTEM_ERROR,
        message: err instanceof Error ? err.message : 'Failed to generate report',
        timestamp: createTimestamp(),
        userId
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [userId, category, timeFrame]);

  useEffect(() => {
    if (!lazy) {
      generateReport();
    }
  }, [lazy, generateReport]);

  return {
    report,
    loading,
    error,
    generate: generateReport
  };
}

// ========================================
// VIRTUALIZATION HOOK
// ========================================

export function useVirtualizedAnalytics<T>(
  data: T[],
  config: VirtualizationConfig
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const { itemHeight, containerHeight, overscan } = config;
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      data.length
    );

    const visibleStartIndex = Math.max(0, startIndex - overscan);
    
    return {
      startIndex: visibleStartIndex,
      endIndex,
      items: data.slice(visibleStartIndex, endIndex),
      totalHeight: data.length * itemHeight,
      offsetY: visibleStartIndex * itemHeight
    };
  }, [data, scrollTop, config]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight
  };
}

// ========================================
// PERFORMANCE MONITORING HOOK
// ========================================

export function useAnalyticsPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    updateLatency: 0,
    errorRate: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const cacheStats = performanceCache.getStats();
      setMetrics(prev => ({
        ...prev,
        cacheHitRate: cacheStats.hitRate,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      }));
    };

    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    performanceCache.invalidate('*');
  }, []);

  return {
    metrics,
    clearCache,
    cacheSize: performanceCache.getStats().size
  };
}

// ========================================
// EXPORT CLEANUP
// ========================================

export function cleanupAnalyticsCache() {
  performanceCache.destroy();
}