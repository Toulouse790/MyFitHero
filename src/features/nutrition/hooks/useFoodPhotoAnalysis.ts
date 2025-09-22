// src/features/nutrition/hooks/useFoodPhotoAnalysis.ts
import { useState, useCallback } from 'react';
import { FoodRecognitionService, FoodAnalysisResult, RecognizedFood } from '@/features/nutrition/services/foodRecognition';
import { useToast } from '@/shared/hooks/use-toast';

export interface FoodPhotoAnalysisState {
  isAnalyzing: boolean;
  analysisResult: FoodAnalysisResult | null;
  selectedFoods: RecognizedFood[];
  error: string | null;
}

export interface UseFoodPhotoAnalysisReturn {
  // État
  state: FoodPhotoAnalysisState;
  
  // Actions
  analyzeImage: (imageFile: File) => Promise<void>;
  selectFood: (food: RecognizedFood) => void;
  deselectFood: (foodId: string) => void;
  adjustQuantity: (foodId: string, newQuantity: number) => void;
  confirmSelection: () => Promise<RecognizedFood[]>;
  reset: () => void;
  
  // Utilitaires
  getTotalNutrition: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const useFoodPhotoAnalysis = (): UseFoodPhotoAnalysisReturn => {
  const { toast } = useToast();
  
  const [state, setState] = useState<FoodPhotoAnalysisState>({
    isAnalyzing: false,
    analysisResult: null,
    selectedFoods: [],
    error: null
  });

  /**
   * Analyser une image pour reconnaître les aliments
   */
  const analyzeImage = useCallback(async (imageFile: File) => {
    setState(prev => ({
      ...prev,
      isAnalyzing: true,
      error: null,
      analysisResult: null,
      selectedFoods: []
    }));

    try {
      toast({
        title: 'Analyse en cours...',
        description: 'Reconnaissance des aliments dans votre photo',
      });

      const result = await FoodRecognitionService.analyzeImage(imageFile);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysisResult: result,
          selectedFoods: result.foods, // Sélectionner tous les aliments par défaut
          error: null
        }));

        toast({
          title: 'Analyse terminée !',
          description: `${result.foods.length} aliment(s) détecté(s)`,
          variant: 'default'
        });
      } else {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: result.error || 'Erreur lors de l\'analyse'
        }));

        toast({
          title: 'Erreur d\'analyse',
          description: result.error || 'Impossible d\'analyser l\'image',
          variant: 'destructive'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [toast]);

  /**
   * Sélectionner un aliment détecté
   */
  const selectFood = useCallback((food: RecognizedFood) => {
    setState(prev => ({
      ...prev,
      selectedFoods: prev.selectedFoods.some(f => f.food.id === food.food.id)
        ? prev.selectedFoods
        : [...prev.selectedFoods, food]
    }));
  }, []);

  /**
   * Désélectionner un aliment
   */
  const deselectFood = useCallback((foodId: string) => {
    setState(prev => ({
      ...prev,
      selectedFoods: prev.selectedFoods.filter(f => f.food.id !== foodId)
    }));
  }, []);

  /**
   * Ajuster la quantité d'un aliment sélectionné
   */
  const adjustQuantity = useCallback((foodId: string, newQuantity: number) => {
    setState(prev => ({
      ...prev,
      selectedFoods: prev.selectedFoods.map(food => {
        if (food.food.id === foodId) {
          const factor = newQuantity / 100; // Pour 100g
          return {
            ...food,
            estimated_quantity: newQuantity,
            estimated_calories: food.food.calories_per_100g * factor,
            estimated_protein: food.food.protein_per_100g * factor,
            estimated_carbs: food.food.carbs_per_100g * factor,
            estimated_fat: food.food.fat_per_100g * factor
          };
        }
        return food;
      })
    }));
  }, []);

  /**
   * Confirmer la sélection et retourner les aliments sélectionnés
   */
  const confirmSelection = useCallback(async (): Promise<RecognizedFood[]> => {
    if (state.selectedFoods.length === 0) {
      toast({
        title: 'Aucun aliment sélectionné',
        description: 'Veuillez sélectionner au moins un aliment',
        variant: 'destructive'
      });
      return [];
    }

    toast({
      title: 'Aliments ajoutés !',
      description: `${state.selectedFoods.length} aliment(s) ajouté(s) à votre journal`,
      variant: 'default'
    });

    return state.selectedFoods;
  }, [state.selectedFoods, toast]);

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      analysisResult: null,
      selectedFoods: [],
      error: null
    });
  }, []);

  /**
   * Calculer les totaux nutritionnels des aliments sélectionnés
   */
  const getTotalNutrition = useCallback(() => {
    return state.selectedFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.estimated_calories,
        protein: totals.protein + food.estimated_protein,
        carbs: totals.carbs + food.estimated_carbs,
        fat: totals.fat + food.estimated_fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [state.selectedFoods]);

  return {
    state,
    analyzeImage,
    selectFood,
    deselectFood,
    adjustQuantity,
    confirmSelection,
    reset,
    getTotalNutrition
  };
};

export default useFoodPhotoAnalysis;