// client/src/features/admin/components/QuickActionsCard.tsx
import React from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface QuickAction {
  icon: string;
  label: string;
  onClick?: () => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: '📊', label: 'Voir les analytics' },
  { icon: '👥', label: 'Gérer les utilisateurs' },
  { icon: '💳', label: 'Gestion des paiements' },
  { icon: '📱', label: 'Notifications' },
  { icon: '🎯', label: 'Support utilisateurs' },
];

export const QuickActionsCard: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="w-full justify-start"
            onClick={action.onClick}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};