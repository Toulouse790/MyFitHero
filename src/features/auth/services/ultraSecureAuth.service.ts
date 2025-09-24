/**
 * 🎯 MYFITHERO AUTH - SERVICE ULTRA-SÉCURISÉ 6★/5
 * Service d'authentification niveau enterprise avec sécurité maximale
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { supabase } from '@/lib/supabase';
import type {
  SignUpRequest,
  SignInRequest,
  OAuthSignInRequest,
  PasswordUpdateRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  UserProfileUpdate,
  AuthApiResponse,
  AuthSession,
  UserProfile,
  AuthError,
  AuthErrorCode,
  AuthStatus,
  ValidatedEmail,
  SecurePassword,
  UserId,
  JWTToken,
  RefreshToken,
  UserRole,
  Gender,
  ActivityLevel,
  DeviceInfo,
  GeolocationInfo,
  validateSignUpRequest,
  validateSignInRequest,
  validateUserProfileUpdate,
  validateEmail,
  validatePassword,
  convertValidationErrorsToAuthError
} from '../types';

// ============================================================================
// CONFIGURATION SÉCURISÉE
// ============================================================================

const AUTH_CONFIG = {
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 secondes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 heures
  REFRESH_THRESHOLD: 0.8, // Refresh à 80% de l'expiration
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  
  // Security
  ENABLE_DEVICE_TRACKING: true,
  ENABLE_LOCATION_TRACKING: false, // GDPR compliance par défaut
  ENABLE_AUDIT_LOGGING: true,
  REQUIRE_EMAIL_VERIFICATION: true,
  
  // Storage
  TOKEN_STORAGE_KEY: 'myfithero_auth_token',
  REFRESH_TOKEN_STORAGE_KEY: 'myfithero_refresh_token',
  USER_STORAGE_KEY: 'myfithero_user_profile',
  SESSION_STORAGE_KEY: 'myfithero_session',
  
  // Retry
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BASE_DELAY: 1000, // 1 seconde
  RETRY_MAX_DELAY: 10000 // 10 secondes
} as const;

// ============================================================================
// TYPES INTERNES
// ============================================================================

interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  isLocked: boolean;
  lockExpiry?: number;
}

interface AuditLogEntry {
  event: string;
  userId?: string;
  deviceInfo?: DeviceInfo;
  location?: GeolocationInfo;
  timestamp: Date;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// GESTIONNAIRE D'ERREURS AVANCÉ
// ============================================================================

class AuthErrorHandler {
  /**
   * Crée une erreur d'authentification standardisée
   */
  static createAuthError(
    code: AuthErrorCode,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string
  ): AuthError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
      requestId: requestId || this.generateRequestId()
    };
  }

  /**
   * Convertit une erreur Supabase en AuthError
   */
  static handleSupabaseError(error: any, context: string): AuthError {
    const requestId = this.generateRequestId();
    
    if (error?.message?.includes('Invalid login credentials')) {
      return this.createAuthError(
        AuthErrorCode.INVALID_CREDENTIALS,
        'Invalid email or password',
        { context },
        requestId
      );
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return this.createAuthError(
        AuthErrorCode.EMAIL_NOT_VERIFIED,
        'Please verify your email address before signing in',
        { context },
        requestId
      );
    }
    
    if (error?.message?.includes('User already registered')) {
      return this.createAuthError(
        AuthErrorCode.EMAIL_ALREADY_EXISTS,
        'An account with this email already exists',
        { context },
        requestId
      );
    }
    
    if (error?.message?.includes('Password should be')) {
      return this.createAuthError(
        AuthErrorCode.WEAK_PASSWORD,
        'Password does not meet security requirements',
        { context, requirements: error.message },
        requestId
      );
    }

    // Erreur générique
    return this.createAuthError(
      AuthErrorCode.SERVER_ERROR,
      error?.message || 'An unexpected error occurred',
      { context, originalError: error },
      requestId
    );
  }

  /**
   * Génère un ID de requête unique
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// GESTIONNAIRE DE RATE LIMITING
// ============================================================================

class RateLimitManager {
  private static attempts = new Map<string, RateLimitEntry>();

  /**
   * Vérifie si une action est rate limitée
   */
  static isRateLimited(identifier: string): boolean {
    const entry = this.attempts.get(identifier);
    if (!entry) return false;

    const now = Date.now();
    
    // Vérifier si le lock a expiré
    if (entry.isLocked && entry.lockExpiry && now > entry.lockExpiry) {
      this.attempts.delete(identifier);
      return false;
    }

    return entry.isLocked || entry.attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Enregistre une tentative
   */
  static recordAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    let entry = this.attempts.get(identifier);

    if (!entry) {
      entry = {
        attempts: 0,
        firstAttempt: now,
        lastAttempt: now,
        isLocked: false
      };
    }

    // Reset si la fenêtre de temps est dépassée
    if (now - entry.firstAttempt > AUTH_CONFIG.RATE_LIMIT_WINDOW) {
      entry = {
        attempts: 0,
        firstAttempt: now,
        lastAttempt: now,
        isLocked: false
      };
    }

    if (success) {
      // Succès : reset les tentatives
      this.attempts.delete(identifier);
    } else {
      // Échec : incrémenter les tentatives
      entry.attempts++;
      entry.lastAttempt = now;

      if (entry.attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        entry.isLocked = true;
        entry.lockExpiry = now + AUTH_CONFIG.LOCKOUT_DURATION;
      }

      this.attempts.set(identifier, entry);
    }
  }

  /**
   * Obtient le temps restant avant déblocage
   */
  static getLockTimeRemaining(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry?.isLocked || !entry.lockExpiry) return 0;

    const remaining = entry.lockExpiry - Date.now();
    return Math.max(0, remaining);
  }
}

