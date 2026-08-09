'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getLocaleFlag, getLocaleName } from '@/lib/i18n';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'am' : 'en');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  // Get user display name from Supabase metadata
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Determine current page title
  let pageTitle = t('nav.dashboard');
  if (pathname.includes('/projects')) pageTitle = t('nav.projects');
  else if (pathname.includes('/reports')) pageTitle = t('nav.reports');
  else if (pathname.includes('/users')) pageTitle = t('nav.users');
  else if (pathname.includes('/settings')) pageTitle = t('nav.settings');

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[var(--navbar-height)] items-center justify-between border-b border-[#1f232d] bg-[#0d0e12]/90 backdrop-blur-xl px-4 md:px-8 md:pl-[calc(var(--sidebar-width)+24px)]">
        {/* Left Page Title & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-[#1a1d24] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{pageTitle}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1d24] px-3 py-1.5 text-xs font-semibold text-white hover:border-[#d4fc34] transition-all shadow-sm"
            title="Switch Language / ቋንቋ ይቀይሩ"
          >
            <span className="text-sm">{getLocaleFlag(locale)}</span>
            <span>{getLocaleName(locale)}</span>
          </button>

          {/* Settings Icon Button */}
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1d24] border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
            title={t('nav.settings')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>

          {/* User Welcome Pill with Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 rounded-full bg-[#1a1d24] border border-white/10 pl-1.5 pr-4 py-1 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4fc34] text-xs font-bold text-black">
                {initials}
              </div>
              <span className="text-xs font-medium text-gray-200">
                Welcome, <span className="font-bold text-white">{displayName.split(' ')[0]}</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-[#1f232d] bg-[#13141a] shadow-2xl overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-[#1f232d]">
                    <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    {user?.user_metadata?.role && (
                      <span className="inline-block mt-1.5 rounded-full bg-[#d4fc34]/15 px-2 py-0.5 text-[10px] font-semibold text-[#d4fc34] uppercase tracking-wide">
                        {user.user_metadata.role.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-[#1a1d24] transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {t('auth.profile') || 'Profile & Settings'}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      {t('auth.signOut') || 'Sign Out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 h-full w-64 bg-[#0d0e12] border-r border-[#1f232d] p-6 animate-slide-in-left shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4fc34] text-black font-extrabold">
                  ❖
                </div>
                <span className="text-base font-bold text-white">CostTracker</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {/* User info in mobile drawer */}
            <div className="flex items-center gap-3 mb-6 px-2 py-3 rounded-xl bg-[#1a1d24] border border-white/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4fc34] text-sm font-bold text-black">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            {[
              { label: t('nav.dashboard'), href: '/dashboard' },
              { label: t('nav.projects'), href: '/projects' },
              { label: t('nav.reports'), href: '/reports' },
              { label: t('nav.users'), href: '/users' },
              { label: t('nav.settings'), href: '/settings' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-xl px-4 py-3 text-sm font-medium mb-1.5 transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-[#d4fc34] text-black font-bold'
                    : 'text-gray-300 hover:bg-[#1a1d24]'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Sign out at bottom of mobile drawer */}
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {t('auth.signOut') || 'Sign Out'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
