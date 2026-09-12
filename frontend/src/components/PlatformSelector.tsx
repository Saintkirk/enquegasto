import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
  sheetVariants,
} from '../lib/motion';
import api from '../api/client';
import type { Platform } from '../types';
import { CATEGORY_META } from '../data/platformPlans';
import PlatformLogo from './PlatformLogo';
import { Search, X, ChevronLeft, LayoutGrid, Loader2 } from 'lucide-react';

interface Props {
  value?: Platform | null;
  onChange: (platform: Platform | null) => void;
  disabled?: boolean;
}

type Step = 'categories' | 'list';

const PAGE_SIZE = 30;

/** Tint por categoría — taste-skill */
const CATEGORY_THEME: Record<
  string,
  { soft: string; ring: string; badge: string; text: string }
> = {
  Streaming: {
    soft: 'from-rose-50 to-orange-50',
    ring: 'ring-rose-100',
    badge: 'bg-rose-100/80 text-rose-700',
    text: 'text-rose-900',
  },
  Música: {
    soft: 'from-violet-50 to-fuchsia-50',
    ring: 'ring-violet-100',
    badge: 'bg-violet-100/80 text-violet-700',
    text: 'text-violet-900',
  },
  Gaming: {
    soft: 'from-emerald-50 to-teal-50',
    ring: 'ring-emerald-100',
    badge: 'bg-emerald-100/80 text-emerald-700',
    text: 'text-emerald-900',
  },
  Deportes: {
    soft: 'from-sky-50 to-blue-50',
    ring: 'ring-sky-100',
    badge: 'bg-sky-100/80 text-sky-700',
    text: 'text-sky-900',
  },
  Productividad: {
    soft: 'from-amber-50 to-yellow-50',
    ring: 'ring-amber-100',
    badge: 'bg-amber-100/80 text-amber-800',
    text: 'text-amber-950',
  },
  Seguridad: {
    soft: 'from-slate-50 to-zinc-100',
    ring: 'ring-slate-200',
    badge: 'bg-slate-200/80 text-slate-700',
    text: 'text-slate-900',
  },
  IA: {
    soft: 'from-indigo-50 to-blue-50',
    ring: 'ring-indigo-100',
    badge: 'bg-indigo-100/80 text-indigo-700',
    text: 'text-indigo-900',
  },
  Diseño: {
    soft: 'from-pink-50 to-rose-50',
    ring: 'ring-pink-100',
    badge: 'bg-pink-100/80 text-pink-700',
    text: 'text-pink-900',
  },
  Educación: {
    soft: 'from-cyan-50 to-sky-50',
    ring: 'ring-cyan-100',
    badge: 'bg-cyan-100/80 text-cyan-800',
    text: 'text-cyan-950',
  },
  Noticias: {
    soft: 'from-stone-50 to-neutral-100',
    ring: 'ring-stone-200',
    badge: 'bg-stone-200/70 text-stone-700',
    text: 'text-stone-900',
  },
  Finanzas: {
    soft: 'from-lime-50 to-green-50',
    ring: 'ring-lime-100',
    badge: 'bg-lime-100/80 text-lime-800',
    text: 'text-lime-950',
  },
  Delivery: {
    soft: 'from-orange-50 to-amber-50',
    ring: 'ring-orange-100',
    badge: 'bg-orange-100/80 text-orange-800',
    text: 'text-orange-950',
  },
  Desarrollo: {
    soft: 'from-zinc-50 to-slate-100',
    ring: 'ring-zinc-200',
    badge: 'bg-zinc-200/80 text-zinc-700',
    text: 'text-zinc-900',
  },
  Citas: {
    soft: 'from-fuchsia-50 to-pink-50',
    ring: 'ring-fuchsia-100',
    badge: 'bg-fuchsia-100/80 text-fuchsia-700',
    text: 'text-fuchsia-900',
  },
  Lectura: {
    soft: 'from-yellow-50 to-amber-50',
    ring: 'ring-yellow-100',
    badge: 'bg-yellow-100/80 text-yellow-800',
    text: 'text-yellow-950',
  },
  Telecom: {
    soft: 'from-blue-50 to-indigo-50',
    ring: 'ring-blue-100',
    badge: 'bg-blue-100/80 text-blue-700',
    text: 'text-blue-900',
  },
  Otros: {
    soft: 'from-slate-50 to-gray-50',
    ring: 'ring-slate-100',
    badge: 'bg-slate-100 text-slate-600',
    text: 'text-slate-800',
  },
};