// ============================================================================
// GESTIONNAIRE D'AUDIT
// ============================================================================

class AuditLogger {
  private static logs: AuditLogEntry[] = [];

  /**
   * Enregistre un événement d'audit
   */
  static async log(
    event: string,
    userId?: string,
    success: boolean = true,
    error?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!AUTH_CONFIG.ENABLE_AUDIT_LOGGING) return;

    try {
      const deviceInfo = await this.getDeviceInfo();
      const location = AUTH_CONFIG.ENABLE_LOCATION_TRACKING ? await this.getLocationInfo() : undefined;

      const auditEntry: AuditLogEntry = {
        event,
        userId,
        deviceInfo,
        location,
        timestamp: new Date(),
        success,
        error,
        metadata
      };

      this.logs.push(auditEntry);

      // Envoyer à Supabase en arrière-plan (non-bloquant)
      this.sendToDatabase(auditEntry).catch(err => 
        console.warn('Failed to send audit log to database:', err)
      );
    } catch (err) {
      console.warn('Failed to create audit log:', err);
    }
  }

  /**
   * Récupère les informations du device
   */
  private static async getDeviceInfo(): Promise<DeviceInfo | undefined> {
    if (!AUTH_CONFIG.ENABLE_DEVICE_TRACKING) return undefined;

    try {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      // Simple fingerprinting (respectueux de la vie privée)
      const fingerprint = await this.generateFingerprint();
      
      return {
        userAgent,
        platform,
        browser: this.getBrowserInfo().name,
        browserVersion: this.getBrowserInfo().version,
        os: this.getOSInfo().name,
        osVersion: this.getOSInfo().version,
        device: this.getDeviceType(),
        fingerprint,
        ipAddress: 'hidden', // On ne track pas l'IP côté client
        location: null
      };
    } catch {
      return undefined;
    }
  }

  /**
   * Génère un fingerprint respectueux de la vie privée
   */
  private static async generateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString()
    ];

    const data = components.join('|');
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 16); // Premier 16 caractères seulement
  }

  /**
   * Détecte le navigateur
   */
  private static getBrowserInfo(): { name: string; version: string } {
    const ua = navigator.userAgent;
    
    if (ua.includes('Chrome')) return { name: 'Chrome', version: this.extractVersion(ua, /Chrome\/(\d+)/) };
    if (ua.includes('Firefox')) return { name: 'Firefox', version: this.extractVersion(ua, /Firefox\/(\d+)/) };
    if (ua.includes('Safari')) return { name: 'Safari', version: this.extractVersion(ua, /Version\/(\d+)/) };
    if (ua.includes('Edge')) return { name: 'Edge', version: this.extractVersion(ua, /Edge\/(\d+)/) };
    
    return { name: 'Unknown', version: '0' };
  }

  /**
   * Détecte l'OS
   */
  private static getOSInfo(): { name: string; version: string } {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    
    if (ua.includes('Windows')) return { name: 'Windows', version: this.extractVersion(ua, /Windows NT (\d+\.\d+)/) };
    if (ua.includes('Mac')) return { name: 'macOS', version: this.extractVersion(ua, /Mac OS X (\d+[._]\d+)/) };
    if (ua.includes('Linux')) return { name: 'Linux', version: '0' };
    if (ua.includes('Android')) return { name: 'Android', version: this.extractVersion(ua, /Android (\d+\.\d+)/) };
    if (ua.includes('iOS')) return { name: 'iOS', version: this.extractVersion(ua, /OS (\d+_\d+)/) };
    
    return { name: platform || 'Unknown', version: '0' };
  }

  /**
   * Détecte le type de device
   */
  private static getDeviceType(): string {
    const ua = navigator.userAgent;
    
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  /**
   * Extrait une version depuis l'user agent
   */
  private static extractVersion(ua: string, regex: RegExp): string {
    const match = ua.match(regex);
    return match ? match[1] : '0';
  }

  /**
   * Récupère les informations de géolocalisation (opt-in)
   */
  private static async getLocationInfo(): Promise<GeolocationInfo | undefined> {
    // Implémentation basique - en production, utiliser un service IP geolocation
    return undefined;
  }

  /**
   * Envoie l'audit log à la base de données
   */
  private static async sendToDatabase(entry: AuditLogEntry): Promise<void> {
    try {
      await supabase
        .from('auth_audit_logs')
        .insert({
          event: entry.event,
          user_id: entry.userId,
          device_info: entry.deviceInfo,
          location_info: entry.location,
          timestamp: entry.timestamp.toISOString(),
          success: entry.success,
          error_message: entry.error,
          metadata: entry.metadata
        });
    } catch (error) {
      // Fail silently pour ne pas impacter l'expérience utilisateur
      console.warn('Audit log database insert failed:', error);
    }
  }
}

