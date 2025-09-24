import React from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// 🛡️ OWASP Top 10 Compliance Framework
export class SecurityFramework {
  private static instance: SecurityFramework;
  private encryptionKey: string;
  
  private constructor() {
    this.encryptionKey = this.generateSecureKey();
  }

  public static getInstance(): SecurityFramework {
    if (!SecurityFramework.instance) {
      SecurityFramework.instance = new SecurityFramework();
    }
    return SecurityFramework.instance;
  }

  // 🔐 A03:2021 - Injection Prevention
  public sanitizeInput(input: string, options: {
    allowHtml?: boolean;
    maxLength?: number;
    allowedTags?: string[];
  } = {}): string {
    const { allowHtml = false, maxLength = 1000, allowedTags = [] } = options;

    // Length validation
    if (input.length > maxLength) {
      throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
    }

    if (!allowHtml) {
      // Strip all HTML tags
      return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
    }

    // Allow only safe HTML tags
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: allowedTags.length > 0 ? allowedTags : ['b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: ['class']
    });
  }

  // 🔒 A02:2021 - Cryptographic Failures Prevention
  public encryptSensitiveData(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    } catch (error: any) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  public decryptSensitiveData(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error: any) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // 🔑 A07:2021 - Identification and Authentication Failures
  public generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  public validatePassword(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeating characters');
      score -= 1;
    }

    if (this.isCommonPassword(password)) {
      feedback.push('This is a commonly used password');
      score -= 2;
    }

    const isValid = score >= 5 && feedback.length === 0;

    return { isValid, score: Math.max(0, score), feedback };
  }

  // 🛡️ A05:2021 - Security Misconfiguration
  public getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': this.generateCSP(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  private generateCSP(): string {
    const nonce = this.generateSecureToken(16);
    
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.supabase.co wss://realtime.supabase.co",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');
  }

  // 🔍 A08:2021 - Software and Data Integrity Failures
  public validateDataIntegrity(data: any, expectedSchema: z.ZodSchema): {
    isValid: boolean;
    data: any;
    errors: string[];
  } {
    try {
      const validatedData = expectedSchema.parse(data);
      return {
        isValid: true,
        data: validatedData,
        errors: []
      };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          data: null,
          errors: error.errors.map((e, index) => `${e.path.join('.')}: ${e.message}`)
        };
      }
      return {
        isValid: false,
        data: null,
        errors: ['Unknown validation error']
      };
    }
  }

  // 🚨 A09:2021 - Security Logging and Monitoring
  public logSecurityEvent(event: SecurityEvent): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: event.type,
      severity: event.severity,
      userId: event.userId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      details: event.details,
      sessionId: this.getSessionId()
    };

    // In production, send to security monitoring service
    if (import.meta.env.PROD) {
      this.sendToSecurityMonitoring(logEntry);
    } else {
      console.warn('Security Event:', logEntry);
    }

    // Critical events should also be stored locally for audit
    if (event.severity === 'critical' || event.severity === 'high') {
      this.storeAuditLog(logEntry);
    }
  }

  // 🔐 Rate Limiting
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  public checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 900000): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = `rateLimit:${identifier}`;
    const current = this.rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      // Reset or first request
      const resetTime = now + windowMs;
      this.rateLimitStore.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime
      };
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      };
    }

    current.count++;
    this.rateLimitStore.set(key, current);

    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    };
  }

  // 🔍 A01:2021 - Broken Access Control
  public validatePermissions(userId: string, resource: string, action: string): boolean {
    // Implement role-based access control (RBAC)
    const userRoles = this.getUserRoles(userId);
    const requiredPermission = `${resource}:${action}`;
    
    return userRoles.some(role => 
      this.getRolePermissions(role).includes(requiredPermission)
    );
  }

  // Helper methods
  private generateSecureKey(): string {
    return import.meta.env.VITE_ENCRYPTION_KEY || this.generateSecureToken(64);
  }

  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  private getClientIP(): string {
    // This would be set by your reverse proxy/CDN
    return 'client-ip-masked-for-privacy';
  }

  private getSessionId(): string {
    // Get from auth store or generate
    return sessionStorage.getItem('sessionId') || this.generateSecureToken();
  }

  private async sendToSecurityMonitoring(logEntry: any): Promise<void> {
    try {
      // Send to Sentry, DataDog, or other monitoring service
      await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error: any) {
      console.error('Failed to send security event:', error);
    }
  }

  private storeAuditLog(logEntry: any): void {
    try {
      const auditLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
      auditLogs.push(logEntry);
      
      // Keep only last 100 entries
      const recentLogs = auditLogs.slice(-100);
      localStorage.setItem('auditLogs', JSON.stringify(recentLogs));
    } catch (error: any) {
      console.error('Failed to store audit log:', error);
    }
  }

  private getUserRoles(userId: string): string[] {
    // In real app, fetch from auth service
    return ['user']; // Default role
  }

  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      'admin': ['*:*'],
      'user': ['profile:read', 'profile:update', 'workouts:*', 'nutrition:*'],
      'premium': ['profile:*', 'workouts:*', 'nutrition:*', 'ai-coach:*'],
    };
    
    return rolePermissions[role] || [];
  }
}

// Types
export interface SecurityEvent {
  type: 'authentication_failure' | 'authorization_failure' | 'suspicious_activity' | 'data_breach_attempt' | 'rate_limit_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  details: Record<string, any>;
}

// Schemas for data validation
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
  preferences: z.object({
    units: z.enum(['metric', 'imperial']),
    language: z.enum(['en', 'fr']),
    notifications: z.boolean()
  }).optional()
});

export const WorkoutSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: z.enum(['strength', 'cardio', 'flexibility', 'sports']),
  duration: z.number().int().min(1).max(480), // 8 hours max
  exercises: z.array(z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(100),
    sets: z.number().int().min(1).max(20).optional(),
    reps: z.number().int().min(1).max(1000).optional(),
    weight: z.number().min(0).max(1000).optional()
  }))
});

export const NutritionEntrySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  food_name: z.string().min(1).max(200),
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
  serving_size: z.string().max(100).optional()
});

// Security middleware for React components
export function withSecurity<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  requiredPermissions?: string[]
) {
  return function SecurityWrapper(props: T) {
    const security = SecurityFramework.getInstance();
    
    // Check permissions if required
    if (requiredPermissions) {
      const userId = 'current-user-id'; // Get from auth context
      const hasPermission = requiredPermissions.every(permission => {
        const [resource, action] = permission.split(':');
        return security.validatePermissions(userId, resource, action);
      });

      if (!hasPermission) {
        security.logSecurityEvent({
          type: 'authorization_failure',
          severity: 'medium',
          userId,
          details: { requiredPermissions, component: WrappedComponent.name }
        });
        
        return null;
      }
    }

    return React.createElement(WrappedComponent, props);
  };
}

// Export singleton instance
export const security = SecurityFramework.getInstance();