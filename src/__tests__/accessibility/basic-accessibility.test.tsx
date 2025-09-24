import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extension Jest pour axe
expect.extend(toHaveNoViolations);

// Composant simple pour tester l'accessibilité de base
const SimpleButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

const SimpleInput = ({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input id={id} {...props} />
  </div>
);

describe('🌐 Tests d\'Accessibilité WCAG 2.1 AA - Configuration', () => {
  describe('✅ Tests de Base', () => {
    it('peut exécuter un test d\'accessibilité simple', async () => {
      const { container } = render(
        <SimpleButton>Cliquer ici</SimpleButton>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('valide les labels de formulaire', async () => {
      const { container } = render(
        <SimpleInput 
          label="Nom d'utilisateur" 
          id="username"
          type="text"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Vérifier que le label est correctement associé
      const input = screen.getByLabelText('Nom d\'utilisateur');
      expect(input).toBeInTheDocument();
    });

    it('détecte les violations d\'accessibilité', async () => {
      const { container } = render(
        <div>
          <img src="test.jpg" alt="" /> {/* Image décorative OK */}
          <img src="content.jpg" /> {/* Image sans alt - violation */}
        </div>
      );

      const results = await axe(container);
      expect(results.violations.length).toBeGreaterThan(0);
    });

    it('valide la structure sémantique', async () => {
      const { container } = render(
        <main>
          <h1>Titre Principal</h1>
          <section>
            <h2>Section</h2>
            <p>Contenu de la section</p>
          </section>
        </main>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('🎯 Tests WCAG Spécifiques', () => {
    it('valide les rôles ARIA', async () => {
      const { container } = render(
        <div>
          <nav role="navigation" aria-label="Navigation principale">
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/about">À propos</a></li>
            </ul>
          </nav>
          <main role="main">
            <h1>Contenu principal</h1>
          </main>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('valide les alertes et messages d\'erreur', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <div 
            id="email-error" 
            role="alert" 
            aria-live="polite"
          >
            Format d'email invalide
          </div>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('⌨️ Tests de Navigation Clavier', () => {
    it('permet la navigation au clavier', () => {
      render(
        <div>
          <button>Bouton 1</button>
          <button>Bouton 2</button>
          <input type="text" placeholder="Champ de saisie" />
        </div>
      );

      const buttons = screen.getAllByRole('button');
      const input = screen.getByRole('textbox');

      // Vérifier que tous les éléments sont focusables
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
      
      expect(input).not.toHaveAttribute('tabindex', '-1');
    });
  });
});

describe('📊 Rapport de Conformité WCAG 2.1 AA', () => {
  it('génère un rapport de test d\'accessibilité', async () => {
    const testComponent = (
      <div>
        <header>
          <h1>MyFitHero - Application de Fitness</h1>
          <nav aria-label="Navigation principale">
            <ul>
              <li><a href="/">Dashboard</a></li>
              <li><a href="/workout">Entraînements</a></li>
              <li><a href="/nutrition">Nutrition</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section>
            <h2>Tableau de bord</h2>
            <p>Bienvenue sur votre tableau de bord personnalisé.</p>
            
            <form>
              <div>
                <label htmlFor="goal">Objectif de fitness</label>
                <select id="goal">
                  <option value="">Sélectionner un objectif</option>
                  <option value="weight-loss">Perte de poids</option>
                  <option value="muscle-gain">Gain musculaire</option>
                </select>
              </div>
              
              <button type="submit">Enregistrer</button>
            </form>
          </section>
        </main>
        
        <footer>
          <p>&copy; 2024 MyFitHero - Accessible à tous</p>
        </footer>
      </div>
    );

    const { container } = render(testComponent);
    const results = await axe(container);

    // Le composant doit être conforme WCAG 2.1 AA
    expect(results).toHaveNoViolations();

    // Rapport détaillé
    
    if (results.violations.length > 0) {
    }
  });
});