import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function AuthGuard({ children, requireOnboarding = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Pas d'utilisateur connecté, rediriger vers auth
        setLocation('/auth');
      } else if (requireOnboarding && !user.onboarding_completed) {
        // Utilisateur connecté mais onboarding requis et pas complété
        setLocation('/onboarding');
      } else if (!requireOnboarding && !user.onboarding_completed) {
        // Si on accède à une page protégée mais onboarding pas complété
        // (sauf si c'est la page d'onboarding elle-même)
        const currentPath = window.location.pathname;
        if (currentPath !== '/onboarding' && currentPath !== '/auth') {
          setLocation('/onboarding');
        }
      }
    }
  }, [user, isLoading, requireOnboarding, setLocation]);

  // Affichage de chargement pendant la vérification auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne pas afficher le contenu
  // (la redirection se fera via useEffect)
  if (!user) {
    return null;
  }

  // Si onboarding requis mais pas complété
  if (requireOnboarding && !user.onboarding_completed) {
    return null;
  }

  // Si utilisateur pas complètement configuré et pas sur la bonne page
  if (!user.onboarding_completed) {
    const currentPath = window.location.pathname;
    if (currentPath !== '/onboarding' && currentPath !== '/auth') {
      return null;
    }
  }

  // Tout va bien, afficher le contenu
  return <>{children}</>;
}