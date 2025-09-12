import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Target, Calendar } from 'lucide-react';
import { UserDataService, UserStats } from '@/services/userDataService';
import { BadgeService } from '@/services/badgeService';

interface StatsOverviewProps {
  userId?: string;
  timeframe?: 'week' | 'month' | 'year';
  showBadges?: boolean;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  userId,
  timeframe = 'week',
  showBadges = true,
  className = '',
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    if (showBadges) {
      loadRecentBadges();
    }
  }, [userId, timeframe]);

  const loadStats = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const userStats = await UserDataService.getUserStats(userId, timeframe);
      setStats(userStats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentBadges = async () => {
    if (!userId) return;

    try {
      const userBadges = await BadgeService.getUserBadges(userId);
      // Prendre les 3 badges les plus récents
      const recentBadges = userBadges
        .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
        .slice(0, 3);
      setBadges(recentBadges);
    } catch (error) {
      console.error('Erreur chargement badges:', error);
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week':
        return 'Cette semaine';
      case 'month':
        return 'Ce mois';
      case 'year':
        return 'Cette année';
      default:
        return 'Période';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const formatTrend = (trend: number) => {
    const absValue = Math.abs(trend);
    const sign = trend > 0 ? '+' : trend < 0 ? '-' : '';
    return `${sign}${absValue.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>Aperçu des statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>Aperçu des statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Aucune donnée disponible pour {getTimeframeLabel().toLowerCase()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Aperçu des statistiques</span>
          <Badge variant="outline">{getTimeframeLabel()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Activité physique */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Activité physique</span>
              {getTrendIcon(stats.workoutTrend || 0)}
            </div>
            <div className="text-2xl font-bold">{stats.totalWorkouts || 0}</div>
            <div className="text-xs text-gray-600">
              séances ({formatTrend(stats.workoutTrend || 0)})
            </div>
          </div>

          {/* Objectifs atteints */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Objectifs atteints</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.goalsAchieved || 0}</div>
            <div className="text-xs text-gray-600">
              sur {stats.totalGoals || 0} objectifs
            </div>
          </div>

          {/* Constance */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Constance</span>
              <Calendar className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{stats.consistencyScore || 0}%</div>
            <div className="text-xs text-gray-600">score de régularité</div>
          </div>

          {/* Progression générale */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression</span>
              {getTrendIcon(stats.overallProgress || 0)}
            </div>
            <div className="text-2xl font-bold">{stats.overallProgress || 0}%</div>
            <div className="text-xs text-gray-600">progression globale</div>
          </div>
        </div>

        {/* Progression par pilier */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium">Progression par pilier</h4>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Entraînement</span>
                <span>{stats.workoutProgress || 0}%</span>
              </div>
              <Progress value={stats.workoutProgress || 0} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Nutrition</span>
                <span>{stats.nutritionProgress || 0}%</span>
              </div>
              <Progress value={stats.nutritionProgress || 0} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sommeil</span>
                <span>{stats.sleepProgress || 0}%</span>
              </div>
              <Progress value={stats.sleepProgress || 0} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hydratation</span>
                <span>{stats.hydrationProgress || 0}%</span>
              </div>
              <Progress value={stats.hydrationProgress || 0} className="h-2" />
            </div>
          </div>
        </div>

        {/* Badges récents */}
        {showBadges && badges.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Badges récents</h4>
            <div className="flex space-x-2">
              {badges.map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white mb-1">
                    🏆
                  </div>
                  <span className="text-xs">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { StatsOverview };