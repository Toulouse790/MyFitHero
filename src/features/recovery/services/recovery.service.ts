import { Activity, Heart } from 'lucide-react';
import {
  RecoveryData,
  RecoveryMetrics,
  RecoveryActivity,
  RecoveryRecommendation,
  RecoveryTrendData,
  AIInsight,
  RecoveryPrediction,
  RecoveryPattern,
  BiometricTrend,
} from '@/features/recovery/types';

export class RecoveryService {
  private static readonly BASE_URL = '/api/recovery';

  /**
   * Récupère le statut de récupération d'un utilisateur
   */
  static async getRecoveryStatus(userId: string): Promise<RecoveryData> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/status`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du statut');
      return await response.json();
    } catch (error: any) {
      // Erreur silencieuse
      // Mode mock pour le développement
      return this.getMockRecoveryData(userId);
    }
  }

  /**
   * Récupère les métriques de récupération
   */
  static async getRecoveryMetrics(userId: string): Promise<RecoveryMetrics> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/metrics`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
      return await response.json();
    } catch (error: any) {
      // Erreur silencieuse
      return this.getMockMetrics(userId);
    }
  }

  /**
   * Met à jour les métriques de récupération
   */
  static async updateRecoveryMetrics(
    userId: string,
    metrics: Partial<RecoveryMetrics>
  ): Promise<RecoveryMetrics> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      return await response.json();
    } catch (error: any) {
      // Erreur silencieuse
      // Return updated mock data
      return { ...this.getMockMetrics(userId), ...metrics };
    }
  }

  /**
   * Enregistre une activité de récupération
   */
  static async logRecoveryActivity(userId: string, activity: RecoveryActivity): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
    } catch (error: any) {
      // Erreur silencieuse
      // Mock success
    }
  }

  /**
   * Récupère les recommandations de récupération
   */
  static async getRecoveryRecommendations(userId: string): Promise<RecoveryRecommendation[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/recommendations`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des recommandations');
      return await response.json();
    } catch (error: any) {
      // Erreur silencieuse
      return RecoveryService.getMockRecommendations();
    }
  }

  /**
   * Calcule le score de récupération
   */
  static calculateRecoveryScore(metrics: RecoveryMetrics): number {
    const {
      sleep_score = 75,
      resting_heart_rate = 60,
      hrv_score = 30,
      stress_level = 3,
      soreness_level = 3,
      energy_level = 4,
    } = metrics;

    // Normalisation des scores (0-100)
    const sleepScore = sleep_score;
    const hrScore = Math.max(0, 100 - Math.abs(resting_heart_rate - 60) * 2);
    const hrvScore = hrv_score;
    const stressScore = Math.max(0, 100 - stress_level * 20); // 1-5 scale
    const stiffnessScore = Math.max(0, 100 - soreness_level * 20); // 1-5 scale
    const energyScore = energy_level * 20; // 1-5 scale

    return Math.round(
      sleepScore * 0.25 +
        hrScore * 0.2 +
        hrvScore * 0.2 +
        stressScore * 0.15 +
        stiffnessScore * 0.1 +
        energyScore * 0.1
    );
  }

  /**
   * Récupère les données de tendance
   */
  static async getRecoveryTrend(userId: string, days: number = 30): Promise<RecoveryTrendData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/trend?days=${days}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la tendance');
      return await response.json();
    } catch (error: any) {
      // Erreur silencieuse
      return this.getMockTrendData(days);
    }
  }

  private static getMockTrendData(days: number): RecoveryTrendData[] {
    const data: RecoveryTrendData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0]!,
        overall: 60 + Math.random() * 30,
        sleep: 50 + Math.random() * 40,
        stress: 40 + Math.random() * 50,
        energy: 55 + Math.random() * 35,
        hrv: 20 + Math.random() * 40,
      });
    }

    return data;
  }

  // ========================================
  // NOUVELLES MÉTHODES IA AVANCÉES
  // ========================================

  /**
   * Récupère les insights IA sur la récupération
   */
  static async getAIInsights(userId: string): Promise<AIInsight[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/ai-insights`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des insights');
      return await response.json();
    } catch (error: any) {
      return this.getMockAIInsights();
    }
  }

  /**
   * Récupère les prédictions de récupération
   */
  static async getRecoveryPredictions(userId: string, days = 7): Promise<RecoveryPrediction[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/predictions?days=${days}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des prédictions');
      return await response.json();
    } catch (error: any) {
      return this.getMockPredictions(days);
    }
  }

  /**
   * Analyse les patterns de récupération
   */
  static async getRecoveryPatterns(userId: string): Promise<RecoveryPattern[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/patterns`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des patterns');
      return await response.json();
    } catch (error: any) {
      return this.getMockPatterns();
    }
  }

  /**
   * Récupère les tendances biométriques
   */
  static async getBiometricTrends(userId: string): Promise<BiometricTrend[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/biometric-trends`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des tendances');
      return await response.json();
    } catch (error: any) {
      return this.getMockBiometricTrends();
    }
  }

  /**
   * Optimise le plan de récupération
   */
  static async optimizeRecoveryPlan(userId: string, goals: string[]): Promise<RecoveryRecommendation[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'optimisation');
      return await response.json();
    } catch (error: any) {
      return this.getMockOptimizedPlan(goals);
    }
  }

  /**
   * Détecte le surentraînement
   */
  static async detectOvertraining(userId: string): Promise<{ risk: number; recommendations: string[] }> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/overtraining`);
      if (!response.ok) throw new Error('Erreur lors de la détection');
      return await response.json();
    } catch (error: any) {
      return {
        risk: Math.round(Math.random() * 100),
        recommendations: [
          'Réduisez l\'intensité des entraînements',
          'Augmentez le temps de récupération',
          'Privilégiez le sommeil de qualité',
          'Intégrez plus d\'exercices de récupération active'
        ]
      };
    }
  }

  /**
   * Prédit les jours optimaux d'entraînement
   */
  static async predictOptimalTrainingDays(userId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/optimal-days`);
      if (!response.ok) throw new Error('Erreur lors de la prédiction');
      return await response.json();
    } catch (error: any) {
      return ['Mardi', 'Jeudi', 'Samedi'];
    }
  }

  /**
   * Recommandations personnalisées par IA
   */
  static async getPersonalizedRecommendations(userId: string): Promise<RecoveryRecommendation[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/personalized-recommendations`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      return await response.json();
    } catch (error: any) {
      return RecoveryService.getMockRecommendations();
    }
  }

  // ========================================
  // MÉTHODES MOCK POUR LES NOUVELLES FONCTIONNALITÉS
  // ========================================

  static getMockAIInsights(): AIInsight[] {
    return [
      {
        id: '1',
        type: 'pattern',
        title: 'Pattern de récupération hebdomadaire détecté',
        description: 'L\'IA a identifié que votre récupération est optimale les mardis et jeudis, suggérant de programmer vos entraînements les plus intenses ces jours-là.',
        confidence: 0.87,
        impact: 'high',
        timeframe: '4 semaines',
        data_points: 28
      },
      {
        id: '2',
        type: 'correlation',
        title: 'Corrélation sommeil-performance',
        description: 'Forte corrélation (r=0.78) entre qualité du sommeil et récupération musculaire. +1h de sommeil = +12% récupération.',
        confidence: 0.94,
        impact: 'high',
        timeframe: '6 semaines',
        data_points: 42
      },
      {
        id: '3',
        type: 'risk',
        title: 'Zone de risque identifiée',
        description: 'Attention : tendance au surentraînement détectée pour les groupes musculaires du haut du corps. Repos recommandé 48h.',
        confidence: 0.72,
        impact: 'medium',
        timeframe: '2 semaines',
        data_points: 14
      }
    ];
  }

  static getMockPredictions(days = 7): RecoveryPrediction[] {
    const predictions: RecoveryPrediction[] = [];
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = i === 1 ? 'Demain' : dayNames[date.getDay()];
      
      const baseScore = 70 + Math.sin(i / 7 * Math.PI * 2) * 20;
      const score = Math.max(40, Math.min(95, baseScore + (Math.random() - 0.5) * 10));
      
      predictions.push({
        date: dayName,
        predicted_score: Math.round(score),
        confidence: 0.85 + Math.random() * 0.1,
        factors: [
          { name: 'Sommeil', impact: 30 + Math.random() * 10, trend: score > 75 ? 'positive' : 'neutral', current_value: 7.5 + Math.random() },
          { name: 'Stress', impact: 20 + Math.random() * 15, trend: score < 60 ? 'negative' : 'neutral', current_value: 3 + Math.random() * 2 },
          { name: 'Charge d\'entraînement', impact: 15 + Math.random() * 10, trend: 'neutral', current_value: 6 + Math.random() * 2 },
          { name: 'Nutrition', impact: 10 + Math.random() * 10, trend: 'positive', current_value: 8 + Math.random() }
        ],
        recommendation: score > 80 ? 'Entraînement intense recommandé' : 
                       score > 65 ? 'Entraînement modéré optimal' : 
                       'Privilégier la récupération'
      });
    }
    
    return predictions;
  }

  static getMockPatterns(): RecoveryPattern[] {
    return [
      {
        pattern_type: 'weekly',
        description: 'Récupération optimale en milieu de semaine (mardi-jeudi)',
        strength: 0.78,
        detected_at: new Date(),
        recommendations: [
          'Programmer les entraînements intenses mardi/jeudi',
          'Planifier les repos actifs en fin de semaine',
          'Optimiser le sommeil dimanche/lundi'
        ]
      },
      {
        pattern_type: 'monthly',
        description: 'Variation cyclique de la récupération liée aux phases de lune',
        strength: 0.45,
        detected_at: new Date(),
        recommendations: [
          'Adapter l\'intensité selon les cycles lunaires',
          'Privilégier la récupération en nouvelle lune'
        ]
      }
    ];
  }

  static getMockBiometricTrends(): BiometricTrend[] {
    return [
      {
        metric: 'VFC (ms)',
        current_value: 45,
        trend_7d: 8.5,
        trend_30d: 12.3,
        percentile: 78,
        status: 'improving'
      },
      {
        metric: 'FC Repos (bpm)',
        current_value: 62,
        trend_7d: -2.1,
        trend_30d: -5.8,
        percentile: 85,
        status: 'improving'
      },
      {
        metric: 'Score Sommeil',
        current_value: 78,
        trend_7d: 3.2,
        trend_30d: 7.9,
        percentile: 72,
        status: 'improving'
      },
      {
        metric: 'Niveau Stress',
        current_value: 3.2,
        trend_7d: -0.8,
        trend_30d: -1.5,
        percentile: 82,
        status: 'improving'
      }
    ];
  }

  static getMockOptimizedPlan(goals: string[]): RecoveryRecommendation[] {
    const planMap: Record<string, RecoveryRecommendation[]> = {
      'performance': [
        {
          id: 'perf1',
          type: 'ice_bath',
          title: 'Bain froid post-entraînement',
          description: 'Accélérez la récupération musculaire',
          action: '10-15 minutes à 10-15°C après l\'entraînement',
          priority: 'high',
          duration: 15,
          timeToComplete: 15,
          estimatedBenefit: '+25% récupération',
          difficulty: 'hard',
          reason: 'Optimisation pour la performance'
        }
      ],
      'health': [
        {
          id: 'health1',
          type: 'meditation',
          title: 'Méditation guidée',
          description: 'Réduisez le stress et améliorez la récupération',
          action: '20 minutes de méditation quotidienne',
          priority: 'medium',
          duration: 20,
          timeToComplete: 20,
          estimatedBenefit: '+15% bien-être',
          difficulty: 'easy',
          reason: 'Amélioration de la santé globale'
        }
      ]
    };

    return goals.flatMap(goal => planMap[goal] || []);
  }

  static getMockRecoveryData(userId: string): RecoveryData {
    return {
      user_id: userId,
      current_metrics: this.getMockMetrics(userId),
      recent_activities: [],
      trends: this.getMockTrendData(7),
      overall_score: 75,
      last_updated: new Date()
    };
  }

  static getMockMetrics(userId: string): RecoveryMetrics {
    return {
      user_id: userId,
      date: new Date(),
      hrv_score: 45,
      resting_heart_rate: 62,
      sleep_score: 78,
      stress_level: 3,
      recovery_score: 75,
      readiness_score: 80,
      fatigue_level: 2,
      soreness_level: 3,
      energy_level: 4,
    };
  }

  static getMockRecommendations(): RecoveryRecommendation[] {
    return [
      {
        id: '1',
        type: 'meditation',
        title: 'Améliorer la qualité du sommeil',
        description: 'Votre score de sommeil peut être amélioré',
        action: 'Essayez de vous coucher 30 minutes plus tôt',
        priority: 'high',
        duration: 480,
        timeToComplete: 30,
        estimatedBenefit: '+10% récupération',
        difficulty: 'easy',
        reason: 'Analyse des patterns de sommeil'
      },
      {
        id: '2',
        type: 'stretching',
        title: 'Réduire le stress',
        description: 'Niveau de stress légèrement élevé détecté',
        action: 'Pratiquez 10 minutes de méditation',
        priority: 'medium',
        duration: 10,
        timeToComplete: 10,
        estimatedBenefit: '+5% bien-être',
        difficulty: 'easy',
        reason: 'Gestion du stress quotidien'
      }
    ];
  }
}
