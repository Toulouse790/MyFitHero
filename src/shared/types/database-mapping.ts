// ============================================================================
// MAPPING ENTRE STRUCTURE SUPABASE ET INTERFACES TYPESCRIPT
// Réconcilier les noms de colonnes existants avec nos composants
// ============================================================================

/**
 * PROBLÈME IDENTIFIÉ :
 * - Nos interfaces TypeScript utilisent camelCase (exerciseId, workoutPlanId)
 * - La base Supabase existante utilise snake_case (exercise_id, workout_plan_id)
 * - Les composants sophistiqués doivent être adaptés à la structure existante
 */

// ============================================================================
// 1. STRUCTURE EXISTANTE SUPABASE (ce qui est déjà dans votre base)
// ============================================================================

export interface DbWorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id?: string;
  name: string;
  description?: string;
  status: 'idle' | 'active' | 'paused' | 'completed' | 'cancelled';
  total_volume?: number;
  workout_duration_minutes?: number;
  calories_burned?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // NOUVELLES COLONNES IA (à ajouter)
  fatigue_level?: number;
  performance_score?: number;
  heart_rate_zone?: number;
  auto_progress_weight?: boolean;
  smart_rest_timers?: boolean;
  real_time_coaching?: boolean;
  session_state?: any; // jsonb
  pending_changes?: any[]; // jsonb
  last_sync?: string;
}

export interface DbWorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  weight_kg?: number;
  reps?: number;
  rpe?: number;
  rest_time_seconds?: number;
  created_at: string;
  updated_at: string;
  
  // NOUVELLES COLONNES IA (à ajouter)
  predicted_rpe?: number;
  actual_vs_predicted_performance?: number;
  set_start_time?: string;
  set_end_time?: string;
  is_dropset?: boolean;
  is_failure?: boolean;
}

export interface DbWorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  difficulty_level: string;
  estimated_duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 2. INTERFACES ADAPTÉES POUR NOS COMPOSANTS SOPHISTIQUÉS
// ============================================================================

/**
 * Interface WorkoutSet compatible avec la base existante
 * À utiliser dans SophisticatedWorkoutFlowManager et VolumeAnalyticsEngine
 */
export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string; // exercise_id en base
  setNumber: number; // set_number en base
  weight: number; // weight_kg en base
  reps: number;
  rpe?: number;
  restTime?: number; // rest_time_seconds en base
  tempo?: string; // Stocké en notes ou métadonnées
  notes?: string;
  timestamp: Date; // created_at en base
  completed: boolean; // Dérivé des données
  
  // Nouvelles propriétés IA
  predictedRpe?: number; // predicted_rpe en base
  actualVsPredictedPerformance?: number; // actual_vs_predicted_performance en base
  setStartTime?: Date; // set_start_time en base
  setEndTime?: Date; // set_end_time en base
  isDropset?: boolean; // is_dropset en base
  isFailure?: boolean; // is_failure en base
  technique?: number; // À stocker en métadonnées
}

/**
 * Interface Exercise (référence exercises_library existant)
 */
export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'power' | 'endurance';
  muscleGroups: string[]; // muscle_groups en base (array)
  targetSets: number;
  targetReps: number | [number, number];
  targetWeight?: number;
  restTime: number; // rest_time_seconds en base
  instructions?: string;
  videoUrl?: string; // video_url en base
}

/**
 * Interface WorkoutSession compatible avec la base existante
 */
export interface WorkoutSession {
  id: string;
  userId: string; // user_id en base
  workoutPlanId?: string; // workout_plan_id en base
  name: string;
  description?: string;
  status: 'idle' | 'active' | 'paused' | 'completed' | 'cancelled';
  totalVolume?: number; // total_volume en base
  workoutDurationMinutes?: number; // workout_duration_minutes en base
  caloriesBurned?: number; // calories_burned en base
  startedAt?: Date; // started_at en base
  completedAt?: Date; // completed_at en base
  createdAt: Date; // created_at en base
  updatedAt: Date; // updated_at en base
  
  // Nouvelles propriétés IA
  fatigueLevel?: number; // fatigue_level en base
  performanceScore?: number; // performance_score en base
  heartRateZone?: number; // heart_rate_zone en base
  autoProgressWeight?: boolean; // auto_progress_weight en base
  smartRestTimers?: boolean; // smart_rest_timers en base
  realTimeCoaching?: boolean; // real_time_coaching en base
  sessionState?: any; // session_state en base (jsonb)
  pendingChanges?: any[]; // pending_changes en base (jsonb)
  lastSync?: Date; // last_sync en base
}

// ============================================================================
// 3. FONCTIONS DE CONVERSION (DB ↔ TypeScript)
// ============================================================================

