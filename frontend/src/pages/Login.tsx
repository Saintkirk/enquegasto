import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrl } from '../api/client';

const API = getApiBaseUrl();

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQuery = params.get('message');
    const fromState = (location.state as { error?: string } | null)?.error;
    if (fromQuery) {
      try {
        setError(decodeURIComponent(fromQuery));
      } catch {
        setError(fromQuery);
      }
    } else if (fromState) {
      setError(fromState);
    }
  }, [params, location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; error?: string } } })?.response
        ?.data;
      setError(
        data?.message || data?.error || 'No pudimos iniciar sesion. Revisa correo y contrasena.'
      );
    } finally {
      setLoading(false);
    }
  };

  const googleUrl = API + '/api/auth/google';
  const appleUrl = API + '/api/auth/apple';

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute inset-0 bg-[#f7f6f4]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 50% -8%, rgba(225,29,72,0.10), transparent 58%)',
        }}
      />
      <div className="eqg-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="eqg-enter relative z-10 w-full max-w-[400px]">
        <div className="mb-6 text-center sm:mb-9">
          <div className="eqg-shell mx-auto mb-4 inline-flex sm:mb-5">
            <div className="eqg-shell-inner flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
              <div className="flex h-full w-full items-center justify-center rounded-[calc(1.35rem-0.15rem)] bg-gradient-to-br from-rose-500 to-rose-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <span className="text-2xl font-semibold text-white sm:text-3xl">$</span>
              </div>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
            EnQué<span className="text-rose-600">Gasto</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-slate-500">
            Para que no te preguntes en que gaste mi plata a fin de mes
          </p>
        </div>

        <div className="eqg-shell">
          <div className="eqg-shell-inner p-5 sm:p-7">
            <p className="eqg-label mb-5">Bienvenido de nuevo</p>

            {error && (
              <div className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Correo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tu@correo.cl"
                  className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/40 px-4 py-3 text-sm outline-none transition-[border-color,box-shadow,background] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Contrasena</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/40 px-4 py-3 text-sm outline-none transition-[border-color,box-shadow,background] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="eqg-press mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_-10px_rgba(225,29,72,0.55)] transition-colors hover:bg-rose-500 disabled:opacity-50"
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200/80" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">o</span>
              <div className="h-px flex-1 bg-slate-200/80" />
            </div>

            <div className="space-y-2.5">
              <a
                href={googleUrl}
                className="eqg-press flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <GoogleIcon />
                Continuar con Google
              </a>
              <a
                href={appleUrl}
                className="eqg-press flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <AppleIcon />
                Continuar con Apple
              </a>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-500">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.71z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.45 3.57-.87.48.24 2.04.99 2.34 2.42-2.24 1.17-1.87 4.18.38 5.12-.55 1.44-1.34 2.87-3.37 5.56zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
