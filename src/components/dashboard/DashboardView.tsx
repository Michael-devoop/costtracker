'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectCard from '@/components/dashboard/ProjectCard';
import QuickAddModal from '@/components/costs/QuickAddModal';
import type { ProjectSummary, CostItem, CostItemWithTotal } from '@/types';

interface DashboardViewProps {
  summaries: ProjectSummary[];
  vendorCount: number;
}

// Initial default quick cost items
const defaultQuickItems: CostItemWithTotal[] = [
  { id: '1', projectId: 'proj-001', name: 'Nails', nameAm: 'ችንካር', categoryId: 'cat-001', icon: '🔨', usageCount: 42, createdAt: '', totalSpent: 4500, entryCount: 3 },
  { id: '2', projectId: 'proj-001', name: 'Cement', nameAm: 'ሲሚንቶ', categoryId: 'cat-001', icon: '🧱', usageCount: 35, createdAt: '', totalSpent: 18000, entryCount: 5 },
  { id: '3', projectId: 'proj-001', name: 'Sand', nameAm: 'አሸዋ', categoryId: 'cat-001', icon: '⏳', usageCount: 28, createdAt: '', totalSpent: 12000, entryCount: 2 },
  { id: '4', projectId: 'proj-001', name: 'Rebar', nameAm: 'ብረት', categoryId: 'cat-001', icon: '⛓️', usageCount: 20, createdAt: '', totalSpent: 45000, entryCount: 4 },
  { id: '5', projectId: 'proj-001', name: 'Labor', nameAm: 'የቀን ሰራተኛ', categoryId: 'cat-004', icon: '👷', usageCount: 50, createdAt: '', totalSpent: 25000, entryCount: 8 },
];

