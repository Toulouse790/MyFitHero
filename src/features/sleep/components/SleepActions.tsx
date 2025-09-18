// src/features/sleep/components/SleepActions.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus,
  Calendar,
  BarChart3,
  Target,
  Settings,
  Bell,
  Moon,
  History
} from 'lucide-react';

interface SleepActionsProps {
  userSportCategory: string;
  sportEmoji: string;
  isTimerActive: boolean;
  onAddSleepData: () => void;
  onViewHistory: () => void;
  onSetGoals: () => void;
  onSettings: () => void;
  onSetReminders: () => void;
  onStartTimer: () => void;
}

export const SleepActions: React.FC<SleepActionsProps> = ({
  userSportCategory,
  sportEmoji,
  isTimerActive,
  onAddSleepData,
  onViewHistory,
  onSetGoals,
  onSettings,
  onSetReminders,
  onStartTimer,
}) => {
  const primaryActions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Ajouter sommeil",
      description: "Enregistrer une nouvelle nuit",
      onClick: onAddSleepData,
      variant: "default" as const,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <Moon className="h-4 w-4" />,
      label: isTimerActive ? "Timer actif" : "Démarrer timer",
      description: isTimerActive ? "Timer en cours..." : "Nouveau timer de sommeil",
      onClick: onStartTimer,
      variant: isTimerActive ? "secondary" as const : "outline" as const,
      className: isTimerActive ? "bg-green-100 text-green-700" : "",
      disabled: isTimerActive
    }
  ];

  const secondaryActions = [
    {
      icon: <History className="h-4 w-4" />,
      label: "Historique",
      description: "Voir toutes vos nuits",
      onClick: onViewHistory
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Analyses",
      description: "Tendances et statistiques",
      onClick: onViewHistory // Même action, différente vue
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Objectifs",
      description: "Personnaliser vos cibles",
      onClick: onSetGoals
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: "Rappels",
      description: "Notifications de coucher",
      onClick: onSetReminders
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Planifier",
      description: "Optimiser votre routine",
      onClick: onSettings
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Paramètres",
      description: "Configuration avancée",
      onClick: onSettings
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Actions rapides</span>
          </div>
          <Badge variant="outline">
            {userSportCategory} {sportEmoji}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Actions principales */}
          <div>
            <h4 className="font-medium text-sm mb-3 text-gray-700">Actions principales</h4>
            <div className="grid grid-cols-1 gap-3">
              {primaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`h-auto p-4 justify-start ${action.className || ''}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs opacity-70 mt-1">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Actions secondaires */}
          <div>
            <h4 className="font-medium text-sm mb-3 text-gray-700">Gestion</h4>
            <div className="grid grid-cols-2 gap-2">
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.onClick}
                  className="h-auto p-3 flex-col space-y-1"
                >
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">{action.label}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Message contextuel */}
          <div className="pt-3 border-t border-gray-200">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Moon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Optimisé pour {userSportCategory.toLowerCase()}</div>
                  <div>
                    Le sommeil est crucial pour votre performance sportive. 
                    Utilisez ces outils pour optimiser votre récupération.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepActions;