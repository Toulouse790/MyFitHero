import React, { memo, useMemo, useCallback } from 'react';
import { OptimizedImage } from './OptimizedImage';

interface WorkoutStats {
  duration: number;
  exercises: number;
  calories: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

interface Workout {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    calories?: number;
  }>;
  difficulty: string;
  category: string;
  tags: string[];
  createdAt: string;
}

interface WorkoutCardProps {
  workout: Workout;
  onSelect?: (workoutId: string) => void;
  onFavorite?: (workoutId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

// Fonction coûteuse mémorisée
const calculateWorkoutStats = (workout: Workout): WorkoutStats => {
  const duration = workout.duration;
  const exercises = workout.exercises.length;
  
  // Calcul des calories basé sur les exercices
  const calories = workout.exercises.reduce((total, exercise) => {
    const exerciseCalories = exercise.calories || 0;
    const setsMultiplier = exercise.sets || 1;
    return total + (exerciseCalories * setsMultiplier);
  }, 0);

  // Déterminer la difficulté basée sur la durée et le nombre d'exercices
  let difficulty: 'facile' | 'moyen' | 'difficile' = 'facile';
  if (duration > 45 || exercises > 8) {
    difficulty = 'difficile';
  } else if (duration > 30 || exercises > 5) {
    difficulty = 'moyen';
  }

  return {
    duration,
    exercises,
    calories,
    difficulty
  };
};

// Composant mémorisé pour éviter les re-renders inutiles
export const WorkoutCard = memo<WorkoutCardProps>(({ 
  workout, 
  onSelect, 
  onFavorite, 
  isFavorite = false,
  className = '' 
}) => {
  // Utiliser useMemo pour les calculs coûteux
  const stats = useMemo(() => 
    calculateWorkoutStats(workout), 
    [workout.id, workout.duration, workout.exercises.length]
  );

  // Utiliser useCallback pour les handlers
  const handleClick = useCallback(() => {
    onSelect?.(workout.id);
  }, [workout.id, onSelect]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Éviter de déclencher le clic du card
    onFavorite?.(workout.id);
  }, [workout.id, onFavorite]);

  // Mémoriser les styles basés sur la difficulté
  const difficultyStyles = useMemo(() => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (stats.difficulty) {
      case 'facile':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'moyen':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'difficile':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }, [stats.difficulty]);

  // Mémoriser la couleur du bouton favori
  const favoriteButtonClass = useMemo(() => 
    isFavorite 
      ? 'text-red-500 hover:text-red-600' 
      : 'text-gray-400 hover:text-red-500',
    [isFavorite]
  );

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`Sélectionner l'entraînement ${workout.title}`}
    >
      {/* Image d'en-tête */}
      <div className="relative h-48 w-full">
        <OptimizedImage
          src={workout.imageUrl || '/images/workout-placeholder.jpg'}
          alt={workout.title}
          className="rounded-t-lg"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge de difficulté */}
        <div className="absolute top-3 left-3">
          <span className={difficultyStyles}>
            {stats.difficulty}
          </span>
        </div>

        {/* Bouton favori */}
        <button
          className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors ${favoriteButtonClass}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <svg 
            className="w-5 h-5" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Contenu du card */}
      <div className="p-4">
        {/* Titre et description */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {workout.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {workout.description}
          </p>
        </div>

        {/* Statistiques */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{stats.duration} min</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>{stats.exercises} exercices</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span>{stats.calories} cal</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {workout.tags && workout.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {workout.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
              >
                {tag}
              </span>
            ))}
            {workout.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                +{workout.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bouton d'action */}
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          onClick={handleClick}
        >
          Commencer l'entraînement
        </button>
      </div>
    </div>
  );
});

WorkoutCard.displayName = 'WorkoutCard';

export default WorkoutCard;