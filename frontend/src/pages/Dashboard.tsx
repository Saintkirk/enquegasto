import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardMetrics, Subscription } from '../types';
import { formatPercent, formatDateCL } from '../utils/format';
import { useIdleEffect } from '../hooks/useIdle';
import { prefetchPlatforms } from '../utils/prefetch';
import Charts from '../components/Charts';
import LoadingScreen from '../components/LoadingScreen';
import PlatformLogo from '../components/PlatformLogo';
import {
  CreditCard,
  Ghost,
  Wallet,
  Pencil,
  Check,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const HOURS_PER_MONTH = 180;

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');
  const [savingSalary, setSavingSalary] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/subscriptions/metrics/dashboard'), api.get('/subscriptions')])
      .then(([m, s]) => {
        setMetrics(m.data.metrics);
        setSubs(s.data.subscriptions || []);
      })
      .catch(() => setError('No pudimos cargar tu resumen'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useIdleEffect(
    () => {
      void prefetchPlatforms();
    },
    [],
    { enabled: !loading, timeout: 3000 }
  );

  const saveSalary = async () => {
    const value = Number(salaryInput.replace(/\./g, '').replace(',', ''));
    if (!value || value < 150000) {
      setError('Ingresa un sueldo liquido valido (minimo $150.000)');
      return;
    }
    setSavingSalary(true);
    setError('');
    try {
      await api.patch('/subscriptions/salary', { liquidSalary: value });
      await refreshUser();
      setEditingSalary(false);
      load();
    } catch {
      setError('No pudimos actualizar el sueldo');
    } finally {
      setSavingSalary(false);
    }
  };

  const pct = metrics?.percentOfSalary ?? metrics?.percentageOfSalary ?? 0;
  const totalMonthly = metrics?.totalMonthly ?? 0;
  const liquid = metrics?.liquidSalary ?? user?.liquidSalary ?? null;

  const hoursOfWork = useMemo(() => {
    if (!liquid || liquid <= 0 || totalMonthly <= 0) return 0;
    const hourly = liquid / HOURS_PER_MONTH;
    return Math.round(totalMonthly / hourly);
  }, [liquid, totalMonthly]);

  const alertClass =
    pct >= 15
      ? 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold border border-rose-200 bg-rose-50 text-rose-800'
      : pct >= 8
        ? 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold border border-amber-200 bg-amber-50 text-amber-900'
        : 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold border border-emerald-200 bg-emerald-50 text-emerald-800';

  const alertHint =
    pct >= 15 ? ' — ojo, esta alto' : pct >= 8 ? '' : ' — bajo control';

  if (loading) return <LoadingScreen fullScreen={false} message="Armando tu resumen…" />;

  const firstName = user?.name?.split(' ')[0];
  const previewSubs = subs.slice(0, 5);
  const hoursLabel = hoursOfWork > 0 ? hoursOfWork + ' h' : '—';

  return (
    <div className="relative space-y-6 pb-24 sm:space-y-8 sm:pb-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Resumen</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Hola{firstName ? ', ' + firstName : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Asi se mueve tu plata en suscripciones</p>
        </div>
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white shadow-md">
            {(firstName || user?.email || '?')[0].toUpperCase()}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
              <Wallet size={16} strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Sueldo liquido
            </span>
          </div>
          {!editingSalary && (
            <button
              type="button"
              onClick={() => {
                setSalaryInput(String(user?.liquidSalary || ''));
                setEditingSalary(true);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
              aria-label="Editar sueldo"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
        {editingSalary ? (
          <div className="flex gap-2">
            <input
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              inputMode="numeric"
              autoFocus
            />
            <button
              type="button"
              onClick={saveSalary}
              disabled={savingSalary}
              className="rounded-xl bg-rose-600 px-3 text-white"
            >
              <Check size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="font-display text-xl font-semibold currency">
              {metrics?.liquidSalaryFormatted || '—'}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Base para todos los calculos</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-3 text-white shadow-lg shadow-sky-500/25 sm:p-4">
          <div className="mb-2 flex items-center justify-between opacity-90">
            <MiniSpark />
          </div>
          <div className="font-display text-base font-bold leading-tight currency sm:text-xl">
            {metrics?.totalMonthlyFormatted || '$0'}
          </div>
          <p className="mt-1 text-[10px] font-medium opacity-90 sm:text-xs">Total Mensual</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-3 text-slate-900 shadow-lg shadow-amber-400/30 sm:p-4">
          <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/40">
            <Calendar size={14} strokeWidth={2} />
          </div>
          <div className="font-display text-base font-bold leading-tight currency sm:text-xl">
            {metrics?.totalYearlyFormatted || '$0'}
          </div>
          <p className="mt-1 text-[10px] font-medium opacity-80 sm:text-xs">Proyeccion Anual</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 text-white shadow-lg shadow-emerald-500/25 sm:p-4">
          <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Clock size={14} strokeWidth={2} />
          </div>
          <div className="font-display text-base font-bold leading-tight sm:text-xl">{hoursLabel}</div>
          <p className="mt-1 text-[10px] font-medium opacity-90 sm:text-xs">De tu pega</p>
        </div>
      </div>

      {liquid != null && totalMonthly > 0 && (
        <div className={alertClass}>
          <AlertTriangle size={18} className="shrink-0" />
          <span>
            {formatPercent(pct)} de tu sueldo en suscripciones
            {alertHint}
          </span>
        </div>
      )}

      {(metrics?.zombieCount ?? 0) > 0 && (
        <Link
          to="/zombies"
          className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 transition hover:bg-violet-100/80"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Ghost size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-violet-900">
              {metrics?.zombieCount} gasto{(metrics?.zombieCount ?? 0) !== 1 ? 's' : ''} zombie
            </p>
            <p className="text-xs text-violet-600">
              {metrics?.zombieMonthlyFormatted}/mes que casi no usas
            </p>
          </div>
        </Link>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Mis Suscripciones</h2>
          <Link to="/subscriptions" className="text-xs font-semibold text-rose-600 hover:text-rose-500">
            Ver todas
          </Link>
        </div>

        {previewSubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-10 text-center">
            <p className="font-display text-base font-semibold text-slate-800">Aun no tienes suscripciones</p>
            <p className="mt-1 text-sm text-slate-500">Agrega Netflix, Spotify y lo que pagas al mes</p>
            <button
              type="button"
              onClick={() => navigate('/subscriptions')}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={16} /> Agregar la primera
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {previewSubs.map((sub) => (
              <li key={sub.id} className="flex items-center gap-3 px-4 py-3.5">
                <PlatformLogo platform={sub.platform} size={40} priority />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{sub.name}</p>
                  <p className="text-xs text-slate-400">
                    {sub.nextBillingDate
                      ? 'Renueva: ' + formatShortDate(sub.nextBillingDate)
                      : sub.billingCycle?.toLowerCase() === 'yearly'
                        ? 'Anual'
                        : 'Mensual'}
                  </p>
                </div>
                <div className="currency shrink-0 text-sm font-semibold text-slate-900">
                  {sub.monthlyEquivalentFormatted || sub.amountFormatted}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {metrics && metrics.byCategory?.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 sm:p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Analisis por categoria
          </p>
          <Charts metrics={metrics} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/subscriptions"
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.45)]"
        >
          <CreditCard size={16} /> Ver suscripciones
        </Link>
        <Link
          to="/zombies"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          <Ghost size={16} /> Revisar zombies
        </Link>
      </div>

      <button
        type="button"
        onClick={() => navigate('/subscriptions')}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/40 active:scale-95 sm:hidden"
        aria-label="Agregar suscripcion"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit' }).format(d);
  } catch {
    return formatDateCL(iso);
  }
}

function MiniSpark() {
  return (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" aria-hidden className="opacity-90">
      <path
        d="M1 14 L8 10 L14 12 L20 6 L26 9 L32 4 L39 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
