import React, { useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { appStore } from '@/store/appStore';
import { AvatarPreview, AvatarControls, FileValidation, AvatarUploadService } from './avatar';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
  editable = true,
}) => {
  const { toast } = useToast();
  const { appStoreUser, updateUserProfile } = appStore();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayAvatar = previewUrl || currentAvatar || appStoreUser?.avatar_url;

  const handleFileSelect = async (file: File) => {
    if (!appStoreUser?.id) return;

    // Validation du fichier
    const validation = await FileValidation.validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: 'Erreur',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    try {
      // Créer un aperçu
      const preview = await FileValidation.createPreviewUrl(file);
      setPreviewUrl(preview);

      // Upload du fichier
      await uploadAvatar(file);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de traiter l\'image.',
        variant: 'destructive',
      });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!appStoreUser?.id) return;

    setIsUploading(true);
    try {
      const result = await AvatarUploadService.uploadAvatar(file, appStoreUser.id);

      if (result.success && result.avatarUrl) {
        // Mettre à jour le store local
        updateUserProfile({
          ...appStoreUser,
          avatar_url: result.avatarUrl,
        });

        // Callback pour le parent
        onAvatarChange?.(result.avatarUrl);

        setPreviewUrl(null);
        toast({
          title: 'Photo mise à jour',
          description: 'Votre photo de profil a été mise à jour avec succès.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setPreviewUrl(null);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour votre photo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!appStoreUser?.id) return;

    setIsUploading(true);
    try {
      const result = await AvatarUploadService.removeAvatar(appStoreUser.id);

      if (result.success) {
        // Mettre à jour le store local
        updateUserProfile({
          ...appStoreUser,
          avatar_url: undefined,
        });

        // Callback pour le parent
        onAvatarChange?.('');

        toast({
          title: 'Photo supprimée',
          description: 'Votre photo de profil a été supprimée.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer votre photo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <AvatarPreview
        avatarUrl={displayAvatar}
        size={size}
        isUploading={isUploading}
      />

      {editable && (
        <AvatarControls
          hasAvatar={!!displayAvatar}
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
          onRemoveAvatar={removeAvatar}
        />
      )}
    </div>
  );
};

export default AvatarUpload;
