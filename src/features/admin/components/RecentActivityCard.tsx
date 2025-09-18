// client/src/features/admin/components/RecentActivityCard.tsx
import React from 'react';
import { Card } from '../../../components/ui/card';

interface ActivityItem {
  type: 'info' | 'success' | 'warning';
  title: string;
  time: string;
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    type: 'info',
    title: 'Nouveau utilisateur inscrit',
    time: 'Il y a 2 heures'
  },
  {
    type: 'success',
    title: 'Workout complété',
    time: 'Il y a 3 heures'
  },
  {
    type: 'warning',
    title: 'Erreur système résolue',
    time: 'Il y a 5 heures'
  }
];

const getBorderColor = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'info':
      return 'border-blue-500';
    case 'success':
      return 'border-green-500';
    case 'warning':
      return 'border-yellow-500';
    default:
      return 'border-gray-500';
  }
};

export const RecentActivityCard: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((activity, index) => (
          <div key={index} className={`border-l-4 ${getBorderColor(activity.type)} pl-4`}>
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};