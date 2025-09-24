import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: 'male' | 'female' | 'other' | null;
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
  goals: string[] | null;
  preferred_sports: string[] | null;
  timezone: string | null;
  language: string | null;
  notifications_enabled: boolean | null;
  onboarding_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur récupération profil:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur inattendue profil:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur déconnexion:', error);
      }
    } catch (error) {
      console.error('Erreur inattendue déconnexion:', error);
    }
  };

  useEffect(() => {
    // Récupération de la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur récupération session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Erreur inattendue session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Écoute des changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Utilisateur connecté - récupérer le profil
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          // Utilisateur déconnecté
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour vérifier si l'utilisateur est authentifié
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  return { isAuthenticated: !!user, loading };
};

// Hook pour les données du profil utilisateur
export const useUserProfile = () => {
  const { profile, refreshProfile } = useAuth();
  return { profile, refreshProfile };
};