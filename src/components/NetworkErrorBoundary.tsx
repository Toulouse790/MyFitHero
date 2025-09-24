import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error: Error | undefined;
  isNetworkError: boolean;
  retryCount: number;
}

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: any) => void;
}

export class NetworkErrorBoundary extends Component<NetworkErrorBoundaryProps, NetworkErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | undefined = null;

  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isNetworkError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<NetworkErrorBoundaryState> {
    const isNetworkError = error.message.includes('Failed to fetch') || 
                          error.message.includes('Network Error') ||
                          error.message.includes('ERR_NETWORK') ||
                          error.name === 'TypeError';

    return {
      hasError: true,
      error,
      isNetworkError
    };
  }

  override componentDidCatch(error: Error, errorInfo: any) {
    console.error('🔴 Network Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  override componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn('🟡 Max retry attempts reached');
      return;
    }

    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1
    }));

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, this.state.retryCount) * 1000;
    
    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        isNetworkError: false
      });
    }, delay);
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {this.state.isNetworkError ? (
                <WifiOff className="h-16 w-16 text-red-500" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-orange-500" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {this.state.isNetworkError ? 'Problème de connexion' : 'Erreur inattendue'}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              {this.state.isNetworkError ? (
                'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
              ) : (
                'Une erreur inattendue s\'est produite. Veuillez réessayer.'
              )}
            </p>

            {/* Error details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs text-gray-500 font-mono">
                {this.state.error.message}
              </p>
            </div>

            {/* Retry info */}
            {this.state.retryCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  Tentative {this.state.retryCount}/{this.props.maxRetries || 3}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= (this.props.maxRetries || 3)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {this.state.retryCount >= (this.props.maxRetries || 3) ? 'Limite atteinte' : 'Réessayer'}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Recharger la page
              </button>
            </div>

            {/* Network status */}
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Wifi className="h-4 w-4 mr-1" />
              Statut: {navigator.onLine ? 'En ligne' : 'Hors ligne'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;