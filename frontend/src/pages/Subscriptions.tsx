import { useEffect, useState } from 'react';
import api from '../api/client';
import LoadingScreen from '../components/LoadingScreen';
import type { Subscription } from '../types';
import { formatPercent } from '../utils/format';
import { platformLogo } from '../utils/logo';
import SubscriptionForm from '../components/SubscriptionForm';
import { Plus, Ghost, Pencil, Trash2, MoreVertical } from 'lucide-react';

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
    setMenuOpen(null);
  };

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
    <div className="relative space-y-6 pb-28 sm:space-y-8 sm:pb-0">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Gestión</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Mis suscripciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {subs.length} activa{subs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(225,29,72,0.45)] hover:bg-rose-500 active:scale-95"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {subs.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-slate-800">Aún no tienes suscripciones</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Agrega Netflix, Spotify, TNT Sports y todo lo que pagas al mes.
          </p>
          <button
            type="button"
            onClick={openNew}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Agregar la primera
          </button>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {subs.map((sub, index) => {
              const openUp = index >= subs.length - 2;
              const logo = platformLogo(sub.platform || {});
              return (
                <li key={sub.id} className="relative flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  {logo ? (
                    <img
                      src={logo}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm">
                      💳
                    </div>
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
                    <p className="mt-0.5 text-xs capitalize text-slate-400">
                      {sub.billingCycle?.toLowerCase() || 'mensual'}
                      {sub.percentageOfSalary != null &&
                        ` · ${formatPercent(sub.percentageOfSalary)} del sueldo`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="currency text-sm font-semibold">
                      {sub.monthlyEquivalentFormatted || sub.amountFormatted || '—'}
                    </div>
                    <div className="text-[11px] text-slate-400">/mes</div>
                  </div>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Opciones"
                      onClick={() => setMenuOpen(menuOpen === sub.id ? null : sub.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {menuOpen === sub.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                        <div
                          className={`absolute right-0 z-40 w-48 rounded-2xl border border-slate-200 bg-white py-1 shadow-xl ${
                            openUp ? 'bottom-full mb-1' : 'top-full mt-1'
                          }`}
                        >
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3.5 py-3 text-sm hover:bg-slate-50"
                            onClick={() => {
                              setEditing(sub);
                              setShowForm(true);
                              setMenuOpen(null);
                            }}
                          >
                            <Pencil size={14} /> Editar
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3.5 py-3 text-sm hover:bg-slate-50"
                            onClick={() => toggleZombie(sub)}
                          >
                            <Ghost size={14} /> {sub.isZombie ? 'Quitar zombie' : 'Marcar zombie'}
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3.5 py-3 text-sm text-rose-600 hover:bg-rose-50"
                            onClick={() => handleDelete(sub.id)}
                          >
                            <Trash2 size={14} /> Desactivar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* FAB extra en móvil */}
      <button
        type="button"
        onClick={openNew}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[60] flex h-14 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-lg active:scale-95 sm:hidden"
      >
        <Plus size={20} strokeWidth={2.5} />
        Agregar
      </button>

      {showForm && (
        <SubscriptionForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onCreated={(sub) => {
            setSubs((prev) => [sub, ...prev]);
            setShowForm(false);
          }}
          onUpdated={(sub) => {
            setSubs((prev) => prev.map((s) => (s.id === sub.id ? sub : s)));
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
