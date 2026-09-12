import { useLocation } from 'react-router-dom';

/**
 * Transicion de pagina: solo CSS + key=pathname.
 * Sin double-rAF ni estado extra (menos re-renders).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="eqg-page eqg-page-in">
      {children}
    </div>
  );
}
