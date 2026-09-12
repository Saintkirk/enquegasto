import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

export default function PlatformSelector({ value, onChange, disabled }: Props) {
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

  const sheet =
    open &&
    createPortal(
      <div className="fixed inset-0 z-[400] flex flex-col bg-black/40" role="dialog" aria-modal="true">
        <button type="button" className="h-[8vh] w-full shrink-0" aria-label="Cerrar" onClick={closePicker} />

        <div className="flex min-h-0 flex-1 flex-col rounded-t-3xl bg-white shadow-2xl">
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 px-3 py-3">
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
                  <div className="text-sm font-semibold text-slate-900">Elegir categoria</div>
                  <div className="text-[11px] text-slate-400">Luego scrollea las plataformas</div>
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
                  <div className="truncate text-sm font-semibold text-slate-900">
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                onClick={() => pickCategory(null)}
                className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-left active:bg-rose-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <LayoutGrid size={20} className="text-rose-600" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Todas las plataformas</div>
                  <div className="text-[11px] text-slate-400">Catalogo completo</div>
                </div>
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                {categoryCards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickCategory(c.id)}
                    className="flex flex-col items-start gap-1.5 rounded-2xl border border-slate-200 bg-white p-3.5 text-left active:scale-[0.98] active:border-rose-300"
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
          ) : (
            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
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
        </div>
      </div>,
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
