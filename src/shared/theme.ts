/**
 * Design System pour MyFitHero
 * Gradients thématiques et styles cohérents
 */

export const featureGradients = {
  // Authentification - Purple to Blue
  auth: {
    background: 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800',
    card: 'bg-white/95 backdrop-blur-lg',
    button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
  },
  
  // Workout - Orange to Red  
  workout: {
    background: 'bg-gradient-to-br from-orange-500 to-red-500',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
  },
  
  // Nutrition - Green to Emerald
  nutrition: {
    background: 'bg-gradient-to-br from-green-500 to-emerald-500',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
  },
  
  // Hydratation - Blue to Cyan
  hydration: {
    background: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
  },
  
  // Sommeil - Purple to Indigo
  sleep: {
    background: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
  },
  
  // Social - Pink to Purple
  social: {
    background: 'bg-gradient-to-br from-pink-500 to-purple-500',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
  },
  
  // Dashboard - Neutral elegance
  dashboard: {
    background: 'bg-gradient-to-br from-gray-50 to-blue-50',
    card: 'bg-white shadow-xl',
    button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  },
  
  // AI Coach - Technology gradient
  aiCoach: {
    background: 'bg-gradient-to-br from-violet-600 to-purple-600',
    card: 'bg-white/95 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
  }
};

export const textStyles = {
  h1: 'text-3xl font-bold text-gray-800',
  h2: 'text-2xl font-semibold text-gray-800',
  h3: 'text-xl font-medium text-gray-800',
  h4: 'text-lg font-medium text-gray-700',
  body: 'text-gray-600',
  bodyLarge: 'text-base text-gray-600',
  small: 'text-sm text-gray-500',
  caption: 'text-xs text-gray-400'
};

export const cardStyles = {
  default: 'rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300',
  elevated: 'rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-300',
  glass: 'rounded-2xl bg-white/95 backdrop-blur-lg shadow-xl border border-white/20',
  minimal: 'rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200'
};

export const buttonStyles = {
  primary: 'h-12 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'h-12 px-6 py-3 rounded-xl font-medium border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
  large: 'h-14 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
  small: 'h-10 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
};

export const inputStyles = {
  default: 'h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200',
  large: 'h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200',
  withIcon: 'pl-12 h-12 w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200'
};

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  hover: 'hover:scale-105 transition-transform duration-200',
  press: 'active:scale-95 transition-transform duration-100'
};

// Feature colors pour les icônes et accents
export const featureColors = {
  workout: {
    primary: 'text-orange-500',
    secondary: 'text-red-500',
    bg: 'bg-orange-500',
    bgSecondary: 'bg-red-500'
  },
  nutrition: {
    primary: 'text-green-500',
    secondary: 'text-emerald-500',
    bg: 'bg-green-500',
    bgSecondary: 'bg-emerald-500'
  },
  hydration: {
    primary: 'text-blue-500',
    secondary: 'text-cyan-500',
    bg: 'bg-blue-500',
    bgSecondary: 'bg-cyan-500'
  },
  sleep: {
    primary: 'text-purple-500',
    secondary: 'text-indigo-500',
    bg: 'bg-purple-500',
    bgSecondary: 'bg-indigo-500'
  },
  social: {
    primary: 'text-pink-500',
    secondary: 'text-purple-500',
    bg: 'bg-pink-500',
    bgSecondary: 'bg-purple-500'
  },
  aiCoach: {
    primary: 'text-violet-500',
    secondary: 'text-purple-500',
    bg: 'bg-violet-500',
    bgSecondary: 'bg-purple-500'
  }
};