// Revalidate dashboard data every 15 seconds on Vercel (ISR)
export const revalidate = 15;

import { getAllProjectSummaries, getVendors } from '@/lib/db';
import DashboardView from '@/components/dashboard/DashboardView';

export default async function DashboardPage() {
  const [summaries, vendors] = await Promise.all([
    getAllProjectSummaries(),
    getVendors(),
  ]);
  return <DashboardView summaries={summaries} vendorCount={vendors.length} />;
}
