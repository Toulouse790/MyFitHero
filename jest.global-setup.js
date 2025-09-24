/**
 * SETUP GLOBAL JEST - CONFIGURATION ENTREPRISE
 * Initialisation avant tous les tests
 */

// Configuration globale pour fetch - conditionné pour éviter les erreurs
if (typeof global !== 'undefined') {
  global.fetch = require('jest-fetch-mock');
}

// Configuration pour les APIs Web
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Configuration pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Configuration pour sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Configuration pour IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Configuration pour ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Configuration pour WebSocket
global.WebSocket = class WebSocket {
  constructor() {}
  send() {}
  close() {}
};

// Suppression des logs en mode test (sauf erreurs)
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();

module.exports = async () => {
  console.log('🚀 Configuration globale des tests initialisée');
};