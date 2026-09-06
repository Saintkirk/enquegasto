/** Formato CLP y porcentajes — es-CL */

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits).replace('.', ',')}%`;
}

export function formatDateCL(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}
