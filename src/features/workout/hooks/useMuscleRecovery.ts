import React, { useState, useEffect, useCallback } from 'react';
import { appStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/shared/hooks/use-toast';
import type {
  MuscleRecoveryData,
  UserRecoveryProfile,
  RecoveryRecommendation,
  GlobalRecoveryMetrics,
  MuscleGroup,
  RecoveryStatus,
} from '@/features/workout/types/muscleRecovery';

// Fonctions utilitaires
const getRecoveryStatus = (percentage: number): RecoveryStatus => {
  if (percentage >= 90) return 'fully_recovered';
  if (percentage >= 70) return 'mostly_recovered';
  if (percentage >= 50) return 'partially_recovered';
  if (percentage >= 30) return 'needs_recovery';
  return 'overworked';
};

const getOptimalWorkoutTypeFromMetrics = (averageRecovery: number, readyMusclesCount: number): string => {
  if (averageRecovery < 40) return 'rest';
  if (averageRecovery < 60) return 'light_cardio';
  if (readyMusclesCount >= 6) return 'full_body';
  if (readyMusclesCount >= 4) return 'upper_lower_split';
  if (readyMusclesCount >= 2) return 'targeted_training';
  return 'active_recovery';
};

const generateRecoveryRecommendations = (
  recoveryData: MuscleRecoveryData[], 
  globalMetrics: GlobalRecoveryMetrics
): RecoveryRecommendation[] => {
  const recommendations: RecoveryRecommendation[] = [];
  
  // Recommendations pour les muscles fatigués
  recoveryData.forEach(muscle => {
    if (muscle.recovery_percentage < 50) {
      recommendations.push({
        muscle_group: muscle.muscle_group,
        recommendation_type: 'rest',
        priority: muscle.recovery_percentage < 30 ? 'critical' : 'high',
        message: `${muscle.muscle_group} nécessite plus de récupération (${muscle.recovery_percentage}%)`,
        estimated_benefit: 100 - muscle.recovery_percentage,
        specific_actions: ['Repos complet', 'Étirements légers', 'Massage'],
      });
    }
  });

  // Recommendation globale
  if (globalMetrics.overall_recovery_score < 60) {
    recommendations.push({
      muscle_group: 'core', // Fallback
      recommendation_type: 'sleep',
      priority: 'high',
      message: 'Récupération globale faible. Privilégiez le sommeil et la nutrition.',
      estimated_benefit: 40,
      specific_actions: ['8h+ de sommeil', 'Hydratation', 'Protéines de qualité'],
    });
  }

  return recommendations;
};

interface UseMuscleRecoveryReturn {
  // État
  muscleRecoveryData: MuscleRecoveryData[];
  recoveryProfile: UserRecoveryProfile | undefined;
  recommendations: RecoveryRecommendation[];
  globalMetrics: GlobalRecoveryMetrics | undefined;
  isLoading: boolean;
  error: string | undefined;
  lastUpdated: string | undefined;

  // Actions
  refreshRecoveryData: () => Promise<void>;
  updateRecoveryProfile: () => Promise<void>;
  getMuscleRecovery: (muscleGroup: MuscleGroup) => MuscleRecoveryData | undefined;
  getRecoveryScore: () => number;
  isReadyForWorkout: (muscleGroups: MuscleGroup[]) => boolean;
  getOptimalWorkoutType: () => string;

  // Utilitaires
  formatRecoveryStatus: (status: string) => string;
  getRecoveryColor: (percentage: number) => string;
  getNextWorkoutRecommendation: () => string;
}

export const useMuscleRecovery = (): UseMuscleRecoveryReturn => {
  const { appStoreUser } = appStore();
  const { toast } = useToast();

  // État local
  const [muscleRecoveryData, setMuscleRecoveryData] = useState<MuscleRecoveryData[]>([]);
  const [recoveryProfile, setRecoveryProfile] = useState<UserRecoveryProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecoveryRecommendation[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalRecoveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fonction pour rafraîchir toutes les données de récupération
  const refreshRecoveryData = useCallback(async () => {
    if (!appStoreUser?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Récupérer l'historique des entraînements des 7 derniers jours
      const { data: workoutHistory, error: workoutError } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_exercises(
            exercise_id,
            sets,
            exercises(muscle_groups)
          )
        `)
        .eq('user_id', appStoreUser.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .eq('status', 'completed');

      if (workoutError) throw workoutError;

      // 2. Calculer la récupération par groupe musculaire
      const muscleRecoveryMap = new Map<MuscleGroup, MuscleRecoveryData>();
      const now = Date.now();

      // Initialiser tous les groupes musculaires
      const allMuscleGroups: MuscleGroup[] = [
        'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'core'
      ];

      allMuscleGroups.forEach(muscle => {
        muscleRecoveryMap.set(muscle, {
          muscle_group: muscle,
          last_workout_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48h ago par défaut
          workout_intensity: 'light',
          workout_volume: 0,
          workout_duration_minutes: 0,
          recovery_status: 'fully_recovered',
          recovery_percentage: 100,
          estimated_full_recovery: new Date().toISOString(),
          fatigue_level: 1,
          soreness_level: 1,
          readiness_score: 100,
          last_updated: new Date().toISOString(),
        });
      });

      // 3. Analyser chaque session d'entraînement
      workoutHistory?.forEach(session => {
        session.workout_exercises?.forEach((exercise: any) => {
          const muscleGroups = exercise.exercises?.muscle_groups || [];
          const sessionDate = new Date(session.created_at).getTime();
          const hoursAgo = (now - sessionDate) / (1000 * 60 * 60);

          muscleGroups.forEach((muscleGroup: MuscleGroup) => {
            const current = muscleRecoveryMap.get(muscleGroup);
            if (!current) return;

            // Calculer le pourcentage de récupération basé sur le temps écoulé
            // Récupération complète en 48-72h selon l'intensité
            const recoveryTimeHours = 48; // Base: 48h pour récupération complète
            const recoveryPercentage = Math.min(100, (hoursAgo / recoveryTimeHours) * 100);

            // Mettre à jour si c'est l'entraînement le plus récent pour ce muscle
            if (!current.last_workout_date || sessionDate > new Date(current.last_workout_date).getTime()) {
              const estimatedRecoveryDate = new Date(sessionDate + recoveryTimeHours * 60 * 60 * 1000);
              
              muscleRecoveryMap.set(muscleGroup, {
                ...current,
                recovery_percentage: Math.round(recoveryPercentage),
                recovery_status: getRecoveryStatus(recoveryPercentage),
                last_workout_date: session.created_at,
                estimated_full_recovery: estimatedRecoveryDate.toISOString(),
                last_updated: new Date().toISOString(),
              });
            }
          });
        });
      });

      // 4. Convertir en array et calculer les métriques globales
      const recoveryData = Array.from(muscleRecoveryMap.values());
      setMuscleRecoveryData(recoveryData);

      // 5. Calculer les métriques globales
      const averageRecovery = recoveryData.reduce((sum, data) => sum + data.recovery_percentage, 0) / recoveryData.length;
      const readyMuscles = recoveryData.filter(data => data.recovery_percentage > 70).map(data => data.muscle_group);
      const needsRecovery = recoveryData.filter(data => data.recovery_percentage < 50).map(data => data.muscle_group);

      const globalMetrics: GlobalRecoveryMetrics = {
        overall_recovery_score: Math.round(averageRecovery),
        most_recovered_muscle: recoveryData.reduce((max, current) => 
          current.recovery_percentage > max.recovery_percentage ? current : max
        ).muscle_group,
        least_recovered_muscle: recoveryData.reduce((min, current) => 
          current.recovery_percentage < min.recovery_percentage ? current : min
        ).muscle_group,
        ready_for_training: readyMuscles,
        needs_rest: needsRecovery,
        optimal_workout_type: getOptimalWorkoutTypeFromMetrics(averageRecovery, readyMuscles.length),
        recovery_trend: 'stable', // TODO: Calculer basé sur l'historique
        last_calculated: new Date().toISOString(),
      };

      setGlobalMetrics(globalMetrics);

      // 6. Générer des recommandations
      const recommendations = generateRecoveryRecommendations(recoveryData, globalMetrics);
      setRecommendations(recommendations);

      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors du calcul de récupération';
      setError(errorMessage);
      console.error('Error refreshing recovery data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [appStoreUser?.id]);

  // Fonction pour mettre à jour le profil de récupération
  const updateRecoveryProfile = useCallback(async () => {
    if (!appStoreUser?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Calculer les facteurs de récupération basés sur les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', appStoreUser.id)
        .single();

      if (userError) throw userError;

      // 2. Calculer les facteurs de récupération
      const age = userData?.age || 25;
      const fitnessLevel = userData?.fitness_level || 'intermediate';
      
      const ageFactor = age < 25 ? 1.2 : age < 35 ? 1.0 : age < 45 ? 0.9 : 0.8;
      const fitnessLevelFactor = fitnessLevel === 'beginner' ? 0.8 : 
                                fitnessLevel === 'intermediate' ? 1.0 : 1.2;

      // 3. Récupérer les données de sommeil, nutrition, stress récentes
      const { data: healthData } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', appStoreUser.id)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false })
        .limit(7);

      // 4. Calculer les moyennes des 7 derniers jours
      const avgSleepQuality = healthData?.reduce((sum, day) => sum + (day.sleep_quality || 7), 0) / 7 || 7;
      const avgStressLevel = healthData?.reduce((sum, day) => sum + (day.stress_level || 5), 0) / 7 || 5;
      const avgHydration = healthData?.reduce((sum, day) => sum + (day.hydration_liters || 2.5), 0) / 7 || 2.5;

      // 5. Convertir en facteurs multiplicateurs
      const sleepQualityImpact = Math.max(0.5, Math.min(1.5, avgSleepQuality / 8));
      const stressLevelImpact = Math.max(0.5, Math.min(1.5, (10 - avgStressLevel) / 10));
      const hydrationImpact = Math.max(0.5, Math.min(1.5, avgHydration / 3));

      // 6. Récupérer l'historique des blessures
      const { data: injuryHistory } = await supabase
        .from('injury_history')
        .select('affected_muscle_groups')
        .eq('user_id', appStoreUser.id)
        .eq('is_active', true);

      const injuredMuscles = injuryHistory?.flatMap(injury => 
        injury.affected_muscle_groups || []
      ) || [];

      // 7. Créer ou mettre à jour le profil de récupération
      const recoveryProfile: UserRecoveryProfile = {
        user_id: appStoreUser.id,
        recovery_rate_multiplier: ageFactor * fitnessLevelFactor,
        sleep_quality_impact: sleepQualityImpact,
        nutrition_quality_impact: 1.0, // TODO: Implémenter le tracking nutrition
        stress_level_impact: stressLevelImpact,
        hydration_impact: hydrationImpact,
        age_factor: ageFactor,
        fitness_level_factor: fitnessLevelFactor,
        injury_history: injuredMuscles as MuscleGroup[],
        supplements: userData?.supplements || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 8. Sauvegarder en base
      const { error: saveError } = await supabase
        .from('user_recovery_profiles')
        .upsert(recoveryProfile);

      if (saveError) throw saveError;

      // 9. Mettre à jour le state local
      setRecoveryProfile(recoveryProfile);
      
      toast({
        title: "Profil de récupération mis à jour",
        description: "Vos données de récupération ont été recalculées",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      console.error('Error updating recovery profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [appStoreUser?.id]);

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    if (appStoreUser?.id) {
      refreshRecoveryData();
    }
  }, [appStoreUser?.id, refreshRecoveryData]);

  // Fonctions utilitaires
  const getMuscleRecovery = useCallback(
    (muscleGroup: MuscleGroup): MuscleRecoveryData | undefined => {
      return muscleRecoveryData.find(data => data.muscle_group === muscleGroup) || undefined;
    },
    [muscleRecoveryData]
  );

  const getRecoveryScore = useCallback((): number => {
    return globalMetrics?.overall_recovery_score || 0;
  }, [globalMetrics]);

  const isReadyForWorkout = useCallback(
    (muscleGroups: MuscleGroup[]): boolean => {
      return muscleGroups.every(muscle => {
        const recovery = getMuscleRecovery(muscle);
        return recovery ? recovery.recovery_percentage > 70 : false;
      });
    },
    [getMuscleRecovery]
  );

  const getOptimalWorkoutType = useCallback((): string => {
    return globalMetrics?.optimal_workout_type || 'rest';
  }, [globalMetrics]);

  const formatRecoveryStatus = useCallback((status: string): string => {
    const statusMap = {
      fully_recovered: 'Complètement récupéré',
      mostly_recovered: 'Bien récupéré',
      partially_recovered: 'Partiellement récupéré',
      needs_recovery: 'Besoin de récupération',
      overworked: 'Surmené',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }, []);

  const getRecoveryColor = useCallback((percentage: number): string => {
    if (percentage >= 90) return '#10B981'; // Vert
    if (percentage >= 70) return '#F59E0B'; // Orange
    if (percentage >= 50) return '#EF4444'; // Rouge
    return '#DC2626'; // Rouge foncé
  }, []);

  const getNextWorkoutRecommendation = useCallback((): string => {
    if (!globalMetrics) return 'Données en cours de calcul...';

    const readyMuscles = globalMetrics.ready_for_training.length;
    const overallScore = globalMetrics.overall_recovery_score;

    if (overallScore < 40) {
      return 'Repos complet recommandé. Concentrez-vous sur la récupération.';
    } else if (overallScore < 60) {
      return 'Entraînement léger uniquement. Cardio doux ou étirements.';
    } else if (readyMuscles >= 6) {
      return 'Vous pouvez faire un entraînement complet du corps.';
    } else if (readyMuscles >= 4) {
      return 'Entraînement en split (haut/bas du corps) recommandé.';
    } else if (readyMuscles >= 2) {
      return `Entraînement ciblé sur: ${globalMetrics.ready_for_training.join(', ')}`;
    } else {
      return 'Récupération active recommandée (marche, étirements).';
    }
  }, [globalMetrics]);

  return {
    // État
    muscleRecoveryData,
    recoveryProfile: recoveryProfile || undefined,
    recommendations,
    globalMetrics: globalMetrics || undefined,
    isLoading,
    error: error || undefined,
    lastUpdated: lastUpdated || undefined,

    // Actions
    refreshRecoveryData,
    updateRecoveryProfile,
    getMuscleRecovery,
    getRecoveryScore,
    isReadyForWorkout,
    getOptimalWorkoutType,

    // Utilitaires
    formatRecoveryStatus,
    getRecoveryColor,
    getNextWorkoutRecommendation,
  };
};
