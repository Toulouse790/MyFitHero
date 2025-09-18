import { useState, useCallback } from 'react';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const useSignupValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: keyof SignupFormData, value: string, confirmValue?: string): string | undefined => {
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
          return 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
        }
        return undefined;
      
      case 'confirmPassword':
        return confirmValue && value !== confirmValue ? 'Les mots de passe ne correspondent pas' : undefined;
      
      default:
        return undefined;
    }
  }, []);

  const validateSingleField = useCallback((name: keyof SignupFormData, value: string, formData: SignupFormData) => {
    const error = validateField(name, value, name === 'confirmPassword' ? formData.password : undefined);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Validation spéciale pour confirmPassword si password change
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, value);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
    
    return !error;
  }, [validateField]);

  const validateForm = useCallback((formData: SignupFormData): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof SignupFormData;
      const error = validateField(
        fieldName, 
        formData[fieldName], 
        fieldName === 'confirmPassword' ? formData.password : undefined
      );
      if (error) newErrors[fieldName] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const getPasswordStrength = useCallback((password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Faible', color: 'bg-red-500' };
    if (strength <= 50) return { strength, label: 'Moyen', color: 'bg-orange-500' };
    if (strength <= 75) return { strength, label: 'Bon', color: 'bg-yellow-500' };
    return { strength, label: 'Excellent', color: 'bg-green-500' };
  }, []);

  const isFormValid = useCallback((formData: SignupFormData): boolean => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      !Object.keys(errors).some(key => key !== 'general' && errors[key as keyof ValidationErrors])
    );
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setGeneralError = useCallback((message: string) => {
    setErrors(prev => ({ ...prev, general: message }));
  }, []);

  return {
    errors,
    validateSingleField,
    validateForm,
    getPasswordStrength,
    isFormValid,
    clearErrors,
    setGeneralError
  };
};