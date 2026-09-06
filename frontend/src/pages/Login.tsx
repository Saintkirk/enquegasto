import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No pudimos iniciar sesión. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[#faf9f8]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(225,29,72,0.11), transparent 55%), radial-gradient(ellipse 40% 35% at 100% 100%, rgba(225,29,72,0.05), transparent 45%)',
        }}
      />
      <div className="eqg-grain pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-[1.5rem] border border-rose-950/5 bg-rose-950/[0.03] p-1.5 shadow-[0_16px_40px_-18px_rgba(225,29,72,0.4)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-br from-rose-500 to-rose-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
              <span className="text-2xl font-semibold text-white">$</span>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-slate-900">
            EnQué<span className="text-rose-600">Gasto</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-slate-500">
            Para que no te preguntes en qué gasté mi plata a fin de mes
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-900/5 bg-slate-900/[0.03] p-1.5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)]">
          <div className="rounded-[calc(1.75rem-0.375rem)] bg-white/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-7">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Bienvenido de nuevo</p>
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200/80 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Correo</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="tu@correo.cl" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
              </div>
              <button type="submit" disabled={loading} className="group mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.55)] transition-all hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50">
                {loading ? 'Entrando…' : 'Entrar'}
                {!loading && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 group-hover:translate-x-0.5">→</span>}
              </button>
            </form>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">o continúa con</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="space-y-2.5">
              <a href={`${API}/api/auth/google`} className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]">Continuar con Google</a>
              <a href={`${API}/api/auth/apple`} className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]">Continuar con Apple</a>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-500">Regístrate</Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Chile · CLP · Datos protegidos</p>
      </div>
    </div>
  );
}
