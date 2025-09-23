// src/features/nutrition/components/NutritionTips.tsx
import React, { useState } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TipCategory {
  name: string;
  icon: string;
  tips: Array<{
    title: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

interface NutritionTipsProps {
  selectedSport: string;
  sportEmoji: string;
  onTipFavorite?: (tip: string) => void;
}

export const NutritionTips: React.FC<NutritionTipsProps> = ({
  selectedSport,
  sportEmoji,
  onTipFavorite,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);

  const tipCategories: TipCategory[] = [
    {
      name: 'Hydratation',
      icon: '💧',
      tips: [
        {
          title: 'Hydratation pré-effort',
          content: 'Buvez 500ml d\'eau 2h avant l\'entraînement pour optimiser vos performances.',
          priority: 'high'
        },
        {
          title: 'Électrolytes essentiels',
          content: 'Ajoutez une pincée de sel à votre eau lors d\'efforts prolongés (+1h).',
          priority: 'medium'
        },
        {
          title: 'Récupération hydrique',
          content: 'Pesez-vous avant/après l\'effort : buvez 150% du poids perdu en eau.',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Énergie',
      icon: '⚡',
      tips: [
        {
          title: 'Glucides pré-effort',
          content: 'Consommez 30-60g de glucides 30-60min avant l\'entraînement.',
          priority: 'high'
        },
        {
          title: 'Fenêtre anabolique',
          content: 'Mangez dans les 30min post-effort : 3:1 glucides/protéines.',
          priority: 'high'
        },
        {
          title: 'Charge glucidique',
          content: '3 jours avant une compétition, augmentez les glucides à 7-10g/kg.',
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Récupération',
      icon: '🔄',
      tips: [
        {
          title: 'Protéines complètes',
          content: 'Visez 20-25g de protéines complètes post-entraînement.',
          priority: 'high'
        },
        {
          title: 'Anti-inflammatoires naturels',
          content: 'Curcuma, gingembre, cerises : réduisent l\'inflammation musculaire.',
          priority: 'medium'
        },
        {
          title: 'Sommeil et nutrition',
          content: 'Évitez les gros repas 3h avant le coucher pour un sommeil réparateur.',
          priority: 'low'
        }
      ]
    }
  ];

  const getCurrentCategory = () => tipCategories[currentCategory];
  const getCurrentTip = () => getCurrentCategory().tips[currentTipIndex];

  const nextTip = () => {
    const category = getCurrentCategory();
    if (currentTipIndex < category.tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    } else if (currentCategory < tipCategories.length - 1) {
      setCurrentCategory(currentCategory + 1);
      setCurrentTipIndex(0);
    } else {
      setCurrentCategory(0);
      setCurrentTipIndex(0);
    }
  };

  const prevTip = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(currentTipIndex - 1);
    } else if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
      setCurrentTipIndex(tipCategories[currentCategory - 1].tips.length - 1);
    } else {
      setCurrentCategory(tipCategories.length - 1);
      setCurrentTipIndex(tipCategories[tipCategories.length - 1].tips.length - 1);
    }
  };

  const currentTip = getCurrentTip();
  const currentCat = getCurrentCategory();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité élevée';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Bon à savoir';
      default: return 'Info';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Conseils Nutrition</span>
          </h3>
          <span className="text-2xl">{sportEmoji}</span>
        </div>

        {/* Category indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {tipCategories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => {
                setCurrentCategory(index);
                setCurrentTipIndex(0);
              }}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                index === currentCategory
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Tip content */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentCat.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{currentTip.title}</h4>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentTip.priority)}`}>
                  {getPriorityLabel(currentTip.priority)}
                </span>
              </div>
            </div>
            {onTipFavorite && (
              <button
                onClick={() => onTipFavorite(currentTip.title)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Star className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {currentTip.content}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevTip}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Précédent</span>
          </button>

          <div className="text-sm text-gray-500">
            {currentTipIndex + 1} / {getCurrentCategory().tips.length} 
            <span className="mx-2">•</span>
            {currentCategory + 1} / {tipCategories.length}
          </div>

          <button
            onClick={nextTip}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="text-sm">Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-800">
            <span className="font-medium">💡 Adaptation {selectedSport} :</span>
            <span className="ml-1 text-yellow-700">
              Ces conseils sont adaptés à votre pratique sportive pour optimiser vos performances.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionTips;