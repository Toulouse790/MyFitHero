// Export principal du module auth
export * from './types';
export { AuthService } from './services/auth.service';
export { useAuth, useAuthStatus, useConversationalOnboarding, useErrorHandler, usePWA } from './hooks';
export * from './components';

// Pages
export { AuthRouter } from './pages/AuthRouter';
export { LoginPage } from './pages/LoginPage';
export { SignupPage } from './pages/SignupPage';
export { default as ProfileComplete } from './pages/ProfileComplete';
export { default as AuthPage } from './pages/AuthPage';