// ============================================================================
// UTILITAIRES DE RETRY
// ============================================================================

class RetryManager {
  /**
   * Exécute une fonction avec retry automatique
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const config: RetryOptions = {
      maxAttempts: AUTH_CONFIG.MAX_RETRY_ATTEMPTS,
      baseDelay: AUTH_CONFIG.RETRY_BASE_DELAY,
      maxDelay: AUTH_CONFIG.RETRY_MAX_DELAY,
      backoffMultiplier: 2,
      ...options
    };

    let lastError: Error;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === config.maxAttempts) {
          throw lastError;
        }

        // Calculer le délai avec exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelay
        );

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Utilitaire pour sleep
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SERVICE PRINCIPAL D'AUTHENTIFICATION 6★/5
// ============================================================================

export class UltraSecureAuthService {
  
  // ============================================================================
  // INSCRIPTION
  // ============================================================================

  /**
   * Inscription utilisateur avec validation exhaustive
   */
  static async signUp(request: SignUpRequest): Promise<AuthApiResponse<UserProfile>> {
    const requestId = AuthErrorHandler['generateRequestId']();
    
    try {
      // 1. Validation stricte des données
      const validationResult = validateSignUpRequest(request);
      if (!validationResult.isValid) {
        const authError = convertValidationErrorsToAuthError(validationResult.errors, requestId);
        await AuditLogger.log('signup_validation_failed', undefined, false, authError.message, {
          errors: validationResult.errors
        });
        return { success: false, error: authError };
      }

      const validatedRequest = validationResult.value!;

      // 2. Vérification rate limiting
      const rateLimitKey = `signup_${validatedRequest.email}`;
      if (RateLimitManager.isRateLimited(rateLimitKey)) {
        const remainingTime = RateLimitManager.getLockTimeRemaining(rateLimitKey);
        const authError = AuthErrorHandler.createAuthError(
          AuthErrorCode.TOO_MANY_ATTEMPTS,
          `Too many signup attempts. Try again in ${Math.ceil(remainingTime / 1000)} seconds`,
          { remainingTime },
          requestId
        );
        await AuditLogger.log('signup_rate_limited', undefined, false, authError.message);
        return { success: false, error: authError };
      }

      // 3. Tentative d'inscription avec retry
      const signUpResponse = await RetryManager.withRetry(async () => {
        return await supabase.auth.signUp({
          email: validatedRequest.email,
          password: validatedRequest.password,
          options: {
            data: {
              first_name: validatedRequest.firstName,
              last_name: validatedRequest.lastName,
              date_of_birth: validatedRequest.dateOfBirth?.toISOString(),
              gender: validatedRequest.gender,
              accepts_terms: validatedRequest.acceptsTerms,
              accepts_privacy: validatedRequest.acceptsPrivacy,
              accepts_marketing: validatedRequest.acceptsMarketing || false,
              referral_code: validatedRequest.referralCode,
              source: validatedRequest.source,
              signup_timestamp: new Date().toISOString()
            }
          }
        });
      });

      if (signUpResponse.error) {
        RateLimitManager.recordAttempt(rateLimitKey, false);
        const authError = AuthErrorHandler.handleSupabaseError(signUpResponse.error, 'signup');
        await AuditLogger.log('signup_failed', undefined, false, authError.message, {
          email: validatedRequest.email,
          error: signUpResponse.error
        });
        return { success: false, error: authError };
      }

      // 4. Succès
      RateLimitManager.recordAttempt(rateLimitKey, true);
      
      const userProfile = this.mapSupabaseUserToUserProfile(signUpResponse.data.user!);
      
      await AuditLogger.log('signup_success', userProfile.id, true, undefined, {
        email: validatedRequest.email,
        hasReferralCode: !!validatedRequest.referralCode
      });

      return {
        success: true,
        data: userProfile,
        metadata: {
          timestamp: new Date(),
          requestId,
          version: '2.0.0'
        }
      };

    } catch (error) {
      const authError = AuthErrorHandler.createAuthError(
        AuthErrorCode.SERVER_ERROR,
        'Signup failed due to unexpected error',
        { originalError: error },
        requestId
      );
      
      await AuditLogger.log('signup_error', undefined, false, authError.message, { error });
      
      return { success: false, error: authError };
    }
  }

