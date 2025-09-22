// src/features/profile/components/avatar/AvatarUploadService.tsx
import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export class AvatarUploadService {
  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Mettre à jour le profil utilisateur
      const { error: updateError } = await (supabase as any)
        .from('user_profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        avatarUrl,
      };
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      return {
        success: false,
        error: 'Impossible de mettre à jour votre photo.',
      };
    }
  }

  static async removeAvatar(userId: string): Promise<UploadResult> {
    try {
      // Supprimer du profil
      const { error: _error } = await (supabase as any)
        .from('user_profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (_error) {
        throw _error;
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Erreur suppression avatar:', error);
      return {
        success: false,
        error: 'Impossible de supprimer votre photo.',
      };
    }
  }
}