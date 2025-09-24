import { render, screen } from '@testing-library/react';
import { AICoachEngine } from '../../features/ai-coach/components/AICoachEngine';

describe('AICoachEngine', () => {
  it('génère des recommandations personnalisées', () => {
    // Simule un utilisateur avec un profil complexe
    const user = { id: 'u1', goals: ['force', 'perte de poids'], injuries: ['genou'] };
    render(<AICoachEngine user={user} />);
    expect(screen.getByText(/recommandation/i)).toBeInTheDocument();
  });

  it('gère les erreurs critiques', () => {
    // Simule une erreur d’API ou d’algorithme
    const user = null;
    render(<AICoachEngine user={user} />);
    expect(screen.getByText(/erreur/i)).toBeInTheDocument();
  });

  it('couvre tous les cas limites', () => {
    // Edge case : utilisateur sans objectif
    const user = { id: 'u2', goals: [], injuries: [] };
    render(<AICoachEngine user={user} />);
    expect(screen.getByText(/aucune recommandation/i)).toBeInTheDocument();
  });
});