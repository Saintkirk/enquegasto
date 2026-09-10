/**
 * Planes referenciales CLP — mercado Chile.
 * Add-ons (ej. miembro extra Netflix) solo si el plan base lo permite.
 *
 * Netflix (help.netflix.com):
 * - Miembro extra SOLO en Estándar o Premium (no en anuncios / Básico).
 * - Estándar: hasta 1 miembro extra.
 * - Premium: hasta 2 miembros extra.
 * - Cada extra tiene cargo mensual aparte (con o sin anuncios).
 */

export type PlanOption = {
  id: string;
  name: string;
  price: number;
  cycle?: 'MONTHLY' | 'YEARLY';
  note?: string;
  /** base = plan principal · addon = cargo opcional */
  kind?: 'base' | 'addon';
  /** IDs de planes base que habilitan este add-on */
  requiresPlan?: string[];
  /** Máximo de unidades del add-on por plan base (default 1) */
  maxPerPlan?: Record<string, number>;
};

export const PLANS_BY_SLUG: Record<string, PlanOption[]> = {
  // ——— Streaming ———
  netflix: [
    {
      id: 'basico',
      name: 'Básico',
      price: 7190,
      note: '1 pantalla · HD · sin miembro extra',
      kind: 'base',
    },
    {
      id: 'estandar',
      name: 'Estándar',
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
    // Add-ons — solo visibles con Estándar o Premium
    {
      id: 'extra-sin-ads',
      name: 'Miembro extra (sin anuncios)',
      price: 2890,
      note: 'Persona fuera del hogar · 1 pantalla · Full HD',
      kind: 'addon',
      requiresPlan: ['estandar', 'premium'],
      maxPerPlan: { estandar: 1, premium: 2 },
    },
    {
      id: 'extra-con-ads',
      name: 'Miembro extra (con anuncios)',
      price: 2490,
      note: 'Más económico · 1 pantalla · con publicidad',
      kind: 'addon',
      requiresPlan: ['estandar', 'premium'],
      maxPerPlan: { estandar: 1, premium: 2 },
    },
  ],

  'disney-plus': [
    { id: 'ads', name: 'Estándar con anuncios', price: 8490, note: '2 pantallas · ESPN parcial', kind: 'base' },
    { id: 'estandar', name: 'Estándar', price: 10990, note: '2 pantallas · Full HD', kind: 'base' },
    { id: 'premium', name: 'Premium', price: 15990, note: '4 pantallas · 4K · ESPN full', kind: 'base' },
    { id: 'anual-est', name: 'Anual Estándar', price: 91390, cycle: 'YEARLY', note: 'Equiv. ~$7.616/mes', kind: 'base' },
    { id: 'anual-pre', name: 'Anual Premium', price: 133990, cycle: 'YEARLY', note: 'Equiv. ~$11.166/mes', kind: 'base' },
  ],

  max: [
    { id: 'basico-ads', name: 'Básico con anuncios', price: 5990, note: '2 pantallas · Full HD', kind: 'base' },
    { id: 'estandar', name: 'Estándar', price: 7990, note: '2 pantallas · descargas', kind: 'base' },
    { id: 'platino', name: 'Platino', price: 9990, note: '4 pantallas · 4K · Atmos', kind: 'base' },
  ],
  'hbo-max': [
    { id: 'basico-ads', name: 'Básico con anuncios', price: 5990, note: '2 pantallas', kind: 'base' },
    { id: 'estandar', name: 'Estándar', price: 7990, note: '2 pantallas', kind: 'base' },
    { id: 'platino', name: 'Platino', price: 9990, note: '4 pantallas · 4K', kind: 'base' },
  ],
  'prime-video': [
    { id: 'mensual', name: 'Mensual', price: 4990, kind: 'base' },
    { id: 'anual', name: 'Anual (equiv. mes)', price: 4160, note: 'Si pagas el pack anual', kind: 'base' },
  ],
  'paramount-plus': [
    { id: 'essential', name: 'Essential', price: 4990, kind: 'base' },
    { id: 'premium', name: 'Premium', price: 6990, kind: 'base' },
  ],
  'apple-tv-plus': [{ id: 'mensual', name: 'Mensual', price: 4990, kind: 'base' }],
  crunchyroll: [
    { id: 'fan', name: 'Fan', price: 4990, kind: 'base' },
    { id: 'mega', name: 'Mega Fan', price: 7990, kind: 'base' },
  ],
  'youtube-premium': [
    { id: 'individual', name: 'Individual', price: 7990, note: 'Incluye YouTube Music', kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 12990, note: 'Hasta 5 miembros', kind: 'base' },
  ],
  zapping: [
    { id: 'lite', name: 'Lite', price: 4990, kind: 'base' },
    { id: 'full', name: 'Full', price: 7990, kind: 'base' },
    { id: 'tnt-pack', name: 'Con TNT Sports', price: 14500, note: 'Pack deportivo aprox.', kind: 'base' },
  ],
  'directv-go': [
    { id: 'entertainment', name: 'Entertainment', price: 9990, kind: 'base' },
    { id: 'sports', name: 'Sports', price: 14990, kind: 'base' },
  ],
  mubi: [{ id: 'mensual', name: 'Mensual', price: 6900, kind: 'base' }],
  'vix-plus': [{ id: 'mensual', name: 'Mensual', price: 3990, kind: 'base' }],

  // ——— Deportes ———
  'tnt-sports': [
    { id: 'premium', name: 'TNT Sports Premium', price: 13990, note: 'Vía cable/IPTV / Max', kind: 'base' },
    { id: 'zapping', name: 'Pack Zapping Premium', price: 14500, kind: 'base' },
    { id: 'claro', name: 'Pack Claro', price: 13990, kind: 'base' },
    { id: 'entel', name: 'Entel TV Premium HD', price: 14590, kind: 'base' },
  ],
  espn: [{ id: 'premium', name: 'ESPN Premium', price: 9990, note: 'Add-on cable / Disney+', kind: 'base' }],
  'espn-premium': [{ id: 'mensual', name: 'Mensual', price: 9990, kind: 'base' }],
  dazn: [{ id: 'mensual', name: 'Mensual', price: 9990, kind: 'base' }],
  fanatiz: [{ id: 'mensual', name: 'Mensual', price: 7990, kind: 'base' }],
  'nba-league-pass': [{ id: 'mensual', name: 'League Pass', price: 14990, kind: 'base' }],

  // ——— Música ———
  spotify: [
    { id: 'estudiante', name: 'Estudiantes', price: 2700, note: 'Verificación SheerID', kind: 'base' },
    { id: 'individual', name: 'Individual', price: 4950, kind: 'base' },
    { id: 'duo', name: 'Dúo', price: 6750, note: '2 cuentas misma dirección', kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 8250, note: 'Hasta 6 cuentas', kind: 'base' },
  ],
  'apple-music': [
    { id: 'estudiante', name: 'Estudiante', price: 2490, kind: 'base' },
    { id: 'individual', name: 'Individual', price: 4990, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 7990, note: 'Hasta 6', kind: 'base' },
  ],
  'youtube-music': [
    { id: 'individual', name: 'Individual', price: 5500, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 11000, kind: 'base' },
  ],
  deezer: [
    { id: 'individual', name: 'Premium', price: 4990, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 7990, kind: 'base' },
  ],
  tidal: [
    { id: 'hifi', name: 'HiFi', price: 9990, kind: 'base' },
    { id: 'hifi-plus', name: 'HiFi Plus', price: 14990, kind: 'base' },
  ],

  // ——— Gaming ———
  'xbox-game-pass': [
    { id: 'core', name: 'Core', price: 5990, kind: 'base' },
    { id: 'standard', name: 'Standard', price: 9990, kind: 'base' },
    { id: 'ultimate', name: 'Ultimate', price: 14990, kind: 'base' },
  ],
  'ps-plus': [
    { id: 'essential', name: 'Essential', price: 5990, kind: 'base' },
    { id: 'extra', name: 'Extra', price: 9990, kind: 'base' },
    { id: 'premium', name: 'Premium', price: 12990, kind: 'base' },
  ],
  'nintendo-online': [
    { id: 'individual', name: 'Individual', price: 2990, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 5990, kind: 'base' },
    { id: 'anual', name: 'Anual individual', price: 19990, cycle: 'YEARLY', kind: 'base' },
  ],
  'ea-play': [{ id: 'mensual', name: 'Mensual', price: 4990, kind: 'base' }],
  'geforce-now': [
    { id: 'priority', name: 'Priority', price: 9990, kind: 'base' },
    { id: 'ultimate', name: 'Ultimate', price: 19990, kind: 'base' },
  ],

  // ——— Productividad ———
  'microsoft-365': [
    { id: 'personal', name: 'Personal', price: 6990, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 9990, note: 'Hasta 6', kind: 'base' },
    { id: 'anual-p', name: 'Personal anual', price: 69900, cycle: 'YEARLY', kind: 'base' },
  ],
  'google-one': [
    { id: '100', name: '100 GB', price: 1990, kind: 'base' },
    { id: '200', name: '200 GB', price: 2990, kind: 'base' },
    { id: '2tb', name: '2 TB', price: 9990, kind: 'base' },
  ],
  'icloud-plus': [
    { id: '50', name: '50 GB', price: 990, kind: 'base' },
    { id: '200', name: '200 GB', price: 2990, kind: 'base' },
    { id: '2tb', name: '2 TB', price: 9990, kind: 'base' },
  ],
  'apple-one': [
    { id: 'individual', name: 'Individual', price: 9990, kind: 'base' },
    { id: 'familiar', name: 'Familiar', price: 14990, kind: 'base' },
  ],
  notion: [{ id: 'plus', name: 'Plus', price: 9990, kind: 'base' }],
  dropbox: [
    { id: 'plus', name: 'Plus', price: 9990, kind: 'base' },
    { id: 'family', name: 'Family', price: 16990, kind: 'base' },
  ],

  // ——— IA ———
  'chatgpt-plus': [{ id: 'plus', name: 'Plus', price: 19990, kind: 'base' }],
  'claude-pro': [{ id: 'pro', name: 'Pro', price: 19990, kind: 'base' }],
  'github-copilot': [
    { id: 'individual', name: 'Individual', price: 9990, kind: 'base' },
    { id: 'business', name: 'Business', price: 18990, kind: 'base' },
  ],
  cursor: [{ id: 'pro', name: 'Pro', price: 19990, kind: 'base' }],
  'perplexity-pro': [{ id: 'pro', name: 'Pro', price: 19990, kind: 'base' }],
  midjourney: [
    { id: 'basic', name: 'Basic', price: 9990, kind: 'base' },
    { id: 'standard', name: 'Standard', price: 24990, kind: 'base' },
  ],
  'gemini-advanced': [{ id: 'ai-pro', name: 'Google AI Pro', price: 19990, kind: 'base' }],

  // ——— Diseño ———
  'canva-pro': [
    { id: 'pro', name: 'Pro', price: 9990, kind: 'base' },
    { id: 'anual', name: 'Pro anual', price: 99900, cycle: 'YEARLY', kind: 'base' },
  ],
  'adobe-cc': [
    { id: 'photo', name: 'Fotografía', price: 14990, kind: 'base' },
    { id: 'single', name: 'App individual', price: 24990, kind: 'base' },
    { id: 'all', name: 'Todas las apps', price: 34990, kind: 'base' },
  ],
  figma: [
    { id: 'professional', name: 'Professional', price: 14990, kind: 'base' },
    { id: 'organization', name: 'Organization', price: 44990, kind: 'base' },
  ],
  'capcut-pro': [{ id: 'pro', name: 'Pro', price: 7990, kind: 'base' }],

  // ——— Seguridad ———
  nordvpn: [
    { id: 'mensual', name: 'Mensual', price: 7990, kind: 'base' },
    { id: 'anual', name: 'Anual (equiv. mes)', price: 3330, cycle: 'YEARLY', kind: 'base' },
  ],
  '1password': [
    { id: 'individual', name: 'Individual', price: 3990, kind: 'base' },
    { id: 'families', name: 'Families', price: 5990, kind: 'base' },
  ],
  bitwarden: [{ id: 'premium', name: 'Premium', price: 990, kind: 'base' }],

  // ——— Telecom Chile ———
  'movistar-fibra': [
    { id: '400', name: '400 Mbps', price: 19990, kind: 'base' },
    { id: '600', name: '600 Mbps', price: 24990, kind: 'base' },
    { id: '940', name: '940 Mbps', price: 29990, kind: 'base' },
  ],
  'entel-hogar': [
    { id: '400', name: '400 Mbps', price: 18990, kind: 'base' },
    { id: '600', name: '600 Mbps', price: 22990, kind: 'base' },
  ],
  vtr: [
    { id: 'internet', name: 'Internet', price: 22990, kind: 'base' },
    { id: 'pack', name: 'Internet + TV', price: 29990, kind: 'base' },
  ],
  'wom-plan': [
    { id: 'libre', name: 'Libre', price: 7990, kind: 'base' },
    { id: 'pro', name: 'Pro', price: 9990, kind: 'base' },
    { id: 'ultra', name: 'Ultra', price: 12990, kind: 'base' },
  ],
  'claro-plan': [
    { id: 'control', name: 'Control', price: 9990, kind: 'base' },
    { id: 'libre', name: 'Libre', price: 12990, kind: 'base' },
  ],
  'gtd-fibra': [
    { id: '500', name: '500 Mbps', price: 19990, kind: 'base' },
    { id: '800', name: '800 Mbps', price: 24990, kind: 'base' },
  ],

  // ——— Delivery ———
  'uber-one': [{ id: 'mensual', name: 'Uber One', price: 4990, kind: 'base' }],
  'rappi-prime': [{ id: 'mensual', name: 'Rappi Prime', price: 4990, kind: 'base' }],
  'pedidosya-plus': [{ id: 'mensual', name: 'PedidosYa Plus', price: 3990, kind: 'base' }],
  'jumbo-prime': [{ id: 'mensual', name: 'Jumbo Prime', price: 4990, kind: 'base' }],

  // ——— Educación ———
  'duolingo-super': [
    { id: 'super', name: 'Super', price: 7990, kind: 'base' },
    { id: 'familiar', name: 'Family', price: 12990, kind: 'base' },
  ],
  'coursera-plus': [{ id: 'mensual', name: 'Plus', price: 39990, kind: 'base' }],
  domestika: [{ id: 'mensual', name: 'Unlimited', price: 9990, kind: 'base' }],

  // ——— Noticias Chile ———
  'el-mercurio': [{ id: 'digital', name: 'Digital', price: 9990, kind: 'base' }],
  'la-tercera': [{ id: 'digital', name: 'Digital / Club', price: 4990, kind: 'base' }],
};

export function getPlansForSlug(slug?: string | null): PlanOption[] {
  if (!slug) return [];
  return PLANS_BY_SLUG[slug] || [];
}

export function getBasePlans(slug?: string | null): PlanOption[] {
  return getPlansForSlug(slug).filter((p) => (p.kind || 'base') === 'base');
}

export function getAddonsForPlan(slug: string | null | undefined, planId: string | null): PlanOption[] {
  if (!slug || !planId) return [];
  return getPlansForSlug(slug).filter(
    (p) => p.kind === 'addon' && (!p.requiresPlan || p.requiresPlan.includes(planId))
  );
}

export function maxAddonCount(addon: PlanOption, planId: string): number {
  if (addon.maxPerPlan && addon.maxPerPlan[planId] != null) return addon.maxPerPlan[planId];
  return 1;
}

export const CATEGORY_META: { id: string; label: string; emoji: string }[] = [
  { id: 'Streaming', label: 'Streaming', emoji: '🎬' },
  { id: 'Deportes', label: 'Deportes', emoji: '⚽' },
  { id: 'Música', label: 'Música', emoji: '🎵' },
  { id: 'Gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'Productividad', label: 'Productividad', emoji: '💼' },
  { id: 'IA', label: 'IA', emoji: '🤖' },
  { id: 'Diseño', label: 'Diseño', emoji: '🎨' },
  { id: 'Seguridad', label: 'Seguridad', emoji: '🔐' },
  { id: 'Educación', label: 'Educación', emoji: '📚' },
  { id: 'Noticias', label: 'Noticias', emoji: '📰' },
  { id: 'Finanzas', label: 'Finanzas', emoji: '💰' },
  { id: 'Delivery', label: 'Delivery', emoji: '🚗' },
  { id: 'Telecom', label: 'Telecom', emoji: '📡' },
  { id: 'Desarrollo', label: 'Desarrollo', emoji: '💻' },
  { id: 'Citas', label: 'Citas', emoji: '💕' },
  { id: 'Lectura', label: 'Lectura', emoji: '📖' },
  { id: 'Otros', label: 'Otros', emoji: '📦' },
];
