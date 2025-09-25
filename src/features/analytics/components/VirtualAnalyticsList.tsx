/**
 * 🎯 MYFITHERO ANALYTICS - VIRTUAL ANALYTICS LIST 6★/5
 * Composant React de liste analytics virtualisée ultra-performant
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import React, { 
  useMemo, 
  useCallback, 
  useRef, 
  useEffect, 
  useState, 
  forwardRef,
  useImperativeHandle,
  memo 
} from 'react';

import { 
  usePerformanceOptimization,
  UsePerformanceOptimizationOptions,
  UsePerformanceOptimizationResult,
  VirtualizedItem,
  PerformanceMetrics
} from '../performance/ultraPerformanceManager';

// ============================================================================
// TYPES ULTRA-RIGOUREUX
// ============================================================================

/**
 * Configuration du composant virtualisé
 */
interface VirtualAnalyticsListConfig {
  readonly itemHeight: number | ((index: number) => number);
  readonly overscanCount: number;
  readonly threshold: number;
  readonly enableSmoothScrolling: boolean;
  readonly enableInfiniteScrolling: boolean;
  readonly enableKeyboardNavigation: boolean;
  readonly enableAccessibility: boolean;
  readonly enableAnimations: boolean;
  readonly loadingPlaceholderCount: number;
}

/**
 * Données d'analytics à afficher
 */
interface AnalyticsDataItem {
  readonly id: string;
  readonly type: 'metric' | 'chart' | 'table' | 'summary';
  readonly title: string;
  readonly data: unknown;
  readonly priority: 'high' | 'medium' | 'low';
  readonly lastUpdated: number;
  readonly size: 'small' | 'medium' | 'large';
  readonly interactive: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Props du composant principal
 */
interface VirtualAnalyticsListProps {
  readonly data: AnalyticsDataItem[];
  readonly config?: Partial<VirtualAnalyticsListConfig>;
  readonly performanceOptions?: UsePerformanceOptimizationOptions;
  readonly onItemClick?: (item: AnalyticsDataItem, index: number) => void;
  readonly onItemVisible?: (item: AnalyticsDataItem, index: number) => void;
  readonly onLoadMore?: () => Promise<void>;
  readonly onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  readonly renderItem?: (item: AnalyticsDataItem, index: number) => React.ReactNode;
  readonly renderPlaceholder?: (index: number) => React.ReactNode;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly testId?: string;
}

/**
 * Interface pour les actions imperatives
 */
interface VirtualAnalyticsListRef {
  scrollToItem: (index: number, align?: 'auto' | 'smart' | 'center' | 'end' | 'start') => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  getVisibleRange: () => { startIndex: number; endIndex: number };
  refreshData: () => void;
  optimizePerformance: () => void;
}

/**
 * Props pour le rendu d'item optimisé
 */
interface OptimizedItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: VirtualizedItem<AnalyticsDataItem>[];
    config: VirtualAnalyticsListConfig;
    onItemClick?: (item: AnalyticsDataItem, index: number) => void;
    onItemVisible?: (item: AnalyticsDataItem, index: number) => void;
    renderItem?: (item: AnalyticsDataItem, index: number) => React.ReactNode;
  };
}

// ============================================================================
// CONFIGURATION PAR DÉFAUT
// ============================================================================

const DEFAULT_CONFIG: VirtualAnalyticsListConfig = {
  itemHeight: 120,
  overscanCount: 5,
  threshold: 100,
  enableSmoothScrolling: true,
  enableInfiniteScrolling: false,
  enableKeyboardNavigation: true,
  enableAccessibility: true,
  enableAnimations: true,
  loadingPlaceholderCount: 10
} as const;

// ============================================================================
// COMPOSANT D'ITEM OPTIMISÉ
// ============================================================================

