import { Activity, Search, Users } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types simplifiés pour le store social
interface SocialProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  sport: string;
  level: number;
  stats: SocialStats;
  badges: Badge[];
  privacy: PrivacySettings;
  created_at: string;
  updated_at: string;
}

interface SocialStats {
  totalWorkouts: number;
  totalDuration: number;
  streakDays: number;
  achievements: number;
  ranking: number;
  points: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'social' | 'achievement' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  workoutVisibility: 'public' | 'friends' | 'private';
  friendsVisibility: 'public' | 'friends' | 'private';
  allowMessages: boolean;
  allowFriendRequests: boolean;
}

interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  connectedAt: string;
  friend: SocialProfile;
}

interface ActivityPost {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'workout' | 'achievement' | 'challenge' | 'milestone';
  data: any;
  media?: MediaFile[];
  visibility: 'public' | 'friends' | 'private';
  likes: number;
  shares: number;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

interface MediaFile {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  likes: number;
  created_at: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'distance' | 'duration' | 'frequency' | 'custom';
  target: number;
  unit: string;
  duration: number;
  visibility: 'public' | 'friends' | 'invite-only';
  maxParticipants?: number;
  participants: ChallengeParticipant[];
  prizes: string[];
  rules: string[];
  creatorId: string;
  status: string;
  created_at: string;
}

interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  rank: number;
  completed: boolean;
  joinedAt: string;
}

interface SocialNotification {
  id: string;
  userId: string;
  type: 'friend_request' | 'post_like' | 'comment' | 'challenge_invite';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  value: number;
  rank: number;
}

interface SocialStore {
  // State
  profile: SocialProfile | null;
  friends: Friend[];
  friendRequests: Friend[];
  posts: ActivityPost[];
  userPosts: ActivityPost[];
  challenges: Challenge[];
  userChallenges: Challenge[];
  notifications: SocialNotification[];
  unreadCount: number;
  leaderboards: Record<string, LeaderboardEntry[]>;

  loading: {
    profile: boolean;
    friends: boolean;
    posts: boolean;
    challenges: boolean;
    notifications: boolean;
  };

  errors: Record<string, string | null>;

  // Actions
  updateProfile: (updates: Partial<SocialProfile>) => Promise<void>;
  loadFriends: () => Promise<void>;
  sendFriendRequest: (userId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;

  createPost: (postData: any) => Promise<void>;
  loadPosts: (filter?: any) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, content: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;

  createChallenge: (challengeData: any) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;

  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  getLeaderboard: (category: string, period: string) => Promise<void>;

  initializeRealTime: () => void;
  searchUsers: (query: string, filters?: any) => Promise<void>;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      friends: [],
      friendRequests: [],
      posts: [],
      userPosts: [],
      challenges: [],
      userChallenges: [],
      notifications: [],
      unreadCount: 0,
      leaderboards: {},

      loading: {
        profile: false,
        friends: false,
        posts: false,
        challenges: false,
        notifications: false,
      },

      errors: {},

      // Actions - Placeholder implementations
      updateProfile: async (updates: Partial<SocialProfile>) => {
        set(state => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
        // TODO: Implement real API call
      },

      loadFriends: async () => {
        set(state => ({
          loading: { ...state.loading, friends: true },
        }));

        // TODO: Implement real API call
        // For now, just clear loading state
        setTimeout(() => {
          set(state => ({
            loading: { ...state.loading, friends: false },
          }));
        }, 100);
      },

      sendFriendRequest: async (userId: string) => {
        // TODO: Implement real API call
      },

      acceptFriendRequest: async (requestId: string) => {
        // TODO: Implement real API call
      },

      declineFriendRequest: async (requestId: string) => {
        // TODO: Implement real API call
      },

      removeFriend: async (friendId: string) => {
        // TODO: Implement real API call
      },

      createPost: async (postData: any) => {
        // TODO: Implement real API call
      },

      loadPosts: async (filter?: any) => {
        set(state => ({
          loading: { ...state.loading, posts: true },
        }));

        // TODO: Implement real API call
        setTimeout(() => {
          set(state => ({
            loading: { ...state.loading, posts: false },
          }));
        }, 100);
      },

      likePost: async (postId: string) => {
        // TODO: Implement real API call
      },

      commentPost: async (postId: string, content: string) => {
        // TODO: Implement real API call
      },

      sharePost: async (postId: string) => {
        // TODO: Implement real API call
      },

      createChallenge: async (challengeData: any) => {
        // TODO: Implement real API call
      },

      joinChallenge: async (challengeId: string) => {
        // TODO: Implement real API call
      },

      updateChallengeProgress: async (challengeId: string, progress: number) => {
        // TODO: Implement real API call
      },

      markNotificationAsRead: async (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllNotificationsAsRead: async () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },

      getLeaderboard: async (category: string, period: string) => {
        // TODO: Implement real API call
      },

      initializeRealTime: () => {
        // TODO: Implement real-time subscriptions
      },

      searchUsers: async (query: string, filters?: any) => {
        // TODO: Implement real API call
      },
    }),
    {
      name: 'social-store',
      partialize: state => ({
        profile: state.profile,
        friends: state.friends,
        // Don't persist loading states or errors
      }),
    }
  )
);
