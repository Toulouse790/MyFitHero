import { supabase } from '@/lib/supabase';

interface AuthResult {
  user?: any;
  error?: string;
}

export const authClient = {
  async register(email: string, username: string, password: string): Promise<AuthResult> {
    try {
      const { data, error }: any = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            username,
            full_name: username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't return error here, user is created but profile might need manual fix
        }

        return { user: data.user };
      }

      return { error: 'Échec de la création du compte' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error: 'Une erreur est survenue lors de l\'inscription' };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error }: any = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        return { user: data.user };
      }

      return { error: 'Échec de la connexion' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: 'Une erreur est survenue lors de la connexion' };
    }
  },

  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: 'Une erreur est survenue lors de la déconnexion' };
    }
  },

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: 'Une erreur est survenue lors de la réinitialisation' };
    }
  }
};