import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { BadgeService, UserBadge, BadgeProgress } from '@/lib/services/badgeService';

interface BadgeDisplayProps {
  badges: UserBadge[];
  progress?: BadgeProgress[];
  showProgress?: boolean;
  layout?: 'grid' | 'list';
  className?: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  progress = [],
  showProgress = true,
  layout = 'grid',
  className = '',
}) => {
  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'milestone':
        return <Star className="w-5 h-5" />;
      case 'consistency':
        return <Target className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'common':
        return 'bg-gradient-to-r from-green-500 to-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (layout === 'list') {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Mes badges</span>
            <Badge variant="outline">{badges.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className={`w-12 h-12 rounded-full ${getBadgeColor(badge.rarity)} flex items-center justify-center text-white`}>
                  {getBadgeIcon(badge.category)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {badge.rarity}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {showProgress && progress.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Progression vers nouveaux badges</h4>
                <div className="space-y-3">
                  {progress.map((prog) => (
                    <div key={prog.badgeId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{prog.badgeName}</span>
                        <span className="text-sm text-gray-600">
                          {prog.current}/{prog.target}
                        </span>
                      </div>
                      <Progress value={(prog.current / prog.target) * 100} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">{prog.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5" />
          <span>Mes badges</span>
          <Badge variant="outline">{badges.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full ${getBadgeColor(badge.rarity)} flex items-center justify-center text-white mb-2`}>
                {getBadgeIcon(badge.category)}
              </div>
              <h4 className="font-medium text-sm">{badge.name}</h4>
              <Badge variant="outline" className="text-xs mt-1">
                {badge.rarity}
              </Badge>
            </div>
          ))}
        </div>
        
        {showProgress && progress.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Prochains badges</h4>
            <div className="space-y-2">
              {progress.slice(0, 3).map((prog) => (
                <div key={prog.badgeId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{prog.badgeName}</span>
                    <span className="text-gray-600">
                      {prog.current}/{prog.target}
                    </span>
                  </div>
                  <Progress value={(prog.current / prog.target) * 100} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { BadgeDisplay };