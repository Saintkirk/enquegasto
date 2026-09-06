import { useEffect, useState, useRef } from 'react';
import api from '../api/client';
import type { Platform } from '../types';
import { Search, X } from 'lucide-react';

interface Props {
  value?: Platform | null;
  onChange: (platform: Platform | null) => void;
  disabled?: boolean;
}

export default function PlatformSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get('/platforms', { params: { search: search || undefined, limit: 30 } })
        .then((res) => setPlatforms(res.data.platforms || []))
        .catch(() => setPlatforms([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, open]);

  const select = (p: Platform) => {
    onChange(p);
    setOpen(false);
    setSearch('');
  };

  const clear = () => {
    onChange(null);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
          {value.logoUrl ? (
            <img src={value.logoUrl} alt="" className="h-6 w-6 rounded-lg object-contain" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-200 text-[10px]">📦</div>
          )}
          <span className="flex-1 truncate text-sm font-medium text-slate-800">{value.name}</span>
          {value.priceMonthlyFormatted && (
            <span className="text-xs text-slate-400 currency">{value.priceMonthlyFormatted}</span>
          )}
          {!disabled && (
            <button type="button" onClick={clear} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            placeholder="Buscar Netflix, Spotify, Adobe…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200/80 bg-white py-1 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.2)]">
          {loading ? (
            <div className="px-3 py-4 text-center text-sm text-slate-400">Buscando…</div>
          ) : platforms.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-slate-400">No encontramos plataformas</div>
          ) : (
            platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
              >
                {p.logoUrl ? (
                  <img src={p.logoUrl} alt="" className="h-7 w-7 rounded-lg object-contain" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs">📦</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900">{p.name}</div>
                  <div className="text-[11px] capitalize text-slate-400">{p.category}</div>
                </div>
                {p.priceMonthlyFormatted && (
                  <div className="whitespace-nowrap text-xs tabular-nums text-slate-500 currency">{p.priceMonthlyFormatted}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
