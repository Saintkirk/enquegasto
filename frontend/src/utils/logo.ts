/**
 * Logos de plataformas — favicon por dominio (Google s2).
 * Pedimos el tamaño justo para no descargar 128px en listas de 36px.
 */

const logoCache = new Map<string, string | null>();

export function logoFromWebsite(
  websiteUrl?: string | null,
  size: 16 | 32 | 64 | 128 = 64
): string | null {
  if (!websiteUrl) return null;
  const key = `${websiteUrl}|${size}`;
  if (logoCache.has(key)) return logoCache.get(key)!;

  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
    // Google favicon CDN — sz acotado al display real
    const url = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
    logoCache.set(key, url);
    return url;
  } catch {
    logoCache.set(key, null);
    return null;
  }
}

export function platformLogo(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: 16 | 32 | 64 | 128 = 64
): string | null {
  // Si el logoUrl es genérico de Google a 128, regeneramos al tamaño pedido
  if (platform.logoUrl?.includes('google.com/s2/favicons')) {
    return logoFromWebsite(platform.websiteUrl, size) || platform.logoUrl;
  }
  if (platform.logoUrl) return platform.logoUrl;
  return logoFromWebsite(platform.websiteUrl, size);
}

/** Tamaño de favicon recomendado según el lado CSS en px */
export function faviconSizeFor(cssPx: number): 16 | 32 | 64 | 128 {
  if (cssPx <= 20) return 16;
  if (cssPx <= 40) return 32;
  if (cssPx <= 72) return 64;
  return 128;
}
