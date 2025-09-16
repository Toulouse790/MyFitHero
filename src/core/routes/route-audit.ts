// Test des parcours utilisateur - MyFitHero Routes Audit
// 🎯 Script pour valider tous les parcours utilisateur critiques

import React from 'react';

// Types pour les routes
interface RouteTest {
  path: string;
  component: string;
  requiresAuth: boolean;
  requiresOnboarding: boolean;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'normal';
  userJourney: string;
}

// Routes critiques identifiées
export const CRITICAL_USER_JOURNEYS: RouteTest[] = [
  // 🚀 PARCOURS D'ACQUISITION
  {
    path: '/',
    component: 'LandingPage',
    requiresAuth: false,
    requiresOnboarding: false,
    title: 'MyFitHero - AI-Powered Fitness for Americans',
    description: 'Page d\'accueil - point d\'entrée principal',
    priority: 'critical',
    userJourney: 'acquisition'
  },
  {
    path: '/register',
    component: 'AuthPage',
    requiresAuth: false,
    requiresOnboarding: false,
    title: 'Create Account - MyFitHero',
    description: 'Inscription utilisateur - conversion critique',
    priority: 'critical',
    userJourney: 'acquisition'
  },
  {
    path: '/login',
    component: 'AuthPage',
    requiresAuth: false,
    requiresOnboarding: false,
    title: 'Sign In - MyFitHero',
    description: 'Connexion utilisateur - rétention',
    priority: 'critical',
    userJourney: 'activation'
  },

  // 🎯 PARCOURS D'ACTIVATION
  {
    path: '/onboarding',
    component: 'OnboardingPage',
    requiresAuth: true,
    requiresOnboarding: false,
    title: 'Welcome to MyFitHero',
    description: 'Onboarding initial - activation utilisateur',
    priority: 'critical',
    userJourney: 'activation'
  },
  {
    path: '/dashboard',
    component: 'DashboardPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Dashboard - MyFitHero',
    description: 'Dashboard principal - cœur de l\'app',
    priority: 'critical',
    userJourney: 'engagement'
  },

  // 💪 PARCOURS D'ENGAGEMENT CORE
  {
    path: '/workouts',
    component: 'WorkoutPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Workouts - MyFitHero',
    description: 'Entraînements - valeur principale',
    priority: 'critical',
    userJourney: 'engagement'
  },
  {
    path: '/analytics',
    component: 'AnalyticsPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Progress Analytics - MyFitHero',
    description: 'Analytics - rétention long terme',
    priority: 'critical',
    userJourney: 'retention'
  },
  {
    path: '/ai-coach',
    component: 'AICoachPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'AI Coach - MyFitHero',
    description: 'IA Coach - différenciation produit',
    priority: 'critical',
    userJourney: 'engagement'
  },

  // 🌟 PARCOURS SOCIAL & RETENTION
  {
    path: '/social',
    component: 'SocialPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Community - MyFitHero',
    description: 'Réseau social - rétention virale',
    priority: 'important',
    userJourney: 'retention'
  },
  {
    path: '/profile',
    component: 'ProfilePage',
    requiresAuth: true,
    requiresOnboarding: false,
    title: 'Your Profile - MyFitHero',
    description: 'Profil utilisateur - personnalisation',
    priority: 'important',
    userJourney: 'engagement'
  },

  // 📊 PARCOURS WELLNESS COMPLET
  {
    path: '/nutrition',
    component: 'NutritionPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Nutrition - MyFitHero',
    description: 'Nutrition - pilier wellness',
    priority: 'important',
    userJourney: 'engagement'
  },
  {
    path: '/sleep',
    component: 'SleepPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Sleep Tracking - MyFitHero',
    description: 'Sommeil - récupération',
    priority: 'important',
    userJourney: 'engagement'
  },
  {
    path: '/hydration',
    component: 'HydrationPage',
    requiresAuth: true,
    requiresOnboarding: true,
    title: 'Hydration - MyFitHero',
    description: 'Hydratation - habitudes quotidiennes',
    priority: 'normal',
    userJourney: 'engagement'
  }
];

