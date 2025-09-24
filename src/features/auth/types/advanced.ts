/**
 * 🎯 MYFITHERO AUTH - TYPES AVANCÉS 6★/5
 * Types TypeScript ultra-rigoureux pour niveau enterprise
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

// ============================================================================
// TYPES DE BASE ULTRA-RIGOUREUX
// ============================================================================

/**
 * Brand type pour sécurité de type maximale
 */
type Brand<T, B> = T & { readonly __brand: B };

/**
 * User ID fortement typé pour éviter les erreurs de manipulation
 */
export type UserId = Brand<string, 'UserId'>;

/**
 * Email validé avec pattern strict
 */
export type ValidatedEmail = Brand<string, 'ValidatedEmail'>;

/**
 * Password avec critères de sécurité
 */
export type SecurePassword = Brand<string, 'SecurePassword'>;

/**
 * JWT Token avec expiration
 */
export type JWTToken = Brand<string, 'JWTToken'>;

/**
 * Refresh Token sécurisé
 */
export type RefreshToken = Brand<string, 'RefreshToken'>;

// ============================================================================
// ENUMS STRICTS POUR ÉVITER LES ERREURS
// ============================================================================

/**
 * Statuts d'authentification possibles
 */
export enum AuthStatus {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  EXPIRED = 'expired',
  ERROR = 'error',
  LOCKED = 'locked'
}

/**
 * Types de fournisseurs OAuth supportés
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  GITHUB = 'github'
}

/**
 * Niveaux d'activité physique avec valeurs exactes
 */
export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHTLY_ACTIVE = 'lightly_active',
  MODERATELY_ACTIVE = 'moderately_active',
  VERY_ACTIVE = 'very_active',
  EXTREMELY_ACTIVE = 'extremely_active'
}

/**
 * Genres supportés avec respect de l'inclusivité
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

/**
 * Rôles utilisateur dans l'application
 */
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  COACH = 'coach',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// ============================================================================
// INTERFACES ULTRA-PRÉCISES
// ============================================================================

/**
 * Profil utilisateur complet avec validation stricte
 */
export interface UserProfile {
  readonly id: UserId;
  readonly email: ValidatedEmail;
  readonly emailVerified: boolean;
  readonly emailVerifiedAt: Date | null;
  
  // Informations personnelles
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly dateOfBirth: Date | null;
  readonly gender: Gender | null;
  readonly timezone: string;
  readonly locale: string;
  
  // Informations physiques
  readonly height: number | null; // en cm
  readonly weight: number | null; // en kg
  readonly activityLevel: ActivityLevel | null;
  
  // Métadonnées
  readonly avatarUrl: string | null;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly isPremium: boolean;
  readonly premiumExpiresAt: Date | null;
  
  // Onboarding
  readonly onboardingCompleted: boolean;
  readonly onboardingCompletedAt: Date | null;
  readonly onboardingSteps: Record<string, boolean>;
  
  // Préférences
  readonly preferences: UserPreferences;
  readonly goals: UserGoal[];
  readonly sports: string[];
  
  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastLoginAt: Date | null;
}

/**
 * Préférences utilisateur avec types stricts
 */
export interface UserPreferences {
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
    readonly sms: boolean;
    readonly marketing: boolean;
  };
  readonly privacy: {
    readonly profileVisibility: 'private' | 'friends' | 'public';
    readonly dataSharing: boolean;
    readonly analyticsOptOut: boolean;
  };
  readonly display: {
    readonly theme: 'light' | 'dark' | 'auto';
    readonly language: string;
    readonly units: 'metric' | 'imperial';
  };
}

/**
 * Objectifs utilisateur avec suivi de progression
 */
