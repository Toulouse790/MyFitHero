import React, { useState, useEffect, useCallback } from 'react';import React, { useState, useEffect, useCallback } from 'react';import React, { useState, useEffect, useCallback } from 'react';

import { useLocation } from 'wouter';

import { Settings as SettingsIcon, User, Bell, Shield, Smartphone, Zap, AlertTriangle } from 'lucide-react';import { useLocation } from 'wouter';import { useLocation } from 'wouter';

import { useWearableSync } from '@/features/wearables/hooks/useWearableSync';

import { useToast } from '../../../shared/hooks/use-toast';import { Settings as SettingsIcon, User, Bell, Shield, Smartphone, Zap, AlertTriangle } from 'lucide-react';import { Settings as SettingsIcon, User, Bell, Shield, Smartphone, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';

import { supabase } from '../../../lib/supabase';

import { appStore } from '../../../store/appStore';import { useWearableSync } from '@/features/wearables/hooks/useWearableSync';import { useWearableSync } from '@/features/wearables/hooks/useWearableSync';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

import { UniformHeader } from '@/features/profile/components/UniformHeader';import { useToast } from '../../../shared/hooks/use-toast';import { useToast } from '../../../shared/hooks/use-toast';



// Import modular settings componentsimport { supabase } from '../../../lib/supabase';import { supabase } from '../../../lib/supabase';

import { ProfileSettings } from '../components/settings/ProfileSettings';

import { NotificationSettings } from '../components/settings/NotificationSettings';import { appStore } from '../../../store/appStore';import { appStore } from '../../../store/appStore';

import { WearableSettings } from '../components/settings/WearableSettings';

import { PrivacySettings } from '../components/settings/PrivacySettings';import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';import { Button } from '../../../components/ui/button';

import { PreferencesSettings } from '../components/settings/PreferencesSettings';

import { AccountDeletion } from '../components/settings/AccountDeletion';import { UniformHeader } from '@/features/profile/components/UniformHeader';import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';



// Types pour les interfaces de donnéesimport { UniformHeader } from '@/features/profile/components/UniformHeader';

interface NotificationSettingsData {

  workout_reminders: boolean;// Import modular settings componentsimport { AnalyticsService } from '../../../lib/analytics';

  hydration_reminders: boolean;

  meal_reminders: boolean;import { ProfileSettings } from '../components/settings/ProfileSettings';

  sleep_reminders: boolean;

  achievement_alerts: boolean;import { NotificationSettings } from '../components/settings/NotificationSettings';// Import modular settings components

  weekly_summary: boolean;

  marketing_emails: boolean;import { WearableSettings } from '../components/settings/WearableSettings';import { ProfileSettings } from '../components/settings/ProfileSettings';

}

import { PrivacySettings } from '../components/settings/PrivacySettings';import { NotificationSettings } from '../components/settings/NotificationSettings';

interface PrivacySettingsData {

  profileVisibility: 'public' | 'friends' | 'private';import { PreferencesSettings } from '../components/settings/PreferencesSettings';import { WearableSettings } from '../components/settings/WearableSettings';

  workoutVisibility: 'public' | 'friends' | 'private';

  allowFriendRequests: boolean;import { AccountDeletion } from '../components/settings/AccountDeletion';import { PrivacySettings } from '../components/settings/PrivacySettings';

  showAchievements: boolean;

  showStats: boolean;import { PreferencesSettings } from '../components/settings/PreferencesSettings';

  analyticsEnabled: boolean;

}// Types pour les interfaces de donnéesimport { AccountDeletion } from '../components/settings/AccountDeletion';



interface PreferencesData {interface NotificationSettingsData {

  language: string;

  theme: 'light' | 'dark' | 'system';  workout_reminders: boolean;import React, { useState, useEffect, useCallback } from 'react';

  units: 'metric' | 'imperial';

  soundEnabled: boolean;  hydration_reminders: boolean;import { useLocation } from 'wouter';

  vibrationEnabled: boolean;

  autoStart: boolean;  meal_reminders: boolean;import { Settings as SettingsIcon, User, Bell, Shield, Smartphone, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';

  restTimerDuration: number;

  motivationalQuotes: boolean;  sleep_reminders: boolean;import { useWearableSync } from '@/features/wearables/hooks/useWearableSync';

  compactMode: boolean;

  highContrast: boolean;  achievement_alerts: boolean;import { useToast } from '../../../shared/hooks/use-toast';

}

  weekly_summary: boolean;import { supabase } from '../../../lib/supabase';

const Settings: React.FC = () => {

  const [location, setLocation] = useLocation();  marketing_emails: boolean;import { appStore } from '../../../store/appStore';

  const { toast } = useToast();

  const { appStoreUser } = appStore();}import { Button } from '../../../components/ui/button';



  const {import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

    isLoading: wearableLoading,

    lastSyncTime,interface PrivacySettingsData {import { UniformHeader } from '@/features/profile/components/UniformHeader';

    syncError,

    isAppleHealthAvailable,  profileVisibility: 'public' | 'friends' | 'private';import { AnalyticsService } from '../../../lib/analytics';

    isGoogleFitAvailable,

    syncAppleHealth,  workoutVisibility: 'public' | 'friends' | 'private';

    syncGoogleFit,

    syncAll,  allowFriendRequests: boolean;// Import modular settings components

  } = useWearableSync();

  showAchievements: boolean;import { ProfileSettings } from '../components/settings/ProfileSettings';

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('profile');  showStats: boolean;import { NotificationSettings } from '../components/settings/NotificationSettings';

  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  const [syncInterval, setSyncInterval] = useState(30);  analyticsEnabled: boolean;import { WearableSettings } from '../components/settings/WearableSettings';



  // Profile settings state}import { PrivacySettings } from '../components/settings/PrivacySettings';

  const [profileData, setProfileData] = useState({

    full_name: appStoreUser?.full_name || '',import { PreferencesSettings } from '../components/settings/PreferencesSettings';

    username: appStoreUser?.username || '',

    email: appStoreUser?.email || '',interface PreferencesData {import { AccountDeletion } from '../components/settings/AccountDeletion';

    phone: '',

    bio: '',  language: string;

    city: '',

    country: '',  theme: 'light' | 'dark' | 'system';// Types pour les interfaces de données

  });

  units: 'metric' | 'imperial';interface NotificationSettingsData {

  // Notification settings state

  const [notifications, setNotifications] = useState<NotificationSettingsData>({  soundEnabled: boolean;  workout_reminders: boolean;

    workout_reminders: true,

    hydration_reminders: true,  vibrationEnabled: boolean;  hydration_reminders: boolean;

    meal_reminders: true,

    sleep_reminders: true,  autoStart: boolean;  meal_reminders: boolean;

    achievement_alerts: true,

    weekly_summary: true,  restTimerDuration: number;  sleep_reminders: boolean;

    marketing_emails: false,

  });  motivationalQuotes: boolean;  achievement_alerts: boolean;



  // Privacy settings state  compactMode: boolean;  weekly_summary: boolean;

  const [privacy, setPrivacy] = useState<PrivacySettingsData>({

    profileVisibility: 'friends',  highContrast: boolean;  marketing_emails: boolean;

    workoutVisibility: 'friends',

    allowFriendRequests: true,}}

    showAchievements: true,

    showStats: true,

    analyticsEnabled: true,

  });const Settings: React.FC = () => {interface PrivacySettingsData {



  // Preferences state  const [location, setLocation] = useLocation();  profileVisibility: 'public' | 'friends' | 'private';

  const [preferences, setPreferences] = useState<PreferencesData>({

    language: 'fr',  const { toast } = useToast();  workoutVisibility: 'public' | 'friends' | 'private';

    theme: 'system',

    units: 'metric',  const { appStoreUser } = appStore();  allowFriendRequests: boolean;

    soundEnabled: true,

    vibrationEnabled: true,  showAchievements: boolean;

    autoStart: false,

    restTimerDuration: 90,  const {  showStats: boolean;

    motivationalQuotes: true,

    compactMode: false,    isLoading: wearableLoading,  analyticsEnabled: boolean;

    highContrast: false,

  });    lastSyncTime,}



  // Load settings on component mount    syncError,

  useEffect(() => {

    if (appStoreUser?.id) {    isAppleHealthAvailable,interface PreferencesData {

      loadSettings();

    }    isGoogleFitAvailable,  language: string;

  }, [appStoreUser?.id]);

    syncAppleHealth,  theme: 'light' | 'dark' | 'system';

  const loadSettings = useCallback(async () => {

    if (!appStoreUser?.id) return;    syncGoogleFit,  units: 'metric' | 'imperial';



    try {    syncAll,  soundEnabled: boolean;

      const { data: prefs } = await supabase

        .from('user_preferences')  } = useWearableSync();  vibrationEnabled: boolean;

        .select('*')

        .eq('user_id', appStoreUser.id)  autoStart: boolean;

        .single();

  const [loading, setLoading] = useState(false);  restTimerDuration: number;

      if (prefs) {

        setNotifications(prefs.notifications || notifications);  const [activeTab, setActiveTab] = useState('profile');  motivationalQuotes: boolean;

        setPrivacy(prefs.privacy || privacy);

        setPreferences(prefs.app_preferences || preferences);  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);  compactMode: boolean;

      }

  const [syncInterval, setSyncInterval] = useState(30);  highContrast: boolean;

      const savedAutoSync = localStorage.getItem('autoSyncEnabled');

      const savedInterval = localStorage.getItem('syncInterval');}



      if (savedAutoSync) {  // Profile settings state

        setAutoSyncEnabled(JSON.parse(savedAutoSync));

      }  const [profileData, setProfileData] = useState({const Settings: React.FC = () => {

      if (savedInterval) {

        setSyncInterval(parseInt(savedInterval));    full_name: appStoreUser?.full_name || '',  const [location, setLocation] = useLocation();

      }

    } catch (error) {    username: appStoreUser?.username || '',  const { toast } = useToast();

      console.error('Erreur chargement paramètres:', error);

    }    email: appStoreUser?.email || '',  const { appStoreUser } = appStore();

  }, [appStoreUser?.id]);

    phone: '',

  // Profile handlers

  const handleProfileSave = useCallback(async (updatedData: any) => {    bio: '',  const {

    if (!appStoreUser?.id) return;

    city: '',    isLoading: wearableLoading,

    setLoading(true);

    try {    country: '',    lastSyncTime,

      const { error } = await supabase

        .from('user_profiles')  });    syncError,

        .update({

          ...updatedData,    isAppleHealthAvailable,

          updated_at: new Date().toISOString(),

        })  // Notification settings state    isGoogleFitAvailable,

        .eq('id', appStoreUser.id);

  const [notifications, setNotifications] = useState<NotificationSettingsData>({    syncAppleHealth,

      if (error) throw error;

    workout_reminders: true,    syncGoogleFit,

      setProfileData(updatedData);

      toast({    hydration_reminders: true,    syncAll,

        title: 'Profil mis à jour',

        description: 'Vos informations ont été sauvegardées avec succès.',    meal_reminders: true,  } = useWearableSync();

      });

    } catch (error) {    sleep_reminders: true,

      console.error('Erreur sauvegarde profil:', error);

      toast({    achievement_alerts: true,  const [loading, setLoading] = useState(false);

        title: 'Erreur',

        description: 'Impossible de sauvegarder le profil.',    weekly_summary: true,  const [activeTab, setActiveTab] = useState('profile');

        variant: 'destructive',

      });    marketing_emails: false,  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

    } finally {

      setLoading(false);  });  const [syncInterval, setSyncInterval] = useState(30);

    }

  }, [appStoreUser?.id, toast]);



  // Notification handlers  // Privacy settings state  // Profile settings state

  const handleNotificationChange = useCallback((key: keyof NotificationSettingsData) => {

    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));  const [privacy, setPrivacy] = useState<PrivacySettingsData>({  const [profileData, setProfileData] = useState({

  }, []);

    profileVisibility: 'friends',    full_name: appStoreUser?.full_name || '',

  const handleNotificationSave = useCallback(async () => {

    if (!appStoreUser?.id) return;    workoutVisibility: 'friends',    username: appStoreUser?.username || '',



    try {    allowFriendRequests: true,    email: appStoreUser?.email || '',

      await supabase

        .from('user_preferences')    showAchievements: true,    phone: '',

        .upsert({

          user_id: appStoreUser.id,    showStats: true,    bio: '',

          notifications,

          updated_at: new Date().toISOString(),    analyticsEnabled: true,    city: '',

        });

  });    country: '',

      toast({

        title: 'Notifications mises à jour',  });

        description: 'Vos préférences de notification ont été sauvegardées.',

      });  // Preferences state

    } catch (error) {

      console.error('Erreur sauvegarde notifications:', error);  const [preferences, setPreferences] = useState<PreferencesData>({  // Notification settings state

    }

  }, [appStoreUser?.id, notifications, toast]);    language: 'fr',  const [notifications, setNotifications] = useState<NotificationSettingsData>({



  // Privacy handlers    theme: 'system',    workout_reminders: true,

  const handlePrivacyChange = useCallback((key: keyof PrivacySettingsData, value: any) => {

    setPrivacy(prev => ({ ...prev, [key]: value }));    units: 'metric',    hydration_reminders: true,

  }, []);

    soundEnabled: true,    meal_reminders: true,

  const handleExportData = useCallback(async () => {

    if (!appStoreUser?.id) return;    vibrationEnabled: true,    sleep_reminders: true,



    const exportData = {    autoStart: false,    achievement_alerts: true,

      profile: profileData,

      notifications,    restTimerDuration: 90,    weekly_summary: true,

      privacy,

      preferences,    motivationalQuotes: true,    marketing_emails: false,

      exportDate: new Date().toISOString(),

    };    compactMode: false,  });



    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });    highContrast: false,

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');  });  // Privacy settings state

    a.href = url;

    a.download = `myfithero-data-${new Date().toISOString().split('T')[0]}.json`;  const [privacy, setPrivacy] = useState<PrivacySettingsData>({

    document.body.appendChild(a);

    a.click();  // Load settings on component mount    profileVisibility: 'friends',

    document.body.removeChild(a);

    URL.revokeObjectURL(url);  useEffect(() => {    workoutVisibility: 'friends',

  }, [appStoreUser?.id, profileData, notifications, privacy, preferences]);

    if (appStoreUser?.id) {    allowFriendRequests: true,

  const handleDeleteData = useCallback(async () => {

    if (!appStoreUser?.id) return;      loadSettings();    showAchievements: true,



    const userId = appStoreUser.id;    }    showStats: true,

    const tablesToClean = [

      'user_workouts',  }, [appStoreUser?.id]);    analyticsEnabled: true,

      'user_nutrition',

      'user_hydration',  });

      'user_sleep',

      'user_analytics',  const loadSettings = useCallback(async () => {

      'user_preferences',

    ];    if (!appStoreUser?.id) return;  // Preferences state



    for (const table of tablesToClean) {  const [preferences, setPreferences] = useState<PreferencesData>({

      await supabase.from(table).delete().eq('user_id', userId);

    }    try {    language: 'fr',

  }, [appStoreUser?.id]);

      const { data: prefs } = await supabase    theme: 'system',

  // Wearable handlers

  const handleToggleAutoSync = useCallback(() => {        .from('user_preferences')    units: 'metric',

    const newValue = !autoSyncEnabled;

    setAutoSyncEnabled(newValue);        .select('*')    soundEnabled: true,

    localStorage.setItem('autoSyncEnabled', JSON.stringify(newValue));

  }, [autoSyncEnabled]);        .eq('user_id', appStoreUser.id)    vibrationEnabled: true,



  const handleSyncIntervalChange = useCallback((interval: number) => {        .single();    autoStart: false,

    setSyncInterval(interval);

    localStorage.setItem('syncInterval', interval.toString());    restTimerDuration: 90,

  }, []);

      if (prefs) {    motivationalQuotes: true,

  // Preferences handlers

  const handlePreferenceChange = useCallback((key: keyof PreferencesData, value: any) => {        setNotifications(prefs.notifications || notifications);    compactMode: false,

    setPreferences(prev => ({ ...prev, [key]: value }));

  }, []);        setPrivacy(prefs.privacy || privacy);    highContrast: false,



  const handleDeleteAccount = useCallback(async () => {        setPreferences(prefs.app_preferences || preferences);  });

    if (!appStoreUser?.id) return;

      }

    try {

      await supabase.auth.signOut();  // Load settings on component mount

      localStorage.clear();

      sessionStorage.clear();      const savedAutoSync = localStorage.getItem('autoSyncEnabled');  useEffect(() => {

      setLocation('/');

    } catch (error) {      const savedInterval = localStorage.getItem('syncInterval');    if (appStoreUser?.id) {

      console.error('Erreur suppression compte:', error);

    }      loadSettings();

  }, [appStoreUser?.id, setLocation]);

      if (savedAutoSync) {    }

  return (

    <div className="min-h-screen bg-gray-50">        setAutoSyncEnabled(JSON.parse(savedAutoSync));  }, [appStoreUser?.id]);

      <UniformHeader

        title="Paramètres"      }

        icon={<SettingsIcon className="w-6 h-6" />}

        showBackButton      if (savedInterval) {  const loadSettings = useCallback(async () => {

        onBack={() => setLocation('/profile')}

      />        setSyncInterval(parseInt(savedInterval));    if (!appStoreUser?.id) return;



      <div className="max-w-4xl mx-auto px-4 py-6">      }

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsList className="grid w-full grid-cols-6 mb-6">    } catch (error) {    try {

            <TabsTrigger value="profile" className="flex items-center space-x-2">

              <User className="w-4 h-4" />      console.error('Erreur chargement paramètres:', error);      const { data: prefs } = await supabase

              <span className="hidden sm:inline">Profil</span>

            </TabsTrigger>    }        .from('user_preferences')

            <TabsTrigger value="notifications" className="flex items-center space-x-2">

              <Bell className="w-4 h-4" />  }, [appStoreUser?.id]);        .select('*')

              <span className="hidden sm:inline">Notifications</span>

            </TabsTrigger>        .eq('user_id', appStoreUser.id)

            <TabsTrigger value="wearables" className="flex items-center space-x-2">

              <Smartphone className="w-4 h-4" />  // Profile handlers        .single();

              <span className="hidden sm:inline">Appareils</span>

            </TabsTrigger>  const handleProfileSave = useCallback(async (updatedData: any) => {

            <TabsTrigger value="privacy" className="flex items-center space-x-2">

              <Shield className="w-4 h-4" />    if (!appStoreUser?.id) return;      if (prefs) {

              <span className="hidden sm:inline">Confidentialité</span>

            </TabsTrigger>        setNotifications(prefs.notifications || notifications);

            <TabsTrigger value="preferences" className="flex items-center space-x-2">

              <Zap className="w-4 h-4" />    setLoading(true);        setPrivacy(prefs.privacy || privacy);

              <span className="hidden sm:inline">Préférences</span>

            </TabsTrigger>    try {        setPreferences(prefs.app_preferences || preferences);

            <TabsTrigger value="account" className="flex items-center space-x-2">

              <AlertTriangle className="w-4 h-4" />      const { error } = await supabase      }

              <span className="hidden sm:inline">Compte</span>

            </TabsTrigger>        .from('user_profiles')

          </TabsList>

        .update({      const savedAutoSync = localStorage.getItem('autoSyncEnabled');

          <TabsContent value="profile" className="mt-6">

            <ProfileSettings          ...updatedData,      const savedInterval = localStorage.getItem('syncInterval');

              profileData={profileData}

              loading={loading}          updated_at: new Date().toISOString(),

              onSave={handleProfileSave}

              onChange={setProfileData}        })      if (savedAutoSync) {

            />

          </TabsContent>        .eq('id', appStoreUser.id);        setAutoSyncEnabled(JSON.parse(savedAutoSync));



          <TabsContent value="notifications" className="mt-6">      }

            <NotificationSettings

              notifications={notifications}      if (error) throw error;      if (savedInterval) {

              onToggle={handleNotificationChange}

              onSave={handleNotificationSave}        setSyncInterval(parseInt(savedInterval));

            />

          </TabsContent>      setProfileData(updatedData);      }



          <TabsContent value="wearables" className="mt-6">      toast({    } catch (error) {

            <WearableSettings

              isAppleHealthAvailable={isAppleHealthAvailable}        title: 'Profil mis à jour',      console.error('Erreur chargement paramètres:', error);

              isGoogleFitAvailable={isGoogleFitAvailable}

              lastSyncTime={lastSyncTime}        description: 'Vos informations ont été sauvegardées avec succès.',    }

              syncError={syncError}

              wearableLoading={wearableLoading}      });  }, [appStoreUser?.id]);

              onAppleHealthSync={syncAppleHealth}

              onGoogleFitSync={syncGoogleFit}    } catch (error) {

              onSyncAll={syncAll}

              autoSyncEnabled={autoSyncEnabled}      console.error('Erreur sauvegarde profil:', error);  // Profile handlers

              syncInterval={syncInterval}

              onToggleAutoSync={handleToggleAutoSync}      toast({  const handleProfileSave = useCallback(async (updatedData: any) => {

              onSyncIntervalChange={handleSyncIntervalChange}

            />        title: 'Erreur',    if (!appStoreUser?.id) return;

          </TabsContent>

        description: 'Impossible de sauvegarder le profil.',

          <TabsContent value="privacy" className="mt-6">

            <PrivacySettings        variant: 'destructive',    setLoading(true);

              profileVisibility={privacy.profileVisibility}

              workoutVisibility={privacy.workoutVisibility}      });    try {

              allowFriendRequests={privacy.allowFriendRequests}

              showAchievements={privacy.showAchievements}    } finally {      const { error } = await supabase

              showStats={privacy.showStats}

              analyticsEnabled={privacy.analyticsEnabled}      setLoading(false);        .from('user_profiles')

              onProfileVisibilityChange={(visibility) => handlePrivacyChange('profileVisibility', visibility)}

              onWorkoutVisibilityChange={(visibility) => handlePrivacyChange('workoutVisibility', visibility)}    }        .update({

              onToggleFriendRequests={() => handlePrivacyChange('allowFriendRequests', !privacy.allowFriendRequests)}

              onToggleAchievements={() => handlePrivacyChange('showAchievements', !privacy.showAchievements)}  }, [appStoreUser?.id, toast]);          ...updatedData,

              onToggleStats={() => handlePrivacyChange('showStats', !privacy.showStats)}

              onToggleAnalytics={() => handlePrivacyChange('analyticsEnabled', !privacy.analyticsEnabled)}          updated_at: new Date().toISOString(),

              onExportData={handleExportData}

              onDeleteData={handleDeleteData}  // Notification handlers        })

            />

          </TabsContent>  const handleNotificationChange = useCallback((key: keyof NotificationSettingsData) => {        .eq('id', appStoreUser.id);



          <TabsContent value="preferences" className="mt-6">    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

            <PreferencesSettings

              language={preferences.language}  }, []);      if (error) throw error;

              theme={preferences.theme}

              units={preferences.units}

              soundEnabled={preferences.soundEnabled}

              vibrationEnabled={preferences.vibrationEnabled}  const handleNotificationSave = useCallback(async () => {      setProfileData(updatedData);

              autoStart={preferences.autoStart}

              restTimerDuration={preferences.restTimerDuration}    if (!appStoreUser?.id) return;      toast({

              motivationalQuotes={preferences.motivationalQuotes}

              compactMode={preferences.compactMode}        title: 'Profil mis à jour',

              highContrast={preferences.highContrast}

              onLanguageChange={(language) => handlePreferenceChange('language', language)}    try {        description: 'Vos informations ont été sauvegardées avec succès.',

              onThemeChange={(theme) => handlePreferenceChange('theme', theme)}

              onUnitsChange={(units) => handlePreferenceChange('units', units)}      await supabase      });

              onToggleSound={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}

              onToggleVibration={() => handlePreferenceChange('vibrationEnabled', !preferences.vibrationEnabled)}        .from('user_preferences')    } catch (error) {

              onToggleAutoStart={() => handlePreferenceChange('autoStart', !preferences.autoStart)}

              onRestTimerChange={(duration) => handlePreferenceChange('restTimerDuration', duration)}        .upsert({      console.error('Erreur sauvegarde profil:', error);

              onToggleMotivationalQuotes={() => handlePreferenceChange('motivationalQuotes', !preferences.motivationalQuotes)}

              onToggleCompactMode={() => handlePreferenceChange('compactMode', !preferences.compactMode)}          user_id: appStoreUser.id,      toast({

              onToggleHighContrast={() => handlePreferenceChange('highContrast', !preferences.highContrast)}

            />          notifications,        title: 'Erreur',

          </TabsContent>

          updated_at: new Date().toISOString(),        description: 'Impossible de sauvegarder le profil.',

          <TabsContent value="account" className="mt-6">

            <AccountDeletion        });        variant: 'destructive',

              userEmail={appStoreUser?.email || ''}

              onDeleteAccount={handleDeleteAccount}      });

              onExportData={handleExportData}

            />      toast({    } finally {

          </TabsContent>

        </Tabs>        title: 'Notifications mises à jour',      setLoading(false);

      </div>

    </div>        description: 'Vos préférences de notification ont été sauvegardées.',    }

  );

};      });  }, [appStoreUser?.id, toast]);



export default Settings;    } catch (error) {

      console.error('Erreur sauvegarde notifications:', error);  // Notification handlers

    }  const handleNotificationChange = useCallback((key: keyof NotificationSettingsData) => {

  }, [appStoreUser?.id, notifications, toast]);    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  }, []);

  // Privacy handlers

  const handlePrivacyChange = useCallback((key: keyof PrivacySettingsData, value: any) => {  const handleNotificationSave = useCallback(async () => {

    setPrivacy(prev => ({ ...prev, [key]: value }));    if (!appStoreUser?.id) return;

  }, []);

    try {

  const handleExportData = useCallback(async () => {      await supabase

    if (!appStoreUser?.id) return;        .from('user_preferences')

        .upsert({

    const exportData = {          user_id: appStoreUser.id,

      profile: profileData,          notifications,

      notifications,          updated_at: new Date().toISOString(),

      privacy,        });

      preferences,

      exportDate: new Date().toISOString(),      toast({

    };        title: 'Notifications mises à jour',

        description: 'Vos préférences de notification ont été sauvegardées.',

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });      });

    const url = URL.createObjectURL(blob);    } catch (error) {

    const a = document.createElement('a');      console.error('Erreur sauvegarde notifications:', error);

    a.href = url;    }

    a.download = `myfithero-data-${new Date().toISOString().split('T')[0]}.json`;  }, [appStoreUser?.id, notifications, toast]);

    document.body.appendChild(a);

    a.click();  // Privacy handlers

    document.body.removeChild(a);  const handlePrivacyChange = useCallback((key: keyof PrivacySettingsData, value: any) => {

    URL.revokeObjectURL(url);    setPrivacy(prev => ({ ...prev, [key]: value }));

  }, [appStoreUser?.id, profileData, notifications, privacy, preferences]);  }, []);



  const handleDeleteData = useCallback(async () => {  const handleExportData = useCallback(async () => {

    if (!appStoreUser?.id) return;    if (!appStoreUser?.id) return;



    const userId = appStoreUser.id;    const exportData = {

    const tablesToClean = [      profile: profileData,

      'user_workouts',      notifications,

      'user_nutrition',      privacy,

      'user_hydration',      preferences,

      'user_sleep',      exportDate: new Date().toISOString(),

      'user_analytics',    };

      'user_preferences',

    ];    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    for (const table of tablesToClean) {    const a = document.createElement('a');

      await supabase.from(table).delete().eq('user_id', userId);    a.href = url;

    }    a.download = `myfithero-data-${new Date().toISOString().split('T')[0]}.json`;

  }, [appStoreUser?.id]);    document.body.appendChild(a);

    a.click();

  // Wearable handlers    document.body.removeChild(a);

  const handleToggleAutoSync = useCallback(() => {    URL.revokeObjectURL(url);

    const newValue = !autoSyncEnabled;  }, [appStoreUser?.id, profileData, notifications, privacy, preferences]);

    setAutoSyncEnabled(newValue);

    localStorage.setItem('autoSyncEnabled', JSON.stringify(newValue));  const handleDeleteData = useCallback(async () => {

  }, [autoSyncEnabled]);    if (!appStoreUser?.id) return;



  const handleSyncIntervalChange = useCallback((interval: number) => {    const userId = appStoreUser.id;

    setSyncInterval(interval);    const tablesToClean = [

    localStorage.setItem('syncInterval', interval.toString());      'user_workouts',

  }, []);      'user_nutrition',

      'user_hydration',

  // Preferences handlers      'user_sleep',

  const handlePreferenceChange = useCallback((key: keyof PreferencesData, value: any) => {      'user_analytics',

    setPreferences(prev => ({ ...prev, [key]: value }));      'user_preferences',

  }, []);    ];



  const handleDeleteAccount = useCallback(async () => {    for (const table of tablesToClean) {

    if (!appStoreUser?.id) return;      await supabase.from(table).delete().eq('user_id', userId);

    }

    try {  }, [appStoreUser?.id]);

      await supabase.auth.signOut();

      localStorage.clear();  // Wearable handlers

      sessionStorage.clear();  const handleToggleAutoSync = useCallback(() => {

      setLocation('/');    const newValue = !autoSyncEnabled;

    } catch (error) {    setAutoSyncEnabled(newValue);

      console.error('Erreur suppression compte:', error);    localStorage.setItem('autoSyncEnabled', JSON.stringify(newValue));

    }  }, [autoSyncEnabled]);

  }, [appStoreUser?.id, setLocation]);

  const handleSyncIntervalChange = useCallback((interval: number) => {

  return (    setSyncInterval(interval);

    <div className="min-h-screen bg-gray-50">    localStorage.setItem('syncInterval', interval.toString());

      <UniformHeader  }, []);

        title="Paramètres"

        icon={<SettingsIcon className="w-6 h-6" />}  // Preferences handlers

        showBackButton  const handlePreferenceChange = useCallback((key: keyof PreferencesData, value: any) => {

        onBack={() => setLocation('/profile')}    setPreferences(prev => ({ ...prev, [key]: value }));

      />  }, []);



      <div className="max-w-4xl mx-auto px-4 py-6">  const handleDeleteAccount = useCallback(async () => {

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">    if (!appStoreUser?.id) return;

          <TabsList className="grid w-full grid-cols-6 mb-6">

            <TabsTrigger value="profile" className="flex items-center space-x-2">    try {

              <User className="w-4 h-4" />      await supabase.auth.signOut();

              <span className="hidden sm:inline">Profil</span>      localStorage.clear();

            </TabsTrigger>      sessionStorage.clear();

            <TabsTrigger value="notifications" className="flex items-center space-x-2">      setLocation('/');

              <Bell className="w-4 h-4" />    } catch (error) {

              <span className="hidden sm:inline">Notifications</span>      console.error('Erreur suppression compte:', error);

            </TabsTrigger>    }

            <TabsTrigger value="wearables" className="flex items-center space-x-2">  }, [appStoreUser?.id, setLocation]);

              <Smartphone className="w-4 h-4" />

              <span className="hidden sm:inline">Appareils</span>  return (

            </TabsTrigger>    <div className="min-h-screen bg-gray-50">

            <TabsTrigger value="privacy" className="flex items-center space-x-2">      <UniformHeader

              <Shield className="w-4 h-4" />        title="Paramètres"

              <span className="hidden sm:inline">Confidentialité</span>        icon={<SettingsIcon className="w-6 h-6" />}

            </TabsTrigger>        showBackButton

            <TabsTrigger value="preferences" className="flex items-center space-x-2">        onBack={() => setLocation('/profile')}

              <Zap className="w-4 h-4" />      />

              <span className="hidden sm:inline">Préférences</span>

            </TabsTrigger>      <div className="max-w-4xl mx-auto px-4 py-6">

            <TabsTrigger value="account" className="flex items-center space-x-2">        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

              <AlertTriangle className="w-4 h-4" />          <TabsList className="grid w-full grid-cols-6 mb-6">

              <span className="hidden sm:inline">Compte</span>            <TabsTrigger value="profile" className="flex items-center space-x-2">

            </TabsTrigger>              <User className="w-4 h-4" />

          </TabsList>              <span className="hidden sm:inline">Profil</span>

            </TabsTrigger>

          <TabsContent value="profile" className="mt-6">            <TabsTrigger value="notifications" className="flex items-center space-x-2">

            <ProfileSettings              <Bell className="w-4 h-4" />

              profileData={profileData}              <span className="hidden sm:inline">Notifications</span>

              loading={loading}            </TabsTrigger>

              onSave={handleProfileSave}            <TabsTrigger value="wearables" className="flex items-center space-x-2">

              onChange={setProfileData}              <Smartphone className="w-4 h-4" />

            />              <span className="hidden sm:inline">Appareils</span>

          </TabsContent>            </TabsTrigger>

            <TabsTrigger value="privacy" className="flex items-center space-x-2">

          <TabsContent value="notifications" className="mt-6">              <Shield className="w-4 h-4" />

            <NotificationSettings              <span className="hidden sm:inline">Confidentialité</span>

              notifications={notifications}            </TabsTrigger>

              onToggle={handleNotificationChange}            <TabsTrigger value="preferences" className="flex items-center space-x-2">

              onSave={handleNotificationSave}              <Zap className="w-4 h-4" />

            />              <span className="hidden sm:inline">Préférences</span>

          </TabsContent>            </TabsTrigger>

            <TabsTrigger value="account" className="flex items-center space-x-2">

          <TabsContent value="wearables" className="mt-6">              <AlertTriangle className="w-4 h-4" />

            <WearableSettings              <span className="hidden sm:inline">Compte</span>

              isAppleHealthAvailable={isAppleHealthAvailable}            </TabsTrigger>

              isGoogleFitAvailable={isGoogleFitAvailable}          </TabsList>

              lastSyncTime={lastSyncTime}

              syncError={syncError}          <TabsContent value="profile" className="mt-6">

              wearableLoading={wearableLoading}            <ProfileSettings

              onAppleHealthSync={syncAppleHealth}              profileData={profileData}

              onGoogleFitSync={syncGoogleFit}              loading={loading}

              onSyncAll={syncAll}              onSave={handleProfileSave}

              autoSyncEnabled={autoSyncEnabled}              onChange={setProfileData}

              syncInterval={syncInterval}            />

              onToggleAutoSync={handleToggleAutoSync}          </TabsContent>

              onSyncIntervalChange={handleSyncIntervalChange}

            />          <TabsContent value="notifications" className="mt-6">

          </TabsContent>            <NotificationSettings

              notifications={notifications}

          <TabsContent value="privacy" className="mt-6">              onToggle={handleNotificationChange}

            <PrivacySettings              onSave={handleNotificationSave}

              profileVisibility={privacy.profileVisibility}            />

              workoutVisibility={privacy.workoutVisibility}          </TabsContent>

              allowFriendRequests={privacy.allowFriendRequests}

              showAchievements={privacy.showAchievements}          <TabsContent value="wearables" className="mt-6">

              showStats={privacy.showStats}            <WearableSettings

              analyticsEnabled={privacy.analyticsEnabled}              isAppleHealthAvailable={isAppleHealthAvailable}

              onProfileVisibilityChange={(visibility) => handlePrivacyChange('profileVisibility', visibility)}              isGoogleFitAvailable={isGoogleFitAvailable}

              onWorkoutVisibilityChange={(visibility) => handlePrivacyChange('workoutVisibility', visibility)}              lastSyncTime={lastSyncTime}

              onToggleFriendRequests={() => handlePrivacyChange('allowFriendRequests', !privacy.allowFriendRequests)}              syncError={syncError}

              onToggleAchievements={() => handlePrivacyChange('showAchievements', !privacy.showAchievements)}              wearableLoading={wearableLoading}

              onToggleStats={() => handlePrivacyChange('showStats', !privacy.showStats)}              onAppleHealthSync={syncAppleHealth}

              onToggleAnalytics={() => handlePrivacyChange('analyticsEnabled', !privacy.analyticsEnabled)}              onGoogleFitSync={syncGoogleFit}

              onExportData={handleExportData}              onSyncAll={syncAll}

              onDeleteData={handleDeleteData}              autoSyncEnabled={autoSyncEnabled}

            />              syncInterval={syncInterval}

          </TabsContent>              onToggleAutoSync={handleToggleAutoSync}

              onSyncIntervalChange={handleSyncIntervalChange}

          <TabsContent value="preferences" className="mt-6">            />

            <PreferencesSettings          </TabsContent>

              language={preferences.language}

              theme={preferences.theme}          <TabsContent value="privacy" className="mt-6">

              units={preferences.units}            <PrivacySettings

              soundEnabled={preferences.soundEnabled}              profileVisibility={privacy.profileVisibility}

              vibrationEnabled={preferences.vibrationEnabled}              workoutVisibility={privacy.workoutVisibility}

              autoStart={preferences.autoStart}              allowFriendRequests={privacy.allowFriendRequests}

              restTimerDuration={preferences.restTimerDuration}              showAchievements={privacy.showAchievements}

              motivationalQuotes={preferences.motivationalQuotes}              showStats={privacy.showStats}

              compactMode={preferences.compactMode}              analyticsEnabled={privacy.analyticsEnabled}

              highContrast={preferences.highContrast}              onProfileVisibilityChange={(visibility) => handlePrivacyChange('profileVisibility', visibility)}

              onLanguageChange={(language) => handlePreferenceChange('language', language)}              onWorkoutVisibilityChange={(visibility) => handlePrivacyChange('workoutVisibility', visibility)}

              onThemeChange={(theme) => handlePreferenceChange('theme', theme)}              onToggleFriendRequests={() => handlePrivacyChange('allowFriendRequests', !privacy.allowFriendRequests)}

              onUnitsChange={(units) => handlePreferenceChange('units', units)}              onToggleAchievements={() => handlePrivacyChange('showAchievements', !privacy.showAchievements)}

              onToggleSound={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}              onToggleStats={() => handlePrivacyChange('showStats', !privacy.showStats)}

              onToggleVibration={() => handlePreferenceChange('vibrationEnabled', !preferences.vibrationEnabled)}              onToggleAnalytics={() => handlePrivacyChange('analyticsEnabled', !privacy.analyticsEnabled)}

              onToggleAutoStart={() => handlePreferenceChange('autoStart', !preferences.autoStart)}              onExportData={handleExportData}

              onRestTimerChange={(duration) => handlePreferenceChange('restTimerDuration', duration)}              onDeleteData={handleDeleteData}

              onToggleMotivationalQuotes={() => handlePreferenceChange('motivationalQuotes', !preferences.motivationalQuotes)}            />

              onToggleCompactMode={() => handlePreferenceChange('compactMode', !preferences.compactMode)}          </TabsContent>

              onToggleHighContrast={() => handlePreferenceChange('highContrast', !preferences.highContrast)}

            />          <TabsContent value="preferences" className="mt-6">

          </TabsContent>            <PreferencesSettings

              language={preferences.language}

          <TabsContent value="account" className="mt-6">              theme={preferences.theme}

            <AccountDeletion              units={preferences.units}

              userEmail={appStoreUser?.email || ''}              soundEnabled={preferences.soundEnabled}

              onDeleteAccount={handleDeleteAccount}              vibrationEnabled={preferences.vibrationEnabled}

              onExportData={handleExportData}              autoStart={preferences.autoStart}

            />              restTimerDuration={preferences.restTimerDuration}

          </TabsContent>              motivationalQuotes={preferences.motivationalQuotes}

        </Tabs>              compactMode={preferences.compactMode}

      </div>              highContrast={preferences.highContrast}

    </div>              onLanguageChange={(language) => handlePreferenceChange('language', language)}

  );              onThemeChange={(theme) => handlePreferenceChange('theme', theme)}

};              onUnitsChange={(units) => handlePreferenceChange('units', units)}

              onToggleSound={() => handlePreferenceChange('soundEnabled', !preferences.soundEnabled)}

export default Settings;              onToggleVibration={() => handlePreferenceChange('vibrationEnabled', !preferences.vibrationEnabled)}
              onToggleAutoStart={() => handlePreferenceChange('autoStart', !preferences.autoStart)}
              onRestTimerChange={(duration) => handlePreferenceChange('restTimerDuration', duration)}
              onToggleMotivationalQuotes={() => handlePreferenceChange('motivationalQuotes', !preferences.motivationalQuotes)}
              onToggleCompactMode={() => handlePreferenceChange('compactMode', !preferences.compactMode)}
              onToggleHighContrast={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
            />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <AccountDeletion
              userEmail={appStoreUser?.email || ''}
              onDeleteAccount={handleDeleteAccount}
              onExportData={handleExportData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
    achievement_alerts: true,
    weekly_summary: true,
    marketing_emails: false,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_public: false,
    share_stats: false,
    allow_friend_requests: true,
    show_activity: true,
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    units: 'metric',
    currency: 'EUR',
  });

  // 🆕 FONCTION DE SUPPRESSION DE COMPTE
  const handleDeleteAccount = useCallback(async () => {
    if (!appStoreUser?.id) return;

    // Double confirmation
    const firstConfirm = window.confirm(
      "⚠️ ATTENTION : Vous êtes sur le point de supprimer définitivement votre compte MyFitHero.\n\nCette action supprimera :\n- Votre profil et toutes vos données personnelles\n- Tout votre historique d'entraînements\n- Vos statistiques et progressions\n- Vos données de nutrition et hydratation\n- Vos connexions sociales\n\nÊtes-vous absolument certain de vouloir continuer ?"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "🚨 DERNIÈRE CHANCE\n\nTapez 'SUPPRIMER' dans la prochaine boîte de dialogue pour confirmer la suppression définitive de votre compte."
    );

    if (!secondConfirm) return;

    const finalConfirmation = window.prompt(
      'Pour confirmer la suppression définitive, tapez exactement : SUPPRIMER'
    );

    if (finalConfirmation !== 'SUPPRIMER') {
      toast({
        title: 'Suppression annulée',
        description: 'La suppression de votre compte a été annulée.',
      });
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Supprimer toutes les données utilisateur dans l'ordre
      const userId = appStoreUser.id;

      // Supprimer les données liées
      const tablesToClean = [
        'user_workouts',
        'user_nutrition',
        'user_hydration',
        'user_sleep',
        'user_analytics',
        'user_preferences',
        'user_social_connections',
        'user_achievements',
        'user_wearable_data',
        'user_profiles',
      ];

      for (const table of tablesToClean) {
        const { error: _error } = await supabase.from(table).delete().eq('user_id', userId);

        if (error) {
          console.warn(`Erreur suppression ${table}:`, error);
        }
      }

      // 2. Supprimer le compte Auth Supabase
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        // Si on n'a pas les droits admin, on utilise une RPC
        const { error: rpcError } = await supabase.rpc('delete_user_account', {
          user_id: userId,
        });

        if (rpcError) {
          throw new Error('Impossible de supprimer le compte: ' + rpcError.message);
        }
      }

      // 3. Nettoyer le store local
      clearStore();

      // 4. Nettoyer le localStorage
      localStorage.clear();
      sessionStorage.clear();

      // 5. Analytics de suppression
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'account_deleted', {
          user_id: userId,
          timestamp: new Date().toISOString(),
        });
      }

      // 6. Déconnexion et redirection
      await supabase.auth.signOut();

      toast({
        title: 'Compte supprimé',
        description:
          'Votre compte MyFitHero a été définitivement supprimé. Nous espérons vous revoir bientôt !',
        duration: 5000,
      });

      // Redirection vers page d'adieu
      setTimeout(() => {
        setLocation('/goodbye');
      }, 2000);
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur suppression compte:', error);
      toast({
        title: 'Erreur de suppression',
        description:
          'Une erreur est survenue lors de la suppression. Contactez le support si le problème persiste.',
        variant: 'destructive',
        duration: 8000,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [appStoreUser?.id, clearStore, setLocation, toast]);

  // Chargement des préférences
  const loadSettings = useCallback(async () => {
    if (!appStoreUser?.id) return;

    try {
      // Charger les préférences utilisateur
      const { data: prefs, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', appStoreUser.id)
        .single();

      if (!error && prefs) {
        setNotifications(prefs.notifications || notifications);
        setPrivacy(prefs.privacy || privacy);
        setPreferences(prefs.app_preferences || preferences);
      }

      // Charger les données wearables en cache
      const cached = getCachedData();
      if (cached) {
        setLastCachedData(cached);
      }

      // Charger les préférences de sync
      const savedAutoSync = localStorage.getItem('autoSyncEnabled');
      const savedInterval = localStorage.getItem('syncInterval');

      if (savedAutoSync) {
        setAutoSyncEnabled(JSON.parse(savedAutoSync));
      }
      if (savedInterval) {
        setSyncInterval(parseInt(savedInterval));
      }
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur chargement paramètres:', error);
    }
  }, [appStoreUser?.id, getCachedData, notifications, privacy, preferences]);

  // Sauvegarde profil
  const handleSaveProfile = useCallback(async () => {
    if (!appStoreUser?.id) return;

    setLoading(true);
    try {
      const { error: _error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appStoreUser.id);

      if (error) throw error;

      setAppStoreUser({ ...appStoreUser, ...profileData });

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été sauvegardées avec succès.',
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'profile_updated', {
          user_id: appStoreUser.id,
          section: 'settings',
        });
      }
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur sauvegarde profil:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le profil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [appStoreUser, profileData, setAppStoreUser, toast]);

  // Sauvegarde notifications
  const handleSaveNotifications = useCallback(async () => {
    if (!appStoreUser?.id) return;

    setLoading(true);
    try {
      const { error: _error } = await supabase.from('user_preferences').upsert(
        {
          user_id: appStoreUser.id,
          notifications,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      );

      if (error) throw error;

      toast({
        title: 'Notifications mises à jour',
        description: 'Vos préférences de notification ont été sauvegardées.',
      });
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur sauvegarde notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les notifications.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [appStoreUser?.id, notifications, toast]);

  // Sauvegarde des préférences
  const handleSavePreferences = useCallback(async () => {
    if (!appStoreUser?.id) return;

    setLoading(true);
    try {
      const { error: _error } = await supabase.from('user_preferences').upsert(
        {
          user_id: appStoreUser.id,
          app_preferences: preferences,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      );

      if (error) throw error;

      toast({
        title: 'Préférences mises à jour',
        description: "Vos préférences d'application ont été sauvegardées.",
      });
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur sauvegarde préférences:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les préférences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [appStoreUser?.id, preferences, toast]);

  // Sauvegarde de la confidentialité
  const handleSavePrivacy = useCallback(async () => {
    if (!appStoreUser?.id) return;

    setLoading(true);
    try {
      const { error: _error } = await supabase.from('user_preferences').upsert(
        {
          user_id: appStoreUser.id,
          privacy,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      );

      if (error) throw error;

      toast({
        title: 'Confidentialité mise à jour',
        description: 'Vos paramètres de confidentialité ont été sauvegardés.',
      });
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur sauvegarde confidentialité:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la confidentialité.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [appStoreUser?.id, privacy, toast]);

  // Synchronisation wearables
  const handleAppleHealthSync = useCallback(async () => {
    const data = await syncAppleHealth();
    if (data && appStoreUser?.id) {
      cacheData(data);
      setLastCachedData(data);

      // Sauvegarder dans Supabase
      if (data.steps) {
        await AnalyticsService.saveWearableSteps(appStoreUser.id, data.steps);
      }
      if (data.heartRate && data.heartRate.length > 0) {
        await AnalyticsService.saveHeartRateData(appStoreUser.id, data.heartRate);
      }

      toast({
        title: 'Apple Health synchronisé',
        description: 'Vos données ont été mises à jour.',
      });
    }
  }, [syncAppleHealth, cacheData, appStoreUser?.id, toast]);

  const handleGoogleFitSync = useCallback(async () => {
    const data = await syncGoogleFit();
    if (data && appStoreUser?.id) {
      cacheData(data);
      setLastCachedData(data);

      toast({
        title: 'Google Fit synchronisé',
        description: 'Vos données ont été mises à jour.',
      });
    }
  }, [syncGoogleFit, cacheData, appStoreUser?.id, toast]);

  const handleSyncAll = useCallback(async () => {
    const data = await syncAll();
    if (data && appStoreUser?.id) {
      cacheData(data);
      setLastCachedData(data);

      toast({
        title: 'Synchronisation complète',
        description: 'Tous vos appareils ont été synchronisés.',
      });
    }
  }, [syncAll, cacheData, appStoreUser?.id, toast]);

  const toggleAutoSync = useCallback(() => {
    const newValue = !autoSyncEnabled;
    setAutoSyncEnabled(newValue);
    localStorage.setItem('autoSyncEnabled', JSON.stringify(newValue));

    toast({
      title: newValue ? 'Auto-sync activé' : 'Auto-sync désactivé',
      description: newValue
        ? `Synchronisation toutes les ${syncInterval} minutes`
        : 'Vous pouvez toujours synchroniser manuellement',
    });
  }, [autoSyncEnabled, syncInterval, toast]);

  const formatLastSync = useCallback((date: Date | null) => {
    if (!date) return 'Jamais';
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffMinutes / 1440)}j`;
  }, []);

  const getPersonalizedMessage = useCallback(() => {
    const userName = appStoreUser?.first_name || appStoreUser?.username || 'Champion';
    return `⚙️ Gérez vos préférences MyFitHero, ${userName}`;
  }, [appStoreUser]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Auto-sync effect
  useEffect(() => {
    if (autoSyncEnabled) {
      const cleanup = scheduleSync(syncInterval);
      return cleanup;
    }
  }, [autoSyncEnabled, syncInterval, scheduleSync]);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'wearables', label: 'Appareils', icon: Smartphone },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UniformHeader
        title="Paramètres"
        subtitle={getPersonalizedMessage()}
        showBackButton={true}
        gradient={true}
        rightContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20"
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </Button>
        }
      />

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-5">
                {tabs.map(tab => {
                  const TabIcon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center space-x-2"
                    >
                      <TabIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardContent>
          </Card>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>Modifiez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder="Nom d'utilisateur unique"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Parlez-nous de vous, vos objectifs..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                      placeholder="Votre ville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={e => setProfileData({ ...profileData, country: e.target.value })}
                      placeholder="Votre pays"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder le profil'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Choisissez les notifications que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <Label htmlFor={key} className="font-medium">
                        {key === 'workout_reminders' && "Rappels d'entraînement"}
                        {key === 'hydration_reminders' && "Rappels d'hydratation"}
                        {key === 'meal_reminders' && 'Rappels de repas'}
                        {key === 'sleep_reminders' && 'Rappels de sommeil'}
                        {key === 'achievement_alerts' && 'Alertes de réussite'}
                        {key === 'weekly_summary' && 'Résumé hebdomadaire'}
                        {key === 'marketing_emails' && 'Emails marketing'}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {key === 'workout_reminders' &&
                          'Recevez des rappels pour vos entraînements programmés'}
                        {key === 'hydration_reminders' &&
                          'Restez hydraté avec des rappels réguliers'}
                        {key === 'meal_reminders' && 'Ne manquez jamais un repas'}
                        {key === 'sleep_reminders' && 'Notifications pour optimiser votre sommeil'}
                        {key === 'achievement_alerts' &&
                          'Célébrez vos réussites et objectifs atteints'}
                        {key === 'weekly_summary' &&
                          'Recevez votre résumé de progression hebdomadaire'}
                        {key === 'marketing_emails' &&
                          'Nouvelles fonctionnalités et offres spéciales'}
                      </p>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={checked =>
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}

                <Button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder les notifications'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Wearables */}
          <TabsContent value="wearables">
            <div className="space-y-6">
              {/* Statut de synchronisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="mr-2" size={20} />
                    Appareils connectés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dernière sync */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="text-gray-500" size={16} />
                      <div>
                        <p className="text-sm font-medium">Dernière synchronisation</p>
                        <p className="text-xs text-gray-500">{formatLastSync(lastSyncTime)}</p>
                      </div>
                    </div>
                    <Badge variant={lastSyncTime ? 'default' : 'secondary'}>
                      {lastSyncTime ? 'Synchronisé' : 'Jamais synchronisé'}
                    </Badge>
                  </div>

                  {/* Erreur de sync */}
                  {syncError && (
                    <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="text-red-500" size={16} />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Erreur de synchronisation
                        </p>
                        <p className="text-xs text-red-600">{syncError}</p>
                      </div>
                    </div>
                  )}

                  {/* Boutons de sync */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={handleAppleHealthSync}
                      disabled={!isAppleHealthAvailable || wearableLoading}
                      variant={isAppleHealthAvailable ? 'default' : 'outline'}
                      className="flex items-center space-x-2"
                    >
                      <Heart className="text-red-500" size={16} />
                      <span>Apple Health</span>
                      {wearableLoading && <RefreshCw className="animate-spin" size={14} />}
                    </Button>

                    <Button
                      onClick={handleGoogleFitSync}
                      disabled={!isGoogleFitAvailable || wearableLoading}
                      variant={isGoogleFitAvailable ? 'default' : 'outline'}
                      className="flex items-center space-x-2"
                    >
                      <Activity className="text-green-500" size={16} />
                      <span>Google Fit</span>
                      {wearableLoading && <RefreshCw className="animate-spin" size={14} />}
                    </Button>

                    <Button
                      onClick={handleSyncAll}
                      disabled={
                        (!isAppleHealthAvailable && !isGoogleFitAvailable) || wearableLoading
                      }
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <RefreshCw className={wearableLoading ? 'animate-spin' : ''} size={16} />
                      <span>Tout synchroniser</span>
                    </Button>
                  </div>

                  {/* Paramètres de sync automatique */}
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Synchronisation automatique</Label>
                        <p className="text-sm text-gray-600">
                          Synchroniser automatiquement vos appareils
                        </p>
                      </div>
                      <Switch checked={autoSyncEnabled} onCheckedChange={toggleAutoSync} />
                    </div>

                    {autoSyncEnabled && (
                      <div>
                        <Label className="text-sm">Intervalle (minutes)</Label>
                        <div className="flex space-x-2 mt-2">
                          {[15, 30, 60, 120].map(interval => (
                            <Button
                              key={interval}
                              variant={syncInterval === interval ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSyncInterval(interval)}
                            >
                              {interval}min
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Données en cache */}
                  {lastCachedData && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Dernières données synchronisées
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700">
                            Pas: {lastCachedData.steps?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">
                            Calories: {lastCachedData.caloriesBurned || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">
                            FC moy: {lastCachedData.avgHeartRate || 0} bpm
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">
                            Minutes actives: {lastCachedData.activeMinutes || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Confidentialité */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité et sécurité</CardTitle>
                <CardDescription>Contrôlez vos paramètres de confidentialité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      {key === 'profile_public' && <Eye className="text-gray-500" size={16} />}
                      {key === 'share_stats' && <Activity className="text-gray-500" size={16} />}
                      {key === 'allow_friend_requests' && (
                        <User className="text-gray-500" size={16} />
                      )}
                      {key === 'show_activity' && (
                        <CheckCircle className="text-gray-500" size={16} />
                      )}
                      <div>
                        <Label htmlFor={key} className="font-medium">
                          {key === 'profile_public' && 'Profil public'}
                          {key === 'share_stats' && 'Partager les statistiques'}
                          {key === 'allow_friend_requests' && "Demandes d'amis"}
                          {key === 'show_activity' && "Afficher l'activité"}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {key === 'profile_public' &&
                            'Rendre votre profil visible aux autres utilisateurs'}
                          {key === 'share_stats' && 'Partager vos statistiques avec la communauté'}
                          {key === 'allow_friend_requests' &&
                            "Permettre aux autres de vous envoyer des demandes d'amis"}
                          {key === 'show_activity' && "Afficher votre statut d'activité aux amis"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={checked => setPrivacy({ ...privacy, [key]: checked })}
                    />
                  </div>
                ))}

                <Button
                  onClick={handleSavePrivacy}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder la confidentialité'}
                </Button>

                <Separator />

                {/* 🆕 ZONE DE DANGER AVEC SUPPRESSION DE COMPTE BRANCHÉE */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600 flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    Zone de danger
                  </h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-3">
                      ⚠️ <strong>ATTENTION :</strong> Cette action supprimera définitivement votre
                      compte MyFitHero et toutes vos données associées (profil, entraînements,
                      statistiques, etc.). Cette action est <strong>irréversible</strong>.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting
                        ? 'Suppression en cours...'
                        : 'Supprimer définitivement mon compte'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Préférences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de l'application</CardTitle>
                <CardDescription>Personnalisez votre expérience MyFitHero</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Langue</Label>
                          <p className="text-sm text-gray-600">Choisissez votre langue préférée</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={preferences.language}
                        onChange={e => setPreferences({ ...preferences, language: e.target.value })}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Palette className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Thème</Label>
                          <p className="text-sm text-gray-600">Apparence de l'application</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={preferences.theme}
                        onChange={e => setPreferences({ ...preferences, theme: e.target.value })}
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="system">Système</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Unités</Label>
                          <p className="text-sm text-gray-600">Système de mesure</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={preferences.units}
                        onChange={e => setPreferences({ ...preferences, units: e.target.value })}
                      >
                        <option value="metric">Métrique (kg, cm)</option>
                        <option value="imperial">Impérial (lbs, ft)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label className="font-medium">Devise</Label>
                          <p className="text-sm text-gray-600">Monnaie pour les abonnements</p>
                        </div>
                      </div>
                      <select
                        className="px-3 py-2 border rounded-md"
                        value={preferences.currency}
                        onChange={e => setPreferences({ ...preferences, currency: e.target.value })}
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar ($)</option>
                        <option value="GBP">Livre (£)</option>
                        <option value="CAD">Dollar canadien</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
