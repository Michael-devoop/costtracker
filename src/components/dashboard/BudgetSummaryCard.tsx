'use client';

import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface BudgetSummaryCardProps {
  totalSpent: number;
  projectCount: number;
  activeCount: number;
  totalEntries: number;
  vendorCount: number;
}

export default function BudgetSummaryCard({
  totalSpent,
  projectCount,
  activeCount,
  totalEntries,
  vendorCount,
}: BudgetSummaryCardProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Total Spent */}
      <div className="glass-card p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium truncate">
            {t('dashboard.totalSpent')}
          </span>
        </div>
        <span className="text-sm sm:text-base md:text-xl font-bold text-purple-400 truncate mt-1">
          {formatCurrency(totalSpent)}
        </span>
      </div>

      {/* Projects */}
      <div className="glass-card p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-4h6v4" />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium truncate">
            {t('dashboard.projects')}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm sm:text-base md:text-xl font-bold text-[var(--text-primary)]">{projectCount}</span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">{activeCount} {t('dashboard.active')}</span>
        </div>
      </div>

      {/* Total Entries */}
      <div className="glass-card p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium truncate">
            {t('costs.title')}
          </span>
        </div>
        <span className="text-sm sm:text-base md:text-xl font-bold text-emerald-400 truncate mt-1">
          {totalEntries} {t('dashboard.entries')}
        </span>
      </div>

      {/* Vendors */}
      <div className="glass-card p-3.5 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium truncate">
            {t('vendors.title')}
          </span>
        </div>
        <span className="text-sm sm:text-base md:text-xl font-bold text-amber-400 truncate mt-1">
          {vendorCount}
        </span>
      </div>
    </div>
  );
}
