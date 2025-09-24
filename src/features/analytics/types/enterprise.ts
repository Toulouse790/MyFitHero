/**
 * ================================================
 * ANALYTICS ENTERPRISE TYPES - 6★/5 EXCELLENCE
 * ================================================
 * 
 * Types ultra-rigoureux pour analytics enterprise-grade
 * avec brand types, validation runtime, et sécurité maximale
 */

// ========================================
// BRAND TYPES POUR SÉCURITÉ MAXIMALE
// ========================================

declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

// IDs Typés
export type UserId = Brand<string, 'UserId'>;
export type AnalyticsId = Brand<string, 'AnalyticsId'>;
export type DashboardId = Brand<string, 'DashboardId'>;
export type MetricId = Brand<string, 'MetricId'>;
export type ReportId = Brand<string, 'ReportId'>;

// Timestamps Typés
export type Timestamp = Brand<number, 'Timestamp'>;
export type DateISOString = Brand<string, 'DateISOString'>;

// Metrics Typés
export type PercentageValue = Brand<number, 'PercentageValue'>; // 0-100
export type ScoreValue = Brand<number, 'ScoreValue'>; // 0-100
export type CaloriesValue = Brand<number, 'CaloriesValue'>; // > 0
export type DurationMinutes = Brand<number, 'DurationMinutes'>; // > 0
export type WeightKg = Brand<number, 'WeightKg'>; // > 0

// ========================================
// ENTERPRISE ENUMS
// ========================================

export enum AnalyticsPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum MetricType {
  // Fitness Metrics
  TOTAL_WORKOUTS = 'total_workouts',
  CALORIES_BURNED = 'calories_burned',
  WORKOUT_DURATION = 'workout_duration',
  FITNESS_SCORE = 'fitness_score',
  
  // Body Composition
  WEIGHT = 'weight',
  BODY_FAT = 'body_fat_percentage',
  MUSCLE_MASS = 'muscle_mass',
  
  // Health Metrics
  SLEEP_QUALITY = 'sleep_quality',
  HYDRATION_LEVEL = 'hydration_level',
  RECOVERY_SCORE = 'recovery_score',
  
  // Performance Metrics
  STRENGTH_GAINS = 'strength_gains',
  ENDURANCE_IMPROVEMENT = 'endurance_improvement',
  CONSISTENCY_SCORE = 'consistency_score'
}

export enum TrendDirection {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable',
  FLUCTUATING = 'fluctuating',
  UNKNOWN = 'unknown'
}

export enum DashboardWidgetType {
  METRIC_CARD = 'metric_card',
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  PROGRESS_RING = 'progress_ring',
  HEATMAP = 'heatmap',
  TABLE = 'table',
  KPI_SUMMARY = 'kpi_summary'
}

export enum AnalyticsEventType {
  USER_ACTION = 'user_action',
  SYSTEM_EVENT = 'system_event',
  PERFORMANCE_METRIC = 'performance_metric',
  ERROR_EVENT = 'error_event',
  BUSINESS_METRIC = 'business_metric'
}