const DEFAULT_THEME = CATEGORY_THEME.Otros;

export default function PlatformSelector({ value, onChange, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('categories');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<{ name: string; count: number }[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const categoryCards = useMemo(() => {
    const counts = Object.fromEntries(apiCategories.map((c) => [c.name, c.count]));
    return CATEGORY_META.map((c) => ({
      ...c,
      count: counts[c.id] ?? 0,
    })).filter((c) => c.count > 0 || apiCategories.length === 0);
  }, [apiCategories]);

  useEffect(() => {
    if (!open) return;
    api
      .get('/platforms/categories')
      .then((res) => setApiCategories(res.data.categories || []))
      .catch(() => setApiCategories([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (append) {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const res = await api.get('/platforms', {
          params: {
            search: search || undefined,
            category: category || undefined,
            limit: PAGE_SIZE,
            offset,
          },
        });
        const batch: Platform[] = res.data.platforms || [];
        const tot = res.data.total ?? batch.length;
        const more = Boolean(res.data.hasMore ?? offset + batch.length < tot);

        setPlatforms((prev) => (append ? [...prev, ...batch] : batch));
        setTotal(tot);
        setHasMore(more);
        offsetRef.current = offset + batch.length;
      } catch {
        if (!append) setPlatforms([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        loadingMoreRef.current = false;
      }
    },
    [search, category]
  );

  useEffect(() => {
    if (!open || step !== 'list') return;
    offsetRef.current = 0;
    const timer = setTimeout(() => fetchPage(0, false), 80);
    return () => clearTimeout(timer);
  }, [search, category, open, step, fetchPage]);

  useEffect(() => {
    if (!open || step !== 'list') return;
    const root = listRef.current;
    const el = sentinelRef.current;
    if (!root || !el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingMoreRef.current && !loading) {
          fetchPage(offsetRef.current, true);
        }
      },
      { root, rootMargin: '120px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [open, step, hasMore, loading, fetchPage, platforms.length]);

  const openPicker = () => {
    if (disabled) return;
    setOpen(true);
    setStep('categories');
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
    setPlatforms([]);
  };

  const closePicker = () => {
    setOpen(false);
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
    setStep('categories');
  };

  const pickCategory = (id: string | null) => {
    setCategory(id);
    setSearch('');
    setSearchOpen(false);
    setPlatforms([]);
    setStep('list');
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearch('');
    setSearchOpen(false);
  };

  const select = (p: Platform) => {
    onChange(p);
    closePicker();
  };

  const clear = () => {
    onChange(null);
  };

  const backToCategories = () => {
    setStep('categories');
    setSearch('');
    setSearchOpen(false);
    setCategory(null);
    setPlatforms([]);
  };

  const valueEmoji = CATEGORY_META.find((c) => c.id === value?.category)?.emoji || '📦';
  const catMeta = CATEGORY_META.find((c) => c.id === category);

  const sheet = createPortal(
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            key="eqg-picker"
            className="fixed inset-0 z-[400] flex flex-col justify-end"
            role="dialog"
            aria-modal="true"
          >
            <m.button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar"
              onClick={closePicker}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <m.div
              className="relative z-10 flex min-h-0 flex-1 flex-col rounded-t-[1.75rem] bg-[#f7f6f4] shadow-[0_-20px_50px_-20px_rgba(15,23,42,0.25)]"
              initial={reduceMotion ? false : 'initial'}
              animate={reduceMotion ? undefined : 'animate'}
              exit={reduceMotion ? undefined : 'exit'}
              variants={reduceMotion ? undefined : sheetVariants}
            >
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200/60 bg-white/80 px-3 py-3 backdrop-blur-md">
                {step === 'list' ? (
                  <button
                    type="button"
                    onClick={backToCategories}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                    aria-label="Volver"
                  >
                    <ChevronLeft size={22} />
                  </button>
                ) : (
                  <div className="w-10" />
                )}

                <div className="min-w-0 flex-1">
                  {step === 'categories' ? (
                    <>
                      <div className="font-display text-[15px] font-semibold tracking-tight text-slate-900">
                        Elegir categoria
                      </div>
                      <div className="text-[11px] text-slate-400">Toca una tarjeta · busca despues si quieres</div>
                    </>
                  ) : searchOpen ? (
                    <div className="relative">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        ref={inputRef}
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={category ? 'Buscar en ' + category + '…' : 'Buscar Netflix, TNT…'}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-rose-300 focus:bg-white"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="truncate font-display text-[15px] font-semibold tracking-tight text-slate-900">
                        {catMeta ? catMeta.emoji + ' ' + catMeta.label : 'Todas'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {loading
                          ? 'Cargando…'
                          : platforms.length +
                            (total > platforms.length ? ' de ' + total : '') +
                            ' servicios'}
                      </div>
                    </>
                  )}
                </div>

                {step === 'list' && !searchOpen && (
                  <button
                    type="button"
                    onClick={openSearch}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                    aria-label="Buscar"
                  >
                    <Search size={20} />
                  </button>
                )}
                {step === 'list' && searchOpen && (
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                    aria-label="Cerrar busqueda"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closePicker}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {step === 'categories' ? (
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f7f6f4] px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                  <p className="eqg-label mb-3 px-0.5">Explorar por tipo</p>

                  <button
                    type="button"
                    onClick={() => pickCategory(null)}
                    className="eqg-press mb-4 flex w-full items-center gap-3.5 rounded-[1.25rem] bg-gradient-to-br from-rose-500 to-rose-700 p-[1px] text-left shadow-[0_12px_28px_-10px_rgba(225,29,72,0.45)]"
                  >
                    <span className="flex w-full items-center gap-3.5 rounded-[calc(1.25rem-1px)] bg-gradient-to-br from-rose-500 to-rose-700 px-3.5 py-3.5 text-white">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <LayoutGrid size={22} strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[15px] font-semibold tracking-tight">
                          Todas las plataformas
                        </span>
                        <span className="mt-0.5 block text-[11px] text-white/75">Catalogo completo · sin filtro</span>
                      </span>
                    </span>
                  </button>

                  <div className="eqg-stagger grid grid-cols-2 gap-2.5 sm:gap-3">
                    {categoryCards.map((c) => {
                      const theme = CATEGORY_THEME[c.id] || DEFAULT_THEME;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickCategory(c.id)}
                          className={
                            'eqg-press group relative flex flex-col overflow-hidden rounded-[1.25rem] bg-gradient-to-br p-[1px] text-left shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ' +
                            theme.ring +
                            ' ' +
                            theme.soft
                          }
                        >
                          <span className="relative flex h-full flex-col gap-2.5 rounded-[calc(1.25rem-1px)] bg-white/85 p-3.5 backdrop-blur-[2px]">
                            <span className="flex items-start justify-between gap-2">
                              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[1.35rem] leading-none shadow-sm ring-1 ring-black/[0.04]">
                                {c.emoji}
                              </span>
                              {c.count > 0 && (
                                <span
                                  className={
                                    'rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ' +
                                    theme.badge
                                  }
                                >
                                  {c.count}
                                </span>
                              )}
                            </span>
                            <span className={'font-display text-[13px] font-semibold tracking-tight ' + theme.text}>
                              {c.label}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {c.count > 0 ? c.count + ' servicios' : 'Ver catalogo'}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div
                  ref={listRef}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white pb-[max(1rem,env(safe-area-inset-bottom))]"
                >
                  {loading && platforms.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-sm text-slate-400">
                      <Loader2 size={24} className="animate-spin text-rose-500" />
                      Cargando…
                    </div>
                  ) : platforms.length === 0 ? (
                    <div className="px-4 py-16 text-center text-sm text-slate-400">
                      No hay plataformas
                      {category ? ' en ' + category : ''}
                      {search ? ' con "' + search + '"' : ''}
                    </div>
                  ) : (
                    <>
                      {platforms.map((p) => {
                        const em = CATEGORY_META.find((c) => c.id === p.category)?.emoji || '📦';
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => select(p)}
                            className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3.5 text-left active:bg-rose-50"
                          >
                            <PlatformLogo platform={p} size={40} fallback={em} />
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
                      })}
                      <div ref={sentinelRef} className="h-8 w-full" />
                      {loadingMore && (
                        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
                          <Loader2 size={14} className="animate-spin text-rose-500" />
                          Cargando mas…
                        </div>
                      )}
                      {!hasMore && platforms.length > 0 && (
                        <div className="py-4 text-center text-[11px] text-slate-300">Fin del listado</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body
  );

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
          <PlatformLogo platform={value} size={32} fallback={valueEmoji} priority />
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
          <span>Elegir categoria…</span>
        </button>
      )}

      {sheet}
    </div>
  );
}
