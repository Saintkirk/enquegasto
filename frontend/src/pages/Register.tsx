import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [liquidSalary, setLiquidSalary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const salary = liquidSalary
        ? Number(liquidSalary.replace(/\./g, '').replace(',', ''))
        : undefined;
      await register(email, password, name || undefined, salary);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No pudimos crear tu cuenta. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[#faf9f8]" />
      <div className="eqg-grain pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-[1.5rem] border border-rose-950/5 bg-rose-950/[0.03] p-1.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-br from-rose-500 to-rose-700">
              <span className="text-2xl font-semibold text-white">$</span>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-slate-500">Solo necesitas tu sueldo líquido. El resto lo calculamos nosotros.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-900/5 bg-slate-900/[0.03] p-1.5">
          <div className="rounded-[calc(1.75rem-0.375rem)] bg-white/90 p-6 sm:p-7">
            {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Field label="Nombre" value={name} onChange={setName} placeholder="Camila" autoComplete="name" />
              <Field label="Correo" type="email" value={email} onChange={setEmail} placeholder="tu@correo.cl" required autoComplete="email" />
              <Field label="Contraseña" type="password" value={password} onChange={setPassword} required autoComplete="new-password" />
              <Field label="Sueldo líquido (CLP)" value={liquidSalary} onChange={setLiquidSalary} placeholder="850000" hint="Opcional. Mínimo $150.000." />
              <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.55)] hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50">
                {loading ? 'Creando…' : 'Crear cuenta'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-rose-600">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text', placeholder, required, autoComplete, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean; autoComplete?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} autoComplete={autoComplete} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
