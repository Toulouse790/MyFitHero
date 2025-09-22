import React from 'react';
import NetworkErrorBoundary from '@/components/NetworkErrorBoundary';
import { useSignupForm } from '../hooks/useSignupForm';
import { useSignupValidation } from '../hooks/useSignupValidation';
import { useRetryMechanism } from '../hooks/useRetryMechanism';
import { SignupFormFields } from '../components/SignupFormFields';
import { SignupSubmitButton } from '../components/SignupSubmitButton';
import { StatusMessages } from '../components/StatusMessages';

export const SignupPageComponent: React.FC = () => {
  // Hooks pour la gestion d'état
  const {
    formData,
    isLoading,
    showPassword,
    showConfirmPassword,
    successMessage,
    updateField,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    performSignup,
    setIsLoading
  } = useSignupForm();

  // Hook pour la validation
  const {
    errors,
    validateSingleField,
    validateForm,
    getPasswordStrength,
    isFormValid,
    clearErrors,
    setGeneralError
  } = useSignupValidation();

  // Hook pour le retry
  const {
    retryCount,
    isRetrying,
    maxRetries,
    retryWithBackoff,
    resetRetry
  } = useRetryMechanism({ maxRetries: 3 });

  // Gestionnaire de changement de champ
  const handleFieldChange = (name: keyof typeof formData, value: string) => {
    updateField(name, value);
    validateSingleField(name, value, formData);
  };

  // Gestionnaire de soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;
    
    setIsLoading(true);
    clearErrors();

    try {
      await retryWithBackoff(performSignup);
    } catch (error) {
      console.error('Erreur inscription:', error);
      
      // Gestion spécifique des erreurs réseau
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setGeneralError('Erreur de connexion. Vérifiez votre connexion internet et la configuration Supabase.');
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setIsLoading(false);
      resetRetry();
    }
  };

  // Calcul de la force du mot de passe
  const passwordStrength = getPasswordStrength(formData.password);

  // Calcul des champs remplis
  const filledFieldsCount = Object.values(formData).filter(v => v.trim()).length;

  // Condition de désactivation du bouton
  const isButtonDisabled = isLoading || !isFormValid(formData);

  // Affichage du message de succès
  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-green-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compte créé !</h2>
          <p className="text-gray-600 mb-6">{successMessage}</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg className="h-4 w-4 animate-spin mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Messages de statut */}
          <StatusMessages
            errors={errors}
            successMessage={successMessage}
            retryCount={retryCount}
            maxRetries={maxRetries}
            isLoading={isLoading}
            fieldCount={filledFieldsCount}
            totalFields={5}
          />

          {/* Champs du formulaire */}
          <SignupFormFields
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            passwordStrength={passwordStrength}
            onFieldChange={handleFieldChange}
            onTogglePassword={togglePasswordVisibility}
            onToggleConfirmPassword={toggleConfirmPasswordVisibility}
          />

          {/* Bouton de soumission */}
          <SignupSubmitButton
            isLoading={isLoading}
            isRetrying={isRetrying}
            retryCount={retryCount}
            maxRetries={maxRetries}
            isDisabled={isButtonDisabled}
            onSubmit={() => {}}
          />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/auth'}
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

// Composant SignupPage avec Error Boundary
export const SignupPage: React.FC = () => {
  return (
    <NetworkErrorBoundary
      maxRetries={3}
      onError={(error, errorInfo) => {
        console.error('🔴 SignupPage Error Boundary:', error, errorInfo);
      }}
    >
      <SignupPageComponent />
    </NetworkErrorBoundary>
  );
};

export default SignupPage;