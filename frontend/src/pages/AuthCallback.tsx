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
    const accessToken = params.get('accessToken');
    const error = params.get('message');

    if (error && !accessToken) {
      navigate(`/login?message=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!accessToken) {
      navigate('/login?message=' + encodeURIComponent('No recibimos el token de Google/Apple'), {
        replace: true,
      });
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    setStatus('Cargando tu perfil…');

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        navigate(
          '/login?message=' +
            encodeURIComponent('Sesión iniciada, pero no pudimos cargar tu perfil. Intenta de nuevo.'),
          { replace: true }
        );
      });
  }, [params, navigate, setUser]);

  return <LoadingScreen message={status} />;
}
