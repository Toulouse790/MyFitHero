/* eslint-disable react/prop-types */
import React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from '@/shared/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function (toast) {
        const { id, title, description, action, variant, ...props } = toast;
        // Mapping des variants pour compatibilité avec le composant Toast
        const toastVariant = variant === 'success' ? 'default' : 
                            variant === 'warning' ? 'default' : 
                            variant === 'error' ? 'destructive' : 
                            'default';
        
        return (
          <Toast key={id} variant={toastVariant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action && React.isValidElement(action) ? action : null}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
