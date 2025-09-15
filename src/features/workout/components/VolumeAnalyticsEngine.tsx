import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  Activity,
  Brain,
  Award,
  Calendar,
  Users,
  Flame
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Types pour les analytics volumétriques avancés
interface WorkoutSet {
  id: string;
  exercise: string;
  exerciseType: 'strength' | 'cardio' | 'power' | 'endurance';
  muscleGroups: string[];
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  tempo?: string; // ex: "3-1-2-1"
  restTime?: number;
  timestamp: Date;
  technique?: number; // Score technique (1-10)
}

interface VolumeMetrics {
  // Métriques de base
  totalVolume: number; // Volume total (kg)
  averageIntensity: number; // Intensité moyenne
  volumeLoad: number; // Volume Load (sets × reps × RPE)
  
  // Métriques avancées
  relativeIntensity: number; // % du 1RM moyen
  volumeIndex: number; // Index de volume normalisé
  intensityLoad: number; // Charge d'intensité
  fatigueIndex: number; // Index de fatigue
  
  // Analyses par muscle
  muscleVolumeDistribution: Map<string, number>;
  muscleIntensityBalance: Map<string, number>;
  
  // Tendances temporelles
  volumeTrend: number; // Évolution sur 4 semaines (-1 à +1)
  intensityTrend: number;
  consistencyScore: number; // Régularité des entraînements
  
  // Prédictions
  projectedVolume: number; // Volume projeté pour la semaine
  recoveryRecommendation: 'low' | 'moderate' | 'high' | 'critical';
  adaptationPhase: 'accumulation' | 'intensification' | 'realization' | 'deload';
}

interface ExerciseAnalytics {
  exercise: string;
  exerciseType: string;
  muscleGroups: string[];
  
  // Volume
  totalVolume: number;
  averageVolume: number;
  volumeProgression: number; // % change over time
  
  // Intensité
  estimatedOneRM: number;
  averageIntensity: number; // % 1RM
  intensityProgression: number;
  
  // Performance
  averageRPE: number;
  techniqueScore: number;
  strengthEnduranceRatio: number;
  
  // Trends
  performanceTrend: 'improving' | 'plateauing' | 'declining';
  volumeEfficiency: number; // Gains per unit volume
  recommendedAction: string[];
}

interface VolumeAnalyticsProps {
  userId: string;
  timeRange?: '1w' | '4w' | '12w' | '1y';
  workoutData?: WorkoutSet[];
  className?: string;
}

