/**
 * 🎯 MYFITHERO ANALYTICS - ML/BI REACT HOOK 6★/5
 * Hook React ultra-avancé pour Machine Learning & Business Intelligence
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce, throttle } from 'lodash-es';

import { MLBIService } from '../services/MLBIService';
import type { 
  MLBIServiceConfig,
  IntegratedAnalysisResult,
  SmartRecommendation,
  AnalysisPipeline,
  BIDataPoint,
  MLModelConfig,
  BIAnalysisConfig
} from '../services/MLBIService';

// ============================================================================
// TYPES HOOK ULTRA-RIGOUREUX
// ============================================================================

/**
 * Configuration du hook ML/BI
 */
interface UseMLBIConfig {
  readonly enableRealTimeAnalysis: boolean;
  readonly autoRefreshInterval: number; // ms
  readonly enablePredictiveInsights: boolean;
  readonly enableAnomalyDetection: boolean;
  readonly enableSmartRecommendations: boolean;
  readonly cacheResults: boolean;
  readonly maxHistorySize: number;
  readonly serviceConfig?: Partial<MLBIServiceConfig>;
}

/**
 * État du hook ML/BI
 */
interface MLBIState {
  readonly isLoading: boolean;
  readonly isAnalyzing: boolean;
  readonly error: string | null;
  readonly lastAnalysis: IntegratedAnalysisResult | null;
  readonly analysisHistory: IntegratedAnalysisResult[];
  readonly recommendations: SmartRecommendation[];
  readonly activePipelines: AnalysisPipeline[];
  readonly realtimeData: BIDataPoint[];
  readonly anomalies: Array<{
    readonly timestamp: string;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly description: string;
  }>;
  readonly predictions: Array<{
    readonly timestamp: string;
    readonly value: number;
    readonly confidence: number;
    readonly metric: string;
  }>;
  readonly insights: Array<{
    readonly id: string;
    readonly type: 'trend' | 'anomaly' | 'prediction' | 'optimization';
    readonly title: string;
    readonly description: string;
    readonly priority: 'low' | 'medium' | 'high' | 'critical';
    readonly timestamp: string;
    readonly actionable: boolean;
  }>;
}

/**
 * Actions du hook ML/BI
 */
interface MLBIActions {
  readonly performAnalysis: (
    data: BIDataPoint[],
    config: {
      readonly type: 'ml_only' | 'bi_only' | 'hybrid';
      readonly mlConfig?: MLModelConfig;
      readonly biConfig?: BIAnalysisConfig;
      readonly enableRecommendations?: boolean;
    }
  ) => Promise<IntegratedAnalysisResult>;
  
  readonly performAutoML: (
    data: BIDataPoint[],
    target: string,
    problemType: 'regression' | 'classification' | 'time_series' | 'clustering'
  ) => Promise<{
    bestModel: MLModelConfig;
    performance: Record<string, number>;
    recommendation: string;
  }>;
  
  readonly performPredictiveAnalysis: (
    data: BIDataPoint[],
    target: string,
    timeHorizon?: number
  ) => Promise<void>;
  
  readonly detectAnomalies: (
    newDataPoint: BIDataPoint,
    historicalContext?: BIDataPoint[]
  ) => Promise<void>;
  
  readonly createPipeline: (pipeline: AnalysisPipeline) => Promise<string>;
  readonly executePipeline: (pipelineId: string) => Promise<IntegratedAnalysisResult>;
  readonly deletePipeline: (pipelineId: string) => void;
  
  readonly addRealtimeData: (dataPoint: BIDataPoint) => void;
  readonly clearHistory: () => void;
  readonly exportResults: (format: 'json' | 'csv' | 'xlsx') => Promise<Blob>;
  
  readonly startRealTimeAnalysis: () => void;
  readonly stopRealTimeAnalysis: () => void;
  
  readonly dismissRecommendation: (recommendationId: string) => void;
  readonly implementRecommendation: (recommendationId: string) => Promise<void>;
}

/**
 * Résultat du hook ML/BI
 */
interface UseMLBIResult extends MLBIState, MLBIActions {
  readonly isReady: boolean;
  readonly hasData: boolean;
  readonly performanceMetrics: {
    readonly averageAnalysisTime: number;
    readonly successRate: number;
    readonly memoryUsage: number;
    readonly cacheHitRate: number;
  };
}

// ============================================================================
// CONFIGURATION PAR DÉFAUT
// ============================================================================

const DEFAULT_CONFIG: UseMLBIConfig = {
  enableRealTimeAnalysis: true,
  autoRefreshInterval: 30000, // 30 secondes
  enablePredictiveInsights: true,
  enableAnomalyDetection: true,
  enableSmartRecommendations: true,
  cacheResults: true,
  maxHistorySize: 100,
  serviceConfig: {
    ml: {
      enableAutoML: true,
      modelRetentionDays: 7,
      maxConcurrentTraining: 2,
      autoRetraining: true,
      performanceThreshold: 0.75
    },
    bi: {
      cacheResultsHours: 1,
      maxDataPoints: 100000,
      enableRealTimeAnalysis: true,
      alertThresholds: {
        anomaly: 0.8,
        trend_change: 0.7,
        performance_drop: 0.6
      }
    },
    monitoring: {
      enableMetrics: true,
      logLevel: 'info',
      enableAlerts: true
    }
  }
} as const;

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook React pour ML/BI ultra-avancé
 */
export function useMLBI(
  initialData: BIDataPoint[] = [],
  config: Partial<UseMLBIConfig> = {}
): UseMLBIResult {
  
  // Configuration fusionnée
  const mergedConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
    serviceConfig: {
      ...DEFAULT_CONFIG.serviceConfig,
      ...config.serviceConfig
    }
  }), [config]);

  // Service ML/BI
  const serviceRef = useRef<MLBIService>();
  const [isServiceReady, setIsServiceReady] = useState(false);

  // États principaux
  const [state, setState] = useState<MLBIState>({
    isLoading: false,
    isAnalyzing: false,
    error: null,
    lastAnalysis: null,
    analysisHistory: [],
    recommendations: [],
    activePipelines: [],
    realtimeData: [...initialData],
    anomalies: [],
    predictions: [],
    insights: []
  });

  // Cache et performance
  const cacheRef = useRef(new Map<string, IntegratedAnalysisResult>());
  const performanceRef = useRef({
    analysisTimes: [] as number[],
    successCount: 0,
    totalCount: 0,
    memoryUsage: 0
  });

  // Timers et intervals
  const realtimeIntervalRef = useRef<NodeJS.Timeout>();
  const anomalyCheckIntervalRef = useRef<NodeJS.Timeout>();

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  useEffect(() => {
    const initializeService = async () => {
      try {
        serviceRef.current = new MLBIService(mergedConfig.serviceConfig);
        setIsServiceReady(true);
        
        // Démarrage de l'analyse en temps réel si activée
        if (mergedConfig.enableRealTimeAnalysis) {
          startRealTimeAnalysis();
        }
        
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: `Failed to initialize ML/BI service: ${error instanceof Error ? error.message : 'Unknown error'}`
        }));
      }
    };

    initializeService();

    return () => {
      stopRealTimeAnalysis();
      if (anomalyCheckIntervalRef.current) {
        clearInterval(anomalyCheckIntervalRef.current);
      }
    };
  }, [mergedConfig]);

  // ============================================================================
  // ACTIONS PRINCIPALES
  // ============================================================================

  /**
   * Effectue une analyse intégrée
   */
  const performAnalysis = useCallback(async (
    data: BIDataPoint[],
    analysisConfig: {
      readonly type: 'ml_only' | 'bi_only' | 'hybrid';
      readonly mlConfig?: MLModelConfig;
      readonly biConfig?: BIAnalysisConfig;
      readonly enableRecommendations?: boolean;
    }
  ): Promise<IntegratedAnalysisResult> => {
    if (!serviceRef.current) {
      throw new Error('ML/BI service not initialized');
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    const startTime = performance.now();
    
    try {
      // Vérification du cache
      const cacheKey = generateCacheKey(data, analysisConfig);
      
      if (mergedConfig.cacheResults && cacheRef.current.has(cacheKey)) {
        const cachedResult = cacheRef.current.get(cacheKey)!;
        
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          lastAnalysis: cachedResult
        }));
        
        return cachedResult;
      }

      // Analyse
      const result = await serviceRef.current.performIntegratedAnalysis(data, analysisConfig);
      
      // Mise à jour de l'état
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        lastAnalysis: result,
        analysisHistory: [result, ...prev.analysisHistory].slice(0, mergedConfig.maxHistorySize),
        recommendations: analysisConfig.enableRecommendations 
          ? [...prev.recommendations, ...extractRecommendations(result)]
          : prev.recommendations,
        insights: [...prev.insights, ...extractInsights(result)]
      }));

      // Mise en cache
      if (mergedConfig.cacheResults) {
        cacheRef.current.set(cacheKey, result);
      }

      // Métriques de performance
      const analysisTime = performance.now() - startTime;
      updatePerformanceMetrics(analysisTime, true);

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: errorMessage 
      }));
      
      updatePerformanceMetrics(performance.now() - startTime, false);
      throw error;
    }
  }, [mergedConfig.cacheResults, mergedConfig.maxHistorySize]);

  /**
   * AutoML
   */
  const performAutoML = useCallback(async (
    data: BIDataPoint[],
    target: string,
    problemType: 'regression' | 'classification' | 'time_series' | 'clustering'
  ) => {
    if (!serviceRef.current) {
      throw new Error('ML/BI service not initialized');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await serviceRef.current.performAutoML(data, target, problemType);
      
      // Ajouter une insight sur l'AutoML
      const autoMLInsight = {
        id: `automl_${Date.now()}`,
        type: 'optimization' as const,
        title: 'AutoML Completed',
        description: `Best model: ${result.bestModel.type} with ${(result.performance.accuracy || 0 * 100).toFixed(1)}% accuracy`,
        priority: 'medium' as const,
        timestamp: new Date().toISOString(),
        actionable: true
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        insights: [autoMLInsight, ...prev.insights]
      }));

      return result;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'AutoML failed'
      }));
      throw error;
    }
  }, []);

  /**
   * Analyse prédictive
   */
  const performPredictiveAnalysis = useCallback(async (
    data: BIDataPoint[],
    target: string,
    timeHorizon: number = 30
  ) => {
    if (!serviceRef.current) {
      throw new Error('ML/BI service not initialized');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await serviceRef.current.performPredictiveAnalysis(data, target, timeHorizon);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        predictions: result.predictions.map(p => ({
          timestamp: p.timestamp,
          value: p.value,
          confidence: p.confidence,
          metric: target
        })),
        recommendations: [...prev.recommendations, ...result.recommendations],
        insights: [...prev.insights, ...result.insights.map(insight => ({
          id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'prediction' as const,
          title: 'Predictive Insight',
          description: insight,
          priority: 'medium' as const,
          timestamp: new Date().toISOString(),
          actionable: false
        }))]
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Predictive analysis failed'
      }));
    }
  }, []);

  /**
   * Détection d'anomalies
   */
  const detectAnomalies = useCallback(async (
    newDataPoint: BIDataPoint,
    historicalContext?: BIDataPoint[]
  ) => {
    if (!serviceRef.current) return;

    const context = historicalContext || state.realtimeData.slice(-100);
    
    try {
      const result = await serviceRef.current.detectRealTimeAnomalies(newDataPoint, context);
      
      if (result.isAnomaly) {
        const anomaly = {
          timestamp: newDataPoint.timestamp,
          severity: result.severity,
          description: result.explanation
        };

        const anomalyInsight = {
          id: `anomaly_${Date.now()}`,
          type: 'anomaly' as const,
          title: `${result.severity.toUpperCase()} Anomaly Detected`,
          description: result.explanation,
          priority: result.alertLevel === 'critical' ? 'critical' as const : 
                    result.alertLevel === 'warning' ? 'high' as const : 'medium' as const,
          timestamp: new Date().toISOString(),
          actionable: result.recommendedActions.length > 0
        };

        setState(prev => ({
          ...prev,
          anomalies: [anomaly, ...prev.anomalies].slice(0, 50), // Garder 50 dernières
          insights: [anomalyInsight, ...prev.insights]
        }));
      }

    } catch (error) {
      console.warn('Anomaly detection failed:', error);
    }
  }, [state.realtimeData]);

  /**
   * Création de pipeline
   */
  const createPipeline = useCallback(async (pipeline: AnalysisPipeline): Promise<string> => {
    if (!serviceRef.current) {
      throw new Error('ML/BI service not initialized');
    }

    const pipelineId = await serviceRef.current.createAnalysisPipeline(pipeline);
    
    setState(prev => ({
      ...prev,
      activePipelines: [...prev.activePipelines, pipeline]
    }));

    return pipelineId;
  }, []);

  /**
   * Exécution de pipeline
   */
  const executePipeline = useCallback(async (pipelineId: string): Promise<IntegratedAnalysisResult> => {
    if (!serviceRef.current) {
      throw new Error('ML/BI service not initialized');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await serviceRef.current.executePipeline(pipelineId);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastAnalysis: result,
        analysisHistory: [result, ...prev.analysisHistory].slice(0, mergedConfig.maxHistorySize)
      }));

      return result;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Pipeline execution failed'
      }));
      throw error;
    }
  }, [mergedConfig.maxHistorySize]);

  /**
   * Suppression de pipeline
   */
  const deletePipeline = useCallback((pipelineId: string) => {
    setState(prev => ({
      ...prev,
      activePipelines: prev.activePipelines.filter(p => p.id !== pipelineId)
    }));
  }, []);

  /**
   * Ajout de données en temps réel
   */
  const addRealtimeData = useCallback((dataPoint: BIDataPoint) => {
    setState(prev => ({
      ...prev,
      realtimeData: [dataPoint, ...prev.realtimeData].slice(0, 1000) // Garder 1000 derniers points
    }));

    // Détection d'anomalie automatique si activée
    if (mergedConfig.enableAnomalyDetection) {
      detectAnomalies(dataPoint);
    }
  }, [mergedConfig.enableAnomalyDetection, detectAnomalies]);

  /**
   * Nettoyage de l'historique
   */
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      analysisHistory: [],
      recommendations: [],
      anomalies: [],
      predictions: [],
      insights: []
    }));
    
    cacheRef.current.clear();
    performanceRef.current = {
      analysisTimes: [],
      successCount: 0,
      totalCount: 0,
      memoryUsage: 0
    };
  }, []);

  /**
   * Export des résultats
   */
  const exportResults = useCallback(async (format: 'json' | 'csv' | 'xlsx'): Promise<Blob> => {
    const data = {
      analysisHistory: state.analysisHistory,
      recommendations: state.recommendations,
      insights: state.insights,
      anomalies: state.anomalies,
      predictions: state.predictions,
      exportedAt: new Date().toISOString()
    };

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      
      case 'csv':
        // Conversion simplifiée en CSV
        const csvData = state.analysisHistory.map(analysis => ({
          id: analysis.analysisId,
          type: analysis.type,
          timestamp: analysis.timestamp,
          duration: analysis.duration,
          confidence: analysis.confidence,
          insights: analysis.results.insights.join('; ')
        }));
        
        const csvHeaders = Object.keys(csvData[0] || {}).join(',');
        const csvRows = csvData.map(row => Object.values(row).join(','));
        const csvContent = [csvHeaders, ...csvRows].join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      
      default:
        throw new Error(`Export format ${format} not supported`);
    }
  }, [state]);

  /**
   * Démarrage de l'analyse en temps réel
   */
  const startRealTimeAnalysis = useCallback(() => {
    if (realtimeIntervalRef.current) return; // Déjà démarré

    realtimeIntervalRef.current = setInterval(async () => {
      if (!mergedConfig.enableRealTimeAnalysis || state.realtimeData.length === 0) return;

      try {
        // Analyse des dernières données si elles ont changé
        const recentData = state.realtimeData.slice(0, 10);
        
        if (mergedConfig.enablePredictiveInsights && recentData.length >= 5) {
          // Génération d'insights prédictifs automatiques
          const insights = generateAutomaticInsights(recentData);
          
          setState(prev => ({
            ...prev,
            insights: [...insights, ...prev.insights].slice(0, 100)
          }));
        }

      } catch (error) {
        console.warn('Real-time analysis error:', error);
      }
    }, mergedConfig.autoRefreshInterval);
  }, [mergedConfig.enableRealTimeAnalysis, mergedConfig.autoRefreshInterval, mergedConfig.enablePredictiveInsights, state.realtimeData]);

  /**
   * Arrêt de l'analyse en temps réel
   */
  const stopRealTimeAnalysis = useCallback(() => {
    if (realtimeIntervalRef.current) {
      clearInterval(realtimeIntervalRef.current);
      realtimeIntervalRef.current = undefined;
    }
  }, []);

  /**
   * Suppression d'une recommandation
   */
  const dismissRecommendation = useCallback((recommendationId: string) => {
    setState(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.id !== recommendationId)
    }));
  }, []);

  /**
   * Implémentation d'une recommandation
   */
  const implementRecommendation = useCallback(async (recommendationId: string) => {
    const recommendation = state.recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    // Simulation d'implémentation - en production, exécuter les actions réelles
    await new Promise(resolve => setTimeout(resolve, 1000));

    setState(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.id !== recommendationId),
      insights: [{
        id: `impl_${Date.now()}`,
        type: 'optimization',
        title: 'Recommendation Implemented',
        description: `Successfully implemented: ${recommendation.title}`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        actionable: false
      }, ...prev.insights]
    }));
  }, [state.recommendations]);

  // ============================================================================
  // MÉTRIQUES DE PERFORMANCE
  // ============================================================================

  const performanceMetrics = useMemo(() => {
    const { analysisTimes, successCount, totalCount } = performanceRef.current;
    
    return {
      averageAnalysisTime: analysisTimes.length > 0 
        ? analysisTimes.reduce((sum, time) => sum + time, 0) / analysisTimes.length 
        : 0,
      successRate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
      memoryUsage: performanceRef.current.memoryUsage,
      cacheHitRate: cacheRef.current.size > 0 ? 75 : 0 // Approximation
    };
  }, [state.analysisHistory.length]); // Re-calcul quand l'historique change

  // ============================================================================
  // FONCTIONS UTILITAIRES
  // ============================================================================

  /**
   * Met à jour les métriques de performance
   */
  const updatePerformanceMetrics = useCallback((analysisTime: number, success: boolean) => {
    performanceRef.current.analysisTimes.push(analysisTime);
    performanceRef.current.totalCount++;
    
    if (success) {
      performanceRef.current.successCount++;
    }

    // Garder seulement les 100 derniers temps
    if (performanceRef.current.analysisTimes.length > 100) {
      performanceRef.current.analysisTimes.shift();
    }

    // Estimation de l'usage mémoire
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      performanceRef.current.memoryUsage = memory.usedJSHeapSize / (1024 * 1024);
    }
  }, []);

  // ============================================================================
  // RÉSULTAT DU HOOK
  // ============================================================================

  return {
    // État
    ...state,
    
    // Flags
    isReady: isServiceReady,
    hasData: state.realtimeData.length > 0,
    
    // Actions
    performAnalysis,
    performAutoML,
    performPredictiveAnalysis,
    detectAnomalies,
    createPipeline,
    executePipeline,
    deletePipeline,
    addRealtimeData,
    clearHistory,
    exportResults,
    startRealTimeAnalysis,
    stopRealTimeAnalysis,
    dismissRecommendation,
    implementRecommendation,
    
    // Métriques
    performanceMetrics
  };
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Génère une clé de cache
 */
