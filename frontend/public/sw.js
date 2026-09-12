/** SW v5 — network-first + limpia caches de UI vieja con footer */
const VERSION = 'v5';
const STATIC_CACHE = `enquegasto-static-${VERSION}`;
const RUNTIME_CACHE = `enquegasto-runtime-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api')) return;

  // Siempre red primero para HTML y bundles
  event.respondWith(
    fetch(request)
      .then((res) => res)
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match('/offline.html');
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHES') {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
  }
});
