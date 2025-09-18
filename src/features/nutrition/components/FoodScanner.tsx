import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertCircle, X, RotateCw, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { MockFoodVisionService } from '../services/mockFoodVisionService';

// Types pour le scan alimentaire
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
  alternatives?: FoodItem[];
  portion_size?: string;
  weight_grams?: number;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  usda_id?: string;
}

interface ScanError {
  message: string;
  type: 'network' | 'analysis' | 'upload' | 'camera';
}

export const FoodScanner: React.FC = () => {
  // États pour la gestion du scan
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Refs pour les éléments
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Détection des capacités de l'appareil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasCameraSupport = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  // Convertir image en base64
  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Retourner seulement la partie base64 sans le préfixe data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }, []);

  // Analyser l'image alimentaire avec IA
  const analyzeFoodImage = async (base64Image: string): Promise<{ foodName: string; confidence: number; details?: any }> => {
    try {
      // Appel à l'API OpenAI Vision (ou Google Vision)
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

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Food analysis error:', error);
      throw new Error('Failed to analyze food image');
    }
  };

  // Récupérer les données nutritionnelles USDA
  const fetchNutritionData = async (foodName: string): Promise<Omit<FoodScanResult, 'name' | 'confidence' | 'alternatives'>> => {
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
  };

  // Scanner une image alimentaire
  const scanFood = async (image: File) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Validation de l'image
      if (!image.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (image.size > 5 * 1024 * 1024) { // 5MB max
        throw new Error('Image size must be less than 5MB');
      }

      // Créer preview
      const previewUrl = URL.createObjectURL(image);
      setPreviewImage(previewUrl);

      // En mode développement, utiliser le service de simulation
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let result: FoodScanResult;
      
      if (isDevelopment) {
        // Utiliser le service de simulation
        const mockResult = await MockFoodVisionService.simulateAnalysis();
        result = {
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
        // Production: utiliser les vraies APIs
        // Convertir en base64
        const base64 = await convertToBase64(image);
        
        // Analyser avec IA
        const analysisResult = await analyzeFoodImage(base64);
        
        // Récupérer données nutritionnelles
        const nutritionData = await fetchNutritionData(analysisResult.foodName);
        
        // Combiner les résultats
        result = {
          name: analysisResult.foodName,
          confidence: analysisResult.confidence,
          ...nutritionData
        };
      }

      setScanResult(result);
      
    } catch (error) {
      console.error('Scan error:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to scan food',
        type: 'analysis'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Gérer l'upload de fichier
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      scanFood(file);
    }
  }, []);

  // Démarrer la capture camera
  const startCamera = async () => {
    if (!hasCameraSupport) {
      setError({
        message: 'Camera not available on this device',
        type: 'camera'
      });
      return;
    }

    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? 'environment' : 'user', // Camera arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setError({
        message: 'Failed to access camera',
        type: 'camera'
      });
      setIsCapturing(false);
    }
  };

  // Capturer une photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Définir les dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image du video sur le canvas
    context.drawImage(video, 0, 0);

    // Convertir en blob et scanner
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        scanFood(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  // Arrêter la camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  // Reset du scan
  const resetScan = () => {
    setScanResult(null);
    setPreviewImage(null);
    setError(null);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  // Calculer le badge de confiance
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return { color: 'bg-green-500', text: 'Très confiant' };
    if (confidence >= 0.7) return { color: 'bg-yellow-500', text: 'Confiant' };
    return { color: 'bg-red-500', text: 'Incertain' };
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scanner un Aliment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Camera */}
          {!isCapturing && !scanResult && (
            <div className="space-y-4">
              {/* Bouton de démo en développement */}
              {process.env.NODE_ENV === 'development' && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Mode développement - Test rapide disponible</span>
                    <Button 
                      onClick={() => scanFood(new File([], 'demo.jpg', { type: 'image/jpeg' }))}
                      size="sm"
                      variant="outline"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Test Démo
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasCameraSupport && (
                  <Button 
                    onClick={startCamera}
                    className="h-32 flex-col gap-2"
                    variant="outline"
                  >
                    <Camera className="w-8 h-8" />
                    <span>Prendre une Photo</span>
                    <span className="text-xs text-muted-foreground">
                      Recommandé sur mobile
                    </span>
                  </Button>
                )}
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex-col gap-2"
                  variant="outline"
                >
                  <Upload className="w-8 h-8" />
                  <span>Choisir une Image</span>
                  <span className="text-xs text-muted-foreground">
                    Galerie ou fichiers
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Input caché pour upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Mode Capture Camera */}
          {isCapturing && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto} size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Capturer
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* État de chargement */}
          {isScanning && (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Analyse en cours...</p>
              <p className="text-sm text-muted-foreground">
                Reconnaissance de l'aliment et calcul nutritionnel
              </p>
            </div>
          )}

          {/* Erreurs */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Résultats du scan */}
      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Résultat du Scan
              </div>
              <Button onClick={resetScan} variant="outline" size="sm">
                <RotateCw className="w-4 h-4 mr-2" />
                Nouveau Scan
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview de l'image */}
            {previewImage && (
              <div className="flex justify-center">
                <img 
                  src={previewImage} 
                  alt="Food preview" 
                  className="max-w-xs rounded-lg border"
                />
              </div>
            )}

            {/* Aliment identifié */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{scanResult.name}</h3>
              <Badge 
                className={`${getConfidenceBadge(scanResult.confidence).color} text-white`}
              >
                {getConfidenceBadge(scanResult.confidence).text} ({Math.round(scanResult.confidence * 100)}%)
              </Badge>
              {scanResult.portion_size && (
                <p className="text-sm text-muted-foreground">
                  Portion: {scanResult.portion_size}
                </p>
              )}
            </div>

            {/* Informations nutritionnelles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {scanResult.calories}
                </div>
                <div className="text-sm text-blue-800">Calories</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {scanResult.protein}g
                </div>
                <div className="text-sm text-green-800">Protéines</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {scanResult.carbs}g
                </div>
                <div className="text-sm text-yellow-800">Glucides</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {scanResult.fat}g
                </div>
                <div className="text-sm text-red-800">Lipides</div>
              </div>
            </div>

            {/* Détails nutritionnels supplémentaires */}
            {(scanResult.fiber || scanResult.sugar || scanResult.sodium) && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                {scanResult.fiber && (
                  <div className="text-center">
                    <div className="font-semibold">{scanResult.fiber}g</div>
                    <div className="text-muted-foreground">Fibres</div>
                  </div>
                )}
                {scanResult.sugar && (
                  <div className="text-center">
                    <div className="font-semibold">{scanResult.sugar}g</div>
                    <div className="text-muted-foreground">Sucres</div>
                  </div>
                )}
                {scanResult.sodium && (
                  <div className="text-center">
                    <div className="font-semibold">{scanResult.sodium}mg</div>
                    <div className="text-muted-foreground">Sodium</div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-center">
              <Button className="flex-1 max-w-xs">
                Ajouter à mon Journal
              </Button>
              <Button variant="outline">
                Modifier Portion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodScanner;