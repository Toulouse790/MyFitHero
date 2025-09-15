import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center p-6">
        {/* Icône d'erreur */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Message d'erreur */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Oups ! Une erreur s'est produite
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer.
        </p>

        {/* Détails de l'erreur en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Détails de l'erreur :
            </h3>
            <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={resetErrorBoundary}
            className="w-full"
            variant="default"
          >
            Réessayer
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>

        {/* Contact support */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si le problème persiste, contactez notre{' '}
            <a
              href="/support"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support technique
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
