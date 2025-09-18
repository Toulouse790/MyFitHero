import React from 'react';
import { Loader2 } from 'lucide-react';

interface SignupSubmitButtonProps {
  isLoading: boolean;
  isRetrying: boolean;
  retryCount: number;
  maxRetries: number;
  isDisabled: boolean;
  onSubmit: () => void;
}

export const SignupSubmitButton: React.FC<SignupSubmitButtonProps> = ({
  isLoading,
  isRetrying,
  retryCount,
  maxRetries,
  isDisabled,
  onSubmit
}) => {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      onClick={onSubmit}
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
          {isRetrying ? `Tentative ${retryCount}/${maxRetries}...` : 'Création du compte...'}
        </div>
      ) : (
        'Créer mon compte'
      )}
    </button>
  );
};