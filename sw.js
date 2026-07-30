// Service Worker Transparente - Solo para permitir instalación PWA
const CACHE_NAME = 'escala-online-v1';

self.addEventListener('install', event => {
  // Se instala al instante sin descargar archivos extra
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName); // Borra cualquier rastro de cachés viejos
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Deja pasar TODO directo a internet. Cero bloqueos.
  event.respondWith(fetch(event.request));
});
