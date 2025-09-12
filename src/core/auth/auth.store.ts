import { Check } from 'lucide-react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User, SignUpData, SignInData, UpdateProfileData } from './auth.types';
import { supabaseAuth } from '../api/supabase.client';

interface AuthStore extends AuthState {
  // Actions
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sign up
      signUp: async (data: SignUpData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error } = await supabaseAuth.signUp(
            data.email,
            data.password,
            {
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
            }
          );

          if (error) throw error;

          if (authData.user && authData.session) {
            const user: User = {
              id: authData.user.id,
              email: authData.user.email!,
              username: authData.user.user_metadata?.username,
              firstName: authData.user.user_metadata?.firstName,
              lastName: authData.user.user_metadata?.lastName,
              createdAt: authData.user.created_at,
              updatedAt: authData.user.updated_at || authData.user.created_at,
            };

            set({
              user,
              session: authData.session,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || "Erreur lors de l'inscription",
            isLoading: false,
          });
          throw error;
        }
      },

      // Sign in
      signIn: async (data: SignInData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error } = await supabaseAuth.signIn(
            data.email,
            data.password
          );

          if (error) throw error;

          if (authData.user && authData.session) {
            const user: User = {
              id: authData.user.id,
              email: authData.user.email!,
              username: authData.user.user_metadata?.username,
              firstName: authData.user.user_metadata?.firstName,
              lastName: authData.user.user_metadata?.lastName,
              sport: authData.user.user_metadata?.sport,
              weight: authData.user.user_metadata?.weight,
              height: authData.user.user_metadata?.height,
              age: authData.user.user_metadata?.age,
              gender: authData.user.user_metadata?.gender,
              lifestyle: authData.user.user_metadata?.lifestyle,
              primaryGoals: authData.user.user_metadata?.primaryGoals,
              createdAt: authData.user.created_at,
              updatedAt: authData.user.updated_at || authData.user.created_at,
            };

            set({
              user,
              session: authData.session,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la connexion',
            isLoading: false,
          });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        try {
          await supabaseAuth.signOut();
          set(initialState);
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la déconnexion',
            isLoading: false,
          });
        }
      },

      // Update profile
      updateProfile: async (data: UpdateProfileData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error } = await supabaseAuth.updateUser({
            data,
          });

          if (error) throw error;

          const currentUser = get().user;
          if (currentUser && authData.user) {
            const updatedUser: User = {
              ...currentUser,
              ...data,
              updatedAt: new Date().toISOString(),
            };

            set({
              user: updatedUser,
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || 'Erreur lors de la mise à jour du profil',
            isLoading: false,
          });
          throw error;
        }
      },

      // Check auth
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data } = await supabaseAuth.getSession();
          
          if (data.session) {
            const { data: userData } = await supabaseAuth.getUser();
            
            if (userData.user) {
              const user: User = {
                id: userData.user.id,
                email: userData.user.email!,
                username: userData.user.user_metadata?.username,
                firstName: userData.user.user_metadata?.firstName,
                lastName: userData.user.user_metadata?.lastName,
                sport: userData.user.user_metadata?.sport,
                weight: userData.user.user_metadata?.weight,
                height: userData.user.user_metadata?.height,
                age: userData.user.user_metadata?.age,
                gender: userData.user.user_metadata?.gender,
                lifestyle: userData.user.user_metadata?.lifestyle,
                primaryGoals: userData.user.user_metadata?.primaryGoals,
                createdAt: userData.user.created_at,
                updatedAt: userData.user.updated_at || userData.user.created_at,
              };

              set({
                user,
                session: data.session,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } else {
            set({
              ...initialState,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setError: (error) => set({ error }),
      resetAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