export enum DataGranularity {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export enum AnalyticsPermission {
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  MANAGE_DASHBOARDS = 'manage_dashboards',
  VIEW_USER_ANALYTICS = 'view_user_analytics',
  MANAGE_ENTERPRISE_ANALYTICS = 'manage_enterprise_analytics'
}

// ========================================
// CORE ANALYTICS INTERFACES
// ========================================

export interface MetricValue {
  readonly id: MetricId;
  readonly type: MetricType;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: Timestamp;
  readonly confidence: PercentageValue;
  readonly metadata?: Record<string, unknown>;
}

export interface AnalyticsTimeFrame {
  readonly startDate: DateISOString;
  readonly endDate: DateISOString;
  readonly period: AnalyticsPeriod;
  readonly granularity: DataGranularity;
  readonly timezone: string;
}

export interface TrendAnalysis {
  readonly direction: TrendDirection;
  readonly changePercentage: PercentageValue;
  readonly velocity: number; // Rate of change
  readonly confidence: PercentageValue;
  readonly seasonality?: 'weekly' | 'monthly' | 'none';
  readonly forecast?: MetricValue[];
}

export interface ComparativeAnalysis {
  readonly current: MetricValue;
  readonly previous: MetricValue;
  readonly benchmark?: MetricValue;
  readonly percentile?: PercentageValue;
  readonly trend: TrendAnalysis;
}

// ========================================
// USER ANALYTICS INTERFACES
// ========================================

export interface UserAnalyticsProfile {
  readonly userId: UserId;
  readonly createdAt: DateISOString;
  readonly lastUpdated: DateISOString;
  readonly permissions: readonly AnalyticsPermission[];
  readonly preferences: UserAnalyticsPreferences;
  readonly metadata: UserAnalyticsMetadata;
}

export interface UserAnalyticsPreferences {
  readonly defaultPeriod: AnalyticsPeriod;
  readonly preferredMetrics: readonly MetricType[];
  readonly dashboardLayout: DashboardLayout;
  readonly notificationSettings: NotificationSettings;
  readonly exportFormats: readonly ('csv' | 'pdf' | 'excel' | 'json')[];
}

export interface UserAnalyticsMetadata {
  readonly fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  readonly goals: readonly string[];
  readonly demographics?: {
    readonly ageGroup: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
    readonly region: string;
  };
}

export interface DashboardLayout {
  readonly columns: number;
  readonly widgets: readonly DashboardWidget[];
  readonly customizations: Record<string, unknown>;
}

export interface NotificationSettings {
  readonly milestoneAlerts: boolean;
  readonly weeklyReports: boolean;
  readonly performanceWarnings: boolean;
  readonly achievementNotifications: boolean;
}

// ========================================
// DASHBOARD INTERFACES
// ========================================

export interface DashboardWidget {
  readonly id: DashboardId;
  readonly type: DashboardWidgetType;
  readonly title: string;
  readonly config: DashboardWidgetConfig;
  readonly position: WidgetPosition;
  readonly permissions: readonly AnalyticsPermission[];
  readonly lastUpdated: DateISOString;
}

export interface DashboardWidgetConfig {
  readonly metrics: readonly MetricType[];
  readonly timeFrame: AnalyticsTimeFrame;
  readonly visualization: VisualizationConfig;
  readonly filters?: AnalyticsFilters;
  readonly realTimeEnabled: boolean;
}

export interface WidgetPosition {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface VisualizationConfig {
  readonly colors: readonly string[];
  readonly theme: 'light' | 'dark' | 'auto';
  readonly animations: boolean;
  readonly responsive: boolean;
  readonly legend: LegendConfig;
}

export interface LegendConfig {
  readonly show: boolean;
  readonly position: 'top' | 'bottom' | 'left' | 'right';
  readonly format: 'short' | 'long';
}

// ========================================
// BUSINESS INTELLIGENCE INTERFACES
// ========================================

export interface BusinessIntelligenceReport {
  readonly id: ReportId;
  readonly name: string;
  readonly description: string;
  readonly category: 'user_analytics' | 'business_metrics' | 'performance' | 'health';
  readonly insights: readonly AnalyticsInsight[];
  readonly recommendations: readonly AnalyticsRecommendation[];
  readonly confidence: PercentageValue;
  readonly generatedAt: DateISOString;
}

export interface AnalyticsInsight {
  readonly id: string;
  readonly type: 'achievement' | 'trend' | 'anomaly' | 'prediction' | 'benchmark';
  readonly severity: 'info' | 'warning' | 'success' | 'error';
  readonly title: string;
  readonly description: string;
  readonly value?: MetricValue;
  readonly confidence: PercentageValue;
  readonly supportingData: readonly MetricValue[];
}

export interface AnalyticsRecommendation {
  readonly id: string;
  readonly category: 'workout' | 'nutrition' | 'recovery' | 'habit' | 'goal';
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
  readonly title: string;
  readonly description: string;
  readonly actionItems: readonly ActionItem[];
  readonly expectedImpact: ImpactAssessment;
  readonly timeframe: 'immediate' | 'short_term' | 'long_term';
}

export interface ActionItem {
  readonly id: string;
  readonly description: string;
  readonly type: 'behavior' | 'setting' | 'goal' | 'routine';
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly estimatedTime: DurationMinutes;
}

export interface ImpactAssessment {
  readonly metrics: readonly MetricType[];
  readonly expectedImprovement: PercentageValue;
  readonly confidence: PercentageValue;
  readonly timeToSeeResults: DurationMinutes;
}

// ========================================
// ANALYTICS FILTERS & QUERIES
// ========================================

export interface AnalyticsFilters {
  readonly userId?: UserId;
  readonly metrics?: readonly MetricType[];
  readonly timeFrame?: AnalyticsTimeFrame;
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly tags?: readonly string[];
  readonly excludeOutliers?: boolean;
}

export interface AnalyticsQuery {
  readonly filters: AnalyticsFilters;
  readonly aggregation: AggregationConfig;
  readonly sorting: SortingConfig;
  readonly pagination: PaginationConfig;
}

export interface AggregationConfig {
  readonly groupBy: DataGranularity;
  readonly functions: readonly ('sum' | 'avg' | 'min' | 'max' | 'count')[];
  readonly includeZeroes: boolean;
}

export interface SortingConfig {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
  readonly nullsLast: boolean;
}

export interface PaginationConfig {
  readonly offset: number;
  readonly limit: number;
  readonly total?: number;
}

// ========================================
// REAL-TIME ANALYTICS
// ========================================

export interface RealTimeMetric {
  readonly metricId: MetricId;
  readonly userId: UserId;
  readonly value: MetricValue;
  readonly streamId: string;
  readonly queuePosition?: number;
  readonly processingLatency: number; // milliseconds
}

export interface AnalyticsStream {
  readonly streamId: string;
  readonly userId: UserId;
  readonly metrics: readonly MetricType[];
  readonly config: StreamConfig;
  readonly status: StreamStatus;
  readonly lastActivity: Timestamp;
}

export interface StreamConfig {
  readonly batchSize: number;
  readonly flushInterval: number; // milliseconds
  readonly compression: boolean;
  readonly retryPolicy: RetryPolicy;
}

export interface StreamStatus {
  readonly isActive: boolean;
  readonly messagesProcessed: number;
  readonly errorsCount: number;
  readonly averageLatency: number;
  readonly lastError?: string;
}

export interface RetryPolicy {
  readonly maxRetries: number;
  readonly backoffStrategy: 'linear' | 'exponential';
  readonly initialDelay: number;
  readonly maxDelay: number;
}

// ========================================
// TYPE GUARDS & VALIDATORS
// ========================================

export const isUserId = (value: unknown): value is UserId => {
  return typeof value === 'string' && value.length > 0 && /^[a-zA-Z0-9_-]+$/.test(value);
};

export const isPercentageValue = (value: unknown): value is PercentageValue => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

export const isScoreValue = (value: unknown): value is ScoreValue => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

export const isCaloriesValue = (value: unknown): value is CaloriesValue => {
  return typeof value === 'number' && value > 0 && value < 10000;
};

export const isDurationMinutes = (value: unknown): value is DurationMinutes => {
  return typeof value === 'number' && value >= 0 && value < 1440; // Max 24h
};

export const isWeightKg = (value: unknown): value is WeightKg => {
  return typeof value === 'number' && value > 0 && value < 500;
};

export const isDateISOString = (value: unknown): value is DateISOString => {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
};

export const isTimestamp = (value: unknown): value is Timestamp => {
  return typeof value === 'number' && value > 0 && value < Date.now() + 86400000; // Max 1 day in future
};

// ========================================
// UTILITY TYPES
// ========================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// ========================================
// ERROR TYPES
// ========================================

export enum AnalyticsErrorCode {
  INVALID_USER_ID = 'INVALID_USER_ID',
  INVALID_METRIC_TYPE = 'INVALID_METRIC_TYPE',
  INVALID_TIME_FRAME = 'INVALID_TIME_FRAME',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

export interface AnalyticsError {
  readonly code: AnalyticsErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Timestamp;
  readonly userId?: UserId;
  readonly stackTrace?: string;
}

export class AnalyticsValidationError extends Error {
  constructor(
    public readonly code: AnalyticsErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AnalyticsValidationError';
  }
}

// ========================================
// BRAND TYPE CONSTRUCTORS
// ========================================

export const createUserId = (value: string): UserId => {
  if (!isUserId(value)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.INVALID_USER_ID,
      `Invalid user ID: ${value}`
    );
  }
  return value as UserId;
};

export const createPercentageValue = (value: number): PercentageValue => {
  if (!isPercentageValue(value)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.VALIDATION_ERROR,
      `Invalid percentage value: ${value}. Must be between 0 and 100.`
    );
  }
  return value as PercentageValue;
};

export const createScoreValue = (value: number): ScoreValue => {
  if (!isScoreValue(value)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.VALIDATION_ERROR,
      `Invalid score value: ${value}. Must be between 0 and 100.`
    );
  }
  return value as ScoreValue;
};

export const createCaloriesValue = (value: number): CaloriesValue => {
  if (!isCaloriesValue(value)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.VALIDATION_ERROR,
      `Invalid calories value: ${value}. Must be positive and realistic.`
    );
  }
  return value as CaloriesValue;
};

export const createTimestamp = (value?: number): Timestamp => {
  const timestamp = value ?? Date.now();
  if (!isTimestamp(timestamp)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.VALIDATION_ERROR,
      `Invalid timestamp: ${timestamp}`
    );
  }
  return timestamp as Timestamp;
};

export const createDateISOString = (value: string | Date): DateISOString => {
  const isoString = typeof value === 'string' ? value : value.toISOString();
  if (!isDateISOString(isoString)) {
    throw new AnalyticsValidationError(
      AnalyticsErrorCode.VALIDATION_ERROR,
      `Invalid ISO date string: ${isoString}`
    );
  }
  return isoString as DateISOString;
};