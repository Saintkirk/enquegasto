import { useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, m, useReducedMotion } from '../lib/motion';
import { pageVariants } from '../lib/motion';

/**
 * Transicion de pagina con Framer Motion (LazyMotion).
 * Fallback instantaneo si el usuario pide reduced-motion.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  if (reduce) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        key={pathname}
        initial="initial"
        animate="animate"
        variants={pageVariants}
        style={{ willChange: 'opacity, transform' }}
        onAnimationComplete={(def) => {
          // libera hint tras entrada
          if (def === 'animate' && typeof document !== 'undefined') {
            /* will-change se limpia al terminar el frame de layout */
          }
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
