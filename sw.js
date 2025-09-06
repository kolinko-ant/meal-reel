const CACHE = 'mealreel-client-v1';
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const ASSETS = [ `${BASE}/`, `${BASE}/index.html`, `${BASE}/manifest.webmanifest` ];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin === location.origin || url.hostname === 'img.youtube.com') {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return resp;
    })));
  }
});
