import { prisma } from '../config/database';
import { PLATFORMS } from '../data/platforms.seed';

function logoFromWebsite(websiteUrl?: string | null): string | null {
  if (!websiteUrl) return null;
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return null;
  }
}

/** Completa catálogo si faltan plataformas (TNT, HBO, etc.). Idempotente por slug. */
export async function ensurePlatformsSeeded(): Promise<{ seeded: boolean; total: number }> {
  const count = await prisma.platform.count();
  const mustHave = ['tnt-sports', 'hbo-max', 'espn', 'dazn'];
  const missing: string[] = [];
  for (const slug of mustHave) {
    const found = await prisma.platform.findUnique({ where: { slug } });
    if (!found) missing.push(slug);
  }

  if (count >= PLATFORMS.length && missing.length === 0) {
    return { seeded: false, total: count };
  }

  console.log(
    `🌱 Actualizando catálogo (${count}/${PLATFORMS.length}${missing.length ? `, faltan ${missing.join(', ')}` : ''})…`
  );

  for (const p of PLATFORMS) {
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
  }

  const total = await prisma.platform.count({ where: { isActive: true } });
  console.log(`✅ Catálogo listo: ${total} plataformas`);
  return { seeded: true, total };
}
