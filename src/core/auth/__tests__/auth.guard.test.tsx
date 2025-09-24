import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthGuard } from '@/core/auth/auth.guard';
import { useAuthStore } from '@/core/auth/auth.store';

// Mock du store d'authentification
jest.mock('@/core/auth/auth.store');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock de wouter
jest.mock('wouter', () => ({
  useLocation: () => ['/test', jest.fn()],
  Redirect: ({ to }: { to: string }) => <div data-testid="redirect">Redirecting to {to}</div>,
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /auth when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('redirect')).toHaveTextContent('Redirecting to /auth');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', name: 'Test User' },
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
  });

  it('should show loading spinner when authentication is loading', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    // Vérifier qu'il y a un spinner (div avec classe animate-spin)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should use custom redirect path when provided', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    } as any);

    render(
      <AuthGuard redirectTo="/custom-auth">
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('redirect')).toHaveTextContent('Redirecting to /custom-auth');
  });
});