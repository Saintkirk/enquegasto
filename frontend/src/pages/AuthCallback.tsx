import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const error = params.get('message');

    if (error && !accessToken) {
      navigate('/login', { state: { error } });
      return;
    }

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [params, navigate, setUser]);

  return <LoadingScreen message="Completando inicio de sesión…" />;
}
