import { SleepData, SleepAnalysis, DbSleepData, DbSleepAnalysis } from '../types';

/**
 * Conversion des données Sleep de snake_case (DB) vers camelCase (App)
 */
export function dbToSleepData(dbData: DbSleepData): SleepData {
  return {
    id: dbData.id,
    userId: dbData.user_id,
    sleepDate: dbData.sleep_date,
    bedtime: new Date(dbData.bedtime),
    wakeTime: new Date(dbData.wake_time),
    sleepDuration: dbData.sleep_duration_minutes,
    sleepLatency: dbData.sleep_latency_minutes,
    nightAwakenings: dbData.night_awakenings,
    timeAwakeDuringNight: dbData.time_awake_minutes,
    sleepEfficiency: dbData.sleep_efficiency,
    sleepStages: {
      lightSleep: dbData.light_sleep_minutes,
      deepSleep: dbData.deep_sleep_minutes,
      remSleep: dbData.rem_sleep_minutes,
      awakeTime: dbData.awake_minutes,
    },
    heartRateVariability: dbData.sleep_ai_analysis?.heartRateVariability,
    environmentalFactors: dbData.sleep_ai_analysis?.environmentalFactors || {
      roomTemperature: undefined,
      noiseLevel: undefined,
      lightExposure: undefined,
      mattressComfort: undefined,
    },
    preSleepActivities: dbData.sleep_ai_analysis?.preSleepActivities || {
      screenTime: 0,
      caffeine: false,
      alcohol: false,
      exercise: false,
      meditation: false,
      reading: false,
    },
    sleepQuality: mapScoreToSleepQuality(dbData.sleep_quality_score),
    morningMood: dbData.sleep_ai_analysis?.morningMood || 'ok',
    energyLevel: dbData.sleep_ai_analysis?.energyLevel || 5,
    notes: dbData.sleep_ai_analysis?.notes,
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  };
}

/**
 * Conversion des données Sleep de camelCase (App) vers snake_case (DB)
 */
