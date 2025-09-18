import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const SignupPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validation en temps réel
  const validateField = (name: keyof SignupFormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        return value.length < 2 ? 'Le prénom doit contenir au moins 2 caractères' : undefined;
      case 'lastName':
        return value.length < 2 ? 'Le nom doit contenir au moins 2 caractères' : undefined;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Email invalide' : undefined;
      case 'password':
        if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
        }
        return undefined;
      case 'confirmPassword':
        return value !== formData.password ? 'Les mots de passe ne correspondent pas' : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Validation spéciale pour confirmPassword si password change
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof SignupFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) newErrors[fieldName] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error('Erreur auth:', authError);
        setErrors({ general: authError.message });
        return;
      }

      if (!authData.user) {
        setErrors({ general: 'Erreur lors de la création du compte' });
        return;
      }

      // 2. Créer le profil dans user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          onboarding_completed: false,
          notifications_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Erreur profil:', profileError);
        // Note: L'utilisateur auth existe déjà, on peut continuer
      }

      setSuccessMessage('Compte créé avec succès ! Vérifiez votre email pour confirmer votre inscription.');
      
      // Redirection après 3 secondes
      setTimeout(() => {
        setLocation('/onboarding');
      }, 3000);

    } catch (error) {
      console.error('Erreur inscription:', error);
      
      // Gestion spécifique des erreurs réseau
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setErrors({ 
          general: 'Erreur de connexion. Vérifiez votre connexion internet et la configuration Supabase.' 
        });
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Une erreur inattendue s\'est produite' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Faible', color: 'bg-red-500' };
    if (strength <= 50) return { strength, label: 'Moyen', color: 'bg-orange-500' };
    if (strength <= 75) return { strength, label: 'Bon', color: 'bg-yellow-500' };
    return { strength, label: 'Excellent', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Inscription réussie !</h2>
          <p className="text-gray-600 mb-6">{successMessage}</p>
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Redirection...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Rejoignez MyFitHero</h1>
          <p className="text-blue-100">Votre parcours santé commence ici</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="p-6 space-y-4">
          {/* Error général */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Votre prénom"
                required
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Votre nom"
                required
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="votre@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Force du mot de passe</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength >= 75 ? 'text-green-600' : 
                    passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || 
              !formData.firstName.trim() || 
              !formData.lastName.trim() || 
              !formData.email.trim() || 
              !formData.password.trim() || 
              !formData.confirmPassword.trim() ||
              Object.keys(errors).some(key => key !== 'general' && errors[key as keyof ValidationErrors])
            }
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-primary-600"
            style={{
              backgroundColor: '#8B5CF6', // Violet MyFitHero en fallback
              color: '#FFFFFF',
              border: '2px solid #8B5CF6',
              minHeight: '48px', // Force une hauteur minimale visible
              fontSize: '16px'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Création du compte...
              </div>
            ) : (
              'Créer mon compte'
            )}
          </button>

          {/* Bouton de test visible pour debug */}
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
            Debug: Bouton {
              (isLoading || 
              !formData.firstName.trim() || 
              !formData.lastName.trim() || 
              !formData.email.trim() || 
              !formData.password.trim() || 
              !formData.confirmPassword.trim() ||
              Object.keys(errors).some(key => key !== 'general' && errors[key as keyof ValidationErrors])) 
              ? 'DÉSACTIVÉ' : 'ACTIVÉ'
            } | Champs: {Object.values(formData).filter(v => v.trim()).length}/5
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setLocation('/auth')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};