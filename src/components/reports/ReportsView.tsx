'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, cn } from '@/lib/utils';
import BudgetChart from '@/components/reports/BudgetChart';
import type { ProjectSummary } from '@/types';

interface ReportsViewProps {
  summary: ProjectSummary;
  projectId: string;
}

export default function ReportsView({ summary, projectId }: ReportsViewProps) {
  const { t, locale } = useLanguage();
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const { project, totalBudget, totalSpent, totalRemaining, percentUsed, categories } = summary;

  async function fetchReportData() {
    const res = await fetch(`/api/reports/${projectId}/export`);
    if (!res.ok) throw new Error('Failed to fetch report data');
    return res.json();
  }

  async function handleExportPDF() {
    setLoadingPDF(true);
    try {
      const data = await fetchReportData();
      const { generateProjectPDF } = await import('@/lib/reportGenerator');
      generateProjectPDF(
        data.summary,
        data.costs,
        data.categories,
        data.vendors,
        data.changeOrders,
        locale
      );
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setLoadingPDF(false);
    }
  }

  async function handleExportExcel() {
    setLoadingExcel(true);
    try {
      const data = await fetchReportData();
      const { generateProjectExcel } = await import('@/lib/reportGenerator');
      generateProjectExcel(
        data.summary,
        data.costs,
        data.categories,
        data.vendors,
        data.changeOrders,
        locale
      );
    } catch (err) {
      console.error('Excel export error:', err);
    } finally {
      setLoadingExcel(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('reports.title')}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{project.name} · {t('reports.budgetAnalysis')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            disabled={loadingPDF}
            className="btn btn-primary flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-full shadow-[0_4px_14px_rgba(212,252,52,0.3)]"
            id="export-pdf-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9,15 12,18 15,15" />
            </svg>
            {loadingPDF ? t('reports.generating') : t('reports.exportPDF')}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={loadingExcel}
            className="btn btn-secondary flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            id="export-excel-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            {loadingExcel ? t('reports.generating') : t('reports.exportExcel')}
          </button>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="glass-card p-6 rounded-[24px]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('reports.projectInfo')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t('projects.client')}</p>
            <p className="text-sm font-bold text-white">{project.clientName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t('projects.location')}</p>
            <p className="text-sm font-bold text-white">{project.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t('projects.status')}</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-[#d4fc34]/15 text-[#d4fc34] border border-[#d4fc34]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc34]" />
              {t(`status.${project.status}`)}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{t('dashboard.totalSpent')}</p>
            <p className="text-lg font-black text-[#d4fc34]">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Budget Summary Table */}
      <div className="glass-card p-6 rounded-[24px]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('reports.budgetSummary')}</h3>

        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {categories.map((cat) => (
            <div key={cat.category.id} className="border border-white/10 rounded-2xl p-4 bg-[#14161b]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">{cat.category.name}</span>
                <span className={cn(
                  'text-xs font-extrabold px-2.5 py-0.5 rounded-full',
                  cat.percentUsed >= 100 ? 'bg-red-500/20 text-red-400' :
                  cat.percentUsed >= 90 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-[#d4fc34]/20 text-[#d4fc34]'
                )}>
                  {cat.percentUsed}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">{t('chart.budgeted')}</p>
                  <p className="font-semibold text-gray-300">{formatCurrency(cat.category.budgetedAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">{t('chart.actualSpent')}</p>
                  <p className="font-bold text-white">{formatCurrency(cat.actualSpent)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">{t('chart.variance')}</p>
                  <p className={cn('font-bold', cat.variance >= 0 ? 'text-[#d4fc34]' : 'text-red-400')}>
                    {cat.variance >= 0 ? '+' : ''}{formatCurrency(cat.variance)}
                  </p>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="mt-3 h-2 bg-[#242834] rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    cat.percentUsed >= 100 ? 'bg-red-500' :
                    cat.percentUsed >= 90 ? 'bg-amber-500' :
                    'bg-[#d4fc34]'
                  )}
                  style={{ width: `${Math.min(cat.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          ))}

          {/* Mobile Total */}
          <div className="border border-[#d4fc34]/30 rounded-2xl p-4 bg-[#d4fc34]/5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">{t('common.total')}</span>
              <span className={cn(
                'text-xs font-extrabold px-2.5 py-0.5 rounded-full',
                percentUsed >= 100 ? 'bg-red-500/20 text-red-400' : 'bg-[#d4fc34]/20 text-[#d4fc34]'
              )}>
                {percentUsed}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-400 mb-0.5">{t('chart.budgeted')}</p>
                <p className="font-bold text-gray-200">{formatCurrency(totalBudget)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">{t('chart.actualSpent')}</p>
                <p className="font-bold text-white">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">{t('chart.variance')}</p>
                <p className={cn('font-bold', totalRemaining >= 0 ? 'text-[#d4fc34]' : 'text-red-400')}>
                  {totalRemaining >= 0 ? '+' : ''}{formatCurrency(totalRemaining)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('costs.category')}</th>
                <th className="text-right">{t('chart.budgeted')}</th>
                <th className="text-right">{t('chart.actualSpent')}</th>
                <th className="text-right">{t('chart.variance')}</th>
                <th className="text-right">{t('chart.pctUsed')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.category.id}>
                  <td className="font-bold text-white">{cat.category.name}</td>
                  <td className="text-right text-gray-400">{formatCurrency(cat.category.budgetedAmount)}</td>
                  <td className="text-right font-semibold text-white">{formatCurrency(cat.actualSpent)}</td>
                  <td className={cn('text-right font-bold', cat.variance >= 0 ? 'text-[#d4fc34]' : 'text-red-400')}>
                    {cat.variance >= 0 ? '+' : ''}{formatCurrency(cat.variance)}
                  </td>
                  <td className={cn(
                    'text-right font-bold',
                    cat.percentUsed >= 100 ? 'text-red-400' : cat.percentUsed >= 90 ? 'text-amber-400' : 'text-[#d4fc34]'
                  )}>
                    {cat.percentUsed}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="font-extrabold text-white border-t border-white/10">{t('common.total')}</td>
                <td className="text-right font-bold text-gray-300 border-t border-white/10">{formatCurrency(totalBudget)}</td>
                <td className="text-right font-extrabold text-white border-t border-white/10">{formatCurrency(totalSpent)}</td>
                <td className={cn('text-right font-extrabold border-t border-white/10', totalRemaining >= 0 ? 'text-[#d4fc34]' : 'text-red-400')}>
                  {totalRemaining >= 0 ? '+' : ''}{formatCurrency(totalRemaining)}
                </td>
                <td className={cn('text-right font-extrabold border-t border-white/10', percentUsed >= 100 ? 'text-red-400' : 'text-[#d4fc34]')}>
                  {percentUsed}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6 rounded-[24px]">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('reports.chartTitle')}</h3>
        <BudgetChart categories={categories} />
      </div>
    </div>
  );
}
