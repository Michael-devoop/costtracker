// ─── Utility Functions ─────────────────────────────────────────

/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a unique ID (UUID v4-like).
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format a number as currency.
 */
export function formatCurrency(amount: number, currency = 'ETB'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string, style: 'short' | 'long' = 'short'): string {
  const date = new Date(dateStr);
  if (style === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string as relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateStr);
}

/**
 * Calculate budget variance and percentage.
 */
export function calculateVariance(budgeted: number, actual: number) {
  const variance = budgeted - actual;
  const percentUsed = budgeted > 0 ? (actual / budgeted) * 100 : 0;
  return {
    variance,
    percentUsed: Math.round(percentUsed * 10) / 10,
    isOverBudget: actual > budgeted,
    status: percentUsed >= 100 ? 'over' as const : percentUsed >= 90 ? 'warning' as const : 'good' as const,
  };
}

/**
 * Get status color class based on budget usage.
 */
export function getBudgetStatusColor(percentUsed: number): string {
  if (percentUsed >= 100) return 'text-red-400';
  if (percentUsed >= 90) return 'text-amber-400';
  if (percentUsed >= 75) return 'text-yellow-400';
  return 'text-emerald-400';
}

/**
 * Get status badge color classes.
 */
export function getStatusBadgeClasses(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    on_hold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return map[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Format a status string for display (e.g., "on_hold" → "On Hold").
 */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Default budget categories for new projects.
 */
export const DEFAULT_CATEGORIES = [
  { name: 'Site Prep & Permits', code: 'SITE' },
  { name: 'Foundation & Concrete', code: 'FNDN' },
  { name: 'Framing & Structural', code: 'FRAM' },
  { name: 'Roofing', code: 'ROOF' },
  { name: 'Exterior (Siding, Windows, Doors)', code: 'EXTR' },
  { name: 'Plumbing', code: 'PLMB' },
  { name: 'Electrical', code: 'ELEC' },
  { name: 'HVAC', code: 'HVAC' },
  { name: 'Insulation & Drywall', code: 'INSL' },
  { name: 'Interior Finishes', code: 'INTR' },
  { name: 'Cabinetry & Countertops', code: 'CABT' },
  { name: 'Landscaping', code: 'LAND' },
  { name: 'Labor (General)', code: 'LABR' },
  { name: 'Equipment Rental', code: 'EQPT' },
  { name: 'Contingency / Overhead', code: 'CONT' },
];
