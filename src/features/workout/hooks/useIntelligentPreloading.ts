import { Target } from 'lucide-react';
import React, { useEffect } from 'react';

// Preloading intelligent des routes probables
export const useIntelligentPreloading = () => {
  useEffect(() => {
    const currentPath = window.location.pathname;
    const preloadTargets: string[] = [];

    // Logique de preloading basée sur la route actuelle
    switch (currentPath) {
      case '/':
        // Depuis l'accueil, l'utilisateur va probablement vers workout ou nutrition
        preloadTargets.push('/workout', '/nutrition');
        break;
      case '/workout':
        // Depuis workout, probable vers profile ou nutrition
        preloadTargets.push('/profile', '/nutrition');
        break;
      case '/nutrition':
        // Depuis nutrition, probable vers hydration
        preloadTargets.push('/hydration', '/sleep');
        break;
      case '/profile':
        // Depuis profil, probable retour accueil
        preloadTargets.push('/');
        break;
    }

    // Preload des imports avec requestIdleCallback si disponible
    const preload = () => {
      preloadTargets.forEach(async route => {
        try {
          switch (route) {
            case '/workout':
              await import('../pages/WorkoutPage'); // ✅ Corrigé: chemin relatif correct
              break;
            case '/nutrition':
              await import('../../nutrition/pages/NutritionPage'); // ✅ Chemin relatif correct
              break;
            case '/hydration':
              await import('../../hydration/pages/HydrationPage'); // ✅ Chemin relatif correct
              break;
            case '/sleep':
              await import('../../sleep/pages/SleepPage'); // ✅ Chemin relatif correct
              break;
            case '/profile':
              await import('../../auth/pages/ProfileComplete'); // ✅ Chemin relatif correct
              break;
            case '/':
              await import('../../../pages/index'); // ✅ Corrigé: chemin relatif correct
              break;
          }
        } catch (error) {
      // Erreur silencieuse
          console.log('Preload failed for', route, error);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 1000);
    }
  }, []);
};

// Détection du type de connexion pour ajuster les performances
export const useNetworkAdaptation = (): void => {
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const updatePerformanceMode = () => {
        const isSlowConnection =
          connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
        const isLowData = connection.saveData;

        // Configuration du mode performance
        document.documentElement.style.setProperty(
          '--performance-mode',
          isSlowConnection || isLowData ? 'low' : 'high'
        );

        // Désactiver les animations coûteuses en mode dégradé
        if (isSlowConnection || isLowData) {
          document.documentElement.classList.add('reduce-motion');
        } else {
          document.documentElement.classList.remove('reduce-motion');
        }
      };

      updatePerformanceMode();
      connection.addEventListener('change', updatePerformanceMode);

      return () => connection.removeEventListener('change', updatePerformanceMode);
    }
    // Aucun cleanup nécessaire si connection n'est pas supportée
    return undefined;
  }, []);
};
