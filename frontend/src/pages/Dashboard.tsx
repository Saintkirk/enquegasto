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
      ? 'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold border border-rose-200/80 bg-rose-50 text-rose-800 shadow-sm'
      : pct >= 8
        ? 'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold border border-amber-200/80 bg-amber-50 text-amber-900 shadow-sm'
        : 'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold border border-emerald-200/80 bg-emerald-50 text-emerald-800 shadow-sm';

  const alertHint = pct >= 15 ? ' — ojo, esta alto' : pct >= 8 ? '' : ' — bajo control';

  if (loading) return <LoadingScreen fullScreen={false} message="Armando tu resumen…" />;

  const firstName = user?.name?.split(' ')[0];
  const previewSubs = subs.slice(0, 5);
  const hoursLabel = hoursOfWork > 0 ? hoursOfWork + ' h' : '—';

  return (
    <div className="relative space-y-6 pb-24 sm:space-y-8 sm:pb-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eqg-label mb-1">Resumen</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Hola{firstName ? ', ' + firstName : ''}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">Asi se mueve tu plata en suscripciones</p>
        </div>
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-slate-200/60"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white shadow-md ring-2 ring-white">
            {(firstName || user?.email || '?')[0].toUpperCase()}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="eqg-shell">
        <div className="eqg-shell-inner p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Wallet size={16} strokeWidth={1.75} />
              </span>
              <span className="eqg-label">Sueldo liquido</span>
            </div>
            {!editingSalary && (
              <button
                type="button"
                onClick={() => {
                  setSalaryInput(String(user?.liquidSalary || ''));
                  setEditingSalary(true);
                }}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
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
                className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"
                inputMode="numeric"
                autoFocus
              />
              <button
                type="button"
                onClick={saveSalary}
                disabled={savingSalary}
                className="rounded-2xl bg-rose-600 px-3.5 text-white"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="font-display text-2xl font-semibold currency tracking-tight">
                {metrics?.liquidSalaryFormatted || '—'}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Base para todos los calculos</p>
            </>
          )}
        </div>
      </div>

      <div className="eqg-stagger grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-sky-500 to-blue-600 p-3.5 text-white shadow-[0_12px_28px_-8px_rgba(14,165,233,0.45)] sm:p-4">
          <div className="mb-3 opacity-90">
            <MiniSpark />
          </div>
          <div className="font-display text-lg font-bold leading-none currency tracking-tight sm:text-xl">
            {metrics?.totalMonthlyFormatted || '$0'}
          </div>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-90 sm:text-[11px]">
            Total Mensual
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-amber-400 to-yellow-500 p-3.5 text-slate-900 shadow-[0_12px_28px_-8px_rgba(245,158,11,0.4)] sm:p-4">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/45">
            <Calendar size={15} strokeWidth={2.25} />
          </div>
          <div className="font-display text-lg font-bold leading-none currency tracking-tight sm:text-xl">
            {metrics?.totalYearlyFormatted || '$0'}
          </div>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-80 sm:text-[11px]">
            Proyeccion Anual
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-emerald-500 to-green-600 p-3.5 text-white shadow-[0_12px_28px_-8px_rgba(16,185,129,0.45)] sm:p-4">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <Clock size={15} strokeWidth={2.25} />
          </div>
          <div className="font-display text-lg font-bold leading-none tracking-tight sm:text-xl">
            {hoursLabel}
          </div>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-90 sm:text-[11px]">
            De tu pega
          </p>
        </div>
      </div>

      {liquid != null && totalMonthly > 0 && (
        <div className={alertClass}>
          <AlertTriangle size={18} className="shrink-0 opacity-90" />
          <span>
            {formatPercent(pct)} de tu sueldo en suscripciones
            {alertHint}
          </span>
        </div>
      )}

      {(metrics?.zombieCount ?? 0) > 0 && (
        <Link to="/zombies" className="eqg-shell block transition-transform active:scale-[0.99]">
          <div className="eqg-shell-inner flex items-center gap-3 border border-violet-100 bg-violet-50/90 p-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Ghost size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-violet-950">
                {metrics?.zombieCount} gasto{(metrics?.zombieCount ?? 0) !== 1 ? 's' : ''} zombie
              </p>
              <p className="text-xs text-violet-600/90">
                {metrics?.zombieMonthlyFormatted}/mes que casi no usas
              </p>
            </div>
          </div>
        </Link>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900">Mis Suscripciones</h2>
          <Link to="/subscriptions" className="text-xs font-semibold text-rose-600 hover:text-rose-500">
            Ver todas
          </Link>
        </div>

        {previewSubs.length === 0 ? (
          <div className="eqg-shell">
            <div className="eqg-shell-inner border border-dashed border-slate-200/80 px-5 py-12 text-center">
              <p className="font-display text-base font-semibold text-slate-800">Aun no tienes suscripciones</p>
              <p className="mt-1.5 text-sm text-slate-500">Agrega Netflix, Spotify y lo que pagas al mes</p>
              <button
                type="button"
                onClick={() => navigate('/subscriptions')}
                className="eqg-press mt-5 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                <Plus size={16} /> Agregar la primera
              </button>
            </div>
          </div>
        ) : (
          <div className="eqg-shell">
            <ul className="eqg-shell-inner divide-y divide-slate-100 overflow-hidden">
              {previewSubs.map((sub) => (
                <li key={sub.id} className="flex items-center gap-3 px-4 py-3.5">
                  <PlatformLogo platform={sub.platform} size={42} priority />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{sub.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {sub.nextBillingDate
                        ? 'Renueva: ' + formatShortDate(sub.nextBillingDate)
                        : sub.billingCycle?.toLowerCase() === 'yearly'
                          ? 'Anual'
                          : 'Mensual'}
                    </p>
                  </div>
                  <div className="currency shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                    {sub.monthlyEquivalentFormatted || sub.amountFormatted}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {metrics && metrics.byCategory?.length > 0 && (
        <div className="eqg-shell">
          <div className="eqg-shell-inner p-5 sm:p-6">
            <p className="eqg-label mb-4">Analisis por categoria</p>
            <Charts metrics={metrics} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/subscriptions"
          className="eqg-press inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.45)]"
        >
          <CreditCard size={16} /> Ver suscripciones
        </Link>
        <Link
          to="/zombies"
          className="eqg-press inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <Ghost size={16} /> Revisar zombies
        </Link>
      </div>

      <button
        type="button"
        onClick={() => navigate('/subscriptions')}
        className="eqg-press fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_12px_28px_-6px_rgba(14,165,233,0.55)] sm:hidden"
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
    <svg width="44" height="22" viewBox="0 0 44 22" fill="none" aria-hidden className="opacity-95">
      <path
        d="M1 15 L9 11 L15 13 L22 6 L29 10 L36 4 L43 8"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
