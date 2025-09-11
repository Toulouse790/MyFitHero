import { Route, Switch } from 'wouter';
import { Suspense, lazy } from 'react';

// Import des guards
import { AuthGuard } from '../auth/auth.guard';

// Import des pages principales
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lazy loading des features
const LandingPage = lazy(() => import('../../features/landing/pages/LandingPage'));
const WorkoutPage = lazy(() => import('../../features/workout/pages/WorkoutPage'));
const ProfilePage = lazy(() => import('../../features/profile/pages/ProfilePage'));
const AnalyticsPage = lazy(() => import('../../features/analytics/pages/AnalyticsPage'));

// Pages statiques
import NotFoundPage from '../../../pages/NotFound';

// Routes configuration
export const ROUTES = {
  HOME: '/',
  LANDING: '/landing',
  WORKOUT: '/workout',
  PROFILE: '/profile',
  ANALYTICS: '/analytics',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
} as const;

function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Routes publiques */}
        <Route path={ROUTES.LANDING} component={LandingPage} />
        
        {/* Routes protégées */}
        <Route path={ROUTES.WORKOUT}>
          <AuthGuard>
            <WorkoutPage />
          </AuthGuard>
        </Route>
        
        <Route path={ROUTES.PROFILE}>
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        </Route>
        
        <Route path={ROUTES.ANALYTICS}>
          <AuthGuard>
            <AnalyticsPage />
          </AuthGuard>
        </Route>
        
        {/* Route par défaut */}
        <Route path={ROUTES.HOME}>
          <LandingPage />
        </Route>
        
        {/* 404 */}
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
}

export default AppRouter;
