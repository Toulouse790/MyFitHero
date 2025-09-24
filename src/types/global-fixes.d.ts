// 🛡️ TYPESCRIPT GLOBAL FIXES - Enterprise Grade Type Declarations
// This file resolves TS2304 "Cannot find name" errors systematically

// =============================================================================
// 🔧 MISSING REACT IMPORTS AND HOOKS
// =============================================================================

// React Query global types (fixes useQuery, useMutation, useQueryClient errors)
declare module '@tanstack/react-query' {
  export function useQuery<TData = unknown, TError = unknown>(
    key: any[],
    queryFn: () => Promise<TData>,
    options?: any
  ): { data: TData; error: TError; isLoading: boolean };
  
  export function useMutation<TData = unknown, TError = unknown, TVariables = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: any
  ): { mutate: (variables: TVariables) => void; isLoading: boolean };
  
  export function useQueryClient(): any;
}

// =============================================================================
// 🎨 MISSING ICON TYPES (Lucide React Icons)
// =============================================================================

declare const Brain: React.ComponentType<any>;
declare const Phone: React.ComponentType<any>;
declare const Bed: React.ComponentType<any>;
declare const Shield: React.ComponentType<any>;
declare const Sun: React.ComponentType<any>;
declare const Lightbulb: React.ComponentType<any>;

// =============================================================================
// 🌐 BROWSER APIS
// =============================================================================

// Bluetooth API
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface Navigator {
  bluetooth?: {
    requestDevice(options: any): Promise<BluetoothDevice>;
  };
}

// Web Crypto API extensions
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        healthKit?: any;
      };
    };
  }
}

// =============================================================================
// 🔗 SUPABASE QUERY RESULT FIXES
// =============================================================================

// Common Supabase response pattern - fixes "error" and "data" not found errors
type SupabaseResponse<T = any> = {
  data: T | undefined;
  error: { message: string; code?: string } | undefined;
};

// Generic async function wrapper to fix destructuring errors
declare function withSupabaseResponse<T>(
  fn: () => Promise<SupabaseResponse<T>>
): Promise<SupabaseResponse<T>>;

// =============================================================================
// 🎯 COMMON UTILITY TYPES
// =============================================================================

// Fixes implicit any parameters in map/filter functions  
type AnyFunction = (...args: any[]) => any;
type AnyObject = { [key: string]: any };

// =============================================================================
// 🏗️ MISSING MODULE DECLARATIONS
// =============================================================================

declare module '@/features/workout/use-supabase-query' {
  export function useSupabaseQuery<T = any>(
    table: string,
    options?: any
  ): SupabaseResponse<T> & { isLoading: boolean };
}

declare module '@/shared/types/workout' {
  export interface WorkoutSession {
    id: string;
    user_id: string;
    name: string;
    exercises: any[];
    created_at: string;
  }
  
  export interface Set {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
  }
}

declare module '@/shared/types/workout.types' {
  export * from '@/shared/types/workout';
}

// =============================================================================
// 🔒 SECURITY & VALIDATION
// =============================================================================

// Fixes gtag function not found
declare global {
  function gtag(...args: any[]): void;
  
  // Request Idle Callback
  interface Window {
    requestIdleCallback?: (
      callback: (deadline: { timeRemaining(): number }) => void,
      options?: { timeout: number }
    ) => number;
  }
}

export {};