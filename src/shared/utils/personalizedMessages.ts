// src/shared/utils/personalizedMessages.ts

interface User {
  first_name?: string | undefined;
  username?: string | undefined;
  sport?: string | undefined;
}

// Messages personnalisés pour HydrationPage
export const getHydrationPersonalizedMessage = (
  percentage: number,
  isGoalReached: boolean,
  user?: User | undefined
): string => {
  const userName = user?.first_name || user?.username || 'Champion';

  if (isGoalReached) {
    return `🎉 Excellent ${userName} ! Objectif atteint !`;
  } else if (percentage >= 75) {
    return `💪 Bravo ${userName}, tu y es presque !`;
  } else if (percentage >= 50) {
    return `⚡ Continue ${userName} !`;
  } else {
    return `💧 ${userName}, hydrate-toi !`;
  }
};

// Messages personnalisés pour NutritionPage
export const getNutritionPersonalizedMessage = (
  dailyCalories: number,
  targetCalories: number,
  user?: User | undefined
): string => {
  const progress = (dailyCalories / targetCalories) * 100;
  const userName = user?.first_name || user?.username || 'Champion';

  if (progress >= 90) {
    return `🎯 Parfait ${userName} ! Objectif nutritionnel atteint`;
  } else if (progress >= 70) {
    return `💪 Excellent ${userName}, tu nourris bien ton corps !`;
  } else if (progress >= 50) {
    return `⚡ Bien joué ${userName}, continue !`;
  } else {
    return `🍎 ${userName}, ton corps a besoin de plus de carburant !`;
  }
};

// Messages personnalisés pour SleepPage
export const getSleepPersonalizedMessage = (
  currentSleepHours: number,
  targetSleepHours: number,
  user?: User | undefined
): string => {
  const userName = user?.first_name || user?.username || 'Champion';
  const progress = (currentSleepHours / targetSleepHours) * 100;

  if (progress >= 95) {
    return `😴 Parfait ${userName} ! Sommeil optimal pour ${user?.sport}`;
  } else if (progress >= 80) {
    return `💤 Très bien ${userName}, ta récupération est sur la bonne voie !`;
  } else if (progress >= 60) {
    return `⏰ ${userName}, quelques heures de plus t'aideraient pour ${user?.sport}`;
  } else {
    return `🚨 ${userName}, ton corps a besoin de plus de récupération !`;
  }
};

// Recommandation personnalisée pour SleepPage
export const getSleepPersonalizedRecommendation = (
  sleepDeficit: number,
  user?: User | undefined
): string => {
  const deficit = Math.round(sleepDeficit * 60);
  if (deficit > 0) {
    return `Pour optimiser vos performances en ${user?.sport}, couchez-vous ${deficit} minutes plus tôt.`;
  }
  return `Votre sommeil est parfaitement adapté à vos besoins en ${user?.sport} !`;
};