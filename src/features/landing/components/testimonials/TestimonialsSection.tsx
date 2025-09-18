// src/features/landing/components/testimonials/TestimonialsSection.tsx
import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialCarousel } from './TestimonialCarousel';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  location?: string;
  verified?: boolean;
  socialProof?: {
    platform: 'instagram' | 'facebook' | 'twitter';
    url: string;
  };
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  layout?: 'grid' | 'carousel' | 'masonry';
  showRatings?: boolean;
  showSocialProof?: boolean;
  maxVisible?: number;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  layout = 'grid',
  showRatings = true,
  showSocialProof = false,
  maxVisible = 6,
  autoPlay = false,
  interval = 5000,
  className = '',
}) => {
  const visibleTestimonials = testimonials.slice(0, maxVisible);

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleTestimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          showRating={showRatings}
          showSocialProof={showSocialProof}
        />
      ))}
    </div>
  );

  const renderMasonryLayout = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {visibleTestimonials.map((testimonial) => (
        <div key={testimonial.id} className="break-inside-avoid">
          <TestimonialCard
            testimonial={testimonial}
            showRating={showRatings}
            showSocialProof={showSocialProof}
          />
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <TestimonialCarousel
      testimonials={visibleTestimonials}
      autoPlay={autoPlay}
      interval={interval}
      showRatings={showRatings}
      showSocialProof={showSocialProof}
    />
  );

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plus de 10 000 personnes nous font confiance pour transformer leur vie
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">4.8</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Utilisateurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">2M+</div>
            <div className="text-gray-600">Entraînements</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          {layout === 'grid' && renderGridLayout()}
          {layout === 'masonry' && renderMasonryLayout()}
          {layout === 'carousel' && renderCarouselLayout()}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Rejoindre la communauté
          </button>
        </div>
      </div>
    </section>
  );
};