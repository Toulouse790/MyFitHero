// Export principal du module workout
export * from './types/index';
export * from './services/WorkoutService';
export * from './hooks/useWorkout';

// Hooks spécialisés existants
export * from './hooks/useWorkoutExercises';
export * from './hooks/useWorkoutTimer';
export * from './hooks/useIntelligentPreloading';

// Pages
export { default as WorkoutPage } from './pages/WorkoutPage';
export { default as WorkoutDetailPage } from './pages/WorkoutDetailPage';
export { default as ExercisesPage } from './pages/ExercisesPage';

// Exports des composants
export * from './components';
