import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SkipLink, AccessibleButton, AccessibleLink } from './AccessibleComponents';
import { useFocusManagement, useKeyboardShortcuts, useAnnounce } from '../hooks/useAccessibility';
import { cn } from '../../../lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  isExternal?: boolean;
  ariaLabel?: string;
}

interface AccessibleLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  currentUser?: {
    name: string;
    avatar?: string;
  };
  onNavigate?: (href: string) => void;
}

export const AccessibleLayout: React.FC<AccessibleLayoutProps> = ({
  children,
  navigation,
  currentUser,
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { announce } = useAnnounce();
  const { moveFocusToContent, moveFocusToHeading } = useFocusManagement();
  const mainContentRef = useRef<HTMLElement>(null);

  // Raccourcis clavier WCAG
  useKeyboardShortcuts({
    // Alt + M : Aller au contenu principal
    'alt+m': moveFocusToContent,
    // Alt + N : Aller à la navigation
    'alt+n': () => {
      const nav = document.getElementById('main-navigation');
      if (nav) {
        const firstLink = nav.querySelector('a, button') as HTMLElement;
        firstLink?.focus();
      }
    },
    // Alt + H : Aller au titre principal
    'alt+h': () => moveFocusToHeading(1),
    // Alt + S : Aller à la recherche
    'alt+s': () => {
      const searchInput = document.getElementById('search-input');
      searchInput?.focus();
    }
  });

  // Annoncer les changements de page
  useEffect(() => {
    const currentItem = navigation.find(item => item.href === location.pathname);
    if (currentItem) {
      announce(`Navigation vers ${currentItem.label}`, 'polite');
      
      // Focus sur le contenu principal après navigation
      setTimeout(() => {
        moveFocusToContent();
      }, 100);
    }
  }, [location.pathname, navigation, announce, moveFocusToContent]);

  const handleNavigation = (href: string, label: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      navigate(href);
    }
    announce(`Navigation vers ${label}`, 'polite');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Links */}
      <div className="sr-only focus-within:not-sr-only">
        <SkipLink href="#main-content">
          Aller au contenu principal
        </SkipLink>
        <SkipLink href="#main-navigation" className="left-48">
          Aller à la navigation
        </SkipLink>
        <SkipLink href="#search-input" className="left-96">
          Aller à la recherche
        </SkipLink>
      </div>

      {/* Header avec navigation */}
      <header 
        role="banner" 
        className="bg-white shadow-sm border-b border-gray-200"
        aria-label="En-tête principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <AccessibleLink
                href="/"
                ariaLabel="MyFitHero - Accueil"
                className="text-2xl font-bold text-blue-600 no-underline hover:text-blue-800"
              >
                🏋️ MyFitHero
              </AccessibleLink>
            </div>

            {/* Navigation principale */}
            <nav 
              id="main-navigation"
              role="navigation" 
              aria-label="Navigation principale"
              className="hidden md:flex space-x-1"
            >
              <ul role="menubar" className="flex space-x-1">
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.href;
                  return (
                    <li key={item.id} role="none">
                      <AccessibleButton
                        variant={isCurrent ? 'primary' : 'ghost'}
                        role="menuitem"
                        ariaLabel={item.ariaLabel || item.label}
                        ariaPressed={isCurrent}
                        onClick={() => handleNavigation(item.href, item.label)}
                        className={cn(
                          "relative px-3 py-2 text-sm font-medium transition-colors",
                          isCurrent && "bg-blue-100 text-blue-900"
                        )}
                      >
                        {item.icon && (
                          <span className="mr-2" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                        {item.badge && item.badge > 0 && (
                          <span 
                            className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            aria-label={`${item.badge} nouveaux éléments`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="sr-only">(page actuelle)</span>
                        )}
                      </AccessibleButton>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Zone utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Recherche */}
              <div className="relative">
                <label htmlFor="search-input" className="sr-only">
                  Rechercher dans MyFitHero
                </label>
                <input
                  id="search-input"
                  type="search"
                  placeholder="Rechercher..."
                  className="
                    w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder-gray-500
                  "
                  aria-describedby="search-help"
                />
                <div 
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div id="search-help" className="sr-only">
                  Utilisez Alt+S pour accéder rapidement à la recherche
                </div>
              </div>

              {/* Menu utilisateur */}
              {currentUser && (
                <div className="relative">
                  <AccessibleButton
                    variant="ghost"
                    ariaLabel={`Menu utilisateur pour ${currentUser.name}`}
                    ariaExpanded={false}
                    ariaControls="user-menu"
                    className="flex items-center space-x-2 p-2"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt=""
                        className="h-8 w-8 rounded-full"
                        aria-hidden="true"
                      />
                    ) : (
                      <div 
                        className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                        aria-hidden="true"
                      >
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {currentUser.name}
                    </span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </AccessibleButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden border-t border-gray-200">
          <nav 
            role="navigation" 
            aria-label="Navigation mobile"
            className="px-4 py-2"
          >
            <ul className="flex space-x-1 overflow-x-auto">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href;
                return (
                  <li key={`mobile-${item.id}`} role="none">
                    <AccessibleButton
                      variant={isCurrent ? 'primary' : 'ghost'}
                      size="sm"
                      role="menuitem"
                      ariaLabel={item.ariaLabel || item.label}
                      ariaPressed={isCurrent}
                      onClick={() => handleNavigation(item.href, item.label)}
                      className="whitespace-nowrap"
                    >
                      {item.icon && (
                        <span className="mr-1" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                      {isCurrent && (
                        <span className="sr-only">(page actuelle)</span>
                      )}
                    </AccessibleButton>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main 
        ref={mainContentRef}
        id="main-content"
        role="main"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
        aria-label="Contenu principal"
      >
        {children}
      </main>

      {/* Région d'annonces pour les lecteurs d'écran */}
      <div
        id="announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Aide aux raccourcis clavier */}
      <div 
        id="keyboard-shortcuts-help" 
        className="sr-only"
        role="region"
        aria-label="Aide aux raccourcis clavier"
      >
        <h2>Raccourcis clavier disponibles :</h2>
        <ul>
          <li>Alt + M : Aller au contenu principal</li>
          <li>Alt + N : Aller à la navigation</li>
          <li>Alt + H : Aller au titre principal</li>
          <li>Alt + S : Aller à la recherche</li>
        </ul>
      </div>
    </div>
  );
};