import React, { lazy, Suspense, memo } from 'react';
import LoadingScreen from './LoadingScreen';

// Lazy loading optimisé pour les composants lourds
export const LazyDashboard = lazy(() => 
  import('../features/dashboard/pages/Dashboard').then(module => ({
    default: memo(module.default)
  }))
);

export const LazyWorkoutPage = lazy(() => 
  import('../features/workout/pages/WorkoutPage').then(module => ({
    default: memo(module.default)
  }))
);

export const LazyNutritionPage = lazy(() => 
  import('../features/nutrition/pages/NutritionPage').then(module => ({
    default: memo(module.default)
  }))
);

export const LazySocialPage = lazy(() => 
  import('../features/social/pages/SocialPage').then(module => ({
    default: memo(module.default)
  }))
);

export const LazyProfilePage = lazy(() => 
  import('../features/profile/pages/ProfilePage').then(module => ({
    default: memo(module.default)
  }))
);

// Wrapper avec Suspense optimisé
export const withLazySuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return memo((props: any) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  ));
};

// Exports avec Suspense
export const Dashboard = withLazySuspense(LazyDashboard);
export const WorkoutPage = withLazySuspense(LazyWorkoutPage);
export const NutritionPage = withLazySuspense(LazyNutritionPage);
export const SocialPage = withLazySuspense(LazySocialPage);
export const ProfilePage = withLazySuspense(LazyProfilePage);