// src/features/profile/components/settings/PreferencesSettings.tsx
import React from 'react';
import { Globe, Palette, Zap, Volume2, Vibrate, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface PreferencesSettingsProps {
  language: string;
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStart: boolean;
  restTimerDuration: number;
  motivationalQuotes: boolean;
  compactMode: boolean;
  highContrast: boolean;
  onLanguageChange: (language: string) => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onUnitsChange: (units: 'metric' | 'imperial') => void;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onToggleAutoStart: () => void;
  onRestTimerChange: (duration: number) => void;
  onToggleMotivationalQuotes: () => void;
  onToggleCompactMode: () => void;
  onToggleHighContrast: () => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({
  language,
  theme,
  units,
  soundEnabled,
  vibrationEnabled,
  autoStart,
  restTimerDuration,
  motivationalQuotes,
  compactMode,
  highContrast,
  onLanguageChange,
  onThemeChange,
  onUnitsChange,
  onToggleSound,
  onToggleVibration,
  onToggleAutoStart,
  onRestTimerChange,
  onToggleMotivationalQuotes,
  onToggleCompactMode,
  onToggleHighContrast,
}) => {
  const formatRestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Préférences générales</h3>
      </div>

      {/* Langue et région */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>Langue et région</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Langue</Label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                <SelectItem value="pt">🇵🇹 Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Unités de mesure</Label>
            <Select value={units} onValueChange={onUnitsChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Métrique (kg, cm, km)</SelectItem>
                <SelectItem value="imperial">Impérial (lbs, ft, mi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Apparence */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
          <Palette className="w-4 h-4" />
          <span>Apparence</span>
        </h4>

        <div>
          <Label className="text-sm font-medium mb-2 block">Thème</Label>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Clair</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-800 rounded"></div>
                  <span>Sombre</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded"></div>
                  <span>Automatique</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Mode compact</Label>
            <p className="text-xs text-gray-600">
              Interface plus dense avec moins d'espacement
            </p>
          </div>
          <Switch
            checked={compactMode}
            onCheckedChange={onToggleCompactMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Contraste élevé</Label>
            <p className="text-xs text-gray-600">
              Améliore la lisibilité avec des couleurs plus contrastées
            </p>
          </div>
          <Switch
            checked={highContrast}
            onCheckedChange={onToggleHighContrast}
          />
        </div>
      </div>

      {/* Audio et vibrations */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
          <Volume2 className="w-4 h-4" />
          <span>Audio et vibrations</span>
        </h4>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Sons d'interface</Label>
            <p className="text-xs text-gray-600">
              Sons lors des interactions avec l'application
            </p>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={onToggleSound}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vibrate className="w-4 h-4" />
            <div>
              <Label className="text-sm font-medium">Vibrations</Label>
              <p className="text-xs text-gray-600">
                Retour haptique lors des notifications
              </p>
            </div>
          </div>
          <Switch
            checked={vibrationEnabled}
            onCheckedChange={onToggleVibration}
          />
        </div>
      </div>

      {/* Entraînement */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Entraînement</span>
        </h4>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Démarrage automatique</Label>
            <p className="text-xs text-gray-600">
              Lancer automatiquement le chrono après sélection d'un exercice
            </p>
          </div>
          <Switch
            checked={autoStart}
            onCheckedChange={onToggleAutoStart}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Durée de repos par défaut</Label>
            <span className="text-sm text-gray-600 font-mono">
              {formatRestTime(restTimerDuration)}
            </span>
          </div>
          <Slider
            value={[restTimerDuration]}
            onValueChange={([value]) => onRestTimerChange(value)}
            max={300}
            min={30}
            step={15}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>30s</span>
            <span>5min</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Citations motivantes</Label>
            <p className="text-xs text-gray-600">
              Afficher des messages motivants pendant les entraînements
            </p>
          </div>
          <Switch
            checked={motivationalQuotes}
            onCheckedChange={onToggleMotivationalQuotes}
          />
        </div>
      </div>

      {/* Aperçu des modifications */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Aperçu de vos réglages</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Langue : {language === 'fr' ? 'Français' : 'English'}</p>
          <p>• Thème : {theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : 'Automatique'}</p>
          <p>• Unités : {units === 'metric' ? 'Métrique' : 'Impérial'}</p>
          <p>• Repos par défaut : {formatRestTime(restTimerDuration)}</p>
        </div>
      </div>

      {/* Redémarrage requis */}
      {(theme !== 'system' || units !== 'metric') && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="text-orange-600">⚠️</div>
            <div className="text-sm text-orange-800">
              <strong>Redémarrage recommandé :</strong> Certains changements peuvent 
              nécessiter un redémarrage de l'application pour prendre effet complètement.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSettings;