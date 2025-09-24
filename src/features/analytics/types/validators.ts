/**
 * ================================================
 * ANALYTICS VALIDATION SYSTEM - 6★/5 ENTERPRISE
 * ================================================
 * 
 * Système de validation runtime ultra-rigoureux pour analytics
 * avec type safety, business rules validation, et security checks
 */

import {
  UserId,
  MetricValue,
  AnalyticsTimeFrame,
  AnalyticsQuery,
  DashboardWidget,
  RealTimeMetric,
  AnalyticsError,
  AnalyticsErrorCode,
  AnalyticsValidationError,
  MetricType,
  AnalyticsPeriod,
  DashboardWidgetType,
  createUserId,
  createPercentageValue,
  createScoreValue,
  createCaloriesValue,
  createTimestamp,
  createDateISOString,
  isUserId,
  isPercentageValue,
  isScoreValue,
  isCaloriesValue,
  isDurationMinutes,
  isWeightKg,
  isDateISOString,
  isTimestamp
} from './enterprise';

// ========================================
// VALIDATION RESULT TYPES
// ========================================

export interface ValidationResult<T = unknown> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly sanitized?: Partial<T>;
}

export interface ValidationError {
  readonly field: string;
  readonly code: AnalyticsErrorCode;
  readonly message: string;
  readonly value?: unknown;
  readonly constraint?: string;
}

export interface ValidationWarning {
  readonly field: string;
  readonly message: string;
  readonly suggestion?: string;
}

// ========================================
// VALIDATION SCHEMAS
// ========================================

export interface ValidationSchema<T> {
  readonly fields: Record<keyof T, FieldValidator>;
  readonly customValidators?: readonly CustomValidator<T>[];
  readonly businessRules?: readonly BusinessRule<T>[];
}

export interface FieldValidator {
  readonly type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  readonly required: boolean;
  readonly constraints?: ValidationConstraints;
  readonly sanitize?: SanitizationFunction;
  readonly customValidation?: (value: unknown) => ValidationResult;
}

export interface ValidationConstraints {
  // String constraints
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly enum?: readonly string[];
  
  // Number constraints
  readonly min?: number;
  readonly max?: number;
  readonly integer?: boolean;
  readonly precision?: number;
  
  // Array constraints
  readonly minItems?: number;
  readonly maxItems?: number;
  readonly uniqueItems?: boolean;
  
  // Date constraints
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly futureOnly?: boolean;
  readonly pastOnly?: boolean;
}

export type SanitizationFunction = (value: unknown) => unknown;

export interface CustomValidator<T> {
  readonly name: string;
  readonly validate: (data: T) => ValidationResult;
  readonly priority: number;
}

export interface BusinessRule<T> {
  readonly name: string;
  readonly description: string;
  readonly validate: (data: T) => boolean;
  readonly errorMessage: string;
  readonly severity: 'error' | 'warning';
}

// ========================================
// CORE VALIDATOR CLASS
// ========================================

export class AnalyticsValidator {
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private static readonly MAX_REQUESTS_PER_WINDOW = 1000;
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();

  // ========================================
  // USER VALIDATION
  // ========================================

  static validateUserId(userId: unknown): ValidationResult<UserId> {
    const errors: ValidationError[] = [];
    
    try {
      if (!userId) {
        errors.push({
          field: 'userId',
          code: AnalyticsErrorCode.INVALID_USER_ID,
          message: 'User ID is required',
          value: userId
        });
        return { isValid: false, errors, warnings: [] };
      }

      const validUserId = createUserId(String(userId));
      return {
        isValid: true,
        data: validUserId,
        errors: [],
        warnings: []
      };
    } catch (error) {
      errors.push({
        field: 'userId',
        code: AnalyticsErrorCode.INVALID_USER_ID,
        message: error instanceof Error ? error.message : 'Invalid user ID',
        value: userId
      });
      return { isValid: false, errors, warnings: [] };
    }
  }

  // ========================================
  // METRIC VALUE VALIDATION
  // ========================================

