/** Planes referenciales CLP por slug de plataforma (Chile) */
export type PlanOption = { id: string; name: string; price: number };

export const PLANS_BY_SLUG: Record<string, PlanOption[]> = {
  netflix: [
    { id: 'ads', name: 'Estándar con anuncios', price: 4990 },
    { id: 'standard', name: 'Estándar', price: 7990 },
    { id: 'premium', name: 'Premium', price: 9990 },
  ],
  'disney-plus': [
    { id: 'standard', name: 'Estándar', price: 6990 },
    { id: 'premium', name: 'Premium', price: 8990 },
    { id: 'combo', name: 'Combo Star+', price: 10990 },
  ],
  max: [
    { id: 'essential', name: 'Esencial con anuncios', price: 4990 },
    { id: 'standard', name: 'Estándar', price: 7990 },
    { id: 'platinum', name: 'Platino', price: 11990 },
  ],
  'hbo-max': [
    { id: 'essential', name: 'Esencial con anuncios', price: 4990 },
    { id: 'standard', name: 'Estándar', price: 7990 },
    { id: 'platinum', name: 'Platino', price: 11990 },
  ],
  'prime-video': [
    { id: 'monthly', name: 'Mensual', price: 4990 },
    { id: 'annual', name: 'Anual (equiv. mes)', price: 4160 },
  ],
  spotify: [
    { id: 'individual', name: 'Individual', price: 4990 },
    { id: 'duo', name: 'Duo', price: 6490 },
    { id: 'family', name: 'Familiar', price: 7990 },
    { id: 'student', name: 'Estudiante', price: 2490 },
  ],
  'apple-music': [
    { id: 'individual', name: 'Individual', price: 4990 },
    { id: 'family', name: 'Familiar', price: 7990 },
    { id: 'student', name: 'Estudiante', price: 2490 },
  ],
  'youtube-premium': [
    { id: 'individual', name: 'Individual', price: 7990 },
    { id: 'family', name: 'Familiar', price: 12990 },
  ],
  'paramount-plus': [
    { id: 'essential', name: 'Essential', price: 4990 },
    { id: 'premium', name: 'Premium', price: 6990 },
  ],
  'star-plus': [
    { id: 'standard', name: 'Estándar', price: 7990 },
    { id: 'combo', name: 'Combo Disney+', price: 10990 },
  ],
  'tnt-sports': [
    { id: 'monthly', name: 'Mensual', price: 12990 },
    { id: 'annual', name: 'Anual (equiv. mes)', price: 9990 },
  ],
  espn: [
    { id: 'monthly', name: 'Mensual', price: 9990 },
  ],
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
  'microsoft-365': [
    { id: 'personal', name: 'Personal', price: 6990 },
    { id: 'family', name: 'Familiar', price: 9990 },
  ],
  'canva-pro': [
    { id: 'pro', name: 'Pro', price: 9990 },
    { id: 'teams', name: 'Teams', price: 14990 },
  ],
  'adobe-cc': [
    { id: 'photo', name: 'Fotografía', price: 14990 },
    { id: 'single', name: 'App individual', price: 24990 },
    { id: 'all', name: 'Todas las apps', price: 34990 },
  ],
  'chatgpt-plus': [{ id: 'plus', name: 'Plus', price: 19990 }],
  'claude-pro': [{ id: 'pro', name: 'Pro', price: 19990 }],
  'google-one': [
    { id: '100gb', name: '100 GB', price: 1990 },
    { id: '200gb', name: '200 GB', price: 2990 },
    { id: '2tb', name: '2 TB', price: 9990 },
  ],
  'icloud-plus': [
    { id: '50gb', name: '50 GB', price: 990 },
    { id: '200gb', name: '200 GB', price: 2990 },
    { id: '2tb', name: '2 TB', price: 9990 },
  ],
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
  zapping: [
    { id: 'full', name: 'Full', price: 7990 },
    { id: 'lite', name: 'Lite', price: 4990 },
  ],
  'directv-go': [
    { id: 'entertainment', name: 'Entertainment', price: 9990 },
    { id: 'sports', name: 'Sports', price: 14990 },
  ],
};

export function getPlansForSlug(slug?: string | null): PlanOption[] {
  if (!slug) return [];
  return PLANS_BY_SLUG[slug] || [];
}
