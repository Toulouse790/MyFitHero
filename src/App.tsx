import React, { useEffect, useState, Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { createClient, Session } from '@supabase/supabase-js';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from 'react-error-boundary';

// Configuration et services core
import { env } from './core/config/env.config';
import { appConfig } from './core/config/app.config';

// Types
interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Client Supabase
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Hook d'authentification personnalisé
function useAuthState(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Fonction pour formater l'utilisateur depuis Supabase
  const formatUser = (supabaseUser: any): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email,
    username: supabaseUser.user_metadata?.username,
    firstName: supabaseUser.user_metadata?.firstName,
    lastName: supabaseUser.user_metadata?.lastName,
    sport: supabaseUser.user_metadata?.sport,
    onboardingCompleted: supabaseUser.user_metadata?.onboardingCompleted || false,
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
  });

  // Initialisation et gestion des sessions
  useEffect(() => {
    // Récupération de la session actuelle
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur récupération session:', error);
          setAuthState(prev => ({ ...prev, error: error.message, isLoading: false }));
          return;
        }

        if (session?.user) {
          const user = formatUser(session.user);
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Erreur lors de l\'initialisation', 
          isLoading: false 
        }));
      }
    };

    initializeAuth();

    // Écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user = formatUser(session.user);
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Méthodes d'authentification
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // L'état sera mis à jour par onAuthStateChange
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message || 'Erreur de connexion',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // L'état sera mis à jour par onAuthStateChange
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message || 'Erreur d\'inscription',
        isLoading: false 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message || 'Erreur de déconnexion',
        isLoading: false 
      }));
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!authState.user) throw new Error('Utilisateur non connecté');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) throw error;

      // L'état sera mis à jour par onAuthStateChange
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error.message || 'Erreur de mise à jour'
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}

// Composants de pages (lazy loading)
const AuthPage = React.lazy(() => import('./features/auth/pages/AuthPage'));
const OnboardingFlow = React.lazy(() => import('./features/onboarding/pages/OnboardingFlow'));
const Dashboard = React.lazy(() => import('./features/dashboard/pages/Dashboard'));
const UserProfile = React.lazy(() => import('./features/profile/pages/UserProfile'));
const WorkoutPage = React.lazy(() => import('./features/workout/pages/WorkoutPage'));
const NutritionPage = React.lazy(() => import('./features/nutrition/pages/NutritionPage'));
const AnalyticsPage = React.lazy(() => import('./features/analytics/pages/AnalyticsPage'));
const SocialPage = React.lazy(() => import('./features/social/pages/SocialPage'));

// Composant de chargement sophistiqué
function AppLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {appConfig.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chargement de votre espace personnel...
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant d'erreur
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
          Une erreur est survenue
        </h1>
        <p className="text-red-600 dark:text-red-300 mb-6">
          {error.message || 'Une erreur inattendue s\'est produite'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Réessayer
        </button>
        {env.APP_ENV === 'development' && (
          <details className="mt-6 text-left bg-red-100 dark:bg-red-900/40 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-red-800 dark:text-red-200">
              Détails de l'erreur (dev)
            </summary>
            <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Composant de protection de route
function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireOnboarding = false 
}: { 
  children: React.ReactNode; 
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}) {
  const { isAuthenticated, isLoading, user } = useAuthState();

  if (isLoading) {
    return <AppLoadingSpinner />;
  }

  // Redirection si auth requise mais pas connecté
  if (requireAuth && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  // Redirection si pas d'auth requise mais connecté
  if (!requireAuth && isAuthenticated) {
    // Si onboarding pas terminé, rediriger vers onboarding
    if (!user?.onboardingCompleted) {
      return <Redirect to="/onboarding" />;
    }
    return <Redirect to="/dashboard" />;
  }

  // Redirection si onboarding requis mais pas terminé
  if (requireOnboarding && user && !user.onboardingCompleted) {
    return <Redirect to="/onboarding" />;
  }

  return <>{children}</>;
}

// Application principale
function App() {
  const { isLoading } = useAuthState();

  // Chargement initial
  if (isLoading) {
    return <AppLoadingSpinner />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={['light', 'dark']}
      storageKey={`${appConfig.name.toLowerCase()}-theme`}
    >
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('App Error Boundary:', error, errorInfo);
          // Ici vous pourriez envoyer l'erreur à un service de monitoring
        }}
        onReset={() => {
          // Nettoyer l'état si nécessaire
          window.location.reload();
        }}
      >
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<AppLoadingSpinner />}>
              <Switch>
                {/* Route d'authentification */}
                <Route path="/">
                  <ProtectedRoute requireAuth={false}>
                    <AuthPage />
                  </ProtectedRoute>
                </Route>

                {/* Flow d'onboarding */}
                <Route path="/onboarding/:step?">
                  <ProtectedRoute requireAuth={true} requireOnboarding={false}>
                    <OnboardingFlow />
                  </ProtectedRoute>
                </Route>

                {/* Dashboard principal */}
                <Route path="/dashboard/:module?">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <Dashboard />
                  </ProtectedRoute>
                </Route>

                {/* Profil utilisateur */}
                <Route path="/profile">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <UserProfile />
                  </ProtectedRoute>
                </Route>

                {/* Routes des features */}
                <Route path="/workout/:id?">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <WorkoutPage />
                  </ProtectedRoute>
                </Route>

                <Route path="/nutrition">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <NutritionPage />
                  </ProtectedRoute>
                </Route>

                <Route path="/analytics">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                </Route>

                <Route path="/social">
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <SocialPage />
                  </ProtectedRoute>
                </Route>

                {/* Page 404 */}
                <Route>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        404
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Page non trouvée
                      </p>
                      <a
                        href="/dashboard"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Retour au tableau de bord
                      </a>
                    </div>
                  </div>
                </Route>
              </Switch>
            </Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
