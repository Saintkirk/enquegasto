/**
 * Onboarding / Bienvenida — primer ingreso (informe §6.2)
 * Usuario ingresa sueldo líquido + horas de pega (ref. Chile 180 h).
 */
import { useState, FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_HOURS = 180;

function formatClp(n: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n);
}

function parseClpInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function Onboarding() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [salaryRaw, setSalaryRaw] = useState('');
  const [hours, setHours] = useState(String(DEFAULT_HOURS));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const salary = useMemo(() => parseClpInput(salaryRaw), [salaryRaw]);
  const hoursNum = useMemo(() => {
    const n = Number(String(hours).replace(',', '.'));
    return Number.isFinite(n) ? n : DEFAULT_HOURS;
  }, [hours]);

  const hourlyRate =
    salary && hoursNum > 0 ? Math.round(salary / hoursNum) : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!salary || salary < 150_000) {
      setError('Ingresa un sueldo líquido válido (mínimo $150.000).');
      return;
    }
    if (hoursNum < 40 || hoursNum > 400) {
      setError('Las horas de pega mensuales deben estar entre 40 y 400.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ liquidSalary: salary });
      try {
        localStorage.setItem(
          `eqg_work_hours_${user?.id || 'anon'}`,
          String(hoursNum)
        );
      } catch {
        /* ignore */
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'No pudimos guardar. Intenta de nuevo.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#f6f4f1] text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225,29,72,0.12), transparent), radial-gradient(circle at 90% 80%, rgba(15,23,42,0.04), transparent)',
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center px-5 py-10 sm:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-2xl shadow-lg shadow-rose-600/25">
            🇨🇱
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 sm:text-4xl">
            ¡Bienvenido
            {user?.name ? (
              <>
                , <span className="text-rose-600">{user.name.split(' ')[0]}</span>
              </>
            ) : null}
            !
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">
            Para que no te preguntes en qué gasté mi plata a fin de mes.
            Calibremos tus métricas con tu sueldo líquido.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8"
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Sueldo líquido mensual
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              El que te deposita la pega, sin cotizaciones ni impuestos
            </span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="850.000"
                value={salaryRaw}
                onChange={(e) => setSalaryRaw(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-8 pr-4 text-lg font-semibold tracking-tight text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                required
              />
            </div>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-800">
              Horas de pega al mes
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Promedio Chile ≈ 180 h (ajústalo si haces turnos o part-time)
            </span>
            <input
              type="number"
              min={40}
              max={400}
              step={1}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-lg font-semibold text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
            />
          </label>

          {hourlyRate != null && (
            <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-rose-700/80">
                Valor de tu hora
              </p>
              <p className="mt-0.5 text-xl font-bold tracking-tight text-rose-800">
                {formatClp(hourlyRate)}
                <span className="ml-1 text-sm font-medium text-rose-600/80">
                  / hora
                </span>
              </p>
              <p className="mt-1 text-xs leading-snug text-rose-700/70">
                Cada suscripción se mostrará en plata y en horas de tu pega.
              </p>
            </div>
          )}

          {error && (
            <p
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-rose-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Comenzar'}
          </button>

          <button
            type="button"
            onClick={() => logout().then(() => navigate('/login', { replace: true }))}
            className="mt-3 w-full py-2 text-center text-sm text-slate-500 transition hover:text-slate-800"
          >
            Cerrar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Tus datos quedan en tu cuenta · formato CLP · Chile 🇨🇱
        </p>
      </div>
    </div>
  );
}
