// src/features/profile/components/settings/ProfileSettings.tsx
import React, { useState, useCallback } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { useToast } from '../../../../shared/hooks/use-toast';
import { supabase } from '../../../../lib/supabase';

interface ProfileData {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  city: string;
  country: string;
}

interface ProfileSettingsProps {
  initialData: ProfileData;
  userId: string | undefined;
  onProfileUpdate: (data: ProfileData) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialData,
  userId,
  onProfileUpdate,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = useCallback(async () => {
    if (!userId) {
      toast({
        title: 'Erreur',
        description: 'Utilisateur non connecté',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          city: profileData.city,
          country: profileData.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      onProfileUpdate(profileData);
      toast({
        title: 'Succès',
        description: 'Profil mis à jour avec succès !',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, profileData, onProfileUpdate, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Informations du profil</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nom complet</Label>
          <Input
            id="full_name"
            type="text"
            value={profileData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Votre nom complet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            type="text"
            value={profileData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Votre nom d'utilisateur"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            type="text"
            value={profileData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Votre ville"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            type="text"
            value={profileData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="Votre pays"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biographie</Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Parlez-nous de vous..."
          rows={4}
        />
      </div>

      <Button
        onClick={handleSaveProfile}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder le profil
          </>
        )}
      </Button>
    </div>
  );
};

export default ProfileSettings;