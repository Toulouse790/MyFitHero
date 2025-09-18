import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  onClick?: () => void;
}

// Générer un placeholder blur par défaut
const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Créer un gradient simple pour le blur
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(0.5, '#e5e7eb');
    gradient.addColorStop(1, '#d1d5db');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

// Détecter le support WebP
const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Hook pour Intersection Observer (lazy loading)
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Convertir src vers format WebP si supporté
const getOptimizedSrc = (src: string, supportsWebP: boolean, quality: number = 85): string => {
  // Si c'est déjà un fichier local, retourner tel quel
  if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
    return src;
  }

  // Pour les URLs externes, ajouter les paramètres d'optimisation
  try {
    const url = new URL(src);
    
    // Ajouter les paramètres de qualité
    url.searchParams.set('q', quality.toString());
    
    // Si WebP supporté, demander ce format
    if (supportsWebP) {
      url.searchParams.set('f', 'webp');
    }
    
    return url.toString();
  } catch {
    // Si l'URL n'est pas valide, retourner l'original
    return src;
  }
};

// Générer srcSet pour responsive
const generateSrcSet = (src: string, supportsWebP: boolean, quality: number): string => {
  const widths = [320, 480, 768, 1024, 1280, 1920];
  
  return widths
    .map(width => {
      const optimizedSrc = getOptimizedSrc(src, supportsWebP, quality);
      try {
        const url = new URL(optimizedSrc);
        url.searchParams.set('w', width.toString());
        return `${url.toString()} ${width}w`;
      } catch {
        return `${optimizedSrc} ${width}w`;
      }
    })
    .join(', ');
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [webPSupported, setWebPSupported] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lazy loading avec Intersection Observer (sauf si priority)
  const isIntersecting = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  const shouldLoad = priority || isIntersecting;

  // Détecter le support WebP au montage
  useEffect(() => {
    supportsWebP().then(setWebPSupported);
  }, []);

  // Générer le blur placeholder
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width || 20, height || 20);

  // Mettre à jour la source quand les conditions sont réunies
  useEffect(() => {
    if (shouldLoad && webPSupported !== undefined) {
      const optimizedSrc = getOptimizedSrc(src, webPSupported, quality);
      setCurrentSrc(optimizedSrc);
    }
  }, [shouldLoad, webPSupported, src, quality]);

  // Gestionnaires d'événements
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
    
    // Fallback vers l'image originale si l'optimisée échoue
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  }, [currentSrc, src]);

  // Styles pour le container
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  // Styles pour l'image
  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  // Styles pour le placeholder
  const placeholderStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: placeholder === 'blur' ? `url(${defaultBlurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(5px)',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    backgroundColor: '#f3f4f6',
  };

  // Styles pour l'état d'erreur
  const errorStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
  };

  return (
    <div
      ref={containerRef}
      style={containerStyles}
      className={cn('relative', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Placeholder blur */}
      {!isLoaded && !isError && (
        <div
          style={placeholderStyles}
          className="animate-pulse"
          aria-label="Image en cours de chargement"
        />
      )}

      {/* Image principale */}
      {shouldLoad && currentSrc && !isError && (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={webPSupported ? generateSrcSet(src, webPSupported, quality) : undefined}
          sizes={sizes}
          alt={alt}
          style={imageStyles}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      )}

      {/* État d'erreur */}
      {isError && (
        <div style={errorStyles}>
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div>Image indisponible</div>
          </div>
        </div>
      )}

      {/* Indicateur de chargement prioritaire */}
      {priority && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;