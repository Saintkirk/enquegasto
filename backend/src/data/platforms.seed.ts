import data from './platforms.json';

export type PlatformSeed = {
  name: string;
  slug: string;
  category: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  priceMonthly?: number | null;
  priceYearly?: number | null;
  priceFamily?: number | null;
};

export const PLATFORMS: PlatformSeed[] = data as PlatformSeed[];
