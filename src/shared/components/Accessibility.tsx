import React from 'react';

// Composant pour améliorer l'accessibilité
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  ariaLabel,
  ariaDescribedBy,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
};

// Composant pour les liens accessibles
interface AccessibleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  href,
  children,
  external = false,
  className,
  ariaLabel
}) => {
  return (
    <a
      href={href}
      className={`text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${className || ''}`}
      aria-label={ariaLabel}
      {...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${ariaLabel || children} (ouvre dans un nouvel onglet)`
      })}
    >
      {children}
      {external && <span className="sr-only"> (ouvre dans un nouvel onglet)</span>}
    </a>
  );
};

// Composant pour les formulaires accessibles
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  help?: string;
  placeholder?: string;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  id,
  type = 'text',
  required = false,
  value,
  onChange,
  error,
  help,
  placeholder
}) => {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ');
  
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="requis">*</span>}
      </label>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      
      {help && (
        <p id={helpId} className="text-sm text-gray-600">
          {help}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Hook pour la navigation au clavier
export const useKeyboardNavigation = () => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content avec Alt+M
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      }
      
      // Navigation rapide avec Alt+1, Alt+2, etc.
      if (event.altKey && /^[1-9]$/.test(event.key)) {
        event.preventDefault();
        const navLinks = document.querySelectorAll('[data-nav-shortcut]');
        const index = parseInt(event.key) - 1;
        const link = navLinks[index] as HTMLElement;
        if (link) {
          link.focus();
          link.click();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};