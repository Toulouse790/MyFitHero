import React from 'react';

// Hook pour précharger les ressources critiques
export const useResourcePreload = () => {
  React.useEffect(() => {
    // Précharger les fonts critiques
    const fonts = [
      'Inter-Regular.woff2',
      'Inter-Medium.woff2',
      'Inter-SemiBold.woff2'
    ];
    
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `/fonts/${font}`;
      document.head.appendChild(link);
    });
    
    // Précharger les images critiques
    const criticalImages = [
      '/icon-192.svg',
      '/icon-512.svg'
    ];
    
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img;
      document.head.appendChild(link);
    });
  }, []);
};

// Hook pour optimiser les Web Vitals
export const useWebVitals = () => {
  React.useEffect(() => {
    // Observer Intersection pour lazy loading avancé
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    // Observer toutes les images avec data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    return () => imageObserver.disconnect();
  }, []);
};

// Hook pour réduire le Cumulative Layout Shift
export const useCLSOptimization = () => {
  React.useEffect(() => {
    // Ajouter des dimensions par défaut aux images sans taille
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      imgElement.style.aspectRatio = '1 / 1';
      imgElement.style.backgroundColor = '#f3f4f6';
    });
    
    // Préserver l'espace pour le contenu dynamique
    const dynamicContainers = document.querySelectorAll('[data-dynamic]');
    dynamicContainers.forEach(container => {
      const element = container as HTMLElement;
      if (!element.style.minHeight) {
        element.style.minHeight = '200px';
      }
    });
  }, []);
};