const CACHE = 'kiuwp-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './js/main.js',
  './js/parser.js',
  './js/formatter.js',
  './js/config.js',
  './js/airports.js',
  './favicon.ico',
  './favicon.svg',
  './favicon_32.png',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
