/**
 * Prefetch de chunks de rutas lazy.
 * Idempotente: cada ruta solo se importa una vez.
 */

type PrefetchFn = () => Promise<unknown>;

const loaders: Record<string, PrefetchFn> = {
  '/dashboard': () => import('../pages/Dashboard'),
  '/subscriptions': () => import('../pages/Subscriptions'),
  '/zombies': () => import('../pages/Zombies'),
  '/login': () => import('../pages/Login'),
  '/register': () => import('../pages/Register'),
};

const done = new Set<string>();
const inflight = new Map<string, Promise<unknown>>();

export function prefetchRoute(path: string): void {
  const key = path.split('?')[0].replace(/\/$/, '') || '/';
  const load = loaders[key];
  if (!load || done.has(key)) return;

  let p = inflight.get(key);
  if (!p) {
    p = load()
      .then(() => {
        done.add(key);
      })
      .catch(() => {
        /* silencioso: el lazy normal reintentara al navegar */
      })
      .finally(() => {
        inflight.delete(key);
      });
    inflight.set(key, p);
  }
}

/** Prefetch de las 3 rutas privadas tras el primer paint (idle) */
export function prefetchAppRoutes(): void {
  const run = () => {
    prefetchRoute('/dashboard');
    prefetchRoute('/subscriptions');
    prefetchRoute('/zombies');
  };

  if (typeof window === 'undefined') return;

  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    ric(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 1200);
  }
}
