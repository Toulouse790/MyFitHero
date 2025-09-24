// src/features/landing/hooks/useLandingContent.ts
import { useState, useCallback, useEffect } from 'react';

export interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  enabled: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  featured: boolean;
  order: number;
}

export interface LandingContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage?: string;
    videoUrl?: string;
  };
  features: FeatureHighlight[];
  testimonials: Testimonial[];
  pricing: {
    enabled: boolean;
    plans: Array<{
      id: string;
      name: string;
      price: number;
      features: string[];
      recommended: boolean;
    }>;
  };
  faq: Array<{
    id: string;
    question: string;
    answer: string;
    order: number;
  }>;
}

export interface UseLandingContentReturn {
  content: LandingContent | undefined;
  loading: boolean;
  error: string | undefined;
  loadContent: () => Promise<void>;
  updateContent: (section: keyof LandingContent, data: unknown) => Promise<boolean>;
}

export const useLandingContent = (): UseLandingContentReturn => {
  const [content, setContent] = useState<LandingContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with actual API call
      const mockContent: LandingContent = {
        hero: {
          title: 'Transform Your Fitness Journey',
          subtitle: 'Join thousands of users who have achieved their fitness goals with MyFitHero',
          ctaText: 'Start Your Journey',
          backgroundImage: '/images/hero-bg.jpg',
        },
        features: [
          {
            id: 'feature-1',
            title: 'Personalized Workouts',
            description: 'AI-powered workout plans tailored to your goals and fitness level',
            icon: 'dumbbell',
            order: 1,
            enabled: true,
          },
          {
            id: 'feature-2',
            title: 'Progress Tracking',
            description: 'Advanced analytics to monitor your fitness progress over time',
            icon: 'chart',
            order: 2,
            enabled: true,
          },
          {
            id: 'feature-3',
            title: 'Community Support',
            description: 'Connect with like-minded fitness enthusiasts for motivation',
            icon: 'users',
            order: 3,
            enabled: true,
          },
          {
            id: 'feature-4',
            title: 'Expert Guidance',
            description: 'Access to certified trainers and nutrition experts',
            icon: 'user-check',
            order: 4,
            enabled: true,
          },
        ],
        testimonials: [
          {
            id: 'testimonial-1',
            name: 'Sarah Johnson',
            avatar: '/images/testimonials/sarah.jpg',
            rating: 5,
            comment: "MyFitHero completely transformed my workout routine. I've never been more motivated!",
            featured: true,
            order: 1,
          },
          {
            id: 'testimonial-2',
            name: 'Mike Chen',
            avatar: '/images/testimonials/mike.jpg',
            rating: 5,
            comment: "The personalized workouts are incredible. It's like having a personal trainer 24/7.",
            featured: true,
            order: 2,
          },
          {
            id: 'testimonial-3',
            name: 'Emma Davis',
            avatar: '/images/testimonials/emma.jpg',
            rating: 4,
            comment: 'Great app with amazing features. The community aspect keeps me accountable.',
            featured: false,
            order: 3,
          },
        ],
        pricing: {
          enabled: true,
          plans: [
            {
              id: 'basic',
              name: 'Basic',
              price: 9.99,
              features: ['Basic workouts', 'Progress tracking', 'Community access'],
              recommended: false,
            },
            {
              id: 'pro',
              name: 'Pro',
              price: 19.99,
              features: [
                'All Basic features',
                'Personalized plans',
                'Expert consultations',
                'Advanced analytics',
              ],
              recommended: true,
            },
            {
              id: 'premium',
              name: 'Premium',
              price: 29.99,
              features: [
                'All Pro features',
                '1-on-1 coaching',
                'Nutrition plans',
                'Priority support',
              ],
              recommended: false,
            },
          ],
        },
        faq: [
          {
            id: 'faq-1',
            question: 'How does the personalized workout system work?',
            answer: 'Our AI analyzes your fitness level, goals, and preferences to create custom workout plans that adapt as you progress.',
            order: 1,
          },
          {
            id: 'faq-2',
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your subscription at any time. There are no long-term commitments.',
            order: 2,
          },
          {
            id: 'faq-3',
            question: 'Is there a free trial available?',
            answer: 'Yes, we offer a 7-day free trial for all new users to explore all features.',
            order: 3,
          },
        ],
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setContent(mockContent);
    } catch (error: any) {
      setError(error instanceof Error ? error.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = useCallback(
    async (section: keyof LandingContent, data: unknown): Promise<boolean> => {
      try {
        if (!content) return false;

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));

        setContent(prev =>
          prev
            ? {
                ...prev,
                [section]: data,
              }
            : null
        );

        return true;
      } catch (error: any) {
        console.error('Failed to update content:', error);
        return false;
      }
    },
    [content]
  );

  // Auto-load content on mount
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    loading,
    error,
    loadContent,
    updateContent,
  };
};