// src/features/nutrition/components/ScanModeSelector.tsx
import React, { useRef } from 'react';
import { Camera, Upload, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
// import { Alert, AlertDescription } from '../../components/ui/alert';

interface ScanModeSelectorProps {
  onCameraMode: () => void;
  onFileUpload: (file: File) => void;
  onDemoTest?: () => void;
  hasCameraSupport: boolean;
  isDevelopment?: boolean;
}

export const ScanModeSelector: React.FC<ScanModeSelectorProps> = ({
  onCameraMode,
  onFileUpload,
  onDemoTest,
  hasCameraSupport,
  isDevelopment = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Mode développement - Test démo */}
      {isDevelopment && onDemoTest && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Mode développement - Test rapide disponible</span>
            </div>
            <Button 
              onClick={onDemoTest}
              size="sm"
              variant="outline"
            >
              <Zap className="w-4 h-4 mr-2" />
              Test Démo
            </Button>
          </div>
        </div>
      )}
      
      {/* Sélecteurs de mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode Caméra */}
        {hasCameraSupport && (
          <Button 
            onClick={onCameraMode}
            className="h-32 flex-col gap-2"
            variant="outline"
          >
            <Camera className="w-8 h-8" />
            <span className="font-medium">Prendre une Photo</span>
            <span className="text-xs text-muted-foreground">
              Recommandé sur mobile
            </span>
          </Button>
        )}
        
        {/* Mode Upload */}
        <Button 
          onClick={triggerFileSelect}
          className="h-32 flex-col gap-2"
          variant="outline"
        >
          <Upload className="w-8 h-8" />
          <span className="font-medium">Choisir une Image</span>
          <span className="text-xs text-muted-foreground">
            Galerie ou fichiers
          </span>
        </Button>
      </div>

      {/* Input caché pour upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Conseils d'utilisation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Conseils pour un bon scan</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Éclairage suffisant et uniforme</li>
          <li>• Aliment bien visible et centré</li>
          <li>• Éviter les ombres portées</li>
          <li>• Image nette et de bonne qualité</li>
        </ul>
      </div>
    </div>
  );
};

export default ScanModeSelector;