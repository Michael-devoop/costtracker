'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      label: t('nav.dashboard'),
      href: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      label: t('nav.projects'),
      href: '/projects',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: t('nav.reports'),
      href: '/reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: t('nav.users'),
      href: '/users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: t('nav.settings'),
      href: '/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[var(--sidebar-width)] flex-col bg-[#0d0e12] border-r border-[#1e222d] transition-all duration-300 max-md:hidden">
      {/* Logo — Matching Reference UI */}
      <div className="flex h-[var(--navbar-height)] items-center gap-3 px-6 border-b border-[#181b24]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4fc34] text-black font-extrabold shadow-[0_0_12px_rgba(212,252,52,0.3)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 22,12 12,22 2,12" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-base font-bold text-white tracking-tight">CostTracker</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-link', isActive && 'active')}
              >
                <span className={cn('transition-colors', isActive ? 'text-[#d4fc34]' : 'text-gray-400')}>
                  {item.icon}
                </span>
                <span className={cn('text-sm', isActive ? 'font-bold text-white' : 'font-medium text-gray-300')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Card Widget — Matching Inspiration UI "Invite a Friend" */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1d24] to-[#14161b] p-4 border border-white/10 text-center shadow-lg">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#d4fc34]/10 blur-xl pointer-events-none" />
          <h4 className="text-xs font-bold text-white mb-1">CostTracker Pro</h4>
          <p className="text-[11px] text-gray-400 mb-3 line-clamp-2">
            Track site expenses & manage construction budgets seamlessly.
          </p>
          <Link
            href="/projects"
            className="btn btn-primary w-full text-xs font-bold py-2.5 shadow-[0_4px_14px_rgba(212,252,52,0.3)]"
          >
            + New Expense
          </Link>
        </div>
      </div>
    </aside>
  );
}
