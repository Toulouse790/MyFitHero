// src/features/landing/components/features/types.ts
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits?: string[];
}