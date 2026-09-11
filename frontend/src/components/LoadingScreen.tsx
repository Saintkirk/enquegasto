import { useEffect, useState, useCallback } from 'react';
import { useRafMount } from '../hooks/useRaf';
import { scheduleIdle, cancelIdle } from '../hooks/useIdle';

const TIPS = [
  'Revisando tus suscripciones…',
  'Calculando el % de tu sueldo…',
  'Buscando gastos zombie…',
  'Ordenando tu plata…',
];

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ message, fullScreen = true }: Props) {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useRafMount(
    useCallback(() => setVisible(true), []),
    true
  );

  useEffect(() => {
    let intervalId: number | null = null;
    const idleId = scheduleIdle(
      () => {
        intervalId = window.setInterval(() => {
          setTipIndex((i) => (i + 1) % TIPS.length);
        }, 2200);
      },
      { timeout: 1500 }
    );
    return () => {
      cancelIdle(idleId);
      if (intervalId != null) clearInterval(intervalId);
    };
  }, []);

  const tip = message || TIPS[tipIndex];

  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden'
          : 'flex min-h-[40vh] items-center justify-center py-16'
      }
      role="status"
      aria-live="polite"
      aria-label="Cargando EnQuéGasto"
    >
      <div className="pointer-events-none absolute inset-0 bg-[#faf9f8]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225, 29, 72, 0.12), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(225, 29, 72, 0.06), transparent 50%),
            radial-gradient(ellipse 40% 30% at 10% 70%, rgba(15, 23, 42, 0.04), transparent 50%)
          `,
        }}
      />
      <div className="eqg-grain pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div
        className={`relative z-10 flex w-full max-w-[320px] flex-col items-center px-6 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div
          className={`mb-8 transition-all delay-100 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="rounded-[1.75rem] border border-rose-950/5 bg-rose-950/[0.03] p-1.5 shadow-[0_20px_50px_-20px_rgba(225,29,72,0.35)]">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-gradient-to-br from-rose-500 to-rose-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
              <span className="eqg-pulse absolute inset-0 rounded-[inherit] bg-white/20" />
              <span className="relative text-3xl font-semibold tracking-tight text-white" aria-hidden>
                $
              </span>
            </div>
          </div>
        </div>

        <h1
          className={`font-display text-2xl font-semibold tracking-[-0.03em] text-slate-900 transition-all delay-150 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          EnQué<span className="text-rose-600">Gasto</span>
        </h1>

        <p
          key={tip}
          className={`mt-2 min-h-[1.5rem] text-center text-sm font-medium text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {tip}
        </p>

        <div
          className={`mt-8 w-full max-w-[180px] transition-all delay-200 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-1 overflow-hidden rounded-full bg-slate-200/80">
            <div className="eqg-progress h-full rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
