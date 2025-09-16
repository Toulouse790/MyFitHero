import React from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
}

export const ImageOptimized: React.FC<ImageOptimizedProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes,
  srcSet,
  priority = false
}) => {
  // Générer srcSet automatiquement si non fourni
  const autoSrcSet = srcSet || generateSrcSet(src);
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : loading}
      sizes={sizes || generateSizes(width)}
      srcSet={autoSrcSet}
      decoding="async"
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        objectFit: 'cover'
      }}
      onError={(e) => {
        // Fallback en cas d'erreur
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
};

// Helper pour générer srcSet automatiquement
function generateSrcSet(src: string): string {
  if (src.includes('.svg') || src.includes('placeholder')) {
    return src;
  }
  
  const baseUrl = src.split('.').slice(0, -1).join('.');
  const extension = src.split('.').pop();
  
  return [
    `${baseUrl}.${extension} 1x`,
    `${baseUrl}@2x.${extension} 2x`,
    `${baseUrl}@3x.${extension} 3x`
  ].join(', ');
}

// Helper pour générer sizes automatiquement
function generateSizes(width?: number): string {
  if (!width) return '100vw';
  
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    `${width}px`
  ].join(', ');
}