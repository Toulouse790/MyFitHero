import 'jest-axe/extend-expect';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuration de React Testing Library pour l'accessibilité
configure({
  testIdAttribute: 'data-testid',
  // Augmenter les timeouts pour les tests d'accessibilité
  asyncUtilTimeout: 5000
});

// Configuration globale d'axe-core
if (typeof window !== 'undefined') {
  // Désactiver les animations pendant les tests
  const style = document.createElement('style');
  style.innerHTML = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}
