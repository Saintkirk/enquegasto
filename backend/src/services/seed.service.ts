import { prisma } from '../config/database';
import { PLATFORMS } from '../data/platforms.seed';

/**
 * Si el catálogo tiene menos plataformas que el seed, hace upsert de todas.
 * Idempotente: no duplica por slug.
 */
export async function ensurePlatformsSeeded(): Promise<{ seeded: boolean; total: number }> {
  const count = await prisma.platform.count();

  if (count >= PLATFORMS.length) {
    return { seeded: false, total: count };
  }

  console.log(
    `🌱 Catálogo incompleto (${count}/${PLATFORMS.length}) — upsert de plataformas…`
  );

  for (const p of PLATFORMS) {
    await prisma.platform.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        logoUrl: p.logoUrl ?? null,
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
        websiteUrl: p.websiteUrl ?? null,
        description: p.description ?? null,
        priceMonthly: p.priceMonthly ?? null,
        priceYearly: p.priceYearly ?? null,
        priceFamily: p.priceFamily ?? null,
        isActive: true,
      },
    });
  }

  const total = await prisma.platform.count({ where: { isActive: true } });
  console.log(`✅ Catálogo listo: ${total} plataformas`);
  return { seeded: true, total };
}
