// client/src/features/admin/components/AdminDashboard.tsx
import React from 'react';
import { AdminHeader } from './AdminHeader';
import { UserProfileCard } from './UserProfileCard';
import { StatsCard } from './StatsCard';
import { QuickActionsCard } from './QuickActionsCard';
import { RecentActivityCard } from './RecentActivityCard';

interface AdminDashboardProps {
  userProfile?: {
    id: string;
    role: string;
    email?: string;
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userProfile }) => {
  const usersStats = [
    { label: 'Total utilisateurs', value: '--' },
    { label: 'Nouveaux (7j)', value: '--' },
  ];

  const workoutStats = [
    { label: 'Total workouts', value: '--' },
    { label: "Aujourd'hui", value: '--' },
  ];

  const systemStats = [
    { label: 'Status', value: 'Actif', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
    { label: 'Version', value: 'v4.0' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader />

        {userProfile && <UserProfileCard userProfile={userProfile} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Utilisateurs"
            stats={usersStats}
            actionLabel="Gérer les utilisateurs"
          />
          <StatsCard
            title="Workouts"
            stats={workoutStats}
            actionLabel="Voir les statistiques"
          />
          <StatsCard
            title="Système"
            stats={systemStats}
            actionLabel="Paramètres système"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActionsCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
