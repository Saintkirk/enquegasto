/** Service Worker EnQuéGasto — v4
 * Network-first para HTML/JS/CSS (evita UI vieja con footer fantasma).
 * Cache solo para offline fallback.
 */
const VERSION = 'v4';
const STATIC_CACHE = `enquegasto-static-${VERSION}`;
const RUNTIME_CACHE = `enquegasto-runtime-${VERSION}`;

const PRECACHE_URLS = ['/offline.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res.ok) await cache.put(url, res);
          } catch {
            /* ignore */
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const keep = new Set([STATIC_CACHE, RUNTIME_CACHE]);
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
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

  const isNav = request.mode === 'navigate';
  const isAsset =
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|mjs|map)$/i.test(url.pathname);

  // HTML + bundles: siempre red primero (UI actualizada)
  if (isNav || isAsset) {
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok && isAsset) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, res.clone());
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          if (isNav) return caches.match('/offline.html');
          throw new Error('offline');
        })
    );
    return;
  }

  // Otros estáticos: cache-first
  event.respondWith(
    caches.match(request).then(
      (c) =>
        c ||
        fetch(request)
          .then(async (res) => {
            if (res.ok) {
              const cache = await caches.open(RUNTIME_CACHE);
              cache.put(request, res.clone());
            }
            return res;
          })
          .catch(() => caches.match('/offline.html'))
    )
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    );
  }
});
