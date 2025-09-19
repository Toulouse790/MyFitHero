// src/features/social/components/SocialFeed.tsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { SocialPost } from '../types';

interface SocialFeedProps {
  posts: SocialPost[];
  loading: boolean;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onShowComments: (postId: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  loading,
  onLikePost,
  onBookmarkPost,
  onSharePost,
  onShowComments,
}) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      return `il y a ${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `il y a ${Math.floor(diffInMinutes / 1440)}j`;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'workout':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'progress':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'challenge':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'Exploit';
      case 'workout':
        return 'Entraînement';
      case 'progress':
        return 'Progrès';
      case 'challenge':
        return 'Défi';
      default:
        return 'Publication';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="ml-4 space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar_url} />
              <AvatarFallback>
                {post.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{post.user.name}</p>
                <span className="text-xs text-gray-500">@{post.user.username}</span>
                <Badge variant="outline" className={getPostTypeColor(post.post_type)}>
                  {getPostTypeLabel(post.post_type)}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{post.content}</p>

            {/* Achievements */}
            {post.achievements && post.achievements.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 font-medium text-sm">🏆 Exploit débloqué</span>
                </div>
                {post.achievements.map((achievement: any, index) => (
                  <div key={index} className="mt-2">
                    <p className="text-sm text-yellow-800">
                      {achievement.description}: <strong>{achievement.value}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.is_liked ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{post.likes_count}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShowComments(post.id)}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments_count}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSharePost(post.id)}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">{post.shares_count}</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmarkPost(post.id)}
                className={`${post.is_bookmarked ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <Bookmark className={`w-4 h-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {posts.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Aucune publication pour le moment</p>
        </Card>
      )}
    </div>
  );
};