import { lazy, Suspense } from 'react';
import type { DashboardMetrics } from '../types';

/** Recharts solo se descarga cuando el dashboard tiene datos por categoria */
const Charts = lazy(() => import('./Charts'));

export default function LazyCharts({ metrics }: { metrics: DashboardMetrics }) {
  if (!metrics.byCategory?.length) return null;

  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">
          Cargando graficos…
        </div>
      }
    >
      <Charts metrics={metrics} />
    </Suspense>
  );
}
