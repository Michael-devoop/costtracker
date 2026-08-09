'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuickAddFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // Extract projectId if on a project route
  const projectMatch = pathname.match(/\/projects\/([^\/]+)/);
  const projectId = projectMatch ? projectMatch[1] : 'proj-001'; // default to first project

  const handleClick = () => {
    router.push(`/projects/${projectId}/costs?quickAdd=true`);
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
