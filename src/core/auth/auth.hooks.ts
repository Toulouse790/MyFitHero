import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from './auth.store';
import { SignUpData, SignInData, UpdateProfileData } from './auth.types';

// Hook principal pour l'authentification
export const useAuth = () => {
  const authStore = useAuthStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    authStore.checkAuth();
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      await authStore.signUp(data);
      navigate('/dashboard'); // Redirection vers le dashboard après inscription
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      await authStore.signIn(data);
      navigate('/dashboard'); // Redirection vers le dashboard après connexion
    } catch (error) {
      console.error('Erreur connexion:', error);
    }
  };

  const signOut = async () => {
    try {
      await authStore.signOut();
      navigate('/auth'); // Redirection vers auth après déconnexion
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      await authStore.updateProfile(data);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return false;
    }
  };

  return {
    user: authStore.user,
    session: authStore.session,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    checkAuth: authStore.checkAuth,
  };
};

// Hook pour l'utilisateur uniquement
export const useUser = () => {
  const { user } = useAuthStore();
  return user;
};

// Hook pour vérifier l'authentification
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated;
};

// Hook pour protéger les routes
export const useRequireAuth = (redirectTo = '/auth') => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

// Hook pour les pages publiques (redirection si déjà connecté)
export const usePublicRoute = (redirectTo = '/dashboard') => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};
