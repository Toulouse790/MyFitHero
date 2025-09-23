// src/features/landing/components/index.ts
// Hero components
export { HeroSection } from './hero/HeroSection';
export { HeroVideo } from './hero/HeroVideo';
export { HeroCTA } from './hero/HeroCTA';

// Features components  
export { FeatureSection } from './features/FeatureSection';
export { FeatureCard } from './features/FeatureCard';
export { FeatureHighlight } from './features/FeatureHighlight';
export type { Feature } from './features/types';

// Testimonials components
export { TestimonialsSection } from './testimonials/TestimonialsSection';
export { TestimonialCard } from './testimonials/TestimonialCard';
export { TestimonialCarousel } from './testimonials/TestimonialCarousel';
export type { Testimonial } from './testimonials/TestimonialsSection';

// Pricing components
export { PricingSection } from './pricing/PricingSection';
export { PricingCard } from './pricing/PricingCard';
export type { PricingPlan } from './pricing/PricingSection';

// CTA components
export { CTASection } from './cta/CTASection';
export { CTAButton } from './cta/CTAButton';
export type { CTAData } from './cta/CTASection';

// Analytics Dashboard
export { default as LandingAnalyticsDashboard } from './LandingAnalyticsDashboard';