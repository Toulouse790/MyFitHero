import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

// Étendre les matchers Jest
expect.extend(toHaveNoViolations);

// Types pour TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

/**
 * Utilitaire pour tester l'accessibilité d'un composant
 */
export const testAccessibility = async (component: React.ReactElement) => {
  const { container } = render(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return { container, results };
};

/**
 * Teste la navigation au clavier d'un composant
 */
export const testKeyboardNavigation = async (
  component: React.ReactElement,
  focusableElements: string[] = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ]
) => {
  const user = userEvent.setup();
  const { container } = render(component);
  
  // Trouver tous les éléments focusables
  const focusableElementsInComponent = container.querySelectorAll(
    focusableElements.join(', ')
  ) as NodeListOf<HTMLElement>;
  
  expect(focusableElementsInComponent.length).toBeGreaterThan(0);
  
  // Tester la navigation Tab
  for (let i = 0; i < focusableElementsInComponent.length; i++) {
    await user.tab();
    expect(focusableElementsInComponent[i]).toHaveFocus();
  }
  
  // Tester la navigation Shift+Tab (retour)
  for (let i = focusableElementsInComponent.length - 2; i >= 0; i--) {
    await user.tab({ shift: true });
    expect(focusableElementsInComponent[i]).toHaveFocus();
  }
  
  return { container, focusableElementsInComponent };
};

/**
 * Teste les attributs ARIA d'un élément
 */
export const testAriaAttributes = (
  element: HTMLElement,
  expectedAttributes: Record<string, string | boolean | null>
) => {
  Object.entries(expectedAttributes).forEach(([attribute, expectedValue]) => {
    const actualValue = element.getAttribute(attribute);
    
    if (typeof expectedValue === 'boolean') {
      if (expectedValue) {
        expect(actualValue).not.toBeNull();
      } else {
        expect(actualValue).toBeNull();
      }
    } else {
      expect(actualValue).toBe(expectedValue);
    }
  });
};

/**
 * Teste les contrastes de couleur
 */
export const testColorContrast = async (component: React.ReactElement) => {
  const { container } = render(component);
  
  // Utiliser axe avec les règles de contraste spécifiques
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'color-contrast-enhanced': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Teste la sémantique HTML
 */
export const testSemanticHTML = async (component: React.ReactElement) => {
  const { container } = render(component);
  
  const results = await axe(container, {
    rules: {
      'landmark-one-main': { enabled: true },
      'page-has-heading-one': { enabled: true },
      'region': { enabled: true },
      'bypass': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Teste les formulaires accessibles
 */
export const testFormAccessibility = async (formComponent: React.ReactElement) => {
  const { container } = render(formComponent);
  
  // Tester les labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label).toBeInTheDocument();
    }
  });
  
  // Tester les messages d'erreur
  const errorElements = container.querySelectorAll('[role="alert"]');
  errorElements.forEach(errorElement => {
    expect(errorElement).toHaveAttribute('aria-live', 'assertive');
  });
  
  // Tester avec axe
  const results = await axe(container, {
    rules: {
      'label': { enabled: true },
      'label-title-only': { enabled: true },
      'form-field-multiple-labels': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Teste les images accessibles
 */
export const testImageAccessibility = async (component: React.ReactElement) => {
  const { container } = render(component);
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const ariaLabelledby = img.getAttribute('aria-labelledby');
    const role = img.getAttribute('role');
    
    // Une image doit avoir un texte alternatif, sauf si elle est décorative
    if (role !== 'presentation' && !img.hasAttribute('aria-hidden')) {
      expect(alt !== null || ariaLabel !== null || ariaLabelledby !== null).toBe(true);
    }
  });
  
  const results = await axe(container, {
    rules: {
      'image-alt': { enabled: true },
      'image-redundant-alt': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Teste les liens accessibles
 */
export const testLinkAccessibility = async (component: React.ReactElement) => {
  const { container } = render(component);
  
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const ariaLabel = link.getAttribute('aria-label');
    const textContent = link.textContent?.trim();
    
    // Un lien doit avoir un href et un texte descriptif
    expect(href).not.toBeNull();
    expect(textContent || ariaLabel).toBeTruthy();
  });
  
  const results = await axe(container, {
    rules: {
      'link-name': { enabled: true },
      'link-in-text-block': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Teste les boutons accessibles
 */
export const testButtonAccessibility = async (component: React.ReactElement) => {
  const { container } = render(component);
  
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    const ariaLabel = button.getAttribute('aria-label');
    const textContent = button.textContent?.trim();
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    
    // Un bouton doit avoir un nom accessible
    expect(textContent || ariaLabel || ariaLabelledby).toBeTruthy();
  });
  
  const results = await axe(container, {
    rules: {
      'button-name': { enabled: true },
      'nested-interactive': { enabled: true }
    }
  });
  
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Suite de tests complète pour l'accessibilité
 */
export const runFullAccessibilityTestSuite = async (component: React.ReactElement) => {
  const results = {
    general: await testAccessibility(component),
    keyboard: await testKeyboardNavigation(component),
    colorContrast: await testColorContrast(component),
    semantic: await testSemanticHTML(component),
    images: await testImageAccessibility(component),
    links: await testLinkAccessibility(component),
    buttons: await testButtonAccessibility(component)
  };
  
  return results;
};

/**
 * Configuration Jest pour les tests d'accessibilité
 */
export const setupAccessibilityTests = () => {
  // Configuration globale d'axe
  beforeEach(() => {
    // Configurer axe avec les règles WCAG 2.1 AA
    global.axe = require('jest-axe').axe;
    global.axe.configure({
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'keyboard-navigation', enabled: true },
        { id: 'focus-order-semantics', enabled: true },
        { id: 'aria-valid-attr', enabled: true },
        { id: 'aria-valid-attr-value', enabled: true },
        { id: 'aria-required-children', enabled: true },
        { id: 'aria-required-parent', enabled: true }
      ],
      tags: ['wcag2a', 'wcag2aa']
    });
  });
  
  // Nettoyer après chaque test
  afterEach(() => {
    // Nettoyer le DOM
    document.body.innerHTML = '';
  });
};

/**
 * Utilitaires pour les tests en mode développement
 */
export const developmentAccessibilityHelpers = {
  /**
   * Affiche un rapport d'accessibilité dans la console
   */
  logAccessibilityReport: async (component: React.ReactElement) => {
    const { container } = render(component);
    const results = await axe(container);
    
    if (results.violations.length > 0) {
      console.group('🚨 Violations d\'accessibilité détectées:');
      results.violations.forEach(violation => {
        console.error(`${violation.id}: ${violation.description}`);
        console.log('Éléments concernés:', violation.nodes);
        console.log('Aide:', violation.helpUrl);
      });
      console.groupEnd();
    } else {
      console.log('✅ Aucune violation d\'accessibilité détectée');
    }
    
    return results;
  },
  
  /**
   * Vérifie l'accessibilité en temps réel (pour le développement)
   */
  enableLiveAccessibilityChecking: () => {
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react').then(axe => {
        axe.default(React, require('react-dom'), 1000);
      });
    }
  }
};