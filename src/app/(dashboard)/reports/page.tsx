export const dynamic = 'force-dynamic';

import { getProjects } from '@/lib/db';
import ReportsListView from '@/components/reports/ReportsListView';

export default async function ReportsPage() {
  const projects = await getProjects();
  return <ReportsListView projects={projects} />;
}
