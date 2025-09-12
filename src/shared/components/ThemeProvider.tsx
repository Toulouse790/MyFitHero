import React, { createContext, useContext, ReactNode } from 'react';

// Types pour les couleurs adaptatives
interface AdaptiveColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Context pour le thème
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'auto';
  adaptiveColors: AdaptiveColors;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Couleurs pour thème clair
const lightColors: AdaptiveColors = {
  primary: '#3B82F6',
  secondary: '#64748B',
  accent: '#8B5CF6',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Couleurs pour thème sombre
const darkColors: AdaptiveColors = {
  primary: '#60A5FA',
  secondary: '#94A3B8',
  accent: '#A78BFA',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
};

// Provider pour le thème
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'auto'>('auto');

  // Déterminer le thème actuel
  const getEffectiveTheme = () => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();
  const adaptiveColors = effectiveTheme === 'dark' ? darkColors : lightColors;

  const contextValue: ThemeContextValue = {
    theme,
    adaptiveColors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={effectiveTheme === 'dark' ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser les couleurs adaptatives
export const useAdaptiveColors = (): AdaptiveColors => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Retourner les couleurs par défaut si pas de provider
    return lightColors;
  }
  return context.adaptiveColors;
};

// Hook pour le thème complet
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper pour générer des couleurs personnalisées
export const generateAdaptiveColor = (baseColor: string, theme: 'light' | 'dark') => {
  // Simple logic pour adapter les couleurs selon le thème
  if (theme === 'dark') {
    // Rendre les couleurs plus claires en mode sombre
    return `color-mix(in srgb, ${baseColor} 80%, white 20%)`;
  } else {
    // Garder les couleurs originales en mode clair
    return baseColor;
  }
};

// Utilitaire pour les classes CSS conditionnelles selon le thème
export const themeClasses = (lightClass: string, darkClass: string) => {
  return `${lightClass} dark:${darkClass}`;
};