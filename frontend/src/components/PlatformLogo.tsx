import { useState, useMemo, memo } from 'react';
import { platformLogo, faviconSizeFor } from '../utils/logo';

interface Props {
  platform?: {
    name?: string;
    category?: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
  } | null;
  size?: number;
  fallback?: string;
  className?: string;
  priority?: boolean;
}

function PlatformLogoInner({
  platform,
  size = 36,
  fallback = '📦',
  className = '',
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const favSize = faviconSizeFor(size);
  const src = useMemo(() => {
    setFailed(false);
    return platform ? platformLogo(platform, favSize) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform?.logoUrl, platform?.websiteUrl, favSize]);

  const box = { width: size, height: size } as const;

  if (!src || failed) {
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
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white ${className}`}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export const PlatformLogo = memo(PlatformLogoInner);
export default PlatformLogo;
