import { useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Transicion de pagina con will-change temporal:
 * se activa al montar y se limpia en animationend (libera capa compositor).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const onAnimEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    e.currentTarget.style.willChange = 'auto';
  }, []);

  return (
    <div
      key={pathname}
      className="eqg-page eqg-page-in"
      style={{ willChange: 'opacity, transform' }}
      onAnimationEnd={onAnimEnd}
    >
      {children}
    </div>
  );
}
