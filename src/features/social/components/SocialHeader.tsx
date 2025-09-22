// src/features/social/components/SocialHeader.tsx
import React from 'react';
import { Users, Trophy, Target, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UniformHeader } from '../../profile/components/UniformHeader';
import { UserStats } from '../types';

interface SocialHeaderProps {
  userStats: UserStats | null;
  loading: boolean;
}

export const SocialHeader: React.FC<SocialHeaderProps> = ({ userStats, loading }) => {
  if (loading || !userStats) {
    return (
      <div className="space-y-4">
        <UniformHeader 
          title="Social"
          subtitle="Connectez-vous avec la communauté MyFitHero"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Amis',
      value: userStats.friends_count,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Target,
      label: 'Défis actifs',
      value: userStats.active_challenges,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Trophy,
      label: 'Rang mondial',
      value: `#${userStats.global_rank}`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Medal,
      label: 'Points',
      value: userStats.total_points.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Target,
      label: 'Série',
      value: `${userStats.streak_days}j`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Trophy,
      label: 'Exploits',
      value: userStats.achievements_count,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="space-y-6">
      <UniformHeader 
        title="Social"
        subtitle="Connectez-vous avec la communauté MyFitHero"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Badge */}
      {userStats.streak_days > 7 && (
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
            🔥 Série de {userStats.streak_days} jours !
          </Badge>
        </div>
      )}
    </div>
  );
};