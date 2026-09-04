const VERSION = 'v2';
const STATIC_CACHE = `enquegasto-static-${VERSION}`;
const PAGES_CACHE = `enquegasto-pages-${VERSION}`;
const ASSETS_CACHE = `enquegasto-assets-${VERSION}`;
const PRECACHE_URLS = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await Promise.allSettled(PRECACHE_URLS.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
      } catch {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const allowed = new Set([STATIC_CACHE, PAGES_CACHE, ASSETS_CACHE]);
    await Promise.all(keys.filter((k) => !allowed.has(k)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api')) return;
  event.respondWith(fetch(request).catch(() => caches.match(request).then((c) => c || caches.match('/offline.html'))));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
