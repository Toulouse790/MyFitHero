import { useState, useEffect } from 'react';

// Hook pour animation au montage
export const useAnimateOnMount = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Hook pour animation de progression
export const useProgressAnimation = (targetValue: number, duration: number = 1000) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;

      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return Math.round(animatedValue);
};

// Hook pour vibrations haptiques
export const useHaptic = () => {
  const clickVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // Vibration courte pour clic
    }
  };

  const successVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); // Pattern pour succès
    }
  };

  const errorVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]); // Pattern pour erreur
    }
  };

  const longVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200); // Vibration longue
    }
  };

  return {
    clickVibration,
    successVibration,
    errorVibration,
    longVibration,
  };
};

// Hook pour animations de slide
export const useSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return 'translateX(-100%)';
        case 'right':
          return 'translateX(100%)';
        case 'up':
          return 'translateY(-100%)';
        case 'down':
          return 'translateY(100%)';
        default:
          return 'translateY(-100%)';
      }
    }
    return 'translate(0, 0)';
  };

  return {
    isVisible,
    transform: getTransform(),
    transition: 'transform 0.3s ease-out',
  };
};

// Hook pour fade in/out
export const useFadeAnimation = (duration: number = 300) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}ms ease-in-out`,
  };
};