import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

/** requestAnimationFrame helpers — EnQuéGasto */

export function useRafState<T>(
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initial);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<SetStateAction<T> | null>(null);

  const setRafState = useCallback((value: SetStateAction<T>) => {
    pendingRef.current = value;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (pending !== null) setState(pending);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [state, setRafState];
}

export function useRafCallback<T extends unknown[]>(
  fn: (...args: T) => void
): (...args: T) => void {
  const fnRef = useRef(fn);
  const rafRef = useRef<number | null>(null);
  const argsRef = useRef<T | null>(null);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return useCallback((...args: T) => {
    argsRef.current = args;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const latest = argsRef.current;
      argsRef.current = null;
      if (latest) fnRef.current(...latest);
    });
  }, []);
}

export function useRafMount(effect: () => void, double = true) {
  useEffect(() => {
    let id1 = 0;
    let id2 = 0;
    let cancelled = false;
    id1 = requestAnimationFrame(() => {
      if (cancelled) return;
      if (!double) {
        effect();
        return;
      }
      id2 = requestAnimationFrame(() => {
        if (!cancelled) effect();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [effect, double]);
}
