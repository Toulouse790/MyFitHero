// src/features/social/pages/SocialPageRefactored.tsx
import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/shared/hooks/use-toast';

// Import our new modular components and hooks
import { SocialHeader, SocialFeed, SocialChallenges } from '@/features/social/components';
import { useSocialData, useSocialModals } from '@/features/social/hooks';
import { SocialTab, FeedFilterType, ChallengeFilterType } from '@/features/social/types';

const SocialPageRefactored: React.FC = () => {
  const { toast } = useToast();
  
  // Custom hooks for data and modals
  const {
    posts,
    challenges,
    friends,
    userStats,
    loading,
    postsLoading,
    challengesLoading,
    loadPosts,
    loadChallenges,
    likePost,
    bookmarkPost,
    sharePost,
    joinChallenge,
    leaveChallenge,
  } = useSocialData();

  const {
    showCreatePost,
    showCreateChallenge,
    showComments,
    openCreatePost,
    openCreateChallenge,
    openComments,
    closeComments,
  } = useSocialModals();

  // Local state for UI
  const [activeTab, setActiveTab] = useState<SocialTab>('feed');
  const [feedFilter, setFeedFilter] = useState<FeedFilterType>('all');
  const [challengeFilter, setChallengeFilter] = useState<ChallengeFilterType>('active');

  // Handlers
  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      toast({
        title: 'Post liké !',
        description: 'Votre like a été enregistré.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de liker ce post.',
        variant: 'destructive',
      });
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      await bookmarkPost(postId);
      toast({
        title: 'Post sauvegardé !',
        description: 'Ce post a été ajouté à vos favoris.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder ce post.',
        variant: 'destructive',
      });
    }
  };

  const handleSharePost = async (postId: string) => {
    try {
      await sharePost(postId);
      toast({
        title: 'Post partagé !',
        description: 'Ce post a été partagé avec vos amis.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de partager ce post.',
        variant: 'destructive',
      });
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallenge(challengeId);
      toast({
        title: 'Défi rejoint !',
        description: 'Vous participez maintenant à ce défi.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre ce défi.',
        variant: 'destructive',
      });
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    try {
      await leaveChallenge(challengeId);
      toast({
        title: 'Défi quitté',
        description: 'Vous ne participez plus à ce défi.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de quitter ce défi.',
        variant: 'destructive',
      });
    }
  };

  const handleFeedFilterChange = async (newFilter: FeedFilterType) => {
    setFeedFilter(newFilter);
    await loadPosts(newFilter);
  };

  const handleChallengeFilterChange = async (newFilter: ChallengeFilterType) => {
    setChallengeFilter(newFilter);
    await loadChallenges(newFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with stats */}
        <SocialHeader userStats={userStats} loading={loading} />

        {/* Main Content */}
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SocialTab)}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-auto grid-cols-4">
                <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
                <TabsTrigger value="challenges">Défis</TabsTrigger>
                <TabsTrigger value="leaderboard">Classements</TabsTrigger>
                <TabsTrigger value="friends">Amis</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                {/* Filters */}
                {activeTab === 'feed' && (
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={feedFilter}
                      onChange={(e) => handleFeedFilterChange(e.target.value as FeedFilterType)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="all">Tout</option>
                      <option value="friends">Amis</option>
                      <option value="sport">Mon sport</option>
                    </select>
                  </div>
                )}

                {activeTab === 'challenges' && (
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={challengeFilter}
                      onChange={(e) => handleChallengeFilterChange(e.target.value as ChallengeFilterType)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="all">Tous</option>
                      <option value="active">Actifs</option>
                      <option value="available">Disponibles</option>
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <Button onClick={openCreatePost} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Publier
                </Button>
                <Button onClick={openCreateChallenge} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un défi
                </Button>
              </div>
            </div>

            {/* Tab Contents */}
            <TabsContent value="feed" className="space-y-6">
              <SocialFeed
                posts={posts}
                loading={postsLoading}
                onLikePost={handleLikePost}
                onBookmarkPost={handleBookmarkPost}
                onSharePost={handleSharePost}
                onShowComments={openComments}
              />
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <SocialChallenges
                challenges={challenges}
                loading={challengesLoading}
                onJoinChallenge={handleJoinChallenge}
                onLeaveChallenge={handleLeaveChallenge}
              />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Classements</h3>
                <p className="text-gray-500">Section en cours de développement</p>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Amis</h3>
                <p className="text-gray-500">Section en cours de développement</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* TODO: Add modals for creating posts, challenges, and viewing comments */}
      {/* These would be separate components as well */}
    </div>
  );
};

export default SocialPageRefactored;