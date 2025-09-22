import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import des composants modulaires
import { CameraCaptureMode } from './CameraCaptureMode';
import { ScanModeSelector } from './ScanModeSelector';
import { ScanningProgress } from './ScanningProgress';
import { ScanResults } from './ScanResults';
import { ErrorDisplay } from './ErrorDisplay';
import { FoodAnalysisService } from './FoodAnalysisService';

// Types 
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

export const FoodScanner: React.FC = () => {
  // États pour la gestion du scan
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Détection des capacités de l'appareil
  const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Fonctions de gestion des modes
  const handleCameraMode = () => {
    setIsCapturing(true);
    setError(null);
  };

  const handleCameraCapture = useCallback((file: File) => {
    setIsCapturing(false);
    scanFood(file);
  }, []);

  const handleCameraCancel = () => {
    setIsCapturing(false);
  };

  const handleFileUpload = useCallback((file: File) => {
    scanFood(file);
  }, []);

  const handleDemoTest = () => {
    scanFood(new File([], 'demo.jpg', { type: 'image/jpeg' }));
  };

  // Scanner une image alimentaire
  const scanFood = async (image: File) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Créer preview
      const previewUrl = URL.createObjectURL(image);
      setPreviewImage(previewUrl);

      // Analyser l'image
      const result = await FoodAnalysisService.scanFood(image);
      setScanResult(result);
      
    } catch (error) {
      console.error('Scan error:', error);
      setError({
        message: error instanceof Error ? error.message : 'Échec du scan alimentaire',
        type: 'analysis'
      });
    } finally {
      setIsScanning(false);
    }
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

  // Gestion des erreurs
  const handleError = (errorData: { message: string; type: string }) => {
    setError(errorData as ScanError);
    setIsCapturing(false);
  };

  const handleErrorRetry = () => {
    setError(null);
    resetScan();
  };

  const handleErrorDismiss = () => {
    setError(null);
  };

  // Actions sur les résultats
  const handleAddToJournal = () => {
    // TODO: Implémenter l'ajout au journal
    console.log('Ajouter au journal:', scanResult);
  };

  const handleModifyPortion = () => {
    // TODO: Implémenter la modification de portion
    console.log('Modifier la portion:', scanResult);
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
          
          {/* Mode Sélection */}
          {!isCapturing && !scanResult && !isScanning && (
            <ScanModeSelector
              onCameraMode={handleCameraMode}
              onFileUpload={handleFileUpload}
              onDemoTest={isDevelopment ? handleDemoTest : undefined}
              hasCameraSupport={hasCameraSupport}
              isDevelopment={isDevelopment}
            />
          )}

          {/* Mode Capture Caméra */}
          <CameraCaptureMode
            isCapturing={isCapturing}
            onCapture={handleCameraCapture}
            onCancel={handleCameraCancel}
            onError={handleError}
          />

          {/* État de chargement */}
          <ScanningProgress 
            isScanning={isScanning}
          />

          {/* Affichage des erreurs */}
          <ErrorDisplay
            error={error}
            onRetry={handleErrorRetry}
            onDismiss={handleErrorDismiss}
          />
        </CardContent>
      </Card>

      {/* Résultats du scan */}
      <ScanResults
        result={scanResult}
        previewImage={previewImage}
        onReset={resetScan}
        onAddToJournal={handleAddToJournal}
        onModifyPortion={handleModifyPortion}
      />
    </div>
  );
};

export default FoodScanner;