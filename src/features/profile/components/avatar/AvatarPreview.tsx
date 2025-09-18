// src/features/profile/components/avatar/AvatarPreview.tsx
import React from 'react';
import { User, Loader2 } from 'lucide-react';

interface AvatarPreviewProps {
  avatarUrl?: string;
  size: 'sm' | 'md' | 'lg';
  isUploading: boolean;
  className?: string;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  avatarUrl,
  size,
  isUploading,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br from-blue-500 to-indigo-600 
        rounded-full overflow-hidden relative flex items-center justify-center
        ${className}
      `}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <User className="text-white" size={iconSizes[size]} />
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader2 className="text-white animate-spin" size={iconSizes[size]} />
        </div>
      )}
    </div>
  );
};