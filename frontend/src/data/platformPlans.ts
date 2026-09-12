/**
 * Planes, add-ons y frecuencias por plataforma — mercado Chile (CLP).
 * kind: base | addon
 * requiresPlan / maxPerPlan: reglas tipo Netflix miembro extra / Max TNT
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
  { id: 'Telecom', label: 'Telecom', emoji: '📶' },
  { id: 'Otros', label: 'Otros', emoji: '📦' },
];

function m(id: string, name: string, price: number, note?: string, extra?: Partial<PlanOption>): PlanOption {
  return { id, name, price, kind: 'base', note, ...extra };
}
function y(id: string, name: string, price: number, note?: string): PlanOption {
  return { id, name, price, cycle: 'YEARLY', kind: 'base', note };
}
function addon(
  id: string,
  name: string,
  price: number,
  requiresPlan: string[],
  note?: string,
  maxPerPlan?: Record<string, number>
): PlanOption {
  return { id, name, price, kind: 'addon', requiresPlan, note, maxPerPlan };
}

export const PLANS_BY_SLUG: Record<string, PlanOption[]> = {
  // ——— STREAMING ———
  netflix: [
    m('basico', 'Basico', 6500, '1 pantalla · SD · sin miembro extra'),
    m('estandar', 'Estandar', 9990, '2 pantallas · Full HD · hasta 1 extra'),
    m('premium', 'Premium', 12990, '4 pantallas · 4K · hasta 2 extras'),
    addon('extra-miembro', 'Miembro extra', 2890, ['estandar', 'premium'], 'Cargo mensual aparte', {
      estandar: 1,
      premium: 2,
    }),
  ],
  'disney-plus': [
    m('estandar-ads', 'Estandar con anuncios', 8490, '2 pantallas · ESPN basico'),
    m('estandar', 'Estandar', 10990, 'Sin anuncios · descargas'),
    y('estandar-anual', 'Estandar anual', 91390, 'Ahorro ~30%'),
    m('premium', 'Premium', 15990, '4 pantallas · 4K · ESPN completo'),
    y('premium-anual', 'Premium anual', 133990, 'Ahorro ~30%'),
  ],
  max: [
    m('basico-ads', 'Basico con anuncios', 7190, '2 pantallas · Full HD'),
    y('basico-ads-anual', 'Basico ads anual', 59900),
    m('estandar', 'Estandar', 9590, '2 pantallas · 30 descargas'),
    y('estandar-anual', 'Estandar anual', 79900),
    m('platino', 'Platino', 11990, '4 pantallas · 4K · Atmos'),
    y('platino-anual', 'Platino anual', 99900),
    addon('tnt-addon', 'Add-on TNT Sports', 8990, ['basico-ads', 'estandar', 'platino'], 'Futbol chileno en vivo'),
  ],
  'hbo-max': [
    m('basico-ads', 'Basico con anuncios', 7190),
    m('estandar', 'Estandar', 9590),
    m('platino', 'Platino', 11990),
    addon('tnt-addon', 'Add-on TNT Sports', 8990, ['basico-ads', 'estandar', 'platino']),
  ],
  'prime-video': [
    m('mensual', 'Mensual', 5790, '3 pantallas · 4K'),
    y('anual', 'Anual', 49900, 'Ahorro ~28%'),
  ],
  'apple-tv-plus': [m('mensual', 'Apple TV+', 6500, 'Hasta 5 con En Familia iCloud')],
  'youtube-premium': [
    m('individual', 'Individual', 7990),
    m('familiar', 'Familiar', 12990, 'Hasta 5 miembros familia'),
  ],
  'paramount-plus': [
    m('essential', 'Essential', 4990, 'Con anuncios'),
    m('standard', 'Standard', 5990, 'Sin anuncios / mas catalogo'),
  ],
  'paramount-essential': [m('mensual', 'Essential', 4990)],
  zapping: [
    m('basico', 'Basico', 7990, 'Canales esenciales'),
    m('full', 'Full', 10990, 'TV en vivo Chile ampliado'),
  ],
  'star-plus': [
    m('estandar', 'Estandar', 7990),
    m('premium', 'Premium', 10990, 'Mas deportes ESPN'),
  ],
  crunchyroll: [
    m('fan', 'Fan', 4990),
    m('mega-fan', 'Mega Fan', 7990, 'Simultaneo + offline'),
  ],
  'vix-plus': [m('mensual', 'Vix+', 3990)],
  'directv-go': [
    m('entretenimiento', 'Entretenimiento', 9990),
    m('full', 'Full', 14990),
  ],
  'twitch-turbo': [m('mensual', 'Turbo', 5990, 'Sin anuncios')],
  mubi: [m('mensual', 'Mubi', 6990)],
  'plex-pass': [
    m('mensual', 'Mensual', 4990),
    y('anual', 'Anual', 39990),
  ],
  'pluto-tv': [m('gratis', 'Gratis con anuncios', 0)],
  'curiosity-stream': [m('mensual', 'Mensual', 3990)],
  nebula: [m('mensual', 'Mensual', 5990)],
  'discovery-plus': [m('mensual', 'Discovery+', 4990)],
  'apple-tv-channels': [m('mensual', 'Canal adicional', 4990)],
  'mega-go': [m('mensual', 'Mega Go', 3990)],
  'tvn-play': [m('mensual', 'TVN Play', 2990)],
  'simple-tv': [m('mensual', 'SimpleTV', 9990)],
  'a-corn-tv': [m('mensual', 'Acorn TV', 7990)],
  britbox: [m('mensual', 'BritBox', 4990)],
  'criterion-channel': [m('mensual', 'Criterion', 6990)],

  // ——— MUSICA ———
  spotify: [
    m('individual', 'Individual', 4590, '1 cuenta'),
    m('duo', 'Duo', 5890, '2 cuentas · misma direccion'),
    m('familiar', 'Familiar', 7090, 'Hasta 6 cuentas'),
    m('universitario', 'Universitario', 2490, 'Con acreditacion'),
  ],
  'apple-music': [
    m('individual', 'Individual', 4990),
    m('familiar', 'Familiar', 7990, 'Hasta 6'),
    m('universitario', 'Universitario', 2990),
  ],
  'youtube-music': [
    m('individual', 'Individual', 4990),
    m('familiar', 'Familiar', 7990),
  ],
  deezer: [
    m('premium', 'Premium', 4990),
    m('familiar', 'Familiar', 7990),
  ],
  tidal: [
    m('hifi', 'HiFi', 9990),
    m('hifi-plus', 'HiFi Plus', 14990),
  ],
  'soundcloud-go': [m('go-plus', 'Go+', 4990)],
  'amazon-music': [
    m('unlimited', 'Unlimited', 4990),
    m('familiar', 'Familiar', 7990),
  ],

  // ——— GAMING ———
  'xbox-game-pass': [
    m('core', 'Core', 6990, 'Online multiplayer'),
    m('standard', 'Standard', 9990, 'Catalogo + online'),
    m('ultimate', 'Ultimate', 14990, 'PC + consola + cloud'),
  ],
  'ps-plus': [
    m('essential', 'Essential', 7990),
    m('extra', 'Extra', 11990),
    m('premium', 'Premium', 14990),
    y('essential-anual', 'Essential anual', 49990),
  ],
  'nintendo-online': [
    m('individual', 'Individual', 2990),
    m('familiar', 'Familiar', 5990),
    y('individual-anual', 'Individual anual', 19990),
  ],
  'ea-play': [m('mensual', 'EA Play', 4990)],
  'geforce-now': [
    m('priority', 'Priority', 9990),
    m('ultimate', 'Ultimate', 19990),
  ],
  'apple-arcade': [m('mensual', 'Arcade', 4990)],
  steam: [m('saldo', 'Saldo / compras', 0, 'Sin cuota fija')],
  'epic-games': [m('gratis', 'Store + free games', 0)],
  'ubisoft-plus': [m('mensual', 'Ubisoft+', 14990)],
  'humble-choice': [m('mensual', 'Humble Choice', 11990)],
  'play-pass': [m('mensual', 'Play Pass', 2990)],
  'roblox-premium': [
    m('premium-450', 'Premium 450', 4990),
    m('premium-1000', 'Premium 1000', 9990),
  ],

  // ——— DEPORTES / FITNESS ———
  'tnt-sports': [m('mensual', 'TNT Sports', 12990, 'Futbol chileno')],
  espn: [m('mensual', 'ESPN', 9990)],
  'espn-premium': [m('mensual', 'ESPN Premium', 9990)],
  dazn: [m('mensual', 'DAZN', 9990)],
  fanatiz: [m('mensual', 'Fanatiz', 7990)],
  'nba-league-pass': [m('mensual', 'NBA League Pass', 14990)],
  strava: [
    m('mensual', 'Strava Sub', 7990),
    y('anual', 'Anual', 59900),
  ],
  headspace: [m('mensual', 'Headspace', 9990)],
  calm: [m('mensual', 'Calm', 9990)],
  myfitnesspal: [m('premium', 'Premium', 4990)],
  peloton: [m('app', 'App', 12990)],
  'fitbit-premium': [m('mensual', 'Premium', 7990)],
  whoop: [m('membership', 'Membership', 29990)],

  // ——— PRODUCTIVIDAD ———
  'microsoft-365': [
    m('personal', 'Personal', 6990),
    m('familiar', 'Familiar', 9990),
    y('personal-anual', 'Personal anual', 69900),
  ],
  'google-one': [
    m('100gb', '100 GB', 1990),
    m('200gb', '200 GB', 2990),
    m('2tb', '2 TB', 9990),
  ],
  notion: [
    m('plus', 'Plus', 9990),
    m('business', 'Business', 14990),
  ],
  'icloud-plus': [
    m('50gb', '50 GB', 990),
    m('200gb', '200 GB', 2990),
    m('2tb', '2 TB', 9990),
  ],
  dropbox: [
    m('plus', 'Plus', 9990),
    m('family', 'Family', 16990),
  ],
  slack: [
    m('pro', 'Pro', 7990),
    m('business', 'Business+', 14990),
  ],
  'zoom-pro': [
    m('pro', 'Pro', 14990),
    m('business', 'Business', 19990),
  ],
  'linkedin-premium': [
    m('career', 'Career', 29990),
    m('business', 'Business', 49990),
  ],
  todoist: [m('pro', 'Pro', 4990)],
  evernote: [m('personal', 'Personal', 7990)],
  grammarly: [m('premium', 'Premium', 11990)],
  trello: [m('premium', 'Premium', 5990)],
  asana: [m('premium', 'Premium', 10990)],
  clickup: [m('unlimited', 'Unlimited', 5990)],
  linear: [m('basic', 'Basic', 8000)],
  monday: [m('basic', 'Basic', 8990)],

  // ——— SEGURIDAD ———
  nordvpn: [
    m('mensual', 'Mensual', 7990),
    y('anual', 'Anual', 39990),
  ],
  expressvpn: [m('mensual', 'Mensual', 9990)],
  surfshark: [
    m('mensual', 'Mensual', 4990),
    y('anual', 'Anual', 29990),
  ],
  '1password': [
    m('individual', 'Individual', 3990),
    m('families', 'Families', 6990),
  ],
  bitwarden: [m('premium', 'Premium', 990)],
  lastpass: [m('premium', 'Premium', 2990)],
  'norton-360': [m('standard', 'Standard', 4990)],
  dashlane: [m('premium', 'Premium', 4990)],

  // ——— IA ———
  'chatgpt-plus': [m('plus', 'Plus', 19990)],
  'claude-pro': [m('pro', 'Pro', 19990)],
  'github-copilot': [
    m('individual', 'Individual', 9990),
    m('business', 'Business', 19990),
  ],
  midjourney: [
    m('basic', 'Basic', 9990),
    m('standard', 'Standard', 24990),
  ],
  cursor: [m('pro', 'Pro', 19990)],
  'perplexity-pro': [m('pro', 'Pro', 19990)],
  'notion-ai': [m('add-on', 'Notion AI', 9990)],
  runway: [m('standard', 'Standard', 14990)],
  elevenlabs: [m('starter', 'Starter', 4990)],
  'gemini-advanced': [m('advanced', 'Advanced (AI Pro)', 19990)],

  // ——— DISENO ———
  'canva-pro': [
    m('pro', 'Pro', 9990),
    y('pro-anual', 'Pro anual', 99900),
  ],
  'adobe-cc': [
    m('fotografia', 'Fotografia', 19990),
    m('all-apps', 'All Apps', 34990),
  ],
  'adobe-express': [m('premium', 'Premium', 9990)],
  figma: [
    m('professional', 'Professional', 14990),
    m('organization', 'Organization', 24990),
  ],
  'capcut-pro': [m('pro', 'Pro', 7990)],
  envato: [m('elements', 'Elements', 16990)],
  shutterstock: [m('mensual', 'Mensual', 24990)],
  'unsplash-plus': [m('plus', 'Plus', 9990)],

  // ——— EDUCACION ———
  'duolingo-super': [
    m('super', 'Super', 7990),
    m('familiar', 'Familiar', 12990),
  ],
  'coursera-plus': [m('plus', 'Plus', 39990)],
  domestika: [m('mensual', 'Mensual', 9990)],
  skillshare: [m('premium', 'Premium', 9990)],
  masterclass: [m('standard', 'Standard', 14990)],
  udemy: [m('personal', 'Compras / Personal Plan', 0, 'Sin cuota fija tipica')],
  babbel: [m('mensual', 'Mensual', 7990)],
  brilliant: [m('premium', 'Premium', 14990)],

  // ——— NOTICIAS ———
  'el-mercurio': [m('digital', 'Digital', 9990)],
  'la-tercera': [m('digital', 'Digital', 4990)],
  emol: [m('digital', 'Digital', 3990)],
  nytimes: [m('digital', 'Digital', 4990)],
  'washington-post': [m('digital', 'Digital', 4990)],
  'the-economist': [m('digital', 'Digital', 19990)],
  bloomberg: [m('digital', 'Digital', 34990)],
  medium: [m('membership', 'Membership', 4990)],
  'club-la-tercera': [m('club', 'Club', 4990)],

  // ——— FINANZAS (muchas sin cuota fija) ———
  fintual: [m('sin-cuota', 'Sin cuota fija', 0, 'Comision sobre administracion')],
  racional: [m('sin-cuota', 'Sin cuota fija', 0)],
  tenpo: [m('gratis', 'Cuenta gratis', 0)],
  mach: [m('gratis', 'Cuenta gratis', 0)],
  'mercado-pago': [m('gratis', 'Cuenta gratis', 0)],
  binance: [m('sin-cuota', 'Sin cuota fija', 0)],
  'crypto-com': [m('sin-cuota', 'Sin cuota fija', 0)],

  // ——— DELIVERY ———
  'uber-one': [m('mensual', 'Uber One', 4990)],
  'rappi-prime': [m('mensual', 'Rappi Prime', 4990)],
  'pedidosya-plus': [m('mensual', 'PedidosYa Plus', 3990)],
  cornershop: [m('sin-membresia', 'Sin membresia fija', 0)],
  cabify: [m('sin-membresia', 'Sin membresia fija', 0)],
  'didi-club': [m('club', 'DiDi Club', 2990)],
  'jumbo-prime': [m('prime', 'Jumbo Prime', 4990)],

  // ——— DESARROLLO ———
  'github-pro': [m('pro', 'Pro', 3990)],
  'vercel-pro': [m('pro', 'Pro', 19990)],
  render: [m('starter', 'Starter / Pro', 7000)],
  'supabase-pro': [m('pro', 'Pro', 24990)],
  digitalocean: [m('droplet-basico', 'Droplet basico', 6000)],
  aws: [m('payg', 'Pay as you go', 0, 'Variable')],
  jetbrains: [m('all-products', 'All Products Pack', 19990)],

  // ——— CITAS ———
  'tinder-gold': [
    m('gold', 'Gold', 14990),
    m('platinum', 'Platinum', 19990),
  ],
  'bumble-premium': [m('premium', 'Premium', 12990)],
  'hinge-plus': [m('plus', 'Hinge+', 14990)],
  'badoo-premium': [m('premium', 'Premium', 9990)],

  // ——— LECTURA ———
  audible: [m('plus', 'Plus', 14990)],
  blinkist: [m('premium', 'Premium', 9990)],
  'kindle-unlimited': [m('mensual', 'Unlimited', 9990)],
  scribd: [m('mensual', 'Scribd', 9990)],

  // ——— TELECOM (planes referenciales) ———
  'movistar-fibra': [m('hogar', 'Plan hogar ref.', 24990)],
  vtr: [m('hogar', 'Plan hogar ref.', 25990)],
  'entel-hogar': [m('hogar', 'Plan hogar ref.', 22990)],
  'wom-plan': [m('movil', 'Plan movil ref.', 9990)],
  'claro-plan': [m('movil', 'Plan movil ref.', 10990)],
  'gtd-fibra': [m('hogar', 'Plan hogar ref.', 21990)],
  'mundo-pacifico': [m('hogar', 'Plan hogar ref.', 19990)],
  telsur: [m('hogar', 'Plan hogar ref.', 18990)],

  // ——— OTROS ———
  'discord-nitro': [
    m('basic', 'Basic', 2990),
    m('nitro', 'Nitro', 4990),
  ],
  'meta-verified': [m('verified', 'Verified', 7990)],
  cinemark: [m('socio', 'Socio / combo', 0, 'Variable')],
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
