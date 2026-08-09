'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';
import type { Project } from '@/types';

interface ReportsListViewProps {
  projects: Project[];
}

export default function ReportsListView({ projects }: ReportsListViewProps) {
  const { t, locale } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<'pdf' | 'excel' | null>(null);

  async function handleExport(projectId: string, type: 'pdf' | 'excel') {
    setLoadingId(projectId);
    setLoadingType(type);
    try {
      const res = await fetch(`/api/reports/${projectId}/export`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      if (type === 'pdf') {
        const { generateProjectPDF } = await import('@/lib/reportGenerator');
        generateProjectPDF(data.summary, data.costs, data.categories, data.vendors, data.changeOrders, locale);
      } else {
        const { generateProjectExcel } = await import('@/lib/reportGenerator');
        generateProjectExcel(data.summary, data.costs, data.categories, data.vendors, data.changeOrders, locale);
      }
    } catch (err) {
      console.error(`${type} export error:`, err);
    } finally {
      setLoadingId(null);
      setLoadingType(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t('reports.title')}</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">{t('reports.exportDesc')}</p>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-[24px]">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9,15 12,18 15,15" />
              </svg>
            </div>
            <p className="empty-state-title">{t('empty.noProjects')}</p>
            <p className="empty-state-desc">{t('empty.noProjectsDesc')}</p>
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
                      className="btn btn-sm btn-primary text-xs font-bold py-2 px-4 rounded-full shadow-[0_4px_14px_rgba(212,252,52,0.3)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                      </svg>
                      {isLoading && loadingType === 'pdf' ? '...' : 'PDF'}
                    </button>
                    <button
                      onClick={() => handleExport(project.id, 'excel')}
                      disabled={isLoading}
                      className="btn btn-sm btn-secondary text-xs font-bold py-2 px-4 rounded-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                      </svg>
                      {isLoading && loadingType === 'excel' ? '...' : 'Excel'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
