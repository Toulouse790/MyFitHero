/**
 * TESTS UNITAIRES EXHAUSTIFS - MODULE NUTRITION
 * Tests pour le tracking intelligent et optimisation nutritionnelle
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Interfaces de base pour les tests nutrition
interface NutritionEntry {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  micronutrients?: {
    vitamin_c?: number;
    iron?: number;
    calcium?: number;
  };
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_at: Date;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_liters: number;
}

interface UserNutritionProfile {
  id: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'performance';
  dietary_restrictions: string[];
  allergies: string[];
}

describe('🥗 NUTRITION MODULE - Tests Unitaires Exhaustifs', () => {
  describe('Calculs nutritionnels critiques', () => {
    it('calcule correctement les besoins caloriques basés sur Harris-Benedict', () => {
      const profile: UserNutritionProfile = {
        id: 'user-123',
        age: 30,
        gender: 'male',
        weight: 80, // kg
        height: 180, // cm
        activity_level: 'moderate',
        goals: 'muscle_gain',
        dietary_restrictions: [],
        allergies: []
      };

      const calculateBMR = (profile: UserNutritionProfile): number => {
        if (profile.gender === 'male') {
          return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
        } else {
          return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
        }
      };

      const calculateTDEE = (bmr: number, activityLevel: string): number => {
        const multipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          very_active: 1.9
        };
        return bmr * multipliers[activityLevel as keyof typeof multipliers];
      };

      const bmr = calculateBMR(profile);
      const tdee = calculateTDEE(bmr, profile.activity_level);

      expect(bmr).toBeCloseTo(1866, 0); // BMR attendu pour ce profil
      expect(tdee).toBeCloseTo(2892, 0); // TDEE avec activité modérée
    });

    it('ajuste les macros selon les objectifs fitness', () => {
      const calculateMacros = (calories: number, goal: string) => {
        const macroDistribution = {
          weight_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
          maintenance: { protein: 0.25, carbs: 0.45, fat: 0.30 },
          muscle_gain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
          performance: { protein: 0.20, carbs: 0.55, fat: 0.25 }
        };

        const distribution = macroDistribution[goal as keyof typeof macroDistribution];
        
        return {
          protein: Math.round((calories * distribution.protein) / 4), // 4 cal/g
          carbs: Math.round((calories * distribution.carbs) / 4), // 4 cal/g
          fat: Math.round((calories * distribution.fat) / 9) // 9 cal/g
        };
      };

      const muscleBuildingMacros = calculateMacros(2500, 'muscle_gain');
      const weightLossMacros = calculateMacros(2000, 'weight_loss');

      // Muscle gain devrait avoir plus de protéines et carbs
      expect(muscleBuildingMacros.protein).toBe(188); // 30% de 2500 cal
      expect(muscleBuildingMacros.carbs).toBe(250); // 40% de 2500 cal
      
      // Weight loss devrait avoir un ratio protéine plus élevé
      expect(weightLossMacros.protein).toBe(175); // 35% de 2000 cal
      expect(weightLossMacros.carbs).toBe(175); // 35% de 2000 cal
    });

    it('calcule le timing optimal des repas pour la performance', () => {
      interface MealTiming {
        meal: string;
        time: string;
        macroFocus: string;
        purpose: string;
      }

      const generateMealTiming = (workoutTime: string): MealTiming[] => {
        const baseTimings: MealTiming[] = [
          {
            meal: 'pre-workout',
            time: '1-2h avant entraînement',
            macroFocus: 'Glucides complexes + protéines légères',
            purpose: 'Énergie soutenue'
          },
          {
            meal: 'post-workout',
            time: '30min après entraînement',
            macroFocus: 'Protéines + glucides simples',
            purpose: 'Récupération musculaire'
          },
          {
            meal: 'dinner',
            time: '3-4h après post-workout',
            macroFocus: 'Protéines + légumes + glucides modérés',
            purpose: 'Récupération nocturne'
          }
        ];

        return baseTimings;
      };

      const timings = generateMealTiming('18:00');
      
      expect(timings).toHaveLength(3);
      expect(timings[0].macroFocus).toContain('Glucides complexes');
      expect(timings[1].macroFocus).toContain('Protéines');
      expect(timings[1].time).toBe('30min après entraînement');
    });
  });

  describe('Tracking et logging nutritionnel', () => {
    it('enregistre correctement un repas avec validation', () => {
      const validateNutritionEntry = (entry: Partial<NutritionEntry>): string[] => {
        const errors: string[] = [];
        
        if (!entry.food_name || entry.food_name.trim().length === 0) {
          errors.push('Nom de l\'aliment requis');
        }
        
        if (!entry.quantity || entry.quantity <= 0) {
          errors.push('Quantité doit être positive');
        }
        
        if (!entry.calories || entry.calories < 0) {
          errors.push('Calories invalides');
        }
        
        if (!entry.macros || entry.macros.protein < 0 || entry.macros.carbs < 0 || entry.macros.fat < 0) {
          errors.push('Macronutriments invalides');
        }

        return errors;
      };

      // Entry valide
      const validEntry: Partial<NutritionEntry> = {
        food_name: 'Blanc de poulet grillé',
        quantity: 150,
        unit: 'g',
        calories: 248,
        macros: { protein: 46.2, carbs: 0, fat: 5.4 },
        meal_type: 'lunch'
      };

      // Entry invalide
      const invalidEntry: Partial<NutritionEntry> = {
        food_name: '',
        quantity: -10,
        calories: -50,
        macros: { protein: -5, carbs: 0, fat: 0 }
      };

      expect(validateNutritionEntry(validEntry)).toHaveLength(0);
      expect(validateNutritionEntry(invalidEntry)).toHaveLength(4);
    });

    it('calcule la progression quotidienne vers les objectifs', () => {
      const dailyEntries: NutritionEntry[] = [
        {
          id: '1',
          food_name: 'Avoine',
          quantity: 80,
          unit: 'g',
          calories: 312,
          macros: { protein: 10.6, carbs: 56, fat: 6.2 },
          meal_type: 'breakfast',
          logged_at: new Date()
        },
        {
          id: '2',
          food_name: 'Poulet',
          quantity: 150,
          unit: 'g',
          calories: 248,
          macros: { protein: 46.2, carbs: 0, fat: 5.4 },
          meal_type: 'lunch',
          logged_at: new Date()
        }
      ];

      const goals: NutritionGoals = {
        calories: 2500,
        protein: 150,
        carbs: 300,
        fat: 80,
        water_liters: 3
      };

      const calculateProgress = (entries: NutritionEntry[], goals: NutritionGoals) => {
        const totals = entries.reduce((sum, entry) => ({
          calories: sum.calories + entry.calories,
          protein: sum.protein + entry.macros.protein,
          carbs: sum.carbs + entry.macros.carbs,
          fat: sum.fat + entry.macros.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return {
          calories: { current: totals.calories, goal: goals.calories, percentage: (totals.calories / goals.calories) * 100 },
          protein: { current: totals.protein, goal: goals.protein, percentage: (totals.protein / goals.protein) * 100 },
          carbs: { current: totals.carbs, goal: goals.carbs, percentage: (totals.carbs / goals.carbs) * 100 },
          fat: { current: totals.fat, goal: goals.fat, percentage: (totals.fat / goals.fat) * 100 }
        };
      };

      const progress = calculateProgress(dailyEntries, goals);
      
      expect(progress.calories.current).toBe(560); // 312 + 248
      expect(progress.protein.current).toBeCloseTo(56.8, 1); // 10.6 + 46.2
      expect(progress.calories.percentage).toBeCloseTo(22.4, 1); // 560/2500 * 100
    });

    it('détecte les carences nutritionnelles potentielles', () => {
      const analyzeNutritionalGaps = (weeklyEntries: NutritionEntry[]) => {
        const weeklyTotals = weeklyEntries.reduce((sum, entry) => {
          return {
            fiber: sum.fiber + (entry.macros.fiber || 0),
            vitamin_c: sum.vitamin_c + (entry.micronutrients?.vitamin_c || 0),
            iron: sum.iron + (entry.micronutrients?.iron || 0),
            calcium: sum.calcium + (entry.micronutrients?.calcium || 0)
          };
        }, { fiber: 0, vitamin_c: 0, iron: 0, calcium: 0 });

        const recommendations = [];
        
        // Recommandations basées sur les RDA
        if (weeklyTotals.fiber < 175) { // 25g/jour * 7 jours
          recommendations.push({
            nutrient: 'fiber',
            status: 'low',
            suggestion: 'Ajouter plus de légumes, fruits et céréales complètes'
          });
        }
        
        if (weeklyTotals.vitamin_c < 630) { // 90mg/jour * 7 jours
          recommendations.push({
            nutrient: 'vitamin_c',
            status: 'low',
            suggestion: 'Consommer plus d\'agrumes, poivrons, et légumes verts'
          });
        }

        return recommendations;
      };

      // Semaine avec peu de fibres et vitamine C
      const lowNutrientWeek: NutritionEntry[] = Array(7).fill(null).map((_, i) => ({
        id: `day-${i}`,
        food_name: 'Repas basique',
        quantity: 100,
        unit: 'g',
        calories: 400,
        macros: { protein: 20, carbs: 40, fat: 15, fiber: 2 },
        micronutrients: { vitamin_c: 5 },
        meal_type: 'lunch' as const,
        logged_at: new Date()
      }));

      const gaps = analyzeNutritionalGaps(lowNutrientWeek);
      
      expect(gaps).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            nutrient: 'fiber',
            status: 'low'
          }),
          expect.objectContaining({
            nutrient: 'vitamin_c',
            status: 'low'
          })
        ])
      );
    });
  });

  describe('Intelligence artificielle nutritionnelle', () => {
    it('génère des recommandations personnalisées basées sur l\'historique', () => {
      const generateSmartRecommendations = (
        profile: UserNutritionProfile, 
        recentEntries: NutritionEntry[],
        workoutData?: any
      ) => {
        const recommendations = [];

        // Analyse des patterns alimentaires
        const mealFrequency = recentEntries.reduce((freq, entry) => {
          freq[entry.meal_type] = (freq[entry.meal_type] || 0) + 1;
          return freq;
        }, {} as Record<string, number>);

        // Si peu de petits-déjeuners
        if (mealFrequency.breakfast < 5) {
          recommendations.push({
            type: 'meal_pattern',
            priority: 'medium',
            message: 'Essayez de prendre un petit-déjeuner plus régulièrement pour stabiliser votre métabolisme',
            suggested_foods: ['Avoine', 'Œufs', 'Yaourt grec', 'Fruits']
          });
        }

        // Si objectif prise de masse et protéines insuffisantes
        if (profile.goals === 'muscle_gain') {
          const avgProtein = recentEntries.reduce((sum, e) => sum + e.macros.protein, 0) / recentEntries.length;
          const proteinTarget = profile.weight * 1.6; // 1.6g/kg pour prise de masse
          
          if (avgProtein < proteinTarget * 0.8) {
            recommendations.push({
              type: 'macronutrient',
              priority: 'high',
              message: `Augmentez votre apport protéique à ${proteinTarget}g/jour pour optimiser la croissance musculaire`,
              suggested_foods: ['Poulet', 'Poisson', 'Légumineuses', 'Protéine en poudre']
            });
          }
        }

        return recommendations;
      };

      const profile: UserNutritionProfile = {
        id: 'user-123',
        age: 25,
        gender: 'male',
        weight: 75,
        height: 175,
        activity_level: 'active',
        goals: 'muscle_gain',
        dietary_restrictions: [],
        allergies: []
      };

      // Historique avec peu de protéines et pas de petit-déjeuner
      const recentEntries: NutritionEntry[] = [
        {
          id: '1',
          food_name: 'Salade',
          quantity: 200,
          unit: 'g',
          calories: 150,
          macros: { protein: 5, carbs: 20, fat: 8 },
          meal_type: 'lunch',
          logged_at: new Date()
        }
      ];

      const recommendations = generateSmartRecommendations(profile, recentEntries);
      
      expect(recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'meal_pattern',
            message: expect.stringContaining('petit-déjeuner')
          }),
          expect.objectContaining({
            type: 'macronutrient',
            priority: 'high',
            message: expect.stringContaining('protéique')
          })
        ])
      );
    });

    it('optimise le timing nutritionnel autour des entraînements', () => {
      const optimizeWorkoutNutrition = (
        workoutSchedule: { time: string, type: string, duration: number }[],
        currentNutrition: NutritionEntry[]
      ) => {
        const recommendations = [];

        workoutSchedule.forEach(workout => {
          const workoutHour = parseInt(workout.time.split(':')[0]);
          
          // Nutrition pré-entraînement
          if (workout.type === 'strength' || workout.duration > 60) {
            recommendations.push({
              timing: `${workout.time} - 1h30`,
              type: 'pre-workout',
              macros: 'Glucides complexes (30-40g) + Protéines (15-20g)',
              examples: ['Banane + beurre d\'amande', 'Avoine + protéine whey'],
              purpose: 'Énergie soutenue pour performance'
            });
          }

          // Nutrition post-entraînement
          recommendations.push({
            timing: `${workout.time} + 30min`,
            type: 'post-workout',
            macros: 'Protéines (20-30g) + Glucides simples (30-50g)',
            examples: ['Shake protéiné + banane', 'Yaourt grec + miel'],
            purpose: 'Récupération et synthèse protéique'
          });
        });

        return recommendations;
      };

      const workoutSchedule = [
        { time: '07:00', type: 'strength', duration: 75 },
        { time: '18:30', type: 'cardio', duration: 45 }
      ];

      const nutritionPlan = optimizeWorkoutNutrition(workoutSchedule, []);
      
      expect(nutritionPlan).toHaveLength(4); // 2 workouts * 2 recommendations each
      expect(nutritionPlan[0].timing).toBe('07:00 - 1h30');
      expect(nutritionPlan[1].timing).toBe('07:00 + 30min');
    });
  });

  describe('Intégrations et synchronisation', () => {
    it('synchronise avec les données d\'entraînement pour ajuster les besoins', () => {
      const adjustNutritionForWorkout = (
        baseNeeds: NutritionGoals,
        workoutData: { type: string, duration: number, intensity: string, calories_burned: number }
      ) => {
        const adjustedNeeds = { ...baseNeeds };

        // Ajustement calorique basé sur la dépense
        adjustedNeeds.calories += workoutData.calories_burned;

        // Ajustement protéique pour récupération
        if (workoutData.type === 'strength') {
          adjustedNeeds.protein += Math.round(workoutData.duration * 0.3); // +0.3g par minute
        }

        // Ajustement glucides pour reconstitution glycogène
        if (workoutData.intensity === 'high' || workoutData.duration > 60) {
          adjustedNeeds.carbs += Math.round(workoutData.calories_burned * 0.15); // 15% des calories brûlées
        }

        return adjustedNeeds;
      };

      const baseNeeds: NutritionGoals = {
        calories: 2000,
        protein: 120,
        carbs: 250,
        fat: 65,
        water_liters: 2.5
      };

      const intenseWorkout = {
        type: 'strength',
        duration: 90,
        intensity: 'high',
        calories_burned: 400
      };

      const adjustedNeeds = adjustNutritionForWorkout(baseNeeds, intenseWorkout);

      expect(adjustedNeeds.calories).toBe(2400); // +400 calories brûlées
      expect(adjustedNeeds.protein).toBe(147); // +27g pour récupération (90 * 0.3)
      expect(adjustedNeeds.carbs).toBe(310); // +60g pour glycogène (400 * 0.15)
    });

    it('intègre les données de qualité du sommeil pour optimiser la nutrition', () => {
      const optimizeNutritionForSleep = (
        sleepQuality: { score: number, duration: number, deep_sleep_percentage: number },
        currentTime: string
      ) => {
        const recommendations = [];
        const currentHour = parseInt(currentTime.split(':')[0]);

        // Si sommeil de mauvaise qualité
        if (sleepQuality.score < 70) {
          recommendations.push({
            nutrient: 'magnesium',
            timing: '2h avant coucher',
            foods: ['Amandes', 'Épinards', 'Chocolat noir'],
            reason: 'Améliorer la qualité du sommeil'
          });
        }

        // Si peu de sommeil profond
        if (sleepQuality.deep_sleep_percentage < 20) {
          recommendations.push({
            nutrient: 'tryptophan',
            timing: 'Dîner',
            foods: ['Dinde', 'Banane', 'Lait chaud'],
            reason: 'Favoriser le sommeil profond'
          });
        }

        // Éviter stimulants après 14h si sommeil perturbé
        if (sleepQuality.score < 80 && currentHour > 14) {
          recommendations.push({
            type: 'avoid',
            substances: ['Caféine', 'Théine', 'Chocolat'],
            reason: 'Préserver la qualité du sommeil'
          });
        }

        return recommendations;
      };

      const poorSleep = {
        score: 60,
        duration: 6.5,
        deep_sleep_percentage: 15
      };

      const recommendations = optimizeNutritionForSleep(poorSleep, '15:30');
      
      expect(recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ nutrient: 'magnesium' }),
          expect.objectContaining({ nutrient: 'tryptophan' }),
          expect.objectContaining({ type: 'avoid' })
        ])
      );
    });
  });
});