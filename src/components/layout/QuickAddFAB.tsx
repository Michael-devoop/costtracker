'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuickAddFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = async () => {
    // If currently inside a specific project, go straight to that project's quick add costs
    const projectMatch = pathname.match(/\/projects\/([^\/]+)/);
    if (projectMatch && projectMatch[1] !== 'new') {
      router.push(`/projects/${projectMatch[1]}/costs?quickAdd=true`);
      return;
    }

    // Otherwise (on Dashboard, Reports, Settings, etc.), fetch existing projects and navigate to the first project
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const projects = await res.json();
        if (Array.isArray(projects) && projects.length > 0) {
          router.push(`/projects/${projects[0].id}/costs?quickAdd=true`);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to resolve active project for quick add:', err);
    }

    // Fallback if no projects exist yet
    router.push('/projects');
  };

  return (
    <button
      onClick={handleClick}
      className="quick-add-fab"
      title={t('costs.quickAdd')}
      aria-label={t('costs.quickAdd')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}
