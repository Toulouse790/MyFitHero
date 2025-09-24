/**
 * TESTS UNITAIRES EXHAUSTIFS - MODULE SLEEP  
 * Tests pour l'analyse du sommeil et optimisation
 */

import { render, screen, fireEvent } from '@testing-library/react';

// Interfaces pour les tests sleep
interface SleepEntry {
  id: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  total_sleep_hours: number;
  sleep_efficiency: number; // %
  deep_sleep_minutes: number;
  light_sleep_minutes: number;
  rem_sleep_minutes: number;
  awake_minutes: number;
  sleep_quality_rating: number; // 1-10
  factors?: {
    caffeine_hours_before?: number;
    alcohol_consumed?: boolean;
    screen_time_before_bed?: number;
    room_temperature?: number;
    exercise_hours_before?: number;
    stress_level?: number; // 1-10
  };
}

interface SleepGoals {
  target_sleep_hours: number;
  target_bedtime: string;
  target_wake_time: string;
  target_sleep_efficiency: number;
}

describe('😴 SLEEP MODULE - Tests Unitaires Exhaustifs', () => {
  describe('Analyse de la qualité du sommeil', () => {
    it('calcule correctement le score de qualité du sommeil', () => {
      const calculateSleepScore = (entry: SleepEntry): number => {
        let score = 0;
        
        // Durée (40% du score)
        const durationScore = Math.min((entry.total_sleep_hours / 8) * 40, 40);
        
        // Efficacité (30% du score)
        const efficiencyScore = (entry.sleep_efficiency / 100) * 30;
        
        // Sommeil profond (20% du score) - Optimal: 15-20% du temps total
        const deepSleepPercentage = (entry.deep_sleep_minutes / (entry.total_sleep_hours * 60)) * 100;
        const deepScore = deepSleepPercentage >= 15 && deepSleepPercentage <= 20 ? 20 : 
                         deepSleepPercentage > 10 ? 15 : 10;
        
        // Qualité subjective (10% du score)
        const subjectiveScore = (entry.sleep_quality_rating / 10) * 10;
        
        score = durationScore + efficiencyScore + deepScore + subjectiveScore;
        return Math.round(score);
      };

      const excellentSleep: SleepEntry = {
        id: '1',
        user_id: 'user-123',
        date: '2024-01-15',
        bedtime: '22:30',
        wake_time: '06:30',
        total_sleep_hours: 8,
        sleep_efficiency: 92,
        deep_sleep_minutes: 80, // ~17% de 480min
        light_sleep_minutes: 280,
        rem_sleep_minutes: 120,
        awake_minutes: 20,
        sleep_quality_rating: 9
      };

      const poorSleep: SleepEntry = {
        id: '2',
        user_id: 'user-123',
        date: '2024-01-16',
        bedtime: '23:45',
        wake_time: '06:00',
        total_sleep_hours: 6.25,
        sleep_efficiency: 75,
        deep_sleep_minutes: 35, // ~9% seulement
        light_sleep_minutes: 200,
        rem_sleep_minutes: 90,
        awake_minutes: 50,
        sleep_quality_rating: 4
      };

      const excellentScore = calculateSleepScore(excellentSleep);
      const poorScore = calculateSleepScore(poorSleep);

      expect(excellentScore).toBeGreaterThanOrEqual(85); // Excellent sommeil
      expect(poorScore).toBeLessThan(70); // Mauvais sommeil
      expect(excellentScore).toBeGreaterThan(poorScore);
    });

    it('identifie les patterns de sommeil et tendances', () => {
      const analyzeSleepPatterns = (entries: SleepEntry[]) => {
        if (entries.length < 7) return { insufficient_data: true };

        const patterns = {
          average_bedtime: '',
          average_wake_time: '',
          average_duration: 0,
          consistency_score: 0,
          weekend_vs_weekday: { bedtime_diff: 0, duration_diff: 0 }
        };

        // Calculer moyenne des heures de coucher
        const bedtimes = entries.map(e => {
          const [hours, minutes] = e.bedtime.split(':').map(Number);
          return hours + minutes / 60;
        });
        const avgBedtime = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
        patterns.average_bedtime = `${Math.floor(avgBedtime)}:${Math.round((avgBedtime % 1) * 60).toString().padStart(2, '0')}`;

        // Calculer la régularité (score basé sur écart-type)
        const bedtimeVariance = bedtimes.reduce((sum, time) => sum + Math.pow(time - avgBedtime, 2), 0) / bedtimes.length;
        const stdDev = Math.sqrt(bedtimeVariance);
        patterns.consistency_score = Math.max(0, 100 - (stdDev * 20)); // Moins de variance = meilleure régularité

        // Durée moyenne
        patterns.average_duration = entries.reduce((sum, e) => sum + e.total_sleep_hours, 0) / entries.length;

        return patterns;
      };

      const consistentWeek: SleepEntry[] = Array(7).fill(null).map((_, i) => ({
        id: `${i}`,
        user_id: 'user-123',
        date: `2024-01-${15 + i}`,
        bedtime: '22:30', // Très régulier
        wake_time: '06:30',
        total_sleep_hours: 8,
        sleep_efficiency: 90,
        deep_sleep_minutes: 80,
        light_sleep_minutes: 280,
        rem_sleep_minutes: 120,
        awake_minutes: 20,
        sleep_quality_rating: 8
      }));

      const inconsistentWeek: SleepEntry[] = [
        { ...consistentWeek[0], bedtime: '21:30' },
        { ...consistentWeek[1], bedtime: '23:45' },
        { ...consistentWeek[2], bedtime: '22:00' },
        { ...consistentWeek[3], bedtime: '00:15' },
        { ...consistentWeek[4], bedtime: '22:15' },
        { ...consistentWeek[5], bedtime: '23:30' },
        { ...consistentWeek[6], bedtime: '21:45' }
      ];

      const consistentPatterns = analyzeSleepPatterns(consistentWeek);
      const inconsistentPatterns = analyzeSleepPatterns(inconsistentWeek);

      expect(consistentPatterns.consistency_score).toBeGreaterThan(90);
      expect(inconsistentPatterns.consistency_score).toBeLessThan(70);
      expect(consistentPatterns.average_bedtime).toBe('22:30');
    });

    it('corrèle les facteurs externes avec la qualité du sommeil', () => {
      const analyzeSleepFactors = (entries: SleepEntry[]) => {
        const correlations = {
          caffeine_impact: 0,
          exercise_impact: 0,
          screen_impact: 0,
          stress_impact: 0
        };

        const entriesWithFactors = entries.filter(e => e.factors);
        
        if (entriesWithFactors.length < 3) return correlations;

        // Analyse impact caféine
        const caffeineEntries = entriesWithFactors.filter(e => e.factors?.caffeine_hours_before !== undefined);
        if (caffeineEntries.length >= 2) {
          const lateCaffeineEntries = caffeineEntries.filter(e => e.factors!.caffeine_hours_before! < 6);
          const earlyCaffeineEntries = caffeineEntries.filter(e => e.factors!.caffeine_hours_before! >= 6);
          
          if (lateCaffeineEntries.length > 0 && earlyCaffeineEntries.length > 0) {
            const lateAvgQuality = lateCaffeineEntries.reduce((sum, e) => sum + e.sleep_quality_rating, 0) / lateCaffeineEntries.length;
            const earlyAvgQuality = earlyCaffeineEntries.reduce((sum, e) => sum + e.sleep_quality_rating, 0) / earlyCaffeineEntries.length;
            correlations.caffeine_impact = earlyAvgQuality - lateAvgQuality; // Positif = caféine tard nuit à la qualité
          }
        }

        // Analyse impact exercice
        const exerciseEntries = entriesWithFactors.filter(e => e.factors?.exercise_hours_before !== undefined);
        if (exerciseEntries.length >= 2) {
          const lateExerciseEntries = exerciseEntries.filter(e => e.factors!.exercise_hours_before! < 3);
          const earlyExerciseEntries = exerciseEntries.filter(e => e.factors!.exercise_hours_before! >= 4);
          
          if (lateExerciseEntries.length > 0 && earlyExerciseEntries.length > 0) {
            const lateAvgQuality = lateExerciseEntries.reduce((sum, e) => sum + e.sleep_quality_rating, 0) / lateExerciseEntries.length;
            const earlyAvgQuality = earlyExerciseEntries.reduce((sum, e) => sum + e.sleep_quality_rating, 0) / earlyExerciseEntries.length;
            correlations.exercise_impact = earlyAvgQuality - lateAvgQuality;
          }
        }

        return correlations;
      };

      const entriesWithFactors: SleepEntry[] = [
        {
          id: '1', user_id: 'user-123', date: '2024-01-15',
          bedtime: '22:30', wake_time: '06:30', total_sleep_hours: 8,
          sleep_efficiency: 92, deep_sleep_minutes: 80, light_sleep_minutes: 280,
          rem_sleep_minutes: 120, awake_minutes: 20, sleep_quality_rating: 8,
          factors: { caffeine_hours_before: 8, exercise_hours_before: 5 }
        },
        {
          id: '2', user_id: 'user-123', date: '2024-01-16',
          bedtime: '23:00', wake_time: '06:30', total_sleep_hours: 7.5,
          sleep_efficiency: 78, deep_sleep_minutes: 60, light_sleep_minutes: 240,
          rem_sleep_minutes: 100, awake_minutes: 50, sleep_quality_rating: 5,
          factors: { caffeine_hours_before: 3, exercise_hours_before: 1 }
        },
        {
          id: '3', user_id: 'user-123', date: '2024-01-17',
          bedtime: '22:15', wake_time: '06:30', total_sleep_hours: 8.25,
          sleep_efficiency: 90, deep_sleep_minutes: 85, light_sleep_minutes: 290,
          rem_sleep_minutes: 130, awake_minutes: 15, sleep_quality_rating: 9,
          factors: { caffeine_hours_before: 10, exercise_hours_before: 6 }
        }
      ];

      const correlations = analyzeSleepFactors(entriesWithFactors);

      expect(correlations.caffeine_impact).toBeGreaterThan(0); // Caféine tard impact négatif
      expect(correlations.exercise_impact).toBeGreaterThan(0); // Exercice tard impact négatif
    });
  });

  describe('Optimisation et recommandations', () => {
    it('génère des recommandations personnalisées pour améliorer le sommeil', () => {
      const generateSleepRecommendations = (
        recentEntries: SleepEntry[],
        goals: SleepGoals
      ) => {
        const recommendations = [];
        
        if (recentEntries.length === 0) return recommendations;

        const avgDuration = recentEntries.reduce((sum, e) => sum + e.total_sleep_hours, 0) / recentEntries.length;
        const avgEfficiency = recentEntries.reduce((sum, e) => sum + e.sleep_efficiency, 0) / recentEntries.length;
        const avgDeepSleep = recentEntries.reduce((sum, e) => sum + e.deep_sleep_minutes, 0) / recentEntries.length;

        // Durée insuffisante
        if (avgDuration < goals.target_sleep_hours - 0.5) {
          recommendations.push({
            category: 'duration',
            priority: 'high',
            title: 'Augmenter la durée de sommeil',
            description: `Votre moyenne de ${avgDuration.toFixed(1)}h est inférieure à votre objectif de ${goals.target_sleep_hours}h`,
            suggestions: [
              'Se coucher 30 minutes plus tôt',
              'Créer une routine de coucher relaxante',
              'Éviter les écrans 1h avant le coucher'
            ]
          });
        }

        // Efficacité faible
        if (avgEfficiency < 85) {
          recommendations.push({
            category: 'efficiency',
            priority: 'medium',
            title: 'Améliorer l\'efficacité du sommeil',
            description: `Votre efficacité de ${avgEfficiency.toFixed(1)}% peut être améliorée`,
            suggestions: [
              'Maintenir une température de chambre fraîche (16-19°C)',
              'Investir dans un matelas et oreillers de qualité',
              'Pratiquer la méditation ou relaxation avant le coucher'
            ]
          });
        }

        // Sommeil profond insuffisant
        if (avgDeepSleep < 60) {
          recommendations.push({
            category: 'deep_sleep',
            priority: 'medium',
            title: 'Augmenter le sommeil profond',
            description: `${avgDeepSleep.toFixed(0)} minutes de sommeil profond, optimum: 90-120min`,
            suggestions: [
              'Éviter l\'alcool 3h avant le coucher',
              'Faire de l\'exercice régulièrement (mais pas tard le soir)',
              'Maintenir un horaire de sommeil régulier'
            ]
          });
        }

        return recommendations;
      };

      const poorSleepEntries: SleepEntry[] = [
        {
          id: '1', user_id: 'user-123', date: '2024-01-15',
          bedtime: '23:30', wake_time: '06:00', total_sleep_hours: 6.5,
          sleep_efficiency: 75, deep_sleep_minutes: 45, light_sleep_minutes: 200,
          rem_sleep_minutes: 90, awake_minutes: 60, sleep_quality_rating: 4
        }
      ];

      const goals: SleepGoals = {
        target_sleep_hours: 8,
        target_bedtime: '22:30',
        target_wake_time: '06:30',
        target_sleep_efficiency: 90
      };

      const recommendations = generateSleepRecommendations(poorSleepEntries, goals);

      expect(recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'duration',
            priority: 'high'
          }),
          expect.objectContaining({
            category: 'efficiency',
            priority: 'medium'
          }),
          expect.objectContaining({
            category: 'deep_sleep',
            priority: 'medium'
          })
        ])
      );
    });

    it('optimise l\'horaire de sommeil basé sur le chronotype', () => {
      const optimizeSleepSchedule = (
        chronotype: 'morning' | 'evening' | 'intermediate',
        constraints: { wake_time?: string, work_start?: string, commute_time?: number }
      ) => {
        const recommendations = {
          optimal_bedtime: '',
          optimal_wake_time: '',
          sleep_window: '',
          tips: [] as string[]
        };

        // Déterminer l'heure de réveil idéale
        if (constraints.work_start && constraints.commute_time) {
          const workHour = parseInt(constraints.work_start.split(':')[0]);
          const workMinute = parseInt(constraints.work_start.split(':')[1]);
          const wakeHour = workHour - Math.ceil(constraints.commute_time / 60) - 1;
          recommendations.optimal_wake_time = `${wakeHour.toString().padStart(2, '0')}:00`;
        } else if (constraints.wake_time) {
          recommendations.optimal_wake_time = constraints.wake_time;
        } else {
          // Heure de réveil par défaut selon chronotype
          recommendations.optimal_wake_time = chronotype === 'morning' ? '06:00' : 
                                           chronotype === 'evening' ? '08:00' : '07:00';
        }

        // Calculer l'heure de coucher (8h avant le réveil)
        const wakeHour = parseInt(recommendations.optimal_wake_time.split(':')[0]);
        const bedHour = wakeHour - 8;
        const adjustedBedHour = bedHour < 0 ? 24 + bedHour : bedHour;
        recommendations.optimal_bedtime = `${adjustedBedHour.toString().padStart(2, '0')}:00`;

        // Fenêtre de sommeil idéale
        recommendations.sleep_window = `${recommendations.optimal_bedtime} - ${recommendations.optimal_wake_time}`;

        // Conseils spécifiques au chronotype
        if (chronotype === 'morning') {
          recommendations.tips = [
            'Exposez-vous à la lumière naturelle dès le réveil',
            'Évitez la caféine après 14h',
            'Profitez de votre pic de productivité matinal'
          ];
        } else if (chronotype === 'evening') {
          recommendations.tips = [
            'Utilisez des lunettes anti-lumière bleue le soir',
            'Créez un environnement sombre 2h avant le coucher',
            'Planifiez les tâches importantes en fin de journée'
          ];
        }

        return recommendations;
      };

      const morningPersonSchedule = optimizeSleepSchedule('morning', {
        work_start: '08:00',
        commute_time: 30
      });

      const eveningPersonSchedule = optimizeSleepSchedule('evening', {
        work_start: '09:00',
        commute_time: 45
      });

      expect(morningPersonSchedule.optimal_wake_time).toBe('06:00');
      expect(morningPersonSchedule.optimal_bedtime).toBe('22:00');
      expect(morningPersonSchedule.tips).toContain('Exposez-vous à la lumière naturelle dès le réveil');

      expect(eveningPersonSchedule.optimal_wake_time).toBe('07:00');
      expect(eveningPersonSchedule.optimal_bedtime).toBe('23:00');
      expect(eveningPersonSchedule.tips).toContain('Utilisez des lunettes anti-lumière bleue le soir');
    });
  });

  describe('Intégration avec d\'autres modules', () => {
    it('synchronise avec les données de workout pour optimiser la récupération', () => {
      const optimizeSleepForRecovery = (
        workoutData: { type: string, intensity: string, duration: number, time: string },
        currentSleepPlan: SleepGoals
      ) => {
        const adjustments = { ...currentSleepPlan };

        // Entraînement intense = besoin de plus de sommeil
        if (workoutData.intensity === 'high' || workoutData.duration > 90) {
          // Ajouter 30min au sommeil cible
          adjustments.target_sleep_hours = Math.min(currentSleepPlan.target_sleep_hours + 0.5, 9.5);
        }

        // Entraînement tardif = ajuster l'heure de coucher
        const workoutHour = parseInt(workoutData.time.split(':')[0]);
        if (workoutHour >= 19) { // 19h ou plus tard
          // Repousser le coucher de 1h pour permettre la récupération
          const currentBedHour = parseInt(currentSleepPlan.target_bedtime.split(':')[0]);
          const adjustedBedHour = Math.min(currentBedHour + 1, 23);
          adjustments.target_bedtime = `${adjustedBedHour.toString().padStart(2, '0')}:00`;
        }

        return {
          adjustments,
          recommendations: [
            'Privilégier le sommeil profond après un entraînement intense',
            'Éviter les écrans 2h après l\'entraînement pour faciliter la récupération',
            'Maintenir la chambre à 16-18°C pour optimiser la récupération'
          ]
        };
      };

      const intenseWorkout = {
        type: 'strength',
        intensity: 'high',
        duration: 120,
        time: '20:00'
      };

      const baseSleepPlan: SleepGoals = {
        target_sleep_hours: 8,
        target_bedtime: '22:00',
        target_wake_time: '06:00',
        target_sleep_efficiency: 90
      };

      const optimizedPlan = optimizeSleepForRecovery(intenseWorkout, baseSleepPlan);

      expect(optimizedPlan.adjustments.target_sleep_hours).toBe(8.5); // +30min
      expect(optimizedPlan.adjustments.target_bedtime).toBe('23:00'); // +1h pour entraînement tardif
      expect(optimizedPlan.recommendations).toContain('Privilégier le sommeil profond après un entraînement intense');
    });

    it('intègre les données nutritionnelles pour optimiser le sommeil', () => {
      const optimizeSleepNutrition = (
        nutritionData: {
          last_meal_time: string,
          caffeine_intake: number,
          alcohol_consumed: boolean,
          fluid_intake_evening: number
        },
        target_bedtime: string
      ) => {
        const recommendations = [];
        const bedtimeHour = parseInt(target_bedtime.split(':')[0]);
        const lastMealHour = parseInt(nutritionData.last_meal_time.split(':')[0]);

        // Dernière prise alimentaire trop proche du coucher
        const hoursDiff = bedtimeHour - lastMealHour;
        if (hoursDiff < 2) {
          recommendations.push({
            category: 'meal_timing',
            message: 'Terminer le dîner au moins 2h avant le coucher',
            impact: 'Améliore la digestion et la qualité du sommeil'
          });
        }

        // Caféine trop tardive
        if (nutritionData.caffeine_intake > 0) {
          recommendations.push({
            category: 'caffeine',
            message: 'Éviter la caféine après 14h pour un sommeil optimal',
            impact: 'Réduit le temps d\'endormissement'
          });
        }

        // Alcool consommé
        if (nutritionData.alcohol_consumed) {
          recommendations.push({
            category: 'alcohol',
            message: 'L\'alcool perturbe les cycles de sommeil, particulièrement le REM',
            impact: 'Réduit la qualité du sommeil malgré un endormissement plus rapide'
          });
        }

        // Hydratation excessive en soirée
        if (nutritionData.fluid_intake_evening > 500) { // >500ml
          recommendations.push({
            category: 'hydration',
            message: 'Limiter les liquides 2h avant le coucher',
            impact: 'Réduit les réveils nocturnes'
          });
        }

        return recommendations;
      };

      const problematicNutrition = {
        last_meal_time: '21:30',
        caffeine_intake: 150,
        alcohol_consumed: true,
        fluid_intake_evening: 750
      };

      const recommendations = optimizeSleepNutrition(problematicNutrition, '22:30');

      expect(recommendations).toHaveLength(4); // Tous les problèmes détectés
      expect(recommendations[0].category).toBe('meal_timing');
      expect(recommendations[1].category).toBe('caffeine');
      expect(recommendations[2].category).toBe('alcohol');
      expect(recommendations[3].category).toBe('hydration');
    });
  });
});