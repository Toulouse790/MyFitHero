import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AIIntelligence } from '../AIIntelligence';
import { testHelpers } from '@/test/setupEnterprise';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('@/core/auth/auth.store', () => ({
  useAuthStore: () => ({
    user: testHelpers.createAuthenticatedUser(),
    isAuthenticated: true,
  }),
}));

jest.mock('@/features/ai-coach/hooks/useAICoach', () => ({
  useAICoach: () => ({
    sendMessage: jest.fn().mockResolvedValue({
      message: 'Great question! Based on your profile...',
      recommendations: [
        {
          type: 'workout',
          priority: 'high',
          content: 'Try a 30-minute HIIT session'
        }
      ]
    }),
    isLoading: false,
    error: null,
    chatHistory: [
      {
        id: '1',
        content: 'Hello! How can I help with your fitness journey?',
        type: 'ai',
        timestamp: new Date()
      }
    ]
  }),
}));

describe('AIIntelligence - Enterprise Testing Suite', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('🔍 Core Functionality', () => {
    it('should render AI coach interface correctly', async () => {
      render(<AIIntelligence />);
      
      // Check for main UI elements
      expect(screen.getByRole('main', { name: /ai coach/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
      
      // Check for chat history
      expect(screen.getByText(/hello! how can i help/i)).toBeInTheDocument();
    });

    it('should handle user message input and submission', async () => {
      const mockSendMessage = jest.fn().mockResolvedValue({
        message: 'Thanks for your question!',
        recommendations: []
      });
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      // Type a message
      await user.type(messageInput, 'What workout should I do today?');
      expect(messageInput).toHaveValue('What workout should I do today?');
      
      // Send the message
      await user.click(sendButton);
      
      // Verify the message was sent
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('What workout should I do today?');
      });
    });

    it('should display AI recommendations correctly', async () => {
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: jest.fn(),
        isLoading: false,
        error: null,
        chatHistory: [
          {
            id: '1',
            content: 'Here are my recommendations:',
            type: 'ai',
            timestamp: new Date(),
            recommendations: [
              {
                type: 'workout',
                priority: 'high',
                content: 'Try a 30-minute HIIT session'
              },
              {
                type: 'nutrition',
                priority: 'medium',
                content: 'Increase your protein intake'
              }
            ]
          }
        ]
      });

      render(<AIIntelligence />);
      
      // Check for recommendations
      expect(screen.getByText(/try a 30-minute hiit session/i)).toBeInTheDocument();
      expect(screen.getByText(/increase your protein intake/i)).toBeInTheDocument();
      
      // Check for priority indicators
      expect(screen.getByText(/high/i)).toBeInTheDocument();
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });
  });

  describe('🔥 Error Handling & Edge Cases', () => {
    it('should handle API errors gracefully', async () => {
      const mockSendMessage = jest.fn().mockRejectedValue(new Error('API Error'));
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: 'Failed to send message. Please try again.',
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      // Error message should be displayed
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle loading states correctly', async () => {
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: jest.fn(),
        isLoading: true,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      // Loading indicator should be present
      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    });

    it('should prevent sending empty messages', async () => {
      const mockSendMessage = jest.fn();
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      // Try to send empty message
      await user.click(sendButton);
      
      // Should not call sendMessage
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should handle extremely long messages', async () => {
      const mockSendMessage = jest.fn();
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const longMessage = 'a'.repeat(2000); // Very long message
      
      await user.type(messageInput, longMessage);
      
      // Should truncate or show warning
      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      if (mockSendMessage.mock.calls.length > 0) {
        const sentMessage = mockSendMessage.mock.calls[0][0];
        expect(sentMessage.length).toBeLessThanOrEqual(1000); // Assuming 1000 char limit
      }
    });
  });

  describe('♿ Accessibility Testing', () => {
    it('should be accessible with screen readers', async () => {
      const { container } = render(<AIIntelligence />);
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      // Tab navigation should work
      await user.tab();
      expect(messageInput).toHaveFocus();
      
      await user.tab();
      expect(sendButton).toHaveFocus();
      
      // Enter key should send message
      await user.type(messageInput, 'Test message');
      await user.keyboard('{Enter}');
      
      // Message should be sent (input cleared)
      await waitFor(() => {
        expect(messageInput).toHaveValue('');
      });
    });

    it('should have proper ARIA labels and roles', () => {
      render(<AIIntelligence />);
      
      // Check ARIA attributes
      const chatContainer = screen.getByRole('main');
      expect(chatContainer).toHaveAttribute('aria-label', expect.stringContaining('AI Coach'));
      
      const messageInput = screen.getByRole('textbox');
      expect(messageInput).toHaveAttribute('aria-describedby');
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveAttribute('aria-describedby');
    });
  });

  describe('🚀 Performance Testing', () => {
    it('should render within performance threshold', async () => {
      const startTime = performance.now();
      
      render(<AIIntelligence />);
      
      // Wait for component to fully render
      await screen.findByRole('main');
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle rapid message sending without performance degradation', async () => {
      const mockSendMessage = jest.fn().mockResolvedValue({
        message: 'Response',
        recommendations: []
      });
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      const startTime = performance.now();
      
      // Send 10 messages rapidly
      for (let i = 0; i < 10; i++) {
        await user.clear(messageInput);
        await user.type(messageInput, `Message ${i}`);
        await user.click(sendButton);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle rapid sending efficiently
      expect(totalTime).toBeLessThan(1000); // Less than 1 second
    });
  });

  describe('🔒 Security Testing', () => {
    it('should sanitize user input to prevent XSS', async () => {
      const mockSendMessage = jest.fn();
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      // Try to inject script
      const maliciousInput = '<script>alert("xss")</script>Hello';
      
      await user.type(messageInput, maliciousInput);
      await user.click(sendButton);
      
      // Verify input is sanitized
      await waitFor(() => {
        const sentMessage = mockSendMessage.mock.calls[0]?.[0];
        expect(sentMessage).not.toContain('<script>');
        expect(sentMessage).toBe('Hello'); // Only safe content remains
      });
    });

    it('should not expose sensitive data in DOM', () => {
      render(<AIIntelligence />);
      
      const { container } = render(<AIIntelligence />);
      
      // Check that no API keys or tokens are exposed
      const htmlContent = container.innerHTML;
      expect(htmlContent).not.toMatch(/api[_-]?key/i);
      expect(htmlContent).not.toMatch(/token/i);
      expect(htmlContent).not.toMatch(/secret/i);
    });
  });

  describe('📱 Mobile & Responsive Testing', () => {
    it('should adapt to mobile viewport', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
      
      render(<AIIntelligence />);
      
      // Should have mobile-friendly layout
      const chatContainer = screen.getByRole('main');
      expect(chatContainer).toHaveClass(/mobile|responsive/);
    });

    it('should handle touch interactions', async () => {
      render(<AIIntelligence />);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      // Simulate touch events
      fireEvent.touchStart(sendButton);
      fireEvent.touchEnd(sendButton);
      
      // Should handle touch properly (no double-tap delay)
      expect(sendButton).toHaveAttribute('touch-action', 'manipulation');
    });
  });

  describe('🔄 Integration Testing', () => {
    it('should integrate with authentication system', async () => {
      // Test with unauthenticated user
      jest.mocked(require('@/core/auth/auth.store').useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      render(<AIIntelligence />);
      
      // Should show authentication prompt
      expect(screen.getByText(/sign in to access ai coach/i)).toBeInTheDocument();
    });

    it('should sync with user profile data', async () => {
      const userWithPreferences = {
        ...testHelpers.createAuthenticatedUser(),
        preferences: {
          fitness_level: 'intermediate',
          goals: ['weight_loss', 'muscle_gain'],
          dietary_restrictions: ['vegetarian']
        }
      };

      jest.mocked(require('@/core/auth/auth.store').useAuthStore).mockReturnValue({
        user: userWithPreferences,
        isAuthenticated: true,
      });

      render(<AIIntelligence />);
      
      // Should display personalized content
      expect(screen.getByText(/based on your intermediate fitness level/i)).toBeInTheDocument();
    });
  });

  describe('🎯 Business Logic Testing', () => {
    it('should track user engagement metrics', async () => {
      const mockAnalytics = jest.fn();
      
      // Mock analytics
      (window as any).gtag = mockAnalytics;

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      await user.type(messageInput, 'Test message');
      await user.click(sendButton);
      
      // Should track engagement
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'ai_coach_message_sent', {
        message_length: 'Test message'.length,
        user_type: 'authenticated'
      });
    });

    it('should provide appropriate workout recommendations', async () => {
      const mockSendMessage = jest.fn().mockImplementation((message: string) => {
        if (message.toLowerCase().includes('beginner')) {
          return Promise.resolve({
            message: 'Perfect for beginners!',
            recommendations: [
              {
                type: 'workout',
                priority: 'high',
                content: 'Start with 20-minute walks'
              }
            ]
          });
        }
        return Promise.resolve({ message: 'General advice', recommendations: [] });
      });
      
      jest.mocked(require('@/features/ai-coach/hooks/useAICoach').useAICoach).mockReturnValue({
        sendMessage: mockSendMessage,
        isLoading: false,
        error: null,
        chatHistory: []
      });

      render(<AIIntelligence />);
      
      const messageInput = screen.getByRole('textbox', { name: /message/i });
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      await user.type(messageInput, 'I am a complete beginner');
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/start with 20-minute walks/i)).toBeInTheDocument();
      });
    });
  });
});