export interface UserGoal {
  readonly id: string;
  readonly type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility';
  readonly title: string;
  readonly description: string;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly unit: string;
  readonly deadline: Date | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ============================================================================
// SESSION & AUTHENTIFICATION
// ============================================================================

/**
 * Session utilisateur avec sécurité maximale
 */
export interface AuthSession {
  readonly accessToken: JWTToken;
  readonly refreshToken: RefreshToken;
  readonly tokenType: 'Bearer';
  readonly expiresAt: Date;
  readonly expiresIn: number; // secondes
  readonly user: UserProfile;
  readonly deviceInfo: DeviceInfo;
  readonly sessionId: string;
  readonly createdAt: Date;
}

/**
 * Informations de device pour security tracking
 */
export interface DeviceInfo {
  readonly userAgent: string;
  readonly platform: string;
  readonly browser: string;
  readonly browserVersion: string;
  readonly os: string;
  readonly osVersion: string;
  readonly device: string;
  readonly fingerprint: string;
  readonly ipAddress: string;
  readonly location: GeolocationInfo | null;
}

/**
 * Géolocalisation pour audit de sécurité
 */
export interface GeolocationInfo {
  readonly country: string;
  readonly region: string;
  readonly city: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly timezone: string;
}

// ============================================================================
// REQUÊTES D'AUTHENTIFICATION
// ============================================================================

/**
 * Données d'inscription avec validation stricte
 */
export interface SignUpRequest {
  readonly email: string; // Sera validé vers ValidatedEmail
  readonly password: string; // Sera validé vers SecurePassword
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth?: Date;
  readonly gender?: Gender;
  readonly acceptsTerms: true; // Obligatoire
  readonly acceptsPrivacy: true; // Obligatoire
  readonly acceptsMarketing?: boolean;
  readonly referralCode?: string;
  readonly source?: string; // utm_source tracking
}

/**
 * Données de connexion avec options avancées
 */
export interface SignInRequest {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
  readonly deviceFingerprint?: string;
  readonly location?: GeolocationInfo;
}

/**
 * Connexion OAuth avec provider strict
 */
export interface OAuthSignInRequest {
  readonly provider: OAuthProvider;
  readonly code: string;
  readonly state: string;
  readonly redirectUri: string;
  readonly codeVerifier?: string; // PKCE
}

/**
 * Mise à jour de mot de passe sécurisée
 */
export interface PasswordUpdateRequest {
  readonly currentPassword: string;
  readonly newPassword: string; // Sera validé vers SecurePassword
  readonly confirmPassword: string;
}

/**
 * Réinitialisation de mot de passe
 */
export interface PasswordResetRequest {
  readonly email: string;
  readonly redirectTo?: string;
}

/**
 * Confirmation de réinitialisation
 */
export interface PasswordResetConfirmRequest {
  readonly token: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

// ============================================================================
// RÉPONSES API TYPÉES
// ============================================================================

/**
 * Réponse standardisée pour toutes les opérations auth
 */
export interface AuthApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: AuthError;
  readonly metadata?: {
    readonly timestamp: Date;
    readonly requestId: string;
    readonly version: string;
  };
}

/**
 * Erreurs d'authentification avec types précis
 */
export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
  readonly requestId: string;
}

/**
 * Codes d'erreur exhaustifs
 */
export enum AuthErrorCode {
  // Erreurs générales
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Erreurs d'authentification
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Erreurs de validation
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_SIGNUP_DATA = 'INVALID_SIGNUP_DATA',
  
  // Erreurs de sécurité
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  LOCATION_BLOCKED = 'LOCATION_BLOCKED',
  DEVICE_NOT_TRUSTED = 'DEVICE_NOT_TRUSTED',
  
  // Erreurs OAuth
  OAUTH_ERROR = 'OAUTH_ERROR',
  OAUTH_CANCELLED = 'OAUTH_CANCELLED',
  OAUTH_INVALID_STATE = 'OAUTH_INVALID_STATE'
}

// ============================================================================
// STATE & STORE TYPES
// ============================================================================

/**
 * État global d'authentification avec machine d'état
 */
export interface AuthState {
  readonly status: AuthStatus;
  readonly user: UserProfile | null;
  readonly session: AuthSession | null;
  readonly error: AuthError | null;
  readonly isLoading: boolean;
  readonly lastActivity: Date | null;
  readonly sessionTimeoutWarning: boolean;
  readonly retryCount: number;
  readonly maxRetries: number;
}

/**
 * Actions possibles sur le store auth
 */
