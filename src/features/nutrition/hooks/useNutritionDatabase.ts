import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Types pour la base de données USDA
interface USDAFoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType: string;
  foodNutrients: USDANutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  user_submitted: boolean;
  verified: boolean;
  usda_id?: number;
  created_at?: string;
}

interface NutritionScan {
  id: string;
  user_id: string;
  image_url?: string;
  detected_food: string;
  confidence: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  created_at: string;
}

interface SearchOptions {
  maxResults?: number;
  includeGeneric?: boolean;
  includeBranded?: boolean;
  requireAllNutrients?: boolean;
  cacheFirst?: boolean;
}

// Configuration USDA API
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Cache IndexedDB
class NutritionCache {
  private dbName = 'MyFitHero_NutritionCache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store pour les aliments USDA
        if (!db.objectStoreNames.contains('foods')) {
          const foodStore = db.createObjectStore('foods', { keyPath: 'fdcId' });
          foodStore.createIndex('description', 'description', { unique: false });
          foodStore.createIndex('brandOwner', 'brandOwner', { unique: false });
        }
        
        // Store pour les recherches
        if (!db.objectStoreNames.contains('searches')) {
          const searchStore = db.createObjectStore('searches', { keyPath: 'query' });
          searchStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async get(key: string): Promise<any> {
    if (!this.db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['foods'], 'readonly');
      const store = transaction.objectStore('foods');
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['foods'], 'readwrite');
      const store = transaction.objectStore('foods');
      const request = store.put({ ...value, fdcId: key });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async searchCache(query: string): Promise<USDAFoodItem[]> {
    if (!this.db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searches'], 'readonly');
      const store = transaction.objectStore('searches');
      const request = store.get(query.toLowerCase());
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < 24 * 60 * 60 * 1000) { // 24h cache
          resolve(result.foods);
        } else {
          resolve([]);
        }
      };
    });
  }

  async cacheSearch(query: string, foods: USDAFoodItem[]): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['searches'], 'readwrite');
      const store = transaction.objectStore('searches');
      const request = store.put({
        query: query.toLowerCase(),
        foods,
        timestamp: Date.now()
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Recherche fuzzy
function fuzzyMatch(query: string, target: string): number {
  query = query.toLowerCase();
  target = target.toLowerCase();
  
  // Correspondance exacte
  if (target.includes(query)) {
    return 1.0;
  }
  
  // Distance de Levenshtein simplifiée
  const words = query.split(' ');
  const targetWords = target.split(' ');
  
  let matches = 0;
  for (const word of words) {
    for (const targetWord of targetWords) {
      if (targetWord.includes(word) || word.includes(targetWord)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / words.length;
}

// Hook principal
export const useNutritionDatabase = () => {
  const [cache] = useState(() => new NutritionCache());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cache.init().catch(console.error);
  }, [cache]);

  // Recherche dans l'API USDA
  const searchUSDA = useCallback(async (
    query: string, 
    options: SearchOptions = {}
  ): Promise<USDAFoodItem[]> => {
    const {
      maxResults = 50,
      includeGeneric = true,
      includeBranded = true,
      cacheFirst = true
    } = options;

    setError(null);

    // Vérifier le cache d'abord
    if (cacheFirst) {
      const cached = await cache.searchCache(query);
      if (cached.length > 0) {
        return cached;
      }
    }

    if (!USDA_API_KEY) {
      setError('USDA API key not configured');
      return [];
    }

    try {
      setIsLoading(true);

      // Types de données USDA
      const dataTypes = [];
      if (includeGeneric) dataTypes.push('Foundation', 'SR Legacy');
      if (includeBranded) dataTypes.push('Branded');

      const params = new URLSearchParams({
        api_key: USDA_API_KEY,
        query,
        pageSize: maxResults.toString(),
        dataType: dataTypes.join(',')
      });

      const response = await fetch(`${USDA_BASE_URL}/foods/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      const data = await response.json();
      const foods = data.foods || [];

      // Mise en cache
      await cache.cacheSearch(query, foods);

      return foods;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  // Recherche intelligente avec fuzzy matching
  const smartSearch = useCallback(async (
    query: string,
    options: SearchOptions = {}
  ): Promise<FoodItem[]> => {
    // 1. Recherche dans notre base Supabase d'abord
    const { data: localFoods } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(10);

    // 2. Recherche USDA
    const usdaFoods = await searchUSDA(query, options);

    // 3. Convertir et fusionner les résultats
    const convertedUSDA = usdaFoods.map(food => convertUSDAToFoodItem(food));
    const allFoods = [...(localFoods || []), ...convertedUSDA];

    // 4. Scoring et tri par pertinence
    const scoredFoods = allFoods.map(food => ({
      ...food,
      relevanceScore: fuzzyMatch(query, food.name)
    })).filter(food => food.relevanceScore > 0.3)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredFoods.slice(0, options.maxResults || 20);
  }, [searchUSDA]);

  // Conversion USDA vers notre format
  const convertUSDAToFoodItem = useCallback((usdaFood: USDAFoodItem): FoodItem => {
    const nutrients = usdaFood.foodNutrients;
    
    // Mapping des nutriments USDA
    const getNutrient = (id: number) => {
      const nutrient = nutrients.find(n => n.nutrientId === id);
      return nutrient ? nutrient.value : 0;
    };

    return {
      id: `usda_${usdaFood.fdcId}`,
      name: usdaFood.description,
      brand: usdaFood.brandOwner || usdaFood.brandName,
      calories_per_100g: Math.round(getNutrient(1008)), // Energy (kcal)
      protein_per_100g: getNutrient(1003), // Protein
      carbs_per_100g: getNutrient(1005), // Carbohydrate
      fat_per_100g: getNutrient(1004), // Total lipid (fat)
      fiber_per_100g: getNutrient(1079), // Fiber
      sugar_per_100g: getNutrient(2000), // Total sugars
      sodium_per_100g: getNutrient(1093), // Sodium
      user_submitted: false,
      verified: true,
      usda_id: usdaFood.fdcId
    };
  }, []);

  // Sauvegarder un aliment dans notre base
  const saveFoodItem = useCallback(async (foodItem: Omit<FoodItem, 'id' | 'created_at'>): Promise<FoodItem | null> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([foodItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save food item');
      return null;
    }
  }, []);

  // Sauvegarder un scan nutrition
  const saveScan = useCallback(async (scan: Omit<NutritionScan, 'id' | 'created_at'>): Promise<NutritionScan | null> => {
    try {
      const { data, error } = await supabase
        .from('nutrition_scans')
        .insert([scan])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scan');
      return null;
    }
  }, []);

  // Obtenir l'historique des scans
  const getScanHistory = useCallback(async (userId: string, limit = 50): Promise<NutritionScan[]> => {
    try {
      const { data, error } = await supabase
        .from('nutrition_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scan history');
      return [];
    }
  }, []);

  // Nettoyer le cache (pour les tests ou maintenance)
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await cache.init();
      if (cache['db']) {
        const transaction = cache['db'].transaction(['foods', 'searches'], 'readwrite');
        transaction.objectStore('foods').clear();
        transaction.objectStore('searches').clear();
      }
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  }, [cache]);

  return {
    // Méthodes principales
    searchUSDA,
    smartSearch,
    saveFoodItem,
    saveScan,
    getScanHistory,
    
    // Utilitaires
    convertUSDAToFoodItem,
    clearCache,
    
    // État
    isLoading,
    error,
    
    // Cache
    cache
  };
};