  // ============================================================================
  // CONNEXION
  // ============================================================================

  /**
   * Connexion utilisateur avec sécurité maximale
   */
  static async signIn(request: SignInRequest): Promise<AuthApiResponse<AuthSession>> {
    const requestId = AuthErrorHandler['generateRequestId']();
    
    try {
      // 1. Validation des données
      const validationResult = validateSignInRequest(request);
      if (!validationResult.isValid) {
        const authError = convertValidationErrorsToAuthError(validationResult.errors, requestId);
        await AuditLogger.log('signin_validation_failed', undefined, false, authError.message);
        return { success: false, error: authError };
      }

      const validatedRequest = validationResult.value!;

      // 2. Vérification rate limiting
      const rateLimitKey = `signin_${validatedRequest.email}`;
      if (RateLimitManager.isRateLimited(rateLimitKey)) {
        const remainingTime = RateLimitManager.getLockTimeRemaining(rateLimitKey);
        const authError = AuthErrorHandler.createAuthError(
          AuthErrorCode.TOO_MANY_ATTEMPTS,
          `Too many login attempts. Try again in ${Math.ceil(remainingTime / 1000)} seconds`,
          { remainingTime },
          requestId
        );
        await AuditLogger.log('signin_rate_limited', undefined, false, authError.message);
        return { success: false, error: authError };
      }

      // 3. Tentative de connexion
      const signInResponse = await RetryManager.withRetry(async () => {
        return await supabase.auth.signInWithPassword({
          email: validatedRequest.email,
          password: validatedRequest.password
        });
      });

      if (signInResponse.error) {
        RateLimitManager.recordAttempt(rateLimitKey, false);
        const authError = AuthErrorHandler.handleSupabaseError(signInResponse.error, 'signin');
        await AuditLogger.log('signin_failed', undefined, false, authError.message, {
          email: validatedRequest.email
        });
        return { success: false, error: authError };
      }

      // 4. Succès - créer la session
      RateLimitManager.recordAttempt(rateLimitKey, true);
      
      const userProfile = this.mapSupabaseUserToUserProfile(signInResponse.data.user!);
      const session = await this.createAuthSession(signInResponse.data.session!, userProfile);

      // 5. Stockage sécurisé
      await this.storeAuthSession(session, validatedRequest.rememberMe);

      await AuditLogger.log('signin_success', userProfile.id, true, undefined, {
        email: validatedRequest.email,
        rememberMe: validatedRequest.rememberMe
      });

      return {
        success: true,
        data: session,
        metadata: {
          timestamp: new Date(),
          requestId,
          version: '2.0.0'
        }
      };

    } catch (error) {
      const authError = AuthErrorHandler.createAuthError(
        AuthErrorCode.SERVER_ERROR,
        'Sign in failed due to unexpected error',
        { originalError: error },
        requestId
      );
      
      await AuditLogger.log('signin_error', undefined, false, authError.message, { error });
      
      return { success: false, error: authError };
    }
  }