export default function DashboardView({ summaries, vendorCount }: DashboardViewProps) {
  const { t, locale } = useLanguage();
  const [quickModalItem, setQuickModalItem] = useState<CostItemWithTotal | null>(null);

  const totalSpent = summaries.reduce((s, p) => s + p.totalSpent, 0);
  const totalEntries = summaries.reduce((s, p) => s + p.costCount, 0);
  const activeCount = summaries.filter((s) => s.project.status === 'active').length;

  // Flatten all recent costs for the transaction history section
  const allRecentCosts = summaries
    .flatMap((s) => s.recentCosts.map((c) => ({ ...c, projectName: s.project.name })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const activeProject = summaries[0]?.project;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Top Grid — 2 Columns (Main Left + Right Card Widget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Total Balance Card (Matching Reference UI Hero) */}
          <div className="hero-mesh-card rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t('dashboard.totalSpent')}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#d4fc34] bg-[#d4fc34]/10 px-3 py-1 rounded-full border border-[#d4fc34]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc34] animate-pulse" />
                {activeCount} {t('dashboard.active')}
              </span>
            </div>

            {/* Massive Amount Display */}
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <span className="text-sm font-bold text-gray-400">ETB</span>
            </div>

            {/* Action Pill Buttons (Matching Send, Request, Top Up in reference UI) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => activeProject && setQuickModalItem(defaultQuickItems[0])}
                className="btn btn-primary text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(212,252,52,0.3)]"
              >
                + {t('costs.quickAdd')}
              </button>

              <Link
                href="/reports"
                className="btn btn-secondary text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full"
              >
                {t('reports.title')} »
              </Link>

              <Link
                href="/projects"
                className="btn btn-secondary text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full"
              >
                {t('projects.title')} ({summaries.length})
              </Link>
            </div>
          </div>

          {/* Recent Quick Cost Items Row (Matching "Recent Contacts" in reference UI) */}
          <div className="glass-card p-5 rounded-[24px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t('costItems.title')}
              </h3>
              <Link href={activeProject ? `/projects/${activeProject.id}/costs` : '/projects'} className="text-xs font-semibold text-[#d4fc34] hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {/* Add New Button Circle */}
              <button
                onClick={() => activeProject && setQuickModalItem(defaultQuickItems[0])}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[#d4fc34]/60 bg-[#d4fc34]/10 text-[#d4fc34] transition-all group-hover:scale-105 group-hover:bg-[#d4fc34] group-hover:text-black">
                  <span className="text-xl font-bold">+</span>
                </div>
                <span className="text-[11px] font-semibold text-[#d4fc34]">{t('costItems.addNew')}</span>
              </button>

              {/* Quick Item Cards Horizontal List */}
              {defaultQuickItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setQuickModalItem(item)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#242834] border border-white/10 text-xl transition-all group-hover:scale-105 group-hover:border-[#d4fc34]">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium text-gray-300 max-w-[64px] truncate text-center">
                    {locale === 'am' ? item.nameAm || item.name : item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions / Cost History (Matching "Transactions History" in reference UI) */}
          <div className="glass-card p-5 rounded-[24px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t('costs.recentCosts')}
              </h3>
              <span className="text-xs text-gray-400 bg-[#14161b] px-3 py-1 rounded-full border border-white/5">
                {totalEntries} {t('dashboard.entries')}
              </span>
            </div>

            {allRecentCosts.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">{t('costs.noEntries')}</p>
            ) : (
              <div className="space-y-3">
                {allRecentCosts.map((cost) => (
                  <div key={cost.id} className="flex items-center justify-between p-3 rounded-xl bg-[#14161b]/60 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#242834] text-lg text-[#d4fc34] flex-shrink-0">
                        🔨
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{cost.description}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{cost.projectName} · {new Date(cost.entryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#d4fc34]">
                        -{formatCurrency(cost.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column Widget (4 cols on desktop — Matching "My Cards" widget in reference UI) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white tracking-tight">{t('projects.title')}</h3>
                <Link href="/projects" className="text-xs font-semibold text-[#d4fc34] hover:underline">
                  {t('common.viewAll')}
                </Link>
              </div>

              {/* Visual Card Component (Matching Yellow Credit Card Mockup in reference UI) */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#d4fc34] to-[#a3e635] p-5 text-black shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-black/70">
                    {activeProject ? activeProject.clientName : 'Construction Site'}
                  </span>
                  <div className="h-6 w-6 rounded-full bg-black/10 flex items-center justify-center font-black">
                    ❖
                  </div>
                </div>
                <h4 className="text-lg font-black truncate mb-3">
                  {activeProject ? activeProject.name : 'Project Alpha'}
                </h4>
                <p className="text-xs font-mono tracking-widest text-black/80">
                  {activeProject ? formatCurrency(activeProject.totalBudget) : 'ETB 0.00'}
                </p>
              </div>

              {/* Menu Feature Links with Chevron (Matching reference UI list items) */}
              <div className="space-y-1">
                {[
                  { label: t('dashboard.projects'), href: '/projects', icon: '📁' },
                  { label: t('reports.title'), href: '/reports', icon: '📊' },
                  { label: t('vendors.title'), href: '/projects', icon: '🚚' },
                  { label: t('changeOrders.title'), href: '/projects', icon: '📝' },
                  { label: t('nav.settings'), href: '/settings', icon: '⚙️' },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{link.icon}</span>
                      <span className="text-xs font-medium">{link.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-[#d4fc34] group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Action Pill Buttons (Matching Add Card & Delete in reference UI) */}
            <div className="pt-6 border-t border-white/10 flex gap-3 mt-6">
              <Link
                href="/projects"
                className="btn btn-primary text-xs font-bold py-2.5 flex-1 rounded-full shadow-[0_4px_14px_rgba(212,252,52,0.3)]"
              >
                + {t('projects.newProject')}
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Add Amount Modal */}
      {quickModalItem && activeProject && (
        <QuickAddModal
          isOpen={!!quickModalItem}
          onClose={() => setQuickModalItem(null)}
          item={quickModalItem}
          onSubmit={async (amount, note) => {
            await fetch('/api/costs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectId: activeProject.id,
                categoryId: quickModalItem.categoryId,
                description: `${quickModalItem.name}${note ? ` - ${note}` : ''}`,
                amount,
                entryDate: new Date().toISOString().split('T')[0],
                paymentStatus: 'paid',
                entryType: 'expense',
              }),
            });
            setQuickModalItem(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
