import { HydrationData, HydrationAnalysis, DbHydrationData, DbHydrationAnalysis } from '@/features/hydration/types';

/**
 * Conversion des données Hydration de snake_case (DB) vers camelCase (App)
 */
export function dbToHydrationData(dbData: DbHydrationData): HydrationData {
  return {
    id: dbData.id,
    userId: dbData.user_id,
    hydrationDate: dbData.hydration_date,
    dailyGoal: dbData.daily_goal_ml,
    totalIntake: dbData.total_intake_ml,
    waterIntake: dbData.water_intake_ml,
    otherFluids: dbData.other_fluids_ml || {
      coffee: 0,
      tea: 0,
      juice: 0,
      alcohol: 0,
      sportsDrinks: 0,
      sodas: 0,
    },
    hydrationTimestamps: dbData.hydration_timestamps || [],
    physicalActivity: dbData.physical_activity || {
      exerciseDuration: 0,
      exerciseIntensity: 'low',
      sweatRate: 500,
      environmentalTemp: 20,
      humidity: 50,
    },
    bodyMetrics: dbData.body_metrics || {
      weight: 70,
      bodyFatPercentage: undefined,
      urineColor: 3,
      urineFrequency: 6,
    },
    symptoms: dbData.symptoms || {
      thirst: 'none',
      headache: false,
      fatigue: false,
      dizziness: false,
      drymouth: false,
      darkUrine: false,
      constipation: false,
    },
    mood: dbData.mood_data || {
      energyLevel: 7,
      concentration: 7,
      overallMood: 'good',
    },
    notes: dbData.hydration_ai_analysis?.notes,
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  };
}

/**
 * Conversion des données Hydration de camelCase (App) vers snake_case (DB)
 */
