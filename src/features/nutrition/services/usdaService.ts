/**
 * Service d'intégration avec la base de données nutritionnelle USDA
 * Base de données FoodData Central - Données officielles du gouvernement américain
 */

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  publicationDate: string;
  foodNutrients: USDANutrient[];
  brandOwner?: string;
  ingredients?: string;
}

export interface USDANutrient {
  nutrient: {
    id: number;
    number: string;
    name: string;
    rank: number;
    unitName: string;
  };
  amount: number;
}

export interface USDASearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFoodItem[];
}

export interface NutritionProfile {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  saturatedFat: number;
  transFat: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  vitaminD: number;
}

/**
 * Mapping des IDs de nutriments USDA vers nos champs
 */
export const USDA_NUTRIENT_IDS = {
  ENERGY: 1008,           // kcal
  PROTEIN: 1003,          // g
  CARBS: 1005,           // g
  FAT: 1004,             // g
  FIBER: 1079,           // g
  SUGARS: 2000,          // g
  SODIUM: 1093,          // mg
  CHOLESTEROL: 1253,     // mg
  SATURATED_FAT: 1258,   // g
  TRANS_FAT: 1257,       // g
  CALCIUM: 1087,         // mg
  IRON: 1089,            // mg
  VITAMIN_C: 1162,       // mg
  VITAMIN_D: 1114,       // mcg
} as const;

/**
 * Service principal pour l'intégration USDA
 */
export class USDANutritionService {
  private static readonly API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
  private static readonly BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
  
