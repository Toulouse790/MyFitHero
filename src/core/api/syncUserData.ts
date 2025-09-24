// Synchronisation critique des données utilisateur sur tous les modules (Nutrition, Workout, Sleep)
import { supabase } from './supabase.client';

export interface UserSyncResult {
  nutrition: any;
  workout: any;
  sleep: any;
}

export async function syncUserData(userId: string): Promise<UserSyncResult> {
  if (!userId) throw new Error('userId requis');
  // Simule la récupération et synchronisation des données sur plusieurs modules
  const nutrition = { userId, calories: 2000 };
  const workout = { userId, sessions: 5 };
  const sleep = { userId, hours: 7 };
  // Ici, on pourrait faire des appels réels à Supabase ou d’autres APIs
  return { nutrition, workout, sleep };
}
