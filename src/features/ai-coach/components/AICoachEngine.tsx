import React from 'react';

interface AICoachEngineProps {
  user: { id: string; goals: string[]; injuries: string[] } | null;
}

export const AICoachEngine: React.FC<AICoachEngineProps> = ({ user }) => {
  if (!user) return <div>Erreur : utilisateur non défini</div>;
  if (!user.goals || user.goals.length === 0) return <div>Aucune recommandation disponible</div>;
  // Simule une recommandation personnalisée
  return <div>Recommandation personnalisée pour {user.goals.join(', ')}</div>;
};