  // ============================================================================
  // DÉCONNEXION
  // ============================================================================

  /**
   * Déconnexion sécurisée avec nettoyage complet
   */
  static async signOut(): Promise<AuthApiResponse<void>> {
    const requestId = AuthErrorHandler['generateRequestId']();
    
    try {
      // 1. Récupérer l'utilisateur actuel pour l'audit
      const currentUser = await this.getCurrentUser();
      
      // 2. Déconnexion Supabase
      const signOutResponse = await RetryManager.withRetry(async () => {
        return await supabase.auth.signOut();
      });

      if (signOutResponse.error) {
        const authError = AuthErrorHandler.handleSupabaseError(signOutResponse.error, 'signout');
        await AuditLogger.log('signout_failed', currentUser?.id, false, authError.message);
        return { success: false, error: authError };
      }

      // 3. Nettoyage complet du stockage local
      await this.clearAuthStorage();

      await AuditLogger.log('signout_success', currentUser?.id, true);

      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          requestId,
          version: '2.0.0'
        }
      };

    } catch (error) {
      const authError = AuthErrorHandler.createAuthError(
        AuthErrorCode.SERVER_ERROR,
        'Sign out failed due to unexpected error',
        { originalError: error },
        requestId
      );
      
      await AuditLogger.log('signout_error', undefined, false, authError.message, { error });
      
      return { success: false, error: authError };
    }
  }

  // ============================================================================
  // UTILITAIRES PRIVÉS
  // ============================================================================

  /**
   * Convertit un utilisateur Supabase en UserProfile
   */
  private static mapSupabaseUserToUserProfile(supabaseUser: any): UserProfile {
    return {
      id: supabaseUser.id as UserId,
      email: supabaseUser.email as ValidatedEmail,
      emailVerified: supabaseUser.email_confirmed_at != null,
      emailVerifiedAt: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
      firstName: supabaseUser.user_metadata?.first_name || '',
      lastName: supabaseUser.user_metadata?.last_name || '',
      fullName: `${supabaseUser.user_metadata?.first_name || ''} ${supabaseUser.user_metadata?.last_name || ''}`.trim(),
      dateOfBirth: supabaseUser.user_metadata?.date_of_birth ? new Date(supabaseUser.user_metadata.date_of_birth) : null,
      gender: supabaseUser.user_metadata?.gender || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language || 'en-US',
      height: supabaseUser.user_metadata?.height || null,
      weight: supabaseUser.user_metadata?.weight || null,
      activityLevel: supabaseUser.user_metadata?.activity_level || null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      role: supabaseUser.user_metadata?.role || 'USER',
      isActive: true,
      isPremium: supabaseUser.user_metadata?.is_premium || false,
      premiumExpiresAt: supabaseUser.user_metadata?.premium_expires_at ? new Date(supabaseUser.user_metadata.premium_expires_at) : null,
      onboardingCompleted: supabaseUser.user_metadata?.onboarding_completed || false,
      onboardingCompletedAt: supabaseUser.user_metadata?.onboarding_completed_at ? new Date(supabaseUser.user_metadata.onboarding_completed_at) : null,
      onboardingSteps: supabaseUser.user_metadata?.onboarding_steps || {},
      preferences: {
        notifications: {
          email: supabaseUser.user_metadata?.notifications_email ?? true,
          push: supabaseUser.user_metadata?.notifications_push ?? true,
          sms: supabaseUser.user_metadata?.notifications_sms ?? false,
          marketing: supabaseUser.user_metadata?.accepts_marketing ?? false
        },
        privacy: {
          profileVisibility: supabaseUser.user_metadata?.profile_visibility || 'private',
          dataSharing: supabaseUser.user_metadata?.data_sharing ?? false,
          analyticsOptOut: supabaseUser.user_metadata?.analytics_opt_out ?? false
        },
        display: {
          theme: supabaseUser.user_metadata?.theme || 'auto',
          language: supabaseUser.user_metadata?.language || navigator.language || 'en-US',
          units: supabaseUser.user_metadata?.units || 'metric'
        }
      },
      goals: [], // À implémenter selon la structure de données
      sports: supabaseUser.user_metadata?.sports || [],
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
      lastLoginAt: new Date()
    };
  }

  /**
   * Crée une session d'authentification complète
   */
  private static async createAuthSession(supabaseSession: any, userProfile: UserProfile): Promise<AuthSession> {
    const deviceInfo = await AuditLogger['getDeviceInfo']();
    
    return {
      accessToken: supabaseSession.access_token as JWTToken,
      refreshToken: supabaseSession.refresh_token as RefreshToken,
      tokenType: 'Bearer',
      expiresAt: new Date(supabaseSession.expires_at * 1000),
      expiresIn: supabaseSession.expires_in,
      user: userProfile,
      deviceInfo: deviceInfo!,
      sessionId: crypto.randomUUID(),
      createdAt: new Date()
    };
  }

  /**
   * Stocke la session de manière sécurisée
   */
  private static async storeAuthSession(session: AuthSession, persistent: boolean = false): Promise<void> {
    const storage = persistent ? localStorage : sessionStorage;
    
    try {
      storage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, session.accessToken);
      storage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, session.refreshToken);
      storage.setItem(AUTH_CONFIG.USER_STORAGE_KEY, JSON.stringify(session.user));
      storage.setItem(AUTH_CONFIG.SESSION_STORAGE_KEY, JSON.stringify({
        sessionId: session.sessionId,
        expiresAt: session.expiresAt.toISOString(),
        deviceInfo: session.deviceInfo
      }));
    } catch (error) {
      console.warn('Failed to store auth session:', error);
    }
  }

  /**
   * Nettoie complètement le stockage d'authentification
   */
  private static async clearAuthStorage(): Promise<void> {
    const keys = [
      AUTH_CONFIG.TOKEN_STORAGE_KEY,
      AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
      AUTH_CONFIG.USER_STORAGE_KEY,
      AUTH_CONFIG.SESSION_STORAGE_KEY
    ];

    for (const key of keys) {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to clear storage key ${key}:`, error);
      }
    }
  }

  /**
   * Récupère l'utilisateur actuel depuis le stockage
   */
  private static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const userStr = localStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY) || 
                     sessionStorage.getItem(AUTH_CONFIG.USER_STORAGE_KEY);
      
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}