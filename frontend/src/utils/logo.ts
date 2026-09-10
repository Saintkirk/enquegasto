/**
 * Logos de plataformas con AVIF / WebP (wsrv.nl) y fallback PNG/favicon.
 *
 * Flujo:
 * 1. Favicon Google del dominio (fuente estable)
 * 2. Proxy wsrv.nl → AVIF y WebP al tamaño exacto
 * 3. <picture> elige el mejor formato que soporte el navegador
 */

export type FaviconSize = 16 | 32 | 64 | 128;

export type LogoSources = {
  /** Origen sin transformar (favicon) */
  original: string;
  avif: string;
  webp: string;
};

const cache = new Map<string, LogoSources | null>();

function hostFromWebsite(websiteUrl: string): string | null {
  try {
    return new URL(websiteUrl).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Favicon Google del dominio (fuente) */
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
 * Reescribe cualquier URL de imagen a través de wsrv.nl en un formato dado.
 * w = tamaño de salida; output = avif | webp | png
 */
function viaWsrv(
  sourceUrl: string,
  size: number,
  output: 'avif' | 'webp' | 'png'
): string {
  const params = new URLSearchParams({
    url: sourceUrl.replace(/^https?:\/\//, ''),
    w: String(size),
    h: String(size),
    fit: 'contain',
    output,
    // we: true en wsrv usa default si falla; sin default mostramos error y caemos a emoji
  });
  return `https://wsrv.nl/?${params.toString()}`;
}

/** Resuelve URL base del logo (logoUrl propio o favicon del sitio) */
function resolveBaseUrl(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize
): string | null {
  if (platform.logoUrl) {
    // Si ya es favicon Google a otro sz, regeneramos al tamaño pedido
    if (platform.logoUrl.includes('google.com/s2/favicons') && platform.websiteUrl) {
      return logoFromWebsite(platform.websiteUrl, size);
    }
    return platform.logoUrl;
  }
  return logoFromWebsite(platform.websiteUrl, size);
}

/**
 * Fuentes optimizadas para <picture>:
 * AVIF → WebP → original (PNG/ICO)
 */
export function platformLogoSources(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize = 64
): LogoSources | null {
  const key = `${platform.logoUrl || ''}|${platform.websiteUrl || ''}|${size}`;
  if (cache.has(key)) return cache.get(key)!;

  const original = resolveBaseUrl(platform, size);
  if (!original) {
    cache.set(key, null);
    return null;
  }

  // Pedimos un poco más grande a Google y dejamos que wsrv reescale (mejor nitidez)
  const sourceForProxy =
    platform.websiteUrl && !platform.logoUrl?.startsWith('http')
      ? logoFromWebsite(platform.websiteUrl, 128) || original
      : original.includes('google.com/s2/favicons')
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

/** Compat: una sola URL (webp preferido para callers antiguos) */
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
