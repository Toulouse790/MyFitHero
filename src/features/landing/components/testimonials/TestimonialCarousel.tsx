// src/features/landing/components/testimonials/TestimonialCarousel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from './TestimonialsSection';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  showRatings?: boolean;
  showSocialProof?: boolean;
  slidesToShow?: number;
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoPlay = false,
  interval = 5000,
  showRatings = true,
  showSocialProof = false,
  slidesToShow = 1,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = Math.ceil(testimonials.length / slidesToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, interval, nextSlide]);

  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * slidesToShow;
    return testimonials.slice(startIndex, startIndex + slidesToShow);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out">
          <div className={`grid gap-6 min-w-full ${
            slidesToShow === 1 
              ? 'grid-cols-1' 
              : slidesToShow === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {getCurrentTestimonials().map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                showRating={showRatings}
                showSocialProof={showSocialProof}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mt-8">
        {/* Dots */}
        {totalSlides > 1 && (
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Play/Pause */}
        {autoPlay && (
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
            aria-label={isPlaying ? 'Mettre en pause' : 'Lancer'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {autoPlay && isPlaying && !isHovered && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-linear"
              style={{
                animation: `progress ${interval}ms linear infinite`,
              }}
            />
          </div>
        </div>
      )}

      {/* Inline styles for animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `
      }} />
    </div>
  );
};