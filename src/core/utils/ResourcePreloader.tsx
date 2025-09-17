import { useEffect } from 'react';
import { RuntimeOptimizer } from './performanceOptimizations';

interface ResourcePreloaderProps {
  critical?: string[];
  prefetch?: string[];
  preload?: string[];
}

// Composant pour précharger les ressources critiques
export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  critical = [],
  prefetch = [],
  preload = []
}) => {
  useEffect(() => {
    const optimizer = RuntimeOptimizer.getInstance();

    // Précharger les ressources critiques immédiatement
    critical.forEach(resource => {
      optimizer.preloadResource(resource);
    });

    // Prefetch des ressources après le chargement initial
    if (prefetch.length > 0) {
      optimizer.scheduleIdleTask(() => {
        prefetch.forEach(resource => {
          optimizer.prefetchResource(resource);
        });
      });
    }

    // Preload des ressources importantes
    if (preload.length > 0) {
      setTimeout(() => {
        preload.forEach(resource => {
          optimizer.preloadResource(resource);
        });
      }, 100);
    }
  }, [critical, prefetch, preload]);

  return null; // Composant invisible
};

// Hook pour gérer les resource hints
export const useResourceHints = () => {
  useEffect(() => {
    const optimizer = RuntimeOptimizer.getInstance();

    // DNS prefetch pour les domaines externes
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.supabase.io',
      'https://cdn.jsdelivr.net'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect pour les ressources critiques
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://api.supabase.io'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch des routes probables après chargement
    optimizer.scheduleIdleTask(() => {
      const likelyRoutes = ['/dashboard', '/workouts', '/nutrition'];
      likelyRoutes.forEach(route => {
        optimizer.prefetchResource(route, 'document');
      });
    });

  }, []);

  return {
    preloadCriticalImages: (imageUrls: string[]) => {
      const optimizer = RuntimeOptimizer.getInstance();
      imageUrls.forEach(url => optimizer.preloadResource(url, 'image'));
    },
    
    prefetchNextPage: (pageUrl: string) => {
      const optimizer = RuntimeOptimizer.getInstance();
      optimizer.prefetchResource(pageUrl, 'document');
    }
  };
};

// Configuration des ressources critiques par page
export const CRITICAL_RESOURCES = {
  landing: [
    '/assets/hero-image.webp',
    '/assets/logo.svg'
  ],
  dashboard: [
    '/assets/dashboard-icons.svg',
    '/api/user/stats'
  ],
  workout: [
    '/assets/exercise-thumbnails.webp',
    '/api/workouts/templates'
  ],
  nutrition: [
    '/assets/food-icons.svg',
    '/api/nutrition/recent'
  ]
};

// Component wrapper pour optimiser automatiquement les pages
export const OptimizedPageWrapper: React.FC<{
  children: React.ReactNode;
  pageType: keyof typeof CRITICAL_RESOURCES;
  className?: string;
}> = ({ children, pageType, className }) => {
  const criticalResources = CRITICAL_RESOURCES[pageType] || [];
  
  return (
    <>
      <ResourcePreloader critical={criticalResources} />
      <div className={className} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
};

export default ResourcePreloader;