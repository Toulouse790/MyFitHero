// src/features/sleep/components/SleepStats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BarChart3, Target, Clock } from 'lucide-react';

interface SleepStats {
  averageSleep: number;
  sleepConsistency: number;
  qualityAverage: number;
  weeklyGoalProgress: number;
  totalSleepThisWeek: number;
  bestNight: {
    date: string;
    hours: number;
    quality: number;
  } | null;
  improvementTrend: 'improving' | 'stable' | 'declining';
}

interface SleepStatsProps {
  sleepStats: SleepStats;
  personalizedSleepGoal: number;
  userSportCategory: string;
  sportEmoji: string;
  showDetailedView: boolean;
}

export const SleepStats: React.FC<SleepStatsProps> = ({
  sleepStats,
  personalizedSleepGoal,
  userSportCategory,
  sportEmoji,
  showDetailedView,
}) => {
  const getTrendIcon = () => {
    switch (sleepStats.improvementTrend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = () => {
    switch (sleepStats.improvementTrend) {
      case 'improving': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getTrendText = () => {
    switch (sleepStats.improvementTrend) {
      case 'improving': return 'En amélioration';
      case 'declining': return 'En baisse';
      default: return 'Stable';
    }
  };

  const getConsistencyColor = () => {
    if (sleepStats.sleepConsistency >= 80) return 'text-green-600';
    if (sleepStats.sleepConsistency >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityColor = () => {
    if (sleepStats.qualityAverage >= 4) return 'text-green-600';
    if (sleepStats.qualityAverage >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Statistiques</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {userSportCategory} {sportEmoji}
            </Badge>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{getTrendText()}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistiques principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sleepStats.averageSleep.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-600">Moyenne quotidienne</div>
              <div className="text-xs text-gray-500 mt-1">
                Objectif: {personalizedSleepGoal}h
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${getQualityColor()}`}>
                {sleepStats.qualityAverage.toFixed(1)}/5
              </div>
              <div className="text-xs text-gray-600">Qualité moyenne</div>
              <div className="text-xs text-gray-500 mt-1">
                {sleepStats.qualityAverage >= 4 ? 'Excellent' : 
                 sleepStats.qualityAverage >= 3 ? 'Bon' : 'À améliorer'}
              </div>
            </div>
          </div>

          {showDetailedView && (
            <>
              {/* Progression hebdomadaire */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Objectif hebdomadaire</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(sleepStats.weeklyGoalProgress)}%
                  </span>
                </div>
                <Progress 
                  value={sleepStats.weeklyGoalProgress} 
                  className="h-2 mb-2" 
                />
                <div className="text-xs text-gray-600">
                  {sleepStats.totalSleepThisWeek.toFixed(1)}h sur {(personalizedSleepGoal * 7).toFixed(1)}h cette semaine
                </div>
              </div>

              {/* Consistance */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">Régularité</span>
                  </div>
                  <span className={`text-sm font-bold ${getConsistencyColor()}`}>
                    {Math.round(sleepStats.sleepConsistency)}%
                  </span>
                </div>
                <Progress 
                  value={sleepStats.sleepConsistency} 
                  className="h-2 mb-2" 
                />
                <div className="text-xs text-gray-600">
                  {sleepStats.sleepConsistency >= 80 ? 'Très régulier' :
                   sleepStats.sleepConsistency >= 60 ? 'Assez régulier' : 'Irrégulier'}
                </div>
              </div>

              {/* Meilleure nuit */}
              {sleepStats.bestNight && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm text-green-800">Meilleure nuit</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-green-700">{sleepStats.bestNight.date}</div>
                      <div className="text-green-600">Date</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-700">{sleepStats.bestNight.hours}h</div>
                      <div className="text-green-600">Durée</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-700">{sleepStats.bestNight.quality}/5</div>
                      <div className="text-green-600">Qualité</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Résumé sport */}
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              Optimisé pour les athlètes de {userSportCategory.toLowerCase()} • 
              Objectif personnel: {personalizedSleepGoal}h/nuit
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepStats;