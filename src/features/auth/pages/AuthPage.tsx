import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Dumbbell, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

// Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Composant principal
export function AuthPage() {
  const [location, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.includes('signup') || !location.includes('login'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Validation en temps réel
  const isFormValid = useMemo(() => {
    if (isSignUp) {
      return (
        formData.firstName.trim().length > 0 &&
        formData.lastName.trim().length > 0 &&
        formData.email.includes('@') &&
        formData.email.includes('.') &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword
      );
    } else {
      return (
        formData.email.includes('@') &&
        formData.email.includes('.') &&
        formData.password.length >= 6
      );
    }
  }, [formData, isSignUp]);

  // Handler de soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setErrors(['Veuillez remplir tous les champs correctement']);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      if (isSignUp) {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Après inscription, toujours rediriger vers onboarding
          setLocation('/onboarding');
        }
      } else {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Vérifier le statut d'onboarding pour la redirection
          const { data: profile } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', data.user.id)
            .single();

          // Redirection intelligente basée sur le statut d'onboarding
          if (profile?.onboarding_completed) {
            setLocation('/dashboard');
          } else {
            setLocation('/onboarding');
          }
        }
      }

    } catch (error: any) {
      console.error('Erreur auth:', error);
      
      // Messages d'erreur en français
      let errorMessage = 'Une erreur est survenue';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Format d\'email invalide';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pour changer les champs
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: e.target.value 
    }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Connexion Google (optionnel)
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Erreur Google Auth:', error);
      setErrors(['Erreur de connexion avec Google']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Logo et titre */}
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Dumbbell className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MyFitHero</h1>
          <p className="text-gray-600">Votre coach fitness personnel</p>
          
          {/* Toggle Connexion/Inscription */}
          <div className="flex bg-gray-100 rounded-xl p-1 mt-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isSignUp 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isSignUp 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inscription
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Affichage des erreurs */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <div className="flex-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-700 text-sm">{error}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Champs pour inscription uniquement */}
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      placeholder="Chris"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      placeholder="Topher"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="••••••••"
                  minLength={isSignUp ? 8 : 6}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères
                </p>
              )}
            </div>

            {/* Confirmation mot de passe (inscription uniquement) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="••••••••"
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-12"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>{isSignUp ? 'Création en cours...' : 'Connexion...'}</span>
                </div>
              ) : (
                isSignUp ? 'Créer mon compte' : 'Se connecter'
              )}
            </Button>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            {/* Google Auth */}
            <Button
              type="button"
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </Button>

          </form>

          {/* CGU et politique de confidentialité */}
          {isSignUp && (
            <p className="text-xs text-gray-500 text-center mt-6">
              En vous inscrivant, vous acceptez nos{' '}
              <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>
              {' '}et notre{' '}
              <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthPage;
