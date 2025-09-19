// src/features/nutrition/components/NutritionActions.tsx
import React from 'react';
import { Camera, Share2, Download, Settings, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

interface NutritionActionsProps {
  onPhotoScan: () => void;
  onShareProgress: () => void;
  onExportData: () => void;
  onOpenSettings: () => void;
  onViewHistory: () => void;
  onViewAnalytics: () => void;
  sportEmoji: string;
}

export const NutritionActions: React.FC<NutritionActionsProps> = ({
  onPhotoScan,
  onShareProgress,
  onExportData,
  onOpenSettings,
  onViewHistory,
  onViewAnalytics,
  sportEmoji,
}) => {
  const primaryActions = [
    {
      label: 'Scanner Photo',
      icon: Camera,
      onClick: onPhotoScan,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Analysez votre repas'
    },
    {
      label: 'Historique',
      icon: Calendar,
      onClick: onViewHistory,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Voir vos repas passés'
    },
    {
      label: 'Analyses',
      icon: TrendingUp,
      onClick: onViewAnalytics,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Tendances nutrition'
    }
  ];

  const secondaryActions = [
    {
      label: 'Partager',
      icon: Share2,
      onClick: onShareProgress,
      description: 'Partagez vos progrès'
    },
    {
      label: 'Exporter',
      icon: Download,
      onClick: onExportData,
      description: 'Télécharger les données'
    },
    {
      label: 'Paramètres',
      icon: Settings,
      onClick: onOpenSettings,
      description: 'Configurer la nutrition'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Actions Rapides
          </h3>
          <span className="text-2xl">{sportEmoji}</span>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {primaryActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className="h-6 w-6" />
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs opacity-90">{action.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {secondaryActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-gray-900 text-sm">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">7</div>
            <div className="text-xs text-blue-600">Jours de suivi</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">85%</div>
            <div className="text-xs text-green-600">Objectifs atteints</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">42</div>
            <div className="text-xs text-purple-600">Repas analysés</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-700">12</div>
            <div className="text-xs text-orange-600">Conseils suivis</div>
          </div>
        </div>

        {/* Sport-specific reminder */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{sportEmoji}</span>
            <div className="flex-1">
              <div className="font-medium text-blue-900 text-sm">
                Conseil du jour pour votre sport
              </div>
              <div className="text-blue-700 text-sm">
                Pensez à adapter votre nutrition selon l'intensité et la durée de vos entraînements.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionActions;