import { useMemo, useCallback, memo } from 'react';
import {
  PieChart, Pie, Cell, Sector, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import { useRafState, useRafCallback } from '../hooks/useRaf';
import type { DashboardMetrics } from '../types';

const COLORS = ['#e11d48','#7c3aed','#d97706','#059669','#2563eb','#db2777','#0d9488','#ea580c','#4f46e5','#65a30d'];

const formatCLP = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

interface Props { metrics: DashboardMetrics }

interface ActiveShapeProps {
  cx?: number; cy?: number; innerRadius?: number; outerRadius?: number;
  startAngle?: number; endAngle?: number; fill?: string;
}

function renderActiveShape(props: ActiveShapeProps) {
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0, endAngle = 0, fill = '#e11d48' } = props;
  return (
    <g style={{ outline: 'none' }}>
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 3} outerRadius={outerRadius + 7} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.22} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
}

function Charts({ metrics }: Props) {
  const [activeIndex, setActiveIndex] = useRafState<number | undefined>(undefined);

  const categoryData = useMemo(
    () => (metrics.byCategory || []).map((c) => ({
      name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
      value: c.monthly,
      formatted: c.monthlyFormatted,
      count: c.count,
    })),
    [metrics.byCategory]
  );

  const total = useMemo(() => categoryData.reduce((a, c) => a + c.value, 0), [categoryData]);

  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const onPieEnter = useRafCallback((_: unknown, index: number) => setActiveIndex(index));
  const onPieLeave = useCallback(() => setActiveIndex(undefined), [setActiveIndex]);

  if (categoryData.length === 0) return null;

  return (
    <div className="eqg-chart grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section>
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Gasto por categoría</h3>
            <p className="text-[11px] text-slate-400">Equivalente mensual · CLP</p>
          </div>
          <span className="font-display text-sm font-semibold currency">{formatCLP(total)}</span>
        </div>
        <div className="relative h-52">
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Total</span>
            <span className="font-display text-sm font-semibold currency">
              {activeIndex != null && categoryData[activeIndex]
                ? categoryData[activeIndex].formatted || formatCLP(categoryData[activeIndex].value)
                : formatCLP(total)}
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
                stroke="none"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                isAnimationActive={!reduceMotion}
                animationDuration={reduceMotion ? 0 : 600}
                style={{ outline: 'none', cursor: 'pointer' }}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={activeIndex === undefined || activeIndex === i ? 1 : 0.4} style={{ outline: 'none' }} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip total={total} />} cursor={false} isAnimationActive={false} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 space-y-1">
          {categoryData.map((c, i) => {
            const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
            const isActive = activeIndex === i;
            return (
              <li key={c.name}>
                <button
                  type="button"
                  className={`eqg-transition flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1 text-left text-sm ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50/70'}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], transform: isActive ? 'scale(1.2)' : 'scale(1)' }} />
                  <span className={`min-w-0 flex-1 truncate ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{c.name}</span>
                  <span className="text-[11px] text-slate-400">{pct}%</span>
                  <span className="w-20 text-right text-xs font-semibold currency">{c.formatted || formatCLP(c.value)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Comparativa</h3>
          <p className="text-[11px] text-slate-400">Monto mensual por categoría</p>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`)} width={40} />
              <Tooltip content={<ChartTooltip total={total} />} cursor={{ fill: 'rgba(15,23,42,0.03)' }} isAnimationActive={false} />
              <Bar dataKey="value" radius={[8, 8, 4, 4]} maxBarSize={36} background={{ fill: 'rgba(15,23,42,0.04)', radius: 8 }} isAnimationActive={!reduceMotion} animationDuration={reduceMotion ? 0 : 500}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={activeIndex === undefined || activeIndex === i ? 1 : 0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function ChartTooltip({ active, payload, total }: { active?: boolean; payload?: Array<{ name: string; value: number }>; total?: number }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const pct = total && total > 0 ? Math.round((item.value / total) * 100) : null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium text-slate-500">{item.name}</p>
      <p className="font-display text-sm font-semibold currency">{formatCLP(item.value)}</p>
      {pct != null && <p className="text-[10px] text-slate-400">{pct}% del total</p>}
    </div>
  );
}

export default memo(Charts);
