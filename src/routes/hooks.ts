import { useLocation } from 'wouter';

export interface AppNavigationHook {
  navigateTo: (path: string) => void;
  currentPath: string;
  goBack: () => void;
  goHome: () => void;
  goToDashboard: () => void;
  goToProfile: () => void;
  goToAuth: () => void;
}

export function useAppNavigation(): AppNavigationHook {
  const [location, setLocation] = useLocation();

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/dashboard');
    }
  };

  const goHome = () => {
    setLocation('/');
  };

  const goToDashboard = () => {
    setLocation('/dashboard');
  };

  const goToProfile = () => {
    setLocation('/profile');
  };

  const goToAuth = () => {
    setLocation('/auth');
  };

  return {
    navigateTo,
    currentPath: location,
    goBack,
    goHome,
    goToDashboard,
    goToProfile,
    goToAuth,
  };
}

export default useAppNavigation;