export function sleepDataToDb(sleepData: SleepData): Partial<DbSleepData> {
  return {
    id: sleepData.id,
    user_id: sleepData.userId,
    sleep_date: sleepData.sleepDate,
    bedtime: sleepData.bedtime.toISOString(),
    wake_time: sleepData.wakeTime.toISOString(),
    sleep_duration_minutes: sleepData.sleepDuration,
    sleep_latency_minutes: sleepData.sleepLatency,
    night_awakenings: sleepData.nightAwakenings,
    time_awake_minutes: sleepData.timeAwakeDuringNight,
    sleep_efficiency: sleepData.sleepEfficiency,
    light_sleep_minutes: sleepData.sleepStages.lightSleep,
    deep_sleep_minutes: sleepData.sleepStages.deepSleep,
    rem_sleep_minutes: sleepData.sleepStages.remSleep,
    awake_minutes: sleepData.sleepStages.awakeTime,
    sleep_quality_score: mapSleepQualityToScore(sleepData.sleepQuality),
    sleep_ai_analysis: {
      heartRateVariability: sleepData.heartRateVariability,
      environmentalFactors: sleepData.environmentalFactors,
      preSleepActivities: sleepData.preSleepActivities,
      morningMood: sleepData.morningMood,
      energyLevel: sleepData.energyLevel,
      notes: sleepData.notes,
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Conversion des analyses Sleep de snake_case (DB) vers camelCase (App)
 */
export function dbToSleepAnalysis(dbAnalysis: DbSleepAnalysis): SleepAnalysis {
  const aiAnalysis = dbAnalysis.sleep_ai_analysis || {};
  
  return {
    id: dbAnalysis.id,
    userId: dbAnalysis.user_id,
    sleepDataId: dbAnalysis.sleep_data_id,
    analysisDate: new Date(dbAnalysis.analysis_date),
    sleepScores: {
      overallQuality: dbAnalysis.overall_quality_score,
      recoveryScore: dbAnalysis.recovery_score,
      sleepDebt: dbAnalysis.sleep_debt_minutes,
      circadianAlignment: dbAnalysis.circadian_alignment_score,
      sleepConsistency: dbAnalysis.sleep_consistency_score,
      restorationIndex: dbAnalysis.restoration_index,
    },
    sleepPhases: aiAnalysis.sleepPhases || {
      optimalDeepSleep: false,
      remQuality: 50,
      sleepCycleCompleteness: 50,
      wakefulnessPattern: 'normal',
    },
    circadianMetrics: aiAnalysis.circadianMetrics || {
      chronotype: 'intermediate',
      optimalBedtime: '22:30',
      optimalWakeTime: '06:30',
      lightExposureRecommendation: 'Augmentez l\'exposition à la lumière matinale',
      mealTimingImpact: 'neutral',
    },
    recoveryMetrics: aiAnalysis.recoveryMetrics || {
      physicalRecovery: 70,
      mentalRecovery: 70,
      emotionalRecovery: 70,
      autonomicRecovery: 70,
    },
    aiInsights: aiAnalysis.aiInsights || {
      primaryIssues: [],
      improvementSuggestions: [],
      optimizationStrategies: [],
      lifestyleRecommendations: [],
    },
    predictiveMetrics: aiAnalysis.predictiveMetrics || {
      tomorrowEnergyPrediction: 70,
      recoveryTimeEstimate: 8,
      performanceImpact: 'minimal',
      optimalWorkoutTiming: ['09:00-11:00', '16:00-18:00'],
    },
    trends: aiAnalysis.trends || {
      weeklyPattern: 'stable',
      seasonalFactors: [],
      stressImpact: 30,
      workoutCorrelation: 0,
    },
    createdAt: new Date(dbAnalysis.created_at),
    updatedAt: new Date(dbAnalysis.updated_at),
  };
}

/**
 * Conversion des analyses Sleep de camelCase (App) vers snake_case (DB)
 */
export function sleepAnalysisToDb(analysis: SleepAnalysis): Partial<DbSleepAnalysis> {
  return {
    id: analysis.id,
    user_id: analysis.userId,
    sleep_data_id: analysis.sleepDataId,
    analysis_date: analysis.analysisDate.toISOString(),
    overall_quality_score: analysis.sleepScores.overallQuality,
    recovery_score: analysis.sleepScores.recoveryScore,
    sleep_debt_minutes: analysis.sleepScores.sleepDebt,
    circadian_alignment_score: analysis.sleepScores.circadianAlignment,
    sleep_consistency_score: analysis.sleepScores.sleepConsistency,
    restoration_index: analysis.sleepScores.restorationIndex,
    sleep_ai_analysis: {
      sleepPhases: analysis.sleepPhases,
      circadianMetrics: analysis.circadianMetrics,
      recoveryMetrics: analysis.recoveryMetrics,
      aiInsights: analysis.aiInsights,
      predictiveMetrics: analysis.predictiveMetrics,
      trends: analysis.trends,
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calcul des scores de sommeil avancés avec IA
 */
export function calculateSleepScores(sleepData: SleepData): SleepAnalysis['sleepScores'] {
  // Score qualité globale (0-100)
  const durationScore = calculateDurationScore(sleepData.sleepDuration);
  const efficiencyScore = sleepData.sleepEfficiency;
  const latencyScore = calculateLatencyScore(sleepData.sleepLatency);
  const awakeningsScore = calculateAwakeningsScore(sleepData.nightAwakenings);
  const stagesScore = calculateStagesScore(sleepData.sleepStages);
  
  const overallQuality = Math.round(
    (durationScore * 0.25) +
    (efficiencyScore * 0.25) +
    (latencyScore * 0.15) +
    (awakeningsScore * 0.15) +
    (stagesScore * 0.20)
  );

  // Score récupération basé sur REM et sommeil profond
  const recoveryScore = Math.round(
    (sleepData.sleepStages.deepSleep / sleepData.sleepDuration * 100 * 2) +
    (sleepData.sleepStages.remSleep / sleepData.sleepDuration * 100 * 1.5)
  );

  // Dette de sommeil (recommandé: 7-9h)
  const optimalSleep = 8 * 60; // 8 heures en minutes
  const sleepDebt = Math.max(0, optimalSleep - sleepData.sleepDuration);

  // Alignement circadien basé sur l'heure de coucher
  const bedtimeHour = sleepData.bedtime.getHours() + sleepData.bedtime.getMinutes() / 60;
  const circadianAlignment = calculateCircadianAlignment(bedtimeHour);

  // Consistance (nécessite historique - version simplifiée)
  const sleepConsistency = 75; // Valeur par défaut

  // Index de restauration combiné
  const restorationIndex = Math.round(
    (recoveryScore * 0.4) +
    (overallQuality * 0.3) +
    (circadianAlignment * 0.3)
  );

  return {
    overallQuality: Math.min(100, Math.max(0, overallQuality)),
    recoveryScore: Math.min(100, Math.max(0, recoveryScore)),
    sleepDebt,
    circadianAlignment: Math.min(100, Math.max(0, circadianAlignment)),
    sleepConsistency,
    restorationIndex: Math.min(100, Math.max(0, restorationIndex)),
  };
}

/**
 * Analyse intelligente du sommeil avec recommandations IA
 */
export function generateSleepAIInsights(sleepData: SleepData, scores: SleepAnalysis['sleepScores']): SleepAnalysis['aiInsights'] {
  const insights = {
    primaryIssues: [] as string[],
    improvementSuggestions: [] as string[],
    optimizationStrategies: [] as string[],
    lifestyleRecommendations: [] as string[],
  };

  // Analyse des problèmes principaux
  if (scores.overallQuality < 60) {
    insights.primaryIssues.push('Qualité de sommeil globalement faible');
  }
  if (sleepData.sleepLatency > 30) {
    insights.primaryIssues.push('Difficulté d\'endormissement');
  }
  if (sleepData.nightAwakenings > 3) {
    insights.primaryIssues.push('Réveils nocturnes fréquents');
  }
  if (sleepData.sleepStages.deepSleep < sleepData.sleepDuration * 0.15) {
    insights.primaryIssues.push('Sommeil profond insuffisant');
  }

  // Suggestions d'amélioration
  if (sleepData.preSleepActivities.screenTime > 60) {
    insights.improvementSuggestions.push('Réduisez l\'exposition aux écrans 2h avant le coucher');
  }
  if (sleepData.preSleepActivities.caffeine) {
    insights.improvementSuggestions.push('Évitez la caféine après 14h');
  }
  if (sleepData.environmentalFactors.roomTemperature && sleepData.environmentalFactors.roomTemperature > 22) {
    insights.improvementSuggestions.push('Baissez la température de la chambre (18-20°C optimal)');
  }

  // Stratégies d'optimisation
  insights.optimizationStrategies.push('Développez une routine de coucher relaxante');
  insights.optimizationStrategies.push('Maintenez des horaires de sommeil réguliers');
  insights.optimizationStrategies.push('Optimisez l\'environnement de sommeil (obscurité, silence, fraîcheur)');

  // Recommandations lifestyle
  if (!sleepData.preSleepActivities.meditation) {
    insights.lifestyleRecommendations.push('Intégrez 10min de méditation avant le coucher');
  }
  if (!sleepData.preSleepActivities.reading) {
    insights.lifestyleRecommendations.push('Lecture légère pour faciliter la transition vers le sommeil');
  }
  insights.lifestyleRecommendations.push('Exposition à la lumière naturelle le matin pour réguler le rythme circadien');

  return insights;
}

// Fonctions utilitaires de calcul
function calculateDurationScore(duration: number): number {
  // Optimal: 7-9h (420-540 min)
  if (duration >= 420 && duration <= 540) return 100;
  if (duration >= 360 && duration < 420) return 80 - (420 - duration) / 6;
  if (duration > 540 && duration <= 600) return 90 - (duration - 540) / 6;
  if (duration < 360) return Math.max(0, 50 - (360 - duration) / 12);
  return Math.max(0, 70 - (duration - 600) / 12);
}

function calculateLatencyScore(latency: number): number {
  if (latency <= 15) return 100;
  if (latency <= 30) return 80;
  if (latency <= 45) return 60;
  return Math.max(0, 40 - (latency - 45) / 3);
}

function calculateAwakeningsScore(awakenings: number): number {
  if (awakenings === 0) return 100;
  if (awakenings === 1) return 85;
  if (awakenings === 2) return 70;
  return Math.max(0, 55 - (awakenings - 2) * 15);
}

function calculateStagesScore(stages: SleepData['sleepStages']): number {
  const totalSleep = stages.lightSleep + stages.deepSleep + stages.remSleep;
  const deepPercent = (stages.deepSleep / totalSleep) * 100;
  const remPercent = (stages.remSleep / totalSleep) * 100;
  
  // Optimal: 15-20% deep, 20-25% REM
  const deepScore = deepPercent >= 15 && deepPercent <= 20 ? 100 : Math.max(0, 100 - Math.abs(17.5 - deepPercent) * 4);
  const remScore = remPercent >= 20 && remPercent <= 25 ? 100 : Math.max(0, 100 - Math.abs(22.5 - remPercent) * 4);
  
  return (deepScore + remScore) / 2;
}

function calculateCircadianAlignment(bedtimeHour: number): number {
  // Optimal: 22:00-23:30 (22.0-23.5)
  if (bedtimeHour >= 22.0 && bedtimeHour <= 23.5) return 100;
  if (bedtimeHour >= 21.0 && bedtimeHour < 22.0) return 85;
  if (bedtimeHour > 23.5 && bedtimeHour <= 24.5) return 75;
  return Math.max(0, 60 - Math.abs(22.75 - bedtimeHour) * 10);
}

function mapScoreToSleepQuality(score: number): SleepData['sleepQuality'] {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'poor';
}

function mapSleepQualityToScore(quality: SleepData['sleepQuality']): number {
  switch (quality) {
    case 'excellent': return 95;
    case 'good': return 80;
    case 'fair': return 65;
    case 'poor': return 40;
    default: return 65;
  }
}