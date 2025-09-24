
/**
 * LAZY LOADING OPTIMISÉ - Module Workout
 * Chargement paresseux haute performance avec préchargement intelligent
 */

import React, { lazy, Suspense } from 'react';

// === COMPOSANTS WORKOUT LAZY LOADING ===
export const LazyWorkoutPage = lazy(() => import('@/features/workout/pages/WorkoutPage'));
export const LazyWorkoutDetailPage = lazy(() => import('@/features/workout/pages/WorkoutDetailPage'));
export const LazyExercisesPage = lazy(() => import('@/features/workout/pages/ExercisesPage'));
export const LazyExerciseDetailPage = lazy(() => import('@/features/workout/pages/ExerciseDetailPage'));

// === COMPOSANTS WORKOUT LOURDS ===
// === COMPOSANTS WORKOUT OPTIMISÉS ===
// Ces composants seront disponibles une fois que les modules seront créés

// Pour l'instant, créons des placeholders optimisés
export const OptimizedWorkoutDashboard = React.memo(() => (
  <div className="workout-dashboard-placeholder">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
));

export const OptimizedWorkoutSession = React.memo(() => (
  <div className="workout-session-placeholder">
    <div className="animate-pulse space-y-6">
      <div className="h-12 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
));

export const OptimizedWorkoutHistory = React.memo(() => (
  <div className="workout-history-placeholder">
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
));

// === PRÉCHARGEMENT INTELLIGENT ===

interface PreloadConfig {
  onUserInteraction?: boolean;
  onPageVisible?: boolean;
  delay?: number;
  priority?: 'low' | 'high';
}

const preloadComponent = (
  componentImporter: () => Promise<any>,
  config: PreloadConfig = {}
) => {
  const { onUserInteraction = false, onPageVisible = false, delay = 0, priority = 'low' } = config;

  const preload = () => {
    if (delay > 0) {
      setTimeout(() => componentImporter(), delay);
    } else {
      componentImporter();
    }
  };

  if (onUserInteraction) {
    const events = ['mouseenter', 'touchstart', 'focus'];
    const handler = () => {
      preload();
      events.forEach(event => 
        document.removeEventListener(event, handler)
      );
    };
    events.forEach(event => 
      document.addEventListener(event, handler, { passive: true, once: true })
    );
  }

  if (onPageVisible) {
    if ('IntersectionObserver' in window) {
      // Précharger quand l'utilisateur scroll vers le contenu
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              preload();
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      // Observer le document body comme trigger
      if (document.body) {
        observer.observe(document.body);
      }
    } else {
      // Fallback pour navigateurs sans IntersectionObserver
      setTimeout(preload, 1000);
    }
  }

  return preload;
};

// === PRÉCHARGEURS CONFIGURÉS ===

export const preloadWorkoutDashboard = preloadComponent(
  () => import('@/features/workout/components/WorkoutDashboard'),
  { onUserInteraction: true, priority: 'high' }
);

export const preloadWorkoutSession = preloadComponent(
  () => import('@/features/workout/components/WorkoutSession'),
  { onPageVisible: true, delay: 500, priority: 'high' }
);

export const preloadWorkoutHistory = preloadComponent(
  () => import('@/features/workout/components/WorkoutHistory'),
  { onUserInteraction: true, delay: 200 }
);

export const preloadAnalytics = preloadComponent(
  () => import('@/features/workout/components/VolumeAnalyticsEngine'),
  { delay: 2000, priority: 'low' }
);

// === ROUTES AUTRES FEATURES (maintenues pour compatibilité) ===
export const LazySleep = lazy(() => import('@/features/sleep/pages/SleepPage'));
export const LazySocial = lazy(() => import('@/features/social/pages/SocialPage'));
export const LazyHydration = lazy(() => import('@/features/hydration/pages/HydrationPage'));

// === IMPORTS CORRIGÉS ===
export const LazyNutrition = lazy(() => import('@/features/nutrition/pages/NutritionPage'));
export const LazyProfile = lazy(() => import('@/features/profile/pages/ProfilePage'));
export const LazySettings = lazy(() => import('@/features/profile/pages/SettingsPage'));
export const LazyAnalytics = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
export const LazyNotFound = lazy(() => import('@/pages/NotFound'));

// === COMPOSANT DE FALLBACK OPTIMISÉ ===
export const OptimizedSuspenseFallback = ({ text = 'Chargement...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
    <p className="mt-4 text-blue-600 font-medium animate-pulse">{text}</p>
    <div className="mt-2 flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  </div>
);

// Export default pour compatibilité avec index.ts
const LazyComponents = {
  LazySleep,
  LazySocial,
  LazyHydration,
  LazyWorkout: LazyWorkoutPage, // Utiliser LazyWorkoutPage à la place
  LazyNutrition,
  LazyProfile,
  LazySettings,
  LazyAnalytics,
  LazyNotFound,
  OptimizedSuspenseFallback
};

export default LazyComponents;
