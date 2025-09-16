// src/features/nutrition/services/foodRecognition.ts
import { supabase } from '../../../lib/supabase';

export interface FoodItem {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
}

export interface RecognizedFood {
  food: FoodItem;
  confidence: number;
  estimated_quantity: number; // en grammes
  estimated_calories: number;
  estimated_protein: number;
  estimated_carbs: number;
  estimated_fat: number;
}

export interface FoodAnalysisResult {
  success: boolean;
  foods: RecognizedFood[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  analysis_time: number;
  error?: string;
}

export class FoodRecognitionService {
  private static readonly API_ENDPOINTS = {
    // API de reconnaissance d'images (ex: Clarifai, Google Vision, Azure Computer Vision)
    FOOD_RECOGNITION: process.env.VITE_FOOD_RECOGNITION_API || 'https://api.example-food-recognition.com',
    // API nutritionnelle (ex: Edamam, Spoonacular, USDA)
    NUTRITION_API: process.env.VITE_NUTRITION_API || 'https://api.example-nutrition.com'
  };

  /**
   * Analyser une image pour reconnaître les aliments
   */
  static async analyzeImage(imageFile: File): Promise<FoodAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Validation du fichier
      if (!this.isValidImageFile(imageFile)) {
        throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      }

      // Redimensionner l'image si nécessaire
      const optimizedImage = await this.optimizeImage(imageFile);
      
      // Reconnaissance des aliments dans l'image
      const recognitionResult = await this.performFoodRecognition(optimizedImage);
      
      // Enrichissement avec les données nutritionnelles
      const enrichedFoods = await this.enrichWithNutritionalData(recognitionResult);
      
      // Calcul des totaux
      const totals = this.calculateTotals(enrichedFoods);
      
      const analysisTime = Date.now() - startTime;
      