export type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserProfile; session: AuthSession } }
  | { type: 'AUTH_ERROR'; payload: AuthError }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH_START' }
  | { type: 'AUTH_REFRESH_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_REFRESH_ERROR'; payload: AuthError }
  | { type: 'AUTH_UPDATE_USER'; payload: Partial<UserProfile> }
  | { type: 'AUTH_ACTIVITY_UPDATE' }
  | { type: 'AUTH_TIMEOUT_WARNING'; payload: boolean }
  | { type: 'AUTH_RETRY_INCREMENT' }
  | { type: 'AUTH_RETRY_RESET' };

// ============================================================================
// VALIDATEURS & GUARDS
// ============================================================================

/**
 * Type guard pour vérifier si un email est valide
 */
export const isValidatedEmail = (email: string): email is ValidatedEmail => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Type guard pour vérifier si un password est sécurisé
 */
export const isSecurePassword = (password: string): password is SecurePassword => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Type guard pour vérifier si un token JWT est valide
 */
export const isValidJWTToken = (token: string): token is JWTToken => {
  try {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  } catch {
    return false;
  }
};

/**
 * Type guard pour vérifier si un user ID est valide
 */
export const isValidUserId = (id: string): id is UserId => {
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// ============================================================================
// UTILITY TYPES AVANCÉS
// ============================================================================

/**
 * Créer un type de mise à jour partielle avec contraintes
 */
export type UserProfileUpdate = Partial<Pick<UserProfile, 
  | 'firstName' 
  | 'lastName' 
  | 'dateOfBirth' 
  | 'gender' 
  | 'height' 
  | 'weight' 
  | 'activityLevel' 
  | 'avatarUrl' 
  | 'preferences'
  | 'goals'
  | 'sports'
>>;

/**
 * Type pour les hooks auth avec toutes les méthodes
 */
export interface AuthHookReturn {
  // État
  readonly user: UserProfile | null;
  readonly session: AuthSession | null;
  readonly status: AuthStatus;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: AuthError | null;
  
  // Actions
  readonly signIn: (request: SignInRequest) => Promise<AuthApiResponse<AuthSession>>;
  readonly signUp: (request: SignUpRequest) => Promise<AuthApiResponse<UserProfile>>;
  readonly signOut: () => Promise<AuthApiResponse<void>>;
  readonly signInWithOAuth: (request: OAuthSignInRequest) => Promise<AuthApiResponse<AuthSession>>;
  readonly refreshToken: () => Promise<AuthApiResponse<AuthSession>>;
  readonly updatePassword: (request: PasswordUpdateRequest) => Promise<AuthApiResponse<void>>;
  readonly resetPassword: (request: PasswordResetRequest) => Promise<AuthApiResponse<void>>;
  readonly confirmPasswordReset: (request: PasswordResetConfirmRequest) => Promise<AuthApiResponse<void>>;
  readonly updateProfile: (update: UserProfileUpdate) => Promise<AuthApiResponse<UserProfile>>;
  readonly deleteAccount: () => Promise<AuthApiResponse<void>>;
  
  // Utilitaires
  readonly retry: () => Promise<void>;
  readonly clearError: () => void;
  readonly extendSession: () => Promise<void>;
}

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

/**
 * Configuration de sécurité auth
 */
export interface AuthConfig {
  readonly apiUrl: string;
  readonly tokenStorage: 'localStorage' | 'sessionStorage' | 'secure';
  readonly sessionTimeout: number; // en millisecondes
  readonly refreshThreshold: number; // % de temps restant pour refresh
  readonly maxRetryAttempts: number;
  readonly retryDelay: number; // millisecondes
  readonly passwordMinLength: number;
  readonly requireEmailVerification: boolean;
  readonly enableBiometrics: boolean;
  readonly enableMFA: boolean;
  readonly allowedOAuthProviders: OAuthProvider[];
  readonly rateLimiting: {
    readonly maxAttempts: number;
    readonly windowMs: number;
    readonly blockDurationMs: number;
  };
}

/**
 * Métriques auth pour analytics
 */
export interface AuthMetrics {
  readonly signInCount: number;
  readonly signUpCount: number;
  readonly oauthUsageByProvider: Record<OAuthProvider, number>;
  readonly errorsByCode: Record<AuthErrorCode, number>;
  readonly averageSessionDuration: number;
  readonly activeUsers: number;
  readonly churnRate: number;
  readonly onboardingCompletionRate: number;
}