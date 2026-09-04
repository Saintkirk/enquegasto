export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateCL(date: Date | string | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function calcPercentageOfSalary(amount: number, liquidSalary: number | null | undefined): number {
  if (!liquidSalary || liquidSalary <= 0) return 0;
  return Math.round((amount / liquidSalary) * 10000) / 100;
}

export function toMonthlyAmount(amount: number, billingCycle: string): number {
  switch (billingCycle.toLowerCase()) {
    case 'weekly':
    case 'semanal':
      return Math.round((amount * 52) / 12);
    case 'yearly':
    case 'anual':
      return Math.round(amount / 12);
    case 'monthly':
    case 'mensual':
    default:
      return amount;
  }
}
