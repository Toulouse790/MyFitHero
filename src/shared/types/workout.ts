// 🏋️ WORKOUT MODULE TYPES - Missing Declarations

export interface WorkoutSession {
  id: string;
  user_id: string;
  name: string;
  exercises: any[];
  created_at: string;
  updated_at: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  rest_time?: number;
  timestamp?: string;
}

// Re-export to avoid module conflicts
export * from '@/features/workout/types/WorkoutTypes';