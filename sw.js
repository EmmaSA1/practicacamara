// Nombre del caché
const CACHE_NAME = 'camara-pwa-v1';

// Archivos que se guardarán en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json'
];

// INSTALACIÓN: Guardar archivos en caché
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
});

// ACTIVACIÓN: Limpiar versiones antiguas del caché
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activado');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// FETCH: Estrategia "Cache First"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Servir desde caché
        }

        // Si no está en caché, buscar en la red y guardar copia
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // Si no hay red ni caché, mostrar mensaje básico
        return new Response('<h1>Sin conexión</h1><p>Revisa tu conexión a internet.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
  );
});
