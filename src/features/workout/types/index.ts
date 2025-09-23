// Export des types de la feature workout
// IMPORTANT: Certains types sont dupliqués entre ces fichiers
// Priorité: database.ts > WorkoutTypes.ts pour éviter les conflits

// Base principale (types Supabase) - source de vérité
export * from './database';

// Types métier (renommage nécessaire pour éviter conflicts)
export type {
  Workout as WorkoutInterface,
  Exercise as WorkoutExercise,
  ExerciseSet,
  WorkoutStats,
  WeeklyWorkoutStats,
  MonthlyWorkoutStats,
  WorkoutTemplate,
  WorkoutPlan,
  PlanWorkout,
  WorkoutProgress,
  CreateWorkoutData,
  UpdateWorkoutData,
  WorkoutFilters,
  WorkoutSearchQuery
} from './WorkoutTypes';

// Types spécialisés sans conflits (mais en conflit avec database.ts)
// Note: MuscleRecoveryData et UserRecoveryProfile sont aussi dans database.ts
export type {
  MuscleGroup,
  RecoveryStatus,
  RecoveryRecommendation,
  GlobalRecoveryMetrics
} from './muscleRecovery';
