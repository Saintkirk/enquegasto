import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [liquidSalary, setLiquidSalary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Reingresa la misma contraseña.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('La contraseña debe incluir al menos una letra y un número.');
      return;
    }

    setLoading(true);
    try {
      const salary = liquidSalary
        ? Number(liquidSalary.replace(/\./g, '').replace(',', ''))
        : undefined;
      await register(email, password, name || undefined, salary);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; error?: string; errors?: unknown } } })
        ?.response?.data;
      const msg =
        data?.message ||
        data?.error ||
        'No pudimos crear tu cuenta. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute inset-0 bg-[#faf9f8]" />
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-5 text-center sm:mb-8">
          <div className="mx-auto mb-3 inline-flex rounded-[1.25rem] border border-rose-950/5 bg-rose-950/[0.03] p-1.5 sm:mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-[calc(1.25rem-0.375rem)] bg-gradient-to-br from-rose-500 to-rose-700 sm:h-14 sm:w-14">
              <span className="text-xl font-semibold text-white sm:text-2xl">$</span>
            </div>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Crear cuenta
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">
            Solo necesitas tu sueldo líquido. El resto lo calculamos nosotros.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-900/5 bg-slate-900/[0.03] p-1.5 sm:rounded-[1.75rem]">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-white/95 p-5 sm:p-7">
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Field label="Nombre" value={name} onChange={setName} placeholder="Camila" autoComplete="name" />
              <Field
                label="Correo"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="tu@correo.cl"
                required
                autoComplete="email"
              />
              <Field
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                required
                autoComplete="new-password"
                hint="Mín. 8 caracteres, con letra y número"
              />
              <Field
                label="Reingresa tu contraseña"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                autoComplete="new-password"
              />
              <Field
                label="Sueldo líquido (CLP)"
                value={liquidSalary}
                onChange={setLiquidSalary}
                placeholder="850000"
                hint="Opcional. Mínimo $150.000."
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.55)] hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Creando…' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold text-rose-600">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
      />
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
