// Utilities for wearable device integration
export interface WearableDevice {
  id: string;
  name: string;
  type: 'watch' | 'band' | 'chest_strap' | 'other';
  connected: boolean;
  batteryLevel?: number;
  lastSync?: Date;
}

export interface WearableData {
  heartRate?: number;
  steps?: number;
  calories?: number;
  distance?: number;
  timestamp: Date;
  deviceId: string;
}

export const formatWearableData = (data: WearableData): string => {
  const parts = [];
  if (data.heartRate) parts.push(`FC: ${data.heartRate} bpm`);
  if (data.steps) parts.push(`${data.steps} pas`);
  if (data.calories) parts.push(`${data.calories} cal`);
  if (data.distance) parts.push(`${(data.distance / 1000).toFixed(1)} km`);
  return parts.join(' | ');
};

export const getDeviceStatus = (device: WearableDevice): string => {
  if (!device.connected) return 'Déconnecté';
  if (device.batteryLevel && device.batteryLevel < 20) return 'Batterie faible';
  return 'Connecté';
};

export const syncWearableData = async (deviceId: string): Promise<WearableData[]> => {
  // Placeholder for wearable sync logic
  console.log(`Synchronisation des données pour l'appareil ${deviceId}`);
  return [];
};

export default {
  formatWearableData,
  getDeviceStatus,
  syncWearableData
};