import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { useLocation } from 'wouter';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Configuration et services core
import { env } from './core/config/env.config';
import { supabase } from './lib/supabase';
import { appStore } from './store/appStore';
import { UserProfile } from './shared/types/user';
import LoadingScreen from './components/LoadingScreen';

// Imports des composants avec lazy loading
const LandingPage = lazy(() => import('./features/landing/pages/LandingPage'));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage'));
const Dashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));
const OnboardingQuestionnaire = lazy(() => import('./features/ai-coach/components/OnboardingQuestionnaire'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('./features/profile/pages/SettingsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
  gender?: 'male' | 'female';
  lifestyle?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
  // Ajout des propriétés manquantes pour les modules
  active_modules?: string[];
  profile_type?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

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

  // Fonction pour convertir camelCase vers snake_case pour Supabase
  const toSupabasePayload = (data: Partial<User>): any => {
    const payload: any = {};
    
    // Combiner firstName et lastName en full_name
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const firstName = data.firstName || '';
      const lastName = data.lastName || '';
      payload.full_name = `${firstName} ${lastName}`.trim() || null;
    }
    
    if (data.onboardingCompleted !== undefined) payload.onboarding_completed = data.onboardingCompleted;
    if (data.username !== undefined) payload.username = data.username;
    
    // Mapper sport vers preferred_sports (array)
    if (data.sport !== undefined) payload.preferred_sports = data.sport ? [data.sport] : null;
    
    // Mapper level vers activity_level (mapper les valeurs si nécessaire)
    if (data.level !== undefined) {
      const levelMapping: Record<string, string> = {
        'beginner': 'lightly_active',
        'intermediate': 'moderately_active', 
        'advanced': 'very_active',
        'expert': 'extremely_active'
      };
      payload.activity_level = levelMapping[data.level] || 'moderately_active';
    }
    
    // Mapper lifestyle vers activity_level
    if (data.lifestyle !== undefined) {
      payload.activity_level = data.lifestyle;
    }
    
    if (data.goals !== undefined) payload.goals = data.goals;
    if (data.age !== undefined) payload.age = data.age;
    if (data.weight !== undefined) payload.weight = data.weight;
    if (data.height !== undefined) payload.height = data.height;
    if (data.gender !== undefined) payload.gender = data.gender;
    
    return payload;
  };

  // Fonction pour formater l'utilisateur depuis Supabase
  const formatUser = (supabaseUser: any, profile: any = null): User => {
    // Séparer full_name en firstName et lastName
    const fullName = profile?.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Mapper activity_level vers level et lifestyle 
    const activityToLevel: Record<string, string> = {
      'lightly_active': 'beginner',
      'moderately_active': 'intermediate',
      'very_active': 'advanced', 
      'extremely_active': 'expert',
      'sedentary': 'beginner'
    };
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      username: profile?.username || supabaseUser.user_metadata?.username,
      firstName: firstName || supabaseUser.user_metadata?.firstName,
      lastName: lastName || supabaseUser.user_metadata?.lastName,
      sport: profile?.preferred_sports?.[0] || null, // Premier sport de la liste
      level: activityToLevel[profile?.activity_level] || 'intermediate',
      goals: profile?.goals || [],
      age: profile?.age,
      weight: profile?.weight,
      height: profile?.height,
      gender: profile?.gender,
      lifestyle: profile?.activity_level || 'moderately_active',
      onboardingCompleted: profile?.onboarding_completed || false,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at,
      // ✅ AJOUT DES PROPRIÉTÉS MANQUANTES POUR LES MODULES
      active_modules: profile?.active_modules || [],
      profile_type: profile?.profile_type || null,
    };
  };

  // Fonction pour convertir User vers UserProfile pour appStore
  const convertToUserProfile = (user: User): UserProfile => {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      first_name: user.firstName,
      avatar_url: undefined,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activity_level: user.lifestyle as any,
      primary_goals: user.goals,
      preferred_sports: user.sport ? [user.sport] : undefined,
      sport: user.sport,
      fitness_experience: typeof user.level === 'string' ? user.level as 'beginner' | 'intermediate' | 'advanced' | 'expert' : undefined,
      // ✅ PROPAGATION DES MODULES VERS LE STORE
      active_modules: user.active_modules || [],
      profile_type: (user.profile_type as 'complete' | 'wellness' | 'sport_only' | 'sleep_focus') || undefined,
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
            .from('user_profiles')
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
          
          // Synchroniser avec appStore
          const userProfile = convertToUserProfile(user);
          appStore.getState().setUser(userProfile);
        } else if (mounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
          
          // Nettoyer appStore si pas d'utilisateur
          appStore.getState().setUser(null);
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
            .from('user_profiles')
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
          
          // Synchroniser avec appStore
          const userProfile = convertToUserProfile(user);
          appStore.getState().setUser(userProfile);

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
          
          // Nettoyer appStore lors de la déconnexion
          appStore.getState().setUser(null);
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
      setAuthState(prev => ({ ...prev, error: message }));
      throw error;
    } finally {
      // S'assurer que isLoading est remis à false dans tous les cas
      setAuthState(prev => ({ ...prev, isLoading: false }));
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
      setAuthState(prev => ({ ...prev, error: message }));
      throw error;
    } finally {
      // S'assurer que isLoading est remis à false dans tous les cas
      setAuthState(prev => ({ ...prev, isLoading: false }));
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
    } finally {
      // S'assurer que isLoading est remis à false dans tous les cas
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('Utilisateur non connecté');

      console.log('🔄 UpdateProfile - Data to update:', data);
      console.log('🔄 UpdateProfile - Current authState.user:', authState.user);

      // Convertir les données camelCase vers snake_case pour Supabase
      const supabasePayload = toSupabasePayload(data);
      console.log('📤 UpdateProfile - Supabase payload:', supabasePayload);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: authState.user.id,
          email: authState.user.email, // Inclure l'email requis
          ...supabasePayload,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Mettre à jour l'état local avec les données camelCase originales
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
      
      // Synchroniser avec appStore
      if (authState.user) {
        const updatedUser = { ...authState.user, ...data };
        const userProfile = convertToUserProfile(updatedUser);
        console.log('📤 UpdateProfile - Syncing with appStore:', userProfile);
        appStore.getState().setUser(userProfile);
        console.log('✅ UpdateProfile - AppStore updated successfully');
      }

      toast.success('Profil mis à jour');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de mise à jour';
      console.error('❌ UpdateProfile error:', error);
      toast.error(message);
      throw error;
    }
  };

  // Fonction de completion de l'onboarding
  const completeOnboarding = async (data: any) => {
    try {
      if (!authState.user) throw new Error('Utilisateur non connecté');

      console.log('🔄 CompleteOnboarding - Data received:', data);
      console.log('🔄 CompleteOnboarding - Current user before update:', authState.user);

      await updateProfile({
        ...data,
        onboardingCompleted: true,
      });

      // Vérifier que appStore a bien été mis à jour
      const currentAppStoreUser = appStore.getState().appStoreUser;
      console.log('✅ CompleteOnboarding - AppStore user after update:', currentAppStoreUser);

      toast.success('Configuration terminée ! Bienvenue dans MyFitHero 🎉');
    } catch (error) {
      console.error('❌ CompleteOnboarding error:', error);
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
  const handleOnboardingComplete = async (data?: any) => {
    try {
      // Si des données sont fournies, les sauvegarder (OnboardingFlow)
      if (data) {
        await auth.completeOnboarding(data);
      }
      // Sinon, les données sont déjà sauvegardées (OnboardingQuestionnaire)
      
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

              {/* Route reset password */}
              <Route path="/reset-password">
                <ResetPasswordPage />
              </Route>

              {/* Route auth/reset-password */}
              <Route path="/auth/reset-password">
                <ResetPasswordPage />
              </Route>

              {/* Route onboarding - protégée */}
              <Route path="/onboarding">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : auth.user?.onboardingCompleted ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <OnboardingQuestionnaire 
                    user={auth.user} 
                    onComplete={handleOnboardingComplete} 
                  />
                )}
              </Route>

              {/* Route dashboard - protégée et onboarding requis */}
              <Route path="/dashboard">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : !auth.user?.onboardingCompleted ? (
                  <Redirect to="/onboarding" />
                ) : (
                  <Dashboard />
                )}
              </Route>

              {/* Route profile - protégée et onboarding requis */}
              <Route path="/profile">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : !auth.user?.onboardingCompleted ? (
                  <Redirect to="/onboarding" />
                ) : (
                  <ProfilePage />
                )}
              </Route>

              {/* Route settings - protégée et onboarding requis */}
              <Route path="/settings">
                {!auth.isAuthenticated ? (
                  <Redirect to="/" />
                ) : !auth.user?.onboardingCompleted ? (
                  <Redirect to="/onboarding" />
                ) : (
                  <SettingsPage />
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
