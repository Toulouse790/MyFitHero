// Export des types de la feature workout
// IMPORTANT: Certains types sont dupliqués entre ces fichiers
// Priorité: database.ts > WorkoutTypes.ts > supabase.ts > api.ts > common.ts > muscleRecovery.ts

// Base principale (types Supabase)
export * from './database';

// Types métier (renommage nécessaire pour éviter conflicts)
export type {
  Workout as WorkoutInterface,
  WorkoutSession,
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

// Types complémentaires (sans doublons)
// export * from './supabase';
// export * from './api';
// export * from './muscleRecovery';
// export * from './common';
