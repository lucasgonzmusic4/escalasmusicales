const CACHE_NAME = 'escalas-guitarra-v2';

// Guardamos archivos locales y la librería de alertas
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Error guardando en caché:', err);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  // REGLA DE ORO: Ignorar peticiones de login (POST) y conexiones a Google Scripts
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
    return; // Dejamos que el navegador haga la conexión con internet sin intervenir
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché (offline), lo usa. Si no, va a internet.
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