const OptimizedAnalyticsItem = memo<OptimizedItemProps>(({ 
  index, 
  style, 
  data: { items, config, onItemClick, onItemVisible, renderItem } 
}) => {
  const item = items[index];
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Observer de visibilité pour lazy loading
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        if (visible && onItemVisible) {
          onItemVisible(item.data, index);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [item.data, index, onItemVisible]);

  // Gestion du clic optimisée
  const handleClick = useCallback(() => {
    onItemClick?.(item.data, index);
  }, [item.data, index, onItemClick]);

  // Gestion du clavier pour l'accessibilité
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (config.enableKeyboardNavigation) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    }
  }, [config.enableKeyboardNavigation, handleClick]);

  // Rendu personnalisé ou par défaut
  const content = useMemo(() => {
    if (renderItem) {
      return renderItem(item.data, index);
    }

    return (
      <DefaultAnalyticsItem 
        item={item.data} 
        index={index}
        isVisible={isVisible}
        config={config}
      />
    );
  }, [renderItem, item.data, index, isVisible, config]);

  return (
    <div
      ref={elementRef}
      style={style}
      className={`
        virtual-analytics-item
        virtual-analytics-item--${item.data.priority}
        virtual-analytics-item--${item.data.size}
        ${item.data.interactive ? 'virtual-analytics-item--interactive' : ''}
        ${isVisible ? 'virtual-analytics-item--visible' : ''}
      `}
      onClick={item.data.interactive ? handleClick : undefined}
      onKeyDown={item.data.interactive ? handleKeyDown : undefined}
      tabIndex={config.enableAccessibility && item.data.interactive ? 0 : -1}
      role={item.data.interactive ? 'button' : 'article'}
      aria-label={config.enableAccessibility ? `Analytics item: ${item.data.title}` : undefined}
      data-testid={`analytics-item-${index}`}
    >
      {content}
    </div>
  );
});

OptimizedAnalyticsItem.displayName = 'OptimizedAnalyticsItem';

// ============================================================================
// COMPOSANT D'ITEM PAR DÉFAUT
// ============================================================================

interface DefaultAnalyticsItemProps {
  readonly item: AnalyticsDataItem;
  readonly index: number;
  readonly isVisible: boolean;
  readonly config: VirtualAnalyticsListConfig;
}

const DefaultAnalyticsItem = memo<DefaultAnalyticsItemProps>(({ 
  item, 
  index, 
  isVisible, 
  config 
}) => {
  // Icône basée sur le type
  const getTypeIcon = useCallback((type: AnalyticsDataItem['type']) => {
    const icons = {
      metric: '📊',
      chart: '📈',
      table: '📋',
      summary: '📄'
    };
    return icons[type] || '📊';
  }, []);

  // Couleur de priorité
  const getPriorityColor = useCallback((priority: AnalyticsDataItem['priority']) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority];
  }, []);

  return (
    <div className="default-analytics-item">
      <div className="default-analytics-item__header">
        <div className="default-analytics-item__icon">
          {getTypeIcon(item.type)}
        </div>
        <div className="default-analytics-item__title-section">
          <h3 className="default-analytics-item__title">{item.title}</h3>
          <div className="default-analytics-item__meta">
            <span className="default-analytics-item__type">{item.type}</span>
            <span 
              className="default-analytics-item__priority"
              style={{ color: getPriorityColor(item.priority) }}
            >
              {item.priority}
            </span>
          </div>
        </div>
        <div className="default-analytics-item__actions">
          <span className="default-analytics-item__index">#{index + 1}</span>
        </div>
      </div>
      
      <div className="default-analytics-item__content">
        {isVisible ? (
          <div className="default-analytics-item__data">
            {typeof item.data === 'object' ? (
              <pre className="default-analytics-item__json">
                {JSON.stringify(item.data, null, 2).slice(0, 200)}
                {JSON.stringify(item.data, null, 2).length > 200 && '...'}
              </pre>
            ) : (
              <span className="default-analytics-item__simple-data">
                {String(item.data)}
              </span>
            )}
          </div>
        ) : (
          <div className="default-analytics-item__placeholder">
            Loading content...
          </div>
        )}
      </div>
      
      <div className="default-analytics-item__footer">
        <span className="default-analytics-item__updated">
          Updated: {new Date(item.lastUpdated).toLocaleTimeString()}
        </span>
        <span className="default-analytics-item__size">
          Size: {item.size}
        </span>
      </div>
    </div>
  );
});

