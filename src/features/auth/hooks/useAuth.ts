import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../../../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  onboarding_completed: boolean;
  role?: string;
  created_at: string;
  updated_at: string;
  // Ajoute ici les autres champs de ton profil
}

export interface UseAuthResult {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupère la session et le profil utilisateur
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      // Récupère le profil dans Supabase
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setUser(profile || null);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
    // Rafraîchit l'utilisateur à chaque changement de session
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser]);

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      const { error: _error } = await supabase.auth.signInWithPassword({ email, password });
      await fetchUser();
      setIsLoading(false);
      return { error: _error?.message };
    },
    [fetchUser]
  );

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  }, []);

  // Refresh
  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    hasCompletedOnboarding: !!user?.onboarding_completed,
    login,
    logout,
    refresh,
  };
}

export default useAuth;

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

// Hook for requiring authentication
export const useRequireAuth = () => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login or handle unauthorized access
      console.warn('Authentication required');
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
};

// Alias for useAuth
export const useUserProfile = useAuth;
