/**
 * Tipos compartidos de EnQuéGasto
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  provider: string;
  avatarUrl: string | null;
  liquidSalary: number | null;
  currency: string;
  locale: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  priceMonthly: number | null;
  priceMonthlyFormatted: string | null;
  priceYearly: number | null;
  priceYearlyFormatted: string | null;
  priceFamily: number | null;
  priceFamilyFormatted: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  amountFormatted: string;
  billingCycle: string;
  monthlyEquivalent: number;
  monthlyEquivalentFormatted: string;
  percentageOfSalary: number;
  nextBillingDate: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  isZombie: boolean;
  lastUsedAt: string | null;
  usageFrequency: string | null;
  notes: string | null;
  platform: {
    id: string;
    name: string;
    slug: string;
    category: string;
    logoUrl: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  liquidSalary: number | null;
  liquidSalaryFormatted: string | null;
  totalMonthly: number;
  totalMonthlyFormatted: string;
  totalYearly: number;
  totalYearlyFormatted: string;
  percentageOfSalary: number;
  percentOfSalary?: number;
  activeCount: number;
  zombieCount: number;
  zombieMonthly: number;
  zombieMonthlyFormatted: string;
  byCategory: {
    category: string;
    monthly: number;
    monthlyFormatted: string;
    count: number;
  }[];
}

export interface ZombieSummary {
  totalZombies: number;
  totalMonthlyWaste: number;
  totalMonthlyWasteFormatted: string;
  percentageOfSalary: number;
  message: string;
  alerts: {
    id: string;
    name: string;
    amountFormatted: string;
    monthlyEquivalentFormatted: string;
    percentageOfSalary: number;
    reason: string;
    lastUsedAt: string | null;
    daysSinceLastUse: number | null;
  }[];
}
