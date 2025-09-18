// src/features/profile/components/avatar/AvatarControls.tsx
import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface AvatarControlsProps {
  hasAvatar: boolean;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  onRemoveAvatar: () => void;
  className?: string;
}

export const AvatarControls: React.FC<AvatarControlsProps> = ({
  hasAvatar,
  isUploading,
  onFileSelect,
  onRemoveAvatar,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!hasAvatar) {
    // Bouton d'ajout pour les avatars vides
    return (
      <div className={className}>
        <button
          onClick={openFileDialog}
          className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          title="Ajouter une photo"
          disabled={isUploading}
        >
          <Camera size={16} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // Contrôles overlay pour les avatars existants
  return (
    <div className={`absolute inset-0 rounded-full ${className}`}>
      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={openFileDialog}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Changer la photo"
            disabled={isUploading}
          >
            <Camera size={16} />
          </button>

          <button
            onClick={onRemoveAvatar}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            title="Supprimer la photo"
            disabled={isUploading}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};