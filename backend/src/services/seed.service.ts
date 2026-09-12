import { prisma } from '../config/database';
import { PLATFORMS } from '../data/platforms.seed';
import { EXTRA_PLATFORMS } from '../data/platforms.extra';

function logoFromWebsite(websiteUrl?: string | null): string | null {
  if (!websiteUrl) return null;
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return null;
  }
}

const ALL = [...PLATFORMS, ...EXTRA_PLATFORMS];

/**
 * Sincroniza catálogo completo por slug (upsert).
 * Seguro en produccion: no borra suscripciones de usuarios.
 * Se ejecuta siempre al arrancar para cubrir plataformas nuevas.
 */
export async function ensurePlatformsSeeded(): Promise<{ seeded: boolean; total: number }> {
  const before = await prisma.platform.count();
  console.log(`🌱 Sync catálogo (${before} en BD → ${ALL.length} en seed)…`);

  let upserts = 0;
  for (const p of ALL) {
    const logo = p.logoUrl || logoFromWebsite(p.websiteUrl);
    await prisma.platform.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        logoUrl: logo,
        websiteUrl: p.websiteUrl ?? null,
        description: p.description ?? null,
        priceMonthly: p.priceMonthly ?? null,
        priceYearly: p.priceYearly ?? null,
        priceFamily: p.priceFamily ?? null,
        isActive: true,
      },
      update: {
        name: p.name,
        category: p.category,
        logoUrl: logo,
        websiteUrl: p.websiteUrl ?? null,
        description: p.description ?? null,
        priceMonthly: p.priceMonthly ?? null,
        priceYearly: p.priceYearly ?? null,
        priceFamily: p.priceFamily ?? null,
        isActive: true,
      },
    });
    upserts += 1;
  }

  const total = await prisma.platform.count({ where: { isActive: true } });
  console.log(`✅ Catálogo listo: ${total} activas (${upserts} upserts)`);
  return { seeded: true, total };
}
