// src/features/profile/components/settings/NotificationSettings.tsx
import React, { useState, useCallback } from 'react';
import { Bell, Save, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { useToast } from '../../../../shared/hooks/use-toast';
import { supabase } from '../../../../lib/supabase';

interface NotificationPreferences {
  workout_reminders: boolean;
  hydration_reminders: boolean;
  meal_reminders: boolean;
  sleep_reminders: boolean;
  achievement_alerts: boolean;
  weekly_summary: boolean;
  marketing_emails: boolean;
}

interface NotificationSettingsProps {
  initialSettings: NotificationPreferences;
  userId: string | undefined;
  onSettingsUpdate: (settings: NotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  initialSettings,
  userId,
  onSettingsUpdate,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(initialSettings);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = useCallback(async () => {
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
        .from('user_preferences')
        .upsert({
          user_id: userId,
          notification_settings: notifications,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      onSettingsUpdate(notifications);
      toast({
        title: 'Succès',
        description: 'Préférences de notification mises à jour !',
      });
    } catch (error) {
      console.error('Notification settings error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour des notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, notifications, onSettingsUpdate, toast]);

  const notificationOptions = [
    {
      key: 'workout_reminders' as keyof NotificationPreferences,
      label: 'Rappels d\'entraînement',
      description: 'Recevoir des notifications pour vos séances planifiées',
      icon: '🏋️‍♂️',
    },
    {
      key: 'hydration_reminders' as keyof NotificationPreferences,
      label: 'Rappels d\'hydratation',
      description: 'Notifications pour vous rappeler de boire de l\'eau',
      icon: '💧',
    },
    {
      key: 'meal_reminders' as keyof NotificationPreferences,
      label: 'Rappels de repas',
      description: 'Notifications pour vos heures de repas',
      icon: '🍽️',
    },
    {
      key: 'sleep_reminders' as keyof NotificationPreferences,
      label: 'Rappels de sommeil',
      description: 'Notifications pour votre heure de coucher',
      icon: '😴',
    },
    {
      key: 'achievement_alerts' as keyof NotificationPreferences,
      label: 'Alertes de réussites',
      description: 'Notifications pour vos accomplissements et badges',
      icon: '🏆',
    },
    {
      key: 'weekly_summary' as keyof NotificationPreferences,
      label: 'Résumé hebdomadaire',
      description: 'Rapport de vos progrès chaque semaine',
      icon: '📊',
    },
    {
      key: 'marketing_emails' as keyof NotificationPreferences,
      label: 'Emails marketing',
      description: 'Recevoir des conseils et promotions par email',
      icon: '📧',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Bell className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Préférences de notification</h3>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {option.description}
                </p>
              </div>
            </div>
            <Switch
              checked={notifications[option.key]}
              onCheckedChange={() => handleToggle(option.key)}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600">💡</span>
          <div className="text-sm text-blue-800">
            <strong>Conseil :</strong> Activez les rappels qui correspondent à vos objectifs. 
            Vous pouvez ajuster la fréquence dans les paramètres avancés.
          </div>
        </div>
      </div>

      <Button
        onClick={handleSaveNotifications}
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
            Sauvegarder les notifications
          </>
        )}
      </Button>
    </div>
  );
};

export default NotificationSettings;