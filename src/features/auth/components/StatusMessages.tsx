import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ValidationErrors } from '@/features/auth/hooks/useSignupValidation';

interface StatusMessagesProps {
  errors: ValidationErrors;
  successMessage: string;
  retryCount: number;
  maxRetries: number;
  isLoading: boolean;
  fieldCount: number;
  totalFields: number;
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({
  errors,
  successMessage,
  retryCount,
  maxRetries,
  isLoading,
  fieldCount,
  totalFields
}) => {
  return (
    <>
      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* Erreur générale */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{errors.general}</span>
        </div>
      )}

      {/* Affichage des tentatives de retry */}
      {retryCount > 0 && !isLoading && (
        <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded text-xs text-orange-700">
          ⚠️ Tentative {retryCount}/{maxRetries} échouée. {retryCount < maxRetries ? 'Nouvelle tentative automatique...' : 'Toutes les tentatives épuisées.'}
        </div>
      )}

      {/* Bouton de test visible pour debug */}
      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
        Debug: Bouton {
          (isLoading || 
          fieldCount < totalFields ||
          Object.keys(errors).some(key => key !== 'general' && errors[key as keyof ValidationErrors])) 
          ? 'DÉSACTIVÉ' : 'ACTIVÉ'
        } | Champs: {fieldCount}/{totalFields}
      </div>
    </>
  );
};