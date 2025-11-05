const CACHE_NAME = 'camera-pwa-v3';
const FILES_TO_CACHE = [
  'practicacamara/',
  'practicacamara/index.html',
  'practicacamara/app.js',
  'practicacamara/manifest.json',
  'practicacamara/icon-193.png',
  'practicacamara/icon-513.png'
];

// Instalar y guardar archivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
