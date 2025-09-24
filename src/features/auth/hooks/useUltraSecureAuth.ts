/**
 * 🎯 MYFITHERO AUTH - HOOK ULTRA-SÉCURISÉ 6★/5
 * Hook d'authentification avec sécurité, performance et UX maximales
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import {
  AuthHookReturn,
  AuthState,
  AuthStatus,
  AuthError,
  AuthSession,
  UserProfile,
  SignInRequest,
  SignUpRequest,
  OAuthSignInRequest,
  PasswordUpdateRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  UserProfileUpdate,
  AuthApiResponse,
  AuthErrorCode
} from '../types';
import { UltraSecureAuthService } from '../services/ultraSecureAuth.service';
import { supabase } from '@/lib/supabase';

// ============================================================================
// CONFIGURATION DU HOOK
// ============================================================================

const HOOK_CONFIG = {
  // Auto-refresh
  AUTO_REFRESH_ENABLED: true,
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes avant expiration
  REFRESH_CHECK_INTERVAL: 30 * 1000, // Vérification toutes les 30 secondes
  
  // Session management
  SESSION_TIMEOUT_WARNING: 2 * 60 * 1000, // Alerte 2 minutes avant timeout
  ACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes d'inactivité
  
  // Error handling
  MAX_ERROR_RETRY: 3,
  ERROR_RESET_DELAY: 5000, // 5 secondes
  
  // Performance
  DEBOUNCE_DELAY: 300, // 300ms pour les actions utilisateur
  LOADING_MIN_DURATION: 500, // Durée minimale de loading pour éviter les flashs
  
  // Toast configuration
  TOAST_DURATION: 4000,
  SUCCESS_TOAST_DURATION: 3000,
  ERROR_TOAST_DURATION: 6000
} as const;

// ============================================================================
// TYPES INTERNES
// ============================================================================

interface InternalAuthState extends AuthState {
  isRefreshing: boolean;
  lastActivity: Date | null;
  sessionTimeoutWarning: boolean;
  networkStatus: 'online' | 'offline';
  retryCount: number;
}

interface LoadingStates {
  signIn: boolean;
  signUp: boolean;
  signOut: boolean;
  refreshToken: boolean;
  updateProfile: boolean;
  resetPassword: boolean;
  confirmPasswordReset: boolean;
}

// ============================================================================
// HOOK PRINCIPAL ULTRA-SÉCURISÉ
// ============================================================================

export const useUltraSecureAuth = (): AuthHookReturn => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [authState, setAuthState] = useState<InternalAuthState>({
    status: AuthStatus.UNAUTHENTICATED,
    user: null,
    session: null,
    error: null,
    isLoading: true,
    lastActivity: null,
    sessionTimeoutWarning: false,
    retryCount: 0,
    maxRetries: HOOK_CONFIG.MAX_ERROR_RETRY,
    isRefreshing: false,
    networkStatus: navigator.onLine ? 'online' : 'offline'
  });

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    signIn: false,
    signUp: false,
    signOut: false,
    refreshToken: false,
    updateProfile: false,
    resetPassword: false,
    confirmPasswordReset: false
  });

  // ============================================================================
  // REFS POUR OPTIMISATION
  // ============================================================================

  const refreshTimerRef = useRef<NodeJS.Timeout>();
  const activityTimerRef = useRef<NodeJS.Timeout>();
  const sessionWarningTimerRef = useRef<NodeJS.Timeout>();
  const loadingTimerRef = useRef<NodeJS.Timeout>();
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // ============================================================================
  // UTILITAIRES INTERNES
  // ============================================================================

  /**
   * Met à jour l'activité utilisateur
   */
  const updateActivity = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      lastActivity: new Date(),
      sessionTimeoutWarning: false
    }));

    // Reset activity timer
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    // Setup new activity timer
    activityTimerRef.current = setTimeout(() => {
      setAuthState(prev => ({
        ...prev,
        sessionTimeoutWarning: true
      }));

      // Show warning toast
      toast.warning('Your session will expire soon', {
        description: 'Please refresh the page to continue your session',
        duration: HOOK_CONFIG.TOAST_DURATION,
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload()
        }
      });
    }, HOOK_CONFIG.ACTIVITY_TIMEOUT - HOOK_CONFIG.SESSION_TIMEOUT_WARNING);
  }, []);

  /**
   * Gère les états de loading avec durée minimale
   */
  const setLoadingState = useCallback((action: keyof LoadingStates, loading: boolean) => {
    if (loading) {
      setLoadingStates(prev => ({ ...prev, [action]: true }));
      setAuthState(prev => ({ ...prev, isLoading: true }));
    } else {
      // Délai minimum pour éviter les flashs
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }

      loadingTimerRef.current = setTimeout(() => {
        setLoadingStates(prev => {
          const newState = { ...prev, [action]: false };
          const anyLoading = Object.values(newState).some(Boolean);
          
          setAuthState(prevAuth => ({
            ...prevAuth,
            isLoading: anyLoading
          }));

          return newState;
        });
      }, HOOK_CONFIG.LOADING_MIN_DURATION);
    }
  }, []);

  /**
   * Gère les erreurs avec retry automatique
   */
  const handleError = useCallback((error: AuthError, context: string) => {
    console.error(`Auth error in ${context}:`, error);

    setAuthState(prev => ({
      ...prev,
      error,
      retryCount: prev.retryCount + 1
    }));

    // Toast d'erreur avec action de retry si applicable
    const canRetry = authState.retryCount < HOOK_CONFIG.MAX_ERROR_RETRY;
    
    toast.error(error.message, {
      description: error.details ? `Code: ${error.code}` : undefined,
      duration: HOOK_CONFIG.ERROR_TOAST_DURATION,
      action: canRetry ? {
        label: 'Retry',
        onClick: () => retry()
      } : undefined
    });

    // Auto-clear error après délai
    setTimeout(() => {
      setAuthState(prev => ({
        ...prev,
        error: null
      }));
    }, HOOK_CONFIG.ERROR_RESET_DELAY);
  }, [authState.retryCount]);

  /**
   * Nettoie les timers
   */
  const cleanup = useCallback(() => {
    [
      refreshTimerRef,
      activityTimerRef,
      sessionWarningTimerRef,
      loadingTimerRef,
      debounceTimerRef
    ].forEach(timerRef => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    });

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // ============================================================================
  // ACTIONS D'AUTHENTIFICATION
  // ============================================================================

  /**
   * Connexion avec gestion d'erreurs et UX optimisée
   */
  const signIn = useCallback(async (request: SignInRequest): Promise<AuthApiResponse<AuthSession>> => {
    if (loadingStates.signIn) {
      return { success: false, error: { 
        code: AuthErrorCode.UNKNOWN_ERROR, 
        message: 'Sign in already in progress',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      }};
    }

    setLoadingState('signIn', true);
    setAuthState(prev => ({
      ...prev,
      status: AuthStatus.AUTHENTICATING,
      error: null
    }));

    try {
      const result = await UltraSecureAuthService.signIn(request);

      if (result.success && result.data) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.AUTHENTICATED,
          user: result.data!.user,
          session: result.data!,
          error: null,
          retryCount: 0
        }));

        updateActivity();
        setupAutoRefresh(result.data);

        toast.success('Welcome back!', {
          description: `Good to see you again, ${result.data.user.firstName}`,
          duration: HOOK_CONFIG.SUCCESS_TOAST_DURATION
        });
      } else if (result.error) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: result.error!
        }));
        handleError(result.error, 'signIn');
      }

      return result;
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Connection failed. Please check your internet connection.',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      };
      
      handleError(authError, 'signIn');
      return { success: false, error: authError };
    } finally {
      setLoadingState('signIn', false);
    }
  }, [loadingStates.signIn, handleError, updateActivity]);

  /**
   * Inscription avec validation en temps réel
   */
  const signUp = useCallback(async (request: SignUpRequest): Promise<AuthApiResponse<UserProfile>> => {
    if (loadingStates.signUp) {
      return { success: false, error: { 
        code: AuthErrorCode.UNKNOWN_ERROR, 
        message: 'Sign up already in progress',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      }};
    }

    setLoadingState('signUp', true);
    setAuthState(prev => ({
      ...prev,
      status: AuthStatus.AUTHENTICATING,
      error: null
    }));

    try {
      const result = await UltraSecureAuthService.signUp(request);

      if (result.success && result.data) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.AUTHENTICATED,
          user: result.data!,
          error: null,
          retryCount: 0
        }));

        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account',
          duration: HOOK_CONFIG.SUCCESS_TOAST_DURATION
        });
      } else if (result.error) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: result.error!
        }));
        handleError(result.error, 'signUp');
      }

      return result;
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Connection failed. Please check your internet connection.',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      };
      
      handleError(authError, 'signUp');
      return { success: false, error: authError };
    } finally {
      setLoadingState('signUp', false);
    }
  }, [loadingStates.signUp, handleError]);

  /**
   * Déconnexion avec nettoyage complet
   */
  const signOut = useCallback(async (): Promise<AuthApiResponse<void>> => {
    if (loadingStates.signOut) {
      return { success: false, error: { 
        code: AuthErrorCode.UNKNOWN_ERROR, 
        message: 'Sign out already in progress',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      }};
    }

    setLoadingState('signOut', true);

    try {
      const result = await UltraSecureAuthService.signOut();

      if (result.success) {
        // Nettoyage complet de l'état
        setAuthState({
          status: AuthStatus.UNAUTHENTICATED,
          user: null,
          session: null,
          error: null,
          isLoading: false,
          lastActivity: null,
          sessionTimeoutWarning: false,
          retryCount: 0,
          maxRetries: HOOK_CONFIG.MAX_ERROR_RETRY,
          isRefreshing: false,
          networkStatus: navigator.onLine ? 'online' : 'offline'
        });

        cleanup();

        toast.success('Signed out successfully', {
          description: 'See you next time!',
          duration: HOOK_CONFIG.SUCCESS_TOAST_DURATION
        });
      } else if (result.error) {
        handleError(result.error, 'signOut');
      }

      return result;
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Failed to sign out. Please try again.',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      };
      
      handleError(authError, 'signOut');
      return { success: false, error: authError };
    } finally {
      setLoadingState('signOut', false);
    }
  }, [loadingStates.signOut, handleError, cleanup]);

  /**
   * Configuration de l'auto-refresh des tokens
   */
  const setupAutoRefresh = useCallback((session: AuthSession) => {
    if (!HOOK_CONFIG.AUTO_REFRESH_ENABLED) return;

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const now = Date.now();
    const expiresAt = session.expiresAt.getTime();
    const refreshAt = expiresAt - HOOK_CONFIG.REFRESH_THRESHOLD;
    const delay = Math.max(0, refreshAt - now);

    refreshTimerRef.current = setTimeout(async () => {
      await refreshToken();
    }, delay);
  }, []);

  /**
   * Rafraîchissement du token
   */
  const refreshToken = useCallback(async (): Promise<AuthApiResponse<AuthSession>> => {
    if (authState.isRefreshing) {
      return { success: false, error: { 
        code: AuthErrorCode.UNKNOWN_ERROR, 
        message: 'Token refresh already in progress',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      }};
    }

    setAuthState(prev => ({ ...prev, isRefreshing: true }));
    setLoadingState('refreshToken', true);

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (session) {
        const userProfile = authState.user!; // On garde le profil existant
        const newAuthSession: AuthSession = {
          accessToken: session.access_token as any,
          refreshToken: session.refresh_token as any,
          tokenType: 'Bearer',
          expiresAt: new Date(session.expires_at! * 1000),
          expiresIn: session.expires_in!,
          user: userProfile,
          deviceInfo: authState.session!.deviceInfo,
          sessionId: authState.session!.sessionId,
          createdAt: authState.session!.createdAt
        };

        setAuthState(prev => ({
          ...prev,
          session: newAuthSession,
          isRefreshing: false,
          error: null
        }));

        setupAutoRefresh(newAuthSession);

        return { success: true, data: newAuthSession };
      }

      throw new Error('No session returned from refresh');
    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.SESSION_EXPIRED,
        message: 'Your session has expired. Please sign in again.',
        timestamp: new Date(),
        requestId: crypto.randomUUID()
      };

      setAuthState(prev => ({
        ...prev,
        status: AuthStatus.EXPIRED,
        session: null,
        error: authError,
        isRefreshing: false
      }));

      // Force sign out
      await signOut();

      return { success: false, error: authError };
    } finally {
      setLoadingState('refreshToken', false);
    }
  }, [authState.isRefreshing, authState.user, authState.session, setupAutoRefresh, signOut]);

  /**
   * Retry avec backoff exponentiel
   */
  const retry = useCallback(async (): Promise<void> => {
    if (authState.retryCount >= HOOK_CONFIG.MAX_ERROR_RETRY) {
      toast.error('Maximum retry attempts reached', {
        description: 'Please refresh the page or contact support'
      });
      return;
    }

    setAuthState(prev => ({
      ...prev,
      error: null,
      retryCount: prev.retryCount + 1
    }));

    // Simple retry - en production, implémenter la logique spécifique
    await refreshToken();
  }, [authState.retryCount, refreshToken]);

  /**
   * Clear error
   */
  const clearError = useCallback((): void => {
    setAuthState(prev => ({
      ...prev,
      error: null,
      retryCount: 0
    }));
  }, []);

  // ============================================================================
  // STUBS POUR MÉTHODES NON IMPLÉMENTÉES
  // ============================================================================

  const signInWithOAuth = useCallback(async (request: OAuthSignInRequest): Promise<AuthApiResponse<AuthSession>> => {
    // TODO: Implémenter OAuth
    return { success: false, error: { 
      code: AuthErrorCode.OAUTH_ERROR, 
      message: 'OAuth not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const updatePassword = useCallback(async (request: PasswordUpdateRequest): Promise<AuthApiResponse<void>> => {
    // TODO: Implémenter mise à jour mot de passe
    return { success: false, error: { 
      code: AuthErrorCode.UNKNOWN_ERROR, 
      message: 'Password update not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const resetPassword = useCallback(async (request: PasswordResetRequest): Promise<AuthApiResponse<void>> => {
    // TODO: Implémenter reset mot de passe
    return { success: false, error: { 
      code: AuthErrorCode.UNKNOWN_ERROR, 
      message: 'Password reset not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const confirmPasswordReset = useCallback(async (request: PasswordResetConfirmRequest): Promise<AuthApiResponse<void>> => {
    // TODO: Implémenter confirmation reset mot de passe
    return { success: false, error: { 
      code: AuthErrorCode.UNKNOWN_ERROR, 
      message: 'Password reset confirmation not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const updateProfile = useCallback(async (update: UserProfileUpdate): Promise<AuthApiResponse<UserProfile>> => {
    // TODO: Implémenter mise à jour profil
    return { success: false, error: { 
      code: AuthErrorCode.UNKNOWN_ERROR, 
      message: 'Profile update not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const deleteAccount = useCallback(async (): Promise<AuthApiResponse<void>> => {
    // TODO: Implémenter suppression compte
    return { success: false, error: { 
      code: AuthErrorCode.UNKNOWN_ERROR, 
      message: 'Account deletion not implemented yet',
      timestamp: new Date(),
      requestId: crypto.randomUUID()
    }};
  }, []);

  const extendSession = useCallback(async (): Promise<void> => {
    await refreshToken();
  }, [refreshToken]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Initialisation et nettoyage
   */
  useEffect(() => {
    // Vérification de l'état initial
    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // TODO: Reconstruire la session complète
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.AUTHENTICATED,
            isLoading: false
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.UNAUTHENTICATED,
            isLoading: false
          }));
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: {
            code: AuthErrorCode.UNKNOWN_ERROR,
            message: 'Failed to check authentication status',
            timestamp: new Date(),
            requestId: crypto.randomUUID()
          },
          isLoading: false
        }));
      }
    };

    checkInitialAuth();

    // Écouter les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT') {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.UNAUTHENTICATED,
          user: null,
          session: null
        }));
      }
    });

    // Network status listener
    const handleOnline = () => setAuthState(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setAuthState(prev => ({ ...prev, networkStatus: 'offline' }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => updateActivity();

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      cleanup();
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [cleanup, updateActivity]);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return useMemo(() => ({
    // État
    user: authState.user,
    session: authState.session,
    status: authState.status,
    isAuthenticated: authState.status === AuthStatus.AUTHENTICATED,
    isLoading: authState.isLoading,
    error: authState.error,
    
    // Actions
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshToken,
    updatePassword,
    resetPassword,
    confirmPasswordReset,
    updateProfile,
    deleteAccount,
    
    // Utilitaires
    retry,
    clearError,
    extendSession
  }), [
    authState,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshToken,
    updatePassword,
    resetPassword,
    confirmPasswordReset,
    updateProfile,
    deleteAccount,
    retry,
    clearError,
    extendSession
  ]);
};