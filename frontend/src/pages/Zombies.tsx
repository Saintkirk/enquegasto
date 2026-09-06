import { useEffect, useState } from 'react';
import api from '../api/client';
import LoadingScreen from '../components/LoadingScreen';
import type { Subscription } from '../types';
import { Ghost, Mail, Sparkles } from 'lucide-react';

export default function Zombies() {
  const [zombies, setZombies] = useState<Subscription[]>([]);
  const [total, setTotal] = useState('$0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api
      .get('/subscriptions/zombies')
      .then((res) => {
        setZombies(res.data.zombies || res.data.subscriptions || []);
        setTotal(res.data.totalZombieFormatted || res.data.zombieMonthlyFormatted || '$0');
      })
      .catch(() => setError('No pudimos cargar los gastos zombie'))
      .finally(() => setLoading(false));
  }, []);

  const sendAlert = async () => {
    setSending(true);
    setError('');
    setSent(false);
    try {
      await api.post('/alerts/zombie');
      setSent(true);
    } catch {
      setError('No pudimos enviar el correo. Revisa tu email en el perfil.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Buscando gastos zombie…" />;

  const hasZombies = zombies.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-500">Alertas</p>
        <h1 className="font-display flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          <Ghost className="text-violet-500" size={28} strokeWidth={1.5} />
          Gastos zombie
        </h1>
        <p className="mt-1 text-sm text-slate-500">Suscripciones que pagas pero casi no usas</p>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {sent && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Te enviamos el resumen por correo. Revisa tu bandeja.</div>}

      {hasZombies ? (
        <>
          <div className="rounded-[1.5rem] border border-violet-950/5 bg-violet-950/[0.04] p-1">
            <div className="rounded-[calc(1.5rem-0.25rem)] border border-violet-200/50 bg-gradient-to-br from-violet-50 to-white px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-800">
                    Tienes {zombies.length} suscripción{zombies.length !== 1 ? 'es' : ''} que casi no usas
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-violet-950 currency">Estás botando {total} al mes</p>
                </div>
                <button onClick={sendAlert} disabled={sending} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(124,58,237,0.45)] hover:bg-violet-500 disabled:opacity-50">
                  <Mail size={16} /> {sending ? 'Enviando…' : 'Enviarme alerta por email'}
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white">
            <ul className="divide-y divide-slate-100">
              {zombies.map((z) => (
                <li key={z.id} className="flex items-center gap-3 px-4 py-4 sm:px-5">
                  {z.platform?.logoUrl ? (
                    <img src={z.platform.logoUrl} alt="" className="h-10 w-10 rounded-xl object-contain bg-slate-50" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><Ghost size={18} /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{z.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Poco uso reciente o marcada como zombie</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-violet-700 currency">{z.monthlyEquivalentFormatted || z.amountFormatted || '—'}</p>
                    <p className="text-[11px] text-slate-400">/mes</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="rounded-[1.5rem] border border-emerald-200/60 bg-gradient-to-b from-emerald-50/80 to-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Sparkles size={24} />
          </div>
          <p className="font-display text-lg font-semibold text-slate-800">No tienes gastos zombie</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Todas tus suscripciones se ven en uso. Sigue así.</p>
        </div>
      )}
    </div>
  );
}
