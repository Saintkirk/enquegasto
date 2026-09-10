/**
 * Planes referenciales CLP — mercado Chile (2025-2026).
 * Fuentes: sitios oficiales / Entel / comparativas locales.
 * Los precios pueden variar; el usuario puede editar el monto.
 */
export type PlanOption = {
  id: string;
  name: string;
  price: number;
  /** Ciclo sugerido */
  cycle?: 'MONTHLY' | 'YEARLY';
  note?: string;
};

export const PLANS_BY_SLUG: Record<string, PlanOption[]> = {
  // ——— Streaming ———
  netflix: [
    { id: 'basico', name: 'Básico', price: 7190, note: '1 pantalla · HD' },
    { id: 'estandar', name: 'Estándar', price: 9990, note: '2 pantallas · Full HD' },
    { id: 'premium', name: 'Premium', price: 12990, note: '4 pantallas · 4K' },
    { id: 'extra', name: 'Miembro extra', price: 2890, note: 'Add-on Estándar/Premium' },
  ],
  'disney-plus': [
    { id: 'ads', name: 'Estándar con anuncios', price: 8490, note: '2 pantallas · ESPN parcial' },
    { id: 'estandar', name: 'Estándar', price: 10990, note: '2 pantallas · Full HD' },
    { id: 'premium', name: 'Premium', price: 15990, note: '4 pantallas · 4K · ESPN full' },
    { id: 'anual-est', name: 'Anual Estándar', price: 91390, cycle: 'YEARLY', note: 'Equiv. ~$7.616/mes' },
    { id: 'anual-pre', name: 'Anual Premium', price: 133990, cycle: 'YEARLY', note: 'Equiv. ~$11.166/mes' },
  ],
  max: [
    { id: 'basico-ads', name: 'Básico con anuncios', price: 5990, note: '2 pantallas · Full HD' },
    { id: 'estandar', name: 'Estándar', price: 7990, note: '2 pantallas · descargas' },
    { id: 'platino', name: 'Platino', price: 9990, note: '4 pantallas · 4K · Atmos' },
  ],
  'hbo-max': [
    { id: 'basico-ads', name: 'Básico con anuncios', price: 5990, note: '2 pantallas' },
    { id: 'estandar', name: 'Estándar', price: 7990, note: '2 pantallas' },
    { id: 'platino', name: 'Platino', price: 9990, note: '4 pantallas · 4K' },
  ],
  'prime-video': [
    { id: 'mensual', name: 'Mensual', price: 4990 },
    { id: 'anual', name: 'Anual (equiv. mes)', price: 4160, note: 'Si pagas el pack anual' },
  ],
  'paramount-plus': [
    { id: 'essential', name: 'Essential', price: 4990 },
    { id: 'premium', name: 'Premium', price: 6990 },
  ],
  'apple-tv-plus': [{ id: 'mensual', name: 'Mensual', price: 4990 }],
  crunchyroll: [
    { id: 'fan', name: 'Fan', price: 4990 },
    { id: 'mega', name: 'Mega Fan', price: 7990 },
  ],
  'youtube-premium': [
    { id: 'individual', name: 'Individual', price: 7990, note: 'Incluye YouTube Music' },
    { id: 'familiar', name: 'Familiar', price: 12990, note: 'Hasta 5 miembros' },
  ],
  zapping: [
    { id: 'lite', name: 'Lite', price: 4990 },
    { id: 'full', name: 'Full', price: 7990 },
    { id: 'tnt-pack', name: 'Con TNT Sports', price: 14500, note: 'Pack deportivo aprox.' },
  ],
  'directv-go': [
    { id: 'entertainment', name: 'Entertainment', price: 9990 },
    { id: 'sports', name: 'Sports', price: 14990 },
  ],
  mubi: [{ id: 'mensual', name: 'Mensual', price: 6900 }],
  'vix-plus': [{ id: 'mensual', name: 'Mensual', price: 3990 }],

  // ——— Deportes ———
  'tnt-sports': [
    { id: 'premium', name: 'TNT Sports Premium', price: 13990, note: 'Vía cable/IPTV / Max' },
    { id: 'zapping', name: 'Pack Zapping Premium', price: 14500 },
    { id: 'claro', name: 'Pack Claro', price: 13990 },
    { id: 'entel', name: 'Entel TV Premium HD', price: 14590 },
  ],
  espn: [{ id: 'premium', name: 'ESPN Premium', price: 9990, note: 'Add-on cable / Disney+' }],
  'espn-premium': [{ id: 'mensual', name: 'Mensual', price: 9990 }],
  dazn: [{ id: 'mensual', name: 'Mensual', price: 9990 }],
  fanatiz: [{ id: 'mensual', name: 'Mensual', price: 7990 }],
  'nba-league-pass': [{ id: 'mensual', name: 'League Pass', price: 14990 }],

  // ——— Música ———
  spotify: [
    { id: 'estudiante', name: 'Estudiantes', price: 2700, note: 'Verificación SheerID' },
    { id: 'individual', name: 'Individual', price: 4950 },
    { id: 'duo', name: 'Dúo', price: 6750, note: '2 cuentas misma dirección' },
    { id: 'familiar', name: 'Familiar', price: 8250, note: 'Hasta 6 cuentas' },
  ],
  'apple-music': [
    { id: 'estudiante', name: 'Estudiante', price: 2490 },
    { id: 'individual', name: 'Individual', price: 4990 },
    { id: 'familiar', name: 'Familiar', price: 7990, note: 'Hasta 6' },
  ],
  'youtube-music': [
    { id: 'individual', name: 'Individual', price: 5500 },
    { id: 'familiar', name: 'Familiar', price: 11000 },
  ],
  deezer: [
    { id: 'individual', name: 'Premium', price: 4990 },
    { id: 'familiar', name: 'Familiar', price: 7990 },
  ],
  tidal: [
    { id: 'hifi', name: 'HiFi', price: 9990 },
    { id: 'hifi-plus', name: 'HiFi Plus', price: 14990 },
  ],

  // ——— Gaming ———
  'xbox-game-pass': [
    { id: 'core', name: 'Core', price: 5990 },
    { id: 'standard', name: 'Standard', price: 9990 },
    { id: 'ultimate', name: 'Ultimate', price: 14990 },
  ],
  'ps-plus': [
    { id: 'essential', name: 'Essential', price: 5990 },
    { id: 'extra', name: 'Extra', price: 9990 },
    { id: 'premium', name: 'Premium', price: 12990 },
  ],
  'nintendo-online': [
    { id: 'individual', name: 'Individual', price: 2990 },
    { id: 'familiar', name: 'Familiar', price: 5990 },
    { id: 'anual', name: 'Anual individual', price: 19990, cycle: 'YEARLY' },
  ],
  'ea-play': [{ id: 'mensual', name: 'Mensual', price: 4990 }],
  'geforce-now': [
    { id: 'priority', name: 'Priority', price: 9990 },
    { id: 'ultimate', name: 'Ultimate', price: 19990 },
  ],

  // ——— Productividad ———
  'microsoft-365': [
    { id: 'personal', name: 'Personal', price: 6990 },
    { id: 'familiar', name: 'Familiar', price: 9990, note: 'Hasta 6' },
    { id: 'anual-p', name: 'Personal anual', price: 69900, cycle: 'YEARLY' },
  ],
  'google-one': [
    { id: '100', name: '100 GB', price: 1990 },
    { id: '200', name: '200 GB', price: 2990 },
    { id: '2tb', name: '2 TB', price: 9990 },
  ],
  'icloud-plus': [
    { id: '50', name: '50 GB', price: 990 },
    { id: '200', name: '200 GB', price: 2990 },
    { id: '2tb', name: '2 TB', price: 9990 },
  ],
  'apple-one': [
    { id: 'individual', name: 'Individual', price: 9990 },
    { id: 'familiar', name: 'Familiar', price: 14990 },
  ],
  notion: [{ id: 'plus', name: 'Plus', price: 9990 }],
  dropbox: [
    { id: 'plus', name: 'Plus', price: 9990 },
    { id: 'family', name: 'Family', price: 16990 },
  ],

  // ——— IA ———
  'chatgpt-plus': [{ id: 'plus', name: 'Plus', price: 19990 }],
  'claude-pro': [{ id: 'pro', name: 'Pro', price: 19990 }],
  'github-copilot': [
    { id: 'individual', name: 'Individual', price: 9990 },
    { id: 'business', name: 'Business', price: 18990 },
  ],
  cursor: [{ id: 'pro', name: 'Pro', price: 19990 }],
  'perplexity-pro': [{ id: 'pro', name: 'Pro', price: 19990 }],
  midjourney: [
    { id: 'basic', name: 'Basic', price: 9990 },
    { id: 'standard', name: 'Standard', price: 24990 },
  ],
  'gemini-advanced': [{ id: 'ai-pro', name: 'Google AI Pro', price: 19990 }],

  // ——— Diseño ———
  'canva-pro': [
    { id: 'pro', name: 'Pro', price: 9990 },
    { id: 'anual', name: 'Pro anual', price: 99900, cycle: 'YEARLY' },
  ],
  'adobe-cc': [
    { id: 'photo', name: 'Fotografía', price: 14990 },
    { id: 'single', name: 'App individual', price: 24990 },
    { id: 'all', name: 'Todas las apps', price: 34990 },
  ],
  figma: [
    { id: 'professional', name: 'Professional', price: 14990 },
    { id: 'organization', name: 'Organization', price: 44990 },
  ],
  'capcut-pro': [{ id: 'pro', name: 'Pro', price: 7990 }],

  // ——— Seguridad ———
  nordvpn: [
    { id: 'mensual', name: 'Mensual', price: 7990 },
    { id: 'anual', name: 'Anual (equiv. mes)', price: 3330, cycle: 'YEARLY' },
  ],
  '1password': [
    { id: 'individual', name: 'Individual', price: 3990 },
    { id: 'families', name: 'Families', price: 5990 },
  ],
  bitwarden: [{ id: 'premium', name: 'Premium', price: 990 }],

  // ——— Telecom Chile ———
  'movistar-fibra': [
    { id: '400', name: '400 Mbps', price: 19990 },
    { id: '600', name: '600 Mbps', price: 24990 },
    { id: '940', name: '940 Mbps', price: 29990 },
  ],
  'entel-hogar': [
    { id: '400', name: '400 Mbps', price: 18990 },
    { id: '600', name: '600 Mbps', price: 22990 },
  ],
  vtr: [
    { id: 'internet', name: 'Internet', price: 22990 },
    { id: 'pack', name: 'Internet + TV', price: 29990 },
  ],
  'wom-plan': [
    { id: 'libre', name: 'Libre', price: 7990 },
    { id: 'pro', name: 'Pro', price: 9990 },
    { id: 'ultra', name: 'Ultra', price: 12990 },
  ],
  'claro-plan': [
    { id: 'control', name: 'Control', price: 9990 },
    { id: 'libre', name: 'Libre', price: 12990 },
  ],
  'gtd-fibra': [
    { id: '500', name: '500 Mbps', price: 19990 },
    { id: '800', name: '800 Mbps', price: 24990 },
  ],

  // ——— Delivery ———
  'uber-one': [{ id: 'mensual', name: 'Uber One', price: 4990 }],
  'rappi-prime': [{ id: 'mensual', name: 'Rappi Prime', price: 4990 }],
  'pedidosya-plus': [{ id: 'mensual', name: 'PedidosYa Plus', price: 3990 }],
  'jumbo-prime': [{ id: 'mensual', name: 'Jumbo Prime', price: 4990 }],

  // ——— Educación ———
  'duolingo-super': [
    { id: 'super', name: 'Super', price: 7990 },
    { id: 'familiar', name: 'Family', price: 12990 },
  ],
  'coursera-plus': [{ id: 'mensual', name: 'Plus', price: 39990 }],
  domestika: [{ id: 'mensual', name: 'Unlimited', price: 9990 }],

  // ——— Noticias Chile ———
  'el-mercurio': [{ id: 'digital', name: 'Digital', price: 9990 }],
  'la-tercera': [{ id: 'digital', name: 'Digital / Club', price: 4990 }],
};

export function getPlansForSlug(slug?: string | null): PlanOption[] {
  if (!slug) return [];
  return PLANS_BY_SLUG[slug] || [];
}

/** Categorías oficiales del catálogo (orden UI) */
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
