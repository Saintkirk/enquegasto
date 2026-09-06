import { useEffect, useRef, useCallback } from 'react';

type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type IdleCallback = (deadline: IdleDeadlineLike) => void;
type IdleOptions = { timeout?: number };

function scheduleIdle(cb: IdleCallback, options?: IdleOptions): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(cb, options);
  }
  const timeout = options?.timeout ?? 2000;
  return window.setTimeout(() => {
    const start = Date.now();
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 16 - (Date.now() - start)),
    });
  }, Math.min(timeout, 64)) as unknown as number;
}

function cancelIdle(id: number) {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

export function useIdleEffect(
  fn: (deadline: IdleDeadlineLike) => void,
  deps: unknown[] = [],
  options: IdleOptions & { enabled?: boolean } = {}
) {
  const { timeout = 2500, enabled = true } = options;
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const id = scheduleIdle(
      (deadline) => {
        if (!cancelled) fnRef.current(deadline);
      },
      { timeout }
    );
    return () => {
      cancelled = true;
      cancelIdle(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, timeout, ...deps]);
}

export function useIdleScheduler(defaultTimeout = 2000) {
  const idsRef = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      idsRef.current.forEach(cancelIdle);
      idsRef.current = [];
    };
  }, []);
  return useCallback(
    (fn: () => void, timeout = defaultTimeout) => {
      const id = scheduleIdle(() => {
        idsRef.current = idsRef.current.filter((x) => x !== id);
        fn();
      }, { timeout });
      idsRef.current.push(id);
      return () => cancelIdle(id);
    },
    [defaultTimeout]
  );
}

export function runWhenIdle(fn: () => void, timeout = 2500): () => void {
  const id = scheduleIdle(() => fn(), { timeout });
  return () => cancelIdle(id);
}

export { scheduleIdle, cancelIdle };
export type { IdleDeadlineLike };
