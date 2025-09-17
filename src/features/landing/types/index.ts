// Export des types de la feature landing

// ========================================
// LANDING PAGE TYPES
// ========================================

export interface Hero {
  title: string;
  subtitle: string;
  cta_primary: CallToAction;
  cta_secondary?: CallToAction;
  background_image?: string;
  video_url?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  benefits: string[];
  category: FeatureCategory;
}

export interface Testimonial {
  id: string;
  user_name: string;
  user_title?: string;
  user_avatar?: string;
  content: string;
  rating: number;
  featured: boolean;
  date: Date;
  results?: UserResults;
}

export interface Pricing {
  id: string;
  name: string;
  price: number;
  billing_period: BillingPeriod;
  features: PricingFeature[];
  popular: boolean;
  cta: CallToAction;
  trial_days?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  featured: boolean;
}

export interface NewsletterSubscription {
  email: string;
  interests?: InterestCategory[];
  source: 'landing' | 'footer' | 'popup' | 'blog';
}

// ========================================
// ENUMS & TYPES
// ========================================

export type FeatureCategory = 
  | 'workouts'
  | 'nutrition'
  | 'tracking'
  | 'ai_coaching'
  | 'community'
  | 'analytics'
  | 'integration';

export type BillingPeriod = 'monthly' | 'yearly' | 'lifetime';

export type FAQCategory = 
  | 'general'
  | 'pricing'
  | 'features'
  | 'technical'
  | 'account'
  | 'privacy';

export type InterestCategory = 
  | 'fitness_tips'
  | 'nutrition_advice'
  | 'new_features'
  | 'success_stories'
  | 'workouts'
  | 'promotions';

export type CTAType = 'primary' | 'secondary' | 'ghost' | 'outline';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface CallToAction {
  text: string;
  url: string;
  type: CTAType;
  analytics_event?: string;
  external?: boolean;
}

export interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

export interface UserResults {
  weight_lost?: number;
  muscle_gained?: number;
  time_period: string;
  program_used: string;
}

export interface LandingPageData {
  hero: Hero;
  features: Feature[];
  testimonials: Testimonial[];
  pricing: Pricing[];
  faqs: FAQ[];
  meta: PageMeta;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  og_image?: string;
  canonical_url?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  subject: ContactSubject;
  company?: string;
}

export type ContactSubject = 
  | 'general_inquiry'
  | 'business_partnership'
  | 'press_inquiry'
  | 'technical_support'
  | 'feedback';

export interface SocialProof {
  total_users: number;
  workouts_completed: number;
  calories_burned: number;
  weight_lost: number;
  last_updated: Date;
}
