import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Chrome, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Separator } from '../../../../components/ui/separator';
import { supabase } from '../../../core/api/supabase.client';

// Schémas de validation Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(255, 'Email trop long'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Mot de passe trop long'),
});

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Caractères invalides dans le prénom'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Caractères invalides dans le nom'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(255, 'Email trop long'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Mot de passe trop long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    ),
  confirmPassword: z.string().min(1, 'Confirmez votre mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form pour login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Form pour register
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
  });

  // Fonction pour vérifier si le profil est complet
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Erreur lors de la vérification du profil:', error);
        return false;
      }

      // Vérifier si les champs essentiels sont remplis
      const isComplete = profile && 
        profile.first_name && 
        profile.last_name && 
        profile.age && 
        profile.weight && 
        profile.height;

      return !!isComplete;
    } catch (error) {
      console.warn('Erreur lors de la vérification du profil:', error);
      return false;
    }
  };

  // Gestion de la connexion
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        toast.success('Connexion réussie !', {
          description: `Bienvenue ${authData.user.email}`,
        });

        // Vérifier si le profil est complet
        const isProfileComplete = await checkProfileCompletion(authData.user.id);
        
        // Rediriger vers dashboard ou onboarding
        setLocation(isProfileComplete ? '/dashboard' : '/onboarding');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = 'Erreur de connexion';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      }

      toast.error(errorMessage, {
        description: 'Vérifiez vos identifiants et réessayez',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de l'inscription
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: `${data.firstName} ${data.lastName}`,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        toast.success('Inscription réussie !', {
          description: 'Vérifiez votre email pour confirmer votre compte',
        });

        // Si l'email est confirmé automatiquement, rediriger vers onboarding
        if (authData.user.email_confirmed_at) {
          setLocation('/onboarding');
        } else {
          // Basculer vers l'onglet login avec un message
          setActiveTab('login');
          toast.info('Confirmation requise', {
            description: 'Cliquez sur le lien dans votre email, puis connectez-vous',
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      let errorMessage = 'Erreur d\'inscription';
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Un compte existe déjà avec cet email';
      } else if (error.message?.includes('Password should be')) {
        errorMessage = 'Le mot de passe ne respecte pas les critères de sécurité';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Format d\'email invalide';
      }

      toast.error(errorMessage, {
        description: 'Veuillez corriger les erreurs et réessayer',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec Google OAuth
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }

      // Note: La redirection se fait automatiquement avec OAuth
    } catch (error: any) {
      console.error('Erreur connexion Google:', error);
      toast.error('Erreur de connexion Google', {
        description: 'Impossible de se connecter avec Google',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo et titre */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
              <span className="text-2xl font-bold text-white">MFH</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              MyFitHero
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Votre coach fitness personnel
            </p>
          </div>
        </div>

        {/* Card d'authentification */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'login' ? 'Connexion' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? 'Connectez-vous à votre compte' 
                : 'Rejoignez la communauté MyFitHero'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="transition-all">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="transition-all">
                  Inscription
                </TabsTrigger>
              </TabsList>

              {/* Onglet Connexion */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        className={`pl-10 ${loginForm.formState.errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${loginForm.formState.errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    disabled={isLoading || !loginForm.formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Onglet Inscription */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        Prénom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="Jean"
                          className={`pl-10 ${registerForm.formState.errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                          {...registerForm.register('firstName')}
                        />
                      </div>
                      {registerForm.formState.errors.firstName && (
                        <p className="text-xs text-red-500">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Nom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          className={`pl-10 ${registerForm.formState.errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                          {...registerForm.register('lastName')}
                        />
                      </div>
                      {registerForm.formState.errors.lastName && (
                        <p className="text-xs text-red-500">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="votre@email.com"
                        className={`pl-10 ${registerForm.formState.errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...registerForm.register('email')}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${registerForm.formState.errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${registerForm.formState.errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...registerForm.register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    disabled={isLoading || !registerForm.formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Séparateur et OAuth */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                Google
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              {activeTab === 'login' ? (
                <p>
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    S'inscrire
                  </button>
                </p>
              ) : (
                <p>
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Note de sécurité */}
        <div className="text-center text-xs text-gray-400">
          <p>
            En vous inscrivant, vous acceptez nos{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700">
              conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
              politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
