import { useState, useCallback } from 'react';
// src/shared/hooks/useDataLoader.ts

interface LoaderConfig {
  onError?: (title: string, description?: string) => void;
}

export const useDataLoader = (config: LoaderConfig) => {
  const [isLoading, setIsLoading] = useState(true);

  const withLoader = useCallback(
    async <T>(loadFn: () => Promise<T>): Promise<T | null> => {
      try {
        setIsLoading(true);
        const result = await loadFn();
        return result;
      } catch (error) {
        console.error('Error loading data:', error);
        if (config.onError) {
          config.onError(
            'Erreur inattendue',
            'Impossible de charger les données.'
          );
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [config.onError]
  );

  return {
    isLoading,
    withLoader,
    setIsLoading,
  };
};