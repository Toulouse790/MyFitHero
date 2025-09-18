// client/src/features/admin/components/AdminHeader.tsx
import React from 'react';

export const AdminHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
      <p className="text-gray-600 mt-2">Gestion et administration de MyFitHero</p>
    </div>
  );
};