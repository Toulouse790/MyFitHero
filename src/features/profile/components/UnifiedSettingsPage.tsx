// 🎯 COMPOSANT DE PARAMÈTRES UNIFIÉ ET OPTIMISÉ
// Interface moderne avec recherche, application instantanée, et confirmations

import React, { useState, useMemo, useCallback } from 'react';
import { Search, Save, RotateCcw, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { useSettingsStore, useSettingsActions, UserSettings } from '@/core/settings/settings.store';

// 🔍 TYPES POUR LA RECHERCHE
interface SettingItem {
  key: string;
  section: keyof UserSettings;
  label: string;
  description: string;
  type: 'boolean' | 'select' | 'slider' | 'number';
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  requiresConfirmation?: boolean;
}

// 📋 CONFIGURATION DES PARAMÈTRES AVEC MÉTADONNÉES
const SETTINGS_CONFIG: SettingItem[] = [
  // Interface
  {
    key: 'theme',
    section: 'ui',
    label: 'Theme',
    description: 'Choose your preferred color theme',
    type: 'select',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' }
    ]
  },
  {
    key: 'language',
    section: 'ui',
    label: 'Language',
    description: 'Select your preferred language',
    type: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'Français' },
      { value: 'es', label: 'Español' }
    ]
  },
  {
    key: 'units',
    section: 'ui',
    label: 'Units',
    description: 'Choose measurement units',
    type: 'select',
    options: [
      { value: 'metric', label: 'Metric (kg, cm)' },
      { value: 'imperial', label: 'Imperial (lbs, ft)' }
    ]
  },
  
  // Notifications
  {
    key: 'workoutReminders',
    section: 'notifications',
    label: 'Workout Reminders',
    description: 'Get reminded when it\'s time to work out',
    type: 'boolean'
  },
  {
    key: 'pushNotifications',
    section: 'notifications',
    label: 'Push Notifications',
    description: 'Receive push notifications on your device',
    type: 'boolean'
  },
  {
    key: 'inAppSounds',
    section: 'notifications',
    label: 'In-App Sounds',
    description: 'Play sounds for notifications and actions',
    type: 'boolean'
  },
  
  // Entraînement
  {
    key: 'defaultRestTime',
    section: 'workout',
    label: 'Default Rest Time',
    description: 'Default rest time between sets (seconds)',
    type: 'slider',
    min: 30,
    max: 300,
    step: 15
  },
  {
    key: 'autoProgressSets',
    section: 'workout',
    label: 'Auto Progress Sets',
    description: 'Automatically progress to next set after rest time',
    type: 'boolean'
  },
  {
    key: 'motivationalQuotes',
    section: 'workout',
    label: 'Motivational Quotes',
    description: 'Show motivational quotes during workouts',
    type: 'boolean'
  },
  
  // Confidentialité
  {
    key: 'shareWorkouts',
    section: 'privacy',
    label: 'Share Workouts',
    description: 'Allow others to see your workout activity',
    type: 'boolean'
  },
  {
    key: 'dataCollection',
    section: 'privacy',
    label: 'Data Collection',
    description: 'Allow anonymous data collection for app improvement',
    type: 'boolean'
  },
  {
    key: 'marketingEmails',
    section: 'privacy',
    label: 'Marketing Emails',
    description: 'Receive promotional emails and newsletters',
    type: 'boolean',
    requiresConfirmation: true
  },
  
  // Wearables
  {
    key: 'autoSync',
    section: 'wearables',
    label: 'Auto Sync',
    description: 'Automatically sync with wearable devices',
    type: 'boolean'
  },
  {
    key: 'syncInterval',
    section: 'wearables',
    label: 'Sync Interval',
    description: 'How often to sync with wearables (minutes)',
    type: 'slider',
    min: 5,
    max: 60,
    step: 5
  }
];

const UnifiedSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { settings, isLoading, isDirty, error } = useSettingsStore();
  const { updateSettings, resetSettings } = useSettingsActions();
  const { exportSettings, importSettings } = useSettingsStore();
  
  // 🔍 État de la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<keyof UserSettings | 'all'>('all');
  
  // 📋 États pour les dialogues
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  
  const [resetDialog, setResetDialog] = useState(false);
  
  // 🔍 FILTRAGE DES PARAMÈTRES
  const filteredSettings = useMemo(() => {
    return SETTINGS_CONFIG.filter(setting => {
      const matchesSearch = !searchQuery || 
        setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        setting.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSection = selectedSection === 'all' || setting.section === selectedSection;
      
      return matchesSearch && matchesSection;
    });
  }, [searchQuery, selectedSection]);
  
  // 🎯 GESTIONNAIRE DE CHANGEMENT AVEC CONFIRMATION
  const handleSettingChange = useCallback(async (settingItem: SettingItem, value: any) => {
    const updateSetting = async () => {
      try {
        const sectionSettings = settings[settingItem.section] as any;
        const newSectionSettings = { ...sectionSettings, [settingItem.key]: value };
        
        await updateSettings({
          [settingItem.section]: newSectionSettings
        } as Partial<UserSettings>);
        
        toast({
          title: '✅ Setting Updated',
          description: `${settingItem.label} has been updated successfully.`
        });
        
      } catch (error: any) {
        toast({
          title: '❌ Error',
          description: 'Failed to update setting. Please try again.',
          variant: 'destructive'
        });
      }
    };
    
    // Confirmation pour les paramètres sensibles
    if (settingItem.requiresConfirmation) {
      setConfirmDialog({
        isOpen: true,
        title: `Confirm ${settingItem.label} Change`,
        description: `Are you sure you want to change this setting? This may affect your app experience.`,
        onConfirm: updateSetting
      });
    } else {
      await updateSetting();
    }
  }, [settings, updateSettings, toast]);
  
  // 🎨 RENDU D'UN PARAMÈTRE INDIVIDUEL
  const renderSetting = useCallback((settingItem: SettingItem) => {
    const sectionSettings = settings[settingItem.section] as any;
    const currentValue = sectionSettings?.[settingItem.key];
    
    const handleChange = (value: any) => {
      handleSettingChange(settingItem, value);
    };
    
    return (
      <Card key={`${settingItem.section}-${settingItem.key}`} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 pr-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{settingItem.label}</h4>
                {settingItem.requiresConfirmation && (
                  <Badge variant="secondary" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Requires Confirmation
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{settingItem.description}</p>
            </div>
            
            <div className="flex-shrink-0">
              {settingItem.type === 'boolean' && (
                <Switch
                  checked={currentValue}
                  onCheckedChange={handleChange}
                  disabled={isLoading}
                />
              )}
              
              {settingItem.type === 'select' && (
                <Select value={currentValue} onValueChange={handleChange} disabled={isLoading}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {settingItem.options?.map((option, index) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {settingItem.type === 'slider' && (
                <div className="w-[180px] space-y-2">
                  <Slider
                    value={[currentValue]}
                    onValueChange={([value]) => handleChange(value)}
                    min={settingItem.min}
                    max={settingItem.max}
                    step={settingItem.step}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    {currentValue} {settingItem.section === 'workout' ? 'seconds' : 'minutes'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [settings, isLoading, handleSettingChange]);
  
  // 🔄 GESTIONNAIRES D'ACTIONS
  const handleReset = useCallback(async () => {
    try {
      await resetSettings();
      setResetDialog(false);
      toast({
        title: '🔄 Settings Reset',
        description: 'All settings have been reset to default values.'
      });
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: 'Failed to reset settings.',
        variant: 'destructive'
      });
    }
  }, [resetSettings, toast]);
  
  const handleExport = useCallback(() => {
    const settingsData = exportSettings();
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myfithero-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: '📥 Settings Exported',
      description: 'Your settings have been downloaded as a JSON file.'
    });
  }, [exportSettings, toast]);
  
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const settingsData = JSON.parse(e.target?.result as string);
        await importSettings(settingsData);
        toast({
          title: '📤 Settings Imported',
          description: 'Your settings have been imported successfully.'
        });
      } catch (error: any) {
        toast({
          title: '❌ Import Failed',
          description: 'Invalid settings file.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  }, [importSettings, toast]);
  
  // 📊 SECTIONS DISPONIBLES
  const sections = [
    { key: 'all' as const, label: 'All Settings' },
    { key: 'ui' as const, label: 'Interface' },
    { key: 'notifications' as const, label: 'Notifications' },
    { key: 'workout' as const, label: 'Workout' },
    { key: 'privacy' as const, label: 'Privacy' },
    { key: 'wearables' as const, label: 'Wearables' },
  ];
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 🔝 EN-TÊTE */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your MyFitHero experience. Changes are saved automatically.
        </p>
        
        {/* 📊 INDICATEURS D'ÉTAT */}
        <div className="flex items-center gap-4 mt-4">
          {isDirty && (
            <Badge variant="secondary" className="animate-pulse">
              <Save className="w-3 h-3 mr-1" />
              Saving...
            </Badge>
          )}
          
          {error && (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Error: {error}
            </Badge>
          )}
          
          {!isDirty && !error && (
            <Badge variant="default">
              <CheckCircle className="w-3 h-3 mr-1" />
              All changes saved
            </Badge>
          )}
        </div>
      </div>
      
      {/* 🔍 BARRE DE RECHERCHE ET FILTRES */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSection} onValueChange={(value) => setSelectedSection(value as keyof UserSettings | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section, index) => (
                  <SelectItem key={section.key} value={section.key}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* ⚡ ACTIONS RAPIDES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Manage your settings data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Settings
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <label htmlFor="import-settings" className="cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Settings
              </label>
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setResetDialog(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 📋 LISTE DES PARAMÈTRES */}
      <div className="space-y-0">
        {filteredSettings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No settings found matching your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSettings.map(renderSetting)
        )}
      </div>
      
      {/* ⚠️ DIALOGUE DE CONFIRMATION */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 🔄 DIALOGUE DE RESET */}
      <Dialog open={resetDialog} onOpenChange={setResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Settings</DialogTitle>
            <DialogDescription>
              This will reset all settings to their default values. This action cannot be undone.
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedSettingsPage;