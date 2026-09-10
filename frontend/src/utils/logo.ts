/** Logo por dominio (Clearbit) con fallback a favicon Google */
export function logoFromWebsite(websiteUrl?: string | null, size = 64): string | null {
  if (!websiteUrl) return null;
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
  } catch {
    return null;
  }
}

export function platformLogo(platform: {
  logoUrl?: string | null;
  websiteUrl?: string | null;
}): string | null {
  return platform.logoUrl || logoFromWebsite(platform.websiteUrl);
}
