/**
 * Logos simples y estables: logoUrl de la API o favicon Google del dominio.
 * (Sin proxy wsrv — AVIF estaba deshabilitado y rompía la carga.)
 */

export type FaviconSize = 16 | 32 | 64 | 128;

export function logoFromWebsite(
  websiteUrl?: string | null,
  size: FaviconSize = 64
): string | null {
  if (!websiteUrl) return null;
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
  } catch {
    return null;
  }
}

export function platformLogo(
  platform: { logoUrl?: string | null; websiteUrl?: string | null },
  size: FaviconSize = 64
): string | null {
  if (platform.logoUrl && !platform.logoUrl.includes('wsrv.nl')) {
    // Si es favicon Google genérico, preferimos regenerar al tamaño pedido
    if (platform.logoUrl.includes('google.com/s2/favicons') && platform.websiteUrl) {
      return logoFromWebsite(platform.websiteUrl, size) || platform.logoUrl;
    }
    return platform.logoUrl;
  }
  return logoFromWebsite(platform.websiteUrl, size);
}

export function faviconSizeFor(cssPx: number): FaviconSize {
  if (cssPx <= 20) return 16;
  if (cssPx <= 40) return 32;
  if (cssPx <= 72) return 64;
  return 128;
}
