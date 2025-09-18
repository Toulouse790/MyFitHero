// src/features/landing/components/cta/CTAButton.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  href,
  target,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-white text-blue-600 hover:bg-gray-50 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white backdrop-blur-sm border border-white/20',
    outline: 'bg-transparent text-current border-2 border-current hover:bg-current hover:text-white focus:ring-current',
    ghost: 'bg-transparent text-current hover:bg-white/10 focus:ring-current',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyles}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={combinedStyles}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
};