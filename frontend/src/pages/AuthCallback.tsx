import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState('Completando inicio de sesión…');

  useEffect(() => {
    let cancelled = false;

    const goHome = (user: { liquidSalary?: number | null }) => {
      if (user.liquidSalary == null || user.liquidSalary <= 0) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    };

    const run = async () => {
      const accessToken = params.get('accessToken');
      const error = params.get('message');

      if (error && !accessToken) {
        navigate(`/login?message=${encodeURIComponent(error)}`, { replace: true });
        return;
      }

      if (!accessToken) {
        navigate(
          '/login?message=' + encodeURIComponent('No recibimos el token de Google/Apple'),
          { replace: true }
        );
        return;
      }

      localStorage.setItem('accessToken', accessToken);
      setStatus('Cargando tu perfil…');

      try {
        const res = await api.get('/auth/me');
        if (cancelled) return;
        setUser(res.data.user);
        goHome(res.data.user);
      } catch (err) {
        console.error('AuthCallback /auth/me failed', err);
        if (cancelled) return;
        try {
          await new Promise((r) => setTimeout(r, 800));
          const res2 = await api.get('/auth/me');
          if (cancelled) return;
          setUser(res2.data.user);
          goHome(res2.data.user);
          return;
        } catch {
          localStorage.removeItem('accessToken');
          navigate(
            '/login?message=' +
              encodeURIComponent(
                'Sesión iniciada, pero no pudimos cargar tu perfil. Revisa VITE_API_URL / API.'
              ),
            { replace: true }
          );
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [params, navigate, setUser]);

  return <LoadingScreen message={status} />;
}