// Parcours utilisateur types par funnel
export const USER_JOURNEYS = {
  // 🎯 ACQUISITION (Non-connecté → Inscription)
  acquisition: [
    '/' → '/register' → '/onboarding' → '/dashboard'
  ],
  
  // 🚀 ACTIVATION (Nouveau utilisateur → Premier usage)
  activation: [
    '/login' → '/onboarding' → '/dashboard' → '/workouts'
  ],
  
  // 💪 ENGAGEMENT (Utilisateur actif → Usage régulier)
  engagement: [
    '/dashboard' → '/workouts' → '/analytics' → '/ai-coach',
    '/dashboard' → '/nutrition' → '/sleep' → '/analytics',
    '/workouts' → '/social' → '/profile' → '/settings'
  ],
  
  // 🌟 RETENTION (Utilisateur fidèle → Ambassadeur)
  retention: [
    '/analytics' → '/social' → '/social/challenges',
    '/profile' → '/wearables' → '/analytics' → '/ai-coach'
  ]
};

// Test des redirections et guards
export const ROUTE_GUARDS_TESTS = {
  // Tests d'authentification
  authRequired: [
    '/dashboard', '/workouts', '/analytics', '/ai-coach',
    '/social', '/nutrition', '/sleep', '/hydration',
    '/profile', '/settings', '/exercises'
  ],
  
  // Tests d'onboarding requis
  onboardingRequired: [
    '/dashboard', '/workouts', '/analytics', '/ai-coach',
    '/social', '/nutrition', '/sleep', '/hydration',
    '/wearables'
  ],
  
  // Routes publiques (accessibles sans auth)
  publicRoutes: [
    '/', '/login', '/register', '/privacy', '/terms', '/support'
  ]
};

// Scenarios de test complets
export const TEST_SCENARIOS = [
  {
    name: 'Nouveau visiteur → Inscription complète',
    flow: [
      { step: 1, route: '/', action: 'visit_landing' },
      { step: 2, route: '/register', action: 'click_signup' },
      { step: 3, route: '/onboarding', action: 'complete_signup' },
      { step: 4, route: '/dashboard', action: 'complete_onboarding' }
    ],
    expected: 'User successfully onboarded and sees dashboard'
  },
  
  {
    name: 'Utilisateur existant → Session workout',
    flow: [
      { step: 1, route: '/login', action: 'login' },
      { step: 2, route: '/dashboard', action: 'authenticated' },
      { step: 3, route: '/workouts', action: 'click_workouts' },
      { step: 4, route: '/workouts/123', action: 'start_workout' },
      { step: 5, route: '/analytics', action: 'complete_workout' }
    ],
    expected: 'Workout completed and analytics updated'
  },
  
  {
    name: 'Utilisateur avancé → Analyse progrès',
    flow: [
      { step: 1, route: '/dashboard', action: 'daily_checkin' },
      { step: 2, route: '/analytics', action: 'view_progress' },
      { step: 3, route: '/ai-coach', action: 'get_recommendations' },
      { step: 4, route: '/social', action: 'share_achievement' }
    ],
    expected: 'Progress analyzed and shared with community'
  }
];

// Export des constantes pour les tests
export const ROUTE_CONSTANTS = {
  CRITICAL_ROUTES: CRITICAL_USER_JOURNEYS.filter(r => r.priority === 'critical'),
  IMPORTANT_ROUTES: CRITICAL_USER_JOURNEYS.filter(r => r.priority === 'important'),
  NORMAL_ROUTES: CRITICAL_USER_JOURNEYS.filter(r => r.priority === 'normal'),
  
  // Métriques de succès
  SUCCESS_METRICS: {
    acquisition: ['landing_page_load', 'signup_completion', 'onboarding_start'],
    activation: ['onboarding_completion', 'first_workout', 'dashboard_visit'],
    engagement: ['daily_active_usage', 'feature_adoption', 'session_duration'],
    retention: ['weekly_retention', 'social_engagement', 'goal_achievement']
  }
};

console.log('🎯 Route Audit Script Loaded');
console.log('📊 Critical Routes:', ROUTE_CONSTANTS.CRITICAL_ROUTES.length);
console.log('⚡ Important Routes:', ROUTE_CONSTANTS.IMPORTANT_ROUTES.length);
console.log('📋 Test Scenarios:', TEST_SCENARIOS.length);