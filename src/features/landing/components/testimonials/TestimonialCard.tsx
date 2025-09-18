// src/features/landing/components/testimonials/TestimonialCard.tsx
import React from 'react';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';
import { Testimonial } from './TestimonialsSection';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showRating?: boolean;
  showSocialProof?: boolean;
  compact?: boolean;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  showRating = true,
  showSocialProof = false,
  compact = false,
  className = '',
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Rating */}
      {showRating && (
        <div className="flex items-center space-x-1 mb-4">
          {renderStars(testimonial.rating)}
        </div>
      )}

      {/* Content */}
      <div className={`mb-6 ${compact ? 'text-sm' : 'text-base'}`}>
        <p className="text-gray-700 leading-relaxed">
          "{testimonial.content}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className={`rounded-full object-cover ${
                  compact ? 'w-10 h-10' : 'w-12 h-12'
                }`}
              />
            ) : (
              <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ${
                compact ? 'w-10 h-10 text-sm' : 'w-12 h-12'
              }`}>
                {getInitials(testimonial.name)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : ''}`}>
                {testimonial.name}
              </h4>
              {testimonial.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
            
            <div className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
              {testimonial.role}
              {testimonial.company && (
                <span> chez {testimonial.company}</span>
              )}
            </div>
            
            {testimonial.location && (
              <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
                {testimonial.location}
              </div>
            )}
          </div>
        </div>

        {/* Social Proof */}
        {showSocialProof && testimonial.socialProof && (
          <a
            href={testimonial.socialProof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};