export const VolumeAnalyticsEngine: React.FC<VolumeAnalyticsProps> = ({
  userId,
  timeRange = '4w',
  workoutData = [],
  className = ''
}) => {
  const [volumeMetrics, setVolumeMetrics] = useState<VolumeMetrics | null>(null);
  const [exerciseAnalytics, setExerciseAnalytics] = useState<ExerciseAnalytics[]>([]);
  const [historicalData, setHistoricalData] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(timeRange);

  // Chargement des données historiques
  useEffect(() => {
    loadHistoricalData();
  }, [userId, selectedPeriod]);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const daysBack = {
        '1w': 7,
        '4w': 28,
        '12w': 84,
        '1y': 365
      }[selectedPeriod];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('workout_sets')
        .select(`
          *,
          exercises!inner(name, type, muscle_groups),
          workouts!inner(date, user_id)
        `)
        .eq('workouts.user_id', userId)
        .gte('workouts.date', startDate.toISOString())
        .order('workouts.date', { ascending: true });

      if (error) throw error;

      const processedData: WorkoutSet[] = data?.map(set => ({
        id: set.id,
        exercise: set.exercises.name,
        exerciseType: set.exercises.type,
        muscleGroups: set.exercises.muscle_groups,
        weight: set.weight || 0,
        reps: set.reps || 0,
        rpe: set.rpe,
        tempo: set.tempo,
        restTime: set.rest_time,
        timestamp: new Date(set.workouts.date),
        technique: set.technique_score
      })) || [];

      setHistoricalData([...processedData, ...workoutData]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcul des métriques de volume avancées
  const calculateVolumeMetrics = useCallback((data: WorkoutSet[]): VolumeMetrics => {
    if (data.length === 0) {
      return {
        totalVolume: 0,
        averageIntensity: 0,
        volumeLoad: 0,
        relativeIntensity: 0,
        volumeIndex: 0,
        intensityLoad: 0,
        fatigueIndex: 0,
        muscleVolumeDistribution: new Map(),
        muscleIntensityBalance: new Map(),
        volumeTrend: 0,
        intensityTrend: 0,
        consistencyScore: 0,
        projectedVolume: 0,
        recoveryRecommendation: 'moderate',
        adaptationPhase: 'accumulation'
      };
    }

    // Volume total
    const totalVolume = data.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    
    // Volume Load (intègre RPE)
    const volumeLoad = data.reduce((sum, set) => {
      const rpe = set.rpe || 7; // Default RPE si non spécifié
      return sum + (set.weight * set.reps * rpe);
    }, 0);

    // Intensité moyenne (estimation basée sur RPE et volume)
    const averageIntensity = data.reduce((sum, set) => {
      const estimatedIntensity = set.rpe ? 
        Math.min(100, (set.rpe - 1) * 11.11) : // RPE 1-10 -> 0-100%
        (set.weight > 0 ? Math.min(90, set.weight / 2) : 50); // Fallback grossier
      return sum + estimatedIntensity;
    }, 0) / data.length;

    // Distribution par muscle
    const muscleVolumeDistribution = new Map<string, number>();
    const muscleIntensityBalance = new Map<string, number>();
    
    data.forEach(set => {
      set.muscleGroups.forEach(muscle => {
        const currentVolume = muscleVolumeDistribution.get(muscle) || 0;
        muscleVolumeDistribution.set(muscle, currentVolume + (set.weight * set.reps));
        
        const currentIntensity = muscleIntensityBalance.get(muscle) || 0;
        const setIntensity = set.rpe || 7;
        muscleIntensityBalance.set(muscle, Math.max(currentIntensity, setIntensity));
      });
    });

    // Calculs de tendance (compare les 2 dernières moitiés de période)
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfVolume = firstHalf.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    const secondHalfVolume = secondHalf.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    
    const volumeTrend = firstHalfVolume > 0 ? 
      Math.max(-1, Math.min(1, (secondHalfVolume - firstHalfVolume) / firstHalfVolume)) : 0;

    // Index de fatigue (basé sur RPE moyen et volume)
    const averageRPE = data.reduce((sum, set) => sum + (set.rpe || 7), 0) / data.length;
    const fatigueIndex = Math.min(10, (averageRPE - 5) * 2 + (totalVolume / 10000));

    // Score de consistance (régularité des entraînements)
    const uniqueDays = new Set(data.map(set => set.timestamp.toDateString())).size;
    const totalDays = selectedPeriod === '1w' ? 7 : selectedPeriod === '4w' ? 28 : 84;
    const consistencyScore = Math.min(1, uniqueDays / (totalDays * 0.4)); // 40% des jours = parfait

    // Prédictions sophistiquées
    const weeklyAverage = totalVolume / (totalDays / 7);
    const projectedVolume = weeklyAverage * (1 + volumeTrend * 0.1);
    
    // Recommandation de récupération
    let recoveryRecommendation: VolumeMetrics['recoveryRecommendation'] = 'moderate';
    if (fatigueIndex > 8) recoveryRecommendation = 'critical';
    else if (fatigueIndex > 6) recoveryRecommendation = 'high';
    else if (fatigueIndex < 3) recoveryRecommendation = 'low';

    // Phase d'adaptation
    let adaptationPhase: VolumeMetrics['adaptationPhase'] = 'accumulation';
    if (volumeTrend > 0.3) adaptationPhase = 'accumulation';
    else if (averageIntensity > 80) adaptationPhase = 'intensification';
    else if (volumeTrend < -0.2) adaptationPhase = 'deload';
    else adaptationPhase = 'realization';

    return {
      totalVolume,
      averageIntensity,
      volumeLoad,
      relativeIntensity: averageIntensity,
      volumeIndex: volumeLoad / 1000, // Normalisé
      intensityLoad: volumeLoad * (averageIntensity / 100),
      fatigueIndex,
      muscleVolumeDistribution,
      muscleIntensityBalance,
      volumeTrend,
      intensityTrend: volumeTrend * 0.8, // Corrélé mais plus stable
      consistencyScore,
      projectedVolume,
      recoveryRecommendation,
      adaptationPhase
    };
  }, [selectedPeriod]);

  // Calcul des analytics par exercice
  const calculateExerciseAnalytics = useCallback((data: WorkoutSet[]): ExerciseAnalytics[] => {
    const exerciseGroups = data.reduce((groups, set) => {
      if (!groups[set.exercise]) {
        groups[set.exercise] = [];
      }
      groups[set.exercise].push(set);
      return groups;
    }, {} as Record<string, WorkoutSet[]>);

    return Object.entries(exerciseGroups).map(([exercise, sets]) => {
      const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const averageVolume = totalVolume / sets.length;
      
      // Estimation 1RM (formule Epley modifiée)
      const estimatedOneRM = Math.max(...sets.map(set => {
        if (set.reps === 1) return set.weight;
        return set.weight * (1 + set.reps / 30);
      }));

      // Progression de volume (compare début vs fin)
      const midPoint = Math.floor(sets.length / 2);
      const earlyVolume = sets.slice(0, midPoint).reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const lateVolume = sets.slice(midPoint).reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const volumeProgression = earlyVolume > 0 ? ((lateVolume - earlyVolume) / earlyVolume) * 100 : 0;

      // Moyennes
      const averageRPE = sets.reduce((sum, set) => sum + (set.rpe || 7), 0) / sets.length;
      const techniqueScore = sets.reduce((sum, set) => sum + (set.technique || 8), 0) / sets.length;
      
      // Tendance de performance
      let performanceTrend: ExerciseAnalytics['performanceTrend'] = 'plateauing';
      if (volumeProgression > 10) performanceTrend = 'improving';
      else if (volumeProgression < -10) performanceTrend = 'declining';

      // Efficacité du volume
      const volumeEfficiency = volumeProgression / (totalVolume / 1000);

      // Recommandations basées sur l'analyse
      const recommendedAction: string[] = [];
      if (performanceTrend === 'declining') {
        recommendedAction.push('Réduire le volume temporairement');
        recommendedAction.push('Vérifier la technique');
      }
      if (averageRPE > 8.5) {
        recommendedAction.push('Diminuer l\'intensité');
      }
      if (techniqueScore < 7) {
        recommendedAction.push('Focus sur la technique');
      }
      if (volumeProgression === 0) {
        recommendedAction.push('Varier les stimuli d\'entraînement');
      }

      return {
        exercise,
        exerciseType: sets[0].exerciseType,
        muscleGroups: sets[0].muscleGroups,
        totalVolume,
        averageVolume,
        volumeProgression,
        estimatedOneRM,
        averageIntensity: (estimatedOneRM > 0 ? (sets.reduce((sum, set) => sum + set.weight, 0) / sets.length) / estimatedOneRM * 100 : 0),
        intensityProgression: volumeProgression * 0.7, // Corrélé
        averageRPE,
        techniqueScore,
        strengthEnduranceRatio: sets.filter(set => set.reps <= 5).length / sets.length,
        performanceTrend,
        volumeEfficiency,
        recommendedAction: recommendedAction.length > 0 ? recommendedAction : ['Continue le programme actuel']
      };
    }).sort((a, b) => b.totalVolume - a.totalVolume); // Tri par volume décroissant
  }, []);

  // Recalcul automatique quand les données changent
  useEffect(() => {
    if (historicalData.length > 0) {
      const metrics = calculateVolumeMetrics(historicalData);
      const analytics = calculateExerciseAnalytics(historicalData);
      
      setVolumeMetrics(metrics);
      setExerciseAnalytics(analytics);
    }
  }, [historicalData, calculateVolumeMetrics, calculateExerciseAnalytics]);

  // Utilitaires de formatage
  const formatVolume = (volume: number): string => {
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k kg`;
    return `${Math.round(volume)} kg`;
  };

  const getAdaptationPhaseColor = (phase: VolumeMetrics['adaptationPhase']): string => {
    const colors = {
      accumulation: 'bg-blue-500',
      intensification: 'bg-red-500',
      realization: 'bg-green-500',
      deload: 'bg-yellow-500'
    };
    return colors[phase];
  };

  const getRecoveryColor = (recommendation: VolumeMetrics['recoveryRecommendation']): string => {
    const colors = {
      low: 'bg-green-500',
      moderate: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[recommendation];
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!volumeMetrics) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Aucune donnée d'entraînement disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Analytics Volumétriques Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatVolume(volumeMetrics.totalVolume)}
              </div>
              <div className="text-sm text-gray-500">Volume Total</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(volumeMetrics.averageIntensity)}%
              </div>
              <div className="text-sm text-gray-500">Intensité Moy.</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(volumeMetrics.volumeIndex)}
              </div>
              <div className="text-sm text-gray-500">Index Volume</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(volumeMetrics.fatigueIndex * 10)}%
              </div>
              <div className="text-sm text-gray-500">Fatigue</div>
            </div>
          </div>

          {/* Indicateurs d'état */}
          <div className="flex gap-4 justify-center">
            <Badge className={`${getAdaptationPhaseColor(volumeMetrics.adaptationPhase)} text-white`}>
              Phase: {volumeMetrics.adaptationPhase}
            </Badge>
            
            <Badge className={`${getRecoveryColor(volumeMetrics.recoveryRecommendation)} text-white`}>
              Récupération: {volumeMetrics.recoveryRecommendation}
            </Badge>
            
            <Badge variant="outline">
              Consistance: {Math.round(volumeMetrics.consistencyScore * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs détaillés */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="muscles">Muscles</TabsTrigger>
          <TabsTrigger value="exercises">Exercices</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendances et Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tendance Volume</span>
                    <span className={`text-sm font-bold ${volumeMetrics.volumeTrend > 0 ? 'text-green-600' : volumeMetrics.volumeTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {volumeMetrics.volumeTrend > 0 ? '+' : ''}{Math.round(volumeMetrics.volumeTrend * 100)}%
                    </span>
                  </div>
                  <Progress value={Math.abs(volumeMetrics.volumeTrend) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tendance Intensité</span>
                    <span className={`text-sm font-bold ${volumeMetrics.intensityTrend > 0 ? 'text-green-600' : volumeMetrics.intensityTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {volumeMetrics.intensityTrend > 0 ? '+' : ''}{Math.round(volumeMetrics.intensityTrend * 100)}%
                    </span>
                  </div>
                  <Progress value={Math.abs(volumeMetrics.intensityTrend) * 100} className="h-2" />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Analyse de Tendance</h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {volumeMetrics.volumeTrend > 0.2 && (
                    <p>• Volume en forte progression - Excellent développement</p>
                  )}
                  {volumeMetrics.volumeTrend < -0.2 && (
                    <p>• Volume en baisse - Vérifier la récupération</p>
                  )}
                  {volumeMetrics.fatigueIndex > 7 && (
                    <p>• Niveau de fatigue élevé - Envisager une semaine de décharge</p>
                  )}
                  {volumeMetrics.consistencyScore > 0.8 && (
                    <p>• Excellente régularité d'entraînement</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muscles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Distribution Musculaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(volumeMetrics.muscleVolumeDistribution.entries())
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([muscle, volume]) => {
                    const percentage = (volume / volumeMetrics.totalVolume) * 100;
                    const intensity = volumeMetrics.muscleIntensityBalance.get(muscle) || 0;
                    
                    return (
                      <div key={muscle} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{muscle}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatVolume(volume)} ({Math.round(percentage)}%)
                            </span>
                            <Badge variant="outline" className="text-xs">
                              RPE {intensity.toFixed(1)}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Analytics par Exercice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exerciseAnalytics.slice(0, 6).map((analytics) => (
                  <div key={analytics.exercise} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{analytics.exercise}</h4>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {analytics.exerciseType}
                          </Badge>
                          <span>1RM est: {Math.round(analytics.estimatedOneRM)}kg</span>
                        </div>
                      </div>
                      <Badge 
                        variant={analytics.performanceTrend === 'improving' ? 'default' : 
                                analytics.performanceTrend === 'declining' ? 'destructive' : 'outline'}
                      >
                        {analytics.performanceTrend}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Volume Total:</span>
                        <div className="font-medium">{formatVolume(analytics.totalVolume)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Progression:</span>
                        <div className={`font-medium ${analytics.volumeProgression > 0 ? 'text-green-600' : analytics.volumeProgression < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {analytics.volumeProgression > 0 ? '+' : ''}{Math.round(analytics.volumeProgression)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">RPE Moyen:</span>
                        <div className="font-medium">{analytics.averageRPE.toFixed(1)}/10</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      <strong>Recommandations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analytics.recommendedAction.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Prédictions & Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Volume Projeté (Semaine Prochaine)
                  </h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatVolume(volumeMetrics.projectedVolume)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Basé sur la tendance actuelle
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${getRecoveryColor(volumeMetrics.recoveryRecommendation).replace('bg-', 'bg-opacity-10 bg-')}`}>
                  <h4 className="font-medium mb-2">
                    Recommandation Récupération
                  </h4>
                  <div className="text-lg font-bold capitalize">
                    {volumeMetrics.recoveryRecommendation}
                  </div>
                  <div className="text-sm mt-1">
                    Niveau de fatigue: {Math.round(volumeMetrics.fatigueIndex * 10)}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Stratégie d'Entraînement Suggérée</h4>
                
                {volumeMetrics.adaptationPhase === 'accumulation' && (
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Phase d'Accumulation</h5>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                      <li>Augmentez progressivement le volume</li>
                      <li>Maintenez l'intensité modérée (70-80%)</li>
                      <li>Focus sur la technique et la consistance</li>
                    </ul>
                  </div>
                )}

                {volumeMetrics.adaptationPhase === 'intensification' && (
                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Phase d'Intensification</h5>
                    <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                      <li>Réduisez le volume, augmentez l'intensité</li>
                      <li>Travail en force (85-95%)</li>
                      <li>Repos plus longs entre séries</li>
                    </ul>
                  </div>
                )}

                {volumeMetrics.adaptationPhase === 'deload' && (
                  <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Semaine de Décharge</h5>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                      <li>Réduisez volume et intensité de 40-60%</li>
                      <li>Focus sur la mobilité et récupération</li>
                      <li>Préparez le prochain cycle</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolumeAnalyticsEngine;