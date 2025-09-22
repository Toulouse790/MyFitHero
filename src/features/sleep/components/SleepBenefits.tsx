// src/features/sleep/components/SleepBenefits.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Zap, 
  Shield, 
  Dumbbell, 
  RefreshCw,
  Star,
  TrendingUp
} from 'lucide-react';

interface SleepBenefitsProps {
  userSportCategory: string;
  sportEmoji: string;
  currentSleepHours: number;
  personalizedSleepGoal: number;
  showDetailedView: boolean;
}

export const SleepBenefits: React.FC<SleepBenefitsProps> = ({
  userSportCategory,
  sportEmoji,
  currentSleepHours,
  personalizedSleepGoal,
  showDetailedView,
}) => {
  const getSportSpecificBenefits = () => {
    const commonBenefits = [
      {
        icon: <Dumbbell className="h-5 w-5" />,
        title: "Performance physique",
        description: "Amélioration de la force et de l'endurance"
      },
      {
        icon: <RefreshCw className="h-5 w-5" />,
        title: "Récupération musculaire",
        description: "Réparation et croissance des tissus"
      },
      {
        icon: <Brain className="h-5 w-5" />,
        title: "Concentration",
        description: "Amélioration de la prise de décision"
      }
    ];

    const sportSpecific = {
      'Endurance': [
        {
          icon: <Heart className="h-5 w-5" />,
          title: "Système cardiovasculaire",
          description: "Optimisation du rythme cardiaque au repos"
        },
        {
          icon: <Zap className="h-5 w-5" />,
          title: "Capacité aérobie",
          description: "Amélioration de l'utilisation de l'oxygène"
        }
      ],
      'Force': [
        {
          icon: <Dumbbell className="h-5 w-5" />,
          title: "Synthèse protéique",
          description: "Optimisation de la croissance musculaire"
        },
        {
          icon: <Zap className="h-5 w-5" />,
          title: "Puissance explosive",
          description: "Amélioration de la force maximale"
        }
      ],
      'Sports de combat': [
        {
          icon: <Brain className="h-5 w-5" />,
          title: "Réflexes",
          description: "Amélioration du temps de réaction"
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: "Résistance au stress",
          description: "Meilleure gestion de la pression"
        }
      ],
      'Sports collectifs': [
        {
          icon: <Brain className="h-5 w-5" />,
          title: "Vision de jeu",
          description: "Amélioration de la lecture du jeu"
        },
        {
          icon: <TrendingUp className="h-5 w-5" />,
          title: "Coordination",
          description: "Optimisation des mouvements complexes"
        }
      ]
    };

    return [
      ...commonBenefits,
      ...(sportSpecific[userSportCategory as keyof typeof sportSpecific] || [])
    ];
  };

  const getSleepQualityLevel = () => {
    const percentage = (currentSleepHours / personalizedSleepGoal) * 100;
    if (percentage >= 100) return { level: 'Optimal', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (percentage >= 85) return { level: 'Bon', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (percentage >= 70) return { level: 'Acceptable', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: 'Insuffisant', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const getBenefitLevel = () => {
    const qualityLevel = getSleepQualityLevel();
    switch (qualityLevel.level) {
      case 'Optimal': return { percentage: 100, text: 'Bénéfices maximaux' };
      case 'Bon': return { percentage: 85, text: 'Bons bénéfices' };
      case 'Acceptable': return { percentage: 60, text: 'Bénéfices partiels' };
      default: return { percentage: 30, text: 'Bénéfices limités' };
    }
  };

  const benefits = getSportSpecificBenefits();
  const qualityLevel = getSleepQualityLevel();
  const benefitLevel = getBenefitLevel();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Bénéfices du sommeil</span>
          </div>
          <Badge variant="outline">
            {userSportCategory} {sportEmoji}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Niveau actuel */}
          <div className={`p-3 rounded-lg ${qualityLevel.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className={`h-4 w-4 ${qualityLevel.color}`} />
                <span className={`font-medium text-sm ${qualityLevel.color}`}>
                  Niveau actuel: {qualityLevel.level}
                </span>
              </div>
              <span className={`text-sm font-bold ${qualityLevel.color}`}>
                {benefitLevel.percentage}%
              </span>
            </div>
            <div className={`text-xs ${qualityLevel.color.replace('text-', 'text-').replace('-600', '-700')}`}>
              {benefitLevel.text} pour votre sport
            </div>
          </div>

          {/* Liste des bénéfices */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">
              Bénéfices pour {userSportCategory.toLowerCase()}
            </h4>
            
            <div className="grid gap-3">
              {benefits.slice(0, showDetailedView ? benefits.length : 4).map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    benefitLevel.percentage >= 70 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 p-1 rounded ${
                    benefitLevel.percentage >= 70 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      benefitLevel.percentage >= 70 ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {benefit.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      benefitLevel.percentage >= 70 ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {benefit.description}
                    </div>
                  </div>
                  {benefitLevel.percentage >= 70 && (
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        Actif
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message d'encouragement */}
          <div className="pt-3 border-t border-gray-200">
            <div className="text-center text-xs text-gray-600">
              {benefitLevel.percentage >= 85 ? (
                <span className="text-green-600 font-medium">
                  🎉 Excellent ! Votre sommeil optimise vos performances sportives
                </span>
              ) : benefitLevel.percentage >= 70 ? (
                <span className="text-blue-600">
                  👍 Bon sommeil ! Quelques heures de plus pour maximiser les bénéfices
                </span>
              ) : (
                <span className="text-orange-600">
                  ⚠️ Améliorez votre sommeil pour débloquer tous les bénéfices
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepBenefits;