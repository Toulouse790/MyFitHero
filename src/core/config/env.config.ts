// Configuration des variables d'environnement
export const env = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Claude API
  CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY || '',
  
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MyFitHero',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Feature flags
  ENABLE_AI_COACH: import.meta.env.VITE_ENABLE_AI_COACH === 'true',
  ENABLE_SOCIAL: import.meta.env.VITE_ENABLE_SOCIAL === 'true',
  ENABLE_WEARABLES: import.meta.env.VITE_ENABLE_WEARABLES === 'true',
  
  // Analytics
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || '',
  MIXPANEL_TOKEN: import.meta.env.VITE_MIXPANEL_TOKEN || '',
};

// Validation des variables critiques
export const validateEnv = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
};
