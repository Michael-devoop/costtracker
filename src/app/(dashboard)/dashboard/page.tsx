export const dynamic = 'force-dynamic';

import { getAllProjectSummaries, getVendors } from '@/lib/db';
import DashboardView from '@/components/dashboard/DashboardView';

export default async function DashboardPage() {
  const [summaries, vendors] = await Promise.all([
    getAllProjectSummaries(),
    getVendors(),
  ]);
  return <DashboardView summaries={summaries} vendorCount={vendors.length} />;
}
