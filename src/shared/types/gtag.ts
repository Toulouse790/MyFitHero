// Types pour Google Analytics gtag
export interface GtagEvent {
  // Événements communs
  meal_type?: string;
  meal_name?: string;
  sport?: string;
  user_id?: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  
  // Événements social
  post_type?: string;
  content_length?: number;
  user_sport?: string;
  
  // Événements challenge
  pillar?: string;
  challenge_type?: string;
  difficulty?: string;
  
  // Événements interaction
  post_id?: string;
  action_type?: string;
  
  // Événements achievement
  achievement_type?: string;
  achievement_value?: string | number;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      parameters: GtagEvent
    ) => void;
  }
}