import { PrismaClient } from '@prisma/client';
import { PLATFORMS } from '../src/data/platforms.seed';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seeding ${PLATFORMS.length} plataformas…`);

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
        logoUrl: p.logoUrl ?? null,
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
  console.log(`✅ Seed listo. activas=${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
}
