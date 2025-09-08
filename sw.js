const CACHE = 'mealreel-v2';
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const ASSETS = [`${BASE}/`, `${BASE}/index.html`, `${BASE}/manifest.webmanifest`, `${BASE}/share.html`, `${BASE}/js/app.js`];
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
});
self.addEventListener('activate', e => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (e.request.method !== 'GET') return;
    if (url.origin === location.origin || url.hostname === 'img.youtube.com') {
        e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
            return resp;
        })));
    }
});
