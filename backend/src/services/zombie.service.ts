import { prisma } from '../config/database';
import { formatCLP, toMonthlyAmount, calcPercentageOfSalary } from '../utils/format';

export interface ZombieAlert {
  id: string;
  name: string;
  amountFormatted: string;
  monthlyEquivalentFormatted: string;
  percentageOfSalary: number;
  reason: string;
  lastUsedAt: Date | null;
  daysSinceLastUse: number | null;
}

export interface ZombieSummary {
  totalZombies: number;
  totalMonthlyWaste: number;
  totalMonthlyWasteFormatted: string;
  percentageOfSalary: number;
  message: string;
  alerts: ZombieAlert[];
  zombies?: any[];
}

const RARELY_DAYS = 45;

export async function detectAndMarkZombies(userId: string): Promise<number> {
  const subs = await prisma.subscription.findMany({ where: { userId, isActive: true, isZombie: false } });
  let marked = 0;
  const now = Date.now();
  for (const s of subs) {
    const freq = (s.usageFrequency || '').toLowerCase();
    let shouldMark = freq === 'rarely' || freq === 'never';
    if (s.lastUsedAt) {
      const days = (now - s.lastUsedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (days >= RARELY_DAYS) shouldMark = true;
    }
    if (shouldMark) {
      await prisma.subscription.update({ where: { id: s.id }, data: { isZombie: true } });
      marked += 1;
    }
  }
  return marked;
}

export async function getZombieAlerts(userId: string): Promise<ZombieSummary> {
  await detectAndMarkZombies(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const zombies = await prisma.subscription.findMany({
    where: { userId, isActive: true, isZombie: true },
    include: { platform: true },
    orderBy: { amount: 'desc' },
  });
  let totalMonthlyWaste = 0;
  const alerts: ZombieAlert[] = [];
  for (const s of zombies) {
    const monthly = toMonthlyAmount(s.amount, s.billingCycle);
    totalMonthlyWaste += monthly;
    const days = s.lastUsedAt ? Math.floor((Date.now() - s.lastUsedAt.getTime()) / (1000 * 60 * 60 * 24)) : null;
    alerts.push({
      id: s.id,
      name: s.name,
      amountFormatted: formatCLP(s.amount),
      monthlyEquivalentFormatted: formatCLP(monthly),
      percentageOfSalary: calcPercentageOfSalary(monthly, user?.liquidSalary),
      reason: days != null ? `Sin uso hace ${days} días` : 'Poco uso o marcada como zombie',
      lastUsedAt: s.lastUsedAt,
      daysSinceLastUse: days,
    });
  }
  return {
    totalZombies: zombies.length,
    totalMonthlyWaste,
    totalMonthlyWasteFormatted: formatCLP(totalMonthlyWaste),
    percentageOfSalary: calcPercentageOfSalary(totalMonthlyWaste, user?.liquidSalary),
    message: zombies.length === 0 ? 'No tienes gastos zombie.' : `Tienes ${zombies.length} zombie(s): ${formatCLP(totalMonthlyWaste)}/mes.`,
    alerts,
    zombies: zombies.map((s) => ({
      id: s.id,
      name: s.name,
      amountFormatted: formatCLP(s.amount),
      monthlyEquivalentFormatted: formatCLP(toMonthlyAmount(s.amount, s.billingCycle)),
      isZombie: true,
      platform: s.platform ? { id: s.platform.id, name: s.platform.name, slug: s.platform.slug, category: s.platform.category, logoUrl: s.platform.logoUrl } : null,
    })),
  };
}

export async function setZombieStatus(userId: string, id: string, isZombie: boolean) {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) throw new Error('Suscripción no encontrada');
  return prisma.subscription.update({ where: { id }, data: { isZombie }, include: { platform: true } });
}

export async function registerUsage(userId: string, id: string) {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) throw new Error('Suscripción no encontrada');
  return prisma.subscription.update({ where: { id }, data: { lastUsedAt: new Date(), isZombie: false }, include: { platform: true } });
}

export function buildZombieAlertMessage(summary: ZombieSummary, userName?: string | null): string {
  const name = userName || 'hola';
  if (summary.totalZombies === 0) return `${name}, no tienes gastos zombie. ¡Bien!`;
  const lines = summary.alerts.map((a) => `• ${a.name}: ${a.monthlyEquivalentFormatted}/mes`).join('\n');
  return `${name}, EnQuéGasto detectó ${summary.totalZombies} gasto(s) zombie.\nEstás botando ${summary.totalMonthlyWasteFormatted} al mes.\n\n${lines}`;
}
