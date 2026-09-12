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
  TrendingUp,
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

  const spendBarWidth = Math.min(100, Math.max(0, pct));

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
  const activeCount = metrics?.activeCount ?? subs.length;

  return (
    <div className="relative space-y-6 pb-24 sm:space-y-8 sm:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eqg-label mb-1">Resumen</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-sm font-bold text-white shadow-md ring-2 ring-white">
            {(firstName || user?.email || '?')[0].toUpperCase()}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Sueldo liquido — hero card */}
      <div className="eqg-shell">
        <div className="eqg-shell-inner relative overflow-hidden p-5 sm:p-6">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)' }}
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <Wallet size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="eqg-label">Sueldo liquido</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Base para todos los calculos</p>
              </div>
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
                <Pencil size={15} />
              </button>
            )}
          </div>

          <div className="relative mt-4">
            {editingSalary ? (
              <div className="flex gap-2">
                <input
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10"
                  inputMode="numeric"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={saveSalary}
                  disabled={savingSalary}
                  className="rounded-2xl bg-rose-600 px-4 text-white"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="font-display text-3xl font-semibold tracking-tight currency text-slate-900 sm:text-4xl">
                {metrics?.liquidSalaryFormatted || '—'}
              </div>
            )}
          </div>

          {liquid != null && liquid > 0 && (
            <div className="relative mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-500">
                  {formatPercent(pct)} en suscripciones
                </span>
                <span className="tabular-nums text-slate-400">
                  {metrics?.totalMonthlyFormatted || '$0'} / mes
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{
                    width: spendBarWidth + '%',
                    background:
                      pct >= 15
                        ? 'linear-gradient(90deg, #f43f5e, #e11d48)'
                        : pct >= 8
                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(90deg, #34d399, #10b981)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 metric tiles */}
      <div className="eqg-stagger grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total mensual */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-[1px] shadow-[0_16px_40px_-12px_rgba(14,165,233,0.5)]">
          <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-4 text-white sm:p-5">
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"
              aria-hidden
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <TrendingUp size={18} strokeWidth={2.25} />
              </span>
              <MiniSpark />
            </div>
            <div className="relative mt-5 font-display text-2xl font-bold leading-none tracking-tight currency sm:text-[1.75rem]">
              {metrics?.totalMonthlyFormatted || '$0'}
            </div>
            <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
              Total mensual
            </p>
            <p className="relative mt-1 text-[11px] text-white/65">
              {activeCount} suscripcion{activeCount !== 1 ? 'es' : ''} activa{activeCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Proyeccion anual */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 p-[1px] shadow-[0_16px_40px_-12px_rgba(245,158,11,0.45)]">
          <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 p-4 text-slate-900 sm:p-5">
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25"
              aria-hidden
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/50">
                <Calendar size={18} strokeWidth={2.25} />
              </span>
            </div>
            <div className="relative mt-5 font-display text-2xl font-bold leading-none tracking-tight currency sm:text-[1.75rem]">
              {metrics?.totalYearlyFormatted || '$0'}
            </div>
            <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800/75">
              Proyeccion anual
            </p>
            <p className="relative mt-1 text-[11px] text-slate-700/60">12 meses proyectados</p>
          </div>
        </div>

        {/* De tu pega */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 p-[1px] shadow-[0_16px_40px_-12px_rgba(16,185,129,0.5)]">
          <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 p-4 text-white sm:p-5">
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"
              aria-hidden
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Clock size={18} strokeWidth={2.25} />
              </span>
            </div>
            <div className="relative mt-5 font-display text-2xl font-bold leading-none tracking-tight sm:text-[1.75rem]">
              {hoursLabel}
            </div>
            <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
              De tu pega
            </p>
            <p className="relative mt-1 text-[11px] text-white/65">
              Horas al mes para pagarlas
            </p>
          </div>
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
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden className="opacity-90">
      <path
        d="M1 16 L10 12 L17 14 L24 7 L32 11 L40 4 L47 9"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
