/**
 * HOOK OPTIMISATION PERFORMANCES - Module Workout
 * Optimisations avancées pour les performances du module workout
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { debounce, throttle } from 'lodash';

// === HOOK DE DEBOUNCING OPTIMISÉ ===
export const useOptimizedDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
) => {
  const debouncedFn = useMemo(
    () => debounce(callback, delay, options),
    [callback, delay, options]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
};

// === HOOK DE THROTTLING OPTIMISÉ ===
export const useOptimizedThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  wait: number = 100,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
) => {
  const throttledFn = useMemo(
    () => throttle(callback, wait, options),
    [callback, wait, options]
  );

  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);

  return throttledFn;
};

// === HOOK DE MEMOIZATION AVANCÉE ===
export const useDeepMemo = <T>(factory: () => T, deps: any[]): T => {
  const ref = useRef<{ deps: any[]; value: T }>();

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps: [...deps],
      value: factory(),
    };
  }

  return ref.current.value;
};

// Fonction utilitaire de deep comparison
const deepEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => {
    const bVal = b[index];
    if (typeof val === 'object' && val !== null && typeof bVal === 'object' && bVal !== null) {
      return JSON.stringify(val) === JSON.stringify(bVal);
    }
    return val === bVal;
  });
};

// === HOOK D'OPTIMISATION DES CALCULS LOURDS ===
export const useWorkoutCalculationOptimizer = () => {
  const calculationCache = useRef<Map<string, any>>(new Map());
  const [isCalculating, setIsCalculating] = useState(false);

  const optimizedCalculation = useCallback(
    async <T>(
      key: string,
      calculation: () => Promise<T> | T,
      cacheDuration: number = 5 * 60 * 1000 // 5 minutes par défaut
    ): Promise<T> => {
      // Vérifier le cache
      const cached = calculationCache.current.get(key);
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        return cached.value;
      }

      setIsCalculating(true);
      
      try {
        const result = await calculation();
        
        // Mettre en cache
        calculationCache.current.set(key, {
          value: result,
          timestamp: Date.now(),
        });

        // Limiter la taille du cache (max 50 entrées)
        if (calculationCache.current.size > 50) {
          const firstKey = calculationCache.current.keys().next().value;
          calculationCache.current.delete(firstKey);
        }

        return result;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  const clearCache = useCallback((key?: string) => {
    if (key) {
      calculationCache.current.delete(key);
    } else {
      calculationCache.current.clear();
    }
  }, []);

  const getCacheStats = useCallback(() => ({
    size: calculationCache.current.size,
    keys: Array.from(calculationCache.current.keys()),
  }), []);

  return {
    optimizedCalculation,
    clearCache,
    getCacheStats,
    isCalculating,
  };
};

// === HOOK D'OPTIMISATION DES LISTES ===
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      items.length,
      start + Math.ceil(containerHeight / itemHeight) + overscan
    );
    
    return {
      start: Math.max(0, start - overscan),
      end,
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      style: {
        position: 'absolute' as const,
        top: (visibleRange.start + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      },
    }));
  }, [items, visibleRange.start, visibleRange.end, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useOptimizedThrottle((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, 16); // 60fps

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    visibleRange,
  };
};

// === HOOK D'OPTIMISATION DES IMAGES ===
export const useImageOptimization = () => {
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (imageCache.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.current.set(src, img);
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (srcs: string[]) => {
    const promises = srcs.map(src => preloadImage(src));
    await Promise.allSettled(promises);
  }, [preloadImage]);

  const isImageLoaded = useCallback((src: string) => {
    return loadedImages.has(src);
  }, [loadedImages]);

  const getOptimizedImageProps = useCallback((
    src: string,
    alt: string,
    options?: {
      lazy?: boolean;
      sizes?: string;
      quality?: number;
    }
  ) => {
    const { lazy = true, sizes, quality = 85 } = options || {};

    return {
      src,
      alt,
      loading: lazy ? ('lazy' as const) : ('eager' as const),
      sizes,
      style: {
        objectFit: 'cover' as const,
        transition: 'opacity 0.3s ease',
        opacity: isImageLoaded(src) ? 1 : 0.8,
      },
      onLoad: () => {
        setLoadedImages(prev => new Set([...prev, src]));
      },
    };
  }, [isImageLoaded]);

  return {
    preloadImage,
    preloadImages,
    isImageLoaded,
    getOptimizedImageProps,
    cacheSize: imageCache.current.size,
  };
};

// === HOOK DE SURVEILLANCE DES PERFORMANCES ===
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    // Log des performances en mode développement
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚀 Performance Monitor: ${componentName}`);
      console.log(`Render #${renderCount.current}`);
      console.log(`Time since last render: ${timeSinceLastRender}ms`);
      console.log(`Time since mount: ${now - mountTime.current}ms`);
      console.groupEnd();
    }
  });

  const getPerformanceStats = useCallback(() => ({
    renderCount: renderCount.current,
    totalMountTime: Date.now() - mountTime.current,
    componentName,
  }), [componentName]);

  return { getPerformanceStats };
};

// === HOOK D'OPTIMISATION DES WEBSOCKETS ===
export const useOptimizedWebSocket = (url: string, options?: {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 1000,
    heartbeatInterval = 30000,
  } = options || {};

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  const reconnectCount = useRef(0);
  const heartbeatTimer = useRef<NodeJS.Timeout>();
  const messageQueue = useRef<string[]>([]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        reconnectCount.current = 0;
        
        // Envoyer les messages en attente
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift();
          if (message) ws.send(message);
        }

        // Démarrer le heartbeat
        heartbeatTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, heartbeatInterval);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (heartbeatTimer.current) {
          clearInterval(heartbeatTimer.current);
        }

        // Tentative de reconnexion
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          setTimeout(connect, reconnectInterval * reconnectCount.current);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnectAttempts, reconnectInterval, heartbeatInterval]);

  const sendMessage = useCallback((message: any) => {
    const messageStr = JSON.stringify(message);
    
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(messageStr);
    } else {
      // Mettre en queue si pas connecté
      messageQueue.current.push(messageStr);
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
    }
    socket?.close();
    setSocket(null);
    setIsConnected(false);
  }, [socket]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
};

// === EXPORT PRINCIPAL ===
export const useWorkoutPerformanceOptimizer = () => {
  const calculationOptimizer = useWorkoutCalculationOptimizer();
  const imageOptimizer = useImageOptimization();
  
  return {
    ...calculationOptimizer,
    ...imageOptimizer,
    // Utilitaires de performance
    useDeepMemo,
    useOptimizedDebounce,
    useOptimizedThrottle,
    useVirtualizedList,
    usePerformanceMonitor,
    useOptimizedWebSocket,
  };
};