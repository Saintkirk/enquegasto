import { useState, useEffect, FormEvent } from 'react';
import api from '../api/client';
import type { Platform, Subscription } from '../types';
import PlatformSelector from './PlatformSelector';
import { X } from 'lucide-react';

interface Props {
  initial?: Subscription | null;
  onClose: () => void;
  onCreated: (sub: Subscription) => void;
  onUpdated: (sub: Subscription) => void;
}

export default function SubscriptionForm({ initial, onClose, onCreated, onUpdated }: Props) {
  const isEdit = Boolean(initial);
  const [platform, setPlatform] = useState<Platform | null>((initial as any)?.platform || null);
  const [name, setName] = useState(initial?.name || '');
  const [amount, setAmount] = useState(
    initial ? String((initial as any).amount ?? (initial as any).monthlyEquivalent ?? '') : ''
  );
  const [billingCycle, setBillingCycle] = useState(initial?.billingCycle || 'MONTHLY');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (platform && !isEdit) {
      if (!name) setName(platform.name);
      if (!amount && platform.priceMonthly) setAmount(String(platform.priceMonthly));
    }
  }, [platform]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      name: name.trim() || platform?.name || '',
      amount: Number(amount.replace(/\./g, '').replace(',', '')),
      billingCycle,
      platformId: platform?.id || null,
      notes: notes.trim() || null,
    };
    try {
      if (isEdit && initial) {
        const res = await api.patch(`/subscriptions/${initial.id}`, payload);
        onUpdated(res.data.subscription || res.data);
      } else {
        const res = await api.post('/subscriptions', payload);
        onCreated(res.data.subscription || res.data);
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No pudimos guardar la suscripción';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-t-[1.75rem] border border-slate-200/80 bg-white p-1 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:rounded-[1.75rem]">
        <div className="rounded-[calc(1.75rem-0.25rem)] bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{isEdit ? 'Editar' : 'Nueva'}</p>
              <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900">{isEdit ? 'Editar suscripción' : 'Agregar suscripción'}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          {error && <div className="mb-4 rounded-xl border border-rose-200/80 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Plataforma</label>
              <PlatformSelector value={platform} onChange={setPlatform} disabled={loading} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Netflix, Spotify…" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Monto (CLP)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="7990" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Ciclo de cobro</label>
              <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10">
                <option value="MONTHLY">Mensual</option>
                <option value="YEARLY">Anual</option>
                <option value="WEEKLY">Semanal</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Notas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Opcional" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98]">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(225,29,72,0.5)] hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50">{loading ? 'Guardando…' : isEdit ? 'Guardar' : 'Agregar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
