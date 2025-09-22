import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  email?: string;
  avatar_url?: string | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  fitness_goal?: string | null;
  onboarding_completed?: boolean | null;
  onboarding_completed_at?: string | null;
  role?: 'user' | 'admin' | 'coach' | 'moderator';
  created_at?: string | null;
  updated_at?: string | null;
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
        .from('user_profiles')
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
