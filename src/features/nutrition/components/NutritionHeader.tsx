// src/features/nutrition/components/NutritionHeader.tsx
import React from 'react';
import { Apple, AlertTriangle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NutritionHeaderProps {
  sportEmoji: string;
  profileIncomplete: boolean;
  onCompleteProfile: () => void;
  onOpenCoaching?: () => void;
}

export const NutritionHeader: React.FC<NutritionHeaderProps> = ({
  sportEmoji,
  profileIncomplete,
  onCompleteProfile,
  onOpenCoaching,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      {/* Header avec icône Apple et typography */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
          <Apple className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-3">
          <span>Nutrition</span>
          {onOpenCoaching && (
            <Button
              onClick={onOpenCoaching}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              Coach IA
            </Button>
          )}
        </h1>
        <p className="text-gray-600 text-sm">
          {sportEmoji} Optimisez votre alimentation pour vos performances
        </p>
      </div>

      {/* Alerte Profil Incomplet */}
      {profileIncomplete && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-orange-800 font-medium text-sm mb-1">
                Profil incomplet
              </h3>
              <p className="text-orange-700 text-xs mb-3">
                Pour des recommandations nutritionnelles précises, veuillez compléter votre
                profil (poids, taille, âge).
              </p>
              <Button
                onClick={onCompleteProfile}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
              >
                Compléter mon profil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionHeader;