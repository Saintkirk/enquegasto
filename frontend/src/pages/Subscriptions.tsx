import { useEffect, useState } from 'react';
import api from '../api/client';
import LoadingScreen from '../components/LoadingScreen';
import type { Subscription } from '../types';
import { formatPercent } from '../utils/format';
import SubscriptionForm from '../components/SubscriptionForm';
import { Plus, Ghost, Pencil, Trash2, MoreVertical } from 'lucide-react';

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/subscriptions')
      .then((res) => setSubs(res.data.subscriptions || []))
      .catch(() => setError('No pudimos cargar tus suscripciones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desactivar esta suscripción?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubs((prev) => prev.filter((s) => s.id !== id));
      setMenuOpen(null);
    } catch {
      setError('No pudimos eliminar la suscripción');
    }
  };

  const toggleZombie = async (sub: Subscription) => {
    try {
      await api.patch(`/subscriptions/${sub.id}/zombie`, { isZombie: !sub.isZombie });
      setSubs((prev) => prev.map((s) => (s.id === sub.id ? { ...s, isZombie: !s.isZombie } : s)));
      setMenuOpen(null);
    } catch {
      setError('No pudimos actualizar el estado zombie');
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Cargando suscripciones…" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Gestión</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Mis suscripciones</h1>
          <p className="mt-1 text-sm text-slate-500">{subs.length} activa{subs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 self-start rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.45)] hover:bg-rose-500"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {subs.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-slate-800">Aún no tienes suscripciones</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Agrega Netflix, Spotify, Adobe y todo lo que pagas todos los meses.</p>
          <button onClick={() => setShowForm(true)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> Agregar la primera
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white">
          <ul className="divide-y divide-slate-100">
            {subs.map((sub) => (
              <li key={sub.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50/80 sm:px-5">
                {sub.platform?.logoUrl ? (
                  <img src={sub.platform.logoUrl} alt="" className="h-10 w-10 rounded-xl object-contain bg-slate-50" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm">💳</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">{sub.name}</span>
                    {sub.isZombie && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-700">
                        <Ghost size={10} /> Zombie
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 capitalize">
                    {sub.billingCycle?.toLowerCase() || 'mensual'}
                    {sub.percentageOfSalary != null && ` · ${formatPercent(sub.percentageOfSalary)} del sueldo`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold currency">{sub.monthlyEquivalentFormatted || sub.amountFormatted || '—'}</div>
                  <div className="text-[11px] text-slate-400">/mes</div>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === sub.id ? null : sub.id)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen === sub.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg">
                        <button type="button" className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm hover:bg-slate-50" onClick={() => { setEditing(sub); setShowForm(true); setMenuOpen(null); }}>
                          <Pencil size={14} /> Editar
                        </button>
                        <button type="button" className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm hover:bg-slate-50" onClick={() => toggleZombie(sub)}>
                          <Ghost size={14} /> {sub.isZombie ? 'Quitar zombie' : 'Marcar zombie'}
                        </button>
                        <button type="button" className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(sub.id)}>
                          <Trash2 size={14} /> Desactivar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(showForm || editing) && (
        <SubscriptionForm
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onCreated={(sub) => setSubs((prev) => [sub, ...prev])}
          onUpdated={(sub) => { setSubs((prev) => prev.map((s) => (s.id === sub.id ? sub : s))); setEditing(null); }}
        />
      )}
    </div>
  );
}
