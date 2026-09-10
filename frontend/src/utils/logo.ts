/**
 * Logos de plataformas con AVIF / WebP (wsrv.nl) y fallback PNG/favicon.
 *
 * Compresión orientada a iconos 16–128px (no fotos):
 * - AVIF q≈45–55 → ~40–60% menos que WebP a calidad visual similar
 * - WebP q≈70
 * - fit=contain + fondo transparente donde aplique
 */

export type FaviconSize = 16 | 32 | 64 | 128;

export type LogoSources = {
  original: string;
  avif: string;
  webp: string;
};

const cache = new Map<string, LogoSources | null>();

/** Calidad según formato y tamaño de display */
function qualityFor(output: 'avif' | 'webp' | 'png', size: number): number {
  if (output === 'png') return 80;
  // Logos pequeños toleran más compresión sin pérdida visible
  if (output === 'avif') {
    if (size <= 32) return 40;
    if (size <= 64) return 48;
    return 55;
  }
  // webp
  if (size <= 32) return 65;
  if (size <= 64) return 72;
  return 78;
}

function hostFromWebsite(websiteUrl: string): string | null {
  try {
    return new URL(websiteUrl).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function logoFromWebsite(
  websiteUrl?: string | null,
  size: FaviconSize = 64
): string | null {
  if (!websiteUrl) return null;
  const host = hostFromWebsite(websiteUrl);
  if (!host) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
}

/**
 * wsrv.nl params de compresión:
 * - q: calidad 1–100
 * - n: 1 = sin upscale innecesario / max compression effort en algunos builds
 * - output: avif | webp | png
 * - il: interlaced (webp) — omitimos en avif
 * - a: 1 fuerza alpha cuando existe
 */
function viaWsrv(
  sourceUrl: string,
  size: number,
  output: 'avif' | 'webp' | 'png'
): string {
  const q = qualityFor(output, size);
  const params = new URLSearchParams({
    url: sourceUrl.replace(/^https?:\/\//, ''),
    w: String(size),
    h: String(size),
    fit: 'contain',
    output,
    q: String(q),
    // Esfuerzo de compresión (wsrv usa `l` level en algunos backends; `n`=max effort)
    n: '-1',
  });

  // WebP: progressive/interlace ligero ayuda en listas largas
  if (output === 'webp') {
    params.set('il', '');
  }

  return `https://wsrv.nl/?${params.toString()}`;
}

function resolveBaseUrl(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize
): string | null {
  if (platform.logoUrl) {
    if (platform.logoUrl.includes('google.com/s2/favicons') && platform.websiteUrl) {
      return logoFromWebsite(platform.websiteUrl, size);
    }
    return platform.logoUrl;
  }
  return logoFromWebsite(platform.websiteUrl, size);
}

export function platformLogoSources(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize = 64
): LogoSources | null {
  const key = `${platform.logoUrl || ''}|${platform.websiteUrl || ''}|${size}|v2`;
  if (cache.has(key)) return cache.get(key)!;

  const original = resolveBaseUrl(platform, size);
  if (!original) {
    cache.set(key, null);
    return null;
  }

  // Fuente a 128px → wsrv escala + comprime (mejor nitidez en retina)
  const sourceForProxy = original.includes('google.com/s2/favicons')
    ? logoFromWebsite(platform.websiteUrl, 128) || original
    : original;

  const sources: LogoSources = {
    original,
    avif: viaWsrv(sourceForProxy, size, 'avif'),
    webp: viaWsrv(sourceForProxy, size, 'webp'),
  };

  cache.set(key, sources);
  return sources;
}

export function platformLogo(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize = 64
): string | null {
  const s = platformLogoSources(platform, size);
  return s?.webp || s?.original || null;
}

export function faviconSizeFor(cssPx: number): FaviconSize {
  if (cssPx <= 20) return 16;
  if (cssPx <= 40) return 32;
  if (cssPx <= 72) return 64;
  return 128;
}
