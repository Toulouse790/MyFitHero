// src/features/profile/components/profile/ProfileStats.tsx
import React from 'react';

interface ProfileStatsProps {
  currentWeight: string;
  height: string;
  weightHistory: any[];
}

export const useProfileStats = (
  currentWeight: string,
  height: string,
  weightHistory: any[]
) => {
  // Calculs BMI
  const calculateBMI = () => {
    const weight = parseFloat(currentWeight);
    const heightM = parseInt(height) / 100;
    if (weight && heightM) {
      return (weight / (heightM * heightM)).toFixed(1);
    }
    return null;
  };

  // Tendance de poids
  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const recent = weightHistory.slice(-2);
    const diff = recent[1].weight - recent[0].weight;
    return {
      type: diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'stable',
      diff: Math.abs(diff),
    };
  };

  // Dernier poids
  const getLatestWeight = () => {
    return weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;
  };

  const bmi = calculateBMI();
  const weightTrend = getWeightTrend();
  const latestWeight = getLatestWeight();

  // Calculer d'autres métriques utiles
  const getWeightProgress = () => {
    if (weightHistory.length < 2) return null;
    
    const firstWeight = weightHistory[0].weight;
    const current = latestWeight || parseFloat(currentWeight);
    const totalChange = current - firstWeight;
    
    return {
      totalChange: totalChange.toFixed(1),
      isPositive: totalChange > 0,
      percentage: ((totalChange / firstWeight) * 100).toFixed(1)
    };
  };

  const getWeightRange = () => {
    if (weightHistory.length === 0) return null;
    
    const weights = weightHistory.map(entry => entry.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    
    return { min, max, range: (max - min).toFixed(1) };
  };

  const getAverageWeight = () => {
    if (weightHistory.length === 0) return null;
    
    const totalWeight = weightHistory.reduce((sum, entry) => sum + entry.weight, 0);
    return (totalWeight / weightHistory.length).toFixed(1);
  };

  const getBMICategory = (bmiValue: string | null) => {
    if (!bmiValue) return null;
    
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return { category: 'Insuffisance pondérale', color: 'text-blue-600' };
    if (bmiNum < 25) return { category: 'Poids normal', color: 'text-green-600' };
    if (bmiNum < 30) return { category: 'Surpoids', color: 'text-yellow-600' };
    return { category: 'Obésité', color: 'text-red-600' };
  };

  const weightProgress = getWeightProgress();
  const weightRange = getWeightRange();
  const averageWeight = getAverageWeight();
  const bmiCategory = getBMICategory(bmi);

  return {
    bmi,
    weightTrend,
    latestWeight,
    weightProgress,
    weightRange,
    averageWeight,
    bmiCategory,
    calculateBMI,
    getWeightTrend,
    getLatestWeight,
  };
};

export default useProfileStats;