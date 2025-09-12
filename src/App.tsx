import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { useLocation } from 'wouter';
import { createClient, Session } from '@supabase/supabase-js';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Configuration et services core
import { env } from './core/config/env.config';
import LoadingScreen from './components/LoadingScreen';

// Lazy loading des composants principaux
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const OnboardingFlow = lazy(() => import('./features/onboarding/pages/OnboardingFlow'));
const Dashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));

// Types
interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
  level?: string;
  goals?: string[];
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  lifestyle?: string;
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

// QueryClient pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Hook d'authentification personnalisé
function useAuthState(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Fonction pour formater l'utilisateur depuis Supabase
  const formatUser = (supabaseUser: any, profile: any = null): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      username: profile?.username || supabaseUser.user_metadata?.username,
      firstName: profile?.first_name || supabaseUser.user_metadata?.firstName,
      lastName: profile?.last_name || supabaseUser.user_metadata?.lastName,
      sport: profile?.sport,
      level: profile?.level,
      goals: profile?.goals || [],
      age: profile?.age,
      weight: profile?.weight,
      height: profile?.height,
      gender: profile?.gender,
      lifestyle: profile?.lifestyle,
      onboardingCompleted: profile?.onboarding_completed || false,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at,
    };
  };

  // Initialisation de l'état d'authentification
  useEffect(() => {
    let mounted = true;

    // Vérifier la session existante
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session && mounted) {
          // Récupérer le profil utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user = formatUser(session.user, profile);
          
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else if (mounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
          }));
        }
      }
    };

    getInitialSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);

        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user = formatUser(session.user, profile);
          
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });

          // Redirection après connexion/inscription
          // Note: La redirection sera gérée par le composant Router
        } else if (event === 'SIGNED_OUT') {
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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Connexion réussie !');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de connexion';
      setAuthState(prev => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  // Fonction d'inscription
  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      toast.success('Inscription réussie ! Vérifiez votre email.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setAuthState(prev => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success('Déconnexion réussie');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de déconnexion';
      setAuthState(prev => ({ ...prev, error: message }));
      throw error;
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authState.user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));

      toast.success('Profil mis à jour');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de mise à jour';
      toast.error(message);
      throw error;
    }
  };

  // Fonction de completion de l'onboarding
  const completeOnboarding = async (data: any) => {
    try {
      if (!authState.user) throw new Error('Utilisateur non connecté');

      await updateProfile({
        ...data,
        onboardingCompleted: true,
      });

      toast.success('Configuration terminée ! Bienvenue dans MyFitHero 🎉');
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    completeOnboarding,
  };
}

// Composant App principal
function App() {
  const auth = useAuthState();
  const [, setLocation] = useLocation();

  // Handler pour la completion de l'onboarding
  const handleOnboardingComplete = async (data: any) => {
    try {
      await auth.completeOnboarding(data);
      // Rediriger vers le dashboard après completion
      setLocation('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la completion de l\'onboarding:', error);
      toast.error('Erreur lors de la sauvegarde de votre profil');
    }
  };

  // Affichage du loading principal
  if (auth.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Switch>
              {/* Route racine */}
              <Route path="/">
                {auth.isAuthenticated ? (
                  auth.user?.onboardingCompleted ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Redirect to="/onboarding" />
                  )
                ) : (
                  <AuthPage />
                )}
              </Route>

              {/* Route auth - redirige si déjà connecté */}
              <Route path="/auth">
                {auth.isAuthenticated ? (
                  auth.user?.onboardingCompleted ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Redirect to="/onboarding" />
                  )
                ) : (
                  <AuthPage />
                )}
              </Route>

              {/* Route onboarding - protégée */}
              <Route path="/onboarding">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : auth.user?.onboardingCompleted ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                )}
              </Route>

              {/* Route dashboard - protégée et onboarding requis */}
              <Route path="/dashboard">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : !auth.user?.onboardingCompleted ? (
                  <Redirect to="/onboarding" />
                ) : (
                  <Dashboard user={auth.user} onLogout={auth.signOut} />
                )}
              </Route>

              {/* Page 404 */}
              <Route>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      404
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Page non trouvée
                    </p>
                    <button
                      onClick={() => setLocation('/')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Retour à l'accueil
                    </button>
                  </div>
                </div>
              </Route>
            </Switch>
          </Suspense>
        </Router>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
