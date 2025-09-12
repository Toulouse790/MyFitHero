export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'warning';
  duration?: number;
  action?: React.ReactNode;
}

export type ToastVariant = 'default' | 'destructive' | 'warning';

export interface ToastActionElement {
  altText: string;
  action: () => void;
  label: string;
}
