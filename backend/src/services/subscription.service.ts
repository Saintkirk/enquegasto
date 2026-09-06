import { prisma } from '../config/database';
import { formatCLP, toMonthlyAmount, calcPercentageOfSalary } from '../utils/format';
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from '../schemas/subscription.schema';

export interface SubscriptionWithMetrics {
  id: string;
  name: string;
  amount: number;
  amountFormatted: string;
  billingCycle: string;
  monthlyEquivalent: number;
  monthlyEquivalentFormatted: string;
  percentageOfSalary: number;
  nextBillingDate: Date | null;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  isZombie: boolean;
  lastUsedAt: Date | null;
  usageFrequency: string | null;
  notes: string | null;
  platform: { id: string; name: string; slug: string; category: string; logoUrl: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  liquidSalary: number | null;
  liquidSalaryFormatted: string | null;
  totalMonthly: number;
  totalMonthlyFormatted: string;
  totalYearly: number;
  totalYearlyFormatted: string;
  percentageOfSalary: number;
  percentOfSalary: number;
  activeCount: number;
  zombieCount: number;
  zombieMonthly: number;
  zombieMonthlyFormatted: string;
  byCategory: { category: string; monthly: number; monthlyFormatted: string; count: number }[];
}

function mapSub(sub: any, liquidSalary: number | null): SubscriptionWithMetrics {
  const monthly = toMonthlyAmount(sub.amount, sub.billingCycle);
  return {
    id: sub.id,
    name: sub.name,
    amount: sub.amount,
    amountFormatted: formatCLP(sub.amount),
    billingCycle: sub.billingCycle,
    monthlyEquivalent: monthly,
    monthlyEquivalentFormatted: formatCLP(monthly),
    percentageOfSalary: calcPercentageOfSalary(monthly, liquidSalary),
    nextBillingDate: sub.nextBillingDate,
    startDate: sub.startDate,
    endDate: sub.endDate,
    isActive: sub.isActive,
    isZombie: sub.isZombie,
    lastUsedAt: sub.lastUsedAt,
    usageFrequency: sub.usageFrequency,
    notes: sub.notes,
    platform: sub.platform
      ? { id: sub.platform.id, name: sub.platform.name, slug: sub.platform.slug, category: sub.platform.category, logoUrl: sub.platform.logoUrl }
      : null,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
  };
}

function normalizeCycle(c: string): string {
  const x = (c || 'monthly').toLowerCase();
  if (['yearly', 'anual'].includes(x)) return 'yearly';
  if (['weekly', 'semanal'].includes(x)) return 'weekly';
  if (['custom', 'other'].includes(x)) return 'custom';
  return 'monthly';
}

export async function createSubscription(userId: string, data: CreateSubscriptionInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');
  let platformId = data.platformId || null;
  if (!platformId && data.platformSlug) {
    const p = await prisma.platform.findUnique({ where: { slug: data.platformSlug } });
    if (p) platformId = p.id;
  }
  const sub = await prisma.subscription.create({
    data: {
      userId,
      name: data.name,
      amount: data.amount,
      billingCycle: normalizeCycle(String(data.billingCycle || 'monthly')),
      platformId,
      notes: data.notes || null,
      nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : null,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      usageFrequency: data.usageFrequency || null,
      isActive: true,
      isZombie: false,
    },
    include: { platform: true },
  });
  return mapSub(sub, user.liquidSalary);
}

export async function listSubscriptions(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const subs = await prisma.subscription.findMany({
    where: { userId, isActive: true },
    include: { platform: true },
    orderBy: { createdAt: 'desc' },
  });
  return subs.map((s) => mapSub(s, user?.liquidSalary ?? null));
}

export async function getSubscription(userId: string, id: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const sub = await prisma.subscription.findFirst({ where: { id, userId }, include: { platform: true } });
  if (!sub) return null;
  return mapSub(sub, user?.liquidSalary ?? null);
}

export async function updateSubscription(userId: string, id: string, data: UpdateSubscriptionInput) {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) throw new Error('Suscripción no encontrada');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const sub = await prisma.subscription.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.billingCycle !== undefined && { billingCycle: normalizeCycle(String(data.billingCycle)) }),
      ...(data.platformId !== undefined && { platformId: data.platformId }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.isZombie !== undefined && { isZombie: data.isZombie }),
      ...(data.nextBillingDate !== undefined && { nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : null }),
      ...(data.lastUsedAt !== undefined && { lastUsedAt: data.lastUsedAt ? new Date(data.lastUsedAt) : null }),
      ...(data.usageFrequency !== undefined && { usageFrequency: data.usageFrequency }),
    },
    include: { platform: true },
  });
  return mapSub(sub, user?.liquidSalary ?? null);
}

export async function deleteSubscription(userId: string, id: string) {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) throw new Error('Suscripción no encontrada');
  await prisma.subscription.update({ where: { id }, data: { isActive: false } });
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const liquidSalary = user?.liquidSalary ?? null;
  const subs = await prisma.subscription.findMany({ where: { userId, isActive: true }, include: { platform: true } });
  let totalMonthly = 0;
  let zombieMonthly = 0;
  let zombieCount = 0;
  const catMap = new Map<string, { monthly: number; count: number }>();
  for (const s of subs) {
    const monthly = toMonthlyAmount(s.amount, s.billingCycle);
    totalMonthly += monthly;
    if (s.isZombie) { zombieMonthly += monthly; zombieCount += 1; }
    const cat = s.platform?.category || 'otros';
    const prev = catMap.get(cat) || { monthly: 0, count: 0 };
    prev.monthly += monthly; prev.count += 1;
    catMap.set(cat, prev);
  }
  const percentageOfSalary = calcPercentageOfSalary(totalMonthly, liquidSalary);
  return {
    liquidSalary,
    liquidSalaryFormatted: liquidSalary != null ? formatCLP(liquidSalary) : null,
    totalMonthly,
    totalMonthlyFormatted: formatCLP(totalMonthly),
    totalYearly: totalMonthly * 12,
    totalYearlyFormatted: formatCLP(totalMonthly * 12),
    percentageOfSalary,
    percentOfSalary: percentageOfSalary,
    activeCount: subs.length,
    zombieCount,
    zombieMonthly,
    zombieMonthlyFormatted: formatCLP(zombieMonthly),
    byCategory: Array.from(catMap.entries()).map(([category, v]) => ({
      category, monthly: v.monthly, monthlyFormatted: formatCLP(v.monthly), count: v.count,
    })),
  };
}

export async function updateLiquidSalary(userId: string, liquidSalary: number) {
  if (liquidSalary < 150000) throw new Error('El sueldo líquido mínimo razonable es $150.000');
  return prisma.user.update({ where: { id: userId }, data: { liquidSalary } });
}
