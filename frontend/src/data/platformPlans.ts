/**
 * Planes y add-ons por plataforma (Chile CLP, 2026).
 * Fuentes: tarifas publicadas Netflix / Disney+ / Max / Prime / Spotify CL.
 */

export type PlanOption = {
  id: string;
  name: string;
  price: number;
  cycle?: 'MONTHLY' | 'YEARLY';
  note?: string;
  kind?: 'base' | 'addon';
  requiresPlan?: string[];
  maxPerPlan?: Record<string, number>;
};

export const CATEGORY_META: { id: string; label: string; emoji: string }[] = [
  { id: 'Streaming', label: 'Streaming', emoji: '🎬' },
  { id: 'Música', label: 'Música', emoji: '🎵' },
  { id: 'Gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'Deportes', label: 'Deportes', emoji: '⚽' },
  { id: 'Productividad', label: 'Productividad', emoji: '💼' },
  { id: 'Seguridad', label: 'Seguridad', emoji: '🔐' },
  { id: 'IA', label: 'IA y Tech', emoji: '🤖' },
  { id: 'Diseño', label: 'Diseño', emoji: '🎨' },
  { id: 'Educación', label: 'Educación', emoji: '📚' },
  { id: 'Noticias', label: 'Noticias', emoji: '📰' },
  { id: 'Finanzas', label: 'Finanzas', emoji: '💰' },
  { id: 'Delivery', label: 'Delivery', emoji: '🚗' },
  { id: 'Desarrollo', label: 'Desarrollo', emoji: '💻' },
  { id: 'Citas', label: 'Citas', emoji: '💕' },
  { id: 'Lectura', label: 'Lectura', emoji: '📖' },
  { id: 'Otros', label: 'Otros', emoji: '📦' },
];

export const PLANS_BY_SLUG: Record<string, PlanOption[]> = {
  netflix: [
    {
      id: 'basico',
      name: 'Basico',
      price: 6500,
      note: '1 pantalla · SD · sin miembro extra',
      kind: 'base',
    },
    {
      id: 'estandar',
      name: 'Estandar',
      price: 9990,
      note: '2 pantallas · Full HD · hasta 1 miembro extra',
      kind: 'base',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 12990,
      note: '4 pantallas · 4K · hasta 2 miembros extra',
      kind: 'base',
    },
    {
      id: 'extra-miembro',
      name: 'Miembro extra',
      price: 2890,
      note: 'Solo Estandar (max 1) o Premium (max 2)',
      kind: 'addon',
      requiresPlan: ['estandar', 'premium'],
      maxPerPlan: { estandar: 1, premium: 2 },
    },
  ],

  'disney-plus': [
    {
      id: 'estandar-ads',
      name: 'Estandar con anuncios',
      price: 8490,
      note: '2 pantallas · Disney + ESPN basico',
      kind: 'base',
    },
    {
      id: 'estandar',
      name: 'Estandar',
      price: 10990,
      note: 'Sin anuncios · descargas',
      kind: 'base',
    },
    {
      id: 'estandar-anual',
      name: 'Estandar anual',
      price: 91390,
      cycle: 'YEARLY',
      note: 'Ahorro ~30% vs 12 meses',
      kind: 'base',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15990,
      note: '4 pantallas · 4K · ESPN completo',
      kind: 'base',
    },
    {
      id: 'premium-anual',
      name: 'Premium anual',
      price: 133990,
      cycle: 'YEARLY',
      note: 'Ahorro ~30% vs 12 meses',
      kind: 'base',
    },
  ],

  max: [
    {
      id: 'basico-ads',
      name: 'Basico con anuncios',
      price: 7190,
      note: '2 pantallas · Full HD',
      kind: 'base',
    },
    {
      id: 'basico-ads-anual',
      name: 'Basico con anuncios anual',
      price: 59900,
      cycle: 'YEARLY',
      kind: 'base',
    },
    {
      id: 'estandar',
      name: 'Estandar',
      price: 9590,
      note: '2 pantallas · 30 descargas',
      kind: 'base',
    },
    {
      id: 'estandar-anual',
      name: 'Estandar anual',
      price: 79900,
      cycle: 'YEARLY',
      kind: 'base',
    },
    {
      id: 'platino',
      name: 'Platino',
      price: 11990,
      note: '4 pantallas · 4K · Dolby Atmos',
      kind: 'base',
    },
    {
      id: 'platino-anual',
      name: 'Platino anual',
      price: 99900,
      cycle: 'YEARLY',
      kind: 'base',
    },
    {
      id: 'tnt-addon',
      name: 'Add-on TNT Sports',
      price: 8990,
      note: 'Futbol chileno en vivo · se suma a cualquier plan Max',
      kind: 'addon',
      requiresPlan: ['basico-ads', 'estandar', 'platino'],
      maxPerPlan: { 'basico-ads': 1, estandar: 1, platino: 1 },
    },
  ],

  'prime-video': [
    {
      id: 'mensual',
      name: 'Prime Video mensual',
      price: 5790,
      note: '3 pantallas · 4K',
      kind: 'base',
    },
    {
      id: 'anual',
      name: 'Prime Video anual',
      price: 49900,
      cycle: 'YEARLY',
      note: 'Ahorro ~28%',
      kind: 'base',
    },
  ],

  'apple-tv-plus': [
    {
      id: 'mensual',
      name: 'Apple TV+',
      price: 6500,
      note: 'Hasta 5 con En Familia (iCloud)',
      kind: 'base',
    },
  ],

  spotify: [
    {
      id: 'individual',
      name: 'Individual',
      price: 4590,
      note: '1 cuenta',
      kind: 'base',
    },
    {
      id: 'duo',
      name: 'Duo',
      price: 5890,
      note: '2 cuentas · misma direccion',
      kind: 'base',
    },
    {
      id: 'familiar',
      name: 'Familiar',
      price: 7090,
      note: 'Hasta 6 cuentas',
      kind: 'base',
    },
    {
      id: 'universitario',
      name: 'Universitario',
      price: 2490,
      note: '1 cuenta · con acreditacion',
      kind: 'base',
    },
  ],

  'youtube-premium': [
    {
      id: 'individual',
      name: 'Individual',
      price: 7990,
      kind: 'base',
    },
    {
      id: 'familiar',
      name: 'Familiar',
      price: 12990,
      kind: 'base',
    },
  ],

  'paramount-plus': [
    {
      id: 'mensual',
      name: 'Mensual',
      price: 5990,
      kind: 'base',
    },
  ],

  zapping: [
    {
      id: 'mensual',
      name: 'Mensual',
      price: 10990,
      note: 'TV en vivo Chile',
      kind: 'base',
    },
  ],

  'tnt-sports': [
    {
      id: 'mensual',
      name: 'TNT Sports',
      price: 12990,
      note: 'Futbol chileno',
      kind: 'base',
    },
  ],
};

export function getBasePlans(slug?: string | null): PlanOption[] {
  if (!slug) return [];
  return (PLANS_BY_SLUG[slug] || []).filter((p) => (p.kind || 'base') === 'base');
}

export function getAddonsForPlan(slug?: string | null, planId?: string | null): PlanOption[] {
  if (!slug || !planId) return [];
  return (PLANS_BY_SLUG[slug] || []).filter(
    (p) => p.kind === 'addon' && (!p.requiresPlan || p.requiresPlan.includes(planId))
  );
}

export function maxAddonCount(addon: PlanOption, planId: string): number {
  if (addon.maxPerPlan && addon.maxPerPlan[planId] != null) {
    return addon.maxPerPlan[planId];
  }
  return 1;
}
