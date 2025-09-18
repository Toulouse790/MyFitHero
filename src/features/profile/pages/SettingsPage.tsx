import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Settings as SettingsIcon, User, Bell, Shield, Smartphone, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../shared/hooks/use-toast';
import { supabase } from '../../../lib/supabase';
import { appStore } from '../../../store/appStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';

// Types pour les interfaces de données
interface NotificationSettingsData {
  workout_reminders: boolean;
  hydration_reminders: boolean;
  meal_reminders: boolean;
  sleep_reminders: boolean;
  achievement_alerts: boolean;
  weekly_summary: boolean;
  marketing_emails: boolean;
}

interface PrivacySettingsData {
  profileVisibility: 'public' | 'friends' | 'private';
  workoutVisibility: 'public' | 'friends' | 'private';
  allowFriendRequests: boolean;
  showAchievements: boolean;
  showStats: boolean;
  analyticsEnabled: boolean;
}

interface PreferencesData {
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
}

const Settings: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { appStoreUser } = appStore();

  // États locaux
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    full_name: appStoreUser?.full_name || '',
    username: appStoreUser?.username || '',
    email: appStoreUser?.email || '',
    phone: '',
    bio: '',
    location: '',
    country: '',
    birth_date: '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>({
    workout_reminders: true,
    hydration_reminders: true,
    meal_reminders: true,
    sleep_reminders: true,
    achievement_alerts: true,
    weekly_summary: true,
    marketing_emails: false,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsData>({
    profileVisibility: 'public',
    workoutVisibility: 'friends',
    allowFriendRequests: true,
    showAchievements: true,
    showStats: true,
    analyticsEnabled: true,
  });

  // Preferences
  const [preferences, setPreferences] = useState<PreferencesData>({
    language: 'fr',
    theme: 'system',
    units: 'metric',
    soundEnabled: true,
    vibrationEnabled: true,
    autoStart: false,
    restTimerDuration: 90,
    motivationalQuotes: true,
    compactMode: false,
    highContrast: false,
  });

  // Load user settings
  useEffect(() => {
    if (appStoreUser?.id) {
      loadUserSettings();
    }
  }, [appStoreUser?.id]);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      
      // Charger les paramètres utilisateur depuis Supabase
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', appStoreUser?.id)
        .single();

      if (!error && settings) {
        // Mise à jour des états avec les données chargées
        if (settings.notification_settings) {
          setNotificationSettings(settings.notification_settings);
        }
        if (settings.privacy_settings) {
          setPrivacySettings(settings.privacy_settings);
        }
        if (settings.preferences) {
          setPreferences(settings.preferences);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (settingsType: string, data: any) => {
    try {
      const updateData = {
        user_id: appStoreUser?.id,
        [settingsType]: data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(updateData);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paramètres mis à jour avec succès",
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <h1 className="text-lg font-semibold">Paramètres</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="wearables" className="flex items-center gap-2">
              <Smartphone size={16} />
              <span className="hidden sm:inline">Objets connectés</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span className="hidden sm:inline">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Paramètres du profil</h2>
              <p className="text-gray-500">Configuration du profil utilisateur</p>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Paramètres de notification</h2>
              <p className="text-gray-500">Gérer vos préférences de notification</p>
            </div>
          </TabsContent>

          <TabsContent value="wearables">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Objets connectés</h2>
              <p className="text-gray-500">Connecter et synchroniser vos appareils</p>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Confidentialité</h2>
              <p className="text-gray-500">Contrôler la visibilité de vos données</p>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Préférences</h2>
              <p className="text-gray-500">Personnaliser votre expérience</p>
            </div>
          </TabsContent>

          <TabsContent value="danger">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Zone de danger</h2>
              <p className="text-gray-500 mb-4">Actions irréversibles sur votre compte</p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                Supprimer le compte
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;