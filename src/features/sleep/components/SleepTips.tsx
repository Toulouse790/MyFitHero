// src/features/sleep/components/SleepTips.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Lightbulb, 
  Moon, 
  Sun, 
  Thermometer, 
  Coffee, 
  Smartphone,
  Utensils,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface SportSleepConfig {
  tips: string[];
}

interface SleepTipsProps {
  sportConfig: SportSleepConfig;
  userSportCategory: string;
  sportEmoji: string;
  showDetailedView: boolean;
  onToggleDetailedView: () => void;
}

export const SleepTips: React.FC<SleepTipsProps> = ({
  sportConfig,
  userSportCategory,
  sportEmoji,
  showDetailedView,
  onToggleDetailedView,
}) => {
  const getGeneralTips = () => [
    {
      icon: <Moon className="h-4 w-4" />,
      category: "Environnement",
      tip: "Chambre fraîche (16-19°C), sombre et silencieuse",
      priority: "high"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      category: "Routine",
      tip: "Couchez-vous et levez-vous à heures fixes",
      priority: "high"
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      category: "Écrans",
      tip: "Évitez les écrans 1h avant le coucher",
      priority: "medium"
    },
    {
      icon: <Coffee className="h-4 w-4" />,
      category: "Caféine",
      tip: "Pas de caféine après 15h",
      priority: "medium"
    },
    {
      icon: <Utensils className="h-4 w-4" />,
      category: "Repas",
      tip: "Dîner léger 2-3h avant le coucher",
      priority: "medium"
    },
    {
      icon: <Sun className="h-4 w-4" />,
      category: "Lumière",
      tip: "Exposition à la lumière naturelle le matin",
      priority: "low"
    },
    {
      icon: <Thermometer className="h-4 w-4" />,
      category: "Relaxation",
      tip: "Bain chaud ou douche chaude avant le coucher",
      priority: "low"
    }
  ];

  const getSportSpecificTips = () => {
    const sportTips = {
      'Endurance': [
        "Hydratation progressive après l'entraînement",
        "Étirements légers avant le coucher",
        "Compression pour la récupération",
        "Évitez l'entraînement intensif 3h avant le coucher"
      ],
      'Force': [
        "Protéines avant le coucher pour la récupération",
        "Bain de glace post-entraînement si besoin",
        "Massage ou automassage le soir",
        "Planifiez les séances lourdes en matinée"
      ],
      'Sports de combat': [
        "Méditation ou respiration pour décompresser",
        "Évitez les sparrings en soirée",
        "Technique de visualisation positive",
        "Routines de récupération mentale"
      ],
      'Sports collectifs': [
        "Récupération active après les matchs",
        "Nutrition adaptée selon l'horaire des matchs",
        "Sieste de 20min si match en soirée",
        "Décompression sociale modérée"
      ]
    };

    return sportTips[userSportCategory as keyof typeof sportTips] || [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">Essentiel</Badge>;
      case 'medium': return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Important</Badge>;
      default: return <Badge variant="outline" className="text-xs">Bonus</Badge>;
    }
  };

  const generalTips = getGeneralTips();
  const sportSpecificTips = getSportSpecificTips();
  const visibleGeneralTips = showDetailedView ? generalTips : generalTips.filter(tip => tip.priority === 'high');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Conseils sommeil</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {userSportCategory} {sportEmoji}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDetailedView}
              className="text-gray-600 hover:text-gray-800"
            >
              {showDetailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Conseils généraux */}
          <div>
            <h4 className="font-medium text-sm mb-3 text-gray-700">Conseils généraux</h4>
            <div className="space-y-2">
              {visibleGeneralTips.map((tip, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getPriorityColor(tip.priority)}`}
                >
                  <div className="flex-shrink-0 p-1">
                    {tip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{tip.category}</span>
                      {getPriorityBadge(tip.priority)}
                    </div>
                    <div className="text-xs text-gray-600">{tip.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conseils spécifiques au sport */}
          {sportSpecificTips.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 text-gray-700">
                Spécifique à {userSportCategory.toLowerCase()}
              </h4>
              <div className="space-y-2">
                {sportSpecificTips.slice(0, showDetailedView ? sportSpecificTips.length : 2).map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50"
                  >
                    <div className="flex-shrink-0 p-1">
                      <Lightbulb className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-indigo-800">{tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conseils configurés */}
          {sportConfig.tips.length > 0 && showDetailedView && (
            <div>
              <h4 className="font-medium text-sm mb-3 text-gray-700">Conseils personnalisés</h4>
              <div className="space-y-2">
                {sportConfig.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-green-200 bg-green-50"
                  >
                    <div className="flex-shrink-0 p-1">
                      <Moon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-green-800">{tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton pour voir plus/moins */}
          <div className="pt-3 border-t border-gray-200 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDetailedView}
              className="text-gray-600 hover:text-gray-800"
            >
              {showDetailedView ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Voir moins
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir tous les conseils
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTips;