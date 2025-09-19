// Export des types de la feature social

// ========================================
// SOCIAL TYPES
// ========================================

export interface SocialUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  fitness_level: string;
  primary_goals: string[];
  follower_count: number;
  following_count: number;
  is_verified: boolean;
  is_following?: boolean;
  is_followed_by?: boolean;
  mutual_friends_count?: number;
}

export interface Post {
  id: string;
  user_id: string;
  user: SocialUser;
  content: string;
  post_type: PostType;
  visibility: PostVisibility;
  created_at: Date;
  updated_at: Date;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  media?: MediaAttachment[];
  workout_data?: WorkoutPost;
  achievement_data?: AchievementPost;
  nutrition_data?: NutritionPost;
  tags?: string[];
  location?: PostLocation;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user: SocialUser;
  content: string;
  parent_comment_id?: string;
  created_at: Date;
  likes_count: number;
  is_liked?: boolean;
  replies?: Comment[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator: SocialUser;
  challenge_type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  duration_days: number;
  max_participants?: number;
  start_date: Date;
  end_date: Date;
  rules: ChallengeRule[];
  prizes?: ChallengePrize[];
  entry_fee?: number;
  is_public: boolean;
  participants_count: number;
  status: ChallengeStatus;
  created_at: Date;
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  user: SocialUser;
  joined_at: Date;
  status: ParticipationStatus;
  progress: ChallengeProgress;
  final_rank?: number;
  completion_percentage: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  cover_image?: string;
  creator_id: string;
  creator: SocialUser;
  category: GroupCategory;
  privacy: GroupPrivacy;
  member_count: number;
  max_members?: number;
  created_at: Date;
  rules?: string[];
  tags?: string[];
  is_member?: boolean;
  member_role?: MemberRole;
}

// ========================================
// ENUMS & TYPES
// ========================================

export type PostType = 
  | 'text'
  | 'workout'
  | 'achievement'
  | 'nutrition'
  | 'progress_photo'
  | 'motivation'
  | 'question'
  | 'tip'
  | 'challenge_completion';

export type PostVisibility = 'public' | 'friends' | 'group' | 'private';

export type ChallengeType = 
  | 'workout_streak'
  | 'weight_loss'
  | 'muscle_gain'
  | 'distance_running'
  | 'strength_challenge'
  | 'flexibility'
  | 'nutrition'
  | 'step_count'
  | 'custom';

export type ChallengeCategory = 
  | 'fitness'
  | 'nutrition'
  | 'wellness'
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'weight_management'
  | 'habits';

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export type ParticipationStatus = 'active' | 'completed' | 'dropped_out' | 'disqualified';

export type GroupCategory = 
  | 'workout_buddies'
  | 'nutrition_support'
  | 'weight_loss'
  | 'strength_training'
  | 'running'
  | 'yoga'
  | 'local_gym'
  | 'accountability'
  | 'beginners'
  | 'advanced'
  | 'women_only'
  | 'men_only'
  | 'general';

export type GroupPrivacy = 'public' | 'private' | 'invite_only';

export type MemberRole = 'member' | 'moderator' | 'admin' | 'creator';

export type NotificationType = 
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'challenge_invite'
  | 'group_invite'
  | 'achievement'
  | 'workout_complete'
  | 'friend_request';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration?: number; // for videos
}

export interface WorkoutPost {
  workout_id: string;
  workout_name: string;
  duration: number;
  calories_burned?: number;
  exercises_count: number;
  difficulty: string;
  notes?: string;
}

export interface AchievementPost {
  achievement_id: string;
  achievement_name: string;
  achievement_description: string;
  category: string;
  icon_url: string;
  points_earned: number;
}

export interface NutritionPost {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
}

export interface PostLocation {
  name: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

export interface ChallengeRule {
  id: string;
  description: string;
  is_mandatory: boolean;
}

export interface ChallengePrize {
  rank: number;
  description: string;
  value?: number;
  type: 'points' | 'badge' | 'physical' | 'discount';
}

export interface ChallengeProgress {
  total_target: number;
  current_progress: number;
  progress_percentage: number;
  daily_targets_met: number;
  streak_days: number;
  last_updated: Date;
}

export interface SocialNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor_id?: string;
  actor: SocialUser;
  target_id?: string; // post_id, challenge_id, etc.
  created_at: Date;
  read_at?: Date;
  action_url?: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester: SocialUser;
  recipient_id: string;
  recipient: SocialUser;
  status: 'pending' | 'accepted' | 'declined';
  created_at: Date;
  responded_at?: Date;
}

export interface Leaderboard {
  id: string;
  title: string;
  category: LeaderboardCategory;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  last_updated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: SocialUser;
  score: number;
  metric_value: number;
  change_from_previous?: number;
}

export type LeaderboardCategory = 
  | 'total_workouts'
  | 'calories_burned'
  | 'distance_run'
  | 'weight_lifted'
  | 'consistency_score'
  | 'challenges_won'
  | 'social_engagement';

export interface SocialFeed {
  posts: Post[];
  has_more: boolean;
  next_cursor?: string;
  filter_applied?: FeedFilter;
}

export interface FeedFilter {
  post_types?: PostType[];
  user_ids?: string[];
  time_range?: 'today' | 'week' | 'month';
  include_groups?: boolean;
}

export interface UserStats {
  friends_count: number;
  active_challenges: number;
  global_rank: number;
  total_points: number;
  streak_days: number;
  achievements_count: number;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  sport: string;
  level: number;
  is_online: boolean;
  mutual_friends: number;
  last_activity: string;
}

export interface CreatePostData {
  content: string;
  post_type: 'general' | 'achievement' | 'workout' | 'progress';
  media_files: File[];
  achievements: unknown[];
  location?: string;
}

export interface CreateChallengeData {
  title: string;
  description: string;
  pillar: 'workout' | 'nutrition' | 'hydration' | 'sleep' | 'general';
  challenge_type: 'individual' | 'team' | 'community';
  target_value: number;
  target_unit: string;
  duration_days: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward_points: number;
}

export type SocialTab = 'feed' | 'challenges' | 'leaderboard' | 'friends';
export type FeedFilterType = 'all' | 'friends' | 'sport';
export type ChallengeFilterType = 'all' | 'active' | 'available';

// Legacy types for backward compatibility with SocialPage
export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: 'general' | 'achievement' | 'workout' | 'progress' | 'challenge';
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    sport: string;
    level: number;
  };
  achievements?: unknown[];
  workout_data?: any;
  comments?: SocialComment[];
}

export interface SocialComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    avatar_url?: string;
  };
}

// Extended Challenge interface for the new components
export interface ExtendedChallenge extends Challenge {
  pillar?: 'workout' | 'nutrition' | 'hydration' | 'sleep' | 'general';
  target_value?: number;
  target_unit?: string;
  reward_points?: number;
  is_participating?: boolean;
  progress_percentage?: number;
  creator: SocialUser & {
    name?: string; // For backward compatibility
  };
}

// Extended SocialUser for backward compatibility
export interface ExtendedSocialUser extends SocialUser {
  name?: string; // Alias for display_name
}
