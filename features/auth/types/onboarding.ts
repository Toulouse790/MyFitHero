// Types for onboarding
export interface SportOption {
  id: string;
  name: string;
  category: string;
  description?: string;
  positions?: string[];
  icon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string[];
  muscles?: string[];
  benefits?: string[];
}

export interface PositionOption {
  id: string;
  name: string;
  description?: string;
  requirements?: string[];
  characteristics?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female';
  lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired';
  primaryGoals?: string[];
  createdAt: string;
  updatedAt: string;
}