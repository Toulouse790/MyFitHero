import React from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuthStore } from './auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireProfile?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/auth',
  requireProfile = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to={redirectTo} />;
  }

  // Vérifier si le profil est complet si nécessaire
  if (requireProfile && user) {
    const profileComplete = user.sport && user.weight && user.height && user.age;
    if (!profileComplete) {
      return <Redirect to="/onboarding" />;
    }
  }

  return <>{children}</>;
};

// Guard pour les routes publiques
export const PublicGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
};
