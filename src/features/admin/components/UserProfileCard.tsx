// client/src/features/admin/components/UserProfileCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfileCardProps {
  userProfile: {
    id: string;
    role: string;
    email?: string;
  };
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ userProfile }) => {
  return (
    <Card className="mb-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profil Administrateur</h2>
          <p className="text-gray-600">{userProfile.email || userProfile.id}</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {userProfile.role}
        </Badge>
      </div>
    </Card>
  );
};