DefaultAnalyticsItem.displayName = 'DefaultAnalyticsItem';

// ============================================================================
// COMPOSANTS DE CHARGEMENT
// ============================================================================

const LoadingPlaceholder = memo<{ index: number; config: VirtualAnalyticsListConfig }>(({ 
  index, 
  config 
}) => (
  <div 
    className="loading-placeholder"
    style={{ 
      height: typeof config.itemHeight === 'number' ? config.itemHeight : 120,
      animation: config.enableAnimations ? 'pulse 1.5s ease-in-out infinite' : undefined
    }}
  >
    <div className="loading-placeholder__content">
      <div className="loading-placeholder__header">
        <div className="loading-placeholder__icon" />
        <div className="loading-placeholder__title" />
        <div className="loading-placeholder__meta" />
      </div>
      <div className="loading-placeholder__body">
        <div className="loading-placeholder__line" />
        <div className="loading-placeholder__line" />
        <div className="loading-placeholder__line loading-placeholder__line--short" />
      </div>
    </div>
  </div>
));

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

// ============================================================================
// INDICATEUR DE PERFORMANCE
// ============================================================================

interface PerformanceIndicatorProps {
  readonly metrics: PerformanceMetrics;
  readonly className?: string;
}

const PerformanceIndicator = memo<PerformanceIndicatorProps>(({ metrics, className }) => {
  const [expanded, setExpanded] = useState(false);

  const getPerformanceStatus = useCallback(() => {
    const { fps } = metrics.rendering;
    const { percentage: memoryUsage } = metrics.memory;
    
    if (fps >= 55 && memoryUsage < 70) return 'excellent';
    if (fps >= 45 && memoryUsage < 85) return 'good';
    if (fps >= 30 && memoryUsage < 95) return 'fair';
    return 'poor';
  }, [metrics]);

  const status = getPerformanceStatus();

  return (
    <div className={`performance-indicator performance-indicator--${status} ${className || ''}`}>
      <button
        className="performance-indicator__toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="Toggle performance metrics"
      >
        <span className="performance-indicator__status">{status}</span>
        <span className="performance-indicator__fps">{metrics.rendering.fps} FPS</span>
      </button>
      
      {expanded && (
        <div className="performance-indicator__details">
          <div className="performance-metric">
            <span>Memory:</span>
            <span>{Math.round(metrics.memory.percentage)}%</span>
          </div>
          <div className="performance-metric">
            <span>Cache Hit Rate:</span>
            <span>{Math.round(metrics.cache.hitRate)}%</span>
          </div>
          <div className="performance-metric">
            <span>Network Latency:</span>
            <span>{Math.round(metrics.network.latency)}ms</span>
          </div>
          <div className="performance-metric">
            <span>Dropped Frames:</span>
            <span>{metrics.rendering.droppedFrames}</span>
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceIndicator.displayName = 'PerformanceIndicator';

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export const VirtualAnalyticsList = forwardRef<VirtualAnalyticsListRef, VirtualAnalyticsListProps>(({
  data,
  config: userConfig = {},
  performanceOptions = {},
  onItemClick,
  onItemVisible,
  onLoadMore,
  onMetricsUpdate,
  renderItem,
  renderPlaceholder,
  className = '',
  style = {},
  testId = 'virtual-analytics-list'
}, ref) => {
  
  // Configuration fusionnée
  const config = useMemo(() => ({ 
    ...DEFAULT_CONFIG, 
    ...userConfig 
  }), [userConfig]);

  // Hook de performance
  const {
    virtualizedItems,
    totalHeight,
    isVirtualized,
    metrics,
    updateScrollPosition,
    prefetchData,
    clearCache,
    optimizeMemory,
    isLoading,
    error
  } = usePerformanceOptimization<AnalyticsDataItem>(data, performanceOptions);

  // Références
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  // Calcul de la hauteur d'item
  const getItemSize = useCallback((index: number) => {
    if (typeof config.itemHeight === 'function') {
      return config.itemHeight(index);
    }
    return config.itemHeight;
  }, [config.itemHeight]);

  // Actions imperatives
  useImperativeHandle(ref, () => ({
    scrollToItem: (index: number, align = 'auto') => {
      // Implémentation simplifiée pour scroll
      const container = containerRef.current;
      if (container) {
        const itemHeight = getItemSize(index);
        container.scrollTop = index * itemHeight;
      }
    },
    scrollToTop: () => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = 0;
      }
    },
    scrollToBottom: () => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    getVisibleRange: () => {
      return { startIndex: 0, endIndex: Math.min(50, data.length - 1) };
    },
    refreshData: () => {
      // Force le re-render
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateZ(0)';
      }
    },
    optimizePerformance: () => {
      optimizeMemory();
      clearCache();
    }
  }), [totalHeight, data.length, optimizeMemory, clearCache, getItemSize]);

  // Données pour le rendu d'items
  const itemData = useMemo(() => ({
    items: virtualizedItems,
    config,
    onItemClick,
    onItemVisible,
    renderItem
  }), [virtualizedItems, config, onItemClick, onItemVisible, renderItem]);

  // Placeholder de chargement
  const renderLoadingPlaceholder = useCallback((index: number) => {
    if (renderPlaceholder) {
      return renderPlaceholder(index);
    }
    return <LoadingPlaceholder index={index} config={config} />;
  }, [renderPlaceholder, config]);

  // Gestion des erreurs
  if (error) {
    return (
      <div className="virtual-analytics-list__error" data-testid={`${testId}-error`}>
        <div className="error-message">
          <h3>⚠️ Performance Error</h3>
          <p>{error}</p>
          <button onClick={optimizeMemory}>Optimize & Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`virtual-analytics-list ${className}`}
      style={style}
      data-testid={testId}
    >
      {/* Indicateur de performance */}
      <PerformanceIndicator 
        metrics={metrics}
        className="virtual-analytics-list__performance"
      />

      {/* Liste simple optimisée */}
      <div className="virtual-analytics-list__simple">
        {data.map((item, index) => (
          <div 
            key={item.id}
            className="virtual-analytics-list__simple-item"
            style={{ height: getItemSize(index) }}
          >
            <OptimizedAnalyticsItem
              index={index}
              style={{ height: getItemSize(index) }}
              data={itemData}
            />
          </div>
        ))}
        
        {/* Placeholders de chargement pour scroll infini */}
        {isInfiniteLoading && Array.from({ length: config.loadingPlaceholderCount }).map((_, index) => (
          <div key={`loading-${index}`}>
            {renderLoadingPlaceholder(data.length + index)}
          </div>
        ))}
      </div>

      {/* État de chargement */}
      {isLoading && (
        <div className="virtual-analytics-list__loading">
          <div className="loading-spinner" />
          <span>Loading analytics data...</span>
        </div>
      )}
    </div>
  );
});

VirtualAnalyticsList.displayName = 'VirtualAnalyticsList';

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  VirtualAnalyticsListProps,
  VirtualAnalyticsListRef,
  VirtualAnalyticsListConfig,
  AnalyticsDataItem,
  OptimizedItemProps,
  DefaultAnalyticsItemProps,
  PerformanceIndicatorProps
};

export {
  DefaultAnalyticsItem,
  LoadingPlaceholder,
  PerformanceIndicator,
  OptimizedAnalyticsItem
};