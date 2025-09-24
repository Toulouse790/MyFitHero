import { Info } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

// Import des services core
import { validateEnv } from './core/config/env.config';
import { env } from './core/config/env.config';

// Gestion des erreurs globales
const handleGlobalError = (error: ErrorEvent) => {
  console.error('Erreur globale capturée:', error);
  // Ici vous pourriez envoyer l'erreur à un service de monitoring
};

// Gestion des rejets de promesses non capturées
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Promesse rejetée non capturée:', event.reason);
  // Éviter le comportement par défaut du navigateur
  event.preventDefault();
};

// Configuration QueryClient avancée pour production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache et fraîcheur des données
      staleTime: 5 * 60 * 1000, // 5 minutes - Les données sont considérées fraîches pendant 5min
      gcTime: 10 * 60 * 1000, // 10 minutes - Garde en cache pendant 10min (anciennement cacheTime)
      
      // Stratégie de retry
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs d'auth (401, 403)
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponentiel
      
      // Refetch en arrière-plan
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      
      // Gestion réseau
      networkMode: 'online',
    },
    mutations: {
      // Retry pour les mutations
      retry: (failureCount, error: any) => {
        // Ne jamais retry les erreurs d'auth ou de validation
        if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      networkMode: 'online',
    },
  },
});

// Validation des variables d'environnement au démarrage
try {
  validateEnv();
} catch (error) {
  console.error('❌ Variables d\'environnement manquantes:', error);
  // En production, on pourrait rediriger vers une page d'erreur
  if (env.APP_ENV === 'production') {
    document.body.innerHTML = `
      <div style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        font-family: system-ui, -apple-system, sans-serif;
        background: #f8fafc;
        color: #334155;
      ">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Configuration Error</h1>
          <p>Application configuration is incomplete. Please contact support.</p>
        </div>
      </div>
    `;
    throw error;
  }
}

// Composant ErrorBoundary pour les erreurs React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ ErrorBoundary capturé:', error, errorInfo);
    
    // En production, envoyer l'erreur à un service de monitoring
    if (env.APP_ENV === 'production') {
      // Analytics ou monitoring service
      // analyticsService.captureException(error, errorInfo);
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oups ! Quelque chose s'est mal passé
            </h1>
            <p className="text-gray-600 mb-6">
              Une erreur inattendue s'est produite. Notre équipe a été notifiée.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Recharger la page
            </button>
            {env.APP_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-red-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-red-800">
                  Détails de l'erreur (dev only)
                </summary>
                <pre className="mt-2 text-sm text-red-700 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Configuration des événements globaux
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// Nettoyage au démontage (utile pour les tests ou hot reload)
const cleanup = () => {
  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  queryClient.clear();
};

// Hot module replacement pour le développement
if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}

// Montage de l'application avec tous les providers
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        
        {/* Toaster pour les notifications globales */}
        <Toaster
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
        
        {/* DevTools uniquement en développement */}
        {env.APP_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Log du démarrage de l'application

// Performance monitoring en développement
if (env.APP_ENV === 'development') {
  // Web Vitals pour mesurer les performances
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
  });
}
