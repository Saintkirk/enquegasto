import { useState, useMemo, memo } from 'react';
import { platformLogoSources, faviconSizeFor } from '../utils/logo';

interface Props {
  platform?: {
    name?: string;
    category?: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
  } | null;
  /** Lado en px del contenedor visual */
  size?: number;
  /** Emoji de respaldo */
  fallback?: string;
  className?: string;
  /** Prioridad alta solo above-the-fold */
  priority?: boolean;
}

/**
 * Logo con <picture>:
 * AVIF → WebP → PNG/favicon → emoji
 */
function PlatformLogoInner({
  platform,
  size = 36,
  fallback = '📦',
  className = '',
  priority = false,
}: Props) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const favSize = faviconSizeFor(size);

  const sources = useMemo(
    () => (platform ? platformLogoSources(platform, favSize) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [platform?.logoUrl, platform?.websiteUrl, favSize]
  );

  const box = { width: size, height: size } as const;

  if (!sources || status === 'error') {
    return (
      <div
        style={box}
        className={`flex shrink-0 items-center justify-center rounded-xl bg-slate-100 ${className}`}
        aria-hidden
      >
        <span className="leading-none" style={{ fontSize: Math.max(14, size * 0.45) }}>
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <div
      style={box}
      className={`relative shrink-0 overflow-hidden rounded-xl bg-slate-50 ${className}`}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-slate-100" aria-hidden />
      )}
      <picture>
        <source type="image/avif" srcSet={sources.avif} />
        <source type="image/webp" srcSet={sources.webp} />
        <img
          src={sources.original}
          alt=""
          width={size}
          height={size}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-expect-error fetchPriority tipado en React 19+
          fetchPriority={priority ? 'high' : 'low'}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-contain transition-opacity duration-200 ${
            status === 'ok' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('error')}
        />
      </picture>
    </div>
  );
}

export const PlatformLogo = memo(PlatformLogoInner);
export default PlatformLogo;
