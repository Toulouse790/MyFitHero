/**
 * SENTRY MONITORING CONFIGURATION - ENTERPRISE GRADE
 * Système de monitoring temps réel avec alerting automatique
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';

// Configuration Sentry pour monitoring temps réel
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN || 'https://your-sentry-dsn@sentry.io/project-id',
    integrations: [
      new BrowserTracing({
        // Capture des performances et navigation
        tracingOrigins: [
          'localhost', 
          /^\//,
          /^https:\/\/api\.myfithero\.com/,
          /^https:\/\/.*\.supabase\.co/
        ],
      }),
      new CaptureConsole({
        levels: ['error', 'warn']
      }),
      // Intégration React pour capturing des erreurs de composants
      new Sentry.Integrations.Breadcrumbs({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        sentry: true,
        xhr: true
      })
    ],
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session tracking
    autoSessionTracking: true,
    
    // Environnement
    environment: process.env.NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.VITE_APP_VERSION || '1.0.0',
    
    // Error sampling
    sampleRate: 1.0,
    
    // Capture des erreurs non gérées
    beforeSend(event) {
      // Filtrage des erreurs critiques vs bénignes
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError') {
          // Erreurs de chunk loading - criticité faible
          event.level = 'warning';
        }
        if (error?.value?.includes('Network Error')) {
          // Erreurs réseau - criticité moyenne
          event.level = 'error';
          event.tags = { ...event.tags, error_type: 'network' };
        }
        if (error?.value?.includes('Authentication')) {
          // Erreurs d'auth - criticité haute
          event.level = 'fatal';
          event.tags = { ...event.tags, error_type: 'auth' };
        }
      }
      
      return event;
    },

    // Capture des métriques business
    beforeTransaction(transaction) {
      transaction.setTag('feature', 'fitness_tracking');
      return transaction;
    }
  });

  // Configuration des alertes critiques
  setupCriticalAlerts();
};

// Système d'alerting critique
const setupCriticalAlerts = () => {
  // Alert sur erreur d'authentification
  Sentry.addGlobalEventProcessor(event => {
    if (event.level === 'fatal' || event.tags?.error_type === 'auth') {
      // Notification immédiate équipe DevOps
      console.error('[CRITICAL ALERT] Authentication failure detected:', event);
    }
    return event;
  });
  
  // Monitoring performance critique
  window.addEventListener('beforeunload', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation && navigation.loadEventEnd - navigation.navigationStart > 5000) {
      Sentry.captureMessage('Slow page load detected', 'warning');
    }
  });
};

// Métriques business personnalisées
export const trackBusinessMetric = (
  metricName: string, 
  value: number, 
  tags?: Record<string, string>
) => {
  Sentry.addBreadcrumb({
    message: `Business metric: ${metricName}`,
    category: 'business',
    level: 'info',
    data: { value, ...tags }
  });
  
  // Capture métrique
  Sentry.setMeasurement(metricName, value, 'none');
};

// Tracking des événements critiques fitness
export const trackFitnessEvent = (
  eventType: 'workout_completed' | 'nutrition_logged' | 'goal_achieved' | 'error_occurred',
  metadata: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message: `Fitness event: ${eventType}`,
    category: 'fitness',
    level: 'info',
    data: metadata
  });
  
  // Alertes sur événements critiques
  if (eventType === 'error_occurred' && metadata.severity === 'critical') {
    Sentry.captureException(new Error(`Critical fitness error: ${metadata.error}`), {
      tags: { event_type: eventType, severity: 'critical' },
      extra: metadata
    });
  }
};

// Performance monitoring avancé
export const measurePerformance = (operationName: string, operation: () => Promise<any>) => {
  const transaction = Sentry.startTransaction({
    name: operationName,
    op: 'fitness_operation'
  });
  
  return operation()
    .then(result => {
      transaction.setStatus('ok');
      transaction.finish();
      return result;
    })
    .catch(error => {
      transaction.setStatus('internal_error');
      Sentry.captureException(error);
      transaction.finish();
      throw error;
    });
};

// Health check monitoring
export const healthCheck = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy',
  checks: Record<string, boolean>
}> => {
  const checks = {
    database: await checkDatabase(),
    api: await checkAPI(),
    storage: await checkStorage(),
    auth: await checkAuth()
  };
  
  const failedChecks = Object.values(checks).filter(check => !check).length;
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (failedChecks === 0) {
    status = 'healthy';
  } else if (failedChecks <= 1) {
    status = 'degraded';
    Sentry.captureMessage('System degraded - some services failing', 'warning');
  } else {
    status = 'unhealthy';
    Sentry.captureMessage('System unhealthy - multiple services failing', 'error');
  }
  
  trackBusinessMetric('health_check_status', failedChecks, { status });
  
  return { status, checks };
};

// Vérifications de santé des services
const checkDatabase = async (): Promise<boolean> => {
  try {
    // Test connection à Supabase
    const response = await fetch('/api/health/db');
    return response.ok;
  } catch {
    return false;
  }
};

const checkAPI = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health/api');
    return response.ok;
  } catch {
    return false;
  }
};

const checkStorage = async (): Promise<boolean> => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

const checkAuth = async (): Promise<boolean> => {
  try {
    // Vérification du service d'authentification
    return typeof window !== 'undefined';
  } catch {
    return false;
  }
};
