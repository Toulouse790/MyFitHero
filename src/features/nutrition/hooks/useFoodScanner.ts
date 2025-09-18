import { useState, useCallback, useRef } from 'react';
import { FoodVisionService } from '../services/foodVisionService';
import { USDANutritionService } from '../services/usdaService';
import { supabase } from '../../../lib/supabase';

// Types pour le hook de scan photo
export interface FoodScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  confidence: number;
  alternatives?: FoodItem[];
  portion_size?: string;
  weight_grams?: number;
  usda_id?: string;
  analysis_id?: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  usda_id?: string;
}

export interface ScanError {
  message: string;
  type: 'network' | 'analysis' | 'upload' | 'camera' | 'permission';
  code?: string;
}

export interface ScanOptions {
  visionProvider?: 'openai' | 'google';
  nutritionProvider?: 'usda' | 'nutritionix';
  portion?: string;
  weight_grams?: number;
  saveToHistory?: boolean;
}

/**
 * Hook principal pour la fonctionnalité de scan photo alimentaire
 */
export const useFoodScanner = (options: ScanOptions = {}) => {
  // États
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [scanHistory, setScanHistory] = useState<FoodScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Options par défaut
  const {
    visionProvider = 'openai',
    nutritionProvider = 'usda',
    weight_grams = 100,
    saveToHistory = true
  } = options;

  /**
   * Scanner une image alimentaire
   */
  const scanFood = useCallback(async (image: File | string): Promise<FoodScanResult | null> => {
    // Annuler le scan précédent si en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsScanning(true);
    setError(null);

    try {
      // Validation de l'input
      if (typeof image !== 'string' && !image.type.startsWith('image/')) {
        throw new Error('Format de fichier invalide. Veuillez sélectionner une image.');
      }

      if (typeof image !== 'string' && image.size > 10 * 1024 * 1024) { // 10MB max
        throw new Error('Image trop volumineuse. Maximum 10MB.');
      }

      let base64Image: string;

      // Convertir en base64 si nécessaire
      if (typeof image === 'string') {
        base64Image = image;
      } else {
        base64Image = await convertFileToBase64(image);
      }

      // Analyser avec le service IA
      const result = await FoodVisionService.analyzeFood(base64Image, {
        visionProvider,
        nutritionProvider,
        weight_grams
      });

      // Créer l'objet résultat
      const scanResult: FoodScanResult = {
        name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        fiber: result.fiber,
        sugar: result.sugar,
        sodium: result.sodium,
        confidence: result.confidence,
        portion_size: result.portion_size,
        weight_grams: result.weight_grams,
        usda_id: result.usda_id,
        analysis_id: generateAnalysisId()
      };

      setScanResult(scanResult);

      // Sauvegarder dans l'historique si demandé
      if (saveToHistory) {
        await saveToScanHistory(scanResult);
        setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]); // Garder les 10 derniers
      }

      return scanResult;

    } catch (error) {
      const scanError: ScanError = {
        message: error instanceof Error ? error.message : 'Erreur lors du scan',
        type: 'analysis',
        code: error instanceof Error ? error.name : 'UNKNOWN_ERROR'
      };
      
      setError(scanError);
      console.error('Food scan error:', error);
      return null;

    } finally {
      setIsScanning(false);
      abortControllerRef.current = null;
    }
  }, [visionProvider, nutritionProvider, weight_grams, saveToHistory]);

  /**
   * Annuler le scan en cours
   */
  const cancelScan = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsScanning(false);
    setError(null);
  }, []);

  /**
   * Reset du scanner
   */
  const resetScan = useCallback(() => {
    setScanResult(null);
    setError(null);
  }, []);

  /**
   * Charger l'historique des scans
   */
  const loadScanHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('food_scan_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const history: FoodScanResult[] = data.map(item => ({
        name: item.food_name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        sugar: item.sugar,
        sodium: item.sodium,
        confidence: item.confidence,
        portion_size: item.portion_size,
        weight_grams: item.weight_grams,
        usda_id: item.usda_id,
        analysis_id: item.analysis_id
      }));

      setScanHistory(history);

    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprimer un élément de l'historique
   */
  const removeScanFromHistory = useCallback(async (analysisId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('food_scan_history')
        .delete()
        .eq('user_id', user.id)
        .eq('analysis_id', analysisId);

      if (error) throw error;

      setScanHistory(prev => prev.filter(item => item.analysis_id !== analysisId));

    } catch (error) {
      console.error('Failed to remove scan from history:', error);
    }
  }, []);

  /**
   * Répéter un scan depuis l'historique
   */
  const repeatScan = useCallback((scanResult: FoodScanResult) => {
    setScanResult(scanResult);
    setError(null);
  }, []);

  return {
    // États
    isScanning,
    scanResult,
    error,
    scanHistory,
    isLoading,

    // Actions
    scanFood,
    cancelScan,
    resetScan,
    loadScanHistory,
    removeScanFromHistory,
    repeatScan,

    // Utilitaires
    hasResult: !!scanResult,
    hasError: !!error,
    canScan: !isScanning
  };
};

/**
 * Hook pour la gestion de la caméra
 */
export const useCameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<ScanError | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Détection des capacités
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  /**
   * Demander les permissions caméra
   */
  const requestCameraPermission = useCallback(async () => {
    if (!hasCamera) {
      setError({
        message: 'Caméra non disponible sur cet appareil',
        type: 'camera'
      });
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Arrêter immédiatement pour juste tester les permissions
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
      return true;

    } catch (error) {
      setHasPermission(false);
      setError({
        message: 'Permission caméra refusée',
        type: 'permission'
      });
      return false;
    }
  }, [hasCamera, isMobile]);

  /**
   * Démarrer la capture caméra
   */
  const startCapture = useCallback(async () => {
    if (!hasCamera || hasPermission === false) return false;

    try {
      setIsCapturing(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasPermission(true);
      return true;

    } catch (error) {
      setError({
        message: 'Impossible d\'accéder à la caméra',
        type: 'camera'
      });
      setIsCapturing(false);
      return false;
    }
  }, [hasCamera, hasPermission, isMobile]);

  /**
   * Capturer une photo
   */
  const capturePhoto = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current) {
        resolve(null);
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        resolve(null);
        return;
      }

      // Configurer le canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dessiner l'image
      context.drawImage(video, 0, 0);

      // Convertir en blob puis en File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `food-scan-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.85);
    });
  }, []);

  /**
   * Arrêter la capture
   */
  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  }, []);

  // Nettoyage automatique
  const cleanup = useCallback(() => {
    stopCapture();
  }, [stopCapture]);

  return {
    // États
    isCapturing,
    hasPermission,
    error,
    hasCamera,
    isMobile,

    // Refs
    videoRef,
    canvasRef,

    // Actions
    requestCameraPermission,
    startCapture,
    capturePhoto,
    stopCapture,
    cleanup
  };
};

// Fonctions utilitaires
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

const saveToScanHistory = async (scanResult: FoodScanResult): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('food_scan_history').insert([{
      user_id: user.id,
      analysis_id: scanResult.analysis_id,
      food_name: scanResult.name,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fat: scanResult.fat,
      fiber: scanResult.fiber,
      sugar: scanResult.sugar,
      sodium: scanResult.sodium,
      confidence: scanResult.confidence,
      portion_size: scanResult.portion_size,
      weight_grams: scanResult.weight_grams,
      usda_id: scanResult.usda_id,
      created_at: new Date().toISOString()
    }]);
  } catch (error) {
    console.warn('Failed to save scan to history:', error);
  }
};

const generateAnalysisId = (): string => {
  return `scan_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export default useFoodScanner;