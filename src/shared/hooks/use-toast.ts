import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast extends Required<Omit<ToastOptions, 'action'>> {
  id: string;
  action?: ToastOptions['action'];
  createdAt: number;
  dismissed: boolean;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const TOAST_REMOVE_DELAY = 1000000; // 1000 seconds - high value for persistence

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toastOptions) => {
    const id = uuidv4();
    const toast: Toast = {
      id,
      title: toastOptions.title || '',
      description: toastOptions.description || '',
      variant: toastOptions.variant || 'default',
      duration: toastOptions.duration || 5000,
      action: toastOptions.action,
      createdAt: Date.now(),
      dismissed: false,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto dismiss after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, toast.duration);
    }

    return id;
  },
  
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, dismissed: true } : toast
      ),
    }));

    // Remove from store after animation delay
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, TOAST_REMOVE_DELAY);
  },
  
  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));

export const useToast = () => {
  const { addToast, dismissToast, clearAllToasts, toasts } = useToastStore();

  const toast = (options: ToastOptions) => {
    return addToast(options);
  };

  // Convenience methods
  const success = (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'success',
    });
  };

  const error = (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  const warning = (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'warning',
    });
  };

  const info = (title: string, description?: string) => {
    return toast({
      title,
      description,
      variant: 'default',
    });
  };

  const dismiss = (id: string) => {
    dismissToast(id);
  };

  const dismissAll = () => {
    clearAllToasts();
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    toasts,
  };
};

// Hook to consume toasts in components
export const useToasts = () => {
  const toasts = useToastStore((state) => state.toasts);
  return toasts.filter((toast) => !toast.dismissed);
};