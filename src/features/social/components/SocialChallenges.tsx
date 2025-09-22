// src/features/social/components/SocialChallenges.tsx
import React from 'react';
import { Target, Trophy, Users, Calendar, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExtendedChallenge as Challenge } from '@/features/social/types';

interface SocialChallengesProps {
  challenges: Challenge[];
  loading: boolean;
  onJoinChallenge: (challengeId: string) => void;
  onLeaveChallenge: (challengeId: string) => void;
}

export const SocialChallenges: React.FC<SocialChallengesProps> = ({
  challenges,
  loading,
  onJoinChallenge,
  onLeaveChallenge,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      case 'expert':
        return 'Expert';
      default:
        return difficulty;
    }
  };

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'workout':
        return '💪';
      case 'nutrition':
        return '🥗';
      case 'hydration':
        return '💧';
      case 'sleep':
        return '😴';
      default:
        return '🎯';
    }
  };

  const formatDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Terminé';
    if (diffDays === 1) return '1 jour restant';
    return `${diffDays} jours restants`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {challenges.length === 0 ? (
        <Card className="p-8 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Aucun défi disponible</p>
          <p className="text-sm text-gray-400">Revenez plus tard pour découvrir de nouveaux défis !</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getPillarIcon(challenge.pillar || 'general')}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {challenge.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {getDifficultyLabel(challenge.difficulty)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {challenge.challenge_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-600 mb-1">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{challenge.reward_points || 0} pts</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Challenge Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>
                      {challenge.target_value || 0} {challenge.target_unit || ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants_count} participants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{challenge.duration_days} jours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{formatDaysLeft(challenge.end_date.toISOString())}</span>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={challenge.creator.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {(challenge.creator.name || challenge.creator.display_name)?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    Créé par <span className="font-medium">{challenge.creator.name}</span>
                  </span>
                </div>

                {/* Progress (if participating) */}
                {challenge.is_participating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium text-blue-600">
                        {challenge.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={challenge.progress_percentage} className="h-2" />
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {challenge.is_participating ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Défi rejoint</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLeaveChallenge(challenge.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Quitter
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => onJoinChallenge(challenge.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Rejoindre le défi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};