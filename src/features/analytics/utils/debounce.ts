/**
 * 🎯 MYFITHERO ANALYTICS - UTILITY FUNCTIONS
 * Utilitaires pour remplacer les dépendances externes
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

/**
 * Debounce function - limite les appels de fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const later = () => {
      timeout = null;
      return func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    return later();
  };
}

/**
 * Throttle function - limite le taux d'exécution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}