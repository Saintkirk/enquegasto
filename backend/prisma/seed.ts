import { PrismaClient } from '@prisma/client';
import { PLATFORMS } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seeding ${PLATFORMS.length} plataformas…`);

  let created = 0;
  let updated = 0;

  for (const p of PLATFORMS) {
    const row = await prisma.platform.upsert({
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
        logoUrl: p.logoUrl ?? null,
        websiteUrl: p.websiteUrl ?? null,
        description: p.description ?? null,
        priceMonthly: p.priceMonthly ?? null,
        priceYearly: p.priceYearly ?? null,
        priceFamily: p.priceFamily ?? null,
        isActive: true,
      },
    });
    // Heurística simple: si createdAt ≈ updatedAt recién creado
    if (row.createdAt.getTime() === row.updatedAt.getTime()) created += 1;
    else updated += 1;
  }

  const total = await prisma.platform.count({ where: { isActive: true } });
  console.log(`✅ Seed listo. activas=${total} (upsert create≈${created}, update≈${updated})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
