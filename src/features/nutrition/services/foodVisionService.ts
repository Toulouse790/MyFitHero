import { supabase } from '../../../lib/supabase';

// Types pour l'analyse IA
export interface FoodAnalysisRequest {
  image: string; // base64
  prompt?: string;
  model?: 'openai-vision' | 'google-vision' | 'anthropic-vision';
}

export interface FoodAnalysisResponse {
  foodName: string;
  confidence: number;
  details: {
    estimated_portion: string;
    preparation_method?: string;
    additional_items?: string[];
    ingredients?: string[];
    cuisine_type?: string;
  };
  processing_time_ms: number;
}

export interface NutritionDataRequest {
  foodName: string;
  dataSource: 'usda' | 'nutritionix' | 'edamam';
  portion?: string;
  weight_grams?: number;
}

export interface NutritionDataResponse {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  portion_size: string;
  weight_grams: number;
  usda_id?: string;
  source: string;
  verified: boolean;
}

/**
 * Service d'analyse d'images alimentaires avec IA
 */
export class FoodVisionService {
  private static readonly API_BASE = '/api/nutrition';
  private static readonly OPENAI_MODEL = 'gpt-4-vision-preview';
  
  /**
   * Analyser une image alimentaire avec OpenAI Vision
   */
  static async analyzeFoodWithOpenAI(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      const prompt = request.prompt || this.getDefaultPrompt();
      
      const response = await fetch(`${this.API_BASE}/analyze-openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          model: this.OPENAI_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${request.image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        ...result,
        processing_time_ms: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      throw new Error('Failed to analyze food with OpenAI Vision');
    }
  }

  /**
   * Analyser une image alimentaire avec Google Vision
   */
  static async analyzeFoodWithGoogle(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.API_BASE}/analyze-google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          image: {
            content: request.image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            },
            {
              type: 'TEXT_DETECTION',
              maxResults: 5
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const result = this.parseGoogleVisionResponse(data);
      
      return {
        ...result,
        processing_time_ms: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('Google Vision analysis error:', error);
      throw new Error('Failed to analyze food with Google Vision');
    }
  }

  /**
   * Récupérer les données nutritionnelles depuis l'USDA
   */
  static async fetchUSDANutrition(request: NutritionDataRequest): Promise<NutritionDataResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/usda-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          query: request.foodName,
          pageSize: 5,
          requireAllWords: false
        })
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      const data = await response.json();
      const bestMatch = this.findBestNutritionMatch(data.foods, request.foodName);
      
      if (!bestMatch) {
        throw new Error('No nutrition data found for this food');
      }

      return this.formatUSDANutrition(bestMatch, request.weight_grams || 100);
      
    } catch (error) {
      console.error('USDA nutrition error:', error);
      throw new Error('Failed to fetch nutrition data from USDA');
    }
  }

  /**
   * Récupérer les données nutritionnelles depuis Nutritionix
   */
  static async fetchNutritionixData(request: NutritionDataRequest): Promise<NutritionDataResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/nutritionix-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          query: request.foodName
        })
      });

      if (!response.ok) {
        throw new Error(`Nutritionix API error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatNutritionixData(data.foods[0], request.weight_grams || 100);
      
    } catch (error) {
      console.error('Nutritionix nutrition error:', error);
      throw new Error('Failed to fetch nutrition data from Nutritionix');
    }
  }

  /**
   * Service complet d'analyse alimentaire
   */
  static async analyzeFood(
    image: string, 
    options: {
      visionProvider?: 'openai' | 'google';
      nutritionProvider?: 'usda' | 'nutritionix';
      portion?: string;
      weight_grams?: number;
    } = {}
  ): Promise<FoodAnalysisResponse & NutritionDataResponse> {
    const {
      visionProvider = 'openai',
      nutritionProvider = 'usda',
      weight_grams = 100
    } = options;

    try {
      // Étape 1: Analyse de l'image
      const visionResult = visionProvider === 'openai' 
        ? await this.analyzeFoodWithOpenAI({ image })
        : await this.analyzeFoodWithGoogle({ image });

      // Étape 2: Récupération des données nutritionnelles
      const nutritionResult = nutritionProvider === 'usda'
        ? await this.fetchUSDANutrition({ 
            foodName: visionResult.foodName, 
            dataSource: 'usda',
            weight_grams 
          })
        : await this.fetchNutritionixData({ 
            foodName: visionResult.foodName, 
            dataSource: 'nutritionix',
            weight_grams 
          });

      // Étape 3: Sauvegarder dans Supabase pour amélioration continue
      await this.saveAnalysisResult({
        image_hash: await this.hashImage(image),
        detected_food: visionResult.foodName,
        confidence: visionResult.confidence,
        nutrition_data: nutritionResult,
        vision_provider: visionProvider,
        nutrition_provider: nutritionProvider,
        processing_time_ms: visionResult.processing_time_ms
      });

      return {
        ...visionResult,
        ...nutritionResult
      };

    } catch (error) {
      console.error('Complete food analysis error:', error);
      throw error;
    }
  }

