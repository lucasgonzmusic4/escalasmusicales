// Forzamos v3 para limpiar cualquier resto del caché maldito
const CACHE_NAME = 'escalas-guitarra-v3';

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
        console.log('Error crítico guardando en caché:', err);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ESTRATEGIA: NETWORK ONLY (Solo Internet) para login y Google Scripts
  // Si es un POST (login), una petición a Google Apps Script, o Google Fonts/CDN no cacheados.
  if (
    event.request.method !== 'GET' || 
    url.hostname === 'script.google.com' || 
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    // Respondemos directamente con fetch(internet), sin caches.match()
    event.respondWith(fetch(event.request));
    return;
  }

  // ESTRATEGIA: CACHE FIRST (Caché primero) para archivos locales de la app
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché (offline), lo usa. Si no, va a internet.
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
