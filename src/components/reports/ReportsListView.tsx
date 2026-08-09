'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';
import type { Project } from '@/types';

interface ReportsListViewProps {
  projects: Project[];
}

type ReportPeriod = 'daily' | 'weekly' | 'full';

function getDateRange(period: ReportPeriod): { from: string; to: string; label: string } {
  const today = new Date();
  const to = today.toISOString().split('T')[0];

  if (period === 'daily') {
    return { from: to, to, label: today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) };
  }

  if (period === 'weekly') {
    // Go back to Monday of current week
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    return {
      from: monday.toISOString().split('T')[0],
      to,
      label: `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    };
  }

  return { from: '', to: '', label: 'All Time' };
}

export default function ReportsListView({ projects }: ReportsListViewProps) {
  const { t, locale } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<'pdf' | 'excel' | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>('weekly');

  const dateRange = getDateRange(period);

  const handleExport = useCallback(async (projectId: string, type: 'pdf' | 'excel', exportPeriod?: ReportPeriod) => {
    const activePeriod = exportPeriod || period;
    const range = getDateRange(activePeriod);
    setLoadingId(projectId);
    setLoadingType(type);
    try {
      const params = new URLSearchParams();
      if (range.from) params.set('from', range.from);
      if (range.to) params.set('to', range.to);

      const res = await fetch(`/api/reports/${projectId}/export?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      const periodLabel = activePeriod === 'daily' ? 'Daily' : activePeriod === 'weekly' ? 'Weekly' : 'Full';

      if (type === 'pdf') {
        const { generateProjectPDF } = await import('@/lib/reportGenerator');
        generateProjectPDF(data.summary, data.costs, data.categories, data.vendors, data.changeOrders, locale, periodLabel, range.from, range.to);
      } else {
        const { generateProjectExcel } = await import('@/lib/reportGenerator');
        generateProjectExcel(data.summary, data.costs, data.categories, data.vendors, data.changeOrders, locale, periodLabel, range.from, range.to);
      }
    } catch (err) {
      console.error(`${type} export error:`, err);
    } finally {
      setLoadingId(null);
      setLoadingType(null);
    }
  }, [period, locale]);

  const periodTabs: { key: ReportPeriod; label: string; labelAm: string; icon: string }[] = [
    { key: 'daily', label: 'Today', labelAm: 'ዛሬ', icon: '📅' },
    { key: 'weekly', label: 'This Week', labelAm: 'ይህ ሳምንት', icon: '📊' },
    { key: 'full', label: 'Full Report', labelAm: 'ሙሉ ሪፖርት', icon: '📋' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t('reports.title')}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">{t('reports.exportDesc')}</p>
      </div>

      {/* Period Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] w-fit">
        {periodTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPeriod(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              period === tab.key
                ? 'bg-[var(--accent-lime)] text-black shadow-lg shadow-[var(--accent-lime)]/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <span>{tab.icon}</span>
            {locale === 'am' ? tab.labelAm : tab.label}
          </button>
        ))}
      </div>

      {/* Date Range Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {dateRange.label}
        </span>
        {period === 'weekly' && (
          <span className="text-xs text-amber-400 font-medium">
            ⏰ {locale === 'am' ? 'ሳምንታዊ ሪፖርት ዝግጁ ነው' : 'Weekly report ready for download'}
          </span>
        )}
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-[24px]">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-muted)] mb-3 border border-[var(--border-subtle)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9,15 12,18 15,15" />
              </svg>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{t('empty.noProjects')}</p>
            <p className="text-xs text-[var(--text-muted)]">{t('empty.noProjectsDesc')}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const isLoading = loadingId === project.id;
            return (
              <div key={project.id} className="glass-card p-5 rounded-[20px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3.5 mb-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4fc34]/15 text-[#d4fc34] flex-shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <Link href={`/projects/${project.id}/reports`} className="text-base font-bold text-white hover:text-[#d4fc34] transition-colors truncate block">
                          {project.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{project.clientName} · <span className="font-semibold text-gray-200">{formatCurrency(project.totalBudget)}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <Link
                      href={`/projects/${project.id}/reports`}
                      className="btn btn-sm btn-ghost text-xs text-gray-300 hover:text-white"
                    >
                      {t('reports.budgetSummary')} →
                    </Link>
                    <button
                      onClick={() => handleExport(project.id, 'pdf')}
                      disabled={isLoading}
                      className="btn btn-sm btn-primary text-xs font-bold py-2 px-4 rounded-full shadow-[0_4px_14px_rgba(212,252,52,0.3)] flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                      </svg>
                      {isLoading && loadingType === 'pdf' ? '...' : `PDF ${period === 'daily' ? '(Today)' : period === 'weekly' ? '(Week)' : ''}`}
                    </button>
                    <button
                      onClick={() => handleExport(project.id, 'excel')}
                      disabled={isLoading}
                      className="btn btn-sm btn-secondary text-xs font-bold py-2 px-4 rounded-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                      </svg>
                      {isLoading && loadingType === 'excel' ? '...' : `Excel ${period === 'daily' ? '(Today)' : period === 'weekly' ? '(Week)' : ''}`}
                    </button>
                  </div>
                </div>

                {/* Pending Labor Summary for weekly */}
                {period === 'weekly' && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs text-amber-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {locale === 'am' ? 'ያልተከፈሉ የሳምንቱ ወጪዎችን ለማየት ሪፖርቱን ያውርዱ' : 'Download report to see pending weekly labor payments'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
