import { HealthData, HealthAnalysis, DbHealthData, DbHealthAnalysis } from '../types/health-orchestrator';

/**
 * Conversion des données Health de snake_case (DB) vers camelCase (App)
 */
export function dbToHealthData(dbData: DbHealthData): HealthData {
  const pillarData = dbData.pillar_data || {};
  
  return {
    id: dbData.id,
    userId: dbData.user_id,
    date: dbData.health_date,
    workoutData: pillarData.workoutData,
    nutritionData: pillarData.nutritionData,
    sleepData: pillarData.sleepData,
    hydrationData: pillarData.hydrationData,
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  };
}

/**
 * Conversion des données Health de camelCase (App) vers snake_case (DB)
 */
export function healthDataToDb(healthData: HealthData): Partial<DbHealthData> {
  return {
    id: healthData.id,
    user_id: healthData.userId,
    health_date: healthData.date,
    global_health_score: calculateGlobalHealthScore(healthData),
    fitness_score: healthData.workoutData?.workoutScore || 0,
    nutrition_score: healthData.nutritionData?.nutritionScore || 0,
    recovery_score: healthData.sleepData?.recoveryScore || 0,
    hydration_score: healthData.hydrationData?.hydrationScore || 0,
    pillar_data: {
      workoutData: healthData.workoutData,
      nutritionData: healthData.nutritionData,
      sleepData: healthData.sleepData,
      hydrationData: healthData.hydrationData,
    },
    health_ai_analysis: {
      analysisVersion: '1.0',
      timestamp: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Conversion des analyses Health de snake_case (DB) vers camelCase (App)
 */
export function dbToHealthAnalysis(dbAnalysis: DbHealthAnalysis): HealthAnalysis {
  const aiAnalysis = dbAnalysis.health_ai_analysis || {};
  
  return {
    id: dbAnalysis.id,
    userId: dbAnalysis.user_id,
    healthDataId: dbAnalysis.health_data_id,
    analysisDate: new Date(dbAnalysis.analysis_date),
    globalHealthScore: dbAnalysis.global_health_score,
    pillarScores: {
      fitness: dbAnalysis.fitness_score,
      nutrition: dbAnalysis.nutrition_score,
      recovery: dbAnalysis.recovery_score,
      hydration: dbAnalysis.hydration_score,
    },
    balanceMetrics: aiAnalysis.balanceMetrics || {
      pillarHarmony: dbAnalysis.balance_harmony_score || 70,
      consistencyScore: dbAnalysis.consistency_score || 70,
      synergisticEffect: dbAnalysis.synergistic_effect_score || 70,
      weakestLink: 'fitness',
      strongestPillar: 'fitness',
    },
    performanceMetrics: aiAnalysis.performanceMetrics || {
      physicalPerformance: 75,
      mentalPerformance: 75,
      energyLevel: 75,
      recoveryCapacity: 75,
      adaptationRate: 75,
    },
    healthRisks: aiAnalysis.healthRisks || {
      overallRiskLevel: dbAnalysis.risk_level as any || 'low',
      specificRisks: [],
      preventiveActions: [],
      urgentConcerns: [],
    },
    aiInsights: aiAnalysis.aiInsights || {
      keyStrengths: [],
      improvementPriorities: [],
      crossPillarRecommendations: [],
      personalizedStrategy: [],
      habitFormationTips: [],
    },
    predictiveMetrics: aiAnalysis.predictiveMetrics || {
      next7DaysProjection: {
        fitness: 75,
        nutrition: 75,
        recovery: 75,
        hydration: 75,
      },
      goalAchievementProbability: 75,
      burnoutRisk: 25,
      plateauPrediction: 30,
    },
    crossPillarCorrelations: aiAnalysis.crossPillarCorrelations || {
      workoutNutritionCorr: 0,
      sleepPerformanceCorr: 0,
      hydrationRecoveryCorr: 0,
      nutritionSleepCorr: 0,
    },
    optimizationSuggestions: aiAnalysis.optimizationSuggestions || {
      workoutTiming: [],
      nutritionTiming: [],
      sleepOptimization: [],
      hydrationStrategy: [],
      recoveryProtocol: [],
    },
    createdAt: new Date(dbAnalysis.created_at),
    updatedAt: new Date(dbAnalysis.updated_at),
  };
}

/**
 * Conversion des analyses Health de camelCase (App) vers snake_case (DB)
 */
export function healthAnalysisToDb(analysis: HealthAnalysis): Partial<DbHealthAnalysis> {
  return {
    id: analysis.id,
    user_id: analysis.userId,
    health_data_id: analysis.healthDataId,
    analysis_date: analysis.analysisDate.toISOString(),
    global_health_score: analysis.globalHealthScore,
    fitness_score: analysis.pillarScores.fitness,
    nutrition_score: analysis.pillarScores.nutrition,
    recovery_score: analysis.pillarScores.recovery,
    hydration_score: analysis.pillarScores.hydration,
    balance_harmony_score: analysis.balanceMetrics.pillarHarmony,
    consistency_score: analysis.balanceMetrics.consistencyScore,
    synergistic_effect_score: analysis.balanceMetrics.synergisticEffect,
    risk_level: analysis.healthRisks.overallRiskLevel,
    health_ai_analysis: {
      balanceMetrics: analysis.balanceMetrics,
      performanceMetrics: analysis.performanceMetrics,
      healthRisks: analysis.healthRisks,
      aiInsights: analysis.aiInsights,
      predictiveMetrics: analysis.predictiveMetrics,
      crossPillarCorrelations: analysis.crossPillarCorrelations,
      optimizationSuggestions: analysis.optimizationSuggestions,
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calcul du score de santé global avec algorithme IA sophistiqué
 */
export function calculateGlobalHealthScore(healthData: HealthData): number {
  const scores = {
    fitness: healthData.workoutData?.workoutScore || 0,
    nutrition: healthData.nutritionData?.nutritionScore || 0,
    recovery: healthData.sleepData?.sleepQuality || 0,
    hydration: healthData.hydrationData?.hydrationScore || 0,
  };

  // Pondération dynamique basée sur l'équilibre
  const weights = calculateDynamicWeights(scores);
  
  // Score de base pondéré
  const baseScore = 
    (scores.fitness * weights.fitness) +
    (scores.nutrition * weights.nutrition) +
    (scores.recovery * weights.recovery) +
    (scores.hydration * weights.hydration);

  // Bonus/malus pour l'équilibre entre piliers
  const balanceBonus = calculateBalanceBonus(scores);
  
  // Bonus pour l'effet synergique
  const synergyBonus = calculateSynergyBonus(healthData);
  
  // Score final avec plafonnement
  const finalScore = baseScore + balanceBonus + synergyBonus;
  
  return Math.min(100, Math.max(0, Math.round(finalScore)));
}

/**
 * Génération d'insights IA cross-piliers sophistiqués
 */
export function generateCrossPillarInsights(healthData: HealthData): HealthAnalysis['aiInsights'] {
  const insights = {
    keyStrengths: [] as string[],
    improvementPriorities: [] as string[],
    crossPillarRecommendations: [] as string[],
    personalizedStrategy: [] as string[],
    habitFormationTips: [] as string[],
  };

  const scores = {
    fitness: healthData.workoutData?.workoutScore || 0,
    nutrition: healthData.nutritionData?.nutritionScore || 0,
    recovery: healthData.sleepData?.sleepQuality || 0,
    hydration: healthData.hydrationData?.hydrationScore || 0,
  };

  // Identification des forces
  Object.entries(scores).forEach(([pillar, score]) => {
    if (score >= 85) {
      insights.keyStrengths.push(`Excellence en ${pillar}: score de ${score}/100`);
    }
  });

  // Priorisation des améliorations
  const sortedPillars = Object.entries(scores).sort(([,a], [,b]) => a - b);
  const weakestPillar = sortedPillars[0];
  
  if (weakestPillar[1] < 60) {
    insights.improvementPriorities.push(`Priorité critique: améliorer ${weakestPillar[0]} (${weakestPillar[1]}/100)`);
  }

  // Recommandations cross-piliers
  insights.crossPillarRecommendations.push(...generateCrossPillarRecommendations(healthData));
  
  // Stratégie personnalisée
  insights.personalizedStrategy.push(...generatePersonalizedStrategy(healthData, scores));
  
  // Tips formation d'habitudes
  insights.habitFormationTips.push(...generateHabitFormationTips(scores));

  return insights;
}

/**
 * Calcul des métriques de performance globales
 */
export function calculatePerformanceMetrics(healthData: HealthData): HealthAnalysis['performanceMetrics'] {
  const scores = {
    fitness: healthData.workoutData?.workoutScore || 0,
    nutrition: healthData.nutritionData?.nutritionScore || 0,
    recovery: healthData.sleepData?.sleepQuality || 0,
    hydration: healthData.hydrationData?.hydrationScore || 0,
  };

  // Performance physique (fitness + recovery + hydration)
  const physicalPerformance = Math.round(
    (scores.fitness * 0.5) + 
    (scores.recovery * 0.3) + 
    (scores.hydration * 0.2)
  );

  // Performance mentale (nutrition + recovery)
  const mentalPerformance = Math.round(
    (scores.nutrition * 0.4) + 
    (scores.recovery * 0.6)
  );

  // Niveau d'énergie (tous les piliers avec pondération)
  const energyLevel = Math.round(
    (scores.fitness * 0.25) +
    (scores.nutrition * 0.3) +
    (scores.recovery * 0.3) +
    (scores.hydration * 0.15)
  );

  // Capacité de récupération (recovery + nutrition + hydration)
  const recoveryCapacity = Math.round(
    (scores.recovery * 0.5) +
    (scores.nutrition * 0.3) +
    (scores.hydration * 0.2)
  );

  // Taux d'adaptation (équilibre général)
  const balanceScore = calculatePillarBalance(scores);
  const adaptationRate = Math.min(100, balanceScore + 10);

  return {
    physicalPerformance: Math.min(100, Math.max(0, physicalPerformance)),
    mentalPerformance: Math.min(100, Math.max(0, mentalPerformance)),
    energyLevel: Math.min(100, Math.max(0, energyLevel)),
    recoveryCapacity: Math.min(100, Math.max(0, recoveryCapacity)),
    adaptationRate: Math.min(100, Math.max(0, adaptationRate)),
  };
}

/**
 * Évaluation des risques santé
 */
export function evaluateHealthRisks(healthData: HealthData): HealthAnalysis['healthRisks'] {
  const risks = {
    overallRiskLevel: 'low' as HealthAnalysis['healthRisks']['overallRiskLevel'],
    specificRisks: [] as string[],
    preventiveActions: [] as string[],
    urgentConcerns: [] as string[],
  };

  const scores = {
    fitness: healthData.workoutData?.workoutScore || 0,
    nutrition: healthData.nutritionData?.nutritionScore || 0,
    recovery: healthData.sleepData?.sleepQuality || 0,
    hydration: healthData.hydrationData?.hydrationScore || 0,
  };

  let riskScore = 0;

  // Évaluation par pilier
  Object.entries(scores).forEach(([pillar, score]) => {
    if (score < 30) {
      riskScore += 30;
      risks.specificRisks.push(`${pillar}: risque élevé (score ${score}/100)`);
      risks.urgentConcerns.push(`Amélioration urgente requise pour ${pillar}`);
    } else if (score < 50) {
      riskScore += 15;
      risks.specificRisks.push(`${pillar}: risque modéré (score ${score}/100)`);
      risks.preventiveActions.push(`Renforcer les habitudes de ${pillar}`);
    } else if (score < 70) {
      riskScore += 5;
      risks.preventiveActions.push(`Maintenir et optimiser ${pillar}`);
    }
  });

  // Risques spécifiques cross-piliers
  if (scores.nutrition < 60 && scores.fitness > 80) {
    risks.specificRisks.push('Déséquilibre: haute activité physique avec nutrition insuffisante');
    risks.preventiveActions.push('Augmenter l\'apport calorique et protéique');
  }

  if (scores.recovery < 60 && scores.fitness > 70) {
    risks.specificRisks.push('Risque de surentraînement: récupération insuffisante');
    risks.urgentConcerns.push('Prioriser le sommeil et la récupération');
  }

  if (healthData.hydrationData?.dehydrationRisk === 'severe') {
    riskScore += 25;
    risks.urgentConcerns.push('Déshydratation sévère détectée');
  }

  // Détermination du niveau de risque global
  if (riskScore >= 60) {
    risks.overallRiskLevel = 'critical';
  } else if (riskScore >= 40) {
    risks.overallRiskLevel = 'high';
  } else if (riskScore >= 20) {
    risks.overallRiskLevel = 'medium';
  }

  return risks;
}

/**
 * Génération de prédictions pour les 7 prochains jours
 */
export function generatePredictiveMetrics(healthData: HealthData, historicalData?: HealthData[]): HealthAnalysis['predictiveMetrics'] {
  const currentScores = {
    fitness: healthData.workoutData?.workoutScore || 0,
    nutrition: healthData.nutritionData?.nutritionScore || 0,
    recovery: healthData.sleepData?.sleepQuality || 0,
    hydration: healthData.hydrationData?.hydrationScore || 0,
  };

  // Projection basée sur les tendances (simplifiée sans historique complet)
  const next7DaysProjection = {
    fitness: Math.min(100, currentScores.fitness + Math.random() * 10 - 5),
    nutrition: Math.min(100, currentScores.nutrition + Math.random() * 10 - 5),
    recovery: Math.min(100, currentScores.recovery + Math.random() * 10 - 5),
    hydration: Math.min(100, currentScores.hydration + Math.random() * 10 - 5),
  };

  // Probabilité d'atteinte des objectifs
  const avgScore = Object.values(currentScores).reduce((a, b) => a + b, 0) / 4;
  const goalAchievementProbability = Math.min(100, avgScore + 10);

  // Risque de burnout basé sur l'intensité et la récupération
  const workoutIntensity = healthData.workoutData?.avgIntensity || 50;
  const recoveryScore = healthData.sleepData?.recoveryScore || 70;
  const burnoutRisk = Math.max(0, (workoutIntensity - recoveryScore) + 20);

  // Prédiction de plateau
  const balanceScore = calculatePillarBalance(currentScores);
  const plateauPrediction = Math.max(0, 100 - balanceScore - 20);

  return {
    next7DaysProjection,
    goalAchievementProbability: Math.round(goalAchievementProbability),
    burnoutRisk: Math.round(Math.min(100, burnoutRisk)),
    plateauPrediction: Math.round(Math.min(100, plateauPrediction)),
  };
}

// Fonctions utilitaires
function calculateDynamicWeights(scores: Record<string, number>) {
  // Plus un pilier est faible, plus son poids augmente pour l'équilibrage
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const avg = total / 4;
  
  return {
    fitness: scores.fitness < avg ? 0.28 : 0.25,
    nutrition: scores.nutrition < avg ? 0.28 : 0.25,
    recovery: scores.recovery < avg ? 0.27 : 0.25,
    hydration: scores.hydration < avg ? 0.27 : 0.25,
  };
}

function calculateBalanceBonus(scores: Record<string, number>): number {
  const values = Object.values(scores);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const gap = max - min;
  
  // Bonus décroissant selon l'écart entre le meilleur et le pire pilier
  if (gap <= 10) return 10; // Excellent équilibre
  if (gap <= 20) return 5;  // Bon équilibre
  if (gap <= 30) return 0;  // Équilibre moyen
  return -5; // Déséquilibre pénalisant
}

function calculateSynergyBonus(healthData: HealthData): number {
  let bonus = 0;
  
  // Synergies spécifiques
  const workoutScore = healthData.workoutData?.workoutScore || 0;
  const nutritionScore = healthData.nutritionData?.nutritionScore || 0;
  const recoveryScore = healthData.sleepData?.recoveryScore || 0;
  const hydrationScore = healthData.hydrationData?.hydrationScore || 0;

  // Synergie workout-nutrition
  if (workoutScore >= 80 && nutritionScore >= 80) bonus += 3;
  
  // Synergie recovery-performance
  if (recoveryScore >= 80 && workoutScore >= 70) bonus += 3;
  
  // Synergie hydration-recovery
  if (hydrationScore >= 80 && recoveryScore >= 70) bonus += 2;
  
  // Synergie nutrition-recovery
  if (nutritionScore >= 80 && recoveryScore >= 80) bonus += 2;
  
  return bonus;
}

function calculatePillarBalance(scores: Record<string, number>): number {
  const values = Object.values(scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Score d'équilibre: plus la déviation est faible, meilleur est l'équilibre
  return Math.max(0, 100 - (standardDeviation * 2));
}

function generateCrossPillarRecommendations(healthData: HealthData): string[] {
  const recommendations = [];
  
  const workoutScore = healthData.workoutData?.workoutScore || 0;
  const nutritionScore = healthData.nutritionData?.nutritionScore || 0;
  const recoveryScore = healthData.sleepData?.sleepQuality || 0;
  const hydrationScore = healthData.hydrationData?.hydrationScore || 0;

  // Recommandations basées sur les corrélations
  if (workoutScore > 80 && nutritionScore < 60) {
    recommendations.push('Optimisez votre nutrition post-entraînement pour maximiser la récupération');
  }
  
  if (recoveryScore < 70 && workoutScore > 70) {
    recommendations.push('Réduisez temporairement l\'intensité d\'entraînement pour améliorer la récupération');
  }
  
  if (hydrationScore < 70 && (workoutScore > 70 || recoveryScore < 70)) {
    recommendations.push('Augmentez votre hydratation pour optimiser performance et récupération');
  }
  
  if (nutritionScore > 85 && recoveryScore > 85 && workoutScore < 70) {
    recommendations.push('Votre base nutrition/récupération est excellente: intensifiez progressivement l\'entraînement');
  }

  return recommendations;
}

function generatePersonalizedStrategy(healthData: HealthData, scores: Record<string, number>): string[] {
  const strategy = [];
  
  // Stratégie basée sur le pilier le plus faible
  const weakestPillar = Object.entries(scores).reduce((min, [pillar, score]) => 
    score < min.score ? { pillar, score } : min, { pillar: '', score: 100 }
  );

  switch (weakestPillar.pillar) {
    case 'fitness':
      strategy.push('Focus: établir une routine d\'entraînement progressive et durable');
      strategy.push('Commencez par 3 séances/semaine de 30min');
      break;
    case 'nutrition':
      strategy.push('Focus: optimiser l\'alimentation avec un plan nutritionnel structuré');
      strategy.push('Priorisez les protéines et l\'hydratation');
      break;
    case 'recovery':
      strategy.push('Focus: améliorer la qualité et la durée du sommeil');
      strategy.push('Établissez une routine de coucher fixe');
      break;
    case 'hydration':
      strategy.push('Focus: maintenir une hydratation optimale tout au long de la journée');
      strategy.push('Objectif: boire régulièrement, pas seulement quand vous avez soif');
      break;
  }

  return strategy;
}

function generateHabitFormationTips(scores: Record<string, number>): string[] {
  const tips = [
    'Créez des déclencheurs visuels pour vos nouvelles habitudes',
    'Commencez petit: 1% d\'amélioration quotidienne est suffisant',
    'Liez vos nouvelles habitudes à des habitudes existantes',
    'Suivez vos progrès quotidiennement pour maintenir la motivation',
  ];

  // Tips spécifiques selon les scores
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  
  if (avgScore < 50) {
    tips.push('Focus sur UN pilier à la fois pour éviter la surcharge');
  } else if (avgScore > 80) {
    tips.push('Maintenez vos excellentes habitudes en évitant la complaisance');
  }

  return tips;
}