/**
 * Service de simulation pour tester le Food Scanner en développement
 * Simule les réponses des APIs OpenAI Vision et USDA
 */

import { FoodAnalysisResponse, NutritionDataResponse } from './foodVisionService';

// Base de données de simulation d'aliments populaires américains
const MOCK_FOOD_DATABASE = [
  {
    name: 'Grilled Chicken Breast',
    keywords: ['chicken', 'breast', 'grilled', 'poultry'],
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      portion_size: '100g',
      weight_grams: 100,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.95
  },
  {
    name: 'Avocado Toast',
    keywords: ['avocado', 'toast', 'bread', 'green'],
    nutrition: {
      calories: 234,
      protein: 6,
      carbs: 16,
      fat: 18,
      fiber: 7,
      sugar: 2,
      sodium: 156,
      portion_size: '1 slice',
      weight_grams: 85,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.89
  },
  {
    name: 'Greek Yogurt Bowl',
    keywords: ['yogurt', 'greek', 'bowl', 'white', 'dairy'],
    nutrition: {
      calories: 150,
      protein: 20,
      carbs: 8,
      fat: 4,
      fiber: 0,
      sugar: 6,
      sodium: 65,
      portion_size: '1 cup',
      weight_grams: 170,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.92
  },
  {
    name: 'Caesar Salad',
    keywords: ['salad', 'caesar', 'lettuce', 'green', 'dressing'],
    nutrition: {
      calories: 187,
      protein: 7,
      carbs: 8,
      fat: 15,
      fiber: 3,
      sugar: 3,
      sodium: 470,
      portion_size: '1 serving',
      weight_grams: 120,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.85
  },
  {
    name: 'Hamburger',
    keywords: ['burger', 'hamburger', 'beef', 'bun', 'meat'],
    nutrition: {
      calories: 540,
      protein: 25,
      carbs: 40,
      fat: 31,
      fiber: 3,
      sugar: 4,
      sodium: 1040,
      portion_size: '1 burger',
      weight_grams: 150,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.93
  },
  {
    name: 'Banana',
    keywords: ['banana', 'fruit', 'yellow', 'curved'],
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      portion_size: '1 medium',
      weight_grams: 100,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.97
  },
  {
    name: 'Salmon Fillet',
    keywords: ['salmon', 'fish', 'pink', 'fillet', 'seafood'],
    nutrition: {
      calories: 208,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      portion_size: '100g',
      weight_grams: 100,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.91
  },
  {
    name: 'Pizza Slice',
    keywords: ['pizza', 'slice', 'cheese', 'tomato', 'dough'],
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 36,
      fat: 10,
      fiber: 2,
      sugar: 4,
      sodium: 640,
      portion_size: '1 slice',
      weight_grams: 107,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.88
  },
  {
    name: 'Apple',
    keywords: ['apple', 'fruit', 'red', 'round'],
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1,
      portion_size: '1 medium',
      weight_grams: 100,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.96
  },
  {
    name: 'Protein Smoothie',
    keywords: ['smoothie', 'protein', 'drink', 'shake', 'liquid'],
    nutrition: {
      calories: 320,
      protein: 25,
      carbs: 35,
      fat: 8,
      fiber: 4,
      sugar: 28,
      sodium: 180,
      portion_size: '1 cup',
      weight_grams: 240,
      source: 'USDA Simulation',
      verified: true
    },
    confidence: 0.82
  }
];

/**
 * Service de simulation pour le développement et les tests
 */
export class MockFoodVisionService {
  /**
   * Simuler l'analyse d'image avec IA
   */
  static async simulateAnalysis(imageBase64?: string): Promise<FoodAnalysisResponse & NutritionDataResponse> {
    // Simuler un délai de traitement réaliste
    await this.delay(1500 + Math.random() * 1000);

    // Sélectionner un aliment aléatoire ou basé sur l'image (simulation)
    const randomFood = MOCK_FOOD_DATABASE[Math.floor(Math.random() * MOCK_FOOD_DATABASE.length)];
    
    // Ajouter une légère variation dans la confiance
    const confidenceVariation = (Math.random() - 0.5) * 0.1;
    const adjustedConfidence = Math.max(0.6, Math.min(1.0, randomFood.confidence + confidenceVariation));

    return {
      foodName: randomFood.name,
      confidence: adjustedConfidence,
      details: {
        estimated_portion: randomFood.nutrition.portion_size,
        preparation_method: this.getRandomPreparation(),
        additional_items: this.getRandomAdditionalItems(),
        cuisine_type: 'American'
      },
      processing_time_ms: 1200 + Math.random() * 800,
      ...randomFood.nutrition
    };
  }

  /**
   * Simuler une recherche USDA
   */
  static async simulateUSDASearch(foodName: string): Promise<NutritionDataResponse> {
    await this.delay(800 + Math.random() * 400);

    // Trouver la meilleure correspondance
    const bestMatch = this.findBestMatch(foodName);
    
    if (!bestMatch) {
      throw new Error(`Aucune donnée nutritionnelle trouvée pour: ${foodName}`);
    }

    return bestMatch.nutrition;
  }

  /**
   * Simuler différents scénarios d'erreur
   */
  static async simulateError(errorType: 'network' | 'analysis' | 'not_found' = 'analysis'): Promise<never> {
    await this.delay(500);

    switch (errorType) {
      case 'network':
        throw new Error('Erreur réseau - Impossible de contacter les serveurs IA');
      case 'analysis':
        throw new Error('Impossible d\'identifier l\'aliment dans cette image');
      case 'not_found':
        throw new Error('Aucune donnée nutritionnelle disponible pour cet aliment');
      default:
        throw new Error('Erreur inconnue lors du scan');
    }
  }

  /**
   * Simuler un scan avec différents niveaux de confiance
   */
  static async simulateConfidenceScenario(scenario: 'high' | 'medium' | 'low'): Promise<FoodAnalysisResponse & NutritionDataResponse> {
    const result = await this.simulateAnalysis();
    
    switch (scenario) {
      case 'high':
        result.confidence = 0.90 + Math.random() * 0.1;
        break;
      case 'medium':
        result.confidence = 0.70 + Math.random() * 0.2;
        break;
      case 'low':
        result.confidence = 0.50 + Math.random() * 0.2;
        break;
    }

    return result;
  }

  /**
   * Obtenir des aliments de démonstration
   */
  static getDemoFoods() {
    return MOCK_FOOD_DATABASE.map(food => ({
      name: food.name,
      ...food.nutrition,
      confidence: food.confidence
    }));
  }

  /**
   * Simuler l'historique des scans
   */
  static generateMockHistory(count: number = 5) {
    const history = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const food = MOCK_FOOD_DATABASE[Math.floor(Math.random() * MOCK_FOOD_DATABASE.length)];
      const scanDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Échelonner sur plusieurs jours

      history.push({
        analysis_id: `mock_${Date.now()}_${i}`,
        name: food.name,
        ...food.nutrition,
        confidence: food.confidence,
        scanned_at: scanDate.toISOString()
      });
    }

    return history;
  }

  // Méthodes utilitaires privées
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static findBestMatch(searchTerm: string) {
    const search = searchTerm.toLowerCase();
    
    // Correspondance exacte
    let bestMatch = MOCK_FOOD_DATABASE.find(food => 
      food.name.toLowerCase() === search
    );

    if (bestMatch) return bestMatch;

    // Correspondance par mots-clés
    bestMatch = MOCK_FOOD_DATABASE.find(food =>
      food.keywords.some(keyword => search.includes(keyword) || keyword.includes(search))
    );

    if (bestMatch) return bestMatch;

    // Correspondance partielle sur le nom
    bestMatch = MOCK_FOOD_DATABASE.find(food =>
      food.name.toLowerCase().includes(search) || search.includes(food.name.toLowerCase())
    );

    return bestMatch || MOCK_FOOD_DATABASE[0]; // Fallback
  }

  private static getRandomPreparation(): string {
    const preparations = ['grilled', 'baked', 'fried', 'steamed', 'raw', 'boiled', 'roasted'];
    return preparations[Math.floor(Math.random() * preparations.length)];
  }

  private static getRandomAdditionalItems(): string[] {
    const items = ['herbs', 'spices', 'sauce', 'seasoning', 'garnish'];
    const count = Math.floor(Math.random() * 3);
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

/**
 * Hook pour utiliser le service de simulation
 */
export const useMockFoodScanner = () => {
  const simulateScan = async (scenario?: 'success' | 'error' | 'low_confidence') => {
    try {
      switch (scenario) {
        case 'error':
          return await MockFoodVisionService.simulateError();
        case 'low_confidence':
          return await MockFoodVisionService.simulateConfidenceScenario('low');
        default:
          return await MockFoodVisionService.simulateAnalysis();
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    simulateScan,
    getDemoFoods: MockFoodVisionService.getDemoFoods,
    generateMockHistory: MockFoodVisionService.generateMockHistory
  };
};

export default MockFoodVisionService;