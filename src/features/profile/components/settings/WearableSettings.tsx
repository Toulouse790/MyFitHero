// src/features/profile/components/settings/WearableSettings.tsx
import React, { useState, useCallback } from 'react';
import { Smartphone, Sync, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useToast } from '../../../../shared/hooks/use-toast';

interface WearableSettingsProps {
  isAppleHealthAvailable: boolean;
  isGoogleFitAvailable: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  wearableLoading: boolean;
  onAppleHealthSync: () => Promise<void>;
  onGoogleFitSync: () => Promise<void>;
  onSyncAll: () => Promise<void>;
  autoSyncEnabled: boolean;
  syncInterval: number;
  onToggleAutoSync: () => void;
  onSyncIntervalChange: (interval: number) => void;
}

export const WearableSettings: React.FC<WearableSettingsProps> = ({
  isAppleHealthAvailable,
  isGoogleFitAvailable,
  lastSyncTime,
  syncError,
  wearableLoading,
  onAppleHealthSync,
  onGoogleFitSync,
  onSyncAll,
  autoSyncEnabled,
  syncInterval,
  onToggleAutoSync,
  onSyncIntervalChange,
}) => {
  const { toast } = useToast();

  const formatLastSync = useCallback((date: Date | null) => {
    if (!date) return 'Jamais synchronisé';
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffMinutes / 1440)}j`;
  }, []);

  const handleSyncWithFeedback = async (syncFunction: () => Promise<void>, deviceName: string) => {
    try {
      await syncFunction();
      toast({
        title: 'Synchronisation réussie',
        description: `Données ${deviceName} synchronisées avec succès !`,
      });
    } catch (error) {
      toast({
        title: 'Erreur de synchronisation',
        description: `Impossible de synchroniser avec ${deviceName}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Smartphone className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Appareils connectés</h3>
      </div>

      {/* Statut de synchronisation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Dernière synchronisation</span>
          </div>
          <span className="text-sm text-gray-600">
            {formatLastSync(lastSyncTime)}
          </span>
        </div>

        {syncError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* Configuration auto-sync */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label className="text-sm font-medium">Synchronisation automatique</Label>
            <p className="text-xs text-gray-600 mt-1">
              Synchroniser automatiquement vos données à intervalles réguliers
            </p>
          </div>
          <Switch
            checked={autoSyncEnabled}
            onCheckedChange={onToggleAutoSync}
          />
        </div>

        {autoSyncEnabled && (
          <div className="mt-3">
            <Label className="text-sm">Intervalle de synchronisation</Label>
            <Select
              value={syncInterval.toString()}
              onValueChange={(value) => onSyncIntervalChange(parseInt(value))}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Toutes les 15 minutes</SelectItem>
                <SelectItem value="30">Toutes les 30 minutes</SelectItem>
                <SelectItem value="60">Toutes les heures</SelectItem>
                <SelectItem value="180">Toutes les 3 heures</SelectItem>
                <SelectItem value="360">Toutes les 6 heures</SelectItem>
                <SelectItem value="720">Toutes les 12 heures</SelectItem>
                <SelectItem value="1440">Une fois par jour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Services disponibles */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Services de santé disponibles</h4>

        {/* Apple Health */}
        {isAppleHealthAvailable && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">🍎</span>
              </div>
              <div>
                <Label className="text-sm font-medium">Apple Health</Label>
                <p className="text-xs text-gray-600">
                  Synchroniser avec l'app Santé d'Apple
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncWithFeedback(onAppleHealthSync, 'Apple Health')}
              disabled={wearableLoading}
            >
              {wearableLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sync className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {/* Google Fit */}
        {isGoogleFitAvailable && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              <div>
                <Label className="text-sm font-medium">Google Fit</Label>
                <p className="text-xs text-gray-600">
                  Synchroniser avec Google Fit
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSyncWithFeedback(onGoogleFitSync, 'Google Fit')}
              disabled={wearableLoading}
            >
              {wearableLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sync className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {/* Aucun service disponible */}
        {!isAppleHealthAvailable && !isGoogleFitAvailable && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Aucun service de santé compatible détecté sur cet appareil
            </p>
          </div>
        )}
      </div>

      {/* Synchronisation globale */}
      {(isAppleHealthAvailable || isGoogleFitAvailable) && (
        <Button
          onClick={() => handleSyncWithFeedback(onSyncAll, 'tous les appareils')}
          disabled={wearableLoading}
          className="w-full"
        >
          {wearableLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Synchronisation...
            </>
          ) : (
            <>
              <Sync className="w-4 h-4 mr-2" />
              Synchroniser tout maintenant
            </>
          )}
        </Button>
      )}

      {/* Conseils */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-600">💡</span>
          <div className="text-sm text-yellow-800">
            <strong>Conseil :</strong> La synchronisation automatique vous aide à garder vos données 
            à jour sans effort. Choisissez un intervalle qui correspond à votre utilisation quotidienne.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearableSettings;