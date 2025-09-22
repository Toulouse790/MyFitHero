import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import { GtagEvent } from '@/shared/types/gtag';

import { appStore } from '@/store/appStore';
import { useToast } from '@/shared/hooks/use-toast';
import { UniformHeader } from '@/features/profile/components/UniformHeader';
import { getNutritionPersonalizedMessage } from '@/shared/utils/personalizedMessages';
import { AIModal } from '@/shared/components/AIModal';
import { supabase } from '@/lib/supabase';
import { PhotoNutritionAnalyzer } from '@/features/nutrition/components/PhotoNutritionAnalyzer';
import { RecognizedFood } from '@/features/nutrition/services/foodRecognition';

// Import des nouveaux composants modulaires
import {
  NutritionHeader,
  NutritionCalories,
  NutritionMacros,
  NutritionMeals,
  NutritionTips,
  NutritionActions,
  NutritionAnalysis,
} from '@/features/nutrition/components';

// Types & Interfaces simplifiées
interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface DailyNutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  lastUpdated: Date;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const Nutrition: React.FC = () => {
  // --- HOOKS ET STATE ---
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { appStoreUser } = appStore();

  const [dailyData, setDailyData] = useState<DailyNutritionData>({
    calories: 850,
    protein: 45,
    carbs: 120,
    fat: 25,
    water: 1200,
    lastUpdated: new Date(),
  });

  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Petit-déjeuner équilibré', time: '08:00', calories: 350, type: 'breakfast' },
    { id: '2', name: 'Collation', time: '10:30', calories: 150, type: 'snack' },
    { id: '3', name: 'Déjeuner complet', time: '12:30', calories: 500, type: 'lunch' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [showPhotoAnalyzer, setShowPhotoAnalyzer] = useState(false);

  // --- CALCULS PERSONNALISÉS SIMPLIFIÉS ---
  const personalizedGoals = useMemo((): NutritionGoals => {
    const weight = appStoreUser?.weight ?? 70;
    const height = appStoreUser?.height ?? 170;
    const age = appStoreUser?.age ?? 30;
    const gender = appStoreUser?.gender ?? 'male';

    // Vérifier si le profil est complet
    const isIncomplete = !appStoreUser?.weight || !appStoreUser?.height || !appStoreUser?.age;
    setProfileIncomplete(isIncomplete);

    // Calcul BMR avec formule Harris-Benedict
    const bmr = gender === 'male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

    const activityFactor = {
      student: 1.4,
      office_worker: 1.3,
      physical_job: 1.6,
      retired: 1.2,
    }[appStoreUser?.lifestyle as string] ?? 1.4;

    let baseCalories = Math.round(bmr * activityFactor);

    // Ajustements selon objectifs
    if (appStoreUser?.primary_goals?.includes('weight_loss')) baseCalories -= 300;
    if (appStoreUser?.primary_goals?.includes('muscle_gain')) baseCalories += 400;

    return {
      calories: baseCalories,
      protein: Math.round((baseCalories * 0.20) / 4), // 20% protéines
      carbs: Math.round((baseCalories * 0.50) / 4),   // 50% glucides
      fat: Math.round((baseCalories * 0.30) / 9),     // 30% lipides
      water: Math.round(weight * 35), // 35ml par kg
    };
  }, [appStoreUser]);

  // Données pour les composants
  const sportEmoji = '🏃‍♂️'; // Emoji générique fitness
  const selectedSport = appStoreUser?.sport || 'fitness';
  
  const caloriePercentage = (dailyData.calories / personalizedGoals.calories) * 100;

  const macrosData = {
    proteins: {
      current: dailyData.protein,
      goal: personalizedGoals.protein,
      percentage: (dailyData.protein / personalizedGoals.protein) * 100,
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
    carbs: {
      current: dailyData.carbs,
      goal: personalizedGoals.carbs,
      percentage: (dailyData.carbs / personalizedGoals.carbs) * 100,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    fats: {
      current: dailyData.fat,
      goal: personalizedGoals.fat,
      percentage: (dailyData.fat / personalizedGoals.fat) * 100,
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
  };

  const weeklyData = [
    { day: 'Lun', calories: 2100, goal: 2200 },
    { day: 'Mar', calories: 1950, goal: 2200 },
    { day: 'Mer', calories: 2250, goal: 2200 },
    { day: 'Jeu', calories: 2180, goal: 2200 },
    { day: 'Ven', calories: 2050, goal: 2200 },
    { day: 'Sam', calories: 2300, goal: 2200 },
    { day: 'Dim', calories: dailyData.calories, goal: personalizedGoals.calories },
  ];

  const monthlyProgress = {
    totalDays: 30,
    goalsMet: 24,
    avgCalories: 2100,
    avgGoal: 2200,
  };

  // --- HANDLERS ---
  const handleAddMeal = (type?: string) => {
    console.log('Ajouter repas:', type);
    // Logic to add meal
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleScanPhoto = () => {
    setShowPhotoAnalyzer(true);
  };

  const handleShareProgress = () => {
    toast({ title: "Progrès partagé !", description: "Vos données nutritionnelles ont été partagées." });
  };

  const handleExportData = () => {
    toast({ title: "Export réussi !", description: "Vos données ont été exportées." });
  };

  const handleOpenSettings = () => {
    navigate('/nutrition/settings');
  };

  const handleViewHistory = () => {
    navigate('/nutrition/history');
  };

  const handleViewAnalytics = () => {
    navigate('/nutrition/analytics');
  };

  const handleTipFavorite = (tip: string) => {
    toast({ title: "Conseil ajouté aux favoris !", description: tip });
  };

  const handlePhotoAnalysisComplete = (foods: RecognizedFood[]) => {
    console.log('Aliments reconnus:', foods);
    setShowPhotoAnalyzer(false);
  };

  const handleOpenCoaching = () => {
    setShowCoachingModal(true);
  };

  // --- CHARGEMENT DES DONNÉES ---
  const loadNutritionData = useCallback(async () => {
    if (!appStoreUser?.id) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_stats')
        .select('total_calories, total_protein, total_carbs, total_fat, water_intake_ml')
        .eq('user_id', appStoreUser.id)
        .eq('stat_date', today)
        .single();

      if (!error && data) {
        setDailyData({
          calories: data.total_calories || 0,
          protein: data.total_protein || 0,
          carbs: data.total_carbs || 0,
          fat: data.total_fat || 0,
          water: data.water_intake_ml || 0,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  }, [appStoreUser?.id]);

  useEffect(() => {
    loadNutritionData();
  }, [loadNutritionData]);

  // Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view' as GtagEvent, {
        page_title: 'Nutrition Page',
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UniformHeader title="Nutrition" />
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NutritionHeader
          profileIncomplete={profileIncomplete}
          sportEmoji={sportEmoji}
          onCompleteProfile={() => navigate('/profile')}
          onOpenCoaching={handleOpenCoaching}
        />

        <NutritionCalories
          currentCalories={dailyData.calories}
          goalCalories={personalizedGoals.calories}
          percentage={caloriePercentage}
          sportEmoji={sportEmoji}
          onAddMeal={handleAddMeal}
          onScanPhoto={handleScanPhoto}
        />

        <NutritionMacros
          proteins={macrosData.proteins}
          carbs={macrosData.carbs}
          fats={macrosData.fats}
        />

        <NutritionMeals
          meals={meals}
          onAddMeal={handleAddMeal}
          onDeleteMeal={handleDeleteMeal}
          sportEmoji={sportEmoji}
        />

        <NutritionTips
          selectedSport={selectedSport}
          sportEmoji={sportEmoji}
          onTipFavorite={handleTipFavorite}
        />

        <NutritionActions
          onPhotoScan={handleScanPhoto}
          onShareProgress={handleShareProgress}
          onExportData={handleExportData}
          onOpenSettings={handleOpenSettings}
          onViewHistory={handleViewHistory}
          onViewAnalytics={handleViewAnalytics}
          sportEmoji={sportEmoji}
        />

        <NutritionAnalysis
          weeklyData={weeklyData}
          monthlyProgress={monthlyProgress}
          sportEmoji={sportEmoji}
          selectedSport={selectedSport}
        />
      </div>

      {/* Modals */}
      {showCoachingModal && (
        <AIModal
          open={showCoachingModal}
          onOpenChange={(open) => setShowCoachingModal(open)}
          pillar="nutrition"
        />
      )}

      {showPhotoAnalyzer && (
        <PhotoNutritionAnalyzer
          isOpen={showPhotoAnalyzer}
          onClose={() => setShowPhotoAnalyzer(false)}
          onFoodsConfirmed={handlePhotoAnalysisComplete}
        />
      )}
    </div>
  );
};

export default Nutrition;