// Utilitaires pour les objets connectés (wearables)

/** Types pour les appareils connectés */
export interface WearableDevice {
  id: string;
  type: 'fitbit' | 'apple_watch' | 'garmin' | 'samsung' | 'other';
  name: string;
  isConnected: boolean;
  lastSync?: string;
  batteryLevel?: number;
}

/** Données de santé du wearable */
export interface WearableData {
  deviceId: string;
  timestamp: string;
  heartRate?: number;
  steps?: number;
  caloriesBurned?: number;
  distance?: number; // en km
  6eOfSleep?: number; // en minutes
  sleepQuality?: 'excellent' | 'good' | 'fair' | 'poor';
}

/** Utilitaires de gestion des appareils */

/** Vérifie si un appareil est connecté */
export function isDeviceConnected(device: WearableDevice): boolean {
  if (!device.isConnected) return false;
  
  // Vérifie la dernière synchronisation
  if (device.lastSync) {
    const lastSync = new Date(device.lastSync);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    // Considéré comme déconnecté si pas de sync depuis 24h+ 
    return hoursSinceSync < 24;
  }
  
  return true;
}

/** Formate la batterie en pourcentage */
export function formatBatteryLevel(level?: number): string {
  if (!level && level !== 0) return 'N/A';
  return `${Math.round(level)}%`;
}

/** Formate le temps de synchronisation */
export function formatLastSync(lastSync?: string): string {
  if (!lastSync) return 'Jamais';
  
  const syncDate = new Date(lastSync);
  const now = new Date();
  const minutesAgo = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60));
  
  if (minutesAgo < 1) return 'A l\'instant';
  if (minutesAgo < 60) return `Il y a ${minutesAgo} min`;
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `Il y a ${hoursAgo}h$;
  
  const daysAgo = Math.floor(hoursAgo / 24);
  return `Il y a ${daysAgo} jour${daysAgo > 1 ? 's' : ''}`;
}

/** Calcule les calories brûlées par heure */
export function calculateCaloriesPerHour(data: WearableData[]): number {
  if (data.length === 0) return 0;
  
  const totalCalories = data.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
  const hours = data.length / 60; // Suppose 1 entrée par minute
  
  return hours > 0 ? totalCalories / hours : 0;
}

/** Calcule la moyenne du rythme cardiaque */
export function calculateAverageHeartRate(data: WearableData[]): number {
  const validEntries = data.filter(entry => entry.heartRate && entry.heartRate > 0);
  if (validEntries.length === 0) return 0;
  
  const total = validEntries.reduce((sum, entry) => sum + (entry.heartRate || 0), 0);
  return Math.round(total / validEntries.length);
}
