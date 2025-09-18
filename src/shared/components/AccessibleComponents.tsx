import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { AriaUtils } from '../hooks/useAccessibility';
import { cn } from '../../../lib/utils';

// 🎯 Types pour l'accessibilité
interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // Props ARIA
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaDescribedBy?: string;
  // Rôle spécifique
  role?: 'button' | 'switch' | 'tab' | 'menuitem';
}

interface AccessibleLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'underline';
  isExternal?: boolean;
  isCurrent?: boolean;
  // Props ARIA
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// 🎯 Bouton accessible WCAG 2.1 AA
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText = 'Chargement...',
    leftIcon,
    rightIcon,
    ariaLabel,
    ariaPressed,
    ariaExpanded,
    ariaControls,
    ariaDescribedBy,
    role = 'button',
    disabled,
    className,
    onClick,
    onKeyDown,
    ...props
  }, ref) => {
    // Styles avec contrastes WCAG AA
    const baseClasses = `
      inline-flex items-center justify-center font-medium 
      transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:pointer-events-none
    `;

    const variantClasses = {
      primary: `
        bg-blue-600 text-white hover:bg-blue-700 
        focus:ring-blue-500 active:bg-blue-800
        disabled:bg-blue-300
      `,
      secondary: `
        bg-gray-600 text-white hover:bg-gray-700
        focus:ring-gray-500 active:bg-gray-800
        disabled:bg-gray-300
      `,
      outline: `
        border-2 border-blue-600 text-blue-600 bg-transparent
        hover:bg-blue-50 focus:ring-blue-500
        active:bg-blue-100 disabled:border-blue-300
        disabled:text-blue-300
      `,
      ghost: `
        text-gray-700 bg-transparent hover:bg-gray-100
        focus:ring-gray-500 active:bg-gray-200
        disabled:text-gray-400
      `,
      danger: `
        bg-red-600 text-white hover:bg-red-700
        focus:ring-red-500 active:bg-red-800
        disabled:bg-red-300
      `
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]'
    };

    // Gestionnaire de clavier accessible
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onClick && !disabled && !isLoading) {
          onClick(event as any);
        }
      }
      onKeyDown?.(event);
    };

    // Props ARIA complets
    const ariaProps = {
      ...AriaUtils.buttonProps(
        ariaLabel || (typeof children === 'string' ? children : ''),
        ariaPressed,
        disabled || isLoading,
        ariaDescribedBy
      ),
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      role
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...ariaProps}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!isLoading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <span>
          {isLoading ? loadingText : children}
        </span>
        
        {!isLoading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// 🎯 Lien accessible WCAG 2.1 AA
export const AccessibleLink = forwardRef<HTMLAnchorElement, AccessibleLinkProps>(
  ({
    children,
    variant = 'primary',
    isExternal = false,
    isCurrent = false,
    ariaLabel,
    ariaDescribedBy,
    className,
    href,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center font-medium transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      underline-offset-4 hover:underline
    `;

    const variantClasses = {
      primary: 'text-blue-600 hover:text-blue-800',
      secondary: 'text-gray-600 hover:text-gray-800',
      underline: 'text-blue-600 hover:text-blue-800 underline'
    };

    // Props ARIA pour les liens
    const ariaProps = {
      ...AriaUtils.linkProps(
        ariaLabel || (typeof children === 'string' ? children : ''),
        isCurrent,
        ariaDescribedBy
      ),
      ...(isExternal && {
        'aria-describedby': `${ariaDescribedBy || ''} external-link-description`.trim()
      })
    };

    return (
      <>
        <a
          ref={ref}
          href={href}
          className={cn(
            baseClasses,
            variantClasses[variant],
            className
          )}
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
          {...ariaProps}
          {...props}
        >
          {children}
          {isExternal && (
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </a>
        
        {/* Description cachée pour les liens externes */}
        {isExternal && (
          <span id="external-link-description" className="sr-only">
            (ouvre dans un nouvel onglet)
          </span>
        )}
      </>
    );
  }
);

AccessibleLink.displayName = 'AccessibleLink';

// 🎯 Skip Link WCAG
export const SkipLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        `
        absolute top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white
        text-sm font-medium rounded-md shadow-lg
        transform -translate-y-full opacity-0
        focus:translate-y-0 focus:opacity-100
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `,
        className
      )}
      onFocus={(e) => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }}
    >
      {children}
    </a>
  );
};

// 🎯 Heading accessible avec niveau sémantique
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
}

export const AccessibleHeading: React.FC<AccessibleHeadingProps> = ({
  level,
  children,
  className,
  id,
  tabIndex,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = `
    font-bold text-gray-900 tracking-tight
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    scroll-mt-4
  `;
  
  const levelClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg'
  };

  return (
    <Tag
      id={id}
      tabIndex={tabIndex}
      className={cn(baseClasses, levelClasses[level], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// 🎯 Alert accessible pour les messages
interface AccessibleAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AccessibleAlert: React.FC<AccessibleAlertProps> = ({
  type,
  children,
  title,
  dismissible = false,
  onDismiss,
  className
}) => {
  const baseClasses = `
    p-4 rounded-md border-l-4 focus-within:ring-2 focus-within:ring-offset-2
  `;

  const typeClasses = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  const icons = {
    success: (
      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(baseClasses, typeClasses[type], className)}
    >
      <div className="flex">
        <div className="flex-shrink-0" aria-hidden="true">
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <AccessibleButton
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              ariaLabel="Fermer l'alerte"
              className="text-current hover:bg-black/5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AccessibleButton>
          </div>
        )}
      </div>
    </div>
  );
};