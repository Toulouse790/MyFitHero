// src/features/workout/components/WorkoutSettings.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/components/ui/card';
import { Button } from '@/features/components/ui/button';
import { Switch } from '@/features/components/ui/switch';
import { Label } from '@/features/components/ui/label';
import { 
  Settings, 
  Bell, 
  Download, 
  Share,
  RefreshCw,
  Trash2 
} from 'lucide-react';

interface WorkoutSettingsProps {
  onExportData: () => void;
  onSyncData: () => void;
  onClearData: () => void;
  onShareProgress: () => void;
}

export const WorkoutSettings: React.FC<WorkoutSettingsProps> = ({
  onExportData,
  onSyncData,
  onClearData,
  onShareProgress
}) => {
  return (
    <div className="space-y-4">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="workout-reminders">Rappels d'entraînement</Label>
            <Switch id="workout-reminders" defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="weekly-summary">Résumé hebdomadaire</Label>
            <Switch id="weekly-summary" defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="new-records">Nouveaux records</Label>
            <Switch id="new-records" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Données et synchronisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter mes données
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onSyncData}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Synchroniser
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onShareProgress}
          >
            <Share className="mr-2 h-4 w-4" />
            Partager mes progrès
          </Button>
        </CardContent>
      </Card>

      {/* Préférences d'entraînement */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="auto-rest">Repos automatique entre séries</Label>
            <Switch id="auto-rest" />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="form-tips">Conseils de forme</Label>
            <Switch id="form-tips" defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="progress-tracking">Suivi automatique des progrès</Label>
            <Switch id="progress-tracking" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Actions avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onClearData}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Effacer toutes les données
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Cette action est irréversible. Toutes vos données d'entraînement seront supprimées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};