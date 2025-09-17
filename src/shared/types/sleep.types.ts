// Types pour le système de sommeil
export interface SleepEntry {
  id: string;
  userId: string;
  date: string;
  bedtime: Date;
  wakeTime: Date;
  quality: number; // 1-10
  duration: number; // minutes
  notes?: string;
  factors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepGoal {
  id: string;
  userId: string;
  targetDuration: number; // minutes
  targetBedtime: string; // HH:mm
  targetWakeTime: string; // HH:mm
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepAnalytics {
  averageDuration: number;
  averageQuality: number;
  consistency: number;
  totalNights: number;
  trend: 'improving' | 'declining' | 'stable';
  weeklyData: {
    date: string;
    quality: number;
    duration: number;
  }[];
}