// src/features/nutrition/components/ErrorDisplay.tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/features/components/ui/button';

interface ScanError {
  message: string;
  type: 'network' | 'analysis' | 'upload' | 'camera';
}

interface ErrorDisplayProps {
  error: ScanError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  if (!error) {
    return null;
  }

  const getErrorIcon = () => {
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getErrorTitle = (type: string) => {
    switch (type) {
      case 'camera':
        return 'Problème de caméra';
      case 'upload':
        return 'Problème d\'upload';
      case 'network':
        return 'Problème de connexion';
      case 'analysis':
        return 'Problème d\'analyse';
      default:
        return 'Erreur';
    }
  };

  const getErrorSuggestion = (type: string) => {
    switch (type) {
      case 'camera':
        return 'Vérifiez les permissions de caméra et réessayez';
      case 'upload':
        return 'Vérifiez que l\'image est valide (< 5MB)';
      case 'network':
        return 'Vérifiez votre connexion internet';
      case 'analysis':
        return 'Essayez avec une image plus claire';
      default:
        return 'Réessayez ou contactez le support';
    }
  };

  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {getErrorIcon()}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-red-900">
            {getErrorTitle(error.type)}
          </div>
          <div className="mt-1 text-sm text-red-800">
            {error.message}
          </div>
          <div className="mt-2 text-xs text-red-700">
            💡 {getErrorSuggestion(error.type)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex space-x-2">
        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        )}
        
        {onDismiss && (
          <Button
            onClick={onDismiss}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Fermer
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;