// src/features/profile/components/settings/AccountDeletion.tsx
import React, { useState } from 'react';
import { AlertTriangle, Trash2, Shield, Download, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useToast } from '../../../../shared/hooks/use-toast';

interface AccountDeletionProps {
  userEmail: string;
  onDeleteAccount: () => Promise<void>;
  onExportData: () => Promise<void>;
}

export const AccountDeletion: React.FC<AccountDeletionProps> = ({
  userEmail,
  onDeleteAccount,
  onExportData,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [hasExportedData, setHasExportedData] = useState(false);
  const [hasReadWarning, setHasReadWarning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const CONFIRMATION_TEXT = 'SUPPRIMER MON COMPTE';
  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT;
  const canProceedWithDeletion = isConfirmationValid && hasReadWarning;

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await onExportData();
      setHasExportedData(true);
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

  const handleDeleteAccount = async () => {
    if (!canProceedWithDeletion) return;

    setIsDeleting(true);
    try {
      await onDeleteAccount();
      toast({
        title: 'Compte supprimé',
        description: 'Votre compte a été supprimé définitivement.',
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur de suppression',
        description: 'Impossible de supprimer votre compte. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetDeleteDialog = () => {
    setConfirmationText('');
    setHasReadWarning(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-600">Zone de danger</h3>
      </div>

      {/* Avertissement principal */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-2">
              Suppression définitive du compte
            </h4>
            <p className="text-red-700 text-sm mb-4">
              La suppression de votre compte est une action irréversible qui entraînera 
              la perte définitive de toutes vos données, y compris :
            </p>
            <ul className="text-red-700 text-sm space-y-1 ml-4">
              <li>• Historique complet des entraînements</li>
              <li>• Mesures corporelles et évolution</li>
              <li>• Objectifs et programmes personnalisés</li>
              <li>• Données de nutrition et sommeil</li>
              <li>• Connexions avec amis et communauté</li>
              <li>• Succès et réalisations</li>
              <li>• Paramètres et préférences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export des données avant suppression */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Download className="w-5 h-5 text-blue-600 mt-1" />
          <div className="flex-1">
            <h5 className="font-medium text-blue-800 mb-2">
              Sauvegarder vos données avant suppression
            </h5>
            <p className="text-blue-700 text-sm mb-3">
              Nous recommandons fortement d'exporter une copie de vos données 
              avant de supprimer votre compte.
            </p>
            <div className="flex items-center space-x-2">
              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter mes données
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exporter vos données</DialogTitle>
                    <DialogDescription>
                      Télécharger une archive complète de toutes vos données au format JSON.
                      Cette sauvegarde vous permettra de conserver vos informations même 
                      après la suppression de votre compte.
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
                      {isExporting ? 'Export en cours...' : 'Télécharger'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {hasExportedData && (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Données exportées</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives à la suppression */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-medium text-yellow-800 mb-2">
          Alternatives à considérer
        </h5>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• <strong>Désactiver le compte :</strong> Gardez vos données mais rendez votre profil invisible</li>
          <li>• <strong>Pause temporaire :</strong> Prenez une pause sans perdre vos données</li>
          <li>• <strong>Ajuster la confidentialité :</strong> Limitez la visibilité de vos informations</li>
          <li>• <strong>Contacter le support :</strong> Nous pouvons vous aider à résoudre vos préoccupations</li>
        </ul>
      </div>

      {/* Bouton de suppression */}
      <div className="pt-4 border-t">
        <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer définitivement mon compte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Confirmation de suppression</span>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4">
                  <p>
                    Vous êtes sur le point de supprimer définitivement votre compte 
                    <strong className="mx-1">{userEmail}</strong>
                    ainsi que toutes les données associées.
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ Cette action est irréversible et ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Confirmation de lecture */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="read-warning"
                  checked={hasReadWarning}
                  onCheckedChange={setHasReadWarning}
                  className="mt-1"
                />
                <Label htmlFor="read-warning" className="text-sm">
                  J'ai lu et compris que cette action supprimera définitivement 
                  mon compte et toutes mes données sans possibilité de récupération.
                </Label>
              </div>

              {/* Saisie de confirmation */}
              <div>
                <Label className="text-sm font-medium">
                  Tapez "<span className="font-mono text-red-600">{CONFIRMATION_TEXT}</span>" 
                  pour confirmer :
                </Label>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={CONFIRMATION_TEXT}
                  className="mt-1"
                  disabled={!hasReadWarning}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={resetDeleteDialog}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={!canProceedWithDeletion || isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contact support */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Besoin d'aide ou de clarifications ?
        </p>
        <Button variant="link" size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Contacter le support
        </Button>
      </div>
    </div>
  );
};

export default AccountDeletion;