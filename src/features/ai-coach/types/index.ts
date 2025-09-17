// Export des types de la feature ai-coach

// ========================================
// AI COACH TYPES
// ========================================

export interface AICoach {
  id: string;
  name: string;
  specialty: AISpecialty;
  personality: CoachPersonality;
  experience_level: ExperienceLevel;
  avatar_url?: string;
  description: string;
}

export interface AICoachMessage {
  id: string;
  coach_id: string;
  user_id: string;
  content: string;
  message_type: MessageType;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface AICoachingSession {
  id: string;
  user_id: string;
  coach_id: string;
  session_type: SessionType;
  status: SessionStatus;
  started_at: Date;
  ended_at?: Date;
  goals: string[];
  feedback?: SessionFeedback;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  coach_id: string;
  recommendation_type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  expires_at?: Date;
  action_items: ActionItem[];
}

export interface CoachingProgress {
  user_id: string;
  coach_id: string;
  overall_score: number;
  streak_days: number;
  completed_sessions: number;
  achievements: Achievement[];
  areas_improvement: string[];
}

// ========================================
// ENUMS & TYPES
// ========================================

export type AISpecialty = 
  | 'general_fitness'
  | 'weight_loss'
  | 'muscle_building'
  | 'endurance'
  | 'flexibility'
  | 'nutrition'
  | 'mental_health'
  | 'recovery';

export type CoachPersonality = 
  | 'motivational'
  | 'analytical'
  | 'supportive'
  | 'challenging'
  | 'gentle'
  | 'scientific';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type MessageType = 
  | 'greeting'
  | 'motivation'
  | 'instruction'
  | 'feedback'
  | 'question'
  | 'recommendation'
  | 'check_in';

export type SessionType = 
  | 'initial_assessment'
  | 'workout_planning'
  | 'progress_review'
  | 'motivation_session'
  | 'problem_solving'
  | 'goal_setting';

export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export type RecommendationType = 
  | 'workout'
  | 'nutrition'
  | 'recovery'
  | 'lifestyle'
  | 'equipment'
  | 'education';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface MessageMetadata {
  workout_id?: string;
  exercise_id?: string;
  attachment_url?: string;
  quick_actions?: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  action_type: 'navigate' | 'start_workout' | 'log_food' | 'schedule_session';
  action_data: Record<string, any>;
}

export interface SessionFeedback {
  rating: number; // 1-5
  comments?: string;
  helpful_aspects: string[];
  improvement_suggestions: string[];
}

export interface ActionItem {
  id: string;
  description: string;
  due_date?: Date;
  completed: boolean;
  category: RecommendationType;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_at: Date;
  points: number;
}
