// Service Worker for Pargo's Chest PWA
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `pargos-chest-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for API calls (if any)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Serving from cache:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      console.log('[SW] Caching new resource:', request.url);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[SW] Fetch failed, no cache available:', error);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    throw error;
  }
}

// Network-first strategy
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Network failed, serving from cache:', request.url);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urls))
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then((cache) => cache.addAll(STATIC_ASSETS))
    );
  }
});

// Background sync for future enhancements
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-clips') {
    event.waitUntil(syncClips());
  }
});

async function syncClips() {
  // Placeholder for future sync functionality
  console.log('[SW] Syncing clips...');
}

// Push notifications for future enhancements
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Pargo\'s Chest', options)
  );
});
