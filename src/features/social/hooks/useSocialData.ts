// src/features/social/hooks/useSocialData.ts
import { useState, useCallback, useEffect } from 'react';
import { appStore } from '../../../store/appStore';
import { 
  SocialPost, 
  ExtendedChallenge as Challenge, 
  Friend, 
  UserStats, 
  FeedFilterType, 
  ChallengeFilterType 
} from '../types';

export interface UseSocialDataReturn {
  // States
  posts: SocialPost[];
  challenges: Challenge[];
  friends: Friend[];
  userStats: UserStats | null;
  
  // Loading states
  loading: boolean;
  postsLoading: boolean;
  challengesLoading: boolean;
  
  // Actions
  loadUserStats: () => Promise<void>;
  loadPosts: (filter?: FeedFilterType) => Promise<void>;
  loadChallenges: (filter?: ChallengeFilterType) => Promise<void>;
  loadFriends: () => Promise<void>;
  
  // Post actions
  likePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  
  // Challenge actions
  joinChallenge: (challengeId: string) => Promise<void>;
  leaveChallenge: (challengeId: string) => Promise<void>;
}

export const useSocialData = (): UseSocialDataReturn => {
  const { appStoreUser } = appStore();
  
  // States
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [challengesLoading, setChallengesLoading] = useState(false);

  const loadUserStats = useCallback(async () => {
    if (!appStoreUser?.id) return;

    try {
      const mockStats: UserStats = {
        friends_count: 24,
        active_challenges: 8,
        global_rank: 47,
        total_points: 1240,
        streak_days: 12,
        achievements_count: 15,
      };
      setUserStats(mockStats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  }, [appStoreUser?.id]);

  const loadPosts = useCallback(async (filter: FeedFilterType = 'all') => {
    if (!appStoreUser?.id) return;

    setPostsLoading(true);
    try {
      const mockPosts: SocialPost[] = [
        {
          id: '1',
          user_id: 'user1',
          content: `Nouveau record personnel ! 🔥 J'ai terminé mon entraînement ${appStoreUser.sport} en 45min aujourd'hui. Les conseils de l'IA MyFitHero ont vraiment payé !`,
          post_type: 'achievement',
          media_urls: [],
          likes_count: 23,
          comments_count: 7,
          shares_count: 3,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user1',
            name: 'Marie Dupont',
            username: 'marie_fit',
            avatar_url: '',
            sport: appStoreUser.sport || 'fitness',
            level: 8,
          },
          achievements: [
            {
              type: 'personal_record',
              value: '45min',
              description: `Record ${appStoreUser.sport}`,
            },
          ],
          comments: [
            {
              id: 'c1',
              post_id: '1',
              user_id: 'user2',
              content: 'Bravo Marie ! Quel est ton secret ?',
              created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              user: {
                name: 'Thomas Martin',
                username: 'tom_athlete',
                avatar_url: '',
              },
            },
          ],
        },
        {
          id: '2',
          user_id: 'user2',
          content: `Défi ${appStoreUser.sport} de la semaine : qui peut tenir la position la plus longtemps ? 💪 J'ai tenu 2min30s ! #MyFitHeroChallenge`,
          post_type: 'challenge',
          media_urls: [],
          likes_count: 41,
          comments_count: 12,
          shares_count: 8,
          is_liked: true,
          is_bookmarked: true,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user2',
            name: 'Thomas Martin',
            username: 'tom_athlete',
            sport: appStoreUser.sport || 'fitness',
            level: 12,
          },
          comments: [],
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    } finally {
      setPostsLoading(false);
    }
  }, [appStoreUser?.id, appStoreUser?.sport]);

  const loadChallenges = useCallback(async (filter: ChallengeFilterType = 'active') => {
    if (!appStoreUser?.id) return;

    setChallengesLoading(true);
    try {
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: `Défi ${appStoreUser.sport} 30 jours`,
          description: `Entraînement quotidien de ${appStoreUser.sport} pendant 30 jours`,
          creator_id: 'creator1',
          pillar: 'workout',
          challenge_type: 'community' as any,
          category: 'fitness' as any,
          target_value: 30,
          target_unit: 'jours',
          duration_days: 30,
          difficulty: 'medium' as any,
          reward_points: 500,
          start_date: new Date(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          participants_count: 127,
          is_participating: true,
          progress_percentage: 40,
          status: 'active' as any,
          is_public: true,
          rules: [],
          created_at: new Date(),
          creator: {
            id: 'creator1',
            username: 'coach_sophie',
            display_name: 'Coach Sophie',
            name: 'Coach Sophie',
            avatar_url: '',
            fitness_level: 'expert',
            primary_goals: ['coaching'],
            follower_count: 1200,
            following_count: 50,
            is_verified: true,
          },
        },
        {
          id: '2',
          title: 'Hydratation Parfaite',
          description: "Boire 2.5L d'eau par jour pendant 14 jours",
          creator_id: 'creator2',
          pillar: 'hydration',
          challenge_type: 'individual' as any,
          category: 'health' as any,
          target_value: 2.5,
          target_unit: 'litres/jour',
          duration_days: 14,
          difficulty: 'easy' as any,
          reward_points: 200,
          start_date: new Date(),
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          participants_count: 89,
          is_participating: false,
          progress_percentage: 0,
          status: 'active' as any,
          is_public: true,
          rules: [],
          created_at: new Date(),
          creator: {
            id: 'creator2',
            username: 'dr_nutrition',
            display_name: 'Dr. Martin',
            name: 'Dr. Martin',
            avatar_url: '',
            fitness_level: 'expert',
            primary_goals: ['nutrition'],
            follower_count: 800,
            following_count: 100,
            is_verified: true,
          },
        },
      ];

      setChallenges(mockChallenges);
    } catch (error) {
      console.error('Erreur chargement challenges:', error);
    } finally {
      setChallengesLoading(false);
    }
  }, [appStoreUser?.id, appStoreUser?.sport]);

  const loadFriends = useCallback(async () => {
    if (!appStoreUser?.id) return;

    try {
      const mockFriends: Friend[] = [
        {
          id: 'friend1',
          name: 'Marie Dupont',
          username: 'marie_fit',
          avatar_url: '',
          sport: appStoreUser.sport || 'fitness',
          level: 8,
          is_online: true,
          mutual_friends: 5,
          last_activity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: 'friend2',
          name: 'Thomas Martin',
          username: 'tom_athlete',
          avatar_url: '',
          sport: 'crossfit',
          level: 12,
          is_online: false,
          mutual_friends: 3,
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'friend3',
          name: 'Sophie Laurent',
          username: 'sophie_coach',
          avatar_url: '',
          sport: appStoreUser.sport || 'fitness',
          level: 15,
          is_online: true,
          mutual_friends: 8,
          last_activity: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
      ];

      setFriends(mockFriends);
    } catch (error) {
      console.error('Erreur chargement friends:', error);
    }
  }, [appStoreUser?.id, appStoreUser?.sport]);

  // Post actions
  const likePost = useCallback(async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            is_liked: !post.is_liked,
            likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
          }
        : post
    ));
  }, []);

  const bookmarkPost = useCallback(async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, is_bookmarked: !post.is_bookmarked }
        : post
    ));
  }, []);

  const sharePost = useCallback(async (postId: string) => {
    // Mock share functionality
    console.log('Sharing post:', postId);
  }, []);

  // Challenge actions
  const joinChallenge = useCallback(async (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? {
            ...challenge,
            is_participating: true,
            participants_count: challenge.participants_count + 1
          }
        : challenge
    ));
  }, []);

  const leaveChallenge = useCallback(async (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? {
            ...challenge,
            is_participating: false,
            participants_count: Math.max(0, challenge.participants_count - 1),
            progress_percentage: 0
          }
        : challenge
    ));
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        loadUserStats(),
        loadPosts(),
        loadChallenges(),
        loadFriends(),
      ]);
      setLoading(false);
    };

    if (appStoreUser?.id) {
      loadInitialData();
    }
  }, [appStoreUser?.id, loadUserStats, loadPosts, loadChallenges, loadFriends]);

  return {
    // States
    posts,
    challenges,
    friends,
    userStats,
    
    // Loading states
    loading,
    postsLoading,
    challengesLoading,
    
    // Actions
    loadUserStats,
    loadPosts,
    loadChallenges,
    loadFriends,
    
    // Post actions
    likePost,
    bookmarkPost,
    sharePost,
    
    // Challenge actions
    joinChallenge,
    leaveChallenge,
  };
};