  /**
   * Rechercher des aliments dans la base USDA
   */
  static async searchFoods(query: string, options: {
    pageSize?: number;
    pageNumber?: number;
    sortBy?: 'dataType.keyword' | 'publishedDate' | 'fdcId' | 'description.keyword';
    sortOrder?: 'asc' | 'desc';
    brandOwner?: string;
    requireAllWords?: boolean;
  } = {}): Promise<USDASearchResponse> {
    const {
      pageSize = 25,
      pageNumber = 1,
      sortBy = 'dataType.keyword',
      sortOrder = 'asc',
      requireAllWords = false
    } = options;

    try {
      const searchParams = new URLSearchParams({
        query: query.trim(),
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
        sortBy,
        sortOrder,
        requireAllWords: requireAllWords.toString()
      });

      if (options.brandOwner) {
        searchParams.append('brandOwner', options.brandOwner);
      }

      const response = await fetch(
        `${this.BASE_URL}/foods/search?${searchParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('USDA search error:', error);
      throw new Error('Failed to search USDA food database');
    }
  }

  /**
   * Obtenir les détails d'un aliment par son FDC ID
   */
  static async getFoodDetails(fdcId: number, nutrients?: number[]): Promise<USDAFoodItem> {
    try {
      const url = new URL(`${this.BASE_URL}/food/${fdcId}`);
      
      if (nutrients && nutrients.length > 0) {
        url.searchParams.append('nutrients', nutrients.join(','));
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('USDA food details error:', error);
      throw new Error('Failed to get food details from USDA');
    }
  }

  /**
   * Convertir un aliment USDA en profil nutritionnel standardisé
   */
  static extractNutritionProfile(food: USDAFoodItem, portionGrams: number = 100): NutritionProfile {
    const getNutrientAmount = (nutrientId: number): number => {
      const nutrient = food.foodNutrients.find(n => n.nutrient.id === nutrientId);
      return nutrient ? nutrient.amount : 0;
    };

    // Facteur de conversion pour la portion demandée
    const factor = portionGrams / 100;

    return {
      calories: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.ENERGY) * factor),
      protein: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.PROTEIN) * factor * 10) / 10,
      carbs: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.CARBS) * factor * 10) / 10,
      fat: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.FAT) * factor * 10) / 10,
      fiber: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.FIBER) * factor * 10) / 10,
      sugar: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.SUGARS) * factor * 10) / 10,
      sodium: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.SODIUM) * factor),
      cholesterol: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.CHOLESTEROL) * factor),
      saturatedFat: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.SATURATED_FAT) * factor * 10) / 10,
      transFat: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.TRANS_FAT) * factor * 10) / 10,
      calcium: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.CALCIUM) * factor),
      iron: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.IRON) * factor * 10) / 10,
      vitaminC: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.VITAMIN_C) * factor * 10) / 10,
      vitaminD: Math.round(getNutrientAmount(USDA_NUTRIENT_IDS.VITAMIN_D) * factor * 10) / 10,
    };
  }

  /**
   * Recherche intelligente d'aliments avec scoring de pertinence
   */
  static async smartFoodSearch(foodName: string, options: {
    maxResults?: number;
    includeGeneric?: boolean;
    includeBranded?: boolean;
    preferenceScore?: (food: USDAFoodItem) => number;
  } = {}): Promise<USDAFoodItem[]> {
    const {
      maxResults = 10,
      includeGeneric = true,
      includeBranded = true
    } = options;

    try {
      // Recherche principale
      const searchResults = await this.searchFoods(foodName, {
        pageSize: 50,
        requireAllWords: false
      });

      let foods = searchResults.foods;

      // Filtrer par type de données si nécessaire
      if (!includeGeneric) {
        foods = foods.filter(food => food.dataType !== 'Foundation' && food.dataType !== 'SR Legacy');
      }
      
      if (!includeBranded) {
        foods = foods.filter(food => food.dataType !== 'Branded');
      }

      // Scoring de pertinence
      const scoredFoods = foods.map(food => ({
        food,
        score: this.calculateRelevanceScore(food, foodName, options.preferenceScore)
      }));

      // Trier par score et prendre les meilleurs résultats
      return scoredFoods
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => item.food);

    } catch (error) {
      console.error('Smart food search error:', error);
      throw error;
    }
  }

  /**
   * Calculer un score de pertinence pour un aliment
   */
  private static calculateRelevanceScore(
    food: USDAFoodItem, 
    searchTerm: string, 
    customScorer?: (food: USDAFoodItem) => number
  ): number {
    let score = 0;
    const description = food.description.toLowerCase();
    const search = searchTerm.toLowerCase();

    // Score basé sur la correspondance du nom
    if (description === search) {
      score += 100; // Correspondance exacte
    } else if (description.includes(search)) {
      score += 50; // Contient le terme
    } else {
      // Correspondance partielle des mots
      const searchWords = search.split(' ');
      const matchingWords = searchWords.filter(word => description.includes(word));
      score += (matchingWords.length / searchWords.length) * 30;
    }

    // Bonus pour les types de données préférés
    switch (food.dataType) {
      case 'Foundation':
        score += 20; // Données de référence
        break;
      case 'SR Legacy':
        score += 15; // Données historiques fiables
        break;
      case 'Survey (FNDDS)':
        score += 10; // Données d'enquête
        break;
      default:
        score += 5;
    }

    // Bonus pour les aliments avec plus de nutriments
    if (food.foodNutrients && food.foodNutrients.length > 20) {
      score += 10;
    }

    // Score personnalisé
    if (customScorer) {
      score += customScorer(food);
    }

    return score;
  }

  /**
   * Obtenir les aliments populaires américains
   */
  static async getPopularAmericanFoods(): Promise<USDAFoodItem[]> {
    const popularFoods = [
      'chicken breast',
      'ground beef',
      'salmon',
      'eggs',
      'milk',
      'bread',
      'rice',
      'pasta',
      'apple',
      'banana',
      'broccoli',
      'sweet potato',
      'avocado',
      'almonds',
      'oatmeal'
    ];

    const results: USDAFoodItem[] = [];

    for (const food of popularFoods) {
      try {
        const searchResult = await this.smartFoodSearch(food, {
          maxResults: 1,
          includeGeneric: true,
          includeBranded: false
        });
        
        if (searchResult.length > 0) {
          results.push(searchResult[0]);
        }
      } catch (error) {
        console.warn(`Failed to fetch popular food: ${food}`, error);
      }
    }

    return results;
  }

  /**
   * Cache local pour les recherches fréquentes
   */
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  static async getCachedSearch(query: string): Promise<USDASearchResponse | null> {
    const cached = this.cache.get(query);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  static setCachedSearch(query: string, data: USDASearchResponse): void {
    this.cache.set(query, {
      data,
      timestamp: Date.now()
    });

    // Nettoyer le cache si trop d'entrées
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  /**
   * Valider un profil nutritionnel
   */
  static validateNutritionProfile(profile: NutritionProfile): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Vérifications de cohérence
    const macroCalories = (profile.protein * 4) + (profile.carbs * 4) + (profile.fat * 9);
    const difference = Math.abs(profile.calories - macroCalories);
    
    if (difference > profile.calories * 0.1) {
      warnings.push('Calories ne correspondent pas aux macronutriments');
    }

    if (profile.sugar > profile.carbs) {
      warnings.push('Sucres supérieurs aux glucides totaux');
    }

    if (profile.saturatedFat > profile.fat) {
      warnings.push('Graisses saturées supérieures aux graisses totales');
    }

    if (profile.fiber > profile.carbs) {
      warnings.push('Fibres supérieures aux glucides totaux');
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }
}

export default USDANutritionService;