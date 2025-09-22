// Export des composants de la feature auth
export { default as USMarketOnboarding } from './USMarketOnboarding';
export { default as ConversationalOnboarding } from './ConversationalOnboarding';
export { default as AuthPages } from './AuthPages';
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as AuthGuard } from './AuthGuard';
export { default as PackSelector } from './PackSelector';
export { default as PersonalInfoForm } from './PersonalInfoForm';
export { default as PositionSelector } from './PositionSelector';
export { default as SportSelector } from './SportSelector';

// Composants d'onboarding refactorisés
export { OnboardingHeader } from './OnboardingHeader';
export { OnboardingTips } from './OnboardingTips';
export { OnboardingValidation } from './OnboardingValidation';
export { OnboardingNavigation } from './OnboardingNavigation';
export { OnboardingFormFields } from './OnboardingFormFields';
export { ConversationalOnboardingRefactored } from './ConversationalOnboardingRefactored';

// Hook d'état
export { useOnboardingState } from '@/features/auth/hooks/useOnboardingState';
