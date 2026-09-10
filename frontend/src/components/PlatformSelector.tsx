import { useEffect, useState, useRef } from 'react';
import api from '../api/client';
import type { Platform } from '../types';
import { Search, X } from 'lucide-react';

interface Props {
  value?: Platform | null;
  onChange: (platform: Platform | null) => void;
  disabled?: boolean;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Streaming: '🎬',
  Gaming: '🎮',
  Música: '🎵',
  Deportes: '⚽',
  Productividad: '💼',
  Seguridad: '🔐',
  IA: '🤖',
  Diseño: '🎨',
  Educación: '📚',
  Noticias: '📰',
  Finanzas: '💰',
  Delivery: '🚗',
  Desarrollo: '💻',
  Citas: '💕',
  Telecom: '📡',
  Lectura: '📖',
  Salud: '💪',
  Otros: '📦',
};

export default function PlatformSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
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
    api
      .get('/platforms/categories')
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get('/platforms', {
          params: {
            search: search || undefined,
            category: category || undefined,
            limit: 80,
          },
        })
        .then((res) => setPlatforms(res.data.platforms || []))
        .catch(() => setPlatforms([]))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [search, category, open]);

  const select = (p: Platform) => {
    onChange(p);
    setOpen(false);
    setSearch('');
    setCategory(null);
  };

  const clear = () => {
    onChange(null);
    setSearch('');
    setCategory(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
          {value.logoUrl ? (
            <img src={value.logoUrl} alt="" className="h-6 w-6 rounded-lg object-contain" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-200 text-[10px]">
              {CATEGORY_EMOJI[value.category] || '📦'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-800">{value.name}</span>
            <span className="text-[10px] text-slate-400">{value.category}</span>
          </div>
          {value.priceMonthlyFormatted && (
            <span className="currency text-xs text-slate-400">{value.priceMonthlyFormatted}</span>
          )}
          {!disabled && (
            <button
              type="button"
              onClick={clear}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            placeholder="Buscar o elige una categoría…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute z-30 mt-1.5 max-h-[min(70vh,22rem)] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-12px_rgba(15,23,42,0.2)]">
          {/* Chips de categoría */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-2.5 py-2 scrollbar-none">
            <Chip active={!category} onClick={() => setCategory(null)}>
              Todas
            </Chip>
            {categories.map((c) => (
              <Chip key={c.name} active={category === c.name} onClick={() => setCategory(c.name)}>
                {CATEGORY_EMOJI[c.name] || '•'} {c.name}
              </Chip>
            ))}
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {loading ? (
              <div className="px-3 py-4 text-center text-sm text-slate-400">Buscando…</div>
            ) : platforms.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-slate-400">
                No encontramos plataformas
                {category ? ` en ${category}` : ''}
              </div>
            ) : (
              platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => select(p)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 active:bg-rose-50"
                >
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt="" className="h-7 w-7 rounded-lg object-contain" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs">
                      {CATEGORY_EMOJI[p.category] || '📦'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {CATEGORY_EMOJI[p.category] || ''} {p.category}
                    </div>
                  </div>
                  {p.priceMonthlyFormatted && (
                    <div className="currency whitespace-nowrap text-xs tabular-nums text-slate-500">
                      {p.priceMonthlyFormatted}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        active
          ? 'bg-rose-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
