// Cache version – bump to force updates
const CACHE = 'mealreel-v1';
// Detect the subfolder base (/meal-reel)
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.webmanifest`
];

// Install: pre-cache shell
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

// Activate: cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
      caches.keys().then((keys) =>
          Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      )
  );
});

// Fetch: cache-first for same-origin + img.youtube.com thumbs
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Only handle GET
  if (e.request.method !== 'GET') return;

  // Cache thumbnails and same-origin files
  if (url.origin === location.origin || url.hostname === 'img.youtube.com') {
    e.respondWith(
        caches.match(e.request).then((hit) => {
          if (hit) return hit;
          return fetch(e.request).then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return resp;
          });
        })
    );
  }
});
