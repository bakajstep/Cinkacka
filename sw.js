const CACHE_NAME = 'herni-automat-v1';
const urlsToCache = [
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './rolling.mp3',
  './win.mp3',
  './ikona.jpg'
];

// Instalace SW a cacheování souborů
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivace SW a odstranění staré cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch událost: Network First strategie
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Pokud je odpověď validní, aktualizuj cache
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Pokud síť selže, vrať obsah z cache
        return caches.match(event.request);
      })
  );
});
