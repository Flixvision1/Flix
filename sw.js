const CACHE_NAME = 'flix-vision-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker & Cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch/Load from Cache with Network Fallback (Offline Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Background Sync Placeholder
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('Background syncing...');
  }
});

// Push Notifications Listener
self.addEventListener('push', event => {
  const data = event.data ? event.data.text() : 'New Notification from Flix Vision';
  event.waitUntil(
    self.registration.showNotification('Flix Vision', {
      body: data,
      icon: './launchericon-192x192.png'
    })
  );
});
