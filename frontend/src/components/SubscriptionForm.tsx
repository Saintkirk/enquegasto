import { useState, useEffect, FormEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import api from '../api/client';
import type { Platform, Subscription } from '../types';
import PlatformSelector from './PlatformSelector';
import {
  getBasePlans,
  getAddonsForPlan,
  maxAddonCount,
  type PlanOption,
} from '../data/platformPlans';
import { X, Minus, Plus } from 'lucide-react';

interface Props {
  initial?: Subscription | null;
  onClose: () => void;
  onCreated: (sub: Subscription) => void;
  onUpdated: (sub: Subscription) => void;
}

function parseCLP(raw: string): number {
  const cleaned = String(raw)
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n) : NaN;
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
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const basePlans = useMemo(() => getBasePlans(platform?.slug), [platform?.slug]);
  const addons = useMemo(
    () => getAddonsForPlan(platform?.slug, selectedPlanId),
    [platform?.slug, selectedPlanId]
  );
  const selectedBase = basePlans.find((p) => p.id === selectedPlanId) || null;

  const computedTotal = useMemo(() => {
    if (!selectedBase) return null;
    let total = selectedBase.price;
    for (const a of addons) total += a.price * (addonQty[a.id] || 0);
    return total;
  }, [selectedBase, addons, addonQty]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (platform && !isEdit) {
      setName(platform.name);
      setSelectedPlanId(null);
      setAddonQty({});
      if (platform.priceMonthly) setAmount(String(platform.priceMonthly));
      else setAmount('');
    }
  }, [platform, isEdit]);

  useEffect(() => {
    if (!selectedBase) return;
    setAddonQty({});
    setAmount(String(selectedBase.price));
    setBillingCycle(selectedBase.cycle || 'MONTHLY');
    setName(platform?.name ? `${platform.name} · ${selectedBase.name}` : selectedBase.name);
  }, [selectedPlanId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (computedTotal == null) return;
    setAmount(String(computedTotal));
    if (selectedBase && platform) {
      const parts = [`${platform.name} · ${selectedBase.name}`];
      for (const a of addons) {
        const q = addonQty[a.id] || 0;
        if (q > 0) parts.push(`${q}× ${a.name}`);
      }
      setName(parts.join(' + '));
    }
  }, [computedTotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyBasePlan = (plan: PlanOption) => setSelectedPlanId(plan.id);

  const setQty = (addon: PlanOption, next: number) => {
    if (!selectedPlanId) return;
    const max = maxAddonCount(addon, selectedPlanId);
    const clamped = Math.max(0, Math.min(max, next));
    setAddonQty((prev) => {
      const updated: Record<string, number> = { ...prev, [addon.id]: clamped };
      if (clamped > 0 && addon.id.startsWith('extra-')) {
        for (const other of addons) {
          if (other.id !== addon.id && other.id.startsWith('extra-')) updated[other.id] = 0;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const numeric = parseCLP(amount);
    if (!Number.isFinite(numeric) || numeric < 0) {
      setError('Ingresa un monto válido en CLP');
      return;
    }
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim() || platform?.name || 'Suscripción',
      amount: numeric,
      billingCycle: String(billingCycle || 'MONTHLY').toUpperCase(),
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
      const ax = err as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      setError(
        ax.response?.data?.message ||
          ax.response?.data?.error ||
          ax.message ||
          'No pudimos guardar la suscripción'
      );
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} aria-hidden />

      <div className="relative z-10 flex max-h-[min(94dvh,42rem)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isEdit ? 'Editar' : 'Nueva'}
            </p>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar suscripción' : 'Agregar suscripción'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form id="eqg-subscription-form" onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Plataforma</label>
                <PlatformSelector value={platform} onChange={setPlatform} disabled={loading} />
              </div>

              {basePlans.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Plan / membresía</label>
                  <div className="flex flex-col gap-2">
                    {basePlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => applyBasePlan(plan)}
                        className={
                          selectedPlanId === plan.id
                            ? 'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left border-rose-500 bg-rose-50 ring-2 ring-rose-500/20'
                            : 'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left border-slate-200 bg-white'
                        }
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{plan.name}</div>
                          {plan.note && <div className="text-[11px] text-slate-400">{plan.note}</div>}
                        </div>
                        <div className="text-right">
                          <div className="currency text-sm font-semibold">
                            ${plan.price.toLocaleString('es-CL')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {plan.cycle === 'YEARLY' ? '/año' : '/mes'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlanId && addons.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Opcional · miembros extra
                  </label>
                  <p className="mb-2 text-[11px] text-slate-400">
                    Netflix: Estándar máx. 1 · Premium máx. 2
                  </p>
                  <div className="flex flex-col gap-2">
                    {addons.map((addon) => {
                      const max = maxAddonCount(addon, selectedPlanId);
                      const qty = addonQty[addon.id] || 0;
                      const boxClass =
                        qty > 0
                          ? 'rounded-xl border px-3.5 py-2.5 border-violet-400 bg-violet-50/80'
                          : 'rounded-xl border px-3.5 py-2.5 border-slate-200';
                      return (
                        <div key={addon.id} className={boxClass}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-slate-800">{addon.name}</div>
                              {addon.note && (
                                <div className="text-[11px] text-slate-400">{addon.note}</div>
                              )}
                              <div className="mt-0.5 currency text-xs text-slate-500">
                                +${addon.price.toLocaleString('es-CL')}/mes · máx. {max}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={qty <= 0}
                                onClick={() => setQty(addon, qty - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-30"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                              <button
                                type="button"
                                disabled={qty >= max}
                                onClick={() => setQty(addon, qty + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-30"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Monto (CLP)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Ciclo de cobro</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white"
                >
                  <option value="MONTHLY">Mensual</option>
                  <option value="YEARLY">Anual</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Notas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Opcional"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="relative z-20 shrink-0 border-t border-slate-100 bg-white px-5 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-full border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 active:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-rose-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Guardando…' : isEdit ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