  static validateMetricValue(metric: unknown): ValidationResult<MetricValue> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!metric || typeof metric !== 'object') {
      errors.push({
        field: 'metric',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Metric must be an object',
        value: metric
      });
      return { isValid: false, errors, warnings };
    }

    const m = metric as Record<string, unknown>;

    // Validate ID
    if (!m.id || typeof m.id !== 'string') {
      errors.push({
        field: 'metric.id',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Metric ID is required and must be a string',
        value: m.id
      });
    }

    // Validate type
    if (!m.type || !Object.values(MetricType).includes(m.type as MetricType)) {
      errors.push({
        field: 'metric.type',
        code: AnalyticsErrorCode.INVALID_METRIC_TYPE,
        message: 'Invalid metric type',
        value: m.type
      });
    }

    // Validate value
    if (typeof m.value !== 'number' || isNaN(m.value)) {
      errors.push({
        field: 'metric.value',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Metric value must be a valid number',
        value: m.value
      });
    } else {
      // Business rule validation for specific metric types
      const metricType = m.type as MetricType;
      const value = m.value as number;

      if (metricType === MetricType.CALORIES_BURNED && !isCaloriesValue(value)) {
        errors.push({
          field: 'metric.value',
          code: AnalyticsErrorCode.VALIDATION_ERROR,
          message: 'Calories value must be positive and realistic (< 10000)',
          value: value
        });
      }

      if (metricType === MetricType.FITNESS_SCORE && !isScoreValue(value)) {
        errors.push({
          field: 'metric.value',
          code: AnalyticsErrorCode.VALIDATION_ERROR,
          message: 'Fitness score must be between 0 and 100',
          value: value
        });
      }

      // Warning for extreme values
      if (value > 1000000) {
        warnings.push({
          field: 'metric.value',
          message: 'Metric value seems unusually high',
          suggestion: 'Verify the value is correct'
        });
      }
    }

    // Validate timestamp
    if (!m.timestamp || !isTimestamp(m.timestamp as number)) {
      errors.push({
        field: 'metric.timestamp',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Valid timestamp is required',
        value: m.timestamp
      });
    }

    // Validate confidence
    if (m.confidence !== undefined && !isPercentageValue(m.confidence as number)) {
      errors.push({
        field: 'metric.confidence',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Confidence must be a percentage (0-100)',
        value: m.confidence
      });
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    try {
      const validatedMetric: MetricValue = {
        id: m.id as string,
        type: m.type as MetricType,
        value: createCaloriesValue(m.value as number),
        unit: String(m.unit || ''),
        timestamp: createTimestamp(m.timestamp as number),
        confidence: m.confidence ? createPercentageValue(m.confidence as number) : createPercentageValue(100),
        metadata: m.metadata as Record<string, unknown> || {}
      };

      return {
        isValid: true,
        data: validatedMetric,
        errors: [],
        warnings
      };
    } catch (error) {
      errors.push({
        field: 'metric',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: error instanceof Error ? error.message : 'Validation failed',
        value: metric
      });
      return { isValid: false, errors, warnings };
    }
  }

  // ========================================
  // TIME FRAME VALIDATION
  // ========================================

  static validateTimeFrame(timeFrame: unknown): ValidationResult<AnalyticsTimeFrame> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!timeFrame || typeof timeFrame !== 'object') {
      errors.push({
        field: 'timeFrame',
        code: AnalyticsErrorCode.INVALID_TIME_FRAME,
        message: 'Time frame must be an object',
        value: timeFrame
      });
      return { isValid: false, errors, warnings };
    }

    const tf = timeFrame as Record<string, unknown>;

    // Validate start date
    if (!tf.startDate || !isDateISOString(tf.startDate as string)) {
      errors.push({
        field: 'timeFrame.startDate',
        code: AnalyticsErrorCode.INVALID_TIME_FRAME,
        message: 'Valid start date (ISO string) is required',
        value: tf.startDate
      });
    }

    // Validate end date
    if (!tf.endDate || !isDateISOString(tf.endDate as string)) {
      errors.push({
        field: 'timeFrame.endDate',
        code: AnalyticsErrorCode.INVALID_TIME_FRAME,
        message: 'Valid end date (ISO string) is required',
        value: tf.endDate
      });
    }

    // Validate period
    if (!tf.period || !Object.values(AnalyticsPeriod).includes(tf.period as AnalyticsPeriod)) {
      errors.push({
        field: 'timeFrame.period',
        code: AnalyticsErrorCode.INVALID_TIME_FRAME,
        message: 'Valid analytics period is required',
        value: tf.period
      });
    }

    // Business rule: end date must be after start date
    if (tf.startDate && tf.endDate) {
      const startDate = new Date(tf.startDate as string);
      const endDate = new Date(tf.endDate as string);
      
      if (endDate <= startDate) {
        errors.push({
          field: 'timeFrame',
          code: AnalyticsErrorCode.INVALID_TIME_FRAME,
          message: 'End date must be after start date',
          value: { startDate: tf.startDate, endDate: tf.endDate }
        });
      }

      // Warning for very long periods
      const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 365) {
        warnings.push({
          field: 'timeFrame',
          message: 'Time frame spans more than a year',
          suggestion: 'Consider using a shorter period for better performance'
        });
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    const validatedTimeFrame: AnalyticsTimeFrame = {
      startDate: createDateISOString(tf.startDate as string),
      endDate: createDateISOString(tf.endDate as string),
      period: tf.period as AnalyticsPeriod,
      granularity: tf.granularity as any || 'day',
      timezone: String(tf.timezone || 'UTC')
    };

    return {
      isValid: true,
      data: validatedTimeFrame,
      errors: [],
      warnings
    };
  }

  // ========================================
  // DASHBOARD WIDGET VALIDATION
  // ========================================

  static validateDashboardWidget(widget: unknown): ValidationResult<DashboardWidget> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!widget || typeof widget !== 'object') {
      errors.push({
        field: 'widget',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Widget must be an object',
        value: widget
      });
      return { isValid: false, errors, warnings };
    }

    const w = widget as Record<string, unknown>;

    // Validate required fields
    if (!w.id || typeof w.id !== 'string') {
      errors.push({
        field: 'widget.id',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Widget ID is required',
        value: w.id
      });
    }

    if (!w.type || !Object.values(DashboardWidgetType).includes(w.type as DashboardWidgetType)) {
      errors.push({
        field: 'widget.type',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Valid widget type is required',
        value: w.type
      });
    }

    if (!w.title || typeof w.title !== 'string' || w.title.trim().length === 0) {
      errors.push({
        field: 'widget.title',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Widget title is required',
        value: w.title
      });
    }

    // Validate position
    if (w.position && typeof w.position === 'object') {
      const pos = w.position as Record<string, unknown>;
      ['x', 'y', 'width', 'height'].forEach(prop => {
        if (typeof pos[prop] !== 'number' || pos[prop] < 0) {
          errors.push({
            field: `widget.position.${prop}`,
            code: AnalyticsErrorCode.VALIDATION_ERROR,
            message: `Position ${prop} must be a non-negative number`,
            value: pos[prop]
          });
        }
      });
    }

    return errors.length === 0 ? 
      { isValid: true, data: widget as DashboardWidget, errors: [], warnings } :
      { isValid: false, errors, warnings };
  }

  // ========================================
  // RATE LIMITING VALIDATION
  // ========================================

  static validateRateLimit(userId: UserId): ValidationResult<boolean> {
    const now = Date.now();
    const userKey = String(userId);
    const userLimit = this.requestCounts.get(userKey);

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or initialize counter
      this.requestCounts.set(userKey, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return { isValid: true, data: true, errors: [], warnings: [] };
    }

    if (userLimit.count >= this.MAX_REQUESTS_PER_WINDOW) {
      return {
        isValid: false,
        errors: [{
          field: 'rateLimit',
          code: AnalyticsErrorCode.RATE_LIMIT_EXCEEDED,
          message: `Rate limit exceeded. Max ${this.MAX_REQUESTS_PER_WINDOW} requests per minute.`,
          value: userLimit.count
        }],
        warnings: []
      };
    }

    // Increment counter
    userLimit.count++;
    return { isValid: true, data: true, errors: [], warnings: [] };
  }

  // ========================================
  // BULK VALIDATION
  // ========================================

  static validateBatch<T>(
    items: unknown[],
    validator: (item: unknown) => ValidationResult<T>
  ): ValidationResult<T[]> {
    if (!Array.isArray(items)) {
      return {
        isValid: false,
        errors: [{
          field: 'batch',
          code: AnalyticsErrorCode.VALIDATION_ERROR,
          message: 'Expected an array of items',
          value: items
        }],
        warnings: []
      };
    }

    const results = items.map(validator);
    const validItems = results.filter(r => r.isValid).map(r => r.data!);
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);

    return {
      isValid: allErrors.length === 0,
      data: validItems,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  // ========================================
  // SECURITY VALIDATION
  // ========================================

  static validateSecurityContext(
    userId: UserId,
    requestedResource: string,
    requiredPermissions: string[]
  ): ValidationResult<boolean> {
    const errors: ValidationError[] = [];

    // Validate user exists and is active
    const userValidation = this.validateUserId(userId);
    if (!userValidation.isValid) {
      errors.push(...userValidation.errors);
    }

    // Rate limiting check
    const rateLimitValidation = this.validateRateLimit(userId);
    if (!rateLimitValidation.isValid) {
      errors.push(...rateLimitValidation.errors);
    }

    // Input sanitization check
    if (this.containsSuspiciousPatterns(requestedResource)) {
      errors.push({
        field: 'requestedResource',
        code: AnalyticsErrorCode.VALIDATION_ERROR,
        message: 'Request contains suspicious patterns',
        value: requestedResource
      });
    }

    return {
      isValid: errors.length === 0,
      data: true,
      errors,
      warnings: []
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private static containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /\.\.\//,
      /\/etc\/passwd/,
      /union\s+select/i,
      /drop\s+table/i,
      /'.*or.*'.*=/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  static sanitizeStringInput(input: unknown): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>\"']/g, '') // Remove potential XSS characters
      .substring(0, 1000); // Limit length
  }

  static sanitizeNumericInput(input: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
    const num = Number(input);
    if (isNaN(num)) return 0;
    return Math.max(min, Math.min(max, num));
  }

  // ========================================
  // VALIDATION PIPELINE
  // ========================================

  static createValidationPipeline<T>(
    validators: Array<(data: unknown) => ValidationResult<T>>
  ) {
    return (data: unknown): ValidationResult<T> => {
      for (const validator of validators) {
        const result = validator(data);
        if (!result.isValid) {
          return result;
        }
      }

      return {
        isValid: true,
        data: data as T,
        errors: [],
        warnings: []
      };
    };
  }

  // ========================================
  // ERROR AGGREGATION
  // ========================================

  static aggregateValidationResults<T>(
    results: ValidationResult<T>[]
  ): ValidationResult<T[]> {
    const validData = results.filter(r => r.isValid).map(r => r.data!);
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);

    return {
      isValid: allErrors.length === 0,
      data: validData,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}

// ========================================
// VALIDATION DECORATORS
// ========================================

export function ValidateInput<T>(validator: (input: unknown) => ValidationResult<T>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const validationResult = validator(args[0]);
      
      if (!validationResult.isValid) {
        throw new AnalyticsValidationError(
          AnalyticsErrorCode.VALIDATION_ERROR,
          'Input validation failed',
          { errors: validationResult.errors }
        );
      }

      return method.apply(this, args);
    };
  };
}

export function RateLimit(maxRequests: number, windowMs: number) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const userId = args[0] as string;
      const now = Date.now();
      const userLimit = requestCounts.get(userId);

      if (!userLimit || now > userLimit.resetTime) {
        requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
      } else if (userLimit.count >= maxRequests) {
        throw new AnalyticsValidationError(
          AnalyticsErrorCode.RATE_LIMIT_EXCEEDED,
          'Rate limit exceeded'
        );
      } else {
        userLimit.count++;
      }

      return method.apply(this, args);
    };
  };
}