  /**
   * Obtenir le prompt par défaut pour l'analyse alimentaire
   */
  private static getDefaultPrompt(): string {
    return `Analyze this food image and identify the food items. Return a JSON response with:
{
  "foodName": "primary food item name (be specific, e.g., 'grilled chicken breast' not just 'chicken')",
  "confidence": 0.95,
  "details": {
    "estimated_portion": "portion description (e.g., '1 medium apple', '6 oz chicken breast')",
    "preparation_method": "cooking method if visible (e.g., 'grilled', 'fried', 'raw')",
    "additional_items": ["list of other items if multiple foods visible"],
    "ingredients": ["visible ingredients if applicable"],
    "cuisine_type": "cuisine type if identifiable"
  }
}

Focus on foods common in American diet. Be precise about portion sizes and preparation methods.
If multiple foods are visible, identify the primary/largest item as the main foodName.
Confidence should reflect how certain you are about the identification (0.0 to 1.0).`;
  }

  /**
   * Parser la réponse de Google Vision
   */
  private static parseGoogleVisionResponse(data: any): Omit<FoodAnalysisResponse, 'processing_time_ms'> {
    const labels = data.labelAnnotations || [];
    const foodLabels = labels.filter((label: any) => 
      this.isFoodRelated(label.description)
    );

    if (foodLabels.length === 0) {
      throw new Error('No food items detected in the image');
    }

    const primaryFood = foodLabels[0];
    
    return {
      foodName: this.normalizeFoodName(primaryFood.description),
      confidence: primaryFood.score,
      details: {
        estimated_portion: '1 serving',
        additional_items: foodLabels.slice(1, 3).map((label: any) => label.description)
      }
    };
  }

  /**
   * Vérifier si un label est lié à la nourriture
   */
  private static isFoodRelated(label: string): boolean {
    const foodKeywords = [
      'food', 'dish', 'meal', 'fruit', 'vegetable', 'meat', 'chicken', 'beef', 
      'fish', 'bread', 'pasta', 'rice', 'salad', 'soup', 'sandwich', 'pizza',
      'burger', 'apple', 'banana', 'tomato', 'carrot', 'broccoli', 'cheese'
    ];
    
    return foodKeywords.some(keyword => 
      label.toLowerCase().includes(keyword)
    );
  }

  /**
   * Normaliser le nom d'un aliment
   */
  private static normalizeFoodName(name: string): string {
    return name.toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  /**
   * Trouver la meilleure correspondance nutritionnelle
   */
  private static findBestNutritionMatch(foods: any[], searchTerm: string): any {
    if (!foods || foods.length === 0) return null;
    
    // Prioriser les correspondances exactes
    const exactMatch = foods.find(food => 
      food.description.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Sinon, prendre le premier résultat (meilleur score de l'API)
    return foods[0];
  }

  /**
   * Formater les données nutritionnelles USDA
   */
  private static formatUSDANutrition(food: any, weightGrams: number): NutritionDataResponse {
    const nutrients = food.foodNutrients || [];
    
    const getNutrient = (nutrientId: number) => {
      const nutrient = nutrients.find((n: any) => n.nutrient.id === nutrientId);
      return nutrient ? nutrient.amount : 0;
    };

    // Convertir pour le poids spécifié (USDA donne pour 100g)
    const factor = weightGrams / 100;

    return {
      calories: Math.round(getNutrient(1008) * factor), // Energy
      protein: Math.round(getNutrient(1003) * factor * 10) / 10, // Protein
      carbs: Math.round(getNutrient(1005) * factor * 10) / 10, // Carbs
      fat: Math.round(getNutrient(1004) * factor * 10) / 10, // Fat
      fiber: Math.round(getNutrient(1079) * factor * 10) / 10, // Fiber
      sugar: Math.round(getNutrient(2000) * factor * 10) / 10, // Sugars
      sodium: Math.round(getNutrient(1093) * factor), // Sodium
      portion_size: `${weightGrams}g`,
      weight_grams: weightGrams,
      usda_id: food.fdcId?.toString(),
      source: 'USDA FoodData Central',
      verified: true
    };
  }

  /**
   * Formater les données Nutritionix
   */
  private static formatNutritionixData(food: any, weightGrams: number): NutritionDataResponse {
    const factor = weightGrams / (food.serving_weight_grams || 100);

    return {
      calories: Math.round(food.nf_calories * factor),
      protein: Math.round(food.nf_protein * factor * 10) / 10,
      carbs: Math.round(food.nf_total_carbohydrate * factor * 10) / 10,
      fat: Math.round(food.nf_total_fat * factor * 10) / 10,
      fiber: Math.round((food.nf_dietary_fiber || 0) * factor * 10) / 10,
      sugar: Math.round((food.nf_sugars || 0) * factor * 10) / 10,
      sodium: Math.round((food.nf_sodium || 0) * factor),
      portion_size: `${weightGrams}g`,
      weight_grams: weightGrams,
      source: 'Nutritionix',
      verified: true
    };
  }

  /**
   * Sauvegarder le résultat d'analyse
   */
  private static async saveAnalysisResult(data: any): Promise<void> {
    try {
      await supabase.from('food_analysis_logs').insert([{
        ...data,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.warn('Failed to save analysis result:', error);
      // Non-bloquant
    }
  }

  /**
   * Générer un hash de l'image
   */
  private static async hashImage(base64Image: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(base64Image);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Obtenir le token d'authentification
   */
  private static async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }
}

export default FoodVisionService;