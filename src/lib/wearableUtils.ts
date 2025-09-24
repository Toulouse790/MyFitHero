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
  return [];
};

export class WearableAnalyzer {
  static analyzeHeartRate(data: WearableData[]): { min: number; max: number; avg: number } {
    const heartRates = data.filter(d => d.heartRate).map((d, index) => d.heartRate!);
    if (heartRates.length === 0) return { min: 0, max: 0, avg: 0 };
    
    return {
      min: Math.min(...heartRates),
      max: Math.max(...heartRates),
      avg: heartRates.reduce((a, b) => a + b, 0) / heartRates.length
    };
  }

  static calculateFitnessScore(data: WearableData[]): number {
    // Calcul de base du score de forme basé sur les données
    if (data.length === 0) return 0;
    const avgHeartRate = this.analyzeHeartRate(data).avg;
    const totalSteps = data.reduce((sum, d) => sum + (d.steps || 0), 0);
    return Math.min(100, Math.round((totalSteps / 10000) * 50 + (avgHeartRate > 0 ? 50 : 0)));
  }

  static getHealthTrend(data: WearableData[]): 'positive' | 'negative' | 'stable' {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-7); // Derniers 7 jours
    const previous = data.slice(-14, -7);
    const recentAvg = recent.reduce((sum, d) => sum + (d.steps || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + (d.steps || 0), 0) / previous.length;
    
    if (recentAvg > previousAvg * 1.1) return 'positive';
    if (recentAvg < previousAvg * 0.9) return 'negative';
    return 'stable';
  }

  static generateHealthInsights(data: WearableData[]): string[] {
    const insights = [];
    const totalSteps = data.reduce((sum, d) => sum + (d.steps || 0), 0);
    const avgDailySteps = totalSteps / Math.max(data.length, 1);
    
    if (avgDailySteps >= 10000) {
      insights.push('Excellent! Vous atteignez vos objectifs de pas quotidiens.');
    } else if (avgDailySteps >= 7500) {
      insights.push('Bon travail! Vous êtes proche de votre objectif de pas.');
    } else {
      insights.push('Essayez d\'augmenter votre activité quotidienne.');
    }
    
    return insights;
  }

  static calculateHealthMetrics(data: WearableData[]): { steps: number; calories: number; distance: number } {
    return {
      steps: data.reduce((sum, d) => sum + (d.steps || 0), 0),
      calories: data.reduce((sum, d) => sum + (d.calories || 0), 0),
      distance: data.reduce((sum, d) => sum + (d.distance || 0), 0)
    };
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  static calculateCaloriesBurned(data: WearableData[]): number {
    return data.reduce((total, d) => total + (d.calories || 0), 0);
  }

  static getActivitySummary(data: WearableData[]) {
    return {
      totalSteps: data.reduce((total, d) => total + (d.steps || 0), 0),
      totalCalories: this.calculateCaloriesBurned(data),
      totalDistance: data.reduce((total, d) => total + (d.distance || 0), 0),
      heartRateStats: this.analyzeHeartRate(data)
    };
  }
}

export default {
  formatWearableData,
  getDeviceStatus,
  syncWearableData,
  WearableAnalyzer
};