export function hydrationDataToDb(hydrationData: HydrationData): Partial<DbHydrationData> {
  return {
    id: hydrationData.id,
    user_id: hydrationData.userId,
    hydration_date: hydrationData.hydrationDate,
    daily_goal_ml: hydrationData.dailyGoal,
    total_intake_ml: hydrationData.totalIntake,
    water_intake_ml: hydrationData.waterIntake,
    other_fluids_ml: hydrationData.otherFluids,
    hydration_timestamps: hydrationData.hydrationTimestamps,
    physical_activity: hydrationData.physicalActivity,
    body_metrics: hydrationData.bodyMetrics,
    symptoms: hydrationData.symptoms,
    mood_data: hydrationData.mood,
    hydration_score: calculateOverallHydrationScore(hydrationData),
    quality_score: calculateQualityScore(hydrationData),
    efficiency_score: calculateEfficiencyScore(hydrationData),
    hydration_ai_analysis: {
      notes: hydrationData.notes,
      analysisVersion: '1.0',
      timestamp: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Conversion des analyses Hydration de snake_case (DB) vers camelCase (App)
 */
export function dbToHydrationAnalysis(dbAnalysis: DbHydrationAnalysis): HydrationAnalysis {
  const aiAnalysis = dbAnalysis.hydration_ai_analysis || {};
  
  return {
    id: dbAnalysis.id,
    userId: dbAnalysis.user_id,
    hydrationDataId: dbAnalysis.hydration_data_id,
    analysisDate: new Date(dbAnalysis.analysis_date),
    hydrationScores: {
      overallHydration: dbAnalysis.overall_hydration_score,
      hydrationEfficiency: dbAnalysis.hydration_efficiency_score,
      qualityScore: dbAnalysis.quality_score,
      timingOptimization: dbAnalysis.timing_optimization_score,
      recoveryHydration: dbAnalysis.recovery_hydration_score,
      balanceScore: dbAnalysis.balance_score,
    },
    fluidBalance: aiAnalysis.fluidBalance || {
      optimalIntake: 2500,
      actualIntake: 2000,
      deficit: 500,
      surplus: 0,
      absorptionRate: 85,
      retentionScore: 75,
    },
    performanceImpact: aiAnalysis.performanceImpact || {
      cognitiveFunction: 80,
      physicalPerformance: 85,
      recoveryRate: 75,
      metabolicEfficiency: 80,
    },
    dehydrationRisk: aiAnalysis.dehydrationRisk || {
      currentLevel: dbAnalysis.dehydration_risk_level as any || 'optimal',
      riskFactors: [],
      urgencyLevel: 'low',
      timeToOptimal: 60,
    },
    aiInsights: aiAnalysis.aiInsights || {
      primaryIssues: [],
      improvementSuggestions: [],
      optimizationStrategies: [],
      hydrationTiming: [],
      fluidRecommendations: [],
    },
    predictiveMetrics: aiAnalysis.predictiveMetrics || {
      nextHourNeed: 250,
      endOfDayProjection: 2200,
      performanceImpactTomorrow: 'neutral',
      optimalNextIntake: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5),
    },
    environmentalFactors: aiAnalysis.environmentalFactors || {
      temperatureImpact: 50,
      humidityImpact: 50,
      altitudeAdjustment: 0,
      seasonalFactors: [],
    },
    personalizedTargets: aiAnalysis.personalizedTargets || {
      baselineNeed: 2000,
      exerciseAdjustment: 500,
      environmentalAdjustment: 200,
      finalTarget: 2700,
    },
    createdAt: new Date(dbAnalysis.created_at),
    updatedAt: new Date(dbAnalysis.updated_at),
  };
}

/**
 * Conversion des analyses Hydration de camelCase (App) vers snake_case (DB)
 */
export function hydrationAnalysisToDb(analysis: HydrationAnalysis): Partial<DbHydrationAnalysis> {
  return {
    id: analysis.id,
    user_id: analysis.userId,
    hydration_data_id: analysis.hydrationDataId,
    analysis_date: analysis.analysisDate.toISOString(),
    overall_hydration_score: analysis.hydrationScores.overallHydration,
    hydration_efficiency_score: analysis.hydrationScores.hydrationEfficiency,
    quality_score: analysis.hydrationScores.qualityScore,
    timing_optimization_score: analysis.hydrationScores.timingOptimization,
    recovery_hydration_score: analysis.hydrationScores.recoveryHydration,
    balance_score: analysis.hydrationScores.balanceScore,
    dehydration_risk_level: analysis.dehydrationRisk.currentLevel,
    hydration_ai_analysis: {
      fluidBalance: analysis.fluidBalance,
      performanceImpact: analysis.performanceImpact,
      dehydrationRisk: analysis.dehydrationRisk,
      aiInsights: analysis.aiInsights,
      predictiveMetrics: analysis.predictiveMetrics,
      environmentalFactors: analysis.environmentalFactors,
      personalizedTargets: analysis.personalizedTargets,
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calcul des scores d'hydratation avancés avec IA
 */
export function calculateHydrationScores(hydrationData: HydrationData): HydrationAnalysis['hydrationScores'] {
  // Score hydratation globale (0-100)
  const goalAchievement = Math.min(100, (hydrationData.totalIntake / hydrationData.dailyGoal) * 100);
  const overallHydration = calculateOverallHydrationScore(hydrationData);
  
  // Score efficacité basé sur absorption et rétention
  const hydrationEfficiency = calculateEfficiencyScore(hydrationData);
  
  // Score qualité basé sur le type de fluides
  const qualityScore = calculateQualityScore(hydrationData);
  
  // Score timing basé sur la répartition dans la journée
  const timingOptimization = calculateTimingScore(hydrationData);
  
  // Score récupération basé sur l'activité physique
  const recoveryHydration = calculateRecoveryHydrationScore(hydrationData);
  
  // Score équilibre électrolytique
  const balanceScore = calculateElectrolyteBalance(hydrationData);

  return {
    overallHydration: Math.min(100, Math.max(0, overallHydration)),
    hydrationEfficiency: Math.min(100, Math.max(0, hydrationEfficiency)),
    qualityScore: Math.min(100, Math.max(0, qualityScore)),
    timingOptimization: Math.min(100, Math.max(0, timingOptimization)),
    recoveryHydration: Math.min(100, Math.max(0, recoveryHydration)),
    balanceScore: Math.min(100, Math.max(0, balanceScore)),
  };
}

/**
 * Analyse intelligente de l'hydratation avec recommandations IA
 */
export function generateHydrationAIInsights(hydrationData: HydrationData, scores: HydrationAnalysis['hydrationScores']): HydrationAnalysis['aiInsights'] {
  const insights = {
    primaryIssues: [] as string[],
    improvementSuggestions: [] as string[],
    optimizationStrategies: [] as string[],
    hydrationTiming: [] as string[],
    fluidRecommendations: [] as string[],
  };

  // Analyse des problèmes principaux
  if (scores.overallHydration < 70) {
    insights.primaryIssues.push('Hydratation insuffisante pour vos besoins');
  }
  if (hydrationData.symptoms.thirst !== 'none') {
    insights.primaryIssues.push('Symptômes de déshydratation détectés');
  }
  if (hydrationData.bodyMetrics.urineColor >= 5) {
    insights.primaryIssues.push('Couleur d\'urine indiquant une déshydratation');
  }
  if (scores.qualityScore < 60) {
    insights.primaryIssues.push('Qualité des fluides consommés à améliorer');
  }

  // Suggestions d'amélioration
  if (hydrationData.totalIntake < hydrationData.dailyGoal) {
    const deficit = hydrationData.dailyGoal - hydrationData.totalIntake;
    insights.improvementSuggestions.push(`Augmentez votre consommation de ${deficit}ml pour atteindre votre objectif`);
  }
  
  if (hydrationData.otherFluids.coffee > 400) {
    insights.improvementSuggestions.push('Réduisez la consommation de caféine (>400ml/jour détecté)');
  }
  
  if (hydrationData.waterIntake / hydrationData.totalIntake < 0.7) {
    insights.improvementSuggestions.push('Privilégiez l\'eau pure (70% minimum recommandé)');
  }

  // Stratégies d'optimisation
  insights.optimizationStrategies.push('Répartissez votre consommation sur toute la journée');
  insights.optimizationStrategies.push('Hydratez-vous avant, pendant et après l\'exercice');
  insights.optimizationStrategies.push('Surveillez la couleur de votre urine comme indicateur');
  
  if (hydrationData.physicalActivity.exerciseDuration > 60) {
    insights.optimizationStrategies.push('Ajoutez des électrolytes pour les exercices prolongés');
  }

  // Timing optimal
  insights.hydrationTiming.push('Buvez 500ml au réveil pour compenser la nuit');
  insights.hydrationTiming.push('Hydratez-vous 2h avant l\'exercice (500ml)');
  insights.hydrationTiming.push('Limitez les fluides 2h avant le coucher');
  
  if (hydrationData.physicalActivity.exerciseIntensity !== 'low') {
    insights.hydrationTiming.push('150-250ml toutes les 15-20min pendant l\'exercice');
  }

  // Recommandations de fluides
  insights.fluidRecommendations.push('Eau pure: base de votre hydratation');
  
  if (hydrationData.physicalActivity.exerciseDuration > 90) {
    insights.fluidRecommendations.push('Boisson électrolytique pour exercices >90min');
  }
  
  if (hydrationData.physicalActivity.environmentalTemp > 25) {
    insights.fluidRecommendations.push('Eau fraîche pour améliorer l\'absorption par temps chaud');
  }
  
  insights.fluidRecommendations.push('Thé vert: hydratation + antioxydants');

  return insights;
}

/**
 * Calcul du risque de déshydratation
 */
export function calculateDehydrationRisk(hydrationData: HydrationData): HydrationAnalysis['dehydrationRisk'] {
  const riskFactors = [];
  let riskScore = 0;

  // Analyse des symptômes
  if (hydrationData.symptoms.thirst !== 'none') riskScore += 20;
  if (hydrationData.symptoms.headache) riskScore += 15;
  if (hydrationData.symptoms.fatigue) riskScore += 10;
  if (hydrationData.symptoms.dizziness) riskScore += 25;
  if (hydrationData.symptoms.drymouth) riskScore += 15;
  if (hydrationData.symptoms.darkUrine) riskScore += 20;

  // Analyse urine
  if (hydrationData.bodyMetrics.urineColor >= 6) {
    riskScore += 30;
    riskFactors.push('Couleur d\'urine foncée');
  }
  if (hydrationData.bodyMetrics.urineFrequency < 4) {
    riskScore += 20;
    riskFactors.push('Fréquence urinaire faible');
  }

  // Analyse consommation vs objectif
  const achievementRate = hydrationData.totalIntake / hydrationData.dailyGoal;
  if (achievementRate < 0.5) {
    riskScore += 40;
    riskFactors.push('Consommation très insuffisante');
  } else if (achievementRate < 0.7) {
    riskScore += 25;
    riskFactors.push('Consommation insuffisante');
  }

  // Facteurs environnementaux
  if (hydrationData.physicalActivity.environmentalTemp > 28) {
    riskScore += 15;
    riskFactors.push('Température élevée');
  }
  if (hydrationData.physicalActivity.humidity < 30) {
    riskScore += 10;
    riskFactors.push('Air sec');
  }

  // Activité physique
  if (hydrationData.physicalActivity.exerciseIntensity === 'high' || hydrationData.physicalActivity.exerciseIntensity === 'extreme') {
    riskScore += 20;
    riskFactors.push('Exercice intense');
  }

  // Détermination du niveau de risque
  let currentLevel: HydrationAnalysis['dehydrationRisk']['currentLevel'];
  let urgencyLevel: HydrationAnalysis['dehydrationRisk']['urgencyLevel'];
  let timeToOptimal: number;

  if (riskScore <= 20) {
    currentLevel = 'optimal';
    urgencyLevel = 'low';
    timeToOptimal = 0;
  } else if (riskScore <= 50) {
    currentLevel = 'mild';
    urgencyLevel = 'medium';
    timeToOptimal = 30;
  } else if (riskScore <= 80) {
    currentLevel = 'moderate';
    urgencyLevel = 'high';
    timeToOptimal = 60;
  } else {
    currentLevel = 'severe';
    urgencyLevel = 'critical';
    timeToOptimal = 120;
  }

  return {
    currentLevel,
    riskFactors,
    urgencyLevel,
    timeToOptimal,
  };
}

// Fonctions utilitaires de calcul
function calculateOverallHydrationScore(hydrationData: HydrationData): number {
  const goalAchievement = Math.min(100, (hydrationData.totalIntake / hydrationData.dailyGoal) * 100);
  const qualityScore = calculateQualityScore(hydrationData);
  const symptomsScore = calculateSymptomsScore(hydrationData);
  const biomarkersScore = calculateBiomarkersScore(hydrationData);
  
  return Math.round(
    (goalAchievement * 0.3) +
    (qualityScore * 0.25) +
    (symptomsScore * 0.25) +
    (biomarkersScore * 0.2)
  );
}

function calculateEfficiencyScore(hydrationData: HydrationData): number {
  // Efficacité basée sur la répartition temporelle et le type de fluides
  const timingScore = calculateTimingScore(hydrationData);
  const absorptionScore = calculateAbsorptionScore(hydrationData);
  const retentionScore = calculateRetentionScore(hydrationData);
  
  return Math.round((timingScore + absorptionScore + retentionScore) / 3);
}

function calculateQualityScore(hydrationData: HydrationData): number {
  const waterRatio = hydrationData.waterIntake / hydrationData.totalIntake;
  let qualityScore = waterRatio * 100;
  
  // Pénalités pour fluides problématiques
  const totalFluids = hydrationData.totalIntake;
  if (hydrationData.otherFluids.alcohol > 0) {
    qualityScore -= (hydrationData.otherFluids.alcohol / totalFluids) * 30;
  }
  if (hydrationData.otherFluids.sodas > 0) {
    qualityScore -= (hydrationData.otherFluids.sodas / totalFluids) * 20;
  }
  if (hydrationData.otherFluids.coffee > 400) {
    qualityScore -= 15; // Trop de caféine
  }
  
  // Bonus pour thé et jus naturels (modération)
  if (hydrationData.otherFluids.tea > 0 && hydrationData.otherFluids.tea <= 500) {
    qualityScore += 5;
  }
  
  return Math.max(0, Math.min(100, qualityScore));
}

function calculateTimingScore(hydrationData: HydrationData): number {
  if (hydrationData.hydrationTimestamps.length === 0) return 50;
  
  // Analyse de la répartition temporelle
  const timestamps = hydrationData.hydrationTimestamps.map(t => {
    const [hours, minutes] = t.time.split(':').map(Number);
    return hours + minutes / 60;
  });
  
  // Score basé sur la régularité de la consommation
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i-1]);
  }
  
  // Intervalle optimal: 1-3 heures
  const optimalIntervals = intervals.filter(interval => interval >= 1 && interval <= 3).length;
  const timingScore = (optimalIntervals / intervals.length) * 100;
  
  return Math.round(timingScore);
}

function calculateRecoveryHydrationScore(hydrationData: HydrationData): number {
  const exerciseDuration = hydrationData.physicalActivity.exerciseDuration;
  const exerciseIntensity = hydrationData.physicalActivity.exerciseIntensity;
  
  if (exerciseDuration === 0) return 100; // Pas d'exercice = pas de besoins spéciaux
  
  // Calcul des besoins selon l'intensité
  const intensityMultiplier = {
    low: 1.2,
    moderate: 1.5,
    high: 2.0,
    extreme: 2.5
  };
  
  const baseNeed = 500; // ml/heure d'exercice
  const exerciseNeed = exerciseDuration * (baseNeed / 60) * intensityMultiplier[exerciseIntensity];
  const recoveryNeed = exerciseNeed * 1.5; // 150% pour récupération
  
  // Vérification si les besoins sont couverts
  const coverage = hydrationData.totalIntake / (hydrationData.dailyGoal + recoveryNeed);
  return Math.min(100, coverage * 100);
}

function calculateElectrolyteBalance(hydrationData: HydrationData): number {
  // Score basé sur la diversité des fluides et les besoins électrolytiques
  let balanceScore = 70; // Score de base
  
  // Bonus pour boissons sportives si exercice intense
  if (hydrationData.physicalActivity.exerciseIntensity === 'high' || hydrationData.physicalActivity.exerciseIntensity === 'extreme') {
    if (hydrationData.otherFluids.sportsDrinks > 0) {
      balanceScore += 20;
    } else {
      balanceScore -= 15; // Manque d'électrolytes
    }
  }
  
  // Pénalité si trop de fluides diurétiques
  const diureticRatio = (hydrationData.otherFluids.coffee + hydrationData.otherFluids.alcohol) / hydrationData.totalIntake;
  if (diureticRatio > 0.3) {
    balanceScore -= 20;
  }
  
  return Math.max(0, Math.min(100, balanceScore));
}

function calculateSymptomsScore(hydrationData: HydrationData): number {
  let symptomsScore = 100;
  
  const symptoms = hydrationData.symptoms;
  if (symptoms.thirst === 'mild') symptomsScore -= 10;
  if (symptoms.thirst === 'moderate') symptomsScore -= 20;
  if (symptoms.thirst === 'severe') symptomsScore -= 40;
  
  if (symptoms.headache) symptomsScore -= 15;
  if (symptoms.fatigue) symptomsScore -= 10;
  if (symptoms.dizziness) symptomsScore -= 25;
  if (symptoms.drymouth) symptomsScore -= 15;
  if (symptoms.darkUrine) symptomsScore -= 20;
  if (symptoms.constipation) symptomsScore -= 10;
  
  return Math.max(0, symptomsScore);
}

function calculateBiomarkersScore(hydrationData: HydrationData): number {
  let biomarkersScore = 100;
  
  // Score basé sur la couleur d'urine (1=optimal, 8=très déshydraté)
  const urineColorPenalty = (hydrationData.bodyMetrics.urineColor - 1) * 12.5;
  biomarkersScore -= urineColorPenalty;
  
  // Score basé sur la fréquence urinaire (6-8 optimal)
  const urineFreq = hydrationData.bodyMetrics.urineFrequency;
  if (urineFreq < 4) biomarkersScore -= 30;
  else if (urineFreq < 6) biomarkersScore -= 15;
  else if (urineFreq > 10) biomarkersScore -= 10;
  
  return Math.max(0, biomarkersScore);
}

function calculateAbsorptionScore(hydrationData: HydrationData): number {
  // Score d'absorption basé sur le type et la température des fluides
  let absorptionScore = 80;
  
  hydrationData.hydrationTimestamps.forEach(intake => {
    if (intake.temperature === 'cold') absorptionScore += 2; // Absorption plus rapide
    if (intake.temperature === 'hot' && intake.fluidType === 'water') absorptionScore -= 1;
    
    if (intake.fluidType === 'water') absorptionScore += 1;
    if (intake.fluidType === 'sports') absorptionScore += 1.5; // Électrolytes aident
  });
  
  return Math.min(100, absorptionScore);
}

function calculateRetentionScore(hydrationData: HydrationData): number {
  // Score de rétention basé sur les facteurs qui affectent la perte d'eau
  let retentionScore = 85;
  
  // Facteurs qui réduisent la rétention
  if (hydrationData.otherFluids.alcohol > 0) {
    retentionScore -= (hydrationData.otherFluids.alcohol / hydrationData.totalIntake) * 40;
  }
  if (hydrationData.otherFluids.coffee > 200) {
    retentionScore -= 10; // Effet diurétique de la caféine
  }
  
  // Facteurs environnementaux
  if (hydrationData.physicalActivity.environmentalTemp > 25) {
    retentionScore -= 5;
  }
  if (hydrationData.physicalActivity.humidity < 40) {
    retentionScore -= 5;
  }
  
  return Math.max(0, retentionScore);
}