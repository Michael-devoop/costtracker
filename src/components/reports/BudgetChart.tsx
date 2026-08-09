'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CategorySummary } from '@/types';

interface BudgetChartProps {
  categories: CategorySummary[];
  className?: string;
}

export default function BudgetChart({ categories, className }: BudgetChartProps) {
  const { t } = useLanguage();
  if (categories.length === 0) return null;

  // Find max budget for scaling
  const maxAmount = Math.max(...categories.map((c) => Math.max(c.category.budgetedAmount, c.actualSpent)));

  return (
    <div className={cn('chart-bar-container', className)}>
      {categories.map((cat) => {
        const budgetWidth = maxAmount > 0 ? (cat.category.budgetedAmount / maxAmount) * 100 : 0;
        const actualWidth = maxAmount > 0 ? (cat.actualSpent / maxAmount) * 100 : 0;

        const barColor =
          cat.percentUsed >= 100
            ? 'bg-red-500'
            : cat.percentUsed >= 90
              ? 'bg-amber-500'
              : 'bg-[#d4fc34]';

        const textColor =
          cat.percentUsed >= 100
            ? 'text-red-400'
            : cat.percentUsed >= 90
              ? 'text-amber-400'
              : 'text-[#d4fc34]';

        return (
          <div key={cat.category.id} className="chart-bar">
            <span className="chart-bar-label truncate text-gray-300 font-medium" title={cat.category.name}>
              {cat.category.name}
            </span>
            <div className="chart-bar-track bg-[#14161b]">
              <div
                className="chart-bar-budget bg-white/10"
                style={{ width: `${budgetWidth}%` }}
              />
              <div
                className={cn('chart-bar-actual', barColor)}
                style={{ width: `${actualWidth}%` }}
              />
            </div>
            <span className={cn('chart-bar-value font-bold', textColor)}>
              {cat.percentUsed}%
            </span>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 px-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#d4fc34]" />
          <span className="text-xs text-gray-400">{t('chart.actualSpent')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-white/20" />
          <span className="text-xs text-gray-400">{t('chart.budgeted')}</span>
        </div>
      </div>
    </div>
  );
}
