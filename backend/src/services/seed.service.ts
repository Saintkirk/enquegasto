import { prisma } from '../config/database';
import { PLATFORMS } from '../../prisma/seed-data';

/** Si no hay plataformas, carga el catálogo (idempotente con upsert). */
export async function ensurePlatformsSeeded(): Promise<{ seeded: boolean; total: number }> {
  const count = await prisma.platform.count();
  if (count > 0) {
    return { seeded: false, total: count };
  }

  console.log(`🌱 Catálogo vacío — sembrando ${PLATFORMS.length} plataformas…`);

  // createMany omitDuplicates si el motor lo soporta; usamos upsert por seguridad
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
      update: {},
    });
  }

  const total = await prisma.platform.count({ where: { isActive: true } });
  console.log(`✅ Catálogo sembrado: ${total} plataformas`);
  return { seeded: true, total };
}
