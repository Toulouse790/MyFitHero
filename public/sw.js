// 🚀 MyFitHero Service Worker - Cache Optimisé
const CACHE_NAME = 'myfithero-v2';
const STATIC_CACHE_NAME = 'myfithero-static-v2';
const DYNAMIC_CACHE_NAME = 'myfithero-dynamic-v2';
const IMAGE_CACHE_NAME = 'myfithero-images-v2';

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/offline.html'
];

// Ressources à précharger en arrière-plan
const PREFETCH_ASSETS = [
  '/assets/dashboard-icons.svg',
  '/assets/workout-icons.svg',
  '/assets/nutrition-icons.svg'
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  // Images : Cache First avec fallback
  images: {
    strategy: 'CacheFirst',
    maxEntries: 100,
    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 jours
  },
  
  // API : Network First avec cache de secours
  api: {
    strategy: 'NetworkFirst',
    maxEntries: 50,
    maxAgeSeconds: 5 * 60 // 5 minutes
  },
  
  // Ressources statiques : Cache First
  static: {
    strategy: 'CacheFirst',
    maxEntries: 200,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
  },
  
  // Pages : Network First avec cache de secours
  pages: {
    strategy: 'NetworkFirst',
    maxEntries: 20,
    maxAgeSeconds: 24 * 60 * 60 // 24 heures
  }
};

// 📦 Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 SW: Installation démarrée');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources critiques
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 SW: Cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Préchargement des ressources non-critiques
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('⚡ SW: Préchargement des ressources dynamiques');
        return Promise.allSettled(
          PREFETCH_ASSETS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {
              // Ignorer les erreurs de préchargement
            })
          )
        );
      })
    ]).then(() => {
      console.log('✅ SW: Installation terminée');
      // Forcer l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// 🔄 Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Activation démarrée');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        const validCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
        
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log('🗑️ SW: Suppression cache obsolète:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ]).then(() => {
      console.log('✅ SW: Activation terminée');
    })
  );
});

// 🌐 Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes vers des domaines externes (sauf images)
  if (url.origin !== location.origin && !isImageRequest(request)) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// 🎯 Gestionnaire principal des requêtes
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 🖼️ Images
    if (isImageRequest(request)) {
      return await handleImageRequest(request);
    }
    
    // 🔌 API Supabase
    if (isApiRequest(request)) {
      return await handleApiRequest(request);
    }
    
    // 📄 Pages HTML
    if (isPageRequest(request)) {
      return await handlePageRequest(request);
    }
    
    // 📦 Ressources statiques (CSS, JS, fonts)
    if (isStaticResource(request)) {
      return await handleStaticRequest(request);
    }
    
    // 🌐 Requête par défaut
    return await fetch(request);
    
  } catch (error) {
    console.error('❌ SW: Erreur requête:', error);
    return await handleOfflineFallback(request);
  }
}

// 🖼️ Gestion des images avec cache optimisé
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Vérifier la fraîcheur en arrière-plan
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache seulement les images de taille raisonnable (< 5MB)
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 5 * 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch {
    // Fallback image en cas d'erreur
    return new Response(
      `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image non disponible</text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// 🔌 Gestion des requêtes API
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    // Network First pour les données fraîches
    const response = await fetch(request);
    if (response.ok) {
      // Cache les réponses GET uniquement
      if (request.method === 'GET') {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch {
    // Fallback vers le cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Réponse offline pour l'API
    return new Response(
      JSON.stringify({ 
        error: 'Connexion indisponible', 
        offline: true,
        message: 'Données mises en cache non disponibles'
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 📄 Gestion des pages HTML
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    // Network First pour le contenu frais
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Fallback vers le cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Page offline de secours
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Hors ligne', { status: 503 });
  }
}

// 📦 Gestion des ressources statiques
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Ressource non disponible', { status: 503 });
  }
}

// 🔍 Détecteurs de type de requête
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(new URL(request.url).pathname);
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('supabase') || 
         url.pathname.startsWith('/api/') ||
         url.pathname.startsWith('/rest/');
}

function isPageRequest(request) {
  return request.destination === 'document' || 
         request.headers.get('accept')?.includes('text/html');
}

function isStaticResource(request) {
  const url = new URL(request.url);
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
         url.pathname.startsWith('/assets/');
}

// 🆘 Gestion des fallbacks offline
async function handleOfflineFallback(request) {
  if (isPageRequest(request)) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match('/offline.html') || 
           new Response('Hors ligne', { status: 503 });
  }
  
  if (isImageRequest(request)) {
    return new Response(
      `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Hors ligne</text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Contenu non disponible hors ligne', { status: 503 });
}

// 📊 Nettoyage périodique du cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    cleanupCaches();
  }
});