      return {
        success: true,
        foods: enrichedFoods,
        ...totals,
        analysis_time: analysisTime
      };
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      
      return {
        success: false,
        foods: [],
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        analysis_time: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Valider le format du fichier image
   */
  private static isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Optimiser l'image pour l'analyse (redimensionnement, compression)
   */
  private static async optimizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Redimensionner à 1024x1024 max pour optimiser l'analyse
        const maxSize = 1024;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Impossible d\'optimiser l\'image'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Effectuer la reconnaissance des aliments via API externe
   */
  private static async performFoodRecognition(imageBlob: Blob): Promise<Array<{name: string, confidence: number}>> {
    // Simulation pour le développement - à remplacer par une vraie API
    if (process.env.NODE_ENV === 'development') {
      return this.mockFoodRecognition();
    }

    const formData = new FormData();
    formData.append('image', imageBlob);

    try {
      const response = await fetch(`${this.API_ENDPOINTS.FOOD_RECOGNITION}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_FOOD_RECOGNITION_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      return data.predictions || [];
      
    } catch (error) {
      console.error('Erreur reconnaissance alimentaire:', error);
      // Fallback sur les données simulées
      return this.mockFoodRecognition();
    }
  }

  /**
   * Simulation de reconnaissance alimentaire pour le développement
   */
  private static mockFoodRecognition(): Array<{name: string, confidence: number}> {
    const mockFoods = [
      { name: 'Pomme', confidence: 0.92 },
      { name: 'Banane', confidence: 0.88 },
      { name: 'Pain complet', confidence: 0.75 },
      { name: 'Fromage cheddar', confidence: 0.82 },
      { name: 'Salade verte', confidence: 0.69 }
    ];

    // Retourner 1-3 aliments aléatoires
    const numFoods = Math.floor(Math.random() * 3) + 1;
    return mockFoods
      .sort(() => Math.random() - 0.5)
      .slice(0, numFoods)
      .filter(food => food.confidence > 0.6);
  }

  /**
   * Enrichir avec les données nutritionnelles
   */
  private static async enrichWithNutritionalData(
    recognizedItems: Array<{name: string, confidence: number}>
  ): Promise<RecognizedFood[]> {
    const enrichedFoods: RecognizedFood[] = [];

    for (const item of recognizedItems) {
      try {
        const foodData = await this.getNutritionData(item.name);
        const estimatedQuantity = this.estimateQuantity(item.name);
        
        if (foodData) {
          const factor = estimatedQuantity / 100; // conversion pour 100g
          
          enrichedFoods.push({
            food: foodData,
            confidence: item.confidence,
            estimated_quantity: estimatedQuantity,
            estimated_calories: foodData.calories_per_100g * factor,
            estimated_protein: foodData.protein_per_100g * factor,
            estimated_carbs: foodData.carbs_per_100g * factor,
            estimated_fat: foodData.fat_per_100g * factor
          });
        }
      } catch (error) {
        console.error(`Erreur lors de l'enrichissement pour ${item.name}:`, error);
      }
    }

    return enrichedFoods;
  }

  /**
   * Récupérer les données nutritionnelles d'un aliment
   */
  private static async getNutritionData(foodName: string): Promise<FoodItem | null> {
    try {
      // Essayer d'abord dans la base locale Supabase
      const { data: localFood } = await supabase
        .from('nutrition_foods')
        .select('*')
        .ilike('name', `%${foodName}%`)
        .limit(1)
        .single();

      if (localFood) {
        return localFood;
      }

      // Sinon, utiliser l'API externe (simulation pour le développement)
      return this.getMockNutritionData(foodName);
      
    } catch (error) {
      console.error(`Erreur récupération données nutrition pour ${foodName}:`, error);
      return this.getMockNutritionData(foodName);
    }
  }

  /**
   * Données nutritionnelles simulées
   */
  private static getMockNutritionData(foodName: string): FoodItem {
    const mockDatabase: Record<string, Omit<FoodItem, 'id' | 'name'>> = {
      'Pomme': { calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2 },
      'Banane': { calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3 },
      'Pain complet': { calories_per_100g: 247, protein_per_100g: 13, carbs_per_100g: 41, fat_per_100g: 4.2 },
      'Fromage cheddar': { calories_per_100g: 403, protein_per_100g: 25, carbs_per_100g: 1.3, fat_per_100g: 33 },
      'Salade verte': { calories_per_100g: 15, protein_per_100g: 1.4, carbs_per_100g: 2.9, fat_per_100g: 0.1 }
    };

    const data = mockDatabase[foodName] || mockDatabase['Pomme'];
    
    return {
      id: `mock-${foodName.toLowerCase().replace(/\s+/g, '-')}`,
      name: foodName,
      ...data
    };
  }

  /**
   * Estimer la quantité d'un aliment (en grammes)
   */
  private static estimateQuantity(foodName: string): number {
    const quantities: Record<string, number> = {
      'Pomme': 150,
      'Banane': 120,
      'Pain complet': 30, // 1 tranche
      'Fromage cheddar': 25,
      'Salade verte': 50
    };

    return quantities[foodName] || 100;
  }

  /**
   * Calculer les totaux nutritionnels
   */
  private static calculateTotals(foods: RecognizedFood[]): {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  } {
    return foods.reduce(
      (totals, food) => ({
        total_calories: totals.total_calories + food.estimated_calories,
        total_protein: totals.total_protein + food.estimated_protein,
        total_carbs: totals.total_carbs + food.estimated_carbs,
        total_fat: totals.total_fat + food.estimated_fat
      }),
      { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 }
    );
  }

  /**
   * Sauvegarder l'analyse dans l'historique utilisateur
   */
  static async saveAnalysisToHistory(
    userId: string,
    analysisResult: FoodAnalysisResult,
    imageUrl: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('nutrition_photo_analyses')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          foods_detected: analysisResult.foods,
          total_calories: analysisResult.total_calories,
          total_protein: analysisResult.total_protein,
          total_carbs: analysisResult.total_carbs,
          total_fat: analysisResult.total_fat,
          analysis_time: analysisResult.analysis_time,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur sauvegarde analyse:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }
}

export default FoodRecognitionService;