/**
 * Convertit une ligne de base workout_sessions vers l'interface TypeScript
 */
export function dbToWorkoutSession(db: DbWorkoutSession): WorkoutSession {
  return {
    id: db.id,
    userId: db.user_id,
    workoutPlanId: db.workout_plan_id,
    name: db.name,
    description: db.description,
    status: db.status,
    totalVolume: db.total_volume,
    workoutDurationMinutes: db.workout_duration_minutes,
    caloriesBurned: db.calories_burned,
    startedAt: db.started_at ? new Date(db.started_at) : undefined,
    completedAt: db.completed_at ? new Date(db.completed_at) : undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    
    // Propriétés IA
    fatigueLevel: db.fatigue_level,
    performanceScore: db.performance_score,
    heartRateZone: db.heart_rate_zone,
    autoProgressWeight: db.auto_progress_weight,
    smartRestTimers: db.smart_rest_timers,
    realTimeCoaching: db.real_time_coaching,
    sessionState: db.session_state,
    pendingChanges: db.pending_changes,
    lastSync: db.last_sync ? new Date(db.last_sync) : undefined,
  };
}

/**
 * Convertit l'interface TypeScript vers la structure de base workout_sessions
 */
export function workoutSessionToDb(session: WorkoutSession): Partial<DbWorkoutSession> {
  return {
    id: session.id,
    user_id: session.userId,
    workout_plan_id: session.workoutPlanId,
    name: session.name,
    description: session.description,
    status: session.status,
    total_volume: session.totalVolume,
    workout_duration_minutes: session.workoutDurationMinutes,
    calories_burned: session.caloriesBurned,
    started_at: session.startedAt?.toISOString(),
    completed_at: session.completedAt?.toISOString(),
    updated_at: new Date().toISOString(),
    
    // Propriétés IA
    fatigue_level: session.fatigueLevel,
    performance_score: session.performanceScore,
    heart_rate_zone: session.heartRateZone,
    auto_progress_weight: session.autoProgressWeight,
    smart_rest_timers: session.smartRestTimers,
    real_time_coaching: session.realTimeCoaching,
    session_state: session.sessionState,
    pending_changes: session.pendingChanges,
    last_sync: session.lastSync?.toISOString(),
  };
}

/**
 * Convertit une ligne de base workout_sets vers l'interface TypeScript
 */
export function dbToWorkoutSet(db: DbWorkoutSet): WorkoutSet {
  return {
    id: db.id,
    sessionId: db.session_id,
    exerciseId: db.exercise_id,
    setNumber: db.set_number,
    weight: db.weight_kg || 0,
    reps: db.reps || 0,
    rpe: db.rpe,
    restTime: db.rest_time_seconds,
    timestamp: new Date(db.created_at),
    completed: true, // Si la ligne existe, le set est complété
    
    // Propriétés IA
    predictedRpe: db.predicted_rpe,
    actualVsPredictedPerformance: db.actual_vs_predicted_performance,
    setStartTime: db.set_start_time ? new Date(db.set_start_time) : undefined,
    setEndTime: db.set_end_time ? new Date(db.set_end_time) : undefined,
    isDropset: db.is_dropset,
    isFailure: db.is_failure,
  };
}

/**
 * Convertit l'interface TypeScript vers la structure de base workout_sets
 */
export function workoutSetToDb(set: WorkoutSet): Partial<DbWorkoutSet> {
  return {
    id: set.id,
    session_id: set.sessionId,
    exercise_id: set.exerciseId,
    set_number: set.setNumber,
    weight_kg: set.weight,
    reps: set.reps,
    rpe: set.rpe,
    rest_time_seconds: set.restTime,
    updated_at: new Date().toISOString(),
    
    // Propriétés IA
    predicted_rpe: set.predictedRpe,
    actual_vs_predicted_performance: set.actualVsPredictedPerformance,
    set_start_time: set.setStartTime?.toISOString(),
    set_end_time: set.setEndTime?.toISOString(),
    is_dropset: set.isDropset,
    is_failure: set.isFailure,
  };
}

// ============================================================================
// 4. INSTRUCTIONS POUR LA MISE À JOUR
// ============================================================================

/**
 * PROCHAINES ÉTAPES :
 * 
 * 1. Exécuter update-existing-workout-tables.sql pour ajouter les colonnes IA
 * 2. Mettre à jour SophisticatedWorkoutFlowManager.tsx pour utiliser ces interfaces
 * 3. Mettre à jour VolumeAnalyticsEngine.tsx pour utiliser ces interfaces
 * 4. Utiliser les fonctions de conversion dans les hooks Supabase
 * 5. Tester que tout fonctionne avec la base existante
 */