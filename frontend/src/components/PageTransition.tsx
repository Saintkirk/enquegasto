import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

/**
 * Transicion de pagina ligera (solo opacity + translateY).
 * Se remonta con key=pathname para re-disparar la animacion CSS.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      className={visible ? 'eqg-page eqg-page-in' : 'eqg-page'}
    >
      {children}
    </div>
  );
}
