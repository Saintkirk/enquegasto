import { LazyMotion, domAnimation, m, useReducedMotion } from '../lib/motion';
import { staggerContainer, staggerItem } from '../lib/motion';

/**
 * Wrapper de grilla de categorias con stagger Framer Motion.
 * Si reduced-motion: render estatico (mismo markup).
 */
export function MotionCategoryGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className={className} variants={staggerContainer} initial="initial" animate="animate">
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function MotionCategoryItem({
  children,
  className,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <button type={type} className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <m.button
      type={type}
      className={className}
      onClick={onClick}
      variants={staggerItem}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </m.button>
  );
}
