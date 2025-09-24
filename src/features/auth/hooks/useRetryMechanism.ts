import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

export const useRetryMechanism = ({ maxRetries = 3, baseDelay = 1000 }: UseRetryOptions = {}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = useCallback(async (fn: () => Promise<void>, attempt: number = 0): Promise<void> => {
    try {
      await fn();
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * baseDelay; // Exponential backoff
        
        setIsRetrying(true);
        setRetryCount(attempt + 1);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, attempt + 1);
      } else {
        console.error('🔴 Toutes les tentatives échouées');
        throw error;
      }
    } finally {
      setIsRetrying(false);
    }
  }, [maxRetries, baseDelay]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const canRetry = retryCount < maxRetries;

  return {
    retryCount,
    isRetrying,
    maxRetries,
    retryWithBackoff,
    resetRetry,
    canRetry
  };
};