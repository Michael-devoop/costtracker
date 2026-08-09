'use client';

import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import QuickAddFAB from '@/components/layout/QuickAddFAB';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen relative z-10">
        <Sidebar />
        <Navbar />
        <main className="md:ml-[var(--sidebar-width)] pt-4 px-4 md:px-8 pb-20 md:pb-12">
          {children}
        </main>
        <BottomNav />
        <QuickAddFAB />
      </div>
    </LanguageProvider>
  );
}
