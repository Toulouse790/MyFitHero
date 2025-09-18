// src/features/profile/components/settings/PrivacySettings.tsx
import React, { useState } from 'react';
import { Shield, Eye, Users, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { useToast } from '../../../../shared/hooks/use-toast';

interface PrivacySettingsProps {
  profileVisibility: 'public' | 'friends' | 'private';
  workoutVisibility: 'public' | 'friends' | 'private';
  allowFriendRequests: boolean;
  showAchievements: boolean;
  showStats: boolean;
  analyticsEnabled: boolean;
  onProfileVisibilityChange: (visibility: 'public' | 'friends' | 'private') => void;
  onWorkoutVisibilityChange: (visibility: 'public' | 'friends' | 'private') => void;
  onToggleFriendRequests: () => void;
  onToggleAchievements: () => void;
  onToggleStats: () => void;
  onToggleAnalytics: () => void;
  onExportData: () => Promise<void>;
  onDeleteData: () => Promise<void>;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  profileVisibility,
  workoutVisibility,
  allowFriendRequests,
  showAchievements,
  showStats,
  analyticsEnabled,
  onProfileVisibilityChange,
  onWorkoutVisibilityChange,
  onToggleFriendRequests,
  onToggleAchievements,
  onToggleStats,
  onToggleAnalytics,
  onExportData,
  onDeleteData,
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'Visible par tous les utilisateurs';
      case 'friends':
        return 'Visible uniquement par vos amis';
      case 'private':
        return 'Visible uniquement par vous';
      default:
        return '';
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await onExportData();
      toast({
        title: 'Export terminé',
        description: 'Vos données ont été exportées avec succès !',
      });
      setIsExportDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos données. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      await onDeleteData();
      toast({
        title: 'Données supprimées',
        description: 'Toutes vos données ont été supprimées définitivement.',
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer vos données. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold">Confidentialité et données</h3>
      </div>

      {/* Visibilité du profil */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Visibilité du profil</Label>
          <Select value={profileVisibility} onValueChange={onProfileVisibilityChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="friends">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Amis uniquement</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Privé</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-1">
            {getVisibilityDescription(profileVisibility)}
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Visibilité des entraînements</Label>
          <Select value={workoutVisibility} onValueChange={onWorkoutVisibilityChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="friends">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Amis uniquement</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Privé</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-1">
            {getVisibilityDescription(workoutVisibility)}
          </p>
        </div>
      </div>

      {/* Options sociales */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Options sociales</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Demandes d'amis</Label>
            <p className="text-xs text-gray-600">
              Autoriser les autres utilisateurs à vous envoyer des demandes d'amis
            </p>
          </div>
          <Switch
            checked={allowFriendRequests}
            onCheckedChange={onToggleFriendRequests}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Afficher les succès</Label>
            <p className="text-xs text-gray-600">
              Permettre aux autres de voir vos succès et réalisations
            </p>
          </div>
          <Switch
            checked={showAchievements}
            onCheckedChange={onToggleAchievements}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Afficher les statistiques</Label>
            <p className="text-xs text-gray-600">
              Permettre aux autres de voir vos statistiques d'entraînement
            </p>
          </div>
          <Switch
            checked={showStats}
            onCheckedChange={onToggleStats}
          />
        </div>
      </div>

      {/* Données et analyse */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Données et analyse</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Analyse d'utilisation</Label>
            <p className="text-xs text-gray-600">
              Aider à améliorer l'app en partageant des données d'usage anonymes
            </p>
          </div>
          <Switch
            checked={analyticsEnabled}
            onCheckedChange={onToggleAnalytics}
          />
        </div>
      </div>

      {/* Gestion des données */}
      <div className="space-y-4 border-t pt-6">
        <h4 className="font-medium text-gray-900">Gestion des données</h4>

        <div className="space-y-3">
          {/* Export des données */}
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Exporter mes données
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exporter vos données</DialogTitle>
                <DialogDescription>
                  Télécharger une copie complète de toutes vos données personnelles
                  au format JSON. Cela inclut vos entraînements, mesures, objectifs
                  et paramètres.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsExportDialogOpen(false)}
                  disabled={isExporting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  {isExporting ? 'Export en cours...' : 'Exporter'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Suppression des données */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer toutes mes données
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Supprimer définitivement vos données</span>
                </DialogTitle>
                <DialogDescription>
                  <div className="space-y-2">
                    <p>
                      ⚠️ <strong>Cette action est irréversible !</strong>
                    </p>
                    <p>
                      Toutes vos données seront définitivement supprimées, incluant :
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Historique des entraînements</li>
                      <li>Mesures corporelles</li>
                      <li>Objectifs et programmes</li>
                      <li>Données de nutrition et sommeil</li>
                      <li>Paramètres et préférences</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Informations légales */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Protection de vos données</p>
            <p>
              Nous respectons votre vie privée et nous nous conformons au RGPD.
              Vos données sont chiffrées et stockées de manière sécurisée.
              Consultez notre politique de confidentialité pour plus d'informations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;