export interface User {
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

export interface AuthState {
  user: User | undefined;
  session: any | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | undefined;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female';
  lifestyle?: string;
  primaryGoals?: string[];
}
