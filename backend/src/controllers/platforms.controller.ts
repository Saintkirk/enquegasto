import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { formatCLP } from '../utils/format';
import { cacheGet, cacheSet, CACHE_TTL } from '../utils/cache';

function mapPlatform(p: {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  priceMonthly: number | null;
  priceYearly: number | null;
  priceFamily: number | null;
}) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    logoUrl: p.logoUrl,
    websiteUrl: p.websiteUrl,
    description: p.description,
    priceMonthly: p.priceMonthly,
    priceMonthlyFormatted: p.priceMonthly != null ? formatCLP(p.priceMonthly) : null,
    priceYearly: p.priceYearly,
    priceYearlyFormatted: p.priceYearly != null ? formatCLP(p.priceYearly) : null,
    priceFamily: p.priceFamily,
    priceFamilyFormatted: p.priceFamily != null ? formatCLP(p.priceFamily) : null,
  };
}

export async function listPlatforms(req: Request, res: Response): Promise<void> {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const limit = Math.min(parseInt(String(req.query.limit || '200'), 10) || 200, 300);

    const cacheKey = `platforms:${category || 'all'}:${search || ''}:${limit}`;
    const cached = cacheGet<{ total: number; platforms: ReturnType<typeof mapPlatform>[] }>(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.json(cached);
      return;
    }

    const platforms = await prisma.platform.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      take: limit,
    });

    const data = {
      total: platforms.length,
      platforms: platforms.map(mapPlatform),
    };

    cacheSet(cacheKey, data, CACHE_TTL * 1000);

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(data);
  } catch (error) {
    console.error('Error al listar plataformas:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'No pudimos cargar el catálogo de plataformas. Intenta de nuevo.',
    });
  }
}

export async function getPlatform(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const cacheKey = `platform:${slug}`;
    const cached = cacheGet<{ platform: ReturnType<typeof mapPlatform> }>(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.json(cached);
      return;
    }

    const _userId = (req.headers['x-user-id'] as string) || undefined;

    const platform = await prisma.platform.findUnique({
      where: { slug }
    });

    if (!platform || !platform.isActive) {
      res.status(404).json({
        error: 'No encontrada',
        message: 'No encontramos esa plataforma en el catálogo',
      });
      return;
    }

    const data = { platform: mapPlatform(platform) };
    cacheSet(cacheKey, data, CACHE_TTL * 1000);

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=120');
    res.json(data);
  } catch (error) {
    console.error('Error al obtener plataforma:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'No pudimos cargar la plataforma',
    });
  }
}

export async function listCategories(_req: Request, res: Response): Promise<void> {
  try {
    const cacheKey = 'platforms:categories';
    const cached = cacheGet<{ categories: { name: string; count: number }[] }>(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.json(cached);
      return;
    }

    const groups = await prisma.platform.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
      orderBy: { category: 'asc' },
    });

    const data = {
      categories: groups.map((g) => ({
        name: g.category,
        count: g._count.category,
      })),
    };

    cacheSet(cacheKey, data, CACHE_TTL * 1000);

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=120');
    res.json(data);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'No pudimos cargar las categorías',
    });
  }
}
