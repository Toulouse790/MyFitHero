// src/features/landing/components/hero/HeroCTA.tsx
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface HeroCTAProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  icon?: boolean;
  loading?: boolean;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  text,
  onClick,
  variant = 'primary',
  size = 'lg',
  icon = true,
  loading = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
      case 'secondary':
        return 'bg-white text-gray-900 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Button
      size={size}
      onClick={onClick}
      disabled={loading}
      className={`${getVariantClasses()} font-semibold tracking-wide`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
          Chargement...
        </div>
      ) : (
        <div className="flex items-center">
          {variant === 'primary' && (
            <Zap className="mr-2 h-5 w-5" />
          )}
          {text}
          {icon && (
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      )}
    </Button>
  );
};