/**
 * Framer Motion acotado (taste-skill + perf):
 * - LazyMotion + domAnimation → ~chunk más chico que el full API
 * - Respetar prefers-reduced-motion
 * - Solo opacity / transform
 */
import { domAnimation } from 'framer-motion';

export { motion, m, AnimatePresence, LazyMotion, useReducedMotion } from 'framer-motion';
export { domAnimation };

/** Curva marca EnQuéGasto (misma que --eqg-ease-out) */
export const eqgEase = [0.22, 1, 0.36, 1] as const;

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: eqgEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.16, ease: eqgEase },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: eqgEase },
  },
};

export const sheetVariants = {
  initial: { opacity: 0.9, y: '12%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: eqgEase },
  },
  exit: {
    opacity: 0,
    y: '8%',
    transition: { duration: 0.2, ease: eqgEase },
  },
};

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