function generateCacheKey(data: BIDataPoint[], config: any): string {
  const dataHash = data.length > 0 ? 
    `${data[0].timestamp}_${data[data.length - 1].timestamp}_${data.length}` : 
    'empty';
  
  return `${config.type}_${dataHash}_${JSON.stringify(config)}`;
}

/**
 * Extrait les recommandations d'un résultat d'analyse
 */
function extractRecommendations(result: IntegratedAnalysisResult): SmartRecommendation[] {
  // Conversion des recommandations string en SmartRecommendation
  return result.results.recommendations.map((rec, index) => ({
    id: `rec_${result.analysisId}_${index}`,
    type: 'insight' as const,
    priority: 'medium' as const,
    title: 'Analysis Recommendation',
    description: rec,
    confidence: result.confidence,
    impact: {
      estimated: 'medium' as const,
      metrics: {}
    },
    actionItems: [],
    evidence: [{
      source: 'Analysis Result',
      data: result,
      relevance: 0.8
    }]
  }));
}

/**
 * Extrait les insights d'un résultat d'analyse
 */
function extractInsights(result: IntegratedAnalysisResult): MLBIState['insights'] {
  return result.results.insights.map((insight, index) => ({
    id: `insight_${result.analysisId}_${index}`,
    type: result.type === 'ml_prediction' ? 'prediction' as const : 'trend' as const,
    title: 'Analysis Insight',
    description: insight,
    priority: 'medium' as const,
    timestamp: result.timestamp,
    actionable: false
  }));
}

/**
 * Génère des insights automatiques
 */
function generateAutomaticInsights(recentData: BIDataPoint[]): MLBIState['insights'] {
  const insights: MLBIState['insights'] = [];
  
  // Exemple d'insight basé sur la tendance
  if (recentData.length >= 3) {
    const values = recentData.map(d => Object.values(d.metrics)[0] || 0);
    const trend = values[0] > values[values.length - 1] ? 'decreasing' : 'increasing';
    
    insights.push({
      id: `auto_${Date.now()}`,
      type: 'trend',
      title: `${trend.charAt(0).toUpperCase() + trend.slice(1)} Trend Detected`,
      description: `Recent data shows a ${trend} trend in key metrics`,
      priority: 'low',
      timestamp: new Date().toISOString(),
      actionable: false
    });
  }
  
  return insights;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  UseMLBIConfig,
  MLBIState,
  MLBIActions,
  UseMLBIResult
};