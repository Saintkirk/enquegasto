import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardMetrics } from '../types';
import { formatPercent } from '../utils/format';
import { useIdleEffect } from '../hooks/useIdle';
import { prefetchPlatforms } from '../utils/prefetch';
import Charts from '../components/Charts';
import LoadingScreen from '../components/LoadingScreen';
import { CreditCard, Ghost, TrendingUp, Wallet, Pencil, Check } from 'lucide-react';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');
  const [savingSalary, setSavingSalary] = useState(false);

  const loadMetrics = () => {
    api
      .get('/subscriptions/metrics/dashboard')
      .then((res) => setMetrics(res.data.metrics))
      .catch(() => setError('No pudimos cargar tus métricas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  useIdleEffect(() => {
    void prefetchPlatforms();
  }, [], { enabled: !loading, timeout: 3000 });

  const saveSalary = async () => {
    const value = Number(salaryInput.replace(/\./g, '').replace(',', ''));
    if (!value || value < 150000) {
      setError('Ingresa un sueldo líquido válido (mínimo $150.000)');
      return;
    }
    setSavingSalary(true);
    setError('');
    try {
      await api.patch('/subscriptions/salary', { liquidSalary: value });
      await refreshUser();
      setEditingSalary(false);
      loadMetrics();
    } catch {
      setError('No pudimos actualizar el sueldo');
    } finally {
      setSavingSalary(false);
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Armando tu resumen…" />;

  const firstName = user?.name?.split(' ')[0];
  const pct = metrics?.percentOfSalary ?? metrics?.percentageOfSalary ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Resumen</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Hola{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Así se mueve tu plata en suscripciones</p>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100"><Wallet size={16} strokeWidth={1.75} /></span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Sueldo líquido</span>
            </div>
            {!editingSalary && (
              <button onClick={() => { setSalaryInput(String(user?.liquidSalary || '')); setEditingSalary(true); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50">
                <Pencil size={14} />
              </button>
            )}
          </div>
          {editingSalary ? (
            <div className="flex gap-2">
              <input value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" autoFocus />
              <button onClick={saveSalary} disabled={savingSalary} className="rounded-xl bg-rose-600 px-3 text-white"><Check size={16} /></button>
            </div>
          ) : (
            <>
              <div className="font-display text-xl font-semibold currency">{metrics?.liquidSalaryFormatted || '—'}</div>
              <p className="mt-1 text-[11px] text-slate-400">Base para todos los cálculos</p>
            </>
          )}
        </div>

        <MetricCard icon={<TrendingUp size={16} />} label="Gasto mensual" value={metrics?.totalMonthlyFormatted || '$0'} sub={`${metrics?.activeCount ?? 0} activas`} />
        <MetricCard icon={<span className="text-xs font-bold">%</span>} label="% del sueldo" value={formatPercent(pct)} sub="vs sueldo líquido" />

        <div className="rounded-[1.25rem] border border-violet-950/5 bg-violet-950/[0.04] p-1">
          <div className="rounded-[calc(1.25rem-0.25rem)] border border-violet-200/60 bg-violet-50/80 p-3.5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><Ghost size={16} /></span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">Gasto zombie</span>
            </div>
            <div className="font-display text-xl font-semibold text-violet-900 currency">{metrics?.zombieMonthlyFormatted || '$0'}</div>
            <p className="mt-1 text-[11px] text-violet-500/80">{metrics?.zombieCount ? `${metrics.zombieCount} que casi no usas` : 'Sin zombies por ahora'}</p>
          </div>
        </div>
      </div>

      {metrics && metrics.byCategory?.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 sm:p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Análisis</p>
          <Charts metrics={metrics} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/subscriptions" className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.45)] hover:bg-rose-500">
          <CreditCard size={16} /> Ver suscripciones
        </Link>
        <Link to="/zombies" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Ghost size={16} /> Revisar zombies
        </Link>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <div className="font-display text-xl font-semibold currency">{value}</div>
      {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
