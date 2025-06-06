const CACHE_NAME = 'gs-mega-hair-studio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/*',
];

/* eslint-disable no-restricted-globals */
addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
/* eslint-enable no-restricted-globals */