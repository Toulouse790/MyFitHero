import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../../../lib/supabase';
import { SignupFormData } from './useSignupValidation';

export const useSignupForm = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = useCallback((name: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const performSignup = useCallback(async (): Promise<void> => {
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
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Erreur lors de la création du compte');
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
  }, [formData, setLocation]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setSuccessMessage('');
    setIsLoading(false);
  }, []);

  return {
    formData,
    isLoading,
    showPassword,
    showConfirmPassword,
    successMessage,
    updateField,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    performSignup,
    resetForm,
    setIsLoading
  };
};