// src/features/nutrition/components/FoodAnalysisService.tsx
import React from 'react';
import { MockFoodVisionService } from '@/features/nutrition/services/mockFoodVisionService';

// Types pour le service d'analyse
interface FoodScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  confidence: number;
  alternatives?: any[];
  portion_size?: string;
  weight_grams?: number;
}

interface ScanError {
  message: string;
  type: 'network' | 'analysis' | 'upload' | 'camera';
}

// Service d'analyse alimentaire
export class FoodAnalysisService {
  // Convertir image en base64
  static async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Retourner seulement la partie base64 sans le préfixe
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Analyser l'image alimentaire avec IA
  static async analyzeFoodImage(base64Image: string): Promise<{ foodName: string; confidence: number; details?: any }> {
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          prompt: `Analyze this food image and identify the food items. Return a JSON response with:
          {
            "foodName": "primary food item name",
            "confidence": 0.95,
            "details": {
              "estimated_portion": "description",
              "preparation_method": "if visible",
              "additional_items": ["list of other items if multiple"]
            }
          }
          
          Be specific about the food type (e.g., "grilled chicken breast" not just "chicken").
          Focus on foods common in American diet.`
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Food analysis error:', error);
      throw new Error('Failed to analyze food image');
    }
  }

  // Récupérer les données nutritionnelles USDA
  static async fetchNutritionData(foodName: string): Promise<Omit<FoodScanResult, 'name' | 'confidence' | 'alternatives'>> {
    try {
      const response = await fetch('/api/nutrition-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodName,
          dataSource: 'usda'
        })
      });

      if (!response.ok) {
        throw new Error(`Nutrition API Error: ${response.status}`);
      }

      const nutritionData = await response.json();
      
      return {
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbs: nutritionData.carbs || 0,
        fat: nutritionData.fat || 0,
        fiber: nutritionData.fiber || 0,
        sugar: nutritionData.sugar || 0,
        sodium: nutritionData.sodium || 0,
        portion_size: nutritionData.portion_size || '100g',
        weight_grams: nutritionData.weight_grams || 100
      };
    } catch (error) {
      console.error('Nutrition data error:', error);
      throw new Error('Failed to fetch nutrition data');
    }
  }

  // Valider l'image
  static validateImage(file: File): void {
    if (!file.type.startsWith('image/')) {
      throw new Error('Veuillez sélectionner une image valide');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      throw new Error('La taille de l\'image doit être inférieure à 5MB');
    }
  }

  // Scanner une image alimentaire
  static async scanFood(image: File): Promise<FoodScanResult> {
    // Validation de l'image
    this.validateImage(image);

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Mode développement : utiliser le service de simulation
      const mockResult = await MockFoodVisionService.simulateAnalysis();
      return {
        name: mockResult.foodName,
        confidence: mockResult.confidence,
        calories: mockResult.calories,
        protein: mockResult.protein,
        carbs: mockResult.carbs,
        fat: mockResult.fat,
        fiber: mockResult.fiber,
        sugar: mockResult.sugar,
        sodium: mockResult.sodium,
        portion_size: mockResult.portion_size,
        weight_grams: mockResult.weight_grams
      };
    } else {
      // Production : utiliser les vraies APIs
      const base64 = await this.convertToBase64(image);
      const analysisResult = await this.analyzeFoodImage(base64);
      const nutritionData = await this.fetchNutritionData(analysisResult.foodName);
      
      return {
        name: analysisResult.foodName,
        confidence: analysisResult.confidence,
        ...nutritionData
      };
    }
  }
}