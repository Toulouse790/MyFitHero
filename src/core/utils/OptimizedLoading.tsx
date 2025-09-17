import React from 'react';
import { LayoutStabilizer } from './performanceOptimizations';

// Types pour les skeletons
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

// Composant skeleton de base
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  rounded = false,
  className = ''
}) => {
  const styles = {
    ...LayoutStabilizer.createSkeleton(width, height),
    borderRadius: rounded ? '50%' : '4px',
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 ${className}`}
      style={styles}
      aria-label="Contenu en cours de chargement"
    />
  );
};

// Skeleton pour les cartes
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`p-4 border rounded-lg bg-white ${className || ''}`}>
    <div className="space-y-3">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="100%" />
      <Skeleton height="16px" width="80%" />
      <div className="flex space-x-2 mt-4">
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="100px" />
      </div>
    </div>
  </div>
);

// Skeleton pour les listes
export const ListSkeleton: React.FC<{ 
  items?: number; 
  className?: string;
}> = ({ items = 5, className }) => (
  <div className={`space-y-2 ${className || ''}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 border rounded">
        <Skeleton width="48px" height="48px" rounded />
        <div className="flex-1 space-y-2">
          <Skeleton height="16px" width="70%" />
          <Skeleton height="14px" width="50%" />
        </div>
        <Skeleton height="24px" width="60px" />
      </div>
    ))}
  </div>
);

// Skeleton pour le dashboard
export const DashboardSkeleton: React.FC = () => (
  <div style={LayoutStabilizer.stableContainer()} className="p-6 space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton height="32px" width="200px" />
        <Skeleton height="16px" width="150px" />
      </div>
      <Skeleton height="40px" width="120px" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>

    {/* Content Areas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton height="24px" width="180px" />
        <CardSkeleton />
      </div>
      <div className="space-y-4">
        <Skeleton height="24px" width="160px" />
        <ListSkeleton items={3} />
      </div>
    </div>
  </div>
);

// Skeleton pour les workouts
export const WorkoutSkeleton: React.FC = () => (
  <div style={LayoutStabilizer.stableContainer()} className="p-6 space-y-6">
    <div className="space-y-4">
      <Skeleton height="28px" width="240px" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton height="120px" width="100%" />
            <Skeleton height="20px" width="80%" />
            <Skeleton height="16px" width="60%" />
            <div className="flex justify-between items-center">
              <Skeleton height="14px" width="40%" />
              <Skeleton height="32px" width="80px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton pour la nutrition
export const NutritionSkeleton: React.FC = () => (
  <div style={LayoutStabilizer.stableContainer()} className="p-6 space-y-6">
    {/* Food Scanner */}
    <div className="bg-white border rounded-lg p-6">
      <Skeleton height="24px" width="200px" className="mb-4" />
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Skeleton height="64px" width="64px" rounded className="mx-auto mb-4" />
        <Skeleton height="20px" width="250px" className="mx-auto mb-2" />
        <Skeleton height="16px" width="180px" className="mx-auto" />
      </div>
    </div>

    {/* Nutrition Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white border rounded-lg p-4 text-center">
          <Skeleton height="48px" width="48px" rounded className="mx-auto mb-3" />
          <Skeleton height="24px" width="60px" className="mx-auto mb-2" />
          <Skeleton height="16px" width="80px" className="mx-auto" />
        </div>
      ))}
    </div>

    {/* Recent Foods */}
    <div className="bg-white border rounded-lg p-6">
      <Skeleton height="24px" width="180px" className="mb-4" />
      <ListSkeleton items={4} />
    </div>
  </div>
);

// Hook pour gérer les skeletons basés sur l'état de chargement
export const useOptimizedLoading = (isLoading: boolean, minLoadingTime: number = 300): boolean => {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      // Maintenir le skeleton pour éviter les CLS
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, minLoadingTime);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, minLoadingTime]);

  return showSkeleton;
};

// Composant wrapper pour les pages avec skeleton automatique
export const OptimizedLoadingWrapper: React.FC<{
  isLoading: boolean;
  skeleton: React.ComponentType;
  children: React.ReactNode;
  className?: string;
}> = ({ isLoading, skeleton: SkeletonComponent, children, className }) => {
  const showSkeleton = useOptimizedLoading(isLoading);

  return (
    <div className={className} style={LayoutStabilizer.stableContainer()}>
      {showSkeleton ? <SkeletonComponent /> : children}
    </div>
  );
};

// Export des skeletons prédéfinis
export const PAGE_SKELETONS = {
  dashboard: DashboardSkeleton,
  workout: WorkoutSkeleton,
  nutrition: NutritionSkeleton,
} as const;

export default Skeleton;