import { useEffect, useRef, useCallback, RefObject, useState } from 'react';

// 🎯 Hook pour Focus Trap WCAG conforme
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  const firstFocusableRef = useRef<HTMLElement>();
  const lastFocusableRef = useRef<HTMLElement>();

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'embed',
      'area[href]',
      'summary',
      'details'
    ].join(',');

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(element => {
      return element.offsetWidth > 0 && 
             element.offsetHeight > 0 && 
             !element.hasAttribute('disabled') &&
             element.getAttribute('aria-hidden') !== 'true';
    });

    return elements;
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [isActive, containerRef, getFocusableElements]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0];
      lastFocusableRef.current = focusableElements[focusableElements.length - 1];
      
      // Focus le premier élément focusable
      firstFocusableRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, handleKeyDown, getFocusableElements]);

  return {
    firstFocusableElement: firstFocusableRef.current,
    lastFocusableElement: lastFocusableRef.current
  };
};

// 🎯 Hook pour annoncer les changements aux lecteurs d'écran
export const useAnnounce = () => {
  const announcerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    // Créer l'élément announcer s'il n'existe pas
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'accessibility-announcer';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) return;

    announcerRef.current.setAttribute('aria-live', priority);
    announcerRef.current.textContent = message;

    // Effacer après un délai pour permettre de nouvelles annonces
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  return { announce };
};

// 🎯 Hook pour gestion du focus après navigation
export const useFocusManagement = () => {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (restoreFocusRef.current && document.body.contains(restoreFocusRef.current)) {
      restoreFocusRef.current.focus();
    }
  }, []);

  const moveFocusToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const moveFocusToHeading = useCallback((level: number = 1) => {
    const heading = document.querySelector(`h${level}`) as HTMLElement;
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
      heading.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
    moveFocusToContent,
    moveFocusToHeading
  };
};

// 🎯 Hook pour gestion des raccourcis clavier
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isModified = event.ctrlKey || event.metaKey || event.altKey;
      
      // Ignorer si focus dans un input
      const activeElement = document.activeElement;
      const isInInput = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA' ||
                       activeElement?.getAttribute('contenteditable') === 'true';

      if (isInInput && !isModified) return;

      const shortcutKey = isModified 
        ? `${event.ctrlKey ? 'ctrl+' : ''}${event.metaKey ? 'cmd+' : ''}${event.altKey ? 'alt+' : ''}${key}`
        : key;

      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// 🎯 Hook pour état accessible des composants
export const useAccessibleState = <T>(
  initialState: T,
  announceChanges: boolean = true
) => {
  const [state, setState] = useState<T>(initialState);
  const { announce } = useAnnounce();

  const setAccessibleState = useCallback((
    newState: T | ((prev: T) => T),
    announcement?: string
  ) => {
    setState(prevState => {
      const updatedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      if (announceChanges && announcement) {
        announce(announcement);
      }

      return updatedState;
    });
  }, [announce, announceChanges]);

  return [state, setAccessibleState] as const;
};

// 🎯 Utilitaires pour ARIA
export const AriaUtils = {
  // Générer un ID unique pour aria-describedby
  generateId: (prefix: string = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Construire une description ARIA
  buildDescription: (parts: (string | undefined)[]): string => {
    return parts.filter(Boolean).join('. ');
  },

  // Formatter les erreurs pour les lecteurs d'écran
  formatErrorMessage: (fieldName: string, errorMessage: string): string => {
    return `Erreur pour ${fieldName}: ${errorMessage}`;
  },

  // Créer des props ARIA pour les boutons
  buttonProps: (
    label: string,
    pressed?: boolean,
    disabled?: boolean,
    describedBy?: string
  ) => ({
    'aria-label': label,
    'aria-pressed': pressed !== undefined ? pressed : undefined,
    'aria-disabled': disabled || undefined,
    'aria-describedby': describedBy || undefined,
    role: 'button',
    tabIndex: disabled ? -1 : 0
  }),

  // Créer des props ARIA pour les liens
  linkProps: (
    label: string,
    current?: boolean,
    describedBy?: string
  ) => ({
    'aria-label': label,
    'aria-current': current ? ('page' as const) : undefined,
    'aria-describedby': describedBy || undefined
  }),

  // Créer des props ARIA pour les régions
  regionProps: (
    label: string,
    live?: 'polite' | 'assertive' | 'off'
  ) => ({
    'aria-label': label,
    'aria-live': live || undefined,
    role: 'region'
  })
};

// 🎯 Détecteur de préférences d'accessibilité
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersReducedTransparency: false
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches
      });
    };

    updatePreferences();

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-transparency: reduce)')
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  return preferences;
};