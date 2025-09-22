import { Activity } from 'lucide-react';
// Import du type principal depuis shared
import type { SmartDashboardContext } from '@/shared/types/dashboard';

// Re-export for backwards compatibility
export type { SmartDashboardContext } from '@/shared/types/dashboard';

export interface PersonalizedWidget {
  id: string;
  title: string;
  content: string;
  icon: any;
  color: string;
  action?: string;
  path?: string;
}

export interface DailyProgramDisplay {
  workout: {
    name: string;
    duration: number;
    exercises: string[];
    completed: boolean;
  };
  nutrition: {
    calories_target: number;
    calories_current: number;
    next_meal: string;
  };
  hydration: {
    target_ml: number;
    current_ml: number;
    percentage: number;
  };
  sleep: {
    target_hours: number;
    last_night_hours: number;
    quality: number;
  };
}
