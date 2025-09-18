// src/features/nutrition/components/ScanningProgress.tsx
import React from 'react';
import { Loader } from 'lucide-react';

interface ScanningProgressProps {
  isScanning: boolean;
  message?: string;
  subMessage?: string;
}

export const ScanningProgress: React.FC<ScanningProgressProps> = ({
  isScanning,
  message = "Analyse en cours...",
  subMessage = "Reconnaissance de l'aliment et calcul nutritionnel"
}) => {
  if (!isScanning) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
      
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900">
          {message}
        </p>
        <p className="text-sm text-gray-600">
          {subMessage}
        </p>
      </div>

      {/* Animation de progression */}
      <div className="mt-6 max-w-sm mx-auto">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Traitement de l'image...
        </div>
      </div>
    </div>
  );
};

export default ScanningProgress;