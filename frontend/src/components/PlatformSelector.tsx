import { useEffect, useState, useRef, useMemo } from 'react';
import api from '../api/client';
import type { Platform } from '../types';
import { platformLogo } from '../utils/logo';
import { CATEGORY_META } from '../data/platformPlans';
import { Search, X, ChevronLeft, LayoutGrid } from 'lucide-react';

interface Props {
  value?: Platform | null;
  onChange: (platform: Platform | null) => void;
  disabled?: boolean;
}

type Step = 'categories' | 'list';

export default function PlatformSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('categories');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<{ name: string; count: number }[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryCards = useMemo(() => {
    const counts = Object.fromEntries(apiCategories.map((c) => [c.name, c.count]));
    return CATEGORY_META.map((c) => ({
      ...c,
      count: counts[c.id] ?? 0,
    })).filter((c) => c.count > 0 || apiCategories.length === 0);
  }, [apiCategories]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    api
      .get('/platforms/categories')
      .then((res) => setApiCategories(res.data.categories || []))
      .catch(() => setApiCategories([]));
  }, [open]);

  useEffect(() => {
    if (!open || step !== 'list') return;
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get('/platforms', {
          params: {
            search: search || undefined,
            category: category || undefined,
            limit: 150,
          },
        })
        .then((res) => setPlatforms(res.data.platforms || []))
        .catch(() => setPlatforms([]))
        .finally(() => setLoading(false));
    }, 150);
    return () => clearTimeout(timer);
  }, [search, category, open, step]);

  const openPicker = () => {
    if (disabled) return;
    setOpen(true);
    setStep('categories');
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
  };

  /** Entra a la lista sin abrir el teclado */
  const pickCategory = (id: string | null) => {
    setCategory(id);
    setSearch('');
    setSearchOpen(false);
    setStep('list');
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const closeSearch = () => {
    setSearch('');
    setSearchOpen(false);
  };

  const select = (p: Platform) => {
    onChange(p);
    setOpen(false);
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
    setStep('categories');
  };

  const clear = () => {
    onChange(null);
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
    setStep('categories');
  };

  const backToCategories = () => {
    setStep('categories');
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
  };

  const logo = value ? platformLogo(value) : null;
  const valueEmoji = CATEGORY_META.find((c) => c.id === value?.category)?.emoji || '📦';
  const catMeta = CATEGORY_META.find((c) => c.id === category);

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
          {logo ? (
            <img src={logo} alt="" className="h-8 w-8 rounded-lg bg-white object-contain" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm">
              {valueEmoji}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-800">{value.name}</span>
            <span className="text-[10px] text-slate-400">
              {valueEmoji} {value.category}
            </span>
          </div>
          {value.priceMonthlyFormatted && (
            <span className="currency text-xs text-slate-400">{value.priceMonthlyFormatted}</span>
          )}
          {!disabled && (
            <button type="button" onClick={clear} className="rounded-lg p-1.5 text-slate-400 hover:bg-white">
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-left text-sm text-slate-400 hover:border-rose-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10"
        >
          <LayoutGrid size={16} className="shrink-0 text-slate-400" />
          <span>Elegir categoría…</span>
        </button>
      )}

      {open && !value && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)]">
          {step === 'categories' && (
            <div className="max-h-[min(70vh,26rem)] overflow-y-auto p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Elige una categoría
              </p>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => pickCategory(null)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left hover:border-rose-300 hover:bg-rose-50 active:scale-[0.99]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                    <LayoutGrid size={18} className="text-rose-600" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Todas las plataformas</div>
                    <div className="text-[11px] text-slate-400">Ver el catálogo completo</div>
                  </div>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categoryCards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickCategory(c.id)}
                    className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-rose-300 hover:bg-rose-50/50 active:scale-[0.98]"
                  >
                    <span className="text-2xl leading-none">{c.emoji}</span>
                    <span className="text-sm font-semibold text-slate-900">{c.label}</span>
                    {c.count > 0 && (
                      <span className="text-[10px] font-medium text-slate-400">{c.count} servicios</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'list' && (
            <div className="flex max-h-[min(70vh,26rem)] flex-col">
              {/* Header: atrás + título + lupa (sin input a menos que se pida) */}
              <div className="flex items-center gap-1 border-b border-slate-100 px-1.5 py-1.5">
                <button
                  type="button"
                  onClick={backToCategories}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                  aria-label="Volver a categorías"
                >
                  <ChevronLeft size={22} />
                </button>

                {searchOpen ? (
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <div className="relative min-w-0 flex-1">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={
                          category ? `Buscar en ${category}…` : 'Buscar Netflix, TNT…'
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-sm outline-none focus:border-rose-300 focus:bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                      aria-label="Cerrar búsqueda"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-1 px-1">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {catMeta ? `${catMeta.emoji} ${catMeta.label}` : '📦 Todas'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {loading
                          ? 'Cargando…'
                          : `${platforms.length} servicio${platforms.length !== 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={openSearch}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                      aria-label="Buscar"
                    >
                      <Search size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Lista scrolleable — prioridad */}
              <div className="flex-1 overflow-y-auto overscroll-contain py-1">
                {loading ? (
                  <div className="px-3 py-10 text-center text-sm text-slate-400">Cargando…</div>
                ) : platforms.length === 0 ? (
                  <div className="px-3 py-10 text-center text-sm text-slate-400">
                    No hay plataformas
                    {category ? ` en ${category}` : ''}
                    {search ? ` con “${search}”` : ''}
                  </div>
                ) : (
                  platforms.map((p) => {
                    const img = platformLogo(p);
                    const em = CATEGORY_META.find((c) => c.id === p.category)?.emoji || '📦';
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => select(p)}
                        className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-slate-50 active:bg-rose-50"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-xl bg-slate-50 object-contain"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base">
                            {em}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {em} {p.category}
                          </div>
                        </div>
                        {p.priceMonthlyFormatted && (
                          <div className="currency shrink-0 text-xs font-medium text-slate-500">
                            {p.priceMonthlyFormatted}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
