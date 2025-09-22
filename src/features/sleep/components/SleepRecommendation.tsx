// src/features/sleep/components/SleepRecommendation.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Lightbulb, Coffee } from 'lucide-react';

interface SleepSession {
  id: string;
  bedtime?: string;
  wake_time?: string;
  quality_rating?: number;
}

interface SportSleepConfig {
  optimalSleep: number;
  bedtimeRange: string;
  wakeTimeRange: string;
  recoveryImportance: 'Critique' | 'Élevée' | 'Modérée';
  tips: string[];
}

interface SleepRecommendationProps {
  currentSleep: SleepSession | null;
  sleepDeficit: number;
  userSportCategory: string;
  sportEmoji: string;
  sportConfig: SportSleepConfig;
  personalizedRecommendations: string[];
}

export const SleepRecommendation: React.FC<SleepRecommendationProps> = ({
  currentSleep,
  sleepDeficit,
  userSportCategory,
  sportEmoji,
  sportConfig,
  personalizedRecommendations,
}) => {
  const getRecommendationType = () => {
    if (!currentSleep) return 'info';
    if (sleepDeficit > 1.5) return 'urgent';
    if (sleepDeficit > 0.5) return 'warning';
    return 'success';
  };

  const getRecommendationColor = () => {
    const type = getRecommendationType();
    switch (type) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getRecommendationIcon = () => {
    const type = getRecommendationType();
    switch (type) {
      case 'urgent': return <Coffee className="h-5 w-5 text-red-600" />;
      case 'warning': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'success': return <Lightbulb className="h-5 w-5 text-green-600" />;
      default: return <Lightbulb className="h-5 w-5 text-blue-600" />;
    }
  };

  const getMainRecommendation = () => {
    if (!currentSleep) {
      return "Enregistrez votre sommeil pour des recommandations personnalisées.";
    }
    
    if (sleepDeficit > 1.5) {
      return `Déficit important de ${(sleepDeficit * 60).toFixed(0)} min ! Priorité à la récupération aujourd'hui.`;
    }
    
    if (sleepDeficit > 0.5) {
      return `Déficit de ${(sleepDeficit * 60).toFixed(0)} min. Couchez-vous 30 min plus tôt ce soir.`;
    }
    
    return "Excellent sommeil ! Maintenez cette routine pour optimiser vos performances.";
  };

  return (
    <Card className={`${getRecommendationColor()} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            {getRecommendationIcon()}
            <span>Recommandations</span>
          </div>
          <Badge variant="outline" className="border-current">
            {userSportCategory} {sportEmoji}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-white/50 rounded-lg border border-current/20">
            <p className="font-medium text-sm">{getMainRecommendation()}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Horaires optimaux pour {userSportCategory.toLowerCase()}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white/30 rounded">
                <div className="font-medium">Coucher</div>
                <div>{sportConfig.bedtimeRange}</div>
              </div>
              <div className="p-2 bg-white/30 rounded">
                <div className="font-medium">Réveil</div>
                <div>{sportConfig.wakeTimeRange}</div>
              </div>
            </div>
          </div>

          {personalizedRecommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
                <Lightbulb className="h-4 w-4" />
                <span>Conseils personnalisés</span>
              </h4>
              <ul className="space-y-1">
                {personalizedRecommendations.slice(0, 3).map((tip, index) => (
                  <li key={index} className="text-xs flex items-start space-x-2">
                    <span className="text-current/60 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-current/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-current/70">Importance récupération:</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  sportConfig.recoveryImportance === 'Critique' 
                    ? 'bg-red-100 text-red-700' 
                    : sportConfig.recoveryImportance === 'Élevée'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {sportConfig.recoveryImportance}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepRecommendation;