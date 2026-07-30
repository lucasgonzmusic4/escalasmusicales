const CACHE_NAME = 'escalas-guitarra-v4';

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
      return cache.addAll(urlsToCache);
    })
  );
});

// INTERCEPCIÓN BLINDADA
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // REGLA DE PLOMO: Si no es una petición GET (ej. es un POST), 
  // O si la petición va hacia cualquier servidor externo (Google) que no sea nuestra app o SweetAlert...
  // El Service Worker se apaga y deja que el navegador trabaje directo con internet.
  if (event.request.method !== 'GET' || (url.origin !== location.origin && !url.href.includes('sweetalert2'))) {
    return; 
  }

  // Solo interceptamos y usamos caché para nuestra app visual
  event.respondWith(
    caches.match(event.request).then(response => {
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
