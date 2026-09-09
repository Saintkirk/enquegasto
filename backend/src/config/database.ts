import { PrismaClient } from '@prisma/client';

const rawDatabaseUrl = process.env.DATABASE_URL || '';
const sanitizedDatabaseUrl = rawDatabaseUrl.replace(/^["']|["']$/g, '').trim();

const g = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = g.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: sanitizedDatabaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  g.prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma['$connect']();
    console.log('✅ Conectado a PostgreSQL correctamente');
  } catch (e) {
    console.error(e);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma['$disconnect']();
}