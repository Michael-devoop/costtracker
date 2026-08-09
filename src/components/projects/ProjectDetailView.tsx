'use client';

import Link from 'next/link';
import { formatCurrency, formatDate, getBudgetStatusColor, cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import BudgetChart from '@/components/reports/BudgetChart';
import type { ProjectSummary } from '@/types';

interface ProjectDetailViewProps {
  summary: ProjectSummary;
}

export default function ProjectDetailView({ summary }: ProjectDetailViewProps) {
  const { t, tStatus } = useLanguage();
  const { project, totalBudget, totalSpent, totalRemaining, percentUsed, categories, recentCosts } = summary;
  const statusColor = getBudgetStatusColor(percentUsed);

  const progressColor =
    percentUsed >= 100
      ? 'bg-gradient-to-r from-red-500 to-red-400'
      : percentUsed >= 90
        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
        : 'bg-gradient-to-r from-indigo-500 to-purple-500';

  const statusBadgeColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    on_hold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{project.name}</h1>
            <span className={cn('status-badge', statusBadgeColors[project.status] || '')}>
              <span className="status-dot" />
              {tStatus(project.status)}
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {project.clientName} · {project.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/projects/${project.id}/costs`} className="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('costs.addCost')}
          </Link>
          <Link href={`/projects/${project.id}/categories`} className="btn btn-secondary btn-sm">
            {t('categories.title')}
          </Link>
          <Link href={`/projects/${project.id}/vendors`} className="btn btn-secondary btn-sm">
            {t('vendors.title')}
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card hover={false} padding="md">
          <span className="metric-label">{t('dashboard.totalBudget')}</span>
          <p className="metric-value text-[var(--text-primary)] mt-1">{formatCurrency(totalBudget)}</p>
        </Card>
        <Card hover={false} padding="md">
          <span className="metric-label">{t('dashboard.totalSpent')}</span>
          <p className="metric-value text-purple-400 mt-1">{formatCurrency(totalSpent)}</p>
        </Card>
        <Card hover={false} padding="md">
          <span className="metric-label">{t('dashboard.remaining')}</span>
          <p className={cn('metric-value mt-1', totalRemaining >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {formatCurrency(Math.abs(totalRemaining))}
          </p>
        </Card>
        <Card hover={false} padding="md">
          <span className="metric-label">{t('dashboard.budgetUsed')}</span>
          <p className={cn('metric-value mt-1', statusColor)}>{percentUsed}%</p>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card hover={false} padding="md" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{t('projects.overallProgress')}</span>
          <span className="text-sm text-[var(--text-muted)]">
            {formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
          </span>
        </div>
        <div className="progress-bar h-3">
          <div
            className={cn('progress-bar-fill', progressColor)}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget by Category Chart */}
        <div className="lg:col-span-2">
          <Card hover={false} padding="md">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
              {t('chart.budgetVsActual')}
            </h3>
            <BudgetChart categories={categories} />
          </Card>
        </div>

        {/* Recent Cost Entries */}
        <div>
          <Card hover={false} padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{t('costs.recentCosts')}</h3>
              <Link href={`/projects/${project.id}/costs`} className="text-xs text-[var(--text-accent)] hover:underline">
                {t('common.viewAll')} →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentCosts.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">{t('costs.noEntries')}</p>
              ) : (
                recentCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm text-[var(--text-primary)] truncate">{cost.description}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatDate(cost.entryDate)}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                      {formatCurrency(cost.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
