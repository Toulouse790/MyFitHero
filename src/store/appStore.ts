import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goals?: string[];
  preferred_sports?: string[];
  timezone?: string;
  language?: string;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

interface AppStoreState {
  // User state
  appStoreUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // App state
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeFeature: string | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // App actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveFeature: (feature: string | null) => void;
  
  // Utility actions
  reset: () => void;
  init: () => void;
}

const initialState = {
  appStoreUser: null,
  isAuthenticated: false,
  isLoading: false,
  notifications: [],
  unreadCount: 0,
  theme: 'system' as const,
  sidebarCollapsed: false,
  activeFeature: null,
};

export const appStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ 
        appStoreUser: user,
        isAuthenticated: !!user 
      }),
      
      updateUser: (updates) => set((state) => ({
        appStoreUser: state.appStoreUser 
          ? { ...state.appStoreUser, ...updates }
          : null
      })),
      
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Notification actions
      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0,
      })),
      
      removeNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        return {
          notifications: state.notifications.filter(notif => notif.id !== id),
          unreadCount: notification && !notification.read 
            ? Math.max(0, state.unreadCount - 1) 
            : state.unreadCount,
        };
      }),
      
      clearAllNotifications: () => set({ 
        notifications: [], 
        unreadCount: 0 
      }),
      
      // App actions
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setActiveFeature: (feature) => set({ activeFeature: feature }),
      
      // Utility actions
      reset: () => set(initialState),
      
      init: () => {
        // Initialize app state, check auth, etc.
        set((state) => ({
          ...state,
          isLoading: false,
        }));
      },
    }),
    {
      name: 'myfithero-app-store',
      partialize: (state) => ({
        appStoreUser: state.appStoreUser,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        // Don't persist notifications and loading state
      }),
    }
  )
);

// Selectors for better performance
export const useAppStoreUser = () => appStore((state) => state.appStoreUser);
export const useAppStoreAuth = () => appStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));
export const useAppStoreNotifications = () => appStore((state) => ({
  notifications: state.notifications,
  unreadCount: state.unreadCount,
}));
export const useAppStoreUI = () => appStore((state) => ({
  theme: state.theme,
  sidebarCollapsed: state.sidebarCollapsed,
  activeFeature: state.activeFeature,
}));