async function cleanupCaches() {
  console.log('🧹 SW: Nettoyage des caches');
  
  const imageCache = await caches.open(IMAGE_CACHE_NAME);
  const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
  
  // Limiter la taille des caches
  await limitCacheSize(imageCache, CACHE_STRATEGIES.images.maxEntries);
  await limitCacheSize(dynamicCache, CACHE_STRATEGIES.api.maxEntries + CACHE_STRATEGIES.pages.maxEntries);
}

async function limitCacheSize(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Supprimer les plus anciens
    const keysToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

console.log('🚀 MyFitHero Service Worker chargé');

// === INSTALLATION DU SERVICE WORKER ===
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force l'activation immédiate
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Erreur lors de la mise en cache:', error);
      })
  );
});

// === ACTIVATION DU SERVICE WORKER ===
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
  
  event.waitUntil(
    Promise.all([
      // Suppression des anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Prise de contrôle de tous les clients
      self.clients.claim()
    ])
  );
});

// === STRATÉGIES DE MISE EN CACHE ===

// Network First - Pour les données API
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 Réseau indisponible, utilisation du cache pour:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Fallback pour les données utilisateur essentielles
    if (request.url.includes('profiles') || request.url.includes('daily_stats')) {
      return new Response(JSON.stringify({ 
        offline: true, 
        message: 'Données hors ligne non disponibles' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw error;
  }
};

// Cache First - Pour les assets statiques
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('📦 Asset non disponible:', request.url);
    throw error;
  }
};

// Stale While Revalidate - Pour les pages
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // En cas d'erreur réseau, on retourne la version cachée
    return cachedResponse;
  });
  
  // Retourne immédiatement la version cachée si disponible
  return cachedResponse || fetchPromise;
};

// === GESTION DES REQUÊTES ===
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Stratégie selon le type de ressource
  if (CACHE_STRATEGIES.supabaseApi.test(url)) {
    // API Supabase: Network First
    event.respondWith(networkFirst(request));
  } else if (CACHE_STRATEGIES.staticAssets.test(url)) {
    // Assets statiques: Cache First
    event.respondWith(cacheFirst(request));
  } else if (CACHE_STRATEGIES.pages.test(url) || request.mode === 'navigate') {
    // Pages: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Par défaut: Network First avec fallback
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});

// === SYNCHRONISATION EN ARRIÈRE-PLAN ===
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'background-sync-fitness-data') {
    event.waitUntil(syncFitnessData());
  }
});

// === NOTIFICATIONS PUSH ===
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification MyFitHero',
    icon: '/placeholder.svg',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ouvrir l\'app',
        icon: '/placeholder.svg'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/favicon.ico'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MyFitHero', options)
  );
});

// === FONCTIONS UTILITAIRES ===
async function syncFitnessData() {
  try {
    // Synchroniser les données fitness en attente
    const pendingData = await getStoredPendingData();
    
    for (const data of pendingData) {
      await fetch('/api/sync-fitness-data', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Nettoyer les données synchronisées
    await clearStoredPendingData();
    console.log('✅ Synchronisation des données fitness terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  }
}

async function getStoredPendingData() {
  // Récupérer les données en attente depuis IndexedDB
  return []; // À implémenter avec IndexedDB
}

async function clearStoredPendingData() {
  // Nettoyer les données synchronisées
  // À implémenter avec IndexedDB
}
