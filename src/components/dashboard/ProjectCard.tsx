'use client';

import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProjectSummary } from '@/types';

interface ProjectCardProps {
  summary: ProjectSummary;
}

export default function ProjectCard({ summary }: ProjectCardProps) {
  const { t, tStatus } = useLanguage();
  const { project, totalBudget, totalSpent, percentUsed, costCount } = summary;

  const statusBadgeColors: Record<string, string> = {
    active: 'bg-[#d4fc34]/15 text-[#d4fc34] border-[#d4fc34]/30',
    planning: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    on_hold: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    completed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const progressColor =
    percentUsed >= 100
      ? 'bg-red-500'
      : percentUsed >= 90
        ? 'bg-amber-500'
        : 'bg-[#d4fc34]';

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="glass-card p-5 group cursor-pointer rounded-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-base font-bold text-white truncate group-hover:text-[#d4fc34] transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {project.clientName}
            </p>
          </div>
          <span
            className={cn(
              'status-badge flex-shrink-0 text-[10px] sm:text-xs py-0.5 px-2.5',
              statusBadgeColors[project.status] || statusBadgeColors.active
            )}
          >
            <span className="status-dot" />
            {tStatus(project.status)}
          </span>
        </div>

        {/* Budget Progress */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-lg font-extrabold text-[#d4fc34]">
              {percentUsed}%
            </span>
            <span className="text-xs font-medium text-gray-400 truncate text-right">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="progress-bar h-2">
            <div
              className={cn('progress-bar-fill', progressColor)}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />
            </svg>
            <span>{costCount} {t('dashboard.entries')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[130px]">{project.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
