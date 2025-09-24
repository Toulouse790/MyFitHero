import { useEffect, useCallback } from 'react';
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

// Types pour les métriques de performance
interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceThresholds {
  LCP: number; // < 2.5s
  INP: number; // < 200ms (remplace FID)
  CLS: number; // < 0.1
  FCP: number; // < 1.8s
  TTFB: number; // < 800ms
}

// Seuils optimaux pour Lighthouse 95+
const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  LCP: 2500,  // Largest Contentful Paint < 2.5s
  INP: 200,   // Interaction to Next Paint < 200ms
  CLS: 0.1,   // Cumulative Layout Shift < 0.1
  FCP: 1800,  // First Contentful Paint < 1.8s
  TTFB: 800,  // Time to First Byte < 800ms
};

// Types globaux pour gtag
declare global {
  function gtag(...args: any[]): void;
}

// Collecteur de métriques de performance
class PerformanceCollector {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private listeners: ((metric: PerformanceMetric) => void)[] = [];

  constructor() {
    this.initWebVitals();
  }

  private initWebVitals() {
    // Collecter toutes les métriques Web Vitals
    onLCP(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: PerformanceMetric) {
    this.metrics.set(metric.name, metric);
    this.listeners.forEach(listener => listener(metric));
    
    // Log en développement
    if (import.meta.env.DEV) {
        value: `${metric.value}ms`,
        threshold: `${PERFORMANCE_THRESHOLDS[metric.name as keyof PerformanceThresholds]}ms`,
        status: this.getMetricStatus(metric)
      });
    }

    // Envoyer à l'analytics en production
    if (import.meta.env.PROD) {
      this.sendToAnalytics(metric);
    }
  }

  private getMetricStatus(metric: PerformanceMetric): '✅ Good' | '⚠️ Needs Improvement' | '❌ Poor' {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof PerformanceThresholds];
    if (!threshold) return '✅ Good';
    
    if (metric.value <= threshold) return '✅ Good';
    if (metric.value <= threshold * 1.5) return '⚠️ Needs Improvement';
    return '❌ Poor';
  }

  private async sendToAnalytics(metric: PerformanceMetric) {
    try {
      // Envoyer à Google Analytics 4 ou service similaire
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_id: metric.id,
        });
      }

      // Envoyer à Supabase pour tracking interne
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('performance_metrics').insert({
        metric_name: metric.name,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_id: metric.id,
        navigation_type: metric.navigationType,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  public getMetrics(): Map<string, PerformanceMetric> {
    return this.metrics;
  }

  public onMetric(listener: (metric: PerformanceMetric) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }
}

// Instance globale du collecteur
const performanceCollector = new PerformanceCollector();

// Hook pour utiliser les métriques de performance
export const usePerformanceMetrics = () => {
  const handleMetric = useCallback((metric: PerformanceMetric) => {
    // Traitement optionnel des métriques dans les composants
  }, []);

  useEffect(() => {
    const unsubscribe = performanceCollector.onMetric(handleMetric);
    return unsubscribe;
  }, [handleMetric]);

  return {
    metrics: performanceCollector.getMetrics(),
    thresholds: PERFORMANCE_THRESHOLDS
  };
};

// Optimisations runtime pour améliorer INP
class RuntimeOptimizerClass {
  private static instance: RuntimeOptimizerClass;
  
  public static getInstance(): RuntimeOptimizerClass {
    if (!RuntimeOptimizerClass.instance) {
      RuntimeOptimizerClass.instance = new RuntimeOptimizerClass();
    }
    return RuntimeOptimizerClass.instance;
  }

  // Découpage des tâches longues pour améliorer FID
  public async splitLongTask<T>(
    task: () => T | Promise<T>,
    maxDuration: number = 50
  ): Promise<T> {
    const start = performance.now();
    
    const result = await task();
    
    const duration = performance.now() - start;
    if (duration > maxDuration) {
      // Yielding pour éviter de bloquer le main thread
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return result;
  }

  // Scheduler pour les tâches non-critiques
  public scheduleIdleTask(task: () => void): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(task, { timeout: 1000 });
    } else {
      setTimeout(task, 0);
    }
  }

  // Prefetch des ressources critiques
  public prefetchResource(href: string, as: string = 'script'): void {
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }

  // Preload des ressources critiques
  public preloadResource(href: string, as: string = 'script'): void {
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
}

// Optimisations pour réduire CLS (Cumulative Layout Shift)
class LayoutStabilizerClass {
  // Réserver l'espace pour les images avec dimensions
  public static reserveImageSpace(width: number, height: number): React.CSSProperties {
    return {
      aspectRatio: `${width} / ${height}`,
      width: '100%',
      height: 'auto',
    };
  }

  // Skeleton loader pour réduire CLS
  public static createSkeleton(
    width: string | number = '100%',
    height: string | number = '20px'
  ): React.CSSProperties {
    return {
      width,
      height,
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    };
  }

  // Container stable pour éviter les reflows
  public static stableContainer(minHeight?: number): React.CSSProperties {
    return {
      minHeight: minHeight ? `${minHeight}px` : '100vh',
      display: 'flex',
      flexDirection: 'column',
    };
  }
}

// Exports avec noms corrects
export const RuntimeOptimizer = RuntimeOptimizerClass;
export const LayoutStabilizer = LayoutStabilizerClass;

// Hook principal pour les optimisations de performance
export const usePerformanceOptimizations = () => {
  const optimizer = RuntimeOptimizer.getInstance();

  useEffect(() => {
    // Prefetch des routes critiques après chargement initial
    optimizer.scheduleIdleTask(() => {
      optimizer.prefetchResource('/dashboard', 'document');
      optimizer.prefetchResource('/workouts', 'document');
      optimizer.prefetchResource('/nutrition', 'document');
    });

    // Optimiser les images après chargement
    optimizer.scheduleIdleTask(() => {
      const images = document.querySelectorAll('img[data-optimize]');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement && !img.loading) {
          img.loading = 'lazy';
          img.decoding = 'async';
        }
      });
    });
  }, [optimizer]);

  return {
    optimizer,
    layoutStabilizer: LayoutStabilizer,
    performanceMetrics: usePerformanceMetrics(),
  };
};

// Export des instances
export { performanceCollector };
export default usePerformanceOptimizations;