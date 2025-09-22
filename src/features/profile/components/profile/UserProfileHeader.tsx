// src/features/profile/components/profile/UserProfileHeader.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AvatarUpload from '@/features/profile/components/AvatarUpload';

interface UserProfileHeaderProps {
  userProfile: any;
  user: any;
  stats?: any;
  bmi: string | null;
  weightTrend: {
    type: 'up' | 'down' | 'stable';
    diff: number;
  } | null;
  latestWeight: number | null;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  userProfile,
  user,
  bmi,
  weightTrend,
  latestWeight,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col items-center">
        <AvatarUpload />
        <h1 className="text-2xl font-bold mt-4 text-gray-900">
          {userProfile?.displayName ||
            user?.email?.split('@')[0] ||
            'Utilisateur'}
        </h1>
        <p className="text-gray-500 mt-1">{user?.email}</p>

        {/* Statistiques rapides */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          {bmi && (
            <div className="text-center">
              <div className="font-semibold text-blue-600">{bmi}</div>
              <div className="text-gray-500">IMC</div>
            </div>
          )}
          
          {weightTrend && (
            <div className="text-center">
              <div
                className={`font-semibold flex items-center gap-1 ${
                  weightTrend.type === 'up'
                    ? 'text-red-500'
                    : weightTrend.type === 'down'
                      ? 'text-green-500'
                      : 'text-gray-500'
                }`}
              >
                {weightTrend.type === 'up' && <TrendingUp size={16} />}
                {weightTrend.type === 'down' && <TrendingDown size={16} />}
                {weightTrend.type === 'stable' && <Minus size={16} />}
                {weightTrend.diff > 0 ? `${weightTrend.diff.toFixed(1)}kg` : 'Stable'}
              </div>
              <div className="text-gray-500">Tendance</div>
            </div>
          )}
          
          {latestWeight && (
            <div className="text-center">
              <div className="font-semibold text-green-600">{latestWeight} kg</div>
              <div className="text-gray-